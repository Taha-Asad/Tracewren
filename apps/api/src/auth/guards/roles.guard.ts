import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<MembershipRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified on endpoint, pass
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required before evaluating role permissions.');
    }

    // Determine target organization from header, route param, or query
    const targetOrgIdentifier =
      request.headers['x-organization-id'] ||
      request.params?.orgId ||
      request.params?.orgSlug ||
      request.query?.orgId;

    if (!targetOrgIdentifier) {
      // If user is ORG_OWNER in any organization, check if that satisfies
      const hasRoleInAny = user.memberships.some((m: any) => requiredRoles.includes(m.role));
      if (hasRoleInAny) {
        return true;
      }
      throw new ForbiddenException(
        'Missing organization scope context (x-organization-id) for role authorization.',
      );
    }

    // Match membership for target organization
    const membership = user.memberships.find(
      (m: any) =>
        m.organizationId === targetOrgIdentifier ||
        m.organization?.slug === targetOrgIdentifier,
    );

    if (!membership) {
      throw new ForbiddenException('You are not a member of the requested organization.');
    }

    const hasPermission = requiredRoles.includes(membership.role);
    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient role clearance: Required [${requiredRoles.join(', ')}], current role is [${membership.role}].`,
      );
    }

    // Attach active membership to request
    request.activeMembership = membership;
    request.organization = membership.organization;

    return true;
  }
}
