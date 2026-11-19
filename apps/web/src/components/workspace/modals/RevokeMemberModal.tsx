"use client";

import React from "react";
import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { TrashIcon } from "../icons";
import { TriageMemberItem } from "../types";

export interface RevokeMemberModalProps {
  removeMemberTarget: TriageMemberItem | null;
  onClose: () => void;
  onConfirmRemove: () => void;
  removingMember: boolean;
}

export function RevokeMemberModal({
  removeMemberTarget,
  onClose,
  onConfirmRemove,
  removingMember,
}: RevokeMemberModalProps) {
  return (
    <Modal
      opened={!!removeMemberTarget}
      onClose={onClose}
      title={
        <Group gap="xs">
          <TrashIcon size={16} color="#DC2626" />
          <Text fw={700} style={{ color: "#DC2626" }}>
            Revoke Triage Defender Access
          </Text>
        </Group>
      }
      centered
      styles={{ content: { backgroundColor: "var(--surface-card)" } }}
    >
      <Stack gap="md">
        <Text size="sm" style={{ color: "var(--text-primary)" }}>
          Are you sure you want to revoke triage membership for <strong>{removeMemberTarget?.name}</strong> ({removeMemberTarget?.email})?
        </Text>

        <Box p="xs" style={{ backgroundColor: "var(--surface-subtle)", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
          <Text size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>
            <strong>SRS §2.4.2 &amp; §3.3 Protocol:</strong> Revoking this defender rotates the program recipient key set and increments <code>report_recipient_version</code>. This member will lose decryption capability for subsequent vulnerability reports.
          </Text>
        </Box>

        <Group justify="flex-end" mt="sm">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="red"
            loading={removingMember}
            onClick={onConfirmRemove}
          >
            Confirm Revocation
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
