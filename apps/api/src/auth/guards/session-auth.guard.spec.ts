import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createHash } from 'node:crypto';
import { SessionAuthGuard } from './session-auth.guard.js';

describe('SessionAuthGuard', () => {
  let guard: SessionAuthGuard;
  let reflector: Reflector;
  let mockPrisma: any;

  beforeEach(() => {
    reflector = new Reflector();
    mockPrisma = {
      session: {
        findUnique: vi.fn(),
        delete: vi.fn().mockResolvedValue({}),
      },
    };
    guard = new SessionAuthGuard(reflector, mockPrisma);
  });

  it('should permit access if route is marked as @Public', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const mockContext: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({ getRequest: () => ({}) }),
    };

    const canActivate = await guard.canActivate(mockContext);
    expect(canActivate).toBe(true);
  });

  it('should throw UnauthorizedException if no token is provided in header or cookies', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const mockContext: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({ headers: {}, cookies: {} }),
      }),
    };

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Authentication session token is required.'),
    );
  });

  it('should throw UnauthorizedException if session is not found in database', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockPrisma.session.findUnique.mockResolvedValue(null);

    const mockContext: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalid-token' },
          cookies: {},
        }),
      }),
    };

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Session token is invalid or does not exist.'),
    );
  });

  it('should throw UnauthorizedException and delete expired session if session has expired', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const expiredSession = {
      id: 'session-1',
      expiresAt: new Date(Date.now() - 10000), // 10s in the past
      user: { id: 'u1' },
    };
    mockPrisma.session.findUnique.mockResolvedValue(expiredSession);

    const mockContext: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer expired-token' },
          cookies: {},
        }),
      }),
    };

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Session token has expired. Please re-authenticate.'),
    );
    expect(mockPrisma.session.delete).toHaveBeenCalledWith({ where: { id: 'session-1' } });
  });

  it('should successfully authenticate with valid Bearer token and attach user to request', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const validSession = {
      id: 'session-1',
      expiresAt: new Date(Date.now() + 60000), // 60s in the future
      user: {
        id: 'u1',
        email: 'sarah@acme.com',
        memberships: [
          {
            organizationId: 'org-1',
            role: 'ORG_OWNER',
            organization: { id: 'org-1', slug: 'acme-cyber' },
          },
        ],
        assignedPrograms: [],
      },
    };
    mockPrisma.session.findUnique.mockResolvedValue(validSession);

    const mockReq: any = {
      headers: {
        authorization: 'Bearer valid-secret-token',
        'x-organization-id': 'acme-cyber',
      },
      cookies: {},
    };

    const mockContext: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({ getRequest: () => mockReq }),
    };

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(mockReq.user).toBe(validSession.user);
    expect(mockReq.session).toBe(validSession);
    expect(mockReq.organization.slug).toBe('acme-cyber');
  });

  it('should extract session token from cookies when authorization header is absent', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const validSession = {
      id: 'session-1',
      expiresAt: new Date(Date.now() + 60000),
      user: { id: 'u1', memberships: [], assignedPrograms: [] },
    };
    mockPrisma.session.findUnique.mockResolvedValue(validSession);

    const mockReq: any = {
      headers: {},
      cookies: { caulvyn_session: 'cookie-session-token' },
    };

    const mockContext: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({ getRequest: () => mockReq }),
    };

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(mockReq.user).toBe(validSession.user);
  });

  it('should swallow error in lazy cleanup if session deletion fails', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const expiredSession = {
      id: 'session-fail-delete',
      expiresAt: new Date(Date.now() - 10000),
      user: { id: 'u1' },
    };
    mockPrisma.session.findUnique.mockResolvedValue(expiredSession);
    mockPrisma.session.delete.mockRejectedValue(new Error('DB connection reset'));

    const mockContext: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer expired-token' },
          cookies: {},
        }),
      }),
    };

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Session token has expired. Please re-authenticate.'),
    );
  });

  it('should not attach activeMembership if requestedOrgId does not match any user membership', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const validSession = {
      id: 'session-1',
      expiresAt: new Date(Date.now() + 60000),
      user: {
        id: 'u1',
        email: 'sarah@acme.com',
        memberships: [
          {
            organizationId: 'org-1',
            role: 'ORG_OWNER',
            organization: { id: 'org-1', slug: 'acme-cyber' },
          },
        ],
        assignedPrograms: [],
      },
    };
    mockPrisma.session.findUnique.mockResolvedValue(validSession);

    const mockReq: any = {
      headers: {
        authorization: 'Bearer valid-secret-token',
        'x-organization-id': 'unrelated-org',
      },
      cookies: {},
    };

    const mockContext: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({ getRequest: () => mockReq }),
    };

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(mockReq.activeMembership).toBeUndefined();
    expect(mockReq.organization).toBeUndefined();
  });

  it('should return null when authorization header does not start with Bearer or cookies is undefined', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const mockContext: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Basic dXNlcjpwYXNz' },
        }),
      }),
    };

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Authentication session token is required.'),
    );
  });
});
