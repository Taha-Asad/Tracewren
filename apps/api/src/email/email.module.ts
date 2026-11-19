import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module.js';
import { EmailService } from './email.service.js';
import { EmailController } from './email.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
