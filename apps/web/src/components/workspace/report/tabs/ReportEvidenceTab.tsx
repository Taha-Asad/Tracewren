"use client";

import React from "react";
import { ActionIcon, Box, Card, Group, Stack, Text } from "@mantine/core";
import { DownloadIcon } from "../../icons";

export function ReportEvidenceTab() {
  return (
    <Stack gap="md">
      <Text size="md" fw={700} style={{ color: "var(--text-primary)" }}>
        Encrypted Evidence Vault (Class B Binary Storage)
      </Text>
      <Text size="sm" c="dimmed">
        Files are decrypted locally using client-side OpenPGP v6 private key after presigned vault download.
      </Text>

      <Card
        p="md"
        radius="sm"
        style={{
          backgroundColor: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          maxWidth: 600,
        }}
      >
        <Stack gap="xs">
          <Box
            p="xs"
            style={{
              backgroundColor: "var(--surface-subtle)",
              borderRadius: 6,
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Group justify="space-between">
              <Box>
                <Text size="xs" fw={600}>
                  evidence-request.txt
                </Text>
                <Text size="10px" c="dimmed">
                  HTTP capture with workspace_id manipulation · 4.2 KiB
                </Text>
              </Box>
              <ActionIcon component="a" href="/evidence-request.txt" download variant="subtle" size="sm">
                <DownloadIcon size={14} />
              </ActionIcon>
            </Group>
          </Box>

          <Box
            p="xs"
            style={{
              backgroundColor: "var(--surface-subtle)",
              borderRadius: 6,
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Group justify="space-between">
              <Box>
                <Text size="xs" fw={600}>
                  response-comparison.txt
                </Text>
                <Text size="10px" c="dimmed">
                  Side-by-side diff between 403 Forbidden and leaked 200 OK · 12.8 KiB
                </Text>
              </Box>
              <ActionIcon component="a" href="/response-comparison.txt" download variant="subtle" size="sm">
                <DownloadIcon size={14} />
              </ActionIcon>
            </Group>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}
