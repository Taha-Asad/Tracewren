"use client";

import React from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { ArrowLeftIcon, CopyIcon, GitCommitIcon, LockIcon } from "../icons";
import { DiscussionMessageItem, ReportItem, TriageMemberItem, formatRole } from "../types";
import { ReportOverviewTab } from "./tabs/ReportOverviewTab";
import { Phase1IntakeAuditTab } from "./tabs/Phase1IntakeAuditTab";
import { ReportEvidenceTab } from "./tabs/ReportEvidenceTab";
import { ReportRemediationTab, ReportRemediationTabProps } from "./tabs/ReportRemediationTab";
import { ReportDiscussionsTab } from "./tabs/ReportDiscussionsTab";
import { ReportActivityTab } from "./tabs/ReportActivityTab";
import { CvssCalculatorWidget } from "../CvssCalculatorWidget";

export interface ReportDetailViewProps {
  activeReport: ReportItem;
  reportsList: ReportItem[];
  selectedReportId: string;
  onSelectReportId: (id: string) => void;
  onBackToReports: () => void;
  copiedId: boolean;
  onCopyReportId: () => void;
  onOpenVerifiedModal: () => void;
  onOpenCreateProgModal: () => void;
  onOpenInviteMemberModal: () => void;
  activeTab: string | null;
  onTabChange: (tab: string | null) => void;
  reportDiscussions: DiscussionMessageItem[];
  discussionLane: "RESEARCHER_ORG" | "REVIEWER_INTERNAL";
  onDiscussionLaneChange: (lane: "RESEARCHER_ORG" | "REVIEWER_INTERNAL") => void;
  socketLatency: number;
  researcherTyping: boolean;
  onSimulateResearcherReply: () => void;
  newDiscussionText: string;
  onNewDiscussionTextChange: (text: string) => void;
  onPostDiscussionMessage: () => void;
  remediationProps: Omit<ReportRemediationTabProps, "onRequestRetest" | "onCancelProposedFix" | "onRecordRetestPass" | "onRecordRetestFail" | "onProposeNewFix"> & {
    onRequestRetest: () => void;
    onCancelProposedFix: () => void;
    onRecordRetestPass: () => void;
    onRecordRetestFail: () => void;
    onProposeNewFix: () => void;
  };
  showRawOpenPgpArmor: boolean;
  onToggleShowRawOpenPgpArmor: () => void;
  triageMembers?: TriageMemberItem[];
  onAssignDefender?: (defender: TriageMemberItem) => void;
}

export function ReportDetailView({
  activeReport,
  reportsList,
  selectedReportId,
  onSelectReportId,
  onBackToReports,
  copiedId,
  onCopyReportId,
  onOpenVerifiedModal,
  onOpenCreateProgModal,
  onOpenInviteMemberModal,
  activeTab,
  onTabChange,
  reportDiscussions,
  discussionLane,
  onDiscussionLaneChange,
  socketLatency,
  researcherTyping,
  onSimulateResearcherReply,
  newDiscussionText,
  onNewDiscussionTextChange,
  onPostDiscussionMessage,
  remediationProps,
  showRawOpenPgpArmor,
  onToggleShowRawOpenPgpArmor,
  triageMembers = [],
  onAssignDefender,
}: ReportDetailViewProps) {
  return (
    <>
      <Box px={{ base: "md", md: 32 }} pt={{ base: "md", md: 24 }}>
        <Group justify="space-between" align="center" mb={14} wrap="wrap" gap="xs">
          <Button
            variant="subtle"
            size="xs"
            color="gray"
            leftSection={<ArrowLeftIcon size={14} />}
            onClick={onBackToReports}
            style={{ padding: "0 4px" }}
          >
            Back to Reports Queue
          </Button>

          <Group gap="xs">
            <Text size="xs" c="dimmed">Switch report:</Text>
            {reportsList.map((r) => (
              <Button
                key={r.id}
                size="compact-xs"
                variant={r.id === selectedReportId ? "filled" : "outline"}
                color={r.id === selectedReportId ? "teal" : "gray"}
                onClick={() => onSelectReportId(r.id)}
              >
                {r.id}
              </Button>
            ))}
          </Group>
        </Group>

        {/* Workspace & Program Hierarchy Trail */}
        <Group gap={6} align="center" mb={10}>
          <Badge size="xs" variant="light" color="teal">
            Program Scope: {activeReport.programSlug}
          </Badge>
          <Text size="11px" c="dimmed">·</Text>
          <Text size="11px" c="dimmed">
            Environment: {activeReport.environment} ({activeReport.version})
          </Text>
        </Group>

        {/* Metadata Row */}
        <Group justify="space-between" align="center" wrap="wrap" gap="sm" mb={12}>
          <Group gap="xs" align="center">
            <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>
              Report {activeReport.id}
            </Text>
            <ActionIcon variant="subtle" size="xs" color="gray" onClick={onCopyReportId} title="Copy report ID">
              <CopyIcon size={12} />
            </ActionIcon>
            {copiedId && <Text size="10px" c="teal" fw={600}>Copied!</Text>}
            <Box
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 8px",
                borderRadius: "4px",
                border: "1px solid #E8B9A5",
                backgroundColor: "#FDF3ED",
                color: "#BA3D2A",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {activeReport.status}
            </Box>
          </Group>

          <Group gap="sm" align="center">
            <Text size="xs" c="dimmed">
              Reported by {activeReport.reporter} · {activeReport.createdAt}
            </Text>
            <Divider orientation="vertical" style={{ height: 14 }} />
            <Group gap={4}>
              <LockIcon size={12} color="#2E7D32" />
              <Text size="xs" fw={600} style={{ color: "#2E7D32" }}>
                Unlocked on this device
              </Text>
            </Group>
          </Group>
        </Group>

        {/* Main Headline */}
        <Text
          component="h1"
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "clamp(1.75rem, 2.5vw, 2.35rem)",
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            margin: "0 0 8px 0",
            color: "var(--text-primary)",
          }}
        >
          {activeReport.title}
        </Text>
        <Text size="sm" c="dimmed" style={{ maxWidth: 840, lineHeight: 1.5 }} mb={18}>
          {activeReport.summary}
        </Text>

        {/* Action Row */}
        <Group justify="space-between" align="center" wrap="wrap" gap="md" mb={18}>
          <Group gap="sm">
            <Button
              color="teal"
              size="sm"
              styles={{ root: { backgroundColor: "#1E4034", borderRadius: "6px", fontWeight: 600, padding: "0 16px" } }}
              onClick={() => onTabChange("remediation")}
              leftSection={<GitCommitIcon size={14} color="#FFF" />}
            >
              View remediation &amp; retest
            </Button>
            <Button
              variant="subtle"
              size="sm"
              color="gray"
              onClick={onOpenVerifiedModal}
              styles={{ root: { textDecoration: "underline", fontWeight: 500, color: "var(--text-secondary)" } }}
            >
              Record internal verification
            </Button>
          </Group>

          <Group gap="xs">
            <Button variant="outline" size="xs" color="gray" onClick={onOpenCreateProgModal}>
              + New Program
            </Button>
            <Button variant="outline" size="xs" color="gray" onClick={onOpenInviteMemberModal}>
              + Add Defender
            </Button>
          </Group>
        </Group>

        {/* Notice Banner */}
        <Box
          style={{
            backgroundColor: "var(--surface-banner, #F3F8F5)",
            border: "1px solid #C4DEC9",
            borderRadius: "6px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Group gap="xs" align="center">
            <Box
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "#2E7D32",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              i
            </Box>
            <Text size="xs" fw={500} style={{ color: "var(--surface-banner-text, #1E4034)" }}>
              Fix deployed to {activeReport.environment} ({activeReport.version}). Assigned defender:{" "}
              <strong>{activeReport.assignedDefender}</strong>
            </Text>
          </Group>

          {triageMembers && triageMembers.length > 0 && onAssignDefender && (
            <Group gap="xs" align="center">
              <Text size="11px" fw={700} c="dimmed" style={{ textTransform: "uppercase" }}>
                Reassign:
              </Text>
              <Select
                size="xs"
                placeholder="Assign Defender..."
                value={activeReport.assignedDefender}
                onChange={(val) => {
                  const matched = triageMembers.find((m) => m.name === val || m.email === val);
                  if (matched && onAssignDefender) onAssignDefender(matched);
                }}
                data={triageMembers.map((m) => ({
                  value: m.name,
                  label: `${m.name} (${formatRole(m.role)})`,
                }))}
                style={{ width: 220 }}
              />
            </Group>
          )}
        </Box>

        {/* Report Sub-navigation Tabs */}
        <Tabs value={activeTab} onChange={onTabChange} variant="outline">
          <Tabs.List style={{ borderColor: "var(--border-subtle)" }}>
            <Tabs.Tab value="overview" style={{ fontWeight: 600, fontSize: "13px" }}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab
              value="cvss"
              style={{ fontSize: "13px" }}
            >
              CVSS 3.1 &amp; SLA Policy
            </Tabs.Tab>
            <Tabs.Tab
              value="intake"
              style={{ fontSize: "13px" }}
            >
              Phase 1: Intake &amp; Scope
            </Tabs.Tab>
            <Tabs.Tab
              value="evidence"
              style={{ fontSize: "13px" }}
            >
              Evidence (2)
            </Tabs.Tab>
            <Tabs.Tab value="remediation" style={{ fontSize: "13px" }}>
              Remediation
            </Tabs.Tab>
            <Tabs.Tab
              value="conversation"
              style={{ fontSize: "13px" }}
            >
              Dual-Lane Discussions ({reportDiscussions.length})
            </Tabs.Tab>
            <Tabs.Tab value="activity" style={{ fontSize: "13px" }}>
              Activity
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Box>

      {/* Main Content Area */}
      <Box px={{ base: "md", md: 32 }} pb={{ base: 40, md: 60 }} pt={{ base: "md", md: 28 }} style={{ flex: 1 }}>
        {activeTab === "cvss" ? (
          <Box style={{ maxWidth: 980, margin: "0 auto" }}>
            <CvssCalculatorWidget />
          </Box>
        ) : activeTab === "remediation" ? (
          <ReportRemediationTab {...remediationProps} />
        ) : activeTab === "conversation" ? (
          <ReportDiscussionsTab
            selectedReportId={selectedReportId}
            reportDiscussions={reportDiscussions}
            discussionLane={discussionLane}
            onDiscussionLaneChange={onDiscussionLaneChange}
            socketLatency={socketLatency}
            researcherTyping={researcherTyping}
            onSimulateResearcherReply={onSimulateResearcherReply}
            newDiscussionText={newDiscussionText}
            onNewDiscussionTextChange={onNewDiscussionTextChange}
            onPostDiscussionMessage={onPostDiscussionMessage}
          />
        ) : activeTab === "intake" ? (
          <Phase1IntakeAuditTab
            showRawOpenPgpArmor={showRawOpenPgpArmor}
            onToggleShowRawOpenPgpArmor={onToggleShowRawOpenPgpArmor}
          />
        ) : activeTab === "evidence" ? (
          <ReportEvidenceTab />
        ) : activeTab === "activity" ? (
          <ReportActivityTab report={activeReport} />
        ) : (
          <ReportOverviewTab report={activeReport} />
        )}
      </Box>
    </>
  );
}
