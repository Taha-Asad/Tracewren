import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { ReportsController } from './reports.controller.js';
import { PrismaModule } from '../database/prisma.module.js';
import { CvssModule } from '../cvss/cvss.module.js';

@Module({
  imports: [PrismaModule, CvssModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
