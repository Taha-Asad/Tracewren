"use client";

import React, { useState, useEffect } from "react";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Select,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { LockIcon, SendIcon, TrashIcon } from "../icons";
import { DiscussionMessageItem, ProgramItem, ReportItem } from "../types";

export interface DiscussionsDirectoryViewProps {
  discussions: DiscussionMessageItem[];
  discussionLane: "RESEARCHER_ORG" | "REVIEWER_INTERNAL";
  onDiscussionLaneChange: (lane: "RESEARCHER_ORG" | "REVIEWER_INTERNAL") => void;
  threadLocked: boolean;
  onToggleThreadLocked: () => void;
  newDiscussionText: string;
  onNewDiscussionTextChange: (text: string) => void;
  onPostDiscussionMessage: () => void;
  onDeleteDiscussion: (id: string) => void;
  programsList?: ProgramItem[];
  reportsList?: ReportItem[];
  currentReportId?: string;
  onSelectReportId?: (id: string) => void;
  currentUserName?: string;
}

const PROGRAM_ROSTERS: Record<string, { label: string; team: string }> = {
  "portal-disclosure": {
    label: "Portal Disclosure Program (In-House)",
    team: "Sarah Chen (Owner) · Jonah Brooks (Defender) · Alex Rivera (Reporter)",
  },
  "core-boundary": {
    label: "Core API Boundary Program",
    team: "Sarah Chen (Owner) · Elena Rostova (API Auditor) · Liam Zhang (Reporter)",
  },
  "cloud-infra": {
    label: "Cloud Infrastructure Program",
    team: "Garrison Drake (SRE Lead) · Cyra Kaelen (SecOps Lead) · Sarah Chen (Owner)",
  },
};

export function DiscussionsDirectoryView({
  discussions,
  discussionLane,
  onDiscussionLaneChange,
  threadLocked,
  onToggleThreadLocked,
  newDiscussionText,
  onNewDiscussionTextChange,
  onPostDiscussionMessage,
  onDeleteDiscussion,
  programsList = [],
  reportsList = [],
  currentReportId,
  onSelectReportId,
  currentUserName = "Taha Asadullah",
}: DiscussionsDirectoryViewProps) {
  const initialProgSlug = programsList.length > 0 ? programsList[0].slug : "all";
  const initialRep = currentReportId
    ? reportsList.find((r) => r.id === currentReportId || r.reportId === currentReportId)
    : reportsList[0];
  const initialRepId = initialRep?.id || currentReportId || "";

  const [selectedProgramSlug, setSelectedProgramSlug] = useState<string>(initialProgSlug);
  const [selectedReportId, setSelectedReportId] = useState<string>(initialRepId);

  // Synchronize program slug if programsList changes
  useEffect(() => {
    if (programsList.length > 0 && selectedProgramSlug !== "all" && !programsList.some((p) => p.slug === selectedProgramSlug)) {
      setSelectedProgramSlug(programsList[0].slug);
    }
  }, [programsList, selectedProgramSlug]);

  // Keep synced with parent currentReportId if provided
  useEffect(() => {
    if (currentReportId && currentReportId !== selectedReportId) {
      setSelectedReportId(currentReportId);
      const matched = reportsList.find((r) => r.id === currentReportId || r.reportId === currentReportId);
      if (matched && matched.programSlug && selectedProgramSlug !== "all") {
        setSelectedProgramSlug(matched.programSlug);
      }
    }
  }, [currentReportId, reportsList, selectedReportId, selectedProgramSlug]);

  // Synchronize selected report if not in reportsList
  useEffect(() => {
    if (reportsList.length > 0) {
      const exists = reportsList.some((r) => r.id === selectedReportId || r.reportId === selectedReportId);
      if (!selectedReportId || !exists) {
        const nextId = currentReportId && reportsList.some((r) => r.id === currentReportId || r.reportId === currentReportId)
          ? currentReportId
          : reportsList[0].id;
        setSelectedReportId(nextId);
        if (onSelectReportId) onSelectReportId(nextId);
      }
    }
  }, [reportsList, selectedReportId, currentReportId, onSelectReportId]);

  // Filter reports belonging to selected program
  const filteredReports = reportsList.filter(
    (r) => !selectedProgramSlug || selectedProgramSlug === "all" || r.programSlug === selectedProgramSlug
  );

  const handleProgramChange = (newSlug: string | null) => {
    const slug = newSlug || "all";
    setSelectedProgramSlug(slug);

    const reportsInProg = slug === "all" ? reportsList : reportsList.filter((r) => r.programSlug === slug);
    if (reportsInProg.length > 0) {
      const firstReport = reportsInProg[0].id;
      setSelectedReportId(firstReport);
      if (onSelectReportId) onSelectReportId(firstReport);
    }
  };

  const handleReportChange = (reportId: string | null) => {
    const id = reportId || filteredReports[0]?.id || "";
    setSelectedReportId(id);
    if (onSelectReportId) onSelectReportId(id);
  };

  const matchedActiveReport = reportsList.find(
    (r) => r.id === selectedReportId || r.reportId === selectedReportId
  );
  const activeReportLookupId = matchedActiveReport?.id || selectedReportId;

  // Filter messages belonging strictly to the selected report and active lane
  const activeMessages = discussions.filter((d) => {
    const matches =
      !activeReportLookupId ||
      d.reportId === activeReportLookupId ||
      (matchedActiveReport && (
        d.reportId === matchedActiveReport.id ||
        d.reportId === matchedActiveReport.reportId ||
        d.reportId === (matchedActiveReport as any).uuid
      ));
    return matches && d.lane === discussionLane;
  });

  const activeProg = programsList.find((p) => p.slug === selectedProgramSlug);
  const activeRoster = {
    label: activeProg ? activeProg.name : (programsList[0]?.name || "Security Program"),
    team: `${currentUserName} · Active Triage Channel`,
  };

  return (
    <Box px={{ base: "md", md: 32 }} py={{ base: "md", md: 28 }}>
      <Stack gap="lg">
        {/* Header without chips */}
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Box>
            <Text
              component="h1"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Report Triage &amp; Remediation Communications
            </Text>
            <Text size="sm" c="dimmed" mt={4}>
              Scoped communication channels isolated per program and report. Communication is strictly segregated between researcher coordination and internal defender deliberation.
            </Text>
          </Box>

          <Button
            size="xs"
            variant="default"
            onClick={onToggleThreadLocked}
            leftSection={<LockIcon size={13} />}
          >
            {threadLocked ? "Reopen Thread" : "Lock Thread (Admin)"}
          </Button>
        </Group>

        {/* Program & Report Scope Selector Bar (NO CHIPS) */}
        <Paper
          p="md"
          radius="md"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-contrast)",
          }}
        >
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Group gap="md" wrap="wrap" style={{ flex: 1 }}>
              <Box style={{ minWidth: 220 }}>
                <Text size="11px" fw={700} c="dimmed" style={{ textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  Target Program Scope
                </Text>
                <Select
                  size="xs"
                  value={selectedProgramSlug}
                  onChange={handleProgramChange}
                  data={[
                    { value: "all", label: `All Programs (${reportsList.length})` },
                    ...programsList.map((p) => ({
                      value: p.slug,
                      label: `${p.name} (${reportsList.filter((r) => r.programSlug === p.slug).length})`,
                    })),
                  ]}
                />
              </Box>

              <Box style={{ minWidth: 260, flex: 1 }}>
                <Text size="11px" fw={700} c="dimmed" style={{ textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  Vulnerability Report Thread
                </Text>
                <Select
                  size="xs"
                  value={selectedReportId}
                  onChange={handleReportChange}
                  data={
                    filteredReports.length > 0
                      ? filteredReports.map((r) => ({
                          value: r.id,
                          label: `${r.reportId || r.id} — ${r.title.slice(0, 48)}...`,
                        }))
                      : [{ value: "", label: "No reports found in this program scope" }]
                  }
                />
              </Box>
            </Group>

            {/* Dynamic Program Members Roster in Clean Typography */}
            <Box style={{ textAlign: "right", maxWidth: 360 }}>
              <Text size="11px" fw={700} c="dimmed" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Authorized Program Team ({activeRoster.label})
              </Text>
              <Text size="xs" fw={600} style={{ color: "var(--text-secondary)", marginTop: 2 }}>
                {activeRoster.team}
              </Text>
            </Box>
          </Group>
        </Paper>

        {/* Dual-Lane Channel Selector (Clean Tabbed Switcher - NO CHIPS) */}
        <Group justify="space-between" align="center">
          <SegmentedControl
            value={discussionLane}
            onChange={(v) => onDiscussionLaneChange(v as "RESEARCHER_ORG" | "REVIEWER_INTERNAL")}
            data={[
              { label: "Researcher Coordination (Class B)", value: "RESEARCHER_ORG" },
              { label: "Internal Engineering Deliberation (Class C)", value: "REVIEWER_INTERNAL" },
            ]}
            color="teal"
            size="xs"
          />
          <Text size="xs" c="dimmed">
            Viewing {activeMessages.length} message(s) for report {selectedReportId}
          </Text>
        </Group>

        {/* Threaded Message Stream */}
        <Paper
          p="lg"
          radius="md"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-contrast)",
          }}
        >
          <Stack gap="md">
            {activeMessages.length === 0 ? (
              <Box py="xl" style={{ textAlign: "center" }}>
                <Text size="sm" c="dimmed">
                  No messages posted in this channel yet for report {selectedReportId}.
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  {discussionLane === "RESEARCHER_ORG"
                    ? "Start the coordination thread with the external researcher."
                    : "Post an internal deliberation note visible only to verified defenders."}
                </Text>
              </Box>
            ) : (
              activeMessages.map((msg) => {
                const isInternal = msg.lane === "REVIEWER_INTERNAL";
                const isAuthor = msg.senderName === currentUserName;
                return (
                  <Paper
                    key={msg.id}
                    p="md"
                    radius="sm"
                    style={{
                      backgroundColor: isInternal ? "var(--surface-subtle)" : "var(--surface-card)",
                      border: isInternal ? "1px solid #C4DEC9" : "1px solid var(--border-subtle)",
                      borderLeft: isInternal ? "3px solid #16654C" : "3px solid var(--border-subtle)",
                    }}
                  >
                    <Group justify="space-between" align="center" mb={6}>
                      <Group gap="xs" align="center">
                        <Avatar size={24} radius="xl" color="teal">
                          {msg.senderName.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>
                          {msg.senderName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          · {msg.senderRole}
                        </Text>
                        <Text size="xs" c="dimmed" ff="monospace">
                          · {msg.reportId}
                        </Text>
                      </Group>

                      <Group gap="xs" align="center">
                        <Text size="11px" c="dimmed">
                          {msg.createdAt}
                        </Text>
                        {/* Audit Integrity: Only author may retract their own message; owners cannot delete other users' messages */}
                        {isAuthor && (
                          <ActionIcon
                            variant="subtle"
                            size="xs"
                            color="gray"
                            title="Delete your message"
                            onClick={() => onDeleteDiscussion(msg.id)}
                          >
                            <TrashIcon size={12} />
                          </ActionIcon>
                        )}
                      </Group>
                    </Group>

                    <Text size="sm" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {msg.content}
                    </Text>
                  </Paper>
                );
              })
            )}

            <Divider my="sm" style={{ borderColor: "var(--border-subtle)" }} />

            {/* Clean Message Input Area (NO CHIPS) */}
            <Stack gap="xs">
              <Textarea
                placeholder={
                  threadLocked
                    ? "Thread locked by administrator."
                    : discussionLane === "RESEARCHER_ORG"
                    ? "Post a message visible to the security researcher and program team..."
                    : "Post an internal deliberation note (visible only to verified program defenders)..."
                }
                value={newDiscussionText}
                onChange={(e) => onNewDiscussionTextChange(e.currentTarget.value)}
                minRows={3}
                maxRows={6}
                disabled={threadLocked}
                styles={{
                  input: {
                    backgroundColor: "var(--surface-subtle)",
                    borderColor: "var(--border-subtle)",
                    fontSize: "13px",
                  },
                }}
              />

              <Group justify="space-between" align="center">
                <Text size="xs" c="dimmed">
                  {discussionLane === "RESEARCHER_ORG"
                    ? "Message visibility: Researcher + Organization Defenders"
                    : "Message visibility: Internal Defenders only (Encrypted Class C)"}
                </Text>

                <Button
                  size="xs"
                  color="teal"
                  onClick={onPostDiscussionMessage}
                  disabled={threadLocked || !newDiscussionText.trim()}
                  leftSection={<SendIcon size={12} />}
                  styles={{
                    root: {
                      backgroundColor: "#16654C",
                      fontWeight: 600,
                    },
                  }}
                >
                  Send Message
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
