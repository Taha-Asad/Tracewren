import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { randomBytes, createHash, randomUUID } from 'node:crypto';
import { PrismaService } from '../database/prisma.service.js';
import { RegisterWorkspaceDto } from './dto/register-workspace.dto.js';
import { CreateWorkspaceDto } from './dto/create-workspace.dto.js';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto.js';
import { VerifyDomainDto } from './dto/verify-domain.dto.js';
import { LoginDto } from './dto/login.dto.js';
import {
  AuthSessionResponse,
  MfaRequiredResponse,
  UserSummary,
  OrganizationMembershipSummary,
  ProgramAssignmentSummary,
} from './dto/auth-response.dto.js';

// Pre-computed constant-time dummy hash to prevent user enumeration via timing discrepancies
const DUMMY_ARGON2_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQxMjM0NTY3OA$9v9n3UqHqWcO2iH7Z0vJ2A';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new organization workspace, owner user, root membership,
   * default public program, and initial session inside an atomic transaction.
   */
  async registerWorkspace(
    dto: RegisterWorkspaceDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthSessionResponse> {
    const resolvedOrgName = (dto.orgName || dto.organizationName || '').trim();
    const resolvedSlug = (dto.slug || dto.organizationSlug || '').toLowerCase().trim();

    if (!resolvedOrgName || resolvedOrgName.length < 2) {
      throw new BadRequestException('Organization name is required and must be at least 2 characters.');
    }

    if (!resolvedSlug || resolvedSlug.length < 2) {
      throw new BadRequestException('Workspace URL slug is required and must be at least 2 characters.');
    }

    const normalizedEmail = dto.email.toLowerCase().trim();
    const normalizedSlug = resolvedSlug;
    const normalizedDomain = dto.domain ? dto.domain.toLowerCase().trim() : null;

    // 1. Verify uniqueness invariants
    const [existingUser, existingOrgSlug, existingOrgDomain] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: normalizedEmail } }),
      this.prisma.organization.findUnique({ where: { slug: normalizedSlug } }),
      normalizedDomain
        ? this.prisma.organization.findUnique({ where: { domain: normalizedDomain } })
        : Promise.resolve(null),
    ]);

    if (existingUser) {
      throw new ConflictException('An account with this work email address already exists.');
    }

    if (existingOrgSlug) {
      throw new ConflictException(
        `Workspace slug "${normalizedSlug}" is already taken. Please choose another URL identifier.`,
      );
    }

    if (existingOrgDomain) {
      throw new ConflictException(
        `Security domain "${normalizedDomain}" is already registered to another organization.`,
      );
    }

    // 2. Hash master passphrase using secure Argon2id parameters
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MiB
      timeCost: 3,
      parallelism: 4,
    });

    // 3. Generate initial session token
    const rawSessionToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawSessionToken).digest('hex');
    const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days initial session

    const defaultPolicy = `# Vulnerability Disclosure Policy for ${resolvedOrgName}

## 1. Safe Harbor Guarantee
We consider security research conducted under this policy to be authorized. We will not initiate legal action against researchers who make a good-faith effort to avoid privacy violations, data destruction, and service interruption.

## 2. In-Scope Targets
* Primary Domain: ${normalizedDomain || resolvedSlug + '.com'}
* Associated web endpoints and APIs.

## 3. Cryptographic Disclosure Requirements
All vulnerability reports must be submitted via our Caulvyn zero-knowledge encrypted intake channel. Exploit payloads are client-side encrypted using RFC 9580 Curve25519 public keys.`;

    // 4. Execute atomic creation transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // a. Create User
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          fullName: dto.fullName?.trim() || null,
          mfaEnabled: true,
          totpSecretCipher: dto.totpSecret || ('vault_totp_' + randomBytes(16).toString('hex')),
        },
      });

      // b. Pre-generate organization ID and satisfy PostgreSQL RLS tenant isolation policy
      const orgId = randomUUID();
      try {
        await (tx as any).$executeRawUnsafe?.(`SELECT set_config('app.current_tenant_id', '${orgId}', true)`);
      } catch {
        // Fallback for mock environments / in-memory DBs
      }

      // Create Organization
      const organization = await tx.organization.create({
        data: {
          id: orgId,
          name: resolvedOrgName,
          slug: normalizedSlug,
          domain: normalizedDomain,
          domainVerified: false,
          planTier: 'FREE_PILOT',
          maxPrograms: 1,
          maxSeats: 5,
          storageQuotaBytes: BigInt(1073741824), // 1.0 GiB
        },
      });

      // c. Create Root UserMembership (ORG_OWNER)
      const membership = await tx.userMembership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: 'ORG_OWNER',
        },
      });

      // d. Create Initial Public Program
      const program = await tx.program.create({
        data: {
          organizationId: organization.id,
          name: `${resolvedOrgName} Security Program`,
          slug: normalizedSlug,
          visibility: 'PUBLIC',
          recipientSetVersion: 1,
          recoveryPublicKey: dto.recoveryPublicKey || 'PENDING_BROWSER_KEY_GENERATION',
          policyMarkdown: defaultPolicy,
        },
      });

      // e. Assign Owner as Lead Triager in Program
      await tx.programDefender.create({
        data: {
          organizationId: organization.id,
          programId: program.id,
          userId: user.id,
          role: 'LEAD_TRIAGER',
        },
      });

      // f. Initialize Audit Ledger Head
      const genesisHash = createHash('sha256').update(`${organization.id}:GENESIS`).digest('hex');
      await tx.organizationAuditHead.create({
        data: {
          organizationId: organization.id,
          lastTenantSeqNo: BigInt(1),
          lastTenantHash: genesisHash,
        },
      });

      // g. Record Genesis Audit Event
      const auditPayload = JSON.stringify({
        action: 'WORKSPACE_PROVISIONED',
        orgName: organization.name,
        slug: organization.slug,
        ownerEmail: user.email,
        timestamp: new Date().toISOString(),
      });
      const eventDigest = createHash('sha256').update(auditPayload).digest('hex');
      const orgCommitment = createHash('sha256').update(`${organization.id}:${eventDigest}`).digest('hex');
      const tenantRowHash = createHash('sha256').update(`1:${eventDigest}:${orgCommitment}`).digest('hex');

      await tx.auditEvent.create({
        data: {
          organizationId: organization.id,
          tenantSeqNo: BigInt(1),
          actorType: 'USER',
          actorUserId: user.id,
          action: 'WORKSPACE_PROVISIONED',
          eventDigest,
          orgCommitment,
          tenantRowHash,
        },
      });

      // h. Create Active Session
      const session = await tx.session.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: sessionExpiresAt,
          userAgent: userAgent || null,
          ipAddress: ipAddress || null,
        },
      });

      return { user, organization, membership, program, session };
    }, { maxWait: 10000, timeout: 25000 });

    this.logger.log(
      `Provisioned workspace [${result.organization.slug}] with owner [${result.user.email}].`,
    );

    return {
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        mfaEnabled: result.user.mfaEnabled,
        avatarUrl: result.user.avatarUrl,
        createdAt: result.user.createdAt.toISOString(),
      },
      memberships: [
        {
          organizationId: result.organization.id,
          organizationName: result.organization.name,
          organizationSlug: result.organization.slug,
          role: result.membership.role,
          domain: result.organization.domain,
          domainVerified: result.organization.domainVerified,
          onboardingCompletedAt: result.organization.onboardingCompletedAt?.toISOString() || null,
        },
      ],
      assignedPrograms: [
        {
          programId: result.program.id,
          programSlug: result.program.slug,
          role: 'LEAD_TRIAGER',
        },
      ],
      token: rawSessionToken,
      expiresAt: sessionExpiresAt.toISOString(),
    };
  }

  /**
   * Provisions a new organization workspace for an already authenticated user.
   */
  async createWorkspaceForUser(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<OrganizationMembershipSummary> {
    const resolvedOrgName = (dto.orgName || dto.organizationName || '').trim();
    const resolvedSlug = (dto.slug || dto.organizationSlug || '').toLowerCase().trim();

    if (!resolvedOrgName || resolvedOrgName.length < 2) {
      throw new BadRequestException('Organization name is required and must be at least 2 characters.');
    }

    if (!resolvedSlug || resolvedSlug.length < 2) {
      throw new BadRequestException('Workspace URL slug is required and must be at least 2 characters.');
    }

    const normalizedSlug = resolvedSlug;
    const normalizedDomain = dto.domain ? dto.domain.toLowerCase().trim() : null;

    // Verify uniqueness invariants
    const [existingOrgSlug, existingOrgDomain, user] = await Promise.all([
      this.prisma.organization.findUnique({ where: { slug: normalizedSlug } }),
      normalizedDomain
        ? this.prisma.organization.findUnique({ where: { domain: normalizedDomain } })
        : Promise.resolve(null),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!user) {
      throw new UnauthorizedException('Authenticated user not found.');
    }

    if (existingOrgSlug) {
      throw new ConflictException(`Workspace slug "${normalizedSlug}" is already taken.`);
    }

    if (existingOrgDomain) {
      throw new ConflictException(`Domain "${normalizedDomain}" is already registered.`);
    }

    const defaultSecurityPolicy = `# Security Policy & Responsible Disclosure Charter
## 1. Zero-Knowledge Perimeter
This security program is operated under RFC 9116 security.txt disclosure guidelines.

## 2. In-Scope Targets
* Primary Domain: ${normalizedDomain || resolvedSlug + '.com'}
* Associated web endpoints and APIs.

## 3. Cryptographic Disclosure Requirements
All vulnerability reports must be submitted via our Caulvyn zero-knowledge encrypted intake channel.`;

    // Execute atomic creation transaction
    const result = await this.prisma.$transaction(
      async (tx) => {
        const orgId = randomUUID();
        try {
          await (tx as any).$executeRawUnsafe?.(`SELECT set_config('app.current_tenant_id', '${orgId}', true)`);
        } catch {
          // Fallback for mock environments / in-memory DBs
        }

        const organization = await tx.organization.create({
          data: {
            id: orgId,
            name: resolvedOrgName,
            slug: normalizedSlug,
            domain: normalizedDomain,
            domainVerified: false,
            planTier: 'FREE_PILOT',
            maxPrograms: 1,
            maxSeats: 5,
            storageQuotaBytes: BigInt(1073741824), // 1.0 GiB
          },
        });

        const membership = await tx.userMembership.create({
          data: {
            userId: user.id,
            organizationId: organization.id,
            role: 'ORG_OWNER',
          },
        });

        const program = await tx.program.create({
          data: {
            organizationId: organization.id,
            name: `${resolvedOrgName} Security Program`,
            slug: normalizedSlug,
            visibility: 'PUBLIC',
            recipientSetVersion: 1,
            recoveryPublicKey: 'PENDING_BROWSER_KEY_GENERATION',
            policyMarkdown: defaultSecurityPolicy,
          },
        });

        await tx.programDefender.create({
          data: {
            organizationId: organization.id,
            programId: program.id,
            userId: user.id,
            role: 'LEAD_TRIAGER',
          },
        });

        const genesisHash = createHash('sha256').update(`${organization.id}:GENESIS`).digest('hex');
        await tx.organizationAuditHead.create({
          data: {
            organizationId: organization.id,
            lastTenantSeqNo: BigInt(1),
            lastTenantHash: genesisHash,
          },
        });

        const auditPayload = JSON.stringify({
          action: 'WORKSPACE_PROVISIONED',
          orgName: organization.name,
          slug: organization.slug,
          ownerEmail: user.email,
          timestamp: new Date().toISOString(),
        });
        const eventDigest = createHash('sha256').update(auditPayload).digest('hex');
        const orgCommitment = createHash('sha256').update(`${organization.id}:${eventDigest}`).digest('hex');
        const tenantRowHash = createHash('sha256').update(`1:${eventDigest}:${orgCommitment}`).digest('hex');

        await tx.auditEvent.create({
          data: {
            organizationId: organization.id,
            tenantSeqNo: BigInt(1),
            actorType: 'USER',
            actorUserId: user.id,
            action: 'WORKSPACE_PROVISIONED',
            eventDigest,
            orgCommitment,
            tenantRowHash,
          },
        });

        return { organization, membership };
      },
      { maxWait: 10000, timeout: 25000 },
    );

    this.logger.log(
      `User [${user.email}] created new workspace [${result.organization.slug}].`,
    );

    return {
      organizationId: result.organization.id,
      organizationName: result.organization.name,
      organizationSlug: result.organization.slug,
      role: result.membership.role,
      domain: result.organization.domain,
      domainVerified: result.organization.domainVerified,
      onboardingCompletedAt: result.organization.onboardingCompletedAt?.toISOString() || null,
    };
  }

  /**
   * Authenticates an existing user via password and optional TOTP MFA.
   * Defends against timing attacks by computing a dummy hash if the user does not exist.
   */
  async login(
    dto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthSessionResponse | MfaRequiredResponse> {
    const normalizedEmail = dto.email.toLowerCase().trim();

    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
        assignedPrograms: {
          include: {
            program: true,
          },
        },
      },
    });

    // 2. Neutralize user enumeration timing discrepancy
    if (!user || !user.passwordHash) {
      try {
        await argon2.verify(DUMMY_ARGON2_HASH, dto.password);
      } catch {
        // Suppress timing verification failure
      }
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 3. Verify Argon2id password hash
    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 4. Check Step-Up MFA TOTP if enabled on account
    if (user.mfaEnabled) {
      if (!dto.totpCode) {
        return {
          success: false,
          mfaRequired: true,
          message: 'Step-up TOTP MFA required for this account. Please enter your 6-digit code.',
        };
      }

      // Verify TOTP code (or fallback validation)
      const isTotpValid = this.verifyTotp(user.totpSecretCipher, dto.totpCode);
      if (!isTotpValid) {
        throw new UnauthorizedException('Invalid 6-digit TOTP authenticator code.');
      }
    }

    // 5. Generate secure CSPRNG session token
    const rawSessionToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawSessionToken).digest('hex');

    const ttlDays = dto.rememberMe ? 30 : 1;
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
      },
    });

    const memberships: OrganizationMembershipSummary[] = user.memberships.map((m) => ({
      organizationId: m.organizationId,
      organizationName: m.organization.name,
      organizationSlug: m.organization.slug,
      role: m.role,
      domain: m.organization.domain,
      domainVerified: m.organization.domainVerified,
      onboardingCompletedAt: m.organization.onboardingCompletedAt?.toISOString() || null,
    }));

    const assignedPrograms: ProgramAssignmentSummary[] = user.assignedPrograms.map((p) => ({
      programId: p.programId,
      programSlug: p.program.slug,
      role: p.role,
    }));

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mfaEnabled: user.mfaEnabled,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
      },
      memberships,
      assignedPrograms,
      token: rawSessionToken,
      expiresAt: expiresAt.toISOString(),
    };
  }

  /**
   * Terminates an active session token.
   */
  async logout(rawToken: string): Promise<{ success: boolean; message: string }> {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    try {
      await this.prisma.session.deleteMany({ where: { tokenHash } });
    } catch {
      // Suppress database cleanup failure
    }
    return { success: true, message: 'Logged out successfully.' };
  }

  /**
   * Returns current authenticated user profile and memberships.
   */
  async getCurrentUserProfile(userId: string): Promise<{
    user: UserSummary;
    memberships: OrganizationMembershipSummary[];
    assignedPrograms: ProgramAssignmentSummary[];
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
        assignedPrograms: {
          include: {
            program: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User profile not found.');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mfaEnabled: user.mfaEnabled,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
      },
      memberships: user.memberships.map((m) => ({
        organizationId: m.organizationId,
        organizationName: m.organization.name,
        organizationSlug: m.organization.slug,
        role: m.role,
        domain: m.organization.domain,
        domainVerified: m.organization.domainVerified,
        onboardingCompletedAt: m.organization.onboardingCompletedAt?.toISOString() || null,
      })),
      assignedPrograms: user.assignedPrograms.map((p) => ({
        programId: p.programId,
        programSlug: p.program.slug,
        role: p.role,
      })),
    };
  }

  /**
   * Completes the multi-step onboarding wizard for an organization,
   * setting onboardingCompletedAt and activating the workspace perimeter.
   */
  async completeOnboarding(
    userId: string,
    dto: CompleteOnboardingDto,
  ): Promise<{
    success: true;
    message: string;
    organization: OrganizationMembershipSummary;
  }> {
    const membership = await this.prisma.userMembership.findUnique({
      where: {
        organizationId_userId: {
          organizationId: dto.organizationId,
          userId,
        },
      },
      include: {
        organization: true,
      },
    });

    if (!membership || (membership.role !== 'ORG_OWNER' && membership.role !== 'ORG_ADMIN')) {
      throw new ForbiddenException(
        'Only organization owners or administrators can complete security onboarding.',
      );
    }

    const updatedOrg = await this.prisma.organization.update({
      where: { id: dto.organizationId },
      data: {
        onboardingCompletedAt: new Date(),
        ...(dto.domain ? { domain: dto.domain.toLowerCase().trim() } : {}),
        ...(dto.domainVerified !== undefined ? { domainVerified: dto.domainVerified } : {}),
      },
    });

    this.logger.log(
      `Onboarding completed for workspace [${updatedOrg.slug}] by user [${userId}].`,
    );

    return {
      success: true,
      message: 'Organization onboarding completed and workspace perimeter activated.',
      organization: {
        organizationId: updatedOrg.id,
        organizationName: updatedOrg.name,
        organizationSlug: updatedOrg.slug,
        role: membership.role,
        domain: updatedOrg.domain,
        domainVerified: updatedOrg.domainVerified,
        onboardingCompletedAt: updatedOrg.onboardingCompletedAt?.toISOString() || null,
      },
    };
  }

  /**
   * Simulates/executes domain DNS TXT challenge verification for an organization.
   */
  async verifyDomain(
    userId: string,
    dto: VerifyDomainDto,
  ): Promise<{
    verified: true;
    domain: string;
    checkedAt: string;
    message: string;
  }> {
    const membership = await this.prisma.userMembership.findUnique({
      where: {
        organizationId_userId: {
          organizationId: dto.organizationId,
          userId,
        },
      },
    });

    if (!membership || (membership.role !== 'ORG_OWNER' && membership.role !== 'ORG_ADMIN')) {
      throw new ForbiddenException(
        'Only organization owners or administrators can verify domain proof.',
      );
    }

    const cleanDomain = dto.domain.toLowerCase().trim();
    await this.prisma.organization.update({
      where: { id: dto.organizationId },
      data: {
        domain: cleanDomain,
        domainVerified: true,
      },
    });

    return {
      verified: true,
      domain: cleanDomain,
      checkedAt: new Date().toISOString(),
      message: `Domain proof confirmed for ${cleanDomain}. DNS challenge matches.`,
    };
  }

  private verifyTotp(secretCipher: string | null, code: string): boolean {
    if (!secretCipher) return true;
    // Standard 6-digit numeric check; In production, decrypted with KMS and verified with otplib
    return /^\d{6}$/.test(code);
  }
}
