"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Container, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { ArrowRightIcon, ShieldIcon } from "@/components/workspace/icons";

interface CvssPreset {
  id: string;
  label: string;
  title: string;
  score: string;
  severity: "Critical" | "High" | "Medium";
  sla: string;
  vector: string;
  impactNote: string;
  accentColor: string;
}

const PRESETS: CvssPreset[] = [
  {
    id: "rce",
    label: "Critical RCE",
    title: "Unauthenticated Remote Code Execution",
    score: "9.8",
    severity: "Critical",
    sla: "24 Hours Remediation SLA",
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    impactNote: "Network-exploitable, zero privileges, complete confidentiality & integrity compromise.",
    accentColor: "#B91C1C",
  },
  {
    id: "auth",
    label: "High Auth Bypass",
    title: "Cross-Tenant Workspace Boundary Bypass",
    score: "8.6",
    severity: "High",
    sla: "7 Days Remediation SLA",
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N",
    impactNote: "Scope changed across tenant boundaries exposing protected organization records.",
    accentColor: "#C2410C",
  },
  {
    id: "idor",
    label: "Medium IDOR",
    title: "Scoped Metadata Enumeration",
    score: "6.5",
    severity: "Medium",
    sla: "30 Days Remediation SLA",
    vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N",
    impactNote: "Authenticated low-privilege actor can read restricted disclosure metadata.",
    accentColor: "#0B2E22",
  },
];

export function CvssShowcaseSection() {
  const [selectedId, setSelectedId] = useState<string>("rce");
  const active = PRESETS.find((p) => p.id === selectedId) || PRESETS[0];

  return (
    <Box
      component="section"
      id="cvss-showcase"
      style={{
        width: "100%",
        padding: "clamp(3rem, 5vw, 4.5rem) 0",
        backgroundColor: "var(--canvas-bg)",
      }}
    >
      <Container size="1600px" px={{ base: "md", md: "xl" }} style={{ maxWidth: "1600px" }}>
        <Grid gap={{ base: "xl", lg: 48 }} align="center">
          {/* Left Column: Promotional & Feature Value */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Stack gap="md">
              <Text
                size="xs"
                fw={700}
                style={{
                  color: "var(--heading-accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Deterministic Severity &amp; SLA Engine
              </Text>

              <Title
                order={2}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h2)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  lineHeight: 1.15,
                  margin: 0,
                }}
              >
                FIRST.org CVSS 3.1 scoring built into every report.
              </Title>

              <Text
                style={{
                  fontSize: "var(--type-lead)",
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                  maxWidth: "56ch",
                  margin: 0,
                }}
              >
                Eliminate severity disputes between researchers and triage engineers. Caulvyn computes standardized CVSS 3.1 Base Scores and automatically binds every finding to an enforceable remediation SLA clock.
              </Text>

              <Grid gap="sm" mt="xs">
                {[
                  { tier: "Critical (9.0 – 10.0)", sla: "24h SLA" },
                  { tier: "High (7.0 – 8.9)", sla: "7 Days SLA" },
                  { tier: "Medium (4.0 – 6.9)", sla: "30 Days SLA" },
                  { tier: "Low (0.1 – 3.9)", sla: "90 Days SLA" },
                ].map((item) => (
                  <Grid.Col key={item.tier} span={{ base: 12, xs: 6 }}>
                    <Box
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        backgroundColor: "var(--surface-card)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text size="sm" fw={600} style={{ color: "var(--text-primary)" }}>
                        {item.tier}
                      </Text>
                      <Text size="xs" fw={700} ff="monospace" style={{ color: "var(--heading-accent)" }}>
                        {item.sla}
                      </Text>
                    </Box>
                  </Grid.Col>
                ))}
              </Grid>

              <Group gap="md" mt="sm" wrap="wrap">
                <Link
                  href="/cvss"
                  className="btn-smooth btn-primary"
                  style={{
                    borderRadius: "8px",
                    padding: "12px 22px",
                    height: "46px",
                    fontSize: "0.95rem",
                    gap: "8px",
                  }}
                >
                  <span>Open Full CVSS 3.1 Calculator</span>
                  <ArrowRightIcon size={15} color="#FFFFFF" />
                </Link>

                <Link
                  href="/programs"
                  className="btn-smooth btn-secondary"
                  style={{
                    borderRadius: "8px",
                    padding: "12px 20px",
                    height: "46px",
                    fontSize: "0.95rem",
                  }}
                >
                  Test in Public Intake
                </Link>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Right Column: Interactive Live CVSS 3.1 Preview Card */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Paper
              p={{ base: "lg", md: "xl" }}
              radius="lg"
              style={{
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-contrast)",
                boxShadow: "0 12px 32px -8px rgba(11, 46, 34, 0.08)",
              }}
            >
              <Stack gap="lg">
                <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                  <Group gap="xs">
                    <ShieldIcon size={18} color="var(--heading-accent)" />
                    <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                      Interactive CVSS 3.1 Vector Preview
                    </Text>
                  </Group>
                  <Text size="xs" ff="monospace" style={{ color: "var(--text-muted)" }}>
                    FR-3.2 · FIRST.org Spec
                  </Text>
                </Group>

                {/* Preset Switcher Tabs (padding: 8px 12px, fontSize: 12px) */}
                <Group gap="xs" wrap="wrap">
                  {PRESETS.map((preset) => {
                    const isSelected = preset.id === active.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedId(preset.id)}
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: isSelected
                            ? "1px solid var(--color-primary, #0B2E22)"
                            : "1px solid var(--border-contrast)",
                          backgroundColor: isSelected
                            ? "var(--color-primary, #0B2E22)"
                            : "var(--surface-subtle)",
                          color: isSelected ? "#FFFFFF" : "var(--text-primary)",
                          cursor: "pointer",
                          transition: "all 150ms ease",
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </Group>

                {/* Live Score Display */}
                <Box
                  p="lg"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "var(--canvas-bg)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <Group justify="space-between" align="center" wrap="wrap" gap="md">
                    <Box style={{ flex: 1, minWidth: 200 }}>
                      <Text size="xs" fw={700} tt="uppercase" style={{ color: active.accentColor, letterSpacing: "0.06em" }}>
                        {active.severity} Severity · {active.sla}
                      </Text>
                      <Text size="lg" fw={700} mt={4} style={{ color: "var(--text-primary)" }}>
                        {active.title}
                      </Text>
                      <Text size="sm" mt={6} style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                        {active.impactNote}
                      </Text>
                    </Box>

                    <Box
                      style={{
                        minWidth: 96,
                        padding: "14px 18px",
                        borderRadius: "10px",
                        backgroundColor: "#0B2E22",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        textAlign: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "2rem",
                          fontWeight: 800,
                          lineHeight: 1,
                          fontFamily: "var(--font-display)",
                          color: "#FFFFFF",
                        }}
                      >
                        {active.score}
                      </Text>
                      <Text size="xs" mt={4} style={{ color: "rgba(255, 255, 255, 0.85)", fontWeight: 600 }}>
                        / 10.0
                      </Text>
                    </Box>
                  </Group>

                  <Box
                    mt="md"
                    pt="sm"
                    style={{
                      borderTop: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <Text size="xs" ff="monospace" style={{ color: "var(--text-secondary)", wordBreak: "break-all" }}>
                      {active.vector}
                    </Text>
                    <Link
                      href="/cvss"
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--heading-accent)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>Customize all 8 metrics</span>
                      <ArrowRightIcon size={12} />
                    </Link>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
