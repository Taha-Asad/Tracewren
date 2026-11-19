import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { Membership, ProgramItem, ReportItem, TriageMemberItem, formatRole } from "../types";
import { ShieldIcon, KeyIcon, LockIcon, ArrowRightIcon } from "../icons";

interface GovernanceOverviewViewProps {
  activeOrg?: Membership;
  programsList: ProgramItem[];
  reportsList?: ReportItem[];
  triageMembers?: TriageMemberItem[];
  setCreateProgOpen: (open: boolean) => void;
  setInviteMemberOpen: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setViewMode: (mode: any) => void;
  onSelectProgramReports?: (programSlug: string) => void;
}

export const GovernanceOverviewView: React.FC<GovernanceOverviewViewProps> = ({
  activeOrg,
  programsList,
  reportsList = [],
  triageMembers = [],
  setCreateProgOpen,
  setInviteMemberOpen,
  setViewMode,
  onSelectProgramReports,
}) => {
  const totalDefenders = triageMembers?.length || programsList.reduce((acc, p) => acc + (p.defendersCount || 0), 0) || 1;
  const totalReportsCount = reportsList && reportsList.length > 0
    ? reportsList.length
    : programsList.reduce((acc, p) => acc + (p.activeReportsCount || 0), 0);

  const getScopeCount = (slug: string, activeCount?: number) => {
    const fromList = reportsList?.filter((r) => r.programSlug === slug).length || 0;
    return Math.max(fromList, activeCount || 0);
  };
  return (
    <Box px={{ base: "md", md: 32 }} py={{ base: "md", md: 28 }}>
      <Stack gap="xl">
        {/* Executive Header */}
        <Box>
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
            <Box>
              <Group gap="xs" align="center" mb={4}>
                <Text
                  component="h1"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  {activeOrg?.organizationName || "Northstar Labs"}
                </Text>
                <Badge variant="light" color="teal" size="md">
                  {formatRole(activeOrg?.role)}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed" style={{ maxWidth: 680 }}>
                Managing in-house disclosure programs, vulnerability reports, designated triage members, and dual-lane encrypted discussions.
              </Text>
            </Box>

            <Group gap="xs">
              <Button
                component="a"
                href={`/onboarding${activeOrg?.organizationSlug ? `?slug=${encodeURIComponent(activeOrg.organizationSlug)}` : ""}`}
                variant="outline"
                size="sm"
                color="teal"
              >
                Setup Wizard (7 Steps)
              </Button>
              <Button
                variant="outline"
                size="sm"
                color="gray"
                onClick={() => setCreateProgOpen(true)}
              >
                + New Program Scope
              </Button>
              <Button
                variant="outline"
                size="sm"
                color="gray"
                onClick={() => setInviteMemberOpen(true)}
              >
                + Invite Triage Member
              </Button>
              <Button
                color="teal"
                size="sm"
                style={{ backgroundColor: "var(--color-primary, #0B2E22)", color: "#FFFFFF" }}
                onClick={() => setViewMode("reports")}
                rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
              >
                View Reports Queue ({totalReportsCount})
              </Button>
            </Group>
          </Group>
        </Box>

        {/* Perimeter Health & Cryptographic Governance Grid */}
        <Box>
          <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            PERIMETER & CRYPTOGRAPHIC HEALTH
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            <Card p="md" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
              <Group justify="space-between" align="flex-start" mb={8}>
                <Box style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(11,46,34,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--heading-accent)" }}>
                  <ShieldIcon size={18} />
                </Box>
                <Badge size="xs" color="teal" variant="light">RFC 9116 Active</Badge>
              </Group>
              <Text size="xs" c="dimmed">Security.txt Policy</Text>
              <Text size="lg" fw={800} style={{ color: "var(--text-primary)" }}>Valid & Hosted</Text>
              <Text size="11px" c="dimmed" mt={4}>Published on /.well-known/</Text>
            </Card>

            <Card p="md" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
              <Group justify="space-between" align="flex-start" mb={8}>
                <Box style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(11,46,34,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--heading-accent)" }}>
                  <KeyIcon size={18} />
                </Box>
                <Badge size="xs" color="teal" variant="light">Curve25519</Badge>
              </Group>
              <Text size="xs" c="dimmed">Active Defenders</Text>
              <Text size="lg" fw={800} style={{ color: "var(--text-primary)" }}>{totalDefenders} Keys Registered</Text>
              <Text size="11px" c="dimmed" mt={4}>Dual-lane encryption ready</Text>
            </Card>

            <Card p="md" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
              <Group justify="space-between" align="flex-start" mb={8}>
                <Box style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(11,46,34,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--heading-accent)" }}>
                  <LockIcon size={18} />
                </Box>
                <Badge size="xs" color="blue" variant="light">FR-8.4</Badge>
              </Group>
              <Text size="xs" c="dimmed">Tenant DB Quota</Text>
              <Text size="lg" fw={800} style={{ color: "var(--text-primary)" }}>1.42 / 20.0 MiB</Text>
              <Text size="11px" c="teal" mt={4}>7.1% Used · 93% Headroom</Text>
            </Card>

            <Card p="md" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
              <Group justify="space-between" align="flex-start" mb={8}>
                <Box style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(11,46,34,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--heading-accent)" }}>
                  <ShieldIcon size={18} />
                </Box>
                <Badge size="xs" color="teal" variant="filled">Unlocked</Badge>
              </Group>
              <Text size="xs" c="dimmed">Client-Side Vault</Text>
              <Text size="lg" fw={800} style={{ color: "var(--text-primary)" }}>Active Session</Text>
              <Text size="11px" c="dimmed" mt={4}>Local WebCrypto unlocked</Text>
            </Card>
          </SimpleGrid>
        </Box>

        {/* In-House Programs Grid */}
        <Box>
          <Group justify="space-between" align="center" mb="sm">
            <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>
              ACTIVE IN-HOUSE DISCLOSURE PROGRAMS ({programsList.length})
            </Text>
            <Button
              variant="subtle"
              size="xs"
              color="teal"
              onClick={() => setViewMode("programs")}
              rightSection={<ArrowRightIcon size={12} />}
            >
              Manage all programs
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            {programsList.map((p) => (
              <Card key={p.id} p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Box
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (onSelectProgramReports) {
                        onSelectProgramReports(p.slug);
                      } else {
                        setViewMode("reports");
                      }
                    }}
                  >
                    <Text fw={700} size="sm" style={{ color: "var(--text-primary)" }}>{p.name}</Text>
                    <Text size="11px" ff="monospace" c="dimmed">scope: {p.slug}</Text>
                  </Box>
                  <Badge size="xs" variant={p.visibility === "PUBLIC" ? "light" : "outline"} color={p.visibility === "PUBLIC" ? "teal" : "gray"}>
                    {p.visibility}
                  </Badge>
                </Group>

                <Text size="xs" c="dimmed" mb="sm" lineClamp={2}>
                  {p.safeHarborPolicy}
                </Text>

                <Box mb="md">
                  <Text size="10px" fw={700} c="dimmed" style={{ textTransform: "uppercase", marginBottom: 4 }}>In-Scope Targets:</Text>
                  <Group gap={4}>
                    {p.inScope.slice(0, 3).map((target) => (
                      <Badge
                        key={target}
                        size="xs"
                        variant="outline"
                        color="gray"
                        style={{ textTransform: "none", fontSize: "10px", cursor: "pointer" }}
                        onClick={() => {
                          if (onSelectProgramReports) {
                            onSelectProgramReports(p.slug);
                          }
                        }}
                      >
                        {target}
                      </Badge>
                    ))}
                    {p.inScope.length > 3 && (
                      <Badge size="xs" variant="outline" color="gray" style={{ textTransform: "none", fontSize: "10px" }}>
                        +{p.inScope.length - 3} more
                      </Badge>
                    )}
                  </Group>
                </Box>

                <Group justify="space-between" align="center" pt="xs" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <Group gap="md">
                    <Text
                      size="11px"
                      c="dimmed"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (onSelectProgramReports) {
                          onSelectProgramReports(p.slug);
                        }
                      }}
                    >
                      Scope Reports: <strong style={{ color: "var(--text-primary)" }}>{getScopeCount(p.slug, p.activeReportsCount)}</strong>
                    </Text>
                    <Text size="11px" c="dimmed">Defenders: <strong style={{ color: "var(--text-primary)" }}>{p.defendersCount}</strong></Text>
                  </Group>
                  <Button
                    size="compact-xs"
                    variant="light"
                    color="teal"
                    onClick={() => {
                      if (onSelectProgramReports) {
                        onSelectProgramReports(p.slug);
                      } else {
                        setViewMode("reports");
                      }
                    }}
                    rightSection={<ArrowRightIcon size={12} />}
                  >
                    View Scope Reports ({getScopeCount(p.slug, p.activeReportsCount)})
                  </Button>
                </Group>
              </Card>
            ))}

            <Card
              p="lg"
              radius="md"
              style={{
                backgroundColor: "var(--surface-subtle)",
                border: "1px dashed var(--border-contrast)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                minHeight: 180,
              }}
              onClick={() => setCreateProgOpen(true)}
            >
              <Box style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "var(--surface-card)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <Text size="lg" fw={600} style={{ color: "var(--heading-accent)" }}>+</Text>
              </Box>
              <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>Create New Disclosure Scope</Text>
              <Text size="xs" c="dimmed" mt={2} ta="center" maw={260}>
                Publish a dedicated RFC 9116 scope with independent safe harbor and triage assignment.
              </Text>
            </Card>
          </SimpleGrid>
        </Box>
      </Stack>
    </Box>
  );
};
