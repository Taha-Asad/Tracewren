"use client";

import React from "react";
import { Badge, Box, Card, Group, Stack, Text } from "@mantine/core";
import { CheckIcon } from "../../icons";
import { ReportItem } from "../../types";

export interface ReportActivityTabProps {
  report: ReportItem;
}

export function ReportActivityTab({ report }: ReportActivityTabProps) {
  return (
    <Stack gap="md">
      <Text size="md" fw={700} style={{ color: "var(--text-primary)" }}>
        Immutable Audit &amp; Activity Log
      </Text>
      <Text size="sm" c="dimmed">
        Cryptographic ledger records for report state transitions, key rotations, and verification attestations.
      </Text>

      <Card p="md" radius="sm" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-subtle)", maxWidth: 700 }}>
        <Stack gap="sm">
          <Box p="xs" style={{ backgroundColor: "var(--surface-subtle)", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <CheckIcon size={13} color="#16654C" />
                <Text size="xs" fw={600}>Phase 1 Intake Baseline Established</Text>
              </Group>
              <Badge size="xs" variant="light" color="teal">Gate 1 Passed</Badge>
            </Group>
            <Text size="11px" c="dimmed" mt={4}>
              RFC 9116 scope confirmed, Turnstile token authenticated, and OpenPGP v6 recipient envelope sealed at {report.createdAt}.
            </Text>
          </Box>

          <Box p="xs" style={{ backgroundColor: "var(--surface-subtle)", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <CheckIcon size={13} color="#16654C" />
                <Text size="xs" fw={600}>Remediation Patch Proposed &amp; Deployed</Text>
              </Group>
              <Badge size="xs" variant="light" color="blue">Attempt #1</Badge>
            </Group>
            <Text size="11px" c="dimmed" mt={4}>
              Deployed commit 8f2a1d3 to {report.environment} ({report.version}) by {report.assignedDefender}.
            </Text>
          </Box>

          <Box p="xs" style={{ backgroundColor: "var(--surface-subtle)", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <CheckIcon size={13} color="#16654C" />
                <Text size="xs" fw={600}>Dual-Lane Encrypted Discussion Initialized</Text>
              </Group>
              <Badge size="xs" variant="outline" color="gray">Socket.io Stream</Badge>
            </Group>
            <Text size="11px" c="dimmed" mt={4}>
              Class B Researcher channel and Class C Internal notes initialized with group admin controls.
            </Text>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}
