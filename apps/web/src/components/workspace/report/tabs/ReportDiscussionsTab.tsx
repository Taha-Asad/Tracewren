"use client";

import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { CrownIcon, SendIcon } from "../../icons";
import { DiscussionMessageItem } from "../../types";

export interface ReportDiscussionsTabProps {
  selectedReportId: string;
  reportDiscussions: DiscussionMessageItem[];
  discussionLane: "RESEARCHER_ORG" | "REVIEWER_INTERNAL";
  onDiscussionLaneChange: (lane: "RESEARCHER_ORG" | "REVIEWER_INTERNAL") => void;
  socketLatency: number;
  researcherTyping: boolean;
  onSimulateResearcherReply: () => void;
  newDiscussionText: string;
  onNewDiscussionTextChange: (text: string) => void;
  onPostDiscussionMessage: () => void;
}

export function ReportDiscussionsTab({
  selectedReportId,
  reportDiscussions,
  discussionLane,
  onDiscussionLaneChange,
  socketLatency,
  researcherTyping,
  onSimulateResearcherReply,
  newDiscussionText,
  onNewDiscussionTextChange,
  onPostDiscussionMessage,
}: ReportDiscussionsTabProps) {
  return (
    <Paper p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="wrap">
          <Box>
            <Group gap="xs" align="center">
              <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                Dual-Lane Discussion for {selectedReportId}
              </Text>
              <Badge size="xs" variant="dot" color="teal">
                Socket.io Connected ({socketLatency}ms)
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">
              Encrypted cryptographic communication channels (Class B &amp; Class C).
            </Text>
          </Box>
          <SegmentedControl
            value={discussionLane}
            onChange={(v) => onDiscussionLaneChange(v as "RESEARCHER_ORG" | "REVIEWER_INTERNAL")}
            data={[
              { label: "Researcher ↔ Org (Class B)", value: "RESEARCHER_ORG" },
              { label: "Internal Notes (Class C)", value: "REVIEWER_INTERNAL" },
            ]}
            color="teal"
          />
        </Group>

        <Divider style={{ borderColor: "var(--border-subtle)" }} />

        {reportDiscussions.map((msg) => {
          const isOwner =
            msg.senderName === "Sarah Chen" ||
            msg.senderRole.includes("Owner") ||
            msg.senderRole.includes("Admin");
          return (
            <Paper
              key={msg.id}
              p="md"
              radius="md"
              style={{
                backgroundColor:
                  msg.senderActorType === "HUNTER" ? "var(--surface-subtle)" : "rgba(11, 46, 34, 0.04)",
                border: msg.lane === "REVIEWER_INTERNAL" ? "1px solid #C4DEC9" : "1px solid var(--border-subtle)",
              }}
            >
              <Group justify="space-between" align="center" mb={6}>
                <Group gap="xs" align="center" wrap="wrap">
                  <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>
                    {msg.senderName}
                  </Text>
                  {isOwner && (
                    <Badge size="xs" variant="filled" color="teal" leftSection={<CrownIcon size={10} color="#FFFFFF" />}>
                      Group Admin
                    </Badge>
                  )}
                  <Badge size="xs" variant="light" color={msg.senderActorType === "HUNTER" ? "orange" : "teal"}>
                    {msg.senderRole}
                  </Badge>
                </Group>
                <Text size="11px" c="dimmed">
                  {msg.createdAt}
                </Text>
              </Group>
              <Text size="sm" style={{ color: "var(--text-primary)", lineHeight: 1.5 }}>
                {msg.content}
              </Text>
            </Paper>
          );
        })}

        {/* Real-time Typing Indicator */}
        {researcherTyping && (
          <Paper p="xs" radius="md" style={{ backgroundColor: "rgba(255, 152, 0, 0.08)", border: "1px dashed #FFA726" }}>
            <Group gap="xs" align="center">
              <Loader size={14} color="orange" />
              <Text size="xs" c="orange.8" fw={600}>
                Alex Rivera (Security Researcher) is typing via real-time WebSocket channel...
              </Text>
            </Group>
          </Paper>
        )}

        <Box mt="xs">
          <Textarea
            placeholder={`Post message to ${discussionLane === "RESEARCHER_ORG" ? "Researcher Lane" : "Internal Notes"}...`}
            minRows={3}
            value={newDiscussionText}
            onChange={(e) => onNewDiscussionTextChange(e.currentTarget.value)}
          />
          <Group justify="space-between" align="center" mt="xs" wrap="wrap">
            <Button
              size="xs"
              variant="light"
              color="orange"
              loading={researcherTyping}
              onClick={onSimulateResearcherReply}
              title="Simulate live incoming message from researcher Alex Rivera via Socket.io"
            >
              Simulate Researcher Reply
            </Button>

            <Button
              size="xs"
              color="teal"
              rightSection={<SendIcon size={13} />}
              onClick={onPostDiscussionMessage}
              disabled={!newDiscussionText.trim()}
            >
              Send Encrypted Message
            </Button>
          </Group>
        </Box>
      </Stack>
    </Paper>
  );
}
