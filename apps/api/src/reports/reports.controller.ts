import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { SubmitReportDto } from './dto/submit-report.dto.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
import { CurrentOrganization } from '../auth/decorators/current-org.decorator.js';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Public / Authenticated Endpoint: Submits a new vulnerability report
   * through the full vertical slice (validation -> CVSS engine -> DB persistence).
   */
  @Public()
  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  async submitReport(@Body() dto: SubmitReportDto) {
    return this.reportsService.submitReport(dto);
  }

  /**
   * Public Endpoint: Retrieves report status by UUID.
   */
  @Public()
  @Get(':id')
  async getReport(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reportsService.getReportById(id);
  }

  /**
   * Authenticated Endpoint: Lists all reports for active tenant organization.
   */
  @UseGuards(SessionAuthGuard)
  @Get()
  async listReports(@CurrentOrganization() org: any) {
    return this.reportsService.listReports(org.id);
  }
}
