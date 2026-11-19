import { describe, it, expect } from 'vitest';
import { MembershipRole, ProgramDefenderRole } from '@prisma/client';
import { Roles, ROLES_KEY } from './roles.decorator.js';
import { ProgramRoles, PROGRAM_ROLES_KEY } from './program-roles.decorator.js';
import { Public, IS_PUBLIC_KEY } from './public.decorator.js';
import { currentUserFactory } from './current-user.decorator.js';
import { currentOrgFactory } from './current-org.decorator.js';

describe('Auth Decorators', () => {
  describe('Roles decorator', () => {
    it('should set roles metadata with provided roles', () => {
      class TestClass {
        @Roles(MembershipRole.ORG_OWNER, MembershipRole.ORG_ADMIN)
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.testMethod);
      expect(metadata).toEqual([MembershipRole.ORG_OWNER, MembershipRole.ORG_ADMIN]);
    });
  });

  describe('ProgramRoles decorator', () => {
    it('should set program defender roles metadata', () => {
      class TestClass {
        @ProgramRoles(ProgramDefenderRole.LEAD_TRIAGER, ProgramDefenderRole.REVIEWER)
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(PROGRAM_ROLES_KEY, TestClass.prototype.testMethod);
      expect(metadata).toEqual([ProgramDefenderRole.LEAD_TRIAGER, ProgramDefenderRole.REVIEWER]);
    });
  });

  describe('Public decorator', () => {
    it('should set is_public_route metadata to true', () => {
      class TestClass {
        @Public()
        publicEndpoint() {}
      }

      const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, TestClass.prototype.publicEndpoint);
      expect(metadata).toBe(true);
    });
  });

  describe('CurrentUser decorator factory', () => {
    it('should return entire user object when data is undefined', () => {
      const mockUser = { id: 'u1', email: 'test@acme.com' };
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({ user: mockUser }),
        }),
      };

      const result = currentUserFactory(undefined, mockContext);
      expect(result).toBe(mockUser);
    });

    it('should return specific field when data is provided', () => {
      const mockUser = { id: 'u1', email: 'test@acme.com' };
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({ user: mockUser }),
        }),
      };

      const email = currentUserFactory('email', mockContext);
      expect(email).toBe('test@acme.com');
    });

    it('should handle undefined user gracefully', () => {
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({ user: undefined }),
        }),
      };

      const email = currentUserFactory('email', mockContext);
      expect(email).toBeUndefined();
    });
  });

  describe('CurrentOrganization decorator factory', () => {
    it('should return req.organization when present', () => {
      const mockOrg = { id: 'org-1', name: 'Acme Corp' };
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({ organization: mockOrg }),
        }),
      };

      const result = currentOrgFactory(undefined, mockContext);
      expect(result).toBe(mockOrg);
    });

    it('should return activeMembership.organization when req.organization is absent', () => {
      const mockOrg = { id: 'org-1', name: 'Acme Corp' };
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            organization: undefined,
            activeMembership: { organization: mockOrg },
          }),
        }),
      };

      const result = currentOrgFactory(undefined, mockContext);
      expect(result).toBe(mockOrg);
    });

    it('should return specific property when data is provided', () => {
      const mockOrg = { id: 'org-1', name: 'Acme Corp' };
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({ organization: mockOrg }),
        }),
      };

      const name = currentOrgFactory('name', mockContext);
      expect(name).toBe('Acme Corp');
    });
  });
});
