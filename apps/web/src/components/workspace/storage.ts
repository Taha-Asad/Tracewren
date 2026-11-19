import {
  ProgramItem,
  ReportItem,
  TriageMemberItem,
  DiscussionMessageItem,
} from "./types";
import {
  INITIAL_PROGRAMS,
  INITIAL_REPORTS,
  INITIAL_TRIAGE_MEMBERS,
  INITIAL_DISCUSSIONS,
} from "./mock-data";

import { GithubConnectionState } from "./github/types";

export const STORAGE_KEYS = {
  PROGRAMS: "bbt_programs",
  REPORTS: "bbt_reports",
  TRIAGE_MEMBERS: "bbt_triage_members",
  DISCUSSIONS: "bbt_discussions",
  GITHUB_CONNECTION: "bbt_github_connection",
} as const;

export function getTenantStorageKey(baseKey: string, orgId?: string | null): string {
  const sanitizedOrg = (orgId || "org-acme-cyber").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${baseKey}_${sanitizedOrg}`;
}

export function loadSavedPrograms(orgId?: string | null): ProgramItem[] {
  if (typeof window === "undefined") {
    return orgId === "org-acme-cyber" || !orgId ? INITIAL_PROGRAMS : [];
  }
  try {
    // Purge legacy non-tenanted global key if present to prevent cross-tenant contamination
    if (localStorage.getItem("bbt_programs_list")) {
      localStorage.removeItem("bbt_programs_list");
    }

    const key = getTenantStorageKey(STORAGE_KEYS.PROGRAMS, orgId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Return tenant fallback on parse error
  }
  return orgId === "org-acme-cyber" || !orgId ? INITIAL_PROGRAMS : [];
}

export function savePrograms(items: ProgramItem[], orgId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = getTenantStorageKey(STORAGE_KEYS.PROGRAMS, orgId);
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSavedReports(orgId?: string | null): ReportItem[] {
  if (typeof window === "undefined") {
    return orgId === "org-acme-cyber" || !orgId ? INITIAL_REPORTS : [];
  }
  try {
    const key = getTenantStorageKey(STORAGE_KEYS.REPORTS, orgId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Return tenant fallback on parse error
  }
  return orgId === "org-acme-cyber" || !orgId ? INITIAL_REPORTS : [];
}

export function saveReports(items: ReportItem[], orgId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = getTenantStorageKey(STORAGE_KEYS.REPORTS, orgId);
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSavedMembers(orgId?: string | null): TriageMemberItem[] {
  if (typeof window === "undefined") {
    return orgId === "org-acme-cyber" || !orgId ? INITIAL_TRIAGE_MEMBERS : [];
  }
  try {
    const key = getTenantStorageKey(STORAGE_KEYS.TRIAGE_MEMBERS, orgId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Return tenant fallback on parse error
  }
  return orgId === "org-acme-cyber" || !orgId ? INITIAL_TRIAGE_MEMBERS : [];
}

export function saveMembers(items: TriageMemberItem[], orgId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = getTenantStorageKey(STORAGE_KEYS.TRIAGE_MEMBERS, orgId);
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSavedDiscussions(orgId?: string | null): DiscussionMessageItem[] {
  if (typeof window === "undefined") {
    return orgId === "org-acme-cyber" || !orgId ? INITIAL_DISCUSSIONS : [];
  }
  try {
    const key = getTenantStorageKey(STORAGE_KEYS.DISCUSSIONS, orgId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const seen = new Set<string>();
        const deduped: DiscussionMessageItem[] = [];
        for (const item of parsed) {
          if (item && item.id && !seen.has(item.id)) {
            seen.add(item.id);
            deduped.push(item);
          }
        }
        return deduped;
      }
    }
  } catch {
    // Return tenant fallback on parse error
  }
  return orgId === "org-acme-cyber" || !orgId ? INITIAL_DISCUSSIONS : [];
}

export function saveDiscussions(items: DiscussionMessageItem[], orgId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = getTenantStorageKey(STORAGE_KEYS.DISCUSSIONS, orgId);
    const seen = new Set<string>();
    const deduped: DiscussionMessageItem[] = [];
    for (const item of items) {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        deduped.push(item);
      }
    }
    localStorage.setItem(key, JSON.stringify(deduped));
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchServerPrograms(
  orgId?: string | null,
  orgSlug?: string | null
): Promise<ProgramItem[]> {
  try {
    const params = new URLSearchParams();
    if (orgId && orgId.trim()) params.set("orgId", orgId.trim());
    if (orgSlug && orgSlug.trim()) params.set("orgSlug", orgSlug.trim());
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`/api/v1/programs${query}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id || `prog-${d.slug}`,
          name: d.name || d.slug,
          slug: d.slug,
          visibility: d.visibility === "INVITE_ONLY" ? "INVITE_ONLY" : "PUBLIC",
          inScope:
            Array.isArray(d.inScope) && d.inScope.length > 0
              ? d.inScope
              : [`https://${d.slug}.caulvyn.com/*`, `api.${d.slug}.caulvyn.com`],
          outOfScope: ["Third-party integrations", "Denial of service testing"],
          safeHarborPolicy: d.policyMarkdown || "Standard safe harbor terms applied.",
          activeReportsCount: d.activeReportsCount || 0,
          defendersCount: d.defendersCount || 1,
          rfc9116Url: `/api/v1/programs/${d.slug}/security.txt`,
          createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "Active",
        }));
      }
    }
  } catch {
    // Fallback if network offline
  }
  return [];
}

export async function fetchServerDefenders(
  orgId?: string | null,
  orgSlug?: string | null
): Promise<TriageMemberItem[]> {
  try {
    const params = new URLSearchParams();
    if (orgId && orgId.trim()) params.set("orgId", orgId.trim());
    if (orgSlug && orgSlug.trim()) params.set("orgSlug", orgSlug.trim());
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`/api/v1/defenders${query}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback if offline
  }
  return [];
}

export async function fetchServerReports(
  orgId?: string | null,
  orgSlug?: string | null
): Promise<ReportItem[]> {
  try {
    const params = new URLSearchParams();
    if (orgId && orgId.trim()) params.set("orgId", orgId.trim());
    if (orgSlug && orgSlug.trim()) params.set("orgSlug", orgSlug.trim());
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`/api/v1/reports${query}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback if offline
  }
  return [];
}

export async function createReportOnServer(reportData: {
  organizationId?: string | null;
  orgSlug?: string | null;
  programSlug?: string;
  title: string;
  summary: string;
  severity: string;
  cvss: number;
  targetAsset?: string;
  reporter?: string;
}): Promise<ReportItem | null> {
  try {
    const res = await fetch("/api/v1/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.report) {
        return data.report;
      }
    }
  } catch {
    // Fallback if offline
  }
  return null;
}

export function loadGithubConnection(orgId?: string | null): GithubConnectionState | null {
  if (typeof window === "undefined") return null;
  try {
    const key = getTenantStorageKey(STORAGE_KEYS.GITHUB_CONNECTION, orgId);
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore parse error
  }
  return null;
}

export function saveGithubConnection(conn: GithubConnectionState | null, orgId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = getTenantStorageKey(STORAGE_KEYS.GITHUB_CONNECTION, orgId);
    if (!conn) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(conn));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function syncServerTenantState(
  orgId: string | null | undefined,
  orgSlug: string | null | undefined,
  callbacks: {
    onPrograms?: (programs: ProgramItem[]) => void;
    onDefenders?: (defenders: TriageMemberItem[]) => void;
    onReports?: (reports: ReportItem[]) => void;
    onGithubConfig?: (config: GithubConnectionState | null) => void;
  }
): void {
  fetchServerPrograms(orgId, orgSlug).then((progs) => {
    if (progs && progs.length > 0 && callbacks.onPrograms) callbacks.onPrograms(progs);
  });
  fetchServerDefenders(orgId, orgSlug).then((defs) => {
    if (defs && defs.length > 0 && callbacks.onDefenders) callbacks.onDefenders(defs);
  });
  fetchServerReports(orgId, orgSlug).then((reps) => {
    if (reps && reps.length > 0 && callbacks.onReports) callbacks.onReports(reps);
  });
  if (callbacks.onGithubConfig && orgId && orgId !== "org-acme-cyber") {
    fetchServerGithubConfig(orgId).then((cfg) => {
      if (cfg && callbacks.onGithubConfig) callbacks.onGithubConfig(cfg);
    });
  }
}

export async function fetchServerDiscussions(
  reportId: string
): Promise<DiscussionMessageItem[]> {
  try {
    const res = await fetch(`/api/v1/reports/${encodeURIComponent(reportId)}/discussions`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Offline fallback
  }
  return [];
}

export async function postServerDiscussion(
  reportId: string,
  msg: Partial<DiscussionMessageItem>
): Promise<DiscussionMessageItem | null> {
  try {
    const res = await fetch(`/api/v1/reports/${encodeURIComponent(reportId)}/discussions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.message) {
        return data.message;
      }
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function fetchServerRemediation(reportId: string): Promise<any> {
  try {
    const res = await fetch(`/api/v1/reports/${encodeURIComponent(reportId)}/remediation`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function postServerRemediation(
  reportId: string,
  data: any
): Promise<any> {
  try {
    const res = await fetch(`/api/v1/reports/${encodeURIComponent(reportId)}/remediation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      return json?.remediation || null;
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function recordServerRetest(
  reportId: string,
  data: any
): Promise<any> {
  try {
    const res = await fetch(`/api/v1/reports/${encodeURIComponent(reportId)}/retest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      return json?.retest || null;
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function revokeServerDefender(defenderId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/defenders/${encodeURIComponent(defenderId)}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function patchServerCvss(
  reportId: string,
  score: number,
  vector: string
): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/reports/${encodeURIComponent(reportId)}/cvss`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvssScore: score, cvssVector: vector }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchServerGithubConfig(
  orgId?: string | null
): Promise<GithubConnectionState | null> {
  if (!orgId || orgId === "org-acme-cyber") return null;
  try {
    const res = await fetch(`/api/v1/organizations/${encodeURIComponent(orgId)}/github`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object") {
        return data;
      }
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function saveServerGithubConfig(
  orgId: string | null | undefined,
  config: GithubConnectionState | null
): Promise<boolean> {
  if (!orgId || orgId === "org-acme-cyber") return false;
  try {
    const res = await fetch(`/api/v1/organizations/${encodeURIComponent(orgId)}/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return res.ok;
  } catch {
    return false;
  }
}
