import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import nodemailer from 'nodemailer';
import { EmailService } from './email.service.js';
import { EmailController } from './email.controller.js';
import { PrismaService } from '../database/prisma.service.js';

describe('EmailService & EmailController', () => {
  let service: EmailService;
  let controller: EmailController;
  const originalEnv = { ...process.env };

  const mockPrismaService = {
    organization: {
      findFirst: vi.fn().mockResolvedValue({ id: 'org-test-uuid' }),
    },
    notificationOutbox: {
      create: vi.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findMany: vi.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    delete process.env.EMAIL_HOST;
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
    delete process.env.SMTP_HOST;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        EmailService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    controller = module.get<EmailController>(EmailController);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('should dispatch program invitation email and record in outbox', async () => {
    const result = await controller.sendInvitation({
      email: 'alex@northstar.example',
      role: 'TRIAGER',
      programName: 'Acme Core Security',
    });

    expect(result.success).toBe(true);
    expect(result.recipient).toBe('alex@northstar.example');
    expect(result.role).toBe('TRIAGER');
    expect(result.inviteToken).toBeDefined();
    expect(result.outboxId).toBeDefined();
    expect(result.message).toContain('alex@northstar.example');
  });

  it('should retrieve outbox messages', async () => {
    await controller.sendInvitation({
      email: 'elena@audit.example',
      role: 'REVIEWER',
      programName: 'Acme Core Security',
    });

    const outbox = await controller.getOutbox('10');
    expect(outbox.length).toBeGreaterThan(0);
    expect(outbox[0].recipientEmail).toBe('elena@audit.example');
  });

  it('should render the EJS program-invitation template with escaped context', async () => {
    const html = await service.renderTemplate('program-invitation', {
      subject: 'Invite Test',
      directAccepted: false,
      programName: 'Taha Security <Scope>',
      role: 'LEAD_TRIAGER',
      inviter: 'Taha Asadullah',
      inviterEmail: 'tahaasad709@gmail.com',
      effectiveActionUrl: 'http://localhost:3000/onboarding?token=abc',
      buttonLabel: 'Accept Invitation',
      outboxId: 'outbox-123',
      sentAt: '2026-11-19T00:00:00Z',
    });

    expect(html).toContain('Security Triage Invitation');
    expect(html).toContain('Taha Security &lt;Scope&gt;');
    expect(html).toContain('LEAD_TRIAGER');
    expect(html).toContain('http://localhost:3000/onboarding?token=abc');
    expect(html).toContain('outbox-123');
  });

  it('should read EMAIL_* env vars and dispatch rendered EJS via nodemailer', async () => {
    process.env.EMAIL_HOST = 'smtp.gmail.com';
    process.env.EMAIL_PORT = '465';
    process.env.EMAIL_USER = 'sender@example.com';
    process.env.EMAIL_PASS = 'app-secret';

    const sendMailMock = vi.fn().mockResolvedValue({ messageId: 'msg-1' });
    const createTransportSpy = vi
      .spyOn(nodemailer, 'createTransport')
      .mockReturnValue({ sendMail: sendMailMock } as any);

    const result = await controller.sendInvitation({
      email: 'triager@example.com',
      role: 'TRIAGER',
      programName: 'Taha Security Program',
    });

    expect(result.smtpSent).toBe(true);
    expect(createTransportSpy).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: 'sender@example.com', pass: 'app-secret' },
    });
    expect(sendMailMock).toHaveBeenCalledOnce();
    const mailArgs = sendMailMock.mock.calls[0][0];
    expect(mailArgs.to).toBe('triager@example.com');
    expect(mailArgs.html).toContain('Taha Security Program');
    expect(mailArgs.html).toContain('Accept Invitation &amp; Initialize Keys');
  });
});
