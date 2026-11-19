"use client";

import React, { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { CheckIcon, ShieldIcon } from "../icons";

export interface RecordInternalVerificationModalProps {
  opened: boolean;
  onClose: () => void;
  reportTitle?: string;
  reportId?: string;
  onConfirm?: (attestation: {
    outcome: string;
    environment: string;
    notes: string;
    testerName: string;
    evidenceLog: string;
  }) => void;
}

export function RecordInternalVerificationModal({
  opened,
  onClose,
  reportTitle = "Cross-Tenant Workspace Boundary Bypass",
  reportId = "REP-01",
  onConfirm,
}: RecordInternalVerificationModalProps) {
  const [outcome, setOutcome] = useState<string>("PASS");
  const [environment, setEnvironment] = useState<string>("Production (v0.8.4)");
  const [testerName, setTesterName] = useState<string>("Taha Asadullah (Lead Defender)");
  const [notes, setNotes] = useState<string>(
    "Executed verification test against authenticated tenant endpoints. Verified boundary enforcement and patched vector. All acceptance criteria PASSED."
  );
  const [evidenceLog, setEvidenceLog] = useState<string>(
    `[SUITE] Tenant Boundary Enforcement Verification\n[CHECK] Scope Isolation Check: PASSED (Strict tenant isolation active)\n[RESULT] HTTP 200 OK - Verification Attested Clean`
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onConfirm) {
      onConfirm({
        outcome,
        environment,
        notes,
        testerName,
        evidenceLog,
      });
    }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <ShieldIcon size={18} color="var(--mantine-color-teal-6)" />
          <Text fw={700} style={{ color: "var(--text-primary)" }}>
            Record Internal Remediation Verification
          </Text>
        </Group>
      }
      size="lg"
      centered
      styles={{
        content: {
          backgroundColor: "var(--surface-card)",
          border: "1px solid var(--border-contrast)",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Box>
            <Group justify="space-between" align="center" mb={4}>
              <Text size="xs" c="dimmed">
                Target Report: <strong style={{ color: "var(--text-primary)" }}>{reportTitle}</strong> ({reportId})
              </Text>
              <Badge size="xs" variant="outline" color="teal">
                IEEE/ISO 29147 &amp; FR-6.3
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">
              Attest to the internal verification of the proposed security remediation before or in parallel with external researcher re-validation.
            </Text>
          </Box>

          <Divider style={{ borderColor: "var(--border-subtle)" }} />

          <Group grow align="flex-start">
            <Select
              label="Verification Outcome"
              value={outcome}
              onChange={(val) => setOutcome(val || "PASS")}
              data={[
                { value: "PASS", label: "PASS — Remediation Verified Functional" },
                { value: "FAIL", label: "FAIL — Vulnerability Still Reproducible" },
                { value: "REGRESSION", label: "REGRESSION — Unintended Side Effect Detected" },
              ]}
              description="Official internal assessment result."
              required
            />
            <Select
              label="Verification Environment"
              value={environment}
              onChange={(val) => setEnvironment(val || "Production (v0.8.4)")}
              data={[
                { value: "Production (v0.8.4)", label: "Production (v0.8.4 Live)" },
                { value: "Staging (RC-2)", label: "Staging (Release Candidate)" },
                { value: "Hermetic Sandbox", label: "Local Hermetic Sandbox" },
              ]}
              description="Target runtime where fix was tested."
              required
            />
          </Group>

          <TextInput
            label="Attesting Security Engineer"
            value={testerName}
            onChange={(e) => setTesterName(e.currentTarget.value)}
            description="Active defender recording the cryptographic audit trail entry."
            required
          />

          <Textarea
            label="Verification Notes & Steps"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
            placeholder="Document the exact verification procedure..."
            description="Detail how the exploit payload was tested and verified neutral."
            required
          />

          <Box>
            <Text size="xs" fw={600} mb={4} style={{ color: "var(--text-secondary)" }}>
              Test Evidence / HTTP Response Log
            </Text>
            <Textarea
              rows={3}
              value={evidenceLog}
              onChange={(e) => setEvidenceLog(e.currentTarget.value)}
              styles={{
                input: {
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  backgroundColor: "var(--surface-subtle)",
                },
              }}
              description="Raw test evidence proving exploit mitigation (e.g. HTTP 403 Forbidden on illegal cross-tenant attempts)."
            />
          </Box>

          <Alert
            color="teal"
            variant="light"
            icon={<ShieldIcon size={14} />}
            title="Audit Chain Integrity"
          >
            <Text size="xs">
              Recording this attestation stamps an immutable event onto the tenant Merkle audit ledger with your Curve25519 defender key.
            </Text>
          </Alert>

          <Group justify="flex-end" gap="sm" mt="xs">
            <Button variant="default" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="teal"
              size="sm"
              loading={submitted}
              leftSection={<CheckIcon size={14} color="#FFF" />}
            >
              Confirm &amp; Record Attestation
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
