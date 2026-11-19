import { Injectable, Logger } from '@nestjs/common';
import { randomBytes, createHash, randomUUID } from 'crypto';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import { PrismaService } from '../database/prisma.service.js';
import { SendInvitationDto } from './dto/send-invitation.dto.js';

export interface EmailDispatchRecord {
  id: string;
  recipientEmail: string;
  eventType: string;
  subject: string;
  payload: Record<string, any>;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly inMemoryOutbox: EmailDispatchRecord[] = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Dispatches a program invitation email with a cryptographic onboarding token
   * and records it in the Notification Outbox (FR-1.5, Class A metadata).
   *
   * If the invitee is already an active user on the platform, automatically links
   * them to the target organization and program as an active Defender/Triager.
   *
   * If live SMTP relay credentials exist in the environment (SMTP_HOST or GMAIL_USER),
   * transmits the actual email via RFC 5322 transport.
   */
  async sendProgramInvitation(dto: SendInvitationDto): Promise<{
    success: boolean;
    outboxId: string;
    recipient: string;
    programName: string;
    role: string;
    inviteToken: string;
    sentAt: string;
    onboardingUrl: string;
    directAccepted: boolean;
    smtpSent: boolean;
    message: string;
  }> {
    const rawToken = randomBytes(24).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const sentAt = new Date().toISOString();
    const outboxId = randomUUID();
    const normalizedEmail = dto.email.toLowerCase().trim();

    const inviter = dto.inviterName || 'Workspace Security Team';
    const inviterEmail = dto.inviterEmail || 'tahaasad709@gmail.com';
    const appBaseUrl = process.env.APP_URL || 'http://localhost:3000';

    // 1. Resolve Organization & Program IDs
    let orgId = dto.organizationId;
    let programId: string | undefined;

    try {
      if (this.prisma.program) {
        const foundProg = await this.prisma.program.findFirst({
          where: {
            OR: [
              { slug: dto.programSlug || undefined },
              { name: dto.programName || undefined },
            ],
          },
          select: { id: true, organizationId: true, name: true, slug: true },
        });
        if (foundProg) {
          programId = foundProg.id;
          if (!orgId) orgId = foundProg.organizationId;
        }
      }
    } catch {
      // Suppress lookup errors
    }

    if (!orgId && this.prisma.organization) {
      try {
        const firstOrg = await this.prisma.organization.findFirst({ select: { id: true } });
        orgId = firstOrg?.id;
      } catch {
        // Suppress lookup errors
      }
    }

    // 2. Check if the recipient is an already-registered defender on this platform
    let directAccepted = false;
    try {
      if (this.prisma.user && orgId) {
        const existingUser = await this.prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (existingUser) {
          const defenderRole =
            dto.role === 'LEAD_TRIAGER'
              ? 'LEAD_TRIAGER'
              : dto.role === 'REVIEWER'
              ? 'REVIEWER'
              : dto.role === 'REMEDIATOR'
              ? 'REMEDIATOR'
              : 'TRIAGER';

          // Ensure organization membership
          if (this.prisma.userMembership) {
            await this.prisma.userMembership.upsert({
              where: {
                organizationId_userId: {
                  organizationId: orgId,
                  userId: existingUser.id,
                },
              },
              update: { role: 'ORG_DEFENDER', status: 'ACTIVE' },
              create: {
                organizationId: orgId,
                userId: existingUser.id,
                role: 'ORG_DEFENDER',
                status: 'ACTIVE',
              },
            });
          }

          // Assign to Program Defenders if program exists
          if (programId && this.prisma.programDefender) {
            await this.prisma.programDefender.upsert({
              where: {
                programId_userId: {
                  programId,
                  userId: existingUser.id,
                },
              },
              update: { role: defenderRole as any, isActive: true },
              create: {
                organizationId: orgId,
                programId,
                userId: existingUser.id,
                role: defenderRole as any,
                isActive: true,
              },
            });
          }

          directAccepted = true;
          this.logger.log(
            `[EMAIL SERVICE] User [${dto.email}] is already registered: auto-assigned as [${defenderRole}] to program [${dto.programName}].`,
          );
        }
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not auto-link defender: ${err instanceof Error ? err.message : String(err)}`);
    }

    const landingOrgParam = orgId ? `&orgId=${orgId}` : '';
    const onboardingUrl = `${appBaseUrl}/onboarding?token=${rawToken}${landingOrgParam}&role=${encodeURIComponent(dto.role)}&program=${encodeURIComponent(dto.programName)}`;
    const workspaceDirectUrl = `${appBaseUrl}/workspace?${orgId ? `orgId=${orgId}&` : ''}role=${encodeURIComponent(dto.role)}`;
    const effectiveActionUrl = directAccepted ? workspaceDirectUrl : onboardingUrl;

    const emailSubject = directAccepted
      ? `[BugBountyTrack] You have been added to "${dto.programName}" as ${dto.role}`
      : `[BugBountyTrack] You have been invited to join "${dto.programName}" as ${dto.role}`;

    // 3. Persist ProgramInvitation record
    if (orgId && programId && this.prisma.programInvitation) {
      try {
        await this.prisma.programInvitation.create({
          data: {
            organizationId: orgId,
            programId,
            tokenHash,
            inviteeEmail: normalizedEmail,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            acceptedAt: directAccepted ? new Date() : null,
          },
        });
      } catch (err: unknown) {
        this.logger.warn(`Could not save ProgramInvitation: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // 4. Attempt real SMTP delivery via EJS template if credentials exist in environment
    const buttonLabel = directAccepted ? `Open Workspace as ${dto.role}` : 'Accept Invitation & Initialize Keys';
    const textBody = directAccepted
      ? `You have been added to "${dto.programName}" as ${dto.role} by ${inviter}.\n\nAccess the workspace immediately:\n${effectiveActionUrl}`
      : `You have been invited to join "${dto.programName}" as ${dto.role} by ${inviter}.\n\nAccept your invitation and configure your triage keys here:\n${effectiveActionUrl}`;

    const smtpSent = await this.sendTemplatedMail({
      to: dto.email,
      fromName: inviter,
      replyTo: inviterEmail,
      subject: emailSubject,
      text: textBody,
      templateName: 'program-invitation',
      templateData: {
        subject: emailSubject,
        directAccepted,
        programName: dto.programName,
        role: dto.role,
        inviter,
        inviterEmail,
        effectiveActionUrl,
        buttonLabel,
        outboxId,
        sentAt,
      },
    });

    // 5. Persist to NotificationOutbox
    const payload = {
      action: 'PROGRAM_INVITATION_DISPATCHED',
      recipientEmail: dto.email,
      programName: dto.programName,
      programSlug: dto.programSlug || 'primary-program',
      role: dto.role,
      inviterName: inviter,
      inviterEmail,
      tokenHash,
      onboardingUrl: effectiveActionUrl,
      directWorkspaceUrl: workspaceDirectUrl,
      directAccepted,
      smtpSent,
      timestamp: sentAt,
      transport: smtpSent ? 'RFC 5322 SMTP Live Delivery' : 'RFC 5322 SMTP / Outbox Dispatcher',
    };

    if (orgId && this.prisma.notificationOutbox) {
      try {
        await this.prisma.notificationOutbox.create({
          data: {
            id: outboxId,
            organizationId: orgId,
            eventType: 'PROGRAM_INVITATION',
            recipientEmail: dto.email,
            payloadJson: JSON.stringify(payload),
            status: 'SENT',
            sentAt: new Date(),
          },
        });
      } catch (err: unknown) {
        this.logger.warn(`Could not persist to DB NotificationOutbox: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // 6. In-memory record
    const record: EmailDispatchRecord = {
      id: outboxId,
      recipientEmail: dto.email,
      eventType: 'PROGRAM_INVITATION',
      subject: emailSubject,
      payload,
      status: 'SENT',
      sentAt,
    };
    this.inMemoryOutbox.unshift(record);

    const message = directAccepted
      ? `User ${dto.email} is an existing defender on this site and was instantly assigned to "${dto.programName}" as ${dto.role}!`
      : smtpSent
      ? `Invitation email delivered directly to ${dto.email} via live SMTP relay.`
      : `Invitation dispatched and recorded for ${dto.email}.`;

    return {
      success: true,
      outboxId,
      recipient: dto.email,
      programName: dto.programName,
      role: dto.role,
      inviteToken: rawToken,
      sentAt,
      onboardingUrl: effectiveActionUrl,
      directAccepted,
      smtpSent,
      message,
    };
  }

  /**
   * Retrieves recent dispatched email notifications from the outbox.
   */
  async getOutboxMessages(limit = 20): Promise<EmailDispatchRecord[]> {
    try {
      if (this.prisma.notificationOutbox) {
        const dbRecords = await this.prisma.notificationOutbox.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
        });

        if (dbRecords && dbRecords.length > 0) {
          return dbRecords.map((r) => ({
            id: r.id,
            recipientEmail: r.recipientEmail,
            eventType: r.eventType,
            subject: `[Notification] ${r.eventType}`,
            payload: JSON.parse(r.payloadJson || '{}'),
            status: r.status as any,
            sentAt: r.sentAt ? r.sentAt.toISOString() : r.createdAt.toISOString(),
          }));
        }
      }
    } catch {
      // Fallback to in-memory
    }

    return this.inMemoryOutbox.slice(0, limit);
  }

  /**
   * Resolves SMTP transport configuration from environment variables,
   * supporting EMAIL_* (primary) as well as legacy SMTP_* and GMAIL_* keys.
   */
  getSmtpConfig(): { host: string; port: number; user: string; pass: string; secure: boolean } | null {
    const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
    const rawPort = process.env.EMAIL_PORT || process.env.SMTP_PORT || '587';
    const port = parseInt(rawPort, 10) || 587;
    const user = process.env.EMAIL_USER || process.env.SMTP_USER || process.env.GMAIL_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (!host || !user || !pass) return null;
    return { host, port, user, pass, secure: port === 465 };
  }

  /**
   * Locates an EJS template across both compiled dist/ and source src/ directories.
   */
  resolveTemplatePath(templateName: string): string {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const candidates = [
      join(currentDir, 'templates', `${templateName}.ejs`),
      join(process.cwd(), 'src', 'email', 'templates', `${templateName}.ejs`),
      join(process.cwd(), 'dist', 'email', 'templates', `${templateName}.ejs`),
    ];
    for (const candidate of candidates) {
      if (existsSync(candidate)) return candidate;
    }
    throw new Error(`Email template "${templateName}.ejs" not found.`);
  }

  /**
   * Renders an EJS email template with the provided context variables.
   */
  async renderTemplate(templateName: string, data: Record<string, unknown>): Promise<string> {
    const templatePath = this.resolveTemplatePath(templateName);
    return ejs.renderFile(templatePath, data);
  }

  /**
   * Renders an EJS template and dispatches it over Nodemailer SMTP when configured.
   */
  async sendTemplatedMail(options: {
    to: string;
    subject: string;
    text: string;
    templateName: string;
    templateData: Record<string, unknown>;
    fromName?: string;
    replyTo?: string;
  }): Promise<boolean> {
    const smtp = this.getSmtpConfig();
    if (!smtp) {
      this.logger.log(
        `[EMAIL SERVICE] No SMTP relay configured (set EMAIL_HOST, EMAIL_USER, EMAIL_PASS). Skipping live dispatch for [${options.to}].`,
      );
      return false;
    }

    try {
      const html = await this.renderTemplate(options.templateName, options.templateData);
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
      });

      const fromHeader = options.fromName ? `"${options.fromName}" <${smtp.user}>` : smtp.user;
      await transporter.sendMail({
        from: fromHeader,
        to: options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        text: options.text,
        html,
      });

      this.logger.log(`[EMAIL SERVICE] Live SMTP email delivered to [${options.to}] via ${smtp.host}:${smtp.port}.`);
      return true;
    } catch (err: unknown) {
      this.logger.error(`Live SMTP dispatch failed: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }
}
