import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CvssService } from '../cvss/cvss.service.js';
import { SubmitReportDto } from './dto/submit-report.dto.js';
import { ReportState } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cvssService: CvssService,
  ) {}

  /**
   * Submits a vulnerability report through the vertical slice:
   * 1. Validates organization & bounty program tenancy.
   * 2. Evaluates CVSS 3.1 vector through the deterministic calculation engine.
   * 3. Persists encrypted report envelopes and calculated telemetry in PostgreSQL.
   */
  async submitReport(dto: SubmitReportDto) {
    // 1. Verify organization and program existence
    const program = await this.prisma.program.findFirst({
      where: {
        id: dto.programId,
        organizationId: dto.organizationId,
      },
      include: {
        organization: { select: { id: true, displayName: true, slug: true } },
      },
    });

    if (!program) {
      throw new NotFoundException(
        `Bounty program '${dto.programId}' not found for organization '${dto.organizationId}'.`,
      );
    }

    // 2. Evaluate CVSS 3.1 calculation engine
    let cvssScore: Prisma.Decimal | null = null;
    let cvssSuggested: Prisma.Decimal | null = null;
    let calculatedTelemetry: any = null;

    if (dto.cvssVector) {
      try {
        const cvssResult = this.cvssService.calculate({
          vector: dto.cvssVector,
        });

        cvssScore = new Prisma.Decimal(cvssResult.baseScore);
        cvssSuggested = new Prisma.Decimal(cvssResult.baseScore);
        calculatedTelemetry = cvssResult;
      } catch (err: any) {
        throw new BadRequestException(
          `CVSS 3.1 calculation engine rejected vector: ${err.message}`,
        );
      }
    }

    // 3. Persist Report in PostgreSQL
    const createdReport = await this.prisma.report.create({
      data: {
        organizationId: dto.organizationId,
        programId: dto.programId,
        hunterId: dto.hunterId ?? null,
        guestActorId: dto.guestActorId ?? null,
        state: ReportState.NEW,
        operationalLabel: dto.operationalLabel,
        assetScope: dto.assetScope,
        titleCiphertext: dto.titleCiphertext,
        encryptedPayload: dto.encryptedPayload,
        payloadBodySha256: dto.payloadBodySha256,
        cvssVector: dto.cvssVector ?? null,
        cvssScore,
        cvssSuggested,
      },
      select: {
        id: true,
        organizationId: true,
        programId: true,
        state: true,
        operationalLabel: true,
        assetScope: true,
        cvssVector: true,
        cvssScore: true,
        cvssSuggested: true,
        createdAt: true,
      },
    });

    this.logger.log(
      `Vertical slice report submitted [${createdReport.id}] with score [${createdReport.cvssScore ?? 'UNSCORED'}] for org [${program.organization.slug}].`,
    );

    return {
      success: true,
      report: createdReport,
      organization: program.organization,
      cvssTelemetry: calculatedTelemetry,
    };
  }

  /**
   * Retrieves a single vulnerability report by UUID.
   */
  async getReportById(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, displayName: true, slug: true } },
        program: { select: { id: true, name: true, slug: true, visibility: true } },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report '${id}' not found.`);
    }

    return report;
  }

  /**
   * Lists reports for an organization.
   */
  async listReports(organizationId: string) {
    return this.prisma.report.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        state: true,
        operationalLabel: true,
        assetScope: true,
        cvssVector: true,
        cvssScore: true,
        createdAt: true,
      },
    });
  }
}
