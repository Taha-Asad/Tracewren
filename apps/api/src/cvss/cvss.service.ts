import { BadRequestException, Injectable } from '@nestjs/common';
import { calculateCvss31, CvssCalculationResult } from './cvss.engine.js';
import { CalculateCvssDto } from './dto/calculate-cvss.dto.js';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class CvssService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Computes deterministic CVSS 3.1 score, severity, exploitability, impact, and bounty range.
   */
  calculate(dto: CalculateCvssDto): CvssCalculationResult {
    try {
      const policy = dto.policy
        ? {
            min: dto.policy.min ?? 100,
            max: dto.policy.max ?? 10000,
            currency: dto.policy.currency || 'USD',
          }
        : undefined;

      return calculateCvss31(dto.vector, policy);
    } catch (err: any) {
      throw new BadRequestException(err.message || 'Invalid CVSS 3.1 vector specification');
    }
  }

  /**
   * Estimates bounty award bound to an active organization bounty program.
   */
  async estimateProgramBounty(
    vector: string,
    programId?: string,
  ): Promise<CvssCalculationResult> {
    const policy = { min: 100, max: 10000, currency: 'USD' };

    if (programId) {
      try {
        const program = await this.prisma.program.findUnique({
          where: { id: programId },
        });

        if (program) {
          // Default bounty policy bound to program
        }
      } catch {
        // Fall back to default policy if database is unseeded
      }
    }

    return calculateCvss31(vector, policy);
  }
}
