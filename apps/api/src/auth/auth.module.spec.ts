import { describe, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { SessionAuthGuard } from './guards/session-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { ProgramRolesGuard } from './guards/program-roles.guard.js';
import { PrismaService } from '../database/prisma.service.js';

describe('AuthModule', () => {
  it('should compile and wire all auth providers and controllers correctly', async () => {
    const mockPrisma = {
      user: { findUnique: () => null },
      session: { findUnique: () => null },
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    expect(moduleRef).toBeDefined();
    expect(moduleRef.get(AuthService)).toBeInstanceOf(AuthService);
    expect(moduleRef.get(AuthController)).toBeInstanceOf(AuthController);
    expect(moduleRef.get(SessionAuthGuard)).toBeInstanceOf(SessionAuthGuard);
    expect(moduleRef.get(RolesGuard)).toBeInstanceOf(RolesGuard);
    expect(moduleRef.get(ProgramRolesGuard)).toBeInstanceOf(ProgramRolesGuard);
  });
});
