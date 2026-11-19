import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterWorkspaceDto } from './dto/register-workspace.dto.js';
import { CreateWorkspaceDto } from './dto/create-workspace.dto.js';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto.js';
import { VerifyDomainDto } from './dto/verify-domain.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from './decorators/public.decorator.js';
import { Roles } from './decorators/roles.decorator.js';
import { ProgramRoles } from './decorators/program-roles.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { CurrentOrganization } from './decorators/current-org.decorator.js';
import { SessionAuthGuard } from './guards/session-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { ProgramRolesGuard } from './guards/program-roles.guard.js';
import { MembershipRole, ProgramDefenderRole } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Public Endpoint: Provisions a new multi-tenant organization workspace,
   * assigns the creator as ORG_OWNER, and issues a 30-day session token.
   */
  @Public()
  @Post('register-organization')
  @HttpCode(HttpStatus.CREATED)
  async registerOrganization(
    @Body() dto: RegisterWorkspaceDto,
    @Headers('user-agent') userAgent: string | undefined,
    @Ip() ipAddress: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.registerWorkspace(dto, userAgent, ipAddress);

    // Set secure HTTP-only session cookie
    res.cookie('caulvyn_session', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(result.expiresAt),
    });

    return result;
  }

  /**
   * Authenticated Endpoint: Provisions a new organization workspace for the currently logged-in user.
   */
  @UseGuards(SessionAuthGuard)
  @Post('create-workspace')
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @CurrentUser() user: any,
    @Body() dto: CreateWorkspaceDto,
  ) {
    return this.authService.createWorkspaceForUser(user.id, dto);
  }

  /**
   * Authenticated Endpoint: Completes multi-step onboarding wizard and activates workspace.
   */
  @UseGuards(SessionAuthGuard)
  @Post('complete-onboarding')
  @HttpCode(HttpStatus.OK)
  async completeOnboarding(
    @CurrentUser() user: any,
    @Body() dto: CompleteOnboardingDto,
  ) {
    return this.authService.completeOnboarding(user.id, dto);
  }

  /**
   * Authenticated Endpoint: Verifies domain DNS TXT challenge for onboarding step 3.
   */
  @UseGuards(SessionAuthGuard)
  @Post('verify-domain')
  @HttpCode(HttpStatus.OK)
  async verifyDomain(
    @CurrentUser() user: any,
    @Body() dto: VerifyDomainDto,
  ) {
    return this.authService.verifyDomain(user.id, dto);
  }

  /**
   * Public Endpoint: Authenticates user credentials via Argon2id.
   * If step-up MFA is configured, requires 6-digit TOTP code.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Headers('user-agent') userAgent: string | undefined,
    @Ip() ipAddress: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, userAgent, ipAddress);

    if ('token' in result) {
      res.cookie('caulvyn_session', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(result.expiresAt),
      });
    }

    return result;
  }

  /**
   * Authenticated Endpoint: Terminates the active session and clears the cookie.
   */
  @UseGuards(SessionAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken =
      (req.headers?.authorization?.replace('Bearer ', '') as string) ||
      (req as any).cookies?.caulvyn_session;

    if (rawToken) {
      await this.authService.logout(rawToken);
    }

    res.clearCookie('caulvyn_session', { path: '/' });
    return { success: true, message: 'Logged out successfully.' };
  }

  /**
   * Authenticated Endpoint: Retrieves the current caller profile, organizations, and roles.
   */
  @UseGuards(SessionAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    return this.authService.getCurrentUserProfile(user.id);
  }

  /**
   * RBAC Protected Endpoint (Organization-Level):
   * Strictly gated to ORG_OWNER and ORG_ADMIN roles.
   */
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(MembershipRole.ORG_OWNER, MembershipRole.ORG_ADMIN)
  @Get('organization-admin-check')
  async checkOrgAdminClearance(
    @CurrentUser() user: any,
    @CurrentOrganization() org: any,
  ) {
    return {
      authorized: true,
      role: (user as any).activeMembership?.role,
      organization: org?.name,
      message: 'Clearance verified for organization management and privileged operations.',
    };
  }

  /**
   * RBAC Protected Endpoint (Program-Level):
   * Strictly gated to LEAD_TRIAGER, TRIAGER, and REVIEWER roles.
   */
  @UseGuards(SessionAuthGuard, ProgramRolesGuard)
  @ProgramRoles(
    ProgramDefenderRole.LEAD_TRIAGER,
    ProgramDefenderRole.TRIAGER,
    ProgramDefenderRole.REVIEWER,
  )
  @Get('triage-clearance-check')
  async checkTriageClearance(
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return {
      authorized: true,
      triageRole: req.activeProgramAssignment?.role,
      message: 'Clearance verified for vulnerability triage and review.',
    };
  }
}
