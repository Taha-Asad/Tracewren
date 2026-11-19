import { Module } from '@nestjs/common';
import { CvssService } from './cvss.service.js';
import { CvssController } from './cvss.controller.js';
import { PrismaModule } from '../database/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CvssController],
  providers: [CvssService],
  exports: [CvssService],
})
export class CvssModule {}
