import React from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { ProgramItem, ReportItem } from "../types";
import { ArrowRightIcon } from "../icons";

interface ReportsQueueViewProps {
  reportsList: ReportItem[];
  programsList?: ProgramItem[];
  selectedProgramSlug: string | null;
  onSelectProgramSlug: (slug: string | null) => void;
  reportFilter: string;
  setReportFilter: (filter: string) => void;
  intakeFeedback: string | null;
  setIntakeFeedback: (feedback: string | null) => void;
  setIntakeModalOpen: (open: boolean) => void;
  setSelectedReportId: (id: string) => void;
  setViewMode: (mode: any) => void;
  currentUserEmail?: string;
  currentUserName?: string;
}

export const ReportsQueueView: React.FC<ReportsQueueViewProps> = ({
  reportsList,
  programsList = [],
  selectedProgramSlug,
  onSelectProgramSlug,
  reportFilter,
  setReportFilter,
  intakeFeedback,
  setIntakeFeedback,
  setIntakeModalOpen,
  setSelectedReportId,
  setViewMode,
  currentUserEmail,
  currentUserName,
}) => {
  const activeProgram = programsList.find((p) => p.slug === selectedProgramSlug);

  const filteredReports = reportsList.filter((r) => {
    // 1. Program Scope Filter
    if (selectedProgramSlug && selectedProgramSlug !== "all" && r.programSlug !== selectedProgramSlug) {
      return false;
    }
    // 2. Status / Assignment Filter
    if (reportFilter === "assigned") {
      const email = currentUserEmail?.toLowerCase();
      const userPrefix = email ? email.split("@")[0] : null;
      const isAssigned =
        (email && r.assignedDefenderEmail?.toLowerCase() === email) ||
        (email && r.assignedDefender?.toLowerCase().includes(email)) ||
        (userPrefix && r.assignedDefender?.toLowerCase().includes(userPrefix)) ||
        (currentUserName && r.assignedDefender?.toLowerCase().includes(currentUserName.toLowerCase()));
      return isAssigned;
    }
    if (reportFilter === "retest") return r.status === "Retest pending";
    if (reportFilter === "resolved") return r.status === "Resolved";
    return true;
  });

  return (
    <Box px={{ base: "md", md: 32 }} py={{ base: "md", md: 28 }}>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Box>
            <Group gap="xs" align="center" mb={4}>
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
                {activeProgram ? `${activeProgram.name} Reports` : "Vulnerability Reports & Submissions"}
              </Text>
              {activeProgram && (
                <Badge size="sm" variant="light" color="teal">
                  Scope: {activeProgram.slug}
                </Badge>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              {activeProgram
                ? `Showing vulnerability disclosures specifically submitted for ${activeProgram.name} (${activeProgram.slug}).`
                : "Review and triage reports across all programs, assign designated defenders, and oversee retest verification."}
            </Text>
          </Box>

          <Group gap="xs" align="center" wrap="wrap">
            {programsList.length > 0 && (
              <Select
                size="xs"
                placeholder="All Program Scopes"
                data={[
                  { label: `All Programs (${reportsList.length})`, value: "all" },
                  ...programsList.map((p) => {
                    const count = reportsList.filter((r) => r.programSlug === p.slug).length;
                    return {
                      label: `${p.name} (${count})`,
                      value: p.slug,
                    };
                  }),
                ]}
                value={selectedProgramSlug || "all"}
                onChange={(val) => onSelectProgramSlug(val === "all" ? null : val)}
                style={{ minWidth: 230 }}
              />
            )}

            <Button
              size="sm"
              color="teal"
              onClick={() => setIntakeModalOpen(true)}
            >
              + Ingest Report (Phase 1 Intake)
            </Button>
            <Group gap={6}>
              <Button
                size="compact-xs"
                variant={reportFilter === "all" ? "filled" : "subtle"}
                color="teal"
                onClick={() => setReportFilter("all")}
              >
                All ({reportsList.length})
              </Button>
              <Button
                size="compact-xs"
                variant={reportFilter === "assigned" ? "filled" : "subtle"}
                color="blue"
                onClick={() => setReportFilter("assigned")}
              >
                Assigned to Me
              </Button>
              <Button
                size="compact-xs"
                variant={reportFilter === "retest" ? "filled" : "subtle"}
                color="orange"
                onClick={() => setReportFilter("retest")}
              >
                Retest Pending
              </Button>
              <Button
                size="compact-xs"
                variant={reportFilter === "resolved" ? "filled" : "subtle"}
                color="teal"
                onClick={() => setReportFilter("resolved")}
              >
                Resolved
              </Button>
            </Group>
          </Group>
        </Group>

        {activeProgram && (
          <Paper
            p="xs"
            radius="md"
            style={{
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-contrast)",
            }}
          >
            <Group justify="space-between" align="center" wrap="wrap" gap="xs">
              <Group gap="xs" align="center">
                <Badge size="xs" color="teal" variant="filled">
                  Active Scope
                </Badge>
                <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>
                  {activeProgram.name}
                </Text>
                <Text size="11px" ff="monospace" c="dimmed">
                  ({activeProgram.slug})
                </Text>
                <Text size="11px" c="dimmed">
                  — Filtered to {filteredReports.length} {filteredReports.length === 1 ? "report" : "reports"}
                </Text>
              </Group>
              <Button
                size="compact-xs"
                variant="subtle"
                color="gray"
                onClick={() => onSelectProgramSlug(null)}
              >
                Clear Filter (View All Programs)
              </Button>
            </Group>
          </Paper>
        )}

        {intakeFeedback && (
          <Alert
            color="teal"
            variant="light"
            withCloseButton
            onClose={() => setIntakeFeedback(null)}
            title="Phase 1 Intake Protocol Success"
          >
            {intakeFeedback}
          </Alert>
        )}

        <Paper radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)", overflow: "hidden" }}>
          <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead style={{ backgroundColor: "var(--surface-subtle)" }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" }}>ID</Table.Th>
                <Table.Th style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" }}>Vulnerability Title</Table.Th>
                <Table.Th style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" }}>Program Scope</Table.Th>
                <Table.Th style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" }}>Severity</Table.Th>
                <Table.Th style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" }}>Status</Table.Th>
                <Table.Th style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" }}>Assigned Defender</Table.Th>
                <Table.Th style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", textAlign: "right" }}>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredReports.map((r, idx) => (
                <Table.Tr
                  key={(r as any).uuid || `${r.id}-${idx}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedReportId(r.id);
                    setViewMode("report");
                  }}
                >
                  <Table.Td>
                    <Text size="xs" fw={700} ff="monospace" style={{ color: "var(--text-primary)" }}>{r.id}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Box style={{ maxWidth: 360 }}>
                      <Text size="xs" fw={600} truncate style={{ color: "var(--text-primary)" }}>{r.title}</Text>
                      <Text size="11px" c="dimmed">Reported by {r.reporter} · {r.environment} ({r.version})</Text>
                    </Box>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="xs" variant="outline" color="gray">{r.programSlug}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="xs"
                      variant="light"
                      color={r.severity === "Critical" ? "red" : r.severity === "High" ? "orange" : "teal"}
                    >
                      {r.severity} {r.cvss}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="xs"
                      variant={r.status === "Retest pending" ? "outline" : "light"}
                      color={r.status === "Retest pending" ? "orange" : "teal"}
                    >
                      {r.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {(() => {
                      const email = currentUserEmail?.toLowerCase();
                      const userPrefix = email ? email.split("@")[0] : null;
                      const isAssignedToCaller =
                        (email && r.assignedDefenderEmail?.toLowerCase() === email) ||
                        (email && r.assignedDefender?.toLowerCase().includes(email)) ||
                        (userPrefix && r.assignedDefender?.toLowerCase().includes(userPrefix)) ||
                        (currentUserName && r.assignedDefender?.toLowerCase().includes(currentUserName.toLowerCase()));

                      return isAssignedToCaller ? (
                        <Badge size="xs" variant="filled" color="blue">
                          You ({r.assignedDefender})
                        </Badge>
                      ) : (
                        <Badge size="xs" variant="outline" color="gray">
                          {r.assignedDefender || "Unassigned"}
                        </Badge>
                      );
                    })()}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      color="teal"
                      rightSection={<ArrowRightIcon size={12} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReportId(r.id);
                        setViewMode("report");
                      }}
                    >
                      Inspect
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}

              {filteredReports.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7} style={{ textAlign: "center", padding: "40px 20px" }}>
                    <Text size="sm" fw={600} style={{ color: "var(--text-primary)" }}>
                      No reports found for this program scope.
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      {activeProgram
                        ? `No vulnerability reports have been submitted under ${activeProgram.name} yet.`
                        : "No reports match the selected filters."}
                    </Text>
                    <Group justify="center" gap="xs" mt="md">
                      {activeProgram && (
                        <Button
                          size="xs"
                          variant="outline"
                          color="gray"
                          onClick={() => onSelectProgramSlug(null)}
                        >
                          View All Programs
                        </Button>
                      )}
                      <Button
                        size="xs"
                        color="teal"
                        onClick={() => setIntakeModalOpen(true)}
                      >
                        Ingest Report for this Scope
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </Box>
  );
};
