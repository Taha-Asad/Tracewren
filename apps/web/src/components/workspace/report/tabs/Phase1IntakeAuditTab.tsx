"use client";

import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { CheckIcon, KeyIcon, LockIcon, ShieldIcon } from "../../icons";

export interface Phase1IntakeAuditTabProps {
  showRawOpenPgpArmor: boolean;
  onToggleShowRawOpenPgpArmor: () => void;
}

export function Phase1IntakeAuditTab({
  showRawOpenPgpArmor,
  onToggleShowRawOpenPgpArmor,
}: Phase1IntakeAuditTabProps) {
  return (
    <Stack gap="xl">
      {/* Gate 1 Verification Summary Banner */}
      <Paper p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <Box>
            <Group gap="xs" align="center" mb={4}>
              <Text size="md" fw={700} style={{ color: "var(--text-primary)" }}>
                Phase 1: Intake &amp; Scope Verification (Gate 1 — DoR Baseline)
              </Text>
              <Badge size="sm" variant="filled" color="teal" leftSection={<CheckIcon size={12} color="#FFF" />}>
                DoR Criteria Signed Off
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">
              Governed by IEEE 830 SRS §2.3 (Table 2.1), §3.1 (FR-1.5 Public Intake), §3.2 (FR-2.4 Safe Harbor), and §3.8 (FR-8.4 Quotas).
            </Text>
          </Box>
          <Group gap="xs">
            <Badge size="xs" variant="outline" color="teal">RFC 9116 Policy Attached</Badge>
            <Badge size="xs" variant="outline" color="blue">Turnstile Token Verified</Badge>
          </Group>
        </Group>

        {/* 3 Metric Badges */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" mt="md">
          <Card p="sm" radius="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
            <Text size="11px" c="dimmed" fw={600}>RFC 9116 SCOPE STATUS</Text>
            <Text size="sm" fw={700} style={{ color: "#16654C" }}>IN_SCOPE (100% Match)</Text>
            <Text size="10px" c="dimmed">Target: api.caulvyn.com/export &isin; *.caulvyn.com</Text>
          </Card>
          <Card p="sm" radius="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
            <Text size="11px" c="dimmed" fw={600}>TENANT INTAKE QUOTA (FR-8.4)</Text>
            <Text size="sm" fw={700} style={{ color: "#16654C" }}>1.42 MiB / 20.0 MiB (7.1%)</Text>
            <Text size="10px" c="dimmed">18.58 MiB available intake headroom</Text>
          </Card>
          <Card p="sm" radius="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
            <Text size="11px" c="dimmed" fw={600}>CRYPTOGRAPHIC BOUNDARY</Text>
            <Text size="sm" fw={700} style={{ color: "#16654C" }}>Class B Isolated</Text>
            <Text size="10px" c="dimmed">Zero Plaintext Server Exposure</Text>
          </Card>
        </SimpleGrid>
      </Paper>

      {/* Section 1: RFC 9116 Program Scope & Negative Rules Filtering */}
      <Paper p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
        <Stack gap="md">
          <Group justify="space-between" align="center" wrap="wrap">
            <Group gap="xs">
              <ShieldIcon size={18} />
              <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                RFC 9116 Program Scope &amp; Negative Rules Filtering
              </Text>
            </Group>
            <Badge size="xs" color="teal" variant="light">RFC 9116 §4.2 Safe Harbor Active</Badge>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            {/* Target Resolution */}
            <Box p="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "6px" }}>
              <Text size="xs" fw={700} mb="xs">Submitted Target Asset:</Text>
              <Text size="xs" ff="monospace" style={{ backgroundColor: "var(--surface-card)", padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-contrast)" }}>
                https://api.caulvyn.com/export?workspace_id=test
              </Text>
              <Group gap="xs" mt="xs">
                <Badge size="xs" color="teal" variant="filled">Domain In-Scope</Badge>
                <Text size="11px" c="dimmed">Matches Program Wildcard: <code>*.caulvyn.com</code></Text>
              </Group>
            </Box>

            {/* Negative Filter Audit */}
            <Box p="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "6px" }}>
              <Text size="xs" fw={700} mb="xs">Out-of-Scope Negative Rules Filter:</Text>
              <Stack gap={4}>
                <Group gap="xs">
                  <CheckIcon size={12} color="#16654C" />
                  <Text size="11px">Third-party payment gateways (Stripe): <strong>Excluded</strong></Text>
                </Group>
                <Group gap="xs">
                  <CheckIcon size={12} color="#16654C" />
                  <Text size="11px">Denial of Service (DoS/DDoS) volumetric flood: <strong>Excluded</strong></Text>
                </Group>
                <Group gap="xs">
                  <CheckIcon size={12} color="#16654C" />
                  <Text size="11px">Social Engineering &amp; Phishing: <strong>Excluded</strong></Text>
                </Group>
              </Stack>
            </Box>
          </SimpleGrid>
        </Stack>
      </Paper>

      {/* Section 2: Turnstile Session & Quota Enforcement (FR-8.4) */}
      <Paper p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
        <Stack gap="md">
          <Group justify="space-between" align="center" wrap="wrap">
            <Group gap="xs">
              <LockIcon size={18} />
              <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                Anti-Abuse Token &amp; Tenant Quota Enforcement (FR-8.4)
              </Text>
            </Group>
            <Badge size="xs" color="blue" variant="outline">30-Min Session Token</Badge>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <Box>
              <Text size="11px" c="dimmed">Turnstile Anti-Abuse Token:</Text>
              <Text size="xs" fw={600} ff="monospace" truncate>0x4AAAAAAAErX91F...2b80a</Text>
              <Text size="10px" c="teal">Verified via Turnstile API (200 OK)</Text>
            </Box>
            <Box>
              <Text size="11px" c="dimmed">Rate Limit Budget (Hourly IP Pool):</Text>
              <Text size="xs" fw={600}>1 of 5 submissions consumed</Text>
              <Text size="10px" c="dimmed">Token Lease valid until 18:30 UTC</Text>
            </Box>
            <Box>
              <Text size="11px" c="dimmed">Payload &amp; Attachment Reservation:</Text>
              <Text size="xs" fw={600}>2 files (142.8 KiB)</Text>
              <Text size="10px" c="teal">Within 10.0 MiB reservation cap</Text>
            </Box>
          </SimpleGrid>
        </Stack>
      </Paper>

      {/* Section 3: Field-Level Cryptographic Classification Matrix (Table 2.1) */}
      <Paper p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
        <Stack gap="md">
          <Group justify="space-between" align="center" wrap="wrap">
            <Group gap="xs">
              <KeyIcon size={18} />
              <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                Field-Level Cryptographic Classification Matrix (Table 2.1)
              </Text>
            </Group>
            <Group gap="xs">
              <Button size="compact-xs" variant="light" color="teal" onClick={onToggleShowRawOpenPgpArmor}>
                {showRawOpenPgpArmor ? "Hide OpenPGP Armor" : "Inspect OpenPGP v6 Armor"}
              </Button>
              <Badge size="xs" color="teal" variant="filled">OpenPGP v6 / RFC 9580</Badge>
            </Group>
          </Group>

          <Table highlightOnHover verticalSpacing="xs" horizontalSpacing="sm">
            <Table.Thead style={{ backgroundColor: "var(--surface-subtle)" }}>
              <Table.Tr>
                <Table.Th style={{ fontSize: "11px" }}>Data Field</Table.Th>
                <Table.Th style={{ fontSize: "11px" }}>Classification</Table.Th>
                <Table.Th style={{ fontSize: "11px" }}>Storage Format</Table.Th>
                <Table.Th style={{ fontSize: "11px" }}>Client-Side Recipient Keys</Table.Th>
                <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td><Text size="xs" fw={600} ff="monospace">report_id / slug</Text></Table.Td>
                <Table.Td><Badge size="xs" variant="outline" color="gray">Class A (Plaintext)</Badge></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">PostgreSQL Column (bbt_core.reports)</Text></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">Public Operational Label</Text></Table.Td>
                <Table.Td style={{ textAlign: "right" }}><Badge size="xs" color="teal">Valid</Badge></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td><Text size="xs" fw={600} ff="monospace">title_ciphertext</Text></Table.Td>
                <Table.Td><Badge size="xs" variant="filled" color="teal">Class B (Confidential)</Badge></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">OpenPGP v6 Armored Envelope</Text></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">Submitter + Active Defender Keys</Text></Table.Td>
                <Table.Td style={{ textAlign: "right" }}><Badge size="xs" color="teal">Encrypted</Badge></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td><Text size="xs" fw={600} ff="monospace">description_ciphertext</Text></Table.Td>
                <Table.Td><Badge size="xs" variant="filled" color="teal">Class B (Confidential)</Badge></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">OpenPGP v6 Armored Envelope</Text></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">Submitter + Active Defender Keys</Text></Table.Td>
                <Table.Td style={{ textAlign: "right" }}><Badge size="xs" color="teal">Encrypted</Badge></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td><Text size="xs" fw={600} ff="monospace">reproduction_poc_ciphertext</Text></Table.Td>
                <Table.Td><Badge size="xs" variant="filled" color="teal">Class B (Confidential)</Badge></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">OpenPGP v6 Armored Envelope</Text></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">Submitter + Active Defender Keys</Text></Table.Td>
                <Table.Td style={{ textAlign: "right" }}><Badge size="xs" color="teal">Encrypted</Badge></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td><Text size="xs" fw={600} ff="monospace">attachment_evidence</Text></Table.Td>
                <Table.Td><Badge size="xs" variant="filled" color="teal">Class B (Binary)</Badge></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">R2 Presigned Vault Object Key</Text></Table.Td>
                <Table.Td><Text size="xs" c="dimmed">OpenPGP SEIPDv2 Chunked Stream</Text></Table.Td>
                <Table.Td style={{ textAlign: "right" }}><Badge size="xs" color="teal">Encrypted</Badge></Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          {showRawOpenPgpArmor && (
            <Paper p="sm" radius="sm" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-contrast)" }}>
              <Group justify="space-between" align="center" mb={6}>
                <Text size="11px" fw={700} c="dimmed">Client-Side Armored Ciphertext Payload (OpenPGP v6 / RFC 9580):</Text>
                <Badge size="xs" variant="outline" color="gray">report_recipient_version = 1</Badge>
              </Group>
              <Text size="10px" ff="monospace" style={{ whiteSpace: "pre-wrap", lineHeight: 1.4, color: "var(--text-secondary)" }}>
{`-----BEGIN PGP MESSAGE-----
Version: Caulvyn OpenPGP v6 Core (RFC 9580)
Comment: Client-side cryptographic isolation active

wy4ECQMI7K3sN1a9R4H/0sBNACvE7mJ2L4t9pW0Q8aR+4K1T8jW0...
...[2,048-bit Ed25519/Curve25519 PKESK packet for Submitter]...
...[2,048-bit Ed25519/Curve25519 PKESK packet for Sarah Chen (Org Owner)]...
...[SEIPDv2 Encrypted Data Packet with Argon2id Key Derivation]...
=k9Xz
-----END PGP MESSAGE-----`}
              </Text>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
