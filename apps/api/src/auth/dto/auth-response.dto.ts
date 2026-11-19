import { MembershipRole, ProgramDefenderRole } from '@prisma/client';

export interface UserSummary {
  id: string;
  email: string;
  fullName: string | null;
  mfaEnabled: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

export interface OrganizationMembershipSummary {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: MembershipRole;
  domain: string | null;
  domainVerified: boolean;
  onboardingCompletedAt?: string | null;
}

export interface ProgramAssignmentSummary {
  programId: string;
  programSlug: string;
  role: ProgramDefenderRole;
}

export interface AuthSessionResponse {
  success: true;
  user: UserSummary;
  memberships: OrganizationMembershipSummary[];
  assignedPrograms: ProgramAssignmentSummary[];
  token: string;
  expiresAt: string;
}

export interface MfaRequiredResponse {
  success: false;
  mfaRequired: true;
  message: string;
}
