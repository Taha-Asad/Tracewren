"use client";

import React from "react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { DownloadIcon } from "../../icons";
import { ReportItem } from "../../types";

export interface ReportOverviewTabProps {
  report: ReportItem;
}

export function ReportOverviewTab({ report }: ReportOverviewTabProps) {
  return (
    <Grid gap={32}>
      {/* Left Column (~68% width) */}
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Stack gap="xl">
          <Box>
            <Text size="md" fw={700} mb={6} style={{ color: "var(--text-primary)" }}>
              Finding and impact
            </Text>
            <Text size="sm" fw={700} mb={4} style={{ color: "var(--text-primary)" }}>
              An export crossed workspaces.
            </Text>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
              Changing the workspace ID returned export metadata from another workspace, indicating a missing authorization check on the export endpoint.
            </Text>
          </Box>

          {/* Visual Attack Flow Diagram */}
          <Card
            p="lg"
            radius="md"
            style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}
          >
            <Grid gap="md" align="center">
              <Grid.Col span={{ base: 12, sm: 5 }}>
                <Card
                  p={0}
                  radius="sm"
                  style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}
                >
                  <Box
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid var(--border-subtle)",
                      backgroundColor: "var(--surface-hover)",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Box style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#E57373" }} />
                    <Box style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#FFB74D" }} />
                    <Box style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#81C784" }} />
                    <Text size="10px" c="dimmed" ff="monospace" ml={4}>
                      /api/exports?workspace_id=A
                    </Text>
                  </Box>
                  <Box p="xs">
                    <Text size="11px" ff="monospace" style={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                      {`{\n  "workspace_id": "A",\n  "name": "team-export",\n  "items": 42\n}`}
                    </Text>
                  </Box>
                </Card>
                <Group gap={6} mt="xs" align="center">
                  <Avatar size={20} radius="xl" color="teal">
                    A
                  </Avatar>
                  <Text size="11px" c="dimmed">
                    Workspace A (researcher controlled)
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 2 }} style={{ textAlign: "center" }}>
                <Stack align="center" gap={4}>
                  <Box
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: "#FDF3ED",
                      border: "1px solid #E8B9A5",
                      color: "#BA3D2A",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </Box>
                  <Text size="10px" fw={700} c="dimmed">
                    Change workspace_id
                  </Text>
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="#BA3D2A" strokeWidth="2">
                    <line x1="0" y1="6" x2="20" y2="6" />
                    <polyline points="16 2 22 6 16 10" />
                  </svg>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 5 }}>
                <Card
                  p={0}
                  radius="sm"
                  style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}
                >
                  <Box
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid var(--border-subtle)",
                      backgroundColor: "var(--surface-hover)",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Box style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#E57373" }} />
                    <Box style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#FFB74D" }} />
                    <Box style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#81C784" }} />
                    <Text size="10px" c="dimmed" ff="monospace" ml={4}>
                      /api/exports?workspace_id=B
                    </Text>
                  </Box>
                  <Box p="xs">
                    <Text size="11px" ff="monospace" style={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                      {`{\n  `}
                      <span style={{ backgroundColor: "#FCE7D8", padding: "1px 4px", borderRadius: "2px", color: "#BA3D2A", fontWeight: 700 }}>
                        {`"workspace_id": "B"`}
                      </span>
                      {`,\n  `}
                      <span style={{ backgroundColor: "#FCE7D8", padding: "1px 4px", borderRadius: "2px", color: "#BA3D2A" }}>
                        {`"name": "team-export"`}
                      </span>
                      {`,\n  `}
                      <span style={{ backgroundColor: "#FCE7D8", padding: "1px 4px", borderRadius: "2px", color: "#BA3D2A" }}>
                        {`"items": 37`}
                      </span>
                      {`\n}`}
                    </Text>
                  </Box>
                </Card>
                <Group gap={6} mt="xs" align="center">
                  <Avatar size={20} radius="xl" color="red">
                    B
                  </Avatar>
                  <Text size="11px" c="dimmed">
                    Workspace B (another controlled account)
                  </Text>
                </Group>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Comparison Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Card p="md" radius="sm" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-subtle)" }}>
              <Text size="11px" c="dimmed" mb={4}>
                Original test — expected
              </Text>
              <Text size="xl" fw={700} style={{ color: "#16654C" }}>
                403 Forbidden
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                Workspace membership required.
              </Text>
            </Card>

            <Card p="md" radius="sm" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-subtle)" }}>
              <Text size="11px" c="dimmed" mb={4}>
                Original test — observed
              </Text>
              <Text size="xl" fw={700} style={{ color: "#BA3D2A" }}>
                200 OK
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                Metadata for another workspace returned.
              </Text>
            </Card>
          </SimpleGrid>
        </Stack>
      </Grid.Col>

      {/* Right Column (~32% width) */}
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Stack gap="lg">
          {/* Deployment & Retest */}
          <Card p="md" radius="sm" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-subtle)" }}>
            <Text size="xs" fw={700} mb="sm" style={{ color: "var(--text-primary)" }}>
              Deployment and retest
            </Text>
            <SimpleGrid cols={2} spacing="xs" mb="sm">
              <Box>
                <Text size="11px" c="dimmed">
                  Attempt
                </Text>
                <Text size="xs" fw={700}>
                  01
                </Text>
              </Box>
              <Box>
                <Text size="11px" c="dimmed">
                  Version
                </Text>
                <Text size="xs" fw={700}>
                  {report.version}
                </Text>
              </Box>
              <Box>
                <Text size="11px" c="dimmed">
                  Deployed to
                </Text>
                <Text size="xs" fw={700}>
                  {report.environment}
                </Text>
              </Box>
              <Box>
                <Text size="11px" c="dimmed">
                  Deployed
                </Text>
                <Text size="xs" fw={700}>
                  {report.updatedAt}
                </Text>
              </Box>
            </SimpleGrid>
            <Divider my="xs" style={{ borderColor: "var(--border-subtle)" }} />
            <Group justify="space-between" align="center">
              <Text size="11px" c="dimmed">
                Status
              </Text>
              <Badge size="xs" variant="outline" color="orange">
                {report.status}
              </Badge>
            </Group>
          </Card>

          {/* CVSS Assessment */}
          <Card p="md" radius="sm" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-subtle)" }}>
            <Text size="xs" fw={700} mb="sm" style={{ color: "var(--text-primary)" }}>
              CVSS assessment
            </Text>
            <Grid gap="xs" mb="xs">
              <Grid.Col span={6}>
                <Text size="11px" c="dimmed">
                  Defender
                </Text>
                <Text size="xl" fw={700} style={{ color: "#C06C2D" }}>
                  {report.cvss} {report.severity}
                </Text>
              </Grid.Col>
              <Grid.Col span={6} style={{ borderLeft: "1px solid var(--border-subtle)", paddingLeft: "12px" }}>
                <Text size="11px" c="dimmed">
                  Researcher
                </Text>
                <Text size="xl" fw={700} style={{ color: "#BA3D2A" }}>
                  8.1 High
                </Text>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Evidence Files */}
          <Card p="md" radius="sm" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-subtle)" }}>
            <Text size="xs" fw={700} mb="xs" style={{ color: "var(--text-primary)" }}>
              Evidence (2)
            </Text>
            <Stack gap="xs">
              <Box p="xs" style={{ backgroundColor: "var(--surface-subtle)", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
                <Group justify="space-between">
                  <Text size="xs" fw={600}>
                    evidence-request.txt
                  </Text>
                  <ActionIcon component="a" href="/evidence-request.txt" download variant="subtle" size="sm">
                    <DownloadIcon size={14} />
                  </ActionIcon>
                </Group>
              </Box>
              <Box p="xs" style={{ backgroundColor: "var(--surface-subtle)", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
                <Group justify="space-between">
                  <Text size="xs" fw={600}>
                    response-comparison.txt
                  </Text>
                  <ActionIcon component="a" href="/response-comparison.txt" download variant="subtle" size="sm">
                    <DownloadIcon size={14} />
                  </ActionIcon>
                </Group>
              </Box>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
