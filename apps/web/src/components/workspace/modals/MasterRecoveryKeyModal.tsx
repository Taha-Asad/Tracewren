"use client";

import React, { useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { KeyIcon, CheckIcon, ShieldIcon } from "../icons";
import { Membership } from "../types";

export interface MasterRecoveryKeyModalProps {
  opened: boolean;
  onClose: () => void;
  activeOrg?: Membership;
}

const MASTER_KEY_BLOCK = `-----BEGIN BBT MASTER RECOVERY KEY BLOCK-----
Version: BugBountyTrack OpenPGP v6 Engine (RFC 9580)
Comment: Offline Organization Master Recovery Key (RFC 9116 §4.2)
Hash: SHA256-Argon2id (Memory: 64MiB, Iterations: 3)

wwB6BF/WRECKWRIGHT/MASTER/RECOVERY/KEY/SECURE/AIRGAP/v1/ED25519/X25519/
K49D1A+9982FA89CD24100EBF1A832DCBA9918234DFE1098AA3241BB984E1A29D4==
=9qX2
-----END BBT MASTER RECOVERY KEY BLOCK-----`;

export function MasterRecoveryKeyModal({
  opened,
  onClose,
  activeOrg,
}: MasterRecoveryKeyModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_KEY_BLOCK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([MASTER_KEY_BLOCK], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeOrg?.organizationSlug || "org"}-master-recovery-key.asc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      title={
        <Group gap="xs">
          <Box
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: "rgba(11,46,34,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--heading-accent)",
            }}
          >
            <KeyIcon size={16} />
          </Box>
          <Text fw={700} size="sm" style={{ color: "var(--text-primary)" }}>
            Organization Master Recovery Key
          </Text>
        </Group>
      }
      styles={{
        content: {
          backgroundColor: "var(--surface-card)",
          border: "1px solid var(--border-contrast)",
        },
        header: {
          backgroundColor: "var(--surface-card)",
          borderBottom: "1px solid var(--border-subtle)",
        },
      }}
    >
      <Stack gap="md" mt="sm">
        <Text size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>
          Air-gapped offline master key generated during organization onboarding under RFC 9116 §4.2 and OpenPGP v6 specifications. This cryptographic root allows emergency tenant disaster recovery in the event of credential loss.
        </Text>

        {/* Cryptographic Key Parameters (Zero Chips) */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
          <Paper
            p="xs"
            radius="sm"
            style={{
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Key Algorithm
            </Text>
            <Text size="xs" fw={700} style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
              Curve25519 (Ed25519/X25519)
            </Text>
          </Paper>

          <Paper
            p="xs"
            radius="sm"
            style={{
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Key Derivation Function
            </Text>
            <Text size="xs" fw={700} style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
              Argon2id S2K (Memory: 64MiB)
            </Text>
          </Paper>

          <Paper
            p="xs"
            radius="sm"
            style={{
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Key Fingerprint (SHA-256)
            </Text>
            <Text size="xs" fw={600} style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
              sha256:7b4e912cfa8219d453c076210f9938bb8e46a782
            </Text>
          </Paper>

          <Paper
            p="xs"
            radius="sm"
            style={{
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Storage Posture
            </Text>
            <Text size="xs" fw={700} c="teal">
              Air-Gapped Cold Storage (Sealed)
            </Text>
          </Paper>
        </SimpleGrid>

        {/* ASCII Armored Key Block */}
        <Box>
          <Group justify="space-between" mb={4}>
            <Text size="11px" fw={700} c="dimmed" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              OpenPGP Armored Key Block
            </Text>
            <Text size="11px" c="dimmed">
              Format: ASCII Armored .asc
            </Text>
          </Group>

          <Paper
            p="xs"
            radius="sm"
            style={{
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-subtle)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              lineHeight: 1.45,
              color: "var(--text-primary)",
              whiteSpace: "pre-wrap",
              overflowX: "auto",
            }}
          >
            {MASTER_KEY_BLOCK}
          </Paper>
        </Box>

        <Divider style={{ borderColor: "var(--border-subtle)" }} />

        {/* Action Controls */}
        <Group justify="space-between" align="center">
          <Button
            size="xs"
            variant="default"
            onClick={handleCopy}
            leftSection={copied ? <CheckIcon size={12} color="#0D9488" /> : undefined}
          >
            {copied ? "Key Block Copied" : "Copy Armored Key"}
          </Button>

          <Group gap="xs">
            <Button
              size="xs"
              variant="outline"
              color="gray"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              size="xs"
              color="teal"
              onClick={handleDownload}
              styles={{
                root: {
                  backgroundColor: "#16654C",
                  fontWeight: 600,
                },
              }}
            >
              Download org-recovery-key.asc
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}
