import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { MembershipRole, ProgramDefenderRole } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(() => {
    mockAuthService = {
      registerWorkspace: vi.fn(),
      createWorkspaceForUser: vi.fn(),
      completeOnboarding: vi.fn(),
      verifyDomain: vi.fn(),
      login: vi.fn(),
      logout: vi.fn().mockResolvedValue({ success: true, message: 'Logged out successfully.' }),
      getCurrentUserProfile: vi.fn(),
    };

    controller = new AuthController(mockAuthService as unknown as AuthService);
  });

  describe('registerOrganization', () => {
    it('should provision workspace, set cookie, and return session payload', async () => {
      const mockResult: any = {
        success: true,
        user: { id: 'u1', email: 'owner@acme.com' },
        token: 'mock-session-token-123',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      };
      mockAuthService.registerWorkspace.mockResolvedValue(mockResult);

      const mockRes: any = {
        cookie: vi.fn(),
      };

      const dto = {
        orgName: 'Acme Cyber',
        slug: 'acme-cyber',
        email: 'owner@acme.com',
        password: 'Passphrase123!',
        agreedToTerms: true,
      };

      const response = await controller.registerOrganization(
        dto,
        'Mozilla/5.0',
        '127.0.0.1',
        mockRes,
      );

      expect(response).toBe(mockResult);
      expect(mockAuthService.registerWorkspace).toHaveBeenCalledWith(dto, 'Mozilla/5.0', '127.0.0.1');
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'caulvyn_session',
        'mock-session-token-123',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        }),
      );
    });
  });

  describe('createWorkspace', () => {
    it('should provision workspace for authenticated user and return membership metadata', async () => {
      const mockResult: any = {
        organizationId: 'org-2',
        organizationName: 'Second Org',
        organizationSlug: 'second-org',
        role: MembershipRole.ORG_OWNER,
        domain: null,
        domainVerified: false,
      };
      mockAuthService.createWorkspaceForUser.mockResolvedValue(mockResult);

      const dto = {
        orgName: 'Second Org',
        slug: 'second-org',
      };

      const result = await controller.createWorkspace({ id: 'u1' }, dto);
      expect(result).toBe(mockResult);
      expect(mockAuthService.createWorkspaceForUser).toHaveBeenCalledWith('u1', dto);
    });
  });

  describe('completeOnboarding', () => {
    it('should complete onboarding and activate workspace', async () => {
      const mockResult = {
        success: true,
        message: 'Organization onboarding completed and workspace perimeter activated.',
        organization: {
          organizationId: 'org-1',
          organizationName: 'Acme',
          organizationSlug: 'acme',
          role: MembershipRole.ORG_OWNER,
          domain: 'acme.com',
          domainVerified: true,
          onboardingCompletedAt: new Date().toISOString(),
        },
      };
      mockAuthService.completeOnboarding.mockResolvedValue(mockResult);

      const dto = {
        organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        domain: 'acme.com',
        domainVerified: true,
      };

      const result = await controller.completeOnboarding({ id: 'u1' }, dto);
      expect(result).toBe(mockResult);
      expect(mockAuthService.completeOnboarding).toHaveBeenCalledWith('u1', dto);
    });
  });

  describe('verifyDomain', () => {
    it('should verify domain TXT challenge and return verification confirmation', async () => {
      const mockResult = {
        verified: true,
        domain: 'acme.com',
        checkedAt: new Date().toISOString(),
        message: 'Domain proof confirmed for acme.com.',
      };
      mockAuthService.verifyDomain.mockResolvedValue(mockResult);

      const dto = {
        organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        domain: 'acme.com',
      };

      const result = await controller.verifyDomain({ id: 'u1' }, dto);
      expect(result).toBe(mockResult);
      expect(mockAuthService.verifyDomain).toHaveBeenCalledWith('u1', dto);
    });
  });

  describe('login', () => {
    it('should authenticate user, set session cookie, and return session data', async () => {
      const mockResult: any = {
        success: true,
        user: { id: 'u1', email: 'owner@acme.com' },
        token: 'login-token-abc',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      };
      mockAuthService.login.mockResolvedValue(mockResult);

      const mockRes: any = {
        cookie: vi.fn(),
      };

      const dto = {
        email: 'owner@acme.com',
        password: 'Passphrase123!',
      };

      const response = await controller.login(dto, 'Mozilla/5.0', '127.0.0.1', mockRes);
      expect(response).toBe(mockResult);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'caulvyn_session',
        'login-token-abc',
        expect.any(Object),
      );
    });

    it('should return MFA required payload without setting session cookie when TOTP is needed', async () => {
      const mockMfaResult: any = {
        success: false,
        mfaRequired: true,
        message: 'Step-up TOTP MFA required.',
      };
      mockAuthService.login.mockResolvedValue(mockMfaResult);

      const mockRes: any = {
        cookie: vi.fn(),
      };

      const dto = {
        email: 'owner@acme.com',
        password: 'Passphrase123!',
      };

      const response = await controller.login(dto, 'Mozilla/5.0', '127.0.0.1', mockRes);
      expect(response).toBe(mockMfaResult);
      expect(mockRes.cookie).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should terminate session from Authorization header and clear cookie', async () => {
      const mockReq: any = {
        headers: { authorization: 'Bearer session-token-xyz' },
        cookies: {},
      };
      const mockRes: any = {
        clearCookie: vi.fn(),
      };

      const response = await controller.logout(mockReq, mockRes);
      expect(response).toEqual({ success: true, message: 'Logged out successfully.' });
      expect(mockAuthService.logout).toHaveBeenCalledWith('session-token-xyz');
      expect(mockRes.clearCookie).toHaveBeenCalledWith('caulvyn_session', { path: '/' });
    });

    it('should terminate session from cookie when header is absent', async () => {
      const mockReq: any = {
        headers: {},
        cookies: { caulvyn_session: 'cookie-token-123' },
      };
      const mockRes: any = {
        clearCookie: vi.fn(),
      };

      await controller.logout(mockReq, mockRes);
      expect(mockAuthService.logout).toHaveBeenCalledWith('cookie-token-123');
    });

    it('should handle logout gracefully when no token is present', async () => {
      const mockReq: any = {
        headers: {},
        cookies: {},
      };
      const mockRes: any = {
        clearCookie: vi.fn(),
      };

      await controller.logout(mockReq, mockRes);
      expect(mockAuthService.logout).not.toHaveBeenCalled();
      expect(mockRes.clearCookie).toHaveBeenCalledWith('caulvyn_session', { path: '/' });
    });
  });

  describe('getMe', () => {
    it('should retrieve current user profile and memberships', async () => {
      const mockProfile = { user: { id: 'u1' }, memberships: [], assignedPrograms: [] };
      mockAuthService.getCurrentUserProfile.mockResolvedValue(mockProfile);

      const result = await controller.getMe({ id: 'u1' });
      expect(result).toBe(mockProfile);
      expect(mockAuthService.getCurrentUserProfile).toHaveBeenCalledWith('u1');
    });
  });

  describe('checkOrgAdminClearance', () => {
    it('should return authorization confirmation metadata for organization admin', async () => {
      const mockUser = {
        id: 'u1',
        activeMembership: { role: MembershipRole.ORG_OWNER },
      };
      const mockOrg = { name: 'Acme Cyber' };

      const result = await controller.checkOrgAdminClearance(mockUser, mockOrg);
      expect(result.authorized).toBe(true);
      expect(result.role).toBe(MembershipRole.ORG_OWNER);
      expect(result.organization).toBe('Acme Cyber');
    });
  });

  describe('checkTriageClearance', () => {
    it('should return authorization confirmation metadata for program triage roles', async () => {
      const mockUser = { id: 'u1' };
      const mockReq = {
        activeProgramAssignment: { role: ProgramDefenderRole.LEAD_TRIAGER },
      };

      const result = await controller.checkTriageClearance(mockUser, mockReq);
      expect(result.authorized).toBe(true);
      expect(result.triageRole).toBe(ProgramDefenderRole.LEAD_TRIAGER);
    });
  });
});
