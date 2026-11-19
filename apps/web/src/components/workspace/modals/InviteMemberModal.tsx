"use client";

import React from "react";
import { Alert, Box, Button, Code, CopyButton, Divider, Group, Modal, Select, Stack, Text, TextInput } from "@mantine/core";
import { ProgramItem } from "../types";
import { CheckIcon, CopyIcon, ShieldIcon } from "../icons";

export interface InviteResult {
  success: boolean;
  onboardingUrl?: string;
  directAccepted?: boolean;
  message?: string;
  recipient?: string;
}

export interface InviteMemberModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newMemberEmail: string;
  onNewMemberEmailChange: (v: string) => void;
  newMemberRole: string;
  onNewMemberRoleChange: (v: string) => void;
  newMemberProgram: string;
  onNewMemberProgramChange: (v: string) => void;
  programsList: ProgramItem[];
  sending?: boolean;
  lastInviteResult?: InviteResult | null;
  onClearLastInviteResult?: () => void;
}

export function InviteMemberModal({
  opened,
  onClose,
  onSubmit,
  newMemberEmail,
  onNewMemberEmailChange,
  newMemberRole,
  onNewMemberRoleChange,
  newMemberProgram,
  onNewMemberProgramChange,
  programsList,
  sending = false,
  lastInviteResult,
  onClearLastInviteResult,
}: InviteMemberModalProps) {
  const handleClose = () => {
    if (onClearLastInviteResult) onClearLastInviteResult();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <ShieldIcon size={18} color="#16654C" />
          <Text fw={700}>
            {lastInviteResult ? "Defender Invitation Status" : "Invite Triage Team Member"}
          </Text>
        </Group>
      }
      centered
      styles={{ content: { backgroundColor: "var(--surface-card)" } }}
    >
      {lastInviteResult ? (
        <Stack gap="md">
          <Alert
            color="teal"
            variant="light"
            title={lastInviteResult.directAccepted ? "Defender Linked Directly" : "Invitation Dispatched"}
            icon={<CheckIcon size={16} color="#16654C" />}
          >
            {lastInviteResult.message || "Invitation created successfully."}
          </Alert>

          {lastInviteResult.onboardingUrl && (
            <Box
              p="sm"
              style={{
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Text size="xs" fw={700} c="dimmed" mb={4}>
                DIRECT INVITATION / ONBOARDING LINK:
              </Text>
              <Code block style={{ wordBreak: "break-all", fontSize: "11px", marginBottom: "8px" }}>
                {lastInviteResult.onboardingUrl}
              </Code>
              <Group justify="space-between" align="center">
                <Text size="11px" c="dimmed">
                  Copy and share directly or open in the invitee&apos;s browser.
                </Text>
                <CopyButton value={lastInviteResult.onboardingUrl}>
                  {({ copied, copy }) => (
                    <Button
                      size="xs"
                      color={copied ? "teal" : "gray"}
                      variant="light"
                      leftSection={copied ? <CheckIcon size={12} color="#16654C" /> : <CopyIcon size={12} />}
                      onClick={copy}
                    >
                      {copied ? "Copied" : "Copy Link"}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Box>
          )}

          <Divider my="xs" style={{ borderColor: "var(--border-subtle)" }} />

          <Group justify="flex-end">
            {onClearLastInviteResult && (
              <Button
                variant="default"
                size="xs"
                onClick={() => {
                  onClearLastInviteResult();
                  onNewMemberEmailChange("");
                }}
              >
                Invite Another Member
              </Button>
            )}
            <Button color="teal" size="xs" onClick={handleClose}>
              Done
            </Button>
          </Group>
        </Stack>
      ) : (
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <TextInput
              label="Member Work Email"
              placeholder="defender@northstar.example"
              required
              type="email"
              value={newMemberEmail}
              onChange={(e) => onNewMemberEmailChange(e.currentTarget.value)}
              disabled={sending}
              description="If already registered on this site, defender role is granted immediately."
            />
            <Select
              label="Assigned Triage Role"
              data={[
                { label: "Lead Triager (Triages & coordinates consensus)", value: "LEAD_TRIAGER" },
                { label: "Program Triager (Reproduces & verifies PoCs)", value: "TRIAGER" },
                { label: "Code Reviewer (Inspects git branch commits)", value: "REVIEWER" },
                { label: "Remediation Engineer (Authors patches & snapshots)", value: "REMEDIATOR" },
              ]}
              value={newMemberRole}
              onChange={(v) => onNewMemberRoleChange(v || "TRIAGER")}
              disabled={sending}
            />
            <Select
              label="Assign to In-House Program"
              data={programsList.map((p) => ({ label: p.name, value: p.name }))}
              value={newMemberProgram}
              onChange={(v) => onNewMemberProgramChange(v || programsList[0]?.name || "")}
              disabled={sending}
            />

            <div
              style={{
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "8px",
                padding: "10px 12px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Text size="xs" c="dimmed" style={{ lineHeight: 1.45 }}>
                BugBountyTrack Email Service records the invitation in the RFC 5322 Notification Outbox and delivers via live SMTP when configured. Existing defenders on this site are automatically linked without delay.
              </Text>
            </div>

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" color="gray" onClick={handleClose} disabled={sending}>
                Cancel
              </Button>
              <Button type="submit" color="teal" loading={sending}>
                Dispatch Invitation Email
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
