import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createHash } from 'node:crypto';
import { PrismaService } from '../../database/prisma.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication session token is required.');
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');

    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            memberships: {
              include: {
                organization: true,
              },
            },
            assignedPrograms: {
              include: {
                program: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Session token is invalid or does not exist.');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      // Lazy cleanup of expired session
      try {
        await this.prisma.session.delete({ where: { id: session.id } });
      } catch {
        // Suppress cleanup failure
      }
      throw new UnauthorizedException('Session token has expired. Please re-authenticate.');
    }

    // Attach user and session to request context
    request.user = session.user;
    request.session = session;

    // Optional: resolve active organization if requested via header
    const requestedOrgId = request.headers['x-organization-id'] as string | undefined;
    if (requestedOrgId) {
      const activeMembership = session.user.memberships.find(
        (m) => m.organizationId === requestedOrgId || m.organization.slug === requestedOrgId,
      );
      if (activeMembership) {
        request.activeMembership = activeMembership;
        request.organization = activeMembership.organization;
      }
    }

    return true;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7).trim();
    }

    if (request.cookies?.caulvyn_session) {
      return request.cookies.caulvyn_session;
    }

    return null;
  }
}
