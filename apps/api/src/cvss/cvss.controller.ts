import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CvssService } from './cvss.service.js';
import { CalculateCvssDto } from './dto/calculate-cvss.dto.js';
import { Public } from '../auth/decorators/public.decorator.js';

@Controller('cvss')
export class CvssController {
  constructor(private readonly cvssService: CvssService) {}

  /**
   * Public Endpoint: Evaluates CVSS 3.1 vector string with deterministic sub-score telemetry.
   */
  @Public()
  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  calculate(@Body() dto: CalculateCvssDto) {
    return this.cvssService.calculate(dto);
  }

  /**
   * Public Endpoint: Evaluates CVSS 3.1 vector against program bounty reward policies.
   */
  @Public()
  @Post('bounty-estimate')
  @HttpCode(HttpStatus.OK)
  estimateBounty(@Body() body: { vector: string; programId?: string }) {
    return this.cvssService.estimateProgramBounty(body.vector, body.programId);
  }
}
