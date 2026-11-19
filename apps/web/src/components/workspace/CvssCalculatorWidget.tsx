"use client";

import React, { useState, useMemo } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { ShieldIcon, CheckIcon } from "./icons";

export type AttackVector = "N" | "A" | "L" | "P";
export type AttackComplexity = "L" | "H";
export type PrivilegesRequired = "N" | "L" | "H";
export type UserInteraction = "N" | "R";
export type Scope = "U" | "C";
export type ImpactMetric = "N" | "L" | "H";

export const CvssCalculatorWidget: React.FC = () => {
  const [av, setAv] = useState<AttackVector>("N");
  const [ac, setAc] = useState<AttackComplexity>("L");
  const [pr, setPr] = useState<PrivilegesRequired>("N");
  const [ui, setUi] = useState<UserInteraction>("N");
  const [scope, setScope] = useState<Scope>("U");
  const [c, setC] = useState<ImpactMetric>("H");
  const [i, setI] = useState<ImpactMetric>("H");
  const [a, setA] = useState<ImpactMetric>("H");

  const [copied, setCopied] = useState(false);

  // Formulate CVSS 3.1 Vector String
  const vectorString = useMemo(() => {
    return `CVSS:3.1/AV:${av}/AC:${ac}/PR:${pr}/UI:${ui}/S:${scope}/C:${c}/I:${i}/A:${a}`;
  }, [av, ac, pr, ui, scope, c, i, a]);

  // Client-side instant calculation based on FIRST.org specifications
  const calculation = useMemo(() => {
    const avW = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 }[av];
    const acW = { L: 0.77, H: 0.44 }[ac];
    const prW = scope === "C" ? { N: 0.85, L: 0.68, H: 0.5 }[pr] : { N: 0.85, L: 0.62, H: 0.27 }[pr];
    const uiW = { N: 0.85, R: 0.62 }[ui];
    const impW = { N: 0.0, L: 0.22, H: 0.56 };

    const iss = 1.0 - (1.0 - impW[c]) * (1.0 - impW[i]) * (1.0 - impW[a]);
    if (iss <= 0) {
      return { score: 0.0, severity: "NONE", bounty: "$0", sla: "30 Days" };
    }

    const impact = scope === "C"
      ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15)
      : 6.42 * iss;

    const exploitability = 8.22 * avW * acW * prW * uiW;

    const raw = scope === "C"
      ? Math.min(1.08 * (impact + exploitability), 10.0)
      : Math.min(impact + exploitability, 10.0);

    const rounded9 = Math.round(raw * 1000000000) / 1000000000;
    const score = Math.round(Math.ceil(rounded9 * 10) * 10) / 100;

    let severity = "NONE";
    let bounty = "$0";
    let sla = "30 Days";

    if (score >= 9.0) {
      severity = "CRITICAL";
      bounty = "$7,500 – $10,000";
      sla = "24 Hours";
    } else if (score >= 7.0) {
      severity = "HIGH";
      bounty = "$3,500 – $7,500";
      sla = "72 Hours";
    } else if (score >= 4.0) {
      severity = "MEDIUM";
      bounty = "$1,000 – $3,500";
      sla = "14 Days";
    } else if (score > 0.0) {
      severity = "LOW";
      bounty = "$200 – $1,000";
      sla = "30 Days";
    }

    return { score, severity, bounty, sla };
  }, [av, ac, pr, ui, scope, c, i, a]);

  const handleCopy = () => {
    navigator.clipboard.writeText(vectorString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "#B91C1C"; // Red-700
      case "HIGH":
        return "#D97706"; // Amber-600
      case "MEDIUM":
        return "#2563EB"; // Blue-600
      case "LOW":
        return "#0D9488"; // Teal-600
      default:
        return "#64748B"; // Slate-500
    }
  };

  return (
    <Paper
      p={{ base: "md", sm: "xl" }}
      radius="md"
      style={{
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-contrast)",
      }}
    >
      <Stack gap="xl">
        {/* Header Bar with Live Metric Readout */}
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Box style={{ flex: 1, minWidth: 260 }}>
            <Group gap="xs" align="center" mb={4}>
              <Box
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "rgba(11,46,34,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--heading-accent)",
                }}
              >
                <ShieldIcon size={18} />
              </Box>
              <Text
                component="h2"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                CVSS v3.1 Scoring &amp; Bounty Award Engine
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              FIRST.org deterministic calculation engine with automated SLA timeline mapping and tiered bounty projections.
            </Text>
          </Box>

          {/* Live Score Display - Mantine Paper, Zero Chips */}
          <Paper
            px="md"
            py="xs"
            radius="sm"
            style={{
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-subtle)",
              borderLeft: `4px solid ${getSeverityColor(calculation.severity)}`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Box style={{ textAlign: "right" }}>
              <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Base Score
              </Text>
              <Text
                size="26px"
                fw={900}
                style={{
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1.1,
                  color: "var(--text-primary)",
                }}
              >
                {calculation.score.toFixed(1)}
              </Text>
            </Box>

            <Divider orientation="vertical" style={{ borderColor: "var(--border-subtle)" }} />

            <Box>
              <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Severity
              </Text>
              <Text
                size="sm"
                fw={800}
                style={{
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: getSeverityColor(calculation.severity),
                }}
              >
                {calculation.severity}
              </Text>
            </Box>
          </Paper>
        </Group>

        {/* Vector String Display Bar */}
        <Paper
          px="md"
          py="xs"
          radius="sm"
          style={{
            backgroundColor: "var(--surface-subtle)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            overflowX: "auto",
          }}
        >
          <Text
            size="xs"
            fw={600}
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
            }}
          >
            {vectorString}
          </Text>

          <Button
            size="xs"
            variant="default"
            onClick={handleCopy}
            leftSection={copied ? <CheckIcon size={12} color="#0D9488" /> : undefined}
            style={{ flexShrink: 0 }}
          >
            {copied ? "Copied" : "Copy Vector"}
          </Button>
        </Paper>

        {/* Metric Selectors Grid (2 Columns on Desktop) */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {/* Metric 1: Attack Vector */}
          <Box>
            <Text size="11px" fw={700} c="dimmed" mb={6} style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Attack Vector (AV)
            </Text>
            <Group gap={6} grow>
              {[
                { label: "Network (N)", val: "N" as AttackVector },
                { label: "Adjacent (A)", val: "A" as AttackVector },
                { label: "Local (L)", val: "L" as AttackVector },
                { label: "Physical (P)", val: "P" as AttackVector },
              ].map((opt) => (
                <Button
                  key={opt.val}
                  size="xs"
                  variant={av === opt.val ? "filled" : "default"}
                  color={av === opt.val ? "teal" : undefined}
                  onClick={() => setAv(opt.val)}
                  style={{
                    fontWeight: av === opt.val ? 700 : 500,
                    fontSize: "12px",
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </Group>
          </Box>

          {/* Metric 2: Attack Complexity */}
          <Box>
            <Text size="11px" fw={700} c="dimmed" mb={6} style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Attack Complexity (AC)
            </Text>
            <Group gap={6} grow>
              {[
                { label: "Low (L)", val: "L" as AttackComplexity },
                { label: "High (H)", val: "H" as AttackComplexity },
              ].map((opt) => (
                <Button
                  key={opt.val}
                  size="xs"
                  variant={ac === opt.val ? "filled" : "default"}
                  color={ac === opt.val ? "teal" : undefined}
                  onClick={() => setAc(opt.val)}
                  style={{
                    fontWeight: ac === opt.val ? 700 : 500,
                    fontSize: "12px",
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </Group>
          </Box>

          {/* Metric 3: Privileges Required */}
          <Box>
            <Text size="11px" fw={700} c="dimmed" mb={6} style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Privileges Required (PR)
            </Text>
            <Group gap={6} grow>
              {[
                { label: "None (N)", val: "N" as PrivilegesRequired },
                { label: "Low (L)", val: "L" as PrivilegesRequired },
                { label: "High (H)", val: "H" as PrivilegesRequired },
              ].map((opt) => (
                <Button
                  key={opt.val}
                  size="xs"
                  variant={pr === opt.val ? "filled" : "default"}
                  color={pr === opt.val ? "teal" : undefined}
                  onClick={() => setPr(opt.val)}
                  style={{
                    fontWeight: pr === opt.val ? 700 : 500,
                    fontSize: "12px",
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </Group>
          </Box>

          {/* Metric 4: User Interaction */}
          <Box>
            <Text size="11px" fw={700} c="dimmed" mb={6} style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              User Interaction (UI)
            </Text>
            <Group gap={6} grow>
              {[
                { label: "None (N)", val: "N" as UserInteraction },
                { label: "Required (R)", val: "R" as UserInteraction },
              ].map((opt) => (
                <Button
                  key={opt.val}
                  size="xs"
                  variant={ui === opt.val ? "filled" : "default"}
                  color={ui === opt.val ? "teal" : undefined}
                  onClick={() => setUi(opt.val)}
                  style={{
                    fontWeight: ui === opt.val ? 700 : 500,
                    fontSize: "12px",
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </Group>
          </Box>

          {/* Metric 5: Scope */}
          <Box>
            <Text size="11px" fw={700} c="dimmed" mb={6} style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Scope (S)
            </Text>
            <Group gap={6} grow>
              {[
                { label: "Unchanged (U)", val: "U" as Scope },
                { label: "Changed (C)", val: "C" as Scope },
              ].map((opt) => (
                <Button
                  key={opt.val}
                  size="xs"
                  variant={scope === opt.val ? "filled" : "default"}
                  color={scope === opt.val ? "teal" : undefined}
                  onClick={() => setScope(opt.val)}
                  style={{
                    fontWeight: scope === opt.val ? 700 : 500,
                    fontSize: "12px",
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </Group>
          </Box>

          {/* Metric 6: Impact Trio (CIA) */}
          <Box>
            <Text size="11px" fw={700} c="dimmed" mb={6} style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Confidentiality / Integrity / Availability (CIA)
            </Text>
            <SimpleGrid cols={3} spacing={6}>
              {/* Conf */}
              <Box>
                <Text size="10px" fw={600} c="dimmed" ta="center" mb={2}>CONF</Text>
                <Group gap={2} grow>
                  {(["N", "L", "H"] as ImpactMetric[]).map((val) => (
                    <Button
                      key={val}
                      size="compact-xs"
                      variant={c === val ? "filled" : "default"}
                      color={c === val ? "teal" : undefined}
                      onClick={() => setC(val)}
                      style={{ padding: "0 4px", fontSize: "11px", fontWeight: c === val ? 700 : 400 }}
                    >
                      {val}
                    </Button>
                  ))}
                </Group>
              </Box>

              {/* Integ */}
              <Box>
                <Text size="10px" fw={600} c="dimmed" ta="center" mb={2}>INTEG</Text>
                <Group gap={2} grow>
                  {(["N", "L", "H"] as ImpactMetric[]).map((val) => (
                    <Button
                      key={val}
                      size="compact-xs"
                      variant={i === val ? "filled" : "default"}
                      color={i === val ? "teal" : undefined}
                      onClick={() => setI(val)}
                      style={{ padding: "0 4px", fontSize: "11px", fontWeight: i === val ? 700 : 400 }}
                    >
                      {val}
                    </Button>
                  ))}
                </Group>
              </Box>

              {/* Avail */}
              <Box>
                <Text size="10px" fw={600} c="dimmed" ta="center" mb={2}>AVAIL</Text>
                <Group gap={2} grow>
                  {(["N", "L", "H"] as ImpactMetric[]).map((val) => (
                    <Button
                      key={val}
                      size="compact-xs"
                      variant={a === val ? "filled" : "default"}
                      color={a === val ? "teal" : undefined}
                      onClick={() => setA(val)}
                      style={{ padding: "0 4px", fontSize: "11px", fontWeight: a === val ? 700 : 400 }}
                    >
                      {val}
                    </Button>
                  ))}
                </Group>
              </Box>
            </SimpleGrid>
          </Box>
        </SimpleGrid>

        {/* Dynamic SLA & Bounty Impact Cards (Zero Chips, Mantine Cards) */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Paper
            p="md"
            radius="sm"
            style={{
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-subtle)",
              borderLeft: "3px solid #0D9488",
            }}
          >
            <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Suggested Bounty Award Bracket
            </Text>
            <Text
              size="lg"
              fw={800}
              mt={2}
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {calculation.bounty}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Calculated based on program severity multipliers and organizational allocation policy.
            </Text>
          </Paper>

          <Paper
            p="md"
            radius="sm"
            style={{
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-subtle)",
              borderLeft: "3px solid #2563EB",
            }}
          >
            <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Target SLA Resolution Countdown
            </Text>
            <Text
              size="lg"
              fw={800}
              mt={2}
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {calculation.sla}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Enforced by automated compliance countdown timers aligned with SOC 2 &amp; ISO 27001 remediation windows.
            </Text>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
};
