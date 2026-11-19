"use client";

import React, { useEffect, useState } from "react";
import { Box, Loader, Stack, Text } from "@mantine/core";

// Workspace Types & Mock Data
import {
  DiscussionMessageItem,
  Membership,
  ProgramItem,
  ReportItem,
  TriageMemberItem,
  UserProfile,
  ViewMode,
  formatRole,
} from "@/components/workspace/types";
import {
  INITIAL_VERIFIED_COMMIT_DATA,
  DEMO_USER_SESSION,
} from "@/components/workspace/mock-data";
import {
  loadSavedPrograms,
  savePrograms,
  loadSavedReports,
  saveReports,
  loadSavedMembers,
  saveMembers,
  loadSavedDiscussions,
  saveDiscussions,
  loadGithubConnection,
  createReportOnServer,
  syncServerTenantState,
  fetchServerDiscussions,
  postServerDiscussion,
  fetchServerRemediation,
  postServerRemediation,
  recordServerRetest,
  revokeServerDefender,
  fetchServerGithubConfig,
} from "@/components/workspace/storage";
import {
  createWorkspaceApi,
  createProgramApi,
  sendMemberInviteApi,
  verifyGitHubCommitApi,
  executeGitHubCommitVerification,
  assignReportDefenderApi,
  buildRetestInvitationMessage,
  buildSimulatedResearcherReply,
  createFallbackIngestedReport,
} from "@/components/workspace/workspace-actions";

// Workspace Navigation Shell
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";

// Primary Views
import { GovernanceOverviewView } from "@/components/workspace/views/GovernanceOverviewView";
import { WorkspacesDirectoryView } from "@/components/workspace/views/WorkspacesDirectoryView";
import { InHouseProgramsView } from "@/components/workspace/views/InHouseProgramsView";
import { ReportsQueueView } from "@/components/workspace/views/ReportsQueueView";
import { TriageMembersView } from "@/components/workspace/views/TriageMembersView";
import { DiscussionsDirectoryView } from "@/components/workspace/views/DiscussionsDirectoryView";
import { ReportDetailView } from "@/components/workspace/report/ReportDetailView";
import { CvssCalculatorPageView } from "@/components/workspace/views/CvssCalculatorPageView";

// Dialog Modals Container
import { WorkspaceModalsContainer } from "@/components/workspace/modals/WorkspaceModalsContainer";
import { InviteResult } from "@/components/workspace/modals/InviteMemberModal";

export default function WorkspacePage() {
  // Session & Identity State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Navigation & Shell State
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpened, setMobileNavOpened] = useState(false);
  const [reportFilter, setReportFilter] = useState<"all" | "retest" | "resolved">("all");
  const [selectedProgramSlug, setSelectedProgramSlug] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("overview");
  const [discussionLane, setDiscussionLane] = useState<"RESEARCHER_ORG" | "REVIEWER_INTERNAL">("RESEARCHER_ORG");

  // Domain Collections State
  const [discussions, setDiscussions] = useState<DiscussionMessageItem[]>([]);
  const [programsList, setProgramsList] = useState<ProgramItem[]>([]);
  const [triageMembers, setTriageMembers] = useState<TriageMemberItem[]>([]);
  const [reportsList, setReportsList] = useState<ReportItem[]>([]);

  // Modals Visibility & Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState(""), [newSlug, setNewSlug] = useState(""), [newDomain, setNewDomain] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false), [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createProgOpen, setCreateProgOpen] = useState(false);
  const [newProgName, setNewProgName] = useState(""), [newProgSlug, setNewProgSlug] = useState("");
  const [newProgVisibility, setNewProgVisibility] = useState<string>("PUBLIC"), [newProgScope, setNewProgScope] = useState("");
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false), [sendingInvite, setSendingInvite] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState(""), [newMemberRole, setNewMemberRole] = useState<string>("TRIAGER"), [newMemberProgram, setNewMemberProgram] = useState("Core Vulnerability Disclosure");
  const [lastInviteResult, setLastInviteResult] = useState<InviteResult | null>(null);
  const [copiedId, setCopiedId] = useState(false), [verifiedModalOpen, setVerifiedModalOpen] = useState(false), [masterKeyModalOpen, setMasterKeyModalOpen] = useState(false);

  // Triage Member Revocation State (SRS §2.4.2)
  const [removeMemberTarget, setRemoveMemberTarget] = useState<TriageMemberItem | null>(null);
  const [removingMember, setRemovingMember] = useState(false), [memberActionSuccess, setMemberActionSuccess] = useState<string | null>(null);

  // Dual-Lane Discussion Admin State
  const [threadLocked, setThreadLocked] = useState(false), [broadcastMode, setBroadcastMode] = useState(false), [newDiscussionText, setNewDiscussionText] = useState("");

  // FR-6 Git-Linked Remediation Verification State
  const [remediationAttempt, setRemediationAttempt] = useState<number>(1);
  const [remediationState, setRemediationState] = useState<"FIX_PROPOSED" | "RETEST_PENDING" | "VERIFIED_RESEARCHER" | "ACCEPTED">("RETEST_PENDING");
  const [repoName, setRepoName] = useState<string>("acme-cyber/core-api"), [commitSha, setCommitSha] = useState<string>("c4f92d8e01b7a2d3f4e5a6b7c8d9e0f1a2b3c4d5");
  const [targetBranch, setTargetBranch] = useState<string>("main"), [deploymentEnv, setDeploymentEnv] = useState<string>("Production");
  const [deployedVersion, setDeployedVersion] = useState<string>("v0.8.4"), [deployedAt, setDeployedAt] = useState<string>("19 Oct 2026, 14:00 UTC");
  const [verifyingCommit, setVerifyingCommit] = useState<boolean>(false), [commitVerified, setCommitVerified] = useState<boolean>(true), [verifiedCommitData, setVerifiedCommitData] = useState<any>(INITIAL_VERIFIED_COMMIT_DATA);
  const [commitError, setCommitError] = useState<string | null>(null), [remediationFeedback, setRemediationFeedback] = useState<string | null>(null);

  // Real-Time Socket.io Discussion State
  const [researcherTyping, setResearcherTyping] = useState<boolean>(false);
  const [socketLatency] = useState<number>(24);

  // Phase 1: Intake & Scope Verification State (Gate 1 - DoR)
  const [intakeModalOpen, setIntakeModalOpen] = useState(false);
  const [intakeProgramSlug, setIntakeProgramSlug] = useState("portal-disclosure"), [intakeTargetAsset, setIntakeTargetAsset] = useState("https://api.caulvyn.com/export");
  const [intakeTitle, setIntakeTitle] = useState(""), [intakeSummary, setIntakeSummary] = useState("");
  const [intakeSeverity, setIntakeSeverity] = useState<"Critical" | "High" | "Medium" | "Low">("Medium"), [intakeCvss, setIntakeCvss] = useState<number>(6.5);
  const [intakeSubmitting, setIntakeSubmitting] = useState(false), [intakeFeedback, setIntakeFeedback] = useState<string | null>(null), [showRawOpenPgpArmor, setShowRawOpenPgpArmor] = useState(false);

  // Auto-slug generator for new workspace
  useEffect(() => {
    if (!slugManuallyEdited && newOrgName) {
      const generated = newOrgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
      setNewSlug(generated);
    }
  }, [newOrgName, slugManuallyEdited]);

  // Load user profile on mount
  const loadProfile = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setMemberships(data.memberships || []);
        if (data.memberships?.length > 0 && !activeOrgId) {
          const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
          const paramOrg = urlParams?.get("orgId") || urlParams?.get("org");
          const paramSlug = urlParams?.get("orgSlug");
          const savedOrgId = typeof window !== "undefined" && data.user?.id ? localStorage.getItem(`bbt_active_org_${data.user.id}`) : null;
          const matchedOrg = (paramOrg && data.memberships.find((m: any) => m.organizationId === paramOrg)) ||
            (paramSlug && data.memberships.find((m: any) => m.organizationSlug === paramSlug)) ||
            (savedOrgId && data.memberships.find((m: any) => m.organizationId === savedOrgId));
          const targetOrgId = matchedOrg ? matchedOrg.organizationId : data.memberships[0].organizationId;
          setActiveOrgId(targetOrgId);
          if (typeof window !== "undefined" && data.user?.id) localStorage.setItem(`bbt_active_org_${data.user.id}`, targetOrgId);
        }
        setLoading(false);
        return;
      }

      // Fail-closed: any non-200 auth check redirects immediately without rendering workspace
      window.location.replace("/auth/login");
      return;
    } catch {
      window.location.replace("/auth/login");
      return;
    }
  };

  useEffect(() => {
    loadProfile();
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const v = p.get("view");
      if (v && ["dashboard", "workspaces", "programs", "reports", "cvss-calculator", "triage-members", "discussions", "report"].includes(v)) setViewMode(v as ViewMode);
      if (p.get("report")) setSelectedReportId(p.get("report")!);
      if (p.get("tab")) { setActiveTab(p.get("tab")!); setViewMode("report"); }
      if (p.get("modal") === "master-key") setMasterKeyModalOpen(true);
    }
  }, []);

  const activeOrg = memberships.find((m) => m.organizationId === activeOrgId) || memberships[0];
  const currentOrgId = activeOrg?.organizationId || activeOrgId || "org-acme-cyber";
  const currentOrgSlug = activeOrg?.organizationSlug || "acme-cyber";
  const isOrgOwner = activeOrg?.role === "ORG_OWNER" || activeOrg?.role === "Owner";
  const activeReport = reportsList.find((r) => r.id === selectedReportId) || reportsList[0];
  const userInitial = (user?.fullName?.trim()?.[0] || user?.email?.[0] || "T").toUpperCase();

  // Multi-Tenant Isolation Hydration (SRS §2 & Rule 20)
  useEffect(() => {
    if (!activeOrgId && memberships.length > 0) {
      setActiveOrgId(memberships[0].organizationId);
      return;
    }

    setSelectedProgramSlug(null);

    const savedConn = loadGithubConnection(currentOrgId);
    if (savedConn?.selectedRepo) {
      setRepoName(savedConn.selectedRepo);
      if (savedConn.selectedBranch) setTargetBranch(savedConn.selectedBranch);
    } else if (currentOrgSlug && currentOrgSlug !== "acme-cyber" && repoName === "acme-cyber/core-api") {
      setRepoName(`${currentOrgSlug}/core-api`);
    }

    setProgramsList(loadSavedPrograms(currentOrgId));
    const savedReps = loadSavedReports(currentOrgId);
    setReportsList(savedReps);
    if (savedReps.length > 0) setSelectedReportId((prev) => savedReps.some((r) => r.id === prev) ? prev : savedReps[0].id);
    setTriageMembers(loadSavedMembers(currentOrgId));
    setDiscussions(loadSavedDiscussions(currentOrgId));

    syncServerTenantState(currentOrgId, currentOrgSlug, {
      onPrograms: (serverProgs) => {
        setProgramsList((prev) => {
          if (currentOrgId !== "org-acme-cyber" && serverProgs.length > 0) {
            savePrograms(serverProgs, currentOrgId);
            return serverProgs;
          }
          const existing = new Set(prev.map((p) => p.slug));
          const additions = serverProgs.filter((sp) => !existing.has(sp.slug));
          if (additions.length === 0) return prev;
          const merged = [...prev, ...additions];
          savePrograms(merged, currentOrgId);
          return merged;
        });
        if (serverProgs.length > 0) {
          setIntakeProgramSlug((prev) => serverProgs.some((p) => p.slug === prev) ? prev : serverProgs[0].slug);
        }
      },
      onDefenders: (serverDefs) => {
        setTriageMembers((prev) => {
          if (currentOrgId !== "org-acme-cyber" && serverDefs.length > 0) {
            saveMembers(serverDefs, currentOrgId);
            return serverDefs;
          }
          const existing = new Set(prev.map((m) => m.email.toLowerCase()));
          const additions = serverDefs.filter((d) => !existing.has(d.email.toLowerCase()));
          if (additions.length === 0) return prev;
          const merged = [...prev, ...additions];
          saveMembers(merged, currentOrgId);
          return merged;
        });
      },
      onReports: (serverReps) => {
        setReportsList((prev) => {
          if (currentOrgId !== "org-acme-cyber" && serverReps.length > 0) {
            saveReports(serverReps, currentOrgId);
            return serverReps;
          }
          const existing = new Set(prev.map((r) => r.id));
          const additions = serverReps.filter((r) => !existing.has(r.id));
          if (additions.length === 0) return prev;
          const merged = [...additions, ...prev];
          saveReports(merged, currentOrgId);
          return merged;
        });
        if (serverReps.length > 0) {
          setSelectedReportId((prev) => serverReps.some((r) => r.id === prev) ? prev : serverReps[0].id);
        }
      },
      onGithubConfig: (cfg) => {
        if (cfg?.selectedRepo) {
          setRepoName(cfg.selectedRepo);
          if (cfg.selectedBranch) setTargetBranch(cfg.selectedBranch);
        }
      },
    });
  }, [activeOrgId, memberships, currentOrgId, currentOrgSlug]);

  // Real-Time Database Hydration for Selected Report (Discussions & Remediation with 3s live polling)
  useEffect(() => {
    if (!selectedReportId) return;

    const pollReportData = () => {
      fetchServerDiscussions(selectedReportId).then((serverMsgs) => {
        if (serverMsgs && serverMsgs.length > 0) {
          setDiscussions((prev) => {
            const msgMap = new Map<string, DiscussionMessageItem>();
            for (const sm of serverMsgs) {
              msgMap.set(sm.id, { ...sm, reportId: selectedReportId });
            }
            for (const pm of prev) {
              if (!msgMap.has(pm.id)) msgMap.set(pm.id, pm);
            }
            const merged = Array.from(msgMap.values());
            saveDiscussions(merged, currentOrgId);
            return merged;
          });
        }
      });
      fetchServerRemediation(selectedReportId).then((rem) => {
        if (rem) {
          if (rem.attemptNo) setRemediationAttempt(rem.attemptNo);
          if (rem.status) {
            setRemediationState(
              rem.status === "DEPLOYED" ? "RETEST_PENDING" :
              rem.status === "VERIFIED" ? "VERIFIED_RESEARCHER" :
              rem.status === "PROPOSED" ? "FIX_PROPOSED" : "ACCEPTED"
            );
          }
          if (rem.commitSha) setCommitSha(rem.commitSha);
          if (rem.targetBranch) setTargetBranch(rem.targetBranch);
          if (rem.deploymentEnv) setDeploymentEnv(rem.deploymentEnv);
          if (rem.deployedVersion) setDeployedVersion(rem.deployedVersion);
        }
      });
    };

    pollReportData();
    const interval = setInterval(pollReportData, 3000);
    return () => clearInterval(interval);
  }, [selectedReportId, currentOrgId]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      window.location.href = "/auth/login";
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!newOrgName.trim() || !newSlug.trim()) {
      setCreateError("Workspace name and URL slug are required.");
      return;
    }
    setCreating(true);
    try {
      const created = await createWorkspaceApi({
        orgName: newOrgName.trim(),
        slug: newSlug.trim(),
        domain: newDomain.trim() || undefined,
      });
      setModalOpen(false);
      setNewOrgName("");
      setNewSlug("");
      setNewDomain("");
      setSlugManuallyEdited(false);
      window.location.href = `/onboarding?slug=${encodeURIComponent(
        created.organizationSlug || created.slug || newSlug.trim()
      )}`;
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to create workspace.");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgName.trim() || !newProgSlug.trim()) return;

    const newProg = await createProgramApi({
      name: newProgName.trim(),
      slug: newProgSlug.trim(),
      visibility: newProgVisibility === "INVITE_ONLY" ? "INVITE_ONLY" : "PUBLIC",
      inScope: newProgScope.split("\n").filter((s) => s.trim().length > 0),
      safeHarborPolicy: "Standard safe harbor terms applied.",
      organizationId: currentOrgId,
      orgSlug: currentOrgSlug,
    });

    setProgramsList((prev) => {
      const updated = [...prev, newProg];
      savePrograms(updated, currentOrgId);
      return updated;
    });

    setCreateProgOpen(false);
    setNewProgName("");
    setNewProgSlug("");
    setNewProgScope("");
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    setSendingInvite(true);
    const targetEmail = newMemberEmail.trim();
    try {
      const { data, newMember } = await sendMemberInviteApi({
        email: targetEmail,
        role: newMemberRole,
        programName: newMemberProgram,
        organizationId: currentOrgId,
        programSlug: currentOrgSlug,
        inviterName: user?.fullName || "Taha Asadullah",
        inviterEmail: user?.email || "tahaasad709@gmail.com",
      });

      if (data?.success) {
        setLastInviteResult({
          success: true,
          onboardingUrl: data.onboardingUrl,
          directAccepted: data.directAccepted,
          message: data.message,
          recipient: targetEmail,
        });
      }
      setMemberActionSuccess(data?.message || `Invitation dispatched to ${targetEmail} for "${newMemberProgram}".`);
      setTriageMembers((prev) => {
        const updated = [...prev, newMember];
        saveMembers(updated, currentOrgId);
        return updated;
      });
    } finally {
      setSendingInvite(false);
    }
  };

  const handleConfirmRemoveMember = () => {
    if (!removeMemberTarget || removeMemberTarget.role === "ORG_OWNER") return;
    setRemovingMember(true);
    if (removeMemberTarget.id && !removeMemberTarget.id.startsWith("m-")) revokeServerDefender(removeMemberTarget.id);
    setTimeout(() => {
      setTriageMembers((prev) => {
        const updated = prev.filter((m) => m.id !== removeMemberTarget.id);
        saveMembers(updated, currentOrgId);
        return updated;
      });
      setMemberActionSuccess(`Revoked triage access for ${removeMemberTarget.name}. PGP keys rotated per SRS §2.4.2.`);
      setTimeout(() => setMemberActionSuccess(null), 4500);
      setRemovingMember(false);
      setRemoveMemberTarget(null);
    }, 250);
  };

  const handlePostDiscussionMessage = () => {
    if (!newDiscussionText.trim() || threadLocked) return;
    const isOwner = activeOrg?.role === "ORG_OWNER" || activeOrg?.role === "Owner";
    const roleLabel = isOwner ? "Organization Owner" : formatRole(activeOrg?.role);
    const contentText = broadcastMode ? `[ADMIN MILESTONE] ${newDiscussionText.trim()}` : newDiscussionText.trim();
    const targetReportId = selectedReportId || reportsList[0]?.id || "";
    if (!targetReportId) return;

    const newMsg: DiscussionMessageItem = {
      id: `msg-${Date.now()}`,
      reportId: targetReportId,
      reportTitle: activeReport?.title || "Security Vulnerability Report",
      senderName: user?.fullName || user?.email?.split("@")[0] || "Defender",
      senderRole: roleLabel,
      senderActorType: "DEFENDER",
      lane: discussionLane,
      content: contentText,
      createdAt: "Just now",
      isEncrypted: true,
    };

    setDiscussions((prev) => {
      const updated = [...prev, newMsg];
      saveDiscussions(updated, currentOrgId);
      return updated;
    });
    setNewDiscussionText("");
    postServerDiscussion(targetReportId, {
      ...newMsg,
      userId: user?.id,
      senderEmail: user?.email,
      senderRole: roleLabel,
    }).then((savedMsg) => {
      if (savedMsg) {
        setDiscussions((prev) => {
          const normalized = { ...savedMsg, reportId: targetReportId };
          const updated = prev.map((m) => (m.id === newMsg.id ? normalized : m));
          saveDiscussions(updated, currentOrgId);
          return updated;
        });
      }
    });
  };

  const handleDeleteDiscussion = (msgId: string) => {
    const currentName = user?.fullName || "Sarah Chen";
    setDiscussions((prev) => {
      const updated = prev.filter((d) => d.id !== msgId || d.senderName !== currentName);
      saveDiscussions(updated, currentOrgId);
      return updated;
    });
  };

  const handleVerifyGitHubCommit = async (tokenOverride?: string) => {
    setVerifyingCommit(true);
    setCommitError(null);
    setRemediationFeedback(null);
    const res = await executeGitHubCommitVerification({ repoName, commitSha, targetBranch, tokenOverride });
    setCommitVerified(res.verified);
    if (res.data) setVerifiedCommitData(res.data);
    if (res.error) setCommitError(res.error);
    setRemediationFeedback(res.feedback);
    setVerifyingCommit(false);
  };

  const handleAssignDefender = async (defender: TriageMemberItem) => {
    try {
      const res = await assignReportDefenderApi(selectedReportId, {
        defenderId: defender.userId,
        defenderEmail: defender.email,
        defenderName: defender.name,
      });
      if (res?.success) {
        setReportsList((prev) => {
          const updated = prev.map((r) =>
            r.id === selectedReportId
              ? {
                  ...r,
                  assignedDefender: defender.name,
                  assignedDefenderId: defender.userId,
                  assignedDefenderEmail: defender.email,
                }
              : r
          );
          saveReports(updated, currentOrgId);
          return updated;
        });
        setRemediationFeedback(`Report successfully assigned to ${defender.name} (${formatRole(defender.role)}).`);
      }
    } catch (err: unknown) {
      setRemediationFeedback(`Failed to assign defender: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleRequestRetest = () => {
    if (!deploymentEnv || !deployedAt) {
      setRemediationFeedback("Deployment environment and timestamp are required before requesting retest per FR-6.1c.");
      return;
    }
    setRemediationState("RETEST_PENDING");
    setRemediationFeedback(`Retest invitation dispatched to researcher Alex Rivera. 14-day SLA clock active per SRS §3.6.1c.`);
    const sysMsg = buildRetestInvitationMessage({
      reportId: selectedReportId,
      reportTitle: activeReport.title,
      deploymentEnv,
      deployedVersion,
      attemptNo: remediationAttempt,
    });
    setDiscussions((prev) => {
      const updated = [...prev, sysMsg];
      saveDiscussions(updated, currentOrgId);
      return updated;
    });
    postServerRemediation(selectedReportId, {
      attemptNo: remediationAttempt,
      status: "DEPLOYED",
      commitSha,
      targetBranch,
      deploymentEnv,
      deployedVersion,
    });
    postServerDiscussion(selectedReportId, sysMsg);
  };

  const handleCancelProposedFix = () => {
    setRemediationState("ACCEPTED");
    const next = remediationAttempt + 1;
    setRemediationAttempt(next);
    setCommitVerified(false);
    setRemediationFeedback(`Proposed fix superseded. Next attempt: #${next} per FR-6.1d.`);
    postServerRemediation(selectedReportId, { attemptNo: next, status: "SUPERSEDED" });
  };

  const handleRecordRetestPass = () => {
    setRemediationState("VERIFIED_RESEARCHER");
    setReportsList((prev) => {
      const updated = prev.map((r) => r.id === selectedReportId ? { ...r, status: "Resolved" as const, updatedAt: "Just now" } : r);
      saveReports(updated, currentOrgId);
      return updated;
    });
    setRemediationFeedback("Researcher Alex Rivera attested retest pass. Report transitioned to VERIFIED_RESEARCHER per FR-7.2.");
    recordServerRetest(selectedReportId, { outcome: "PASS", fixConfirmed: true, environment: deploymentEnv });
  };

  const handleRecordRetestFail = () => {
    setRemediationState("ACCEPTED");
    const next = remediationAttempt + 1;
    setRemediationAttempt(next);
    setCommitVerified(false);
    setRemediationFeedback(`Researcher retest failed. State looped back to ACCEPTED requiring attempt #${next} per FR-7.4.`);
    recordServerRetest(selectedReportId, { outcome: "FAIL", fixConfirmed: false, environment: deploymentEnv });
  };

  const handleSimulateResearcherReply = () => {
    if (researcherTyping) return;
    setResearcherTyping(true);
    setTimeout(() => {
      const researcherMsg = buildSimulatedResearcherReply({
        reportId: selectedReportId,
        reportTitle: activeReport.title,
        deployedVersion,
      });
      setDiscussions((prev) => {
        const updated = [...prev, researcherMsg];
        saveDiscussions(updated, currentOrgId);
        return updated;
      });
      postServerDiscussion(selectedReportId, researcherMsg);
      setResearcherTyping(false);
    }, 1200);
  };

  const handleCopyReportId = () => {
    navigator.clipboard.writeText(selectedReportId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleIngestReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeTitle.trim()) return;

    setIntakeSubmitting(true);
    const authorName = user?.fullName || user?.email || "Taha Asadullah";
    try {
      const serverReport = await createReportOnServer({
        organizationId: currentOrgId,
        orgSlug: currentOrgSlug,
        programSlug: intakeProgramSlug,
        title: intakeTitle,
        summary: intakeSummary,
        severity: intakeSeverity,
        cvss: intakeCvss,
        targetAsset: intakeTargetAsset,
        reporter: authorName,
      });

      const reportToAdd = serverReport || createFallbackIngestedReport({
        programSlug: intakeProgramSlug,
        title: intakeTitle,
        summary: intakeSummary,
        severity: intakeSeverity,
        cvss: intakeCvss,
        targetAsset: intakeTargetAsset,
        reporter: authorName,
      });

      setReportsList((prev) => {
        const updated = [reportToAdd, ...prev.filter((r) => r.id !== reportToAdd.id)];
        saveReports(updated, currentOrgId);
        return updated;
      });
      setSelectedReportId(reportToAdd.id);
      setIntakeFeedback(`Report ${reportToAdd.id} ingested successfully under Phase 1 Intake.`);
      setIntakeTitle("");
      setIntakeSummary("");
      setIntakeModalOpen(false);
    } catch {
      // Offline fallback
    } finally {
      setIntakeSubmitting(false);
    }
  };

  const handleConfirmInternalVerification = (att: any) => {
    setRemediationFeedback(`Internal verification attested by ${att.testerName}: Outcome [${att.outcome}] in ${att.environment}.`);
    recordServerRetest(activeReport?.id || selectedReportId, {
      outcome: att.outcome,
      fixConfirmed: att.outcome === "PASS",
      environment: att.environment,
      notes: att.notes,
      evidenceLog: att.evidenceLog,
      testerName: att.testerName,
    });
    if (att.outcome === "PASS") {
      setReportsList((prev) => {
        const updated = prev.map((r) => (r.id === selectedReportId ? { ...r, status: "Resolved" as const, updatedAt: "Just now" } : r));
        saveReports(updated, currentOrgId);
        return updated;
      });
    }
  };

  const handleIntakeSeverityChange = (sev: "Critical" | "High" | "Medium" | "Low") => {
    setIntakeSeverity(sev);
    setIntakeCvss(sev === "Critical" ? 9.8 : sev === "High" ? 7.8 : sev === "Medium" ? 6.5 : 3.1);
  };

  if (loading) {
    return (
      <Box style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--canvas-bg)" }}>
        <Stack align="center" gap="sm">
          <Loader size="md" color="teal" />
          <Text size="sm" c="dimmed">Loading authenticated security workspace...</Text>
        </Stack>
      </Box>
    );
  }

  const reportDiscussions = discussions.filter((d) => {
    const matchesReport =
      d.reportId === selectedReportId ||
      (activeReport && (d.reportId === activeReport.id || d.reportId === activeReport.reportId || d.reportId === (activeReport as any).uuid));
    return matchesReport && d.lane === discussionLane;
  });

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--canvas-bg)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Top Application Header */}
      <WorkspaceHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedReportId={selectedReportId}
        activeOrg={activeOrg}
        user={user}
        setMobileMenuOpen={setMobileNavOpened}
        setSelectedReportId={setSelectedReportId}
        selectedProgramSlug={selectedProgramSlug}
        activeReportStatus={activeReport?.status}
      />

      {/* Main Workspace Workspace Layout */}
      <Box style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Responsive Sidebar Navigation */}
        <WorkspaceSidebar
          viewMode={viewMode}
          setViewMode={setViewMode}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mobileMenuOpen={mobileNavOpened}
          setMobileMenuOpen={setMobileNavOpened}
          activeOrg={activeOrg}
          memberships={memberships}
          setActiveOrgId={(id) => {
            setActiveOrgId(id);
            if (typeof window !== "undefined" && user?.id) {
              localStorage.setItem(`bbt_active_org_${user.id}`, id);
            }
          }}
          setModalOpen={setModalOpen}
          user={user}
          handleLogout={handleLogout}
          loggingOut={loggingOut}
          programsList={programsList}
          reportsList={reportsList}
          triageMembers={triageMembers}
          discussions={discussions}
          onOpenMasterKeyModal={() => setMasterKeyModalOpen(true)}
          onSelectProgramSlug={setSelectedProgramSlug}
        />

        {/* Dynamic Viewport Container */}
        <Box style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
          {viewMode === "dashboard" && (
            <GovernanceOverviewView
              activeOrg={activeOrg}
              programsList={programsList}
              reportsList={reportsList}
              triageMembers={triageMembers}
              setCreateProgOpen={setCreateProgOpen}
              setInviteMemberOpen={setInviteMemberOpen}
              setViewMode={setViewMode}
              onSelectProgramReports={(slug) => { setSelectedProgramSlug(slug); setIntakeProgramSlug(slug); setViewMode("reports"); }}
            />
          )}

          {viewMode === "workspaces" && (
            <WorkspacesDirectoryView
              memberships={memberships}
              activeOrgId={currentOrgId}
              onSelectWorkspace={(id) => {
                setActiveOrgId(id);
                if (typeof window !== "undefined" && user?.id) localStorage.setItem(`bbt_active_org_${user.id}`, id);
                setViewMode("dashboard");
              }}
              onOpenCreateModal={() => setModalOpen(true)}
              userEmail={user?.email}
            />
          )}

          {viewMode === "programs" && (
            <InHouseProgramsView
              programsList={programsList}
              reportsList={reportsList}
              setCreateProgOpen={setCreateProgOpen}
              setViewMode={setViewMode}
              onSelectProgramReports={(slug) => { setSelectedProgramSlug(slug); setIntakeProgramSlug(slug); setViewMode("reports"); }}
            />
          )}

          {viewMode === "reports" && (
            <ReportsQueueView
              reportsList={reportsList}
              programsList={programsList}
              selectedProgramSlug={selectedProgramSlug}
              onSelectProgramSlug={setSelectedProgramSlug}
              reportFilter={reportFilter}
              setReportFilter={(f) => setReportFilter(f as any)}
              intakeFeedback={intakeFeedback}
              setIntakeFeedback={setIntakeFeedback}
              setIntakeModalOpen={setIntakeModalOpen}
              setSelectedReportId={setSelectedReportId}
              setViewMode={setViewMode}
              currentUserEmail={user?.email}
              currentUserName={user?.fullName || "Taha Asadullah"}
            />
          )}

          {viewMode === "triage-members" && (
            <TriageMembersView
              triageMembers={triageMembers}
              memberActionSuccess={memberActionSuccess}
              onClearMemberActionSuccess={() => setMemberActionSuccess(null)}
              onOpenInviteModal={() => setInviteMemberOpen(true)}
              onSelectRemoveTarget={setRemoveMemberTarget}
            />
          )}

          {viewMode === "discussions" && (
            <DiscussionsDirectoryView
              discussions={discussions}
              discussionLane={discussionLane}
              onDiscussionLaneChange={setDiscussionLane}
              threadLocked={threadLocked}
              onToggleThreadLocked={() => setThreadLocked(!threadLocked)}
              newDiscussionText={newDiscussionText}
              onNewDiscussionTextChange={setNewDiscussionText}
              onPostDiscussionMessage={handlePostDiscussionMessage}
              onDeleteDiscussion={handleDeleteDiscussion}
              programsList={programsList}
              reportsList={reportsList}
              currentReportId={selectedReportId}
              onSelectReportId={setSelectedReportId}
              currentUserName={user?.fullName || user?.email?.split("@")[0] || "Taha Asadullah"}
            />
          )}

          {viewMode === "cvss-calculator" && <CvssCalculatorPageView />}

          {viewMode === "report" && (
            <ReportDetailView
              activeReport={activeReport}
              reportsList={reportsList}
              selectedReportId={selectedReportId}
              onSelectReportId={setSelectedReportId}
              onBackToReports={() => setViewMode("reports")}
              copiedId={copiedId}
              onCopyReportId={handleCopyReportId}
              onOpenVerifiedModal={() => setVerifiedModalOpen(true)}
              onOpenCreateProgModal={() => setCreateProgOpen(true)}
              onOpenInviteMemberModal={() => setInviteMemberOpen(true)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              reportDiscussions={reportDiscussions}
              discussionLane={discussionLane}
              onDiscussionLaneChange={setDiscussionLane}
              socketLatency={socketLatency}
              researcherTyping={researcherTyping}
              onSimulateResearcherReply={handleSimulateResearcherReply}
              newDiscussionText={newDiscussionText}
              onNewDiscussionTextChange={setNewDiscussionText}
              onPostDiscussionMessage={handlePostDiscussionMessage}
              remediationProps={{
                currentOrgId,
                remediationFeedback,
                onClearRemediationFeedback: () => setRemediationFeedback(null),
                remediationAttempt,
                remediationState,
                deploymentEnv,
                onDeploymentEnvChange: setDeploymentEnv,
                deployedVersion,
                onDeployedVersionChange: setDeployedVersion,
                deployedAt,
                onDeployedAtChange: setDeployedAt,
                repoName,
                onRepoNameChange: setRepoName,
                commitSha,
                onCommitShaChange: (sha) => {
                  setCommitSha(sha);
                  setCommitVerified(false);
                },
                targetBranch,
                onTargetBranchChange: setTargetBranch,
                verifyingCommit,
                commitVerified,
                verifiedCommitData,
                commitError,
                onClearCommitError: () => setCommitError(null),
                onVerifyGitHubCommit: handleVerifyGitHubCommit,
                onRequestRetest: handleRequestRetest,
                onCancelProposedFix: handleCancelProposedFix,
                onRecordRetestPass: handleRecordRetestPass,
                onRecordRetestFail: handleRecordRetestFail,
                onProposeNewFix: () => {
                  setRemediationState("FIX_PROPOSED");
                  setRemediationFeedback(
                    `Created new Remediation Record for Attempt #${remediationAttempt}. Propose candidate commit.`
                  );
                },
              }}
              showRawOpenPgpArmor={showRawOpenPgpArmor}
              onToggleShowRawOpenPgpArmor={() => setShowRawOpenPgpArmor(!showRawOpenPgpArmor)}
              triageMembers={triageMembers}
              onAssignDefender={handleAssignDefender}
            />
          )}
        </Box>
      </Box>

      {/* Global Dialog Modals Container */}
      <WorkspaceModalsContainer
        modalOpen={modalOpen}
        onCloseWorkspaceModal={() => setModalOpen(false)}
        handleCreateWorkspace={handleCreateWorkspace}
        createError={createError}
        newOrgName={newOrgName}
        onNewOrgNameChange={setNewOrgName}
        newSlug={newSlug}
        onNewSlugChange={setNewSlug}
        newDomain={newDomain}
        onNewDomainChange={setNewDomain}
        creating={creating}
        createProgOpen={createProgOpen}
        onCloseCreateProg={() => setCreateProgOpen(false)}
        handleCreateProgram={handleCreateProgram}
        newProgName={newProgName}
        onNewProgNameChange={setNewProgName}
        newProgSlug={newProgSlug}
        onNewProgSlugChange={setNewProgSlug}
        newProgVisibility={newProgVisibility}
        onNewProgVisibilityChange={setNewProgVisibility}
        newProgScope={newProgScope}
        onNewProgScopeChange={setNewProgScope}
        inviteMemberOpen={inviteMemberOpen}
        onCloseInviteMember={() => setInviteMemberOpen(false)}
        handleInviteMember={handleInviteMember}
        newMemberEmail={newMemberEmail}
        onNewMemberEmailChange={setNewMemberEmail}
        newMemberRole={newMemberRole}
        onNewMemberRoleChange={setNewMemberRole}
        newMemberProgram={newMemberProgram}
        onNewMemberProgramChange={setNewMemberProgram}
        programsList={programsList}
        sendingInvite={sendingInvite}
        lastInviteResult={lastInviteResult}
        onClearLastInviteResult={() => setLastInviteResult(null)}
        verifiedModalOpen={verifiedModalOpen}
        onCloseVerifiedModal={() => setVerifiedModalOpen(false)}
        activeReportTitle={activeReport?.title}
        activeReportId={activeReport?.id}
        onConfirmInternalVerification={handleConfirmInternalVerification}
        removeMemberTarget={removeMemberTarget}
        onCloseRevokeMember={() => setRemoveMemberTarget(null)}
        handleConfirmRemoveMember={handleConfirmRemoveMember}
        removingMember={removingMember}
        intakeModalOpen={intakeModalOpen}
        onCloseIntakeModal={() => setIntakeModalOpen(false)}
        handleIngestReport={handleIngestReport}
        intakeProgramSlug={intakeProgramSlug}
        onIntakeProgramSlugChange={setIntakeProgramSlug}
        intakeTargetAsset={intakeTargetAsset}
        onIntakeTargetAssetChange={setIntakeTargetAsset}
        intakeTitle={intakeTitle}
        onIntakeTitleChange={setIntakeTitle}
        intakeSummary={intakeSummary}
        onIntakeSummaryChange={setIntakeSummary}
        intakeSeverity={intakeSeverity}
        onIntakeSeverityChange={handleIntakeSeverityChange}
        intakeCvss={intakeCvss}
        intakeSubmitting={intakeSubmitting}
        masterKeyModalOpen={masterKeyModalOpen}
        onCloseMasterKeyModal={() => setMasterKeyModalOpen(false)}
        activeOrg={activeOrg}
      />
    </Box>
  );
}
