import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProgramDefenderRole } from '@prisma/client';
import { PROGRAM_ROLES_KEY } from '../decorators/program-roles.decorator.js';

@Injectable()
export class ProgramRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ProgramDefenderRole[]>(
      PROGRAM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required before evaluating program roles.');
    }

    const targetProgramIdentifier =
      request.headers['x-program-id'] ||
      request.params?.programId ||
      request.params?.programSlug ||
      request.query?.programId;

    if (!targetProgramIdentifier) {
      throw new ForbiddenException(
        'Missing target program context (x-program-id) for triage role evaluation.',
      );
    }

    const assignment = user.assignedPrograms?.find(
      (p: any) =>
        p.programId === targetProgramIdentifier ||
        p.program?.slug === targetProgramIdentifier,
    );

    if (!assignment) {
      // Check if user is an ORG_OWNER or ORG_ADMIN for the organization owning this program
      const orgId = request.organization?.id || request.headers['x-organization-id'];
      const isOrgAdmin = user.memberships?.some(
        (m: any) =>
          (!orgId || m.organizationId === orgId) &&
          (m.role === 'ORG_OWNER' || m.role === 'ORG_ADMIN'),
      );

      if (isOrgAdmin) {
        return true; // Org owners and admins inherit program-level triage access
      }

      throw new ForbiddenException('You are not assigned as a defender to this security program.');
    }

    const hasRole = requiredRoles.includes(assignment.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Insufficient triage role: Required [${requiredRoles.join(', ')}], current role is [${assignment.role}].`,
      );
    }

    request.activeProgramAssignment = assignment;
    return true;
  }
}
