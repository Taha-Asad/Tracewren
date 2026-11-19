import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { SessionAuthGuard } from './guards/session-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { ProgramRolesGuard } from './guards/program-roles.guard.js';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionAuthGuard,
    RolesGuard,
    ProgramRolesGuard,
  ],
  exports: [
    AuthService,
    SessionAuthGuard,
    RolesGuard,
    ProgramRolesGuard,
  ],
})
export class AuthModule {}
