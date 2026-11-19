import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { SendInvitationDto } from './dto/send-invitation.dto.js';

@Controller('v1/invitations')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendInvitation(@Body() dto: SendInvitationDto) {
    return this.emailService.sendProgramInvitation(dto);
  }

  @Get('outbox')
  async getOutbox(@Query('limit') limit?: string) {
    const numLimit = limit ? parseInt(limit, 10) : 20;
    return this.emailService.getOutboxMessages(isNaN(numLimit) ? 20 : numLimit);
  }
}
