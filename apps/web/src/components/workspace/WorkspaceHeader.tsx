import React from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Indicator,
  Menu,
  Text,
} from "@mantine/core";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ViewMode, formatRole, Membership, UserProfile } from "./types";

interface WorkspaceHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedReportId: string;
  activeOrg?: Membership;
  user: UserProfile | null;
  setMobileMenuOpen: (open: boolean) => void;
  setSelectedReportId: (id: string) => void;
  selectedProgramSlug?: string | null;
  activeReportStatus?: string;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  viewMode,
  setViewMode,
  selectedReportId,
  activeOrg,
  user,
  setMobileMenuOpen,
  setSelectedReportId,
  selectedProgramSlug,
  activeReportStatus,
}) => {
  return (
    <Box
      component="header"
      px={{ base: 10, xs: 14, sm: 18 }}
      style={{
        height: 52,
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "var(--canvas-bg)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Hamburger (mobile) + Breadcrumbs */}
      <Group gap="xs" align="center" wrap="nowrap" style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
        <ActionIcon
          variant="subtle"
          color="gray"
          hiddenFrom="md"
          size={32}
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open mobile navigation menu"
          style={{ flexShrink: 0 }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </ActionIcon>

        {/* Organization Breadcrumb Link (Visible on xs and up) */}
        <Group gap={4} align="center" wrap="nowrap" visibleFrom="xs">
          <Text
            size="xs"
            fw={viewMode === "dashboard" ? 700 : 600}
            style={{
              color: viewMode === "dashboard" ? "var(--text-primary)" : "var(--text-muted)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={() => setViewMode("dashboard")}
            truncate
            maw={{ xs: 120, sm: 160 }}
            title="Return to Governance Overview"
          >
            {activeOrg?.organizationName || "Select Workspace"}
          </Text>
          <Badge size="xs" variant="light" color={activeOrg?.role === "ORG_OWNER" ? "teal" : "blue"}>
            {activeOrg?.role === "ORG_OWNER" ? "Owner" : formatRole(activeOrg?.role)}
          </Badge>
        </Group>

        <Text size="xs" c="dimmed" visibleFrom="xs" style={{ flexShrink: 0 }}>/</Text>

        {/* Dynamic View Segment */}
        {viewMode === "dashboard" && (
          <Group gap={6} align="center" wrap="nowrap" style={{ minWidth: 0, overflow: "hidden" }}>
            <Text size="xs" fw={700} truncate maw={{ base: 135, xs: 160, sm: 200 }} style={{ color: "var(--text-primary)" }}>
              Governance Overview
            </Text>
            <Text size="11px" fw={600} c="teal" visibleFrom="sm">
              · Tenant Perimeter
            </Text>
          </Group>
        )}

        {viewMode === "workspaces" && (
          <Group gap={6} align="center" wrap="nowrap" style={{ minWidth: 0, overflow: "hidden" }}>
            <Text size="xs" fw={700} truncate maw={{ base: 140, xs: 180, sm: 220 }} style={{ color: "var(--text-primary)" }}>
              Assigned Workspaces Directory
            </Text>
            <Text size="11px" fw={600} c="dimmed">· Tenant Switcher</Text>
          </Group>
        )}

        {viewMode === "programs" && (
          <Group gap={6} align="center" wrap="nowrap" style={{ minWidth: 0, overflow: "hidden" }}>
            <Text size="xs" fw={700} truncate maw={{ base: 135, xs: 160, sm: 200 }} style={{ color: "var(--text-primary)" }}>
              In-House Programs
            </Text>
            <Text size="11px" fw={600} c="dimmed">· Active Scopes</Text>
          </Group>
        )}

        {viewMode === "reports" && (
          <Group gap={6} align="center" wrap="nowrap" style={{ minWidth: 0, overflow: "hidden" }}>
            <Text size="xs" fw={700} truncate maw={{ base: 135, xs: 160, sm: 200 }} style={{ color: "var(--text-primary)" }}>
              Reports Queue
            </Text>
            {selectedProgramSlug && (
              <Badge size="xs" variant="outline" color="teal">
                Scope: {selectedProgramSlug}
              </Badge>
            )}
          </Group>
        )}

        {viewMode === "cvss-calculator" && (
          <Group gap={6} align="center" wrap="nowrap" style={{ minWidth: 0, overflow: "hidden" }}>
            <Text size="xs" fw={700} truncate maw={{ base: 180, xs: 220, sm: 300 }} style={{ color: "var(--text-primary)" }}>
              CVSS 3.1 &amp; SLA Calculator
            </Text>
            <Text size="11px" fw={600} c="dimmed" visibleFrom="sm">
              · FIRST.org Engine
            </Text>
          </Group>
        )}

        {viewMode === "triage-members" && (
          <Group gap={6} align="center" wrap="nowrap" style={{ minWidth: 0, overflow: "hidden" }}>
            <Text size="xs" fw={700} truncate maw={{ base: 135, xs: 160, sm: 200 }} style={{ color: "var(--text-primary)" }}>
              Triage Team
            </Text>
            <Text size="11px" fw={600} c="dimmed">· Workspace Defenders</Text>
          </Group>
        )}

        {viewMode === "discussions" && (
          <Group gap={6} align="center" wrap="nowrap" style={{ minWidth: 0, overflow: "hidden" }}>
            <Text size="xs" fw={700} truncate maw={{ base: 135, xs: 160, sm: 200 }} style={{ color: "var(--text-primary)" }}>
              Dual-Lane Discussions
            </Text>
            <Text size="11px" fw={600} c="dimmed">· Class B &amp; C</Text>
          </Group>
        )}

        {viewMode === "report" && (
          <Group gap={6} align="center" wrap="nowrap" style={{ minWidth: 0, overflow: "hidden" }}>
            <Text
              size="xs"
              style={{ cursor: "pointer", color: "var(--text-muted)", flexShrink: 0 }}
              onClick={() => setViewMode("reports")}
              visibleFrom="sm"
            >
              Reports Queue
            </Text>
            <Text size="xs" c="dimmed" visibleFrom="sm" style={{ flexShrink: 0 }}>/</Text>
            <ActionIcon
              variant="subtle"
              size={20}
              color="gray"
              hiddenFrom="sm"
              onClick={() => setViewMode("reports")}
              title="Back to Reports"
              aria-label="Back to Reports"
              style={{ flexShrink: 0 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </ActionIcon>
            <Text size="xs" fw={700} ff="monospace" style={{ color: "var(--text-primary)", flexShrink: 0 }}>
              {selectedReportId}
            </Text>
            {activeReportStatus && (
              <Badge size="xs" variant="light" color={activeReportStatus === "Resolved" ? "teal" : activeReportStatus === "Retest pending" ? "orange" : "blue"}>
                {activeReportStatus}
              </Badge>
            )}
          </Group>
        )}
      </Group>

      {/* Right Controls */}
      <Group gap={6} align="center" wrap="nowrap" style={{ flexShrink: 0 }}>
        {/* Search Shortcut */}
        <Button
          variant="default"
          size="xs"
          radius="md"
          visibleFrom="md"
          style={{
            height: 28,
            backgroundColor: "var(--surface-subtle)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
            fontSize: "12px",
            fontWeight: 500,
          }}
          leftSection={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
          rightSection={
            <Text size="10px" fw={600} c="dimmed" style={{ padding: "0 4px", fontFamily: "var(--font-mono)" }}>
              ⌘ K
            </Text>
          }
        >
          Search workspace...
        </Button>

        {/* Notifications Popover */}
        <Menu shadow="md" width={280} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="default"
              size={32}
              radius="md"
              aria-label="Notifications"
              title="Active Triage Alerts & SLA Timers"
              style={{
                position: "relative",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--surface-subtle)",
                color: "var(--text-primary)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <Box
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  minWidth: 13,
                  height: 13,
                  padding: "0 2px",
                  borderRadius: 7,
                  backgroundColor: "#16654C",
                  color: "#FFFFFF",
                  fontSize: "8.5px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  boxShadow: "0 0 0 1px var(--surface-subtle)",
                }}
              >
                3
              </Box>
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown style={{ backgroundColor: "var(--surface-card)" }}>
            <Box p="xs">
              <Group justify="space-between" mb="xs">
                <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>Activity & Notifications</Text>
                <Text size="10px" fw={700} c="teal">3 Unread</Text>
              </Group>
              <Menu.Divider />
              <Menu.Item style={{ padding: "8px 10px" }} onClick={() => { setSelectedReportId("BBT-0241"); setViewMode("report"); }}>
                <Text size="xs" fw={600} style={{ color: "var(--text-primary)" }}>Retest Requested · BBT-0241</Text>
                <Text size="10px" c="dimmed">Submitter verified git patch commit</Text>
              </Menu.Item>
              <Menu.Item style={{ padding: "8px 10px" }} onClick={() => setViewMode("discussions")}>
                <Text size="xs" fw={600} style={{ color: "var(--text-primary)" }}>New Dual-Lane Message</Text>
                <Text size="10px" c="dimmed">Sarah Chen posted to #triage-stream</Text>
              </Menu.Item>
              <Menu.Item style={{ padding: "8px 10px" }} onClick={() => setViewMode("triage-members")}>
                <Text size="xs" fw={600} style={{ color: "var(--text-primary)" }}>Defender Onboarded</Text>
                <Text size="10px" c="dimmed">Mina Patel registered Curve25519 key</Text>
              </Menu.Item>
            </Box>
          </Menu.Dropdown>
        </Menu>

        <Button
          component="a"
          href={`/onboarding${activeOrg?.organizationSlug ? `?slug=${encodeURIComponent(activeOrg.organizationSlug)}` : ""}`}
          size="compact-xs"
          variant="light"
          color="teal"
          visibleFrom="sm"
          style={{ fontSize: "11px" }}
        >
          Setup Wizard
        </Button>

        <ThemeToggle />

        {/* User Avatar */}
        <Box
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#A8E6CF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 700,
            color: "#1B4D3E",
            cursor: "pointer",
            flexShrink: 0,
          }}
          title={user?.email || "User"}
        >
          {user?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "T"}
        </Box>
      </Group>
    </Box>
  );
};
