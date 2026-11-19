import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BadRequestException, ConflictException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let authService: AuthService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      organization: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      userMembership: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      program: {
        create: vi.fn(),
      },
      programDefender: {
        create: vi.fn(),
      },
      organizationAuditHead: {
        create: vi.fn(),
      },
      auditEvent: {
        create: vi.fn(),
      },
      session: {
        create: vi.fn(),
        findUnique: vi.fn(),
        deleteMany: vi.fn(),
      },
      $executeRawUnsafe: vi.fn().mockResolvedValue(1),
      $transaction: vi.fn(async (cb) => cb(mockPrisma)),
    };

    authService = new AuthService(mockPrisma);
  });

  describe('registerWorkspace', () => {
    it('should successfully register a workspace and owner within an atomic transaction', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.organization.findUnique.mockResolvedValue(null);

      const mockUser = {
        id: 'user-uuid-1',
        email: 'sarah@acme.com',
        fullName: 'Sarah Chen',
        mfaEnabled: true,
        avatarUrl: null,
        createdAt: new Date(),
      };
      const mockOrg = {
        id: 'org-uuid-1',
        name: 'Acme Cyber',
        slug: 'acme-cyber',
        domain: 'acme.com',
        domainVerified: false,
      };
      const mockMembership = { role: 'ORG_OWNER' };
      const mockProgram = { id: 'prog-uuid-1', slug: 'acme-cyber' };
      const mockSession = { id: 'session-uuid-1' };

      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.organization.create.mockResolvedValue(mockOrg);
      mockPrisma.userMembership.create.mockResolvedValue(mockMembership);
      mockPrisma.program.create.mockResolvedValue(mockProgram);
      mockPrisma.session.create.mockResolvedValue(mockSession);

      const result = await authService.registerWorkspace({
        orgName: 'Acme Cyber',
        slug: 'acme-cyber',
        domain: 'acme.com',
        fullName: 'Sarah Chen',
        email: 'sarah@acme.com',
        password: 'SuperSecretPassphrase123!',
        agreedToTerms: true,
      });

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('sarah@acme.com');
      expect(result.memberships[0].role).toBe('ORG_OWNER');
      expect(result.memberships[0].organizationSlug).toBe('acme-cyber');
      expect(result.token).toHaveLength(64); // 32 bytes hex
      expect(mockPrisma.$transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ maxWait: 10000, timeout: 25000 }),
      );
      expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining("SELECT set_config('app.current_tenant_id'"),
      );
    });

    it('should support alias organizationName and organizationSlug when orgName and slug are omitted', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.organization.findUnique.mockResolvedValue(null);

      mockPrisma.user.create.mockResolvedValue({
        id: 'u-1',
        email: 'alex@acme.com',
        fullName: null,
        mfaEnabled: false,
        avatarUrl: null,
        createdAt: new Date(),
      });
      mockPrisma.organization.create.mockResolvedValue({
        id: 'org-1',
        name: 'Alias Org',
        slug: 'alias-org',
        domain: null,
        domainVerified: false,
      });
      mockPrisma.userMembership.create.mockResolvedValue({ role: 'ORG_OWNER' });
      mockPrisma.program.create.mockResolvedValue({ id: 'p-1', slug: 'alias-org' });
      mockPrisma.session.create.mockResolvedValue({ id: 's-1' });

      const result = await authService.registerWorkspace({
        organizationName: 'Alias Org',
        organizationSlug: 'alias-org',
        email: 'alex@acme.com',
        password: 'Passphrase123!',
      });

      expect(result.success).toBe(true);
      expect(result.memberships[0].organizationName).toBe('Alias Org');
    });

    it('should throw BadRequestException if orgName is missing or too short', async () => {
      await expect(
        authService.registerWorkspace({
          orgName: ' ',
          slug: 'valid-slug',
          email: 'test@acme.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when both orgName and organizationName are completely undefined', async () => {
      await expect(
        authService.registerWorkspace({
          orgName: undefined as any,
          organizationName: undefined as any,
          slug: 'valid-slug',
          email: 'test@acme.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if slug is missing or too short', async () => {
      await expect(
        authService.registerWorkspace({
          orgName: 'Valid Org',
          slug: ' ',
          email: 'test@acme.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when both slug and organizationSlug are completely undefined', async () => {
      await expect(
        authService.registerWorkspace({
          orgName: 'Valid Org',
          slug: undefined as any,
          organizationSlug: undefined as any,
          email: 'test@acme.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if work email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-id', email: 'sarah@acme.com' });

      await expect(
        authService.registerWorkspace({
          orgName: 'Acme Cyber',
          slug: 'acme-cyber',
          email: 'sarah@acme.com',
          password: 'Password123!',
          agreedToTerms: true,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if organization slug is taken', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.organization.findUnique.mockImplementation(({ where }: any) => {
        if (where.slug === 'acme-cyber') return Promise.resolve({ id: 'existing-org' });
        return Promise.resolve(null);
      });

      await expect(
        authService.registerWorkspace({
          orgName: 'Acme Cyber',
          slug: 'acme-cyber',
          email: 'sarah@acme.com',
          password: 'Password123!',
          agreedToTerms: true,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if security domain is already registered', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.organization.findUnique.mockImplementation(({ where }: any) => {
        if (where.domain === 'acme.com') return Promise.resolve({ id: 'existing-domain-org' });
        return Promise.resolve(null);
      });

      await expect(
        authService.registerWorkspace({
          orgName: 'Acme Cyber 2',
          slug: 'acme-cyber-2',
          domain: 'acme.com',
          email: 'other@acme.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should authenticate user with valid credentials and return active memberships', async () => {
      const plainPassword = 'CorrectPassword123!';
      const passwordHash = await argon2.hash(plainPassword, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'sarah@acme.com',
        passwordHash,
        mfaEnabled: false,
        fullName: 'Sarah Chen',
        avatarUrl: null,
        createdAt: new Date(),
        memberships: [
          {
            organizationId: 'org-1',
            role: 'ORG_OWNER',
            organization: {
              name: 'Acme Cyber',
              slug: 'acme-cyber',
              domain: 'acme.com',
              domainVerified: true,
            },
          },
        ],
        assignedPrograms: [
          {
            programId: 'prog-1',
            role: 'LEAD_TRIAGER',
            program: { slug: 'acme-cyber' },
          },
        ],
      });

      const result = await authService.login({
        email: 'sarah@acme.com',
        password: plainPassword,
        rememberMe: true,
      });

      expect(result.success).toBe(true);
      if ('token' in result) {
        expect(result.user.email).toBe('sarah@acme.com');
        expect(result.memberships[0].role).toBe('ORG_OWNER');
        expect(result.assignedPrograms[0].role).toBe('LEAD_TRIAGER');
        expect(result.token).toBeDefined();
      }
    });

    it('should reject with UnauthorizedException if password is invalid', async () => {
      const passwordHash = await argon2.hash('ActualPassword123!', {
        type: argon2.argon2id,
      });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'sarah@acme.com',
        passwordHash,
        mfaEnabled: false,
      });

      await expect(
        authService.login({
          email: 'sarah@acme.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject with UnauthorizedException and execute dummy hash on non-existent email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@acme.com',
          password: 'ArbitraryPassword123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should prompt for step-up MFA if mfaEnabled is true and totpCode is omitted', async () => {
      const plainPassword = 'MfaPassword123!';
      const passwordHash = await argon2.hash(plainPassword, { type: argon2.argon2id });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'sarah@acme.com',
        passwordHash,
        mfaEnabled: true,
        totpSecretCipher: 'enc_secret_key',
        memberships: [],
        assignedPrograms: [],
      });

      const result = await authService.login({
        email: 'sarah@acme.com',
        password: plainPassword,
      });

      expect(result.success).toBe(false);
      if ('mfaRequired' in result) {
        expect(result.mfaRequired).toBe(true);
      }
    });

    it('should authenticate successfully when mfaEnabled is true and a valid 6-digit TOTP code is provided', async () => {
      const plainPassword = 'MfaPassword123!';
      const passwordHash = await argon2.hash(plainPassword, { type: argon2.argon2id });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'sarah@acme.com',
        passwordHash,
        mfaEnabled: true,
        totpSecretCipher: 'cipher_secret',
        fullName: 'Sarah Chen',
        avatarUrl: null,
        createdAt: new Date(),
        memberships: [],
        assignedPrograms: [],
      });

      const result = await authService.login({
        email: 'sarah@acme.com',
        password: plainPassword,
        totpCode: '123456',
      });

      expect(result.success).toBe(true);
      if ('token' in result) {
        expect(result.token).toBeDefined();
      }
    });

    it('should reject with UnauthorizedException when TOTP code format is invalid', async () => {
      const plainPassword = 'MfaPassword123!';
      const passwordHash = await argon2.hash(plainPassword, { type: argon2.argon2id });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'sarah@acme.com',
        passwordHash,
        mfaEnabled: true,
        totpSecretCipher: 'cipher_secret',
        memberships: [],
        assignedPrograms: [],
      });

      await expect(
        authService.login({
          email: 'sarah@acme.com',
          password: plainPassword,
          totpCode: 'abc12',
        }),
      ).rejects.toThrow(new UnauthorizedException('Invalid 6-digit TOTP authenticator code.'));
    });

    it('should authenticate successfully when mfaEnabled is true and totpSecretCipher is null', async () => {
      const plainPassword = 'MfaPassword123!';
      const passwordHash = await argon2.hash(plainPassword, { type: argon2.argon2id });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'sarah@acme.com',
        passwordHash,
        mfaEnabled: true,
        totpSecretCipher: null, // Tests line 417: if (!secretCipher) return true;
        fullName: 'Sarah Chen',
        avatarUrl: null,
        createdAt: new Date(),
        memberships: [],
        assignedPrograms: [],
      });

      const result = await authService.login({
        email: 'sarah@acme.com',
        password: plainPassword,
        totpCode: '123456',
      });

      expect(result.success).toBe(true);
      if ('token' in result) {
        expect(result.token).toBeDefined();
      }
    });
  });

  describe('logout', () => {
    it('should delete sessions matching token hash', async () => {
      mockPrisma.session.deleteMany.mockResolvedValue({ count: 1 });

      const result = await authService.logout('sample-session-token');
      expect(result.success).toBe(true);
      expect(mockPrisma.session.deleteMany).toHaveBeenCalledOnce();
    });

    it('should catch DB error during session deletion and still return success', async () => {
      mockPrisma.session.deleteMany.mockRejectedValue(new Error('DB disconnect'));

      const result = await authService.logout('sample-session-token');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Logged out successfully.');
    });
  });

  describe('getCurrentUserProfile', () => {
    it('should return profile summary when user exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'sarah@acme.com',
        fullName: 'Sarah Chen',
        mfaEnabled: false,
        avatarUrl: null,
        createdAt: new Date(),
        memberships: [
          {
            organizationId: 'org-1',
            role: 'ORG_OWNER',
            organization: {
              name: 'Acme',
              slug: 'acme',
              domain: 'acme.com',
              domainVerified: true,
            },
          },
        ],
        assignedPrograms: [
          {
            programId: 'prog-1',
            role: 'LEAD_TRIAGER',
            program: { slug: 'acme' },
          },
        ],
      });

      const profile = await authService.getCurrentUserProfile('user-1');
      expect(profile.user.id).toBe('user-1');
      expect(profile.memberships).toHaveLength(1);
      expect(profile.assignedPrograms).toHaveLength(1);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.getCurrentUserProfile('missing-user')).rejects.toThrow(
        new UnauthorizedException('User profile not found.'),
      );
    });
  });

  describe('createWorkspaceForUser', () => {
    it('should successfully provision a workspace for an authenticated user within an atomic transaction', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'sarah@acme.com',
      });

      mockPrisma.organization.create.mockResolvedValue({
        id: 'org-2',
        name: 'Second Workspace',
        slug: 'second-workspace',
        domain: 'second.com',
        domainVerified: false,
      });

      mockPrisma.userMembership.create.mockResolvedValue({
        role: 'ORG_OWNER',
      });

      mockPrisma.program.create.mockResolvedValue({
        id: 'prog-2',
        slug: 'second-workspace',
      });

      const result = await authService.createWorkspaceForUser('u-1', {
        orgName: 'Second Workspace',
        slug: 'second-workspace',
        domain: 'second.com',
      });

      expect(result.organizationName).toBe('Second Workspace');
      expect(result.role).toBe('ORG_OWNER');
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining("SELECT set_config('app.current_tenant_id'"),
      );
    });

    it('should support alias organizationName and organizationSlug', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'sarah@acme.com',
      });

      mockPrisma.organization.create.mockResolvedValue({
        id: 'org-2',
        name: 'Alias Workspace',
        slug: 'alias-workspace',
        domain: null,
        domainVerified: false,
      });

      mockPrisma.userMembership.create.mockResolvedValue({
        role: 'ORG_OWNER',
      });

      mockPrisma.program.create.mockResolvedValue({
        id: 'prog-2',
        slug: 'alias-workspace',
      });

      const result = await authService.createWorkspaceForUser('u-1', {
        orgName: '',
        slug: '',
        organizationName: 'Alias Workspace',
        organizationSlug: 'alias-workspace',
      });

      expect(result.organizationName).toBe('Alias Workspace');
    });

    it('should throw BadRequestException if orgName is missing or too short', async () => {
      await expect(
        authService.createWorkspaceForUser('u-1', {
          orgName: ' ',
          slug: 'valid-slug',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if slug is missing or too short', async () => {
      await expect(
        authService.createWorkspaceForUser('u-1', {
          orgName: 'Valid Org',
          slug: ' ',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if authenticated user does not exist', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.createWorkspaceForUser('ghost-user', {
          orgName: 'Valid Org',
          slug: 'valid-slug',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ConflictException if workspace slug is taken', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue({ id: 'existing-org' });
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' });

      await expect(
        authService.createWorkspaceForUser('u-1', {
          orgName: 'Acme',
          slug: 'acme-taken',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if domain is already registered', async () => {
      mockPrisma.organization.findUnique
        .mockResolvedValueOnce(null) // slug check
        .mockResolvedValueOnce({ id: 'existing-org' }); // domain check
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' });

      await expect(
        authService.createWorkspaceForUser('u-1', {
          orgName: 'Acme',
          slug: 'acme-new',
          domain: 'registered.com',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('completeOnboarding', () => {
    it('should complete onboarding successfully for an organization owner', async () => {
      const orgId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
      const mockMembership = {
        userId: 'u-1',
        organizationId: orgId,
        role: 'ORG_OWNER',
        organization: { id: orgId, name: 'Acme', slug: 'acme' },
      };
      mockPrisma.userMembership.findUnique.mockResolvedValue(mockMembership);

      const completedAt = new Date();
      mockPrisma.organization.update.mockResolvedValue({
        id: orgId,
        name: 'Acme',
        slug: 'acme',
        domain: 'acme.com',
        domainVerified: true,
        onboardingCompletedAt: completedAt,
      });

      const result = await authService.completeOnboarding('u-1', {
        organizationId: orgId,
        domain: 'acme.com',
        domainVerified: true,
      });

      expect(result.success).toBe(true);
      expect(result.organization.onboardingCompletedAt).toBe(completedAt.toISOString());
      expect(result.organization.domainVerified).toBe(true);
      expect(mockPrisma.organization.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: orgId },
          data: expect.objectContaining({
            domain: 'acme.com',
            domainVerified: true,
          }),
        }),
      );
    });

    it('should throw ForbiddenException if user has no membership or insufficient role', async () => {
      const orgId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
      mockPrisma.userMembership.findUnique.mockResolvedValueOnce(null);

      await expect(
        authService.completeOnboarding('u-ghost', {
          organizationId: orgId,
        }),
      ).rejects.toThrow(ForbiddenException);

      mockPrisma.userMembership.findUnique.mockResolvedValueOnce({
        userId: 'u-guest',
        organizationId: orgId,
        role: 'ORG_MEMBER',
      });

      await expect(
        authService.completeOnboarding('u-guest', {
          organizationId: orgId,
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('verifyDomain', () => {
    it('should confirm domain challenge and update organization domainVerified to true', async () => {
      const orgId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
      mockPrisma.userMembership.findUnique.mockResolvedValue({
        userId: 'u-1',
        organizationId: orgId,
        role: 'ORG_OWNER',
      });
      mockPrisma.organization.update.mockResolvedValue({
        id: orgId,
        domain: 'acme-corp.com',
        domainVerified: true,
      });

      const result = await authService.verifyDomain('u-1', {
        organizationId: orgId,
        domain: 'ACME-CORP.COM  ',
      });

      expect(result.verified).toBe(true);
      expect(result.domain).toBe('acme-corp.com');
      expect(mockPrisma.organization.update).toHaveBeenCalledWith({
        where: { id: orgId },
        data: {
          domain: 'acme-corp.com',
          domainVerified: true,
        },
      });
    });

    it('should throw ForbiddenException if user is not an owner or admin', async () => {
      const orgId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
      mockPrisma.userMembership.findUnique.mockResolvedValue(null);

      await expect(
        authService.verifyDomain('u-ghost', {
          organizationId: orgId,
          domain: 'acme.com',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
