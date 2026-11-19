import { SetMetadata } from '@nestjs/common';
import { ProgramDefenderRole } from '@prisma/client';

export const PROGRAM_ROLES_KEY = 'program_defender_roles';
export const ProgramRoles = (...roles: ProgramDefenderRole[]) => SetMetadata(PROGRAM_ROLES_KEY, roles);
