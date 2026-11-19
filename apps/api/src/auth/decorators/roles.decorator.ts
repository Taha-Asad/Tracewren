import { SetMetadata } from '@nestjs/common';
import { MembershipRole } from '@prisma/client';

export const ROLES_KEY = 'membership_roles';
export const Roles = (...roles: MembershipRole[]) => SetMetadata(ROLES_KEY, roles);
