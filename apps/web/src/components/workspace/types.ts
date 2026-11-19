export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  mfaEnabled: boolean;
  avatarUrl: string | null;
}

export interface Membership {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: string;
  domain: string | null;
  domainVerified: boolean;
  onboardingCompletedAt?: string | null;
}

export interface AssignedProgram {
  programId: string;
  programSlug: string;
  role: string;
}

export interface ProgramItem {
  id: string;
  name: string;
  slug: string;
  visibility: "PUBLIC" | "INVITE_ONLY";
  inScope: string[];
  outOfScope: string[];
  safeHarborPolicy: string;
  activeReportsCount: number;
  defendersCount: number;
  rfc9116Url: string;
  createdAt: string;
}

export interface TriageMemberItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "ORG_OWNER" | "LEAD_TRIAGER" | "TRIAGER" | "REVIEWER" | "REMEDIATOR";
  programName: string;
  keyStatus: string;
  keyFingerprint: string;
  activeReportsAssigned: number;
  avatarColor: string;
}

export interface ReportItem {
  id: string;
  reportId?: string;
  uuid?: string;
  programSlug: string;
  title: string;
  summary: string;
  reporter: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvss: number;
  status: "Retest pending" | "Triaged" | "Resolved" | "Under review";
  bounty: string;
  environment: string;
  version: string;
  assignedDefender: string;
  assignedDefenderId?: string;
  assignedDefenderEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionMessageItem {
  id: string;
  reportId: string;
  reportTitle: string;
  senderName: string;
  senderRole: string;
  senderActorType: "HUNTER" | "DEFENDER" | "GUEST" | "SYSTEM";
  lane: "RESEARCHER_ORG" | "REVIEWER_INTERNAL";
  content: string;
  createdAt: string;
  isEncrypted: boolean;
  userId?: string;
  senderEmail?: string;
}

export type ViewMode =
  | "dashboard"
  | "workspaces"
  | "programs"
  | "reports"
  | "triage-members"
  | "discussions"
  | "report"
  | "cvss-calculator";

export function formatRole(role?: string): string {
  if (!role) return "Member";
  const normalized = role.toUpperCase();
  switch (normalized) {
    case "ORG_OWNER":
      return "Organization Owner";
    case "ORG_ADMIN":
      return "Organization Admin";
    case "ORG_DEFENDER":
      return "Program Defender";
    case "ORG_READONLY":
      return "Security Auditor";
    case "LEAD_TRIAGER":
      return "Lead Triager";
    case "TRIAGER":
      return "Program Triager";
    case "REVIEWER":
      return "Code Reviewer";
    case "REMEDIATOR":
      return "Remediation Engineer";
    default:
      return role
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
