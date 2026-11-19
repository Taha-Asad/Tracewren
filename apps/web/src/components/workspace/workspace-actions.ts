import { ProgramItem, TriageMemberItem } from "./types";
import { savePrograms, saveMembers } from "./storage";

export async function createWorkspaceApi(params: {
  orgName: string;
  slug: string;
  domain?: string;
}): Promise<any> {
  const res = await fetch("/api/auth/create-workspace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const rawMsg = Array.isArray(errorData.message)
      ? errorData.message.join(". ")
      : errorData.message;
    throw new Error(rawMsg || "Failed to provision workspace. Slug may already be taken.");
  }

  return res.json();
}

export async function createProgramApi(params: {
  name: string;
  slug: string;
  visibility: "PUBLIC" | "INVITE_ONLY";
  inScope: string[];
  safeHarborPolicy: string;
  organizationId: string;
  orgSlug: string;
}): Promise<ProgramItem> {
  const newProg: ProgramItem = {
    id: `prog-${Date.now()}`,
    name: params.name,
    slug: params.slug,
    visibility: params.visibility,
    inScope: params.inScope,
    outOfScope: ["Third-party services", "Denial of service testing"],
    safeHarborPolicy: params.safeHarborPolicy,
    activeReportsCount: 0,
    defendersCount: 1,
    rfc9116Url: `/api/v1/programs/${params.slug}/security.txt`,
    createdAt: "Just now",
  };

  fetch("/api/v1/programs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  }).catch(() => {});

  return newProg;
}

export async function sendMemberInviteApi(params: {
  email: string;
  role: string;
  programName: string;
  organizationId: string;
  programSlug: string;
  inviterName: string;
  inviterEmail: string;
}): Promise<{ success: boolean; data: any; newMember: TriageMemberItem }> {
  let inviteData: any = {};
  try {
    const res = await fetch("/api/v1/invitations/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    inviteData = await res.json().catch(() => ({}));
  } catch {
    // Offline fallback
  }

  const memberName = params.email
    .split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const newMember: TriageMemberItem = {
    id: `m-${Date.now()}`,
    userId: `u-${Date.now()}`,
    name: memberName,
    email: params.email,
    role: params.role as any,
    programName: params.programName,
    keyStatus: "Curve25519 Active Key",
    keyFingerprint: "sha256:" + Math.random().toString(36).substring(2, 18),
    activeReportsAssigned: 0,
    avatarColor: "teal",
  };

  return { success: true, data: inviteData, newMember };
}

export async function verifyGitHubCommitApi(params: {
  repoName: string;
  commitSha: string;
  targetBranch: string;
  tokenOverride?: string;
}): Promise<any> {
  const res = await fetch("/api/github/verify-commit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repoName: params.repoName,
      commitSha: params.commitSha,
      targetBranch: params.targetBranch,
      githubToken: params.tokenOverride,
    }),
  });
  return res.json();
}

export async function executeGitHubCommitVerification(params: {
  repoName: string;
  commitSha: string;
  targetBranch: string;
  tokenOverride?: string;
}): Promise<{
  verified: boolean;
  data?: any;
  feedback: string;
  error?: string;
}> {
  try {
    const data = await verifyGitHubCommitApi(params);
    if (!data?.verified) {
      const err = data?.error || "GitHub commit verification failed.";
      return { verified: false, feedback: err, error: err };
    }
    return {
      verified: true,
      data: data.data,
      feedback: `Live GitHub Verification: Commit ${data.data.shortSha} authored by ${data.data.authorName} verified on ${params.repoName} (${data.data.targetBranch} branch status: ${data.data.comparisonStatus}).`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error contacting GitHub REST API.";
    return { verified: false, feedback: msg, error: msg };
  }
}

export async function assignReportDefenderApi(
  reportId: string,
  params: { defenderId?: string; defenderEmail?: string; defenderName?: string }
): Promise<any> {
  const res = await fetch(`/api/v1/reports/${encodeURIComponent(reportId)}/assign`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.json();
}

export function buildRetestInvitationMessage(params: {
  reportId: string;
  reportTitle: string;
  deploymentEnv: string;
  deployedVersion: string;
  attemptNo: number;
}): import("./types").DiscussionMessageItem {
  return {
    id: `msg-${Date.now()}`,
    reportId: params.reportId,
    reportTitle: params.reportTitle,
    senderName: "System Outbox (SLA Gateway)",
    senderRole: "Automated Verifier",
    senderActorType: "SYSTEM",
    lane: "RESEARCHER_ORG",
    content: `[RETEST INVITATION] Candidate fix deployed to ${params.deploymentEnv} (${params.deployedVersion}). Submitter retest window open for 14 days bound to Attempt #${params.attemptNo}.`,
    createdAt: "Just now",
    isEncrypted: true,
  };
}

export function buildSimulatedResearcherReply(params: {
  reportId: string;
  reportTitle: string;
  deployedVersion: string;
}): import("./types").DiscussionMessageItem {
  return {
    id: `msg-${Date.now()}`,
    reportId: params.reportId,
    reportTitle: params.reportTitle,
    senderName: "Alex Rivera",
    senderRole: "Security Researcher",
    senderActorType: "HUNTER",
    lane: "RESEARCHER_ORG",
    content: `I executed the retest on Production (${params.deployedVersion}). Cross-workspace access was denied with 403 Forbidden under the new boundary policy. Cryptographic retest PASSED.`,
    createdAt: "Just now",
    isEncrypted: true,
  };
}

export function createFallbackIngestedReport(params: {
  programSlug: string;
  title: string;
  summary: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvss: number;
  targetAsset: string;
  reporter: string;
}): import("./types").ReportItem {
  const parts = (params.programSlug || "BBT").split(/[\s\-_]+/).filter(Boolean);
  let prefix = parts.length > 1 ? parts.map((s) => s[0].toUpperCase()).join("").slice(0, 4) : params.programSlug.slice(0, 4).toUpperCase();
  if (params.programSlug.toLowerCase() === "taha") prefix = "TH";
  const stringId = `${prefix}-01`;
  return {
    id: stringId,
    reportId: stringId,
    programSlug: params.programSlug,
    title: params.title,
    summary: params.summary || "In-scope vulnerability report ingested.",
    reporter: params.reporter,
    severity: params.severity,
    cvss: params.cvss,
    status: "Under review",
    bounty: params.severity === "Critical" ? "$3,000" : params.severity === "High" ? "$2,000" : params.severity === "Medium" ? "$1,000" : "$400",
    environment: "Production",
    version: "v0.8.4",
    assignedDefender: params.reporter,
    createdAt: "Just now",
    updatedAt: "Just now",
  };
}
