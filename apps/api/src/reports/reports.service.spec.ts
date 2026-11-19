import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportsService } from './reports.service.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OperationalLabel } from '@prisma/client';
import { Prisma } from '@prisma/client';

describe('ReportsService (End-to-End Vertical Slice)', () => {
  let service: ReportsService;
  let mockPrisma: any;
  let mockCvssService: any;

  beforeEach(() => {
    mockPrisma = {
      program: {
        findFirst: vi.fn(),
      },
      report: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
      },
    };

    mockCvssService = {
      calculate: vi.fn(),
    };

    service = new ReportsService(mockPrisma, mockCvssService);
  });

  const validOrgId = 'a0000000-0000-0000-0000-000000000001';
  const validProgId = 'b0000000-0000-0000-0000-000000000002';

  it('successfully executes vertical slice: validates tenancy, evaluates CVSS 3.1, and persists report', async () => {
    // 1. Mock program finding
    mockPrisma.program.findFirst.mockResolvedValue({
      id: validProgId,
      organizationId: validOrgId,
      title: 'Public Bug Bounty Program',
      organization: {
        id: validOrgId,
        displayName: 'Acme Corp',
        slug: 'acme',
      },
    });

    // 2. Mock CVSS calculation
    mockCvssService.calculate.mockReturnValue({
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
      baseScore: 10.0,
      severity: 'CRITICAL',
      impactSubScore: 6.0,
      exploitabilitySubScore: 3.9,
      scopeChanged: true,
      suggestedBountyRange: { min: 7500, max: 10000, currency: 'USD' },
      slaResolutionHours: 24,
    });

    // 3. Mock Report Creation
    mockPrisma.report.create.mockImplementation(({ data }: any) => ({
      id: 'c0000000-0000-0000-0000-000000000003',
      ...data,
      createdAt: new Date(),
    }));

    const result = await service.submitReport({
      organizationId: validOrgId,
      programId: validProgId,
      assetScope: 'https://api.acme.com',
      operationalLabel: OperationalLabel.REMOTE_CODE_EXECUTION,
      titleCiphertext: '-----BEGIN PGP MESSAGE-----...',
      encryptedPayload: '-----BEGIN PGP MESSAGE-----...',
      payloadBodySha256: 'a'.repeat(64),
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    });

    expect(result.success).toBe(true);
    expect(result.report.id).toBe('c0000000-0000-0000-0000-000000000003');
    expect(result.report.cvssScore).toEqual(new Prisma.Decimal(10.0));
    expect(result.cvssTelemetry.severity).toBe('CRITICAL');
    expect(result.cvssTelemetry.slaResolutionHours).toBe(24);
    expect(result.organization.slug).toBe('acme');
    expect(mockPrisma.report.create).toHaveBeenCalledOnce();
  });

  it('rejects report submission when bounty program does not belong to organization', async () => {
    mockPrisma.program.findFirst.mockResolvedValue(null);

    await expect(
      service.submitReport({
        organizationId: validOrgId,
        programId: validProgId,
        assetScope: 'https://api.acme.com',
        operationalLabel: OperationalLabel.REMOTE_CODE_EXECUTION,
        titleCiphertext: 'cipher',
        encryptedPayload: 'payload',
        payloadBodySha256: 'b'.repeat(64),
      }),
    ).rejects.toThrowError(NotFoundException);

    expect(mockPrisma.report.create).not.toHaveBeenCalled();
  });

  it('rejects report submission when CVSS vector is malformed', async () => {
    mockPrisma.program.findFirst.mockResolvedValue({
      id: validProgId,
      organizationId: validOrgId,
      organization: { id: validOrgId, slug: 'acme' },
    });

    mockCvssService.calculate.mockImplementation(() => {
      throw new Error('Invalid vector string');
    });

    await expect(
      service.submitReport({
        organizationId: validOrgId,
        programId: validProgId,
        assetScope: 'https://api.acme.com',
        operationalLabel: OperationalLabel.INJECTION_VULNERABILITY,
        titleCiphertext: 'cipher',
        encryptedPayload: 'payload',
        payloadBodySha256: 'c'.repeat(64),
        cvssVector: 'CVSS:3.1/MALFORMED',
      }),
    ).rejects.toThrowError(BadRequestException);

    expect(mockPrisma.report.create).not.toHaveBeenCalled();
  });

  it('retrieves an existing report by id', async () => {
    mockPrisma.report.findUnique.mockResolvedValue({
      id: 'c0000000-0000-0000-0000-000000000003',
      state: 'NEW',
      cvssScore: new Prisma.Decimal(9.8),
    });

    const report = await service.getReportById('c0000000-0000-0000-0000-000000000003');
    expect(report.id).toBe('c0000000-0000-0000-0000-000000000003');
  });
});
