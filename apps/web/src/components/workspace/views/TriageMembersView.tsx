"use client";

import React from "react";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { TrashIcon } from "../icons";
import { TriageMemberItem, formatRole } from "../types";

export interface TriageMembersViewProps {
  triageMembers: TriageMemberItem[];
  memberActionSuccess: string | null;
  onClearMemberActionSuccess: () => void;
  onOpenInviteModal: () => void;
  onSelectRemoveTarget: (member: TriageMemberItem) => void;
}

export function TriageMembersView({
  triageMembers,
  memberActionSuccess,
  onClearMemberActionSuccess,
  onOpenInviteModal,
  onSelectRemoveTarget,
}: TriageMembersViewProps) {
  return (
    <Box px={{ base: "md", md: 32 }} py={{ base: "md", md: 28 }}>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Box>
            <Text
              component="h1"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              Triage Team Members &amp; Defenders
            </Text>
            <Text size="sm" c="dimmed">
              Assign designated defenders to programs with specialized roles: Lead Triager, Program Triager, Code Reviewer, and Remediation Engineer.
            </Text>
          </Box>
          <Button
            color="teal"
            style={{ backgroundColor: "var(--color-primary, #0B2E22)", color: "#FFFFFF" }}
            onClick={onOpenInviteModal}
          >
            + Invite Triage Member
          </Button>
        </Group>

        {/* Success Notification on Member Removal */}
        {memberActionSuccess && (
          <Alert
            color="teal"
            variant="light"
            withCloseButton
            onClose={onClearMemberActionSuccess}
            title="Defender Access Revoked"
          >
            {memberActionSuccess}
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {triageMembers.map((m) => (
            <Card
              key={m.id}
              p="md"
              radius="md"
              style={{
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-contrast)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Avatar size={36} radius="xl" color={m.avatarColor}>
                    {m.name.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Badge size="xs" variant="light" color={m.role === "ORG_OWNER" ? "teal" : "blue"}>
                    {formatRole(m.role)}
                  </Badge>
                </Group>

                <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                  {m.name}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {m.email}
                </Text>

                <Divider my="xs" style={{ borderColor: "var(--border-subtle)" }} />

                <Stack gap={4}>
                  <Text size="11px" c="dimmed">
                    Assigned Program:
                  </Text>
                  <Text size="xs" fw={600} truncate>
                    {m.programName}
                  </Text>
                  <Text size="11px" c="dimmed" mt={2}>
                    Encryption Key Status:
                  </Text>
                  <Badge size="xs" variant="outline" color="teal">
                    {m.keyStatus}
                  </Badge>
                  <Text size="10px" ff="monospace" c="dimmed" truncate mt={2}>
                    {m.keyFingerprint}
                  </Text>
                </Stack>
              </Box>

              {/* Member Removal / Revocation Action (SRS §2.4.2) */}
              <Box mt="md" pt="xs" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                {m.role === "ORG_OWNER" ? (
                  <Text size="11px" c="dimmed" style={{ fontStyle: "italic", textAlign: "center" }}>
                    Permanent Owner · Non-revocable
                  </Text>
                ) : (
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    fullWidth
                    leftSection={<TrashIcon size={13} />}
                    onClick={() => onSelectRemoveTarget(m)}
                    style={{
                      border: "1px solid rgba(220, 38, 38, 0.2)",
                      backgroundColor: "rgba(220, 38, 38, 0.04)",
                    }}
                  >
                    Revoke Member Access
                  </Button>
                )}
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
