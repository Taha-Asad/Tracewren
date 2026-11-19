import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard.js';
import { ProgramRolesGuard } from './program-roles.guard.js';
import { MembershipRole, ProgramDefenderRole } from '@prisma/client';

describe('RolesGuard & ProgramRolesGuard (RBAC)', () => {
  let reflector: Reflector;
  let rolesGuard: RolesGuard;
  let programRolesGuard: ProgramRolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
    programRolesGuard = new ProgramRolesGuard(reflector);
  });

  describe('RolesGuard (Organization-Level RBAC)', () => {
    it('should permit access when no roles are required on endpoint', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({
          getRequest: () => ({ user: { id: 'u1' } }),
        }),
      };

      expect(rolesGuard.canActivate(mockContext)).toBe(true);
    });

    it('should throw UnauthorizedException if req.user is absent', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([MembershipRole.ORG_OWNER]);

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({
          getRequest: () => ({ user: undefined }),
        }),
      };

      expect(() => rolesGuard.canActivate(mockContext)).toThrow(
        new UnauthorizedException('Authentication required before evaluating role permissions.'),
      );
    });

    it('should permit when targetOrgIdentifier is omitted but user possesses required role in any organization', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([MembershipRole.ORG_OWNER]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          memberships: [
            {
              organizationId: 'org-1',
              role: MembershipRole.ORG_OWNER,
              organization: { id: 'org-1' },
            },
          ],
        },
        headers: {},
        params: {},
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(rolesGuard.canActivate(mockContext)).toBe(true);
    });

    it('should throw ForbiddenException when targetOrgIdentifier is omitted and user does not have required role anywhere', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([MembershipRole.ORG_OWNER]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          memberships: [
            {
              organizationId: 'org-1',
              role: MembershipRole.ORG_READONLY,
            },
          ],
        },
        headers: {},
        params: {},
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(() => rolesGuard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should permit access when user is ORG_OWNER in requested organization', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        MembershipRole.ORG_OWNER,
        MembershipRole.ORG_ADMIN,
      ]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          memberships: [
            {
              organizationId: 'org-target-uuid',
              role: MembershipRole.ORG_OWNER,
              organization: { id: 'org-target-uuid', name: 'Acme Cyber' },
            },
          ],
        },
        headers: { 'x-organization-id': 'org-target-uuid' },
        params: {},
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(rolesGuard.canActivate(mockContext)).toBe(true);
      expect(mockRequest.activeMembership.role).toBe(MembershipRole.ORG_OWNER);
    });

    it('should reject with ForbiddenException when user has insufficient role (e.g. ORG_READONLY)', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        MembershipRole.ORG_OWNER,
        MembershipRole.ORG_ADMIN,
      ]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          memberships: [
            {
              organizationId: 'org-target-uuid',
              role: MembershipRole.ORG_READONLY,
              organization: { id: 'org-target-uuid' },
            },
          ],
        },
        headers: { 'x-organization-id': 'org-target-uuid' },
        params: {},
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(() => rolesGuard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should reject with ForbiddenException when user is not a member of the organization', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([MembershipRole.ORG_OWNER]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          memberships: [
            {
              organizationId: 'other-org',
              role: MembershipRole.ORG_OWNER,
            },
          ],
        },
        headers: { 'x-organization-id': 'foreign-org-uuid' },
        params: {},
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(() => rolesGuard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should resolve organization from params.orgId or query.orgId and match by organization slug', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([MembershipRole.ORG_ADMIN]);

      // Match by slug from params.orgSlug
      const mockRequestSlug: any = {
        user: {
          id: 'u1',
          memberships: [
            {
              organizationId: 'org-uuid-1',
              role: MembershipRole.ORG_ADMIN,
              organization: { id: 'org-uuid-1', slug: 'acme-corp' },
            },
          ],
        },
        headers: {},
        params: { orgSlug: 'acme-corp' },
      };

      const mockContextSlug: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequestSlug }),
      };

      expect(rolesGuard.canActivate(mockContextSlug)).toBe(true);
      expect(mockRequestSlug.activeMembership.role).toBe(MembershipRole.ORG_ADMIN);

      // Match from params.orgId
      const mockRequestParams: any = {
        user: {
          id: 'u1',
          memberships: [
            {
              organizationId: 'org-uuid-1',
              role: MembershipRole.ORG_ADMIN,
              organization: { id: 'org-uuid-1', slug: 'acme-corp' },
            },
          ],
        },
        headers: {},
        params: { orgId: 'org-uuid-1' },
      };
      const mockContextParams: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequestParams }),
      };
      expect(rolesGuard.canActivate(mockContextParams)).toBe(true);

      // Match from query.orgId
      const mockRequestQuery: any = {
        user: {
          id: 'u1',
          memberships: [
            {
              organizationId: 'org-uuid-1',
              role: MembershipRole.ORG_ADMIN,
              organization: { id: 'org-uuid-1', slug: 'acme-corp' },
            },
          ],
        },
        headers: {},
        params: {},
        query: { orgId: 'org-uuid-1' },
      };
      const mockContextQuery: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequestQuery }),
      };
      expect(rolesGuard.canActivate(mockContextQuery)).toBe(true);
    });
  });

  describe('ProgramRolesGuard (Program/Triage-Level RBAC)', () => {
    it('should permit access when no program roles are required on endpoint', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({
          getRequest: () => ({ user: { id: 'u1' } }),
        }),
      };

      expect(programRolesGuard.canActivate(mockContext)).toBe(true);
    });

    it('should throw UnauthorizedException if req.user is absent', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([ProgramDefenderRole.LEAD_TRIAGER]);

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({
          getRequest: () => ({ user: undefined }),
        }),
      };

      expect(() => programRolesGuard.canActivate(mockContext)).toThrow(
        new UnauthorizedException('Authentication required before evaluating program roles.'),
      );
    });

    it('should throw ForbiddenException if target program identifier is omitted', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([ProgramDefenderRole.LEAD_TRIAGER]);

      const mockRequest: any = {
        user: { id: 'u1' },
        headers: {},
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(() => programRolesGuard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should permit access when user has LEAD_TRIAGER role on program', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        ProgramDefenderRole.LEAD_TRIAGER,
        ProgramDefenderRole.TRIAGER,
      ]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          assignedPrograms: [
            {
              programId: 'prog-1',
              role: ProgramDefenderRole.LEAD_TRIAGER,
              program: { id: 'prog-1', slug: 'acme-vdp' },
            },
          ],
        },
        headers: { 'x-program-id': 'prog-1' },
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(programRolesGuard.canActivate(mockContext)).toBe(true);
      expect(mockRequest.activeProgramAssignment.role).toBe(ProgramDefenderRole.LEAD_TRIAGER);
    });

    it('should allow ORG_OWNER or ORG_ADMIN to inherit program access when not explicitly assigned', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([ProgramDefenderRole.LEAD_TRIAGER]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          assignedPrograms: [],
          memberships: [
            {
              organizationId: 'org-1',
              role: MembershipRole.ORG_OWNER,
            },
          ],
        },
        organization: { id: 'org-1' },
        headers: { 'x-program-id': 'unassigned-prog-id' },
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(programRolesGuard.canActivate(mockContext)).toBe(true);
    });

    it('should reject with ForbiddenException if defender role is insufficient (e.g. REMEDIATOR attempting triage review)', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([ProgramDefenderRole.LEAD_TRIAGER]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          assignedPrograms: [
            {
              programId: 'prog-1',
              role: ProgramDefenderRole.REMEDIATOR,
            },
          ],
          memberships: [],
        },
        headers: { 'x-program-id': 'prog-1' },
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(() => programRolesGuard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should reject with ForbiddenException when user is neither assigned nor org owner/admin', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([ProgramDefenderRole.LEAD_TRIAGER]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          assignedPrograms: [],
          memberships: [
            {
              organizationId: 'org-1',
              role: MembershipRole.ORG_DEFENDER,
            },
          ],
        },
        organization: { id: 'org-1' },
        headers: { 'x-program-id': 'unassigned-prog-id' },
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(() => programRolesGuard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should resolve target program by slug from params.programSlug and match program.slug', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([ProgramDefenderRole.TRIAGER]);

      const mockRequest: any = {
        user: {
          id: 'u1',
          assignedPrograms: [
            {
              programId: 'prog-uuid-1',
              role: ProgramDefenderRole.TRIAGER,
              program: { id: 'prog-uuid-1', slug: 'vdp-public' },
            },
          ],
        },
        headers: {},
        params: { programSlug: 'vdp-public' },
      };

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequest }),
      };

      expect(programRolesGuard.canActivate(mockContext)).toBe(true);
      expect(mockRequest.activeProgramAssignment.role).toBe(ProgramDefenderRole.TRIAGER);
    });

    it('should resolve target program from params.programId and query.programId', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([ProgramDefenderRole.TRIAGER]);

      const mockRequestParams: any = {
        user: {
          id: 'u1',
          assignedPrograms: [
            {
              programId: 'prog-1',
              role: ProgramDefenderRole.TRIAGER,
              program: { id: 'prog-1', slug: 'vdp-1' },
            },
          ],
        },
        headers: {},
        params: { programId: 'prog-1' },
      };
      const mockContextParams: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequestParams }),
      };
      expect(programRolesGuard.canActivate(mockContextParams)).toBe(true);

      const mockRequestQuery: any = {
        user: {
          id: 'u1',
          assignedPrograms: [
            {
              programId: 'prog-1',
              role: ProgramDefenderRole.TRIAGER,
              program: { id: 'prog-1', slug: 'vdp-1' },
            },
          ],
        },
        headers: {},
        params: {},
        query: { programId: 'prog-1' },
      };
      const mockContextQuery: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequestQuery }),
      };
      expect(programRolesGuard.canActivate(mockContextQuery)).toBe(true);
    });

    it('should inherit program access for ORG_ADMIN via x-organization-id header or when orgId is undefined', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([ProgramDefenderRole.LEAD_TRIAGER]);

      // Via x-organization-id header with ORG_ADMIN
      const mockRequestHeader: any = {
        user: {
          id: 'u1',
          assignedPrograms: [],
          memberships: [
            {
              organizationId: 'org-99',
              role: MembershipRole.ORG_ADMIN,
            },
          ],
        },
        headers: {
          'x-program-id': 'unassigned-prog-id',
          'x-organization-id': 'org-99',
        },
      };

      const mockContextHeader: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequestHeader }),
      };

      expect(programRolesGuard.canActivate(mockContextHeader)).toBe(true);

      // When orgId is undefined (!orgId branch)
      const mockRequestNoOrg: any = {
        user: {
          id: 'u1',
          assignedPrograms: [],
          memberships: [
            {
              organizationId: 'any-org',
              role: MembershipRole.ORG_ADMIN,
            },
          ],
        },
        headers: {
          'x-program-id': 'unassigned-prog-id',
        },
      };

      const mockContextNoOrg: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => mockRequestNoOrg }),
      };

      expect(programRolesGuard.canActivate(mockContextNoOrg)).toBe(true);
    });
  });
});
