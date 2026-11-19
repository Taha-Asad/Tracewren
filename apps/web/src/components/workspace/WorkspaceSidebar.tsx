import React from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { ViewMode, formatRole, Membership, UserProfile, ProgramItem, ReportItem, TriageMemberItem, DiscussionMessageItem } from "./types";
import { BuildingIcon } from "./icons";

interface WorkspaceSidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeOrg?: Membership;
  memberships: Membership[];
  setActiveOrgId: (id: string) => void;
  setModalOpen: (open: boolean) => void;
  user: UserProfile | null;
  handleLogout: () => void;
  loggingOut: boolean;
  programsList: ProgramItem[];
  reportsList: ReportItem[];
  triageMembers: TriageMemberItem[];
  discussions: DiscussionMessageItem[];
  onOpenMasterKeyModal?: () => void;
  onSelectProgramSlug?: (slug: string | null) => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  viewMode,
  setViewMode,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeOrg,
  memberships = [],
  setActiveOrgId,
  setModalOpen,
  user,
  handleLogout,
  loggingOut,
  programsList = [],
  reportsList = [],
  triageMembers = [],
  discussions = [],
  onOpenMasterKeyModal,
  onSelectProgramSlug,
}) => {
  const isOrgOwner = activeOrg?.role === "ORG_OWNER" || activeOrg?.role === "Owner";

  // Reusable Nav Item renderer
  const renderNavItem = (
    mode: ViewMode,
    label: string,
    icon: React.ReactNode,
    count?: number,
    isMobile = false
  ) => {
    const active = viewMode === mode;
    return (
      <Box
        onClick={() => {
          setViewMode(mode);
          if (mode === "reports" && onSelectProgramSlug) {
            onSelectProgramSlug(null);
          }
          if (isMobile) setMobileMenuOpen(false);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderRadius: "6px",
          backgroundColor: active ? "var(--sidebar-active-bg, rgba(11, 46, 34, 0.08))" : "transparent",
          color: active ? "var(--sidebar-active-text, #0B2E22)" : "var(--text-secondary)",
          borderLeft: active ? "3px solid var(--color-primary, #0B2E22)" : "3px solid transparent",
          fontWeight: active ? 700 : 500,
          fontSize: "15px",
          cursor: "pointer",
          transition: "all 150ms ease",
          minWidth: 0,
        }}
      >
        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
          <Box style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            {icon}
          </Box>
          <Text style={{ color: "inherit", fontWeight: "inherit", fontSize: "15px", whiteSpace: "nowrap" }}>
            {label}
          </Text>
        </Group>
        {count !== undefined && (
          <Text
            size="12px"
            fw={600}
            style={{
              flexShrink: 0,
              color: active ? "var(--sidebar-active-text, #0B2E22)" : "var(--text-muted, #64748B)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {count}
          </Text>
        )}
      </Box>
    );
  };

  const navContent = (isMobile = false) => (
    <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
      {/* LEVEL 1: TENANT WORKSPACE */}
      <Text size="11.5px" fw={700} c="dimmed" style={{ letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 12px" }}>
        Tenant Workspace
      </Text>

      {renderNavItem(
        "dashboard",
        "Governance Overview",
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>,
        undefined,
        isMobile
      )}

      {renderNavItem(
        "workspaces",
        "Assigned Workspaces",
        <BuildingIcon size={16} />,
        memberships?.length,
        isMobile
      )}

      <Box
        component="a"
        href={`/onboarding${activeOrg?.organizationSlug ? `?slug=${encodeURIComponent(activeOrg.organizationSlug)}` : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          borderRadius: 6,
          textDecoration: "none",
          color: "var(--text-secondary)",
          fontSize: "15px",
          fontWeight: 500,
          transition: "all 150ms ease",
          cursor: "pointer",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="m9 15 2 2 4-4" />
        </svg>
        <Text style={{ flex: 1, fontSize: "15px", fontWeight: 500 }}>Setup &amp; Onboarding</Text>
        <Text size="12px" fw={600} c="dimmed" style={{ fontFamily: "var(--font-mono)" }}>7 Steps</Text>
      </Box>

      {/* LEVEL 2: PROGRAM SCOPES */}
      <Text size="11.5px" fw={700} c="dimmed" style={{ letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 12px", marginTop: 8 }}>
        Programs &amp; Scopes
      </Text>

      {renderNavItem(
        "programs",
        "In-House Programs",
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>,
        programsList?.length,
        isMobile
      )}

      {renderNavItem(
        "triage-members",
        "Triage Defenders",
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>,
        triageMembers?.length,
        isMobile
      )}

      {/* LEVEL 3: TRIAGE & REMEDIATION */}
      <Text size="11.5px" fw={700} c="dimmed" style={{ letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 12px", marginTop: 8 }}>
        Triage &amp; Remediation
      </Text>

      {renderNavItem(
        "reports",
        "Vulnerability Reports",
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>,
        reportsList?.length,
        isMobile
      )}

      {renderNavItem(
        "discussions",
        "Dual-Lane Discussions",
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>,
        discussions?.length,
        isMobile
      )}

      {renderNavItem(
        "cvss-calculator",
        "CVSS 3.1 & SLA Calculator",
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="16" y1="14" x2="16" y2="18" />
          <path d="M16 10h.01" />
          <path d="M12 10h.01" />
          <path d="M8 10h.01" />
          <path d="M12 14h.01" />
          <path d="M8 14h.01" />
          <path d="M12 18h.01" />
          <path d="M8 18h.01" />
        </svg>,
        undefined,
        isMobile
      )}

      <Box mt="md">
        <Text size="11.5px" fw={700} c="dimmed" style={{ letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 12px", marginBottom: 6 }}>
          Cryptographic Policy
        </Text>
        <Box
          component="a"
          href={activeOrg ? `/api/v1/programs/${activeOrg.organizationSlug}/security.txt?contact=${encodeURIComponent(user?.email || "tahaasad709@gmail.com")}` : "#"}
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            borderRadius: "6px",
            color: "var(--text-secondary)",
            fontSize: "15px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <Text style={{ fontSize: "15px", fontWeight: 500, whiteSpace: "nowrap" }}>RFC 9116 security.txt</Text>
        </Box>
        <Box
          onClick={() => {
            if (onOpenMasterKeyModal) {
              onOpenMasterKeyModal();
            }
            if (isMobile) setMobileMenuOpen(false);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            borderRadius: "6px",
            color: "var(--text-secondary)",
            fontSize: "15px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="7.5" cy="15.5" r="5.5" />
            <path d="m21 2-9.6 9.6" />
            <path d="m15.5 7.5 3 3L22 7l-3-3" />
          </svg>
          <Text style={{ fontSize: "15px", fontWeight: 500, whiteSpace: "nowrap" }}>Master Recovery Key</Text>
        </Box>
      </Box>
    </Stack>
  );

  return (
    <>
      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        size={304}
        padding="md"
        title={
          <Group gap={8}>
            <Box style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: "var(--color-primary, #0B2E22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </Box>
            <Text fw={800} size="sm" style={{ letterSpacing: "-0.01em", color: "var(--text-primary)" }}>caulvyn</Text>
          </Group>
        }
        styles={{
          content: { backgroundColor: "var(--sidebar-bg, #EAEAE4)" },
          header: { backgroundColor: "var(--sidebar-bg, #EAEAE4)", borderBottom: "1px solid var(--border-subtle)" },
        }}
      >
        <Stack justify="space-between" style={{ height: "calc(100vh - 80px)" }}>
          {navContent(true)}
          {/* User profile card */}
          <Box p="xs" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <Box style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#181C19", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                </Box>
                <Box>
                  <Text size="xs" fw={700} truncate maw={130}>{user?.fullName || user?.email?.split("@")[0]}</Text>
                  <Text size="10px" c="dimmed">{formatRole(activeOrg?.role)}</Text>
                </Box>
              </Group>
              <ActionIcon variant="subtle" color="gray" size="sm" onClick={handleLogout} loading={loggingOut} title="Sign Out">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </ActionIcon>
            </Group>
          </Box>
        </Stack>
      </Drawer>

      {/* Desktop Left Sidebar */}
      <Box
        visibleFrom="md"
        style={{
          width: sidebarCollapsed ? 68 : 304,
          borderRight: "1px solid var(--border-subtle)",
          backgroundColor: "var(--sidebar-bg, #EAEAE4)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          transition: "width 200ms ease",
          zIndex: 40,
        }}
      >
        {sidebarCollapsed ? (
          /* COLLAPSED ICON-ONLY SIDEBAR */
          <Box style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
            <Box p="xs" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <Tooltip label="Expand Sidebar" position="right" withArrow>
                <ActionIcon
                  variant="subtle"
                  size={36}
                  color="gray"
                  onClick={() => setSidebarCollapsed(false)}
                  style={{ color: "var(--text-primary)" }}
                  aria-label="Expand Sidebar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <polyline points="13 10 15 12 13 14" />
                  </svg>
                </ActionIcon>
              </Tooltip>

              <Tooltip label="caulvyn platform" position="right" withArrow>
                <Box style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "var(--color-primary, #0B2E22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </Box>
              </Tooltip>

              <Box style={{ width: "80%", height: "1px", backgroundColor: "var(--border-subtle)" }} />

              <Tooltip label="Governance Overview" position="right" withArrow>
                <Box
                  onClick={() => setViewMode("dashboard")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: "8px",
                    backgroundColor: viewMode === "dashboard" ? "var(--sidebar-active-bg, rgba(11, 46, 34, 0.08))" : "transparent",
                    color: viewMode === "dashboard" ? "var(--sidebar-active-text, #0B2E22)" : "var(--text-secondary)",
                    border: viewMode === "dashboard" ? "1px solid var(--color-primary, #0B2E22)" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                  </svg>
                </Box>
              </Tooltip>

              <Tooltip label="In-House Programs" position="right" withArrow>
                <Box
                  onClick={() => setViewMode("programs")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: "8px",
                    backgroundColor: viewMode === "programs" ? "var(--sidebar-active-bg, rgba(11, 46, 34, 0.08))" : "transparent",
                    color: viewMode === "programs" ? "var(--sidebar-active-text, #0B2E22)" : "var(--text-secondary)",
                    border: viewMode === "programs" ? "1px solid var(--color-primary, #0B2E22)" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </Box>
              </Tooltip>

              <Tooltip label="Vulnerability Reports" position="right" withArrow>
                <Box
                  onClick={() => {
                    setViewMode("reports");
                    if (onSelectProgramSlug) onSelectProgramSlug(null);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: "8px",
                    backgroundColor: viewMode === "reports" ? "var(--sidebar-active-bg, rgba(11, 46, 34, 0.08))" : "transparent",
                    color: viewMode === "reports" ? "var(--sidebar-active-text, #0B2E22)" : "var(--text-secondary)",
                    border: viewMode === "reports" ? "1px solid var(--color-primary, #0B2E22)" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </Box>
              </Tooltip>

              <Tooltip label="Triage Team & Defenders" position="right" withArrow>
                <Box
                  onClick={() => setViewMode("triage-members")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: "8px",
                    backgroundColor: viewMode === "triage-members" ? "var(--sidebar-active-bg, rgba(11, 46, 34, 0.08))" : "transparent",
                    color: viewMode === "triage-members" ? "var(--sidebar-active-text, #0B2E22)" : "var(--text-secondary)",
                    border: viewMode === "triage-members" ? "1px solid var(--color-primary, #0B2E22)" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </Box>
              </Tooltip>

              <Tooltip label="Dual-Lane Discussions" position="right" withArrow>
                <Box
                  onClick={() => setViewMode("discussions")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: "8px",
                    backgroundColor: viewMode === "discussions" ? "var(--sidebar-active-bg, rgba(11, 46, 34, 0.08))" : "transparent",
                    color: viewMode === "discussions" ? "var(--sidebar-active-text, #0B2E22)" : "var(--text-secondary)",
                    border: viewMode === "discussions" ? "1px solid var(--color-primary, #0B2E22)" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </Box>
              </Tooltip>
            </Box>

            {/* Bottom Avatar in Collapsed Mode */}
            <Box p="xs" style={{ display: "flex", justifyContent: "center", borderTop: "1px solid var(--border-subtle)" }}>
              <Tooltip label={`${user?.fullName || "User"} (${formatRole(activeOrg?.role)})`} position="right" withArrow>
                <Box style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#181C19", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                </Box>
              </Tooltip>
            </Box>
          </Box>
        ) : (
          /* EXPANDED FULL SIDEBAR */
          <Stack gap={0} style={{ height: "100%", justifyContent: "space-between" }}>
            <Box p="md">
              {/* Brand Header */}
              <Group justify="space-between" align="center" mb="lg">
                <Group gap={8}>
                  <Box style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: "var(--color-primary, #0B2E22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </Box>
                  <Box>
                    <Text fw={800} size="sm" style={{ letterSpacing: "-0.01em", lineHeight: 1.1, color: "var(--text-primary)" }}>caulvyn</Text>
                    <Text size="9px" c="dimmed" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>DISCLOSURE PLATFORM</Text>
                  </Box>
                </Group>
                <Tooltip label="Collapse Sidebar" position="right" withArrow>
                  <ActionIcon
                    variant="subtle"
                    size={28}
                    color="gray"
                    onClick={() => setSidebarCollapsed(true)}
                    style={{ color: "var(--text-secondary)" }}
                    aria-label="Collapse Sidebar"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="9" y1="3" x2="9" y2="21" />
                    </svg>
                  </ActionIcon>
                </Tooltip>
              </Group>

              {/* Workspace Switcher */}
              <Menu shadow="md" width={220} position="bottom-start">
                <Menu.Target>
                  <Box
                    mb="lg"
                    p="xs"
                    style={{
                      borderRadius: 8,
                      border: "1px solid var(--border-subtle)",
                      backgroundColor: "var(--surface-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                      <Box style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: "var(--surface-card)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="4" y="4" width="16" height="16" rx="2" />
                        </svg>
                      </Box>
                      <Box style={{ minWidth: 0 }}>
                        <Text size="xs" fw={700} truncate style={{ color: "var(--text-primary)" }}>{activeOrg?.organizationName || "Select Workspace"}</Text>
                        <Text size="10px" c="dimmed">{formatRole(activeOrg?.role)}</Text>
                      </Box>
                    </Group>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Box>
                </Menu.Target>

                <Menu.Dropdown style={{ backgroundColor: "var(--surface-card)" }}>
                  <Menu.Label>Available Workspaces</Menu.Label>
                  {memberships.map((m) => (
                    <Menu.Item
                      key={m.organizationId}
                      onClick={() => setActiveOrgId(m.organizationId)}
                      style={{
                        backgroundColor: m.organizationId === activeOrg?.organizationId ? "var(--surface-subtle)" : "transparent",
                        fontWeight: m.organizationId === activeOrg?.organizationId ? 700 : 400,
                      }}
                    >
                      <Group justify="space-between">
                        <Box style={{ minWidth: 0, flex: 1 }}>
                          <Text size="xs" truncate>{m.organizationName}</Text>
                          <Text size="10px" c="dimmed">{m.role === "ORG_OWNER" ? "Owner Dashboard" : "Invited Defender"}</Text>
                        </Box>
                        <Text size="11px" fw={600} c={m.role === "ORG_OWNER" ? "teal" : "blue"}>
                          {formatRole(m.role)}
                        </Text>
                      </Group>
                    </Menu.Item>
                  ))}
                  <Menu.Divider />
                  <Menu.Item onClick={() => setViewMode("workspaces")}>
                    <Text size="xs" fw={600} style={{ color: "var(--text-primary)" }}>View All Workspaces...</Text>
                  </Menu.Item>
                  <Menu.Item onClick={() => setModalOpen(true)}>
                    <Text size="xs" c="teal" fw={600}>+ Create New Workspace</Text>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              {/* Navigation Items */}
              {navContent(false)}
            </Box>

            {/* User Profile Footer */}
            <Box p="md" style={{ borderTop: "1px solid var(--border-subtle)", backgroundColor: "var(--sidebar-bg, #EAEAE4)" }}>
              <Group justify="space-between" align="center">
                <Group gap="xs" style={{ minWidth: 0, flex: 1 }}>
                  <Box style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#181C19", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                  </Box>
                  <Box style={{ minWidth: 0, flex: 1 }}>
                    <Text size="xs" fw={700} truncate style={{ color: "var(--text-primary)" }}>{user?.fullName || user?.email?.split("@")[0]}</Text>
                    <Text size="10px" c="dimmed" truncate>{formatRole(activeOrg?.role)}</Text>
                  </Box>
                </Group>
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={handleLogout} loading={loggingOut} title="Sign Out" aria-label="Sign Out">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </ActionIcon>
              </Group>
            </Box>
          </Stack>
        )}
      </Box>
    </>
  );
};
