"use client";

import React from "react";
import {
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
import { ArrowRightIcon, BuildingIcon, CheckIcon, CrownIcon, ShieldIcon } from "../icons";
import { formatRole } from "../types";

export interface WorkspaceMembershipSummary {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: string;
  domain?: string | null;
  domainVerified?: boolean | null;
}

export interface WorkspacesDirectoryViewProps {
  memberships: WorkspaceMembershipSummary[];
  activeOrgId: string;
  onSelectWorkspace: (orgId: string) => void;
  onOpenCreateModal: () => void;
  userEmail?: string;
}

export function WorkspacesDirectoryView({
  memberships = [],
  activeOrgId,
  onSelectWorkspace,
  onOpenCreateModal,
  userEmail,
}: WorkspacesDirectoryViewProps) {
  const invitedWorkspaces = memberships.filter((m) => m.role !== "ORG_OWNER");
  const ownedWorkspaces = memberships.filter((m) => m.role === "ORG_OWNER");

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
              Workspaces &amp; Organization Directory
            </Text>
            <Text size="sm" c="dimmed">
              Isolated tenant perimeters where your cryptographic keys and defender clearances are active. Selecting an invited workspace switches directly into your assigned triage role without conflating permissions.
            </Text>
          </Box>
          <Button
            color="teal"
            style={{ backgroundColor: "var(--color-primary, #0B2E22)", color: "#FFFFFF" }}
            onClick={onOpenCreateModal}
            leftSection={<BuildingIcon size={14} />}
          >
            + Create New Workspace
          </Button>
        </Group>

        {/* Visual Architecture & Dependency Hierarchy Map */}
        <Card
          p="lg"
          radius="md"
          style={{
            backgroundColor: "var(--surface-subtle)",
            border: "1px solid var(--border-contrast)",
          }}
        >
          <Group justify="space-between" align="center" mb="sm">
            <Group gap="xs" align="center">
              <BuildingIcon size={16} color="var(--color-primary, #0B2E22)" />
              <Text size="xs" fw={700} style={{ textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-primary)" }}>
                Workspace Architecture &amp; Dependency Model
              </Text>
            </Group>
            <Badge size="xs" variant="light" color="teal">
              Strict Multi-Tenant Isolation
            </Badge>
          </Group>

          <Text size="xs" c="dimmed" mb="md" style={{ lineHeight: 1.6 }}>
            Every workspace in caulvyn operates as an isolated tenant boundary. Use the architecture map below to understand how workspaces, programs, defenders, and reports relate to each other:
          </Text>

          {/* 3-Tier Hierarchy Flow */}
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm">
            <Box
              p="sm"
              style={{
                borderRadius: 8,
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Group gap="xs" mb={4}>
                <Badge size="xs" color="teal">Level 1</Badge>
                <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>Tenant Workspace</Text>
              </Group>
              <Text size="11px" c="dimmed" style={{ lineHeight: 1.4 }}>
                The root perimeter (e.g. <strong>Taha</strong> or <strong>Acme Cyber</strong>). Governs tenant ownership, cryptographic master key, billing, and global defender access.
              </Text>
            </Box>

            <Box
              p="sm"
              style={{
                borderRadius: 8,
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Group gap="xs" mb={4}>
                <Badge size="xs" color="blue">Level 2</Badge>
                <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>In-House Programs</Text>
              </Group>
              <Text size="11px" c="dimmed" style={{ lineHeight: 1.4 }}>
                Created inside a workspace (e.g. <strong>portal-disclosure</strong> or <strong>taha</strong>). Defines safe-harbor terms, in-scope assets, and RFC 9116 security.txt policy.
              </Text>
            </Box>

            <Box
              p="sm"
              style={{
                borderRadius: 8,
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Group gap="xs" mb={4}>
                <Badge size="xs" color="orange">Level 3</Badge>
                <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>Reports &amp; Discussions</Text>
              </Group>
              <Text size="11px" c="dimmed" style={{ lineHeight: 1.4 }}>
                Vulnerability reports submitted to a program. Numbered with mnemonic initials (e.g. <strong>TH-01</strong>, <strong>PD-01</strong>) and assigned to designated defenders.
              </Text>
            </Box>
          </SimpleGrid>
        </Card>

        {/* SECTION 1: Workspaces Added To (Invited Team Member) */}
        <Box>
          <Group gap="xs" mb="xs" align="center">
            <ShieldIcon size={16} color="var(--color-primary, #0B2E22)" />
            <Text size="sm" fw={700} style={{ textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-primary)" }}>
              Workspaces You Have Been Added To ({invitedWorkspaces.length})
            </Text>
          </Group>
          <Text size="xs" c="dimmed" mb="md">
            Workspaces where external security leads or organization administrators have invited {userEmail || "you"} to triage and remediate vulnerabilities.
          </Text>

          {invitedWorkspaces.length === 0 ? (
            <Card
              p="xl"
              radius="md"
              style={{
                backgroundColor: "var(--surface-card)",
                border: "1px dashed var(--border-contrast)",
                textAlign: "center",
              }}
            >
              <Text size="sm" fw={600} style={{ color: "var(--text-primary)" }}>
                No external workspace invitations active yet
              </Text>
              <Text size="xs" c="dimmed" mt={4} style={{ maxWidth: 520, marginInline: "auto" }}>
                When another organization invites your email as a Lead Triager, Code Reviewer, or Program Defender, their workspace will appear here. Accepting an invitation automatically activates their dashboard under your intended role.
              </Text>
            </Card>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {invitedWorkspaces.map((m) => {
                const isActive = m.organizationId === activeOrgId;
                return (
                  <Card
                    key={m.organizationId}
                    p="md"
                    radius="md"
                    style={{
                      backgroundColor: "var(--surface-card)",
                      border: isActive ? "2px solid #0B2E22" : "1px solid var(--border-contrast)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Group justify="space-between" align="flex-start" mb="xs">
                        <Box style={{ minWidth: 0, flex: 1 }}>
                          <Text size="sm" fw={700} truncate style={{ color: "var(--text-primary)" }}>
                            {m.organizationName}
                          </Text>
                          <Text size="xs" ff="monospace" c="dimmed" truncate>
                            slug: {m.organizationSlug}
                          </Text>
                        </Box>
                        <Badge size="xs" variant="light" color="blue">
                          {formatRole(m.role)}
                        </Badge>
                      </Group>

                      <Divider my="xs" style={{ borderColor: "var(--border-subtle)" }} />

                      <Stack gap={4}>
                        <Group justify="space-between">
                          <Text size="11px" c="dimmed">Tenant Role:</Text>
                          <Text size="xs" fw={600}>{formatRole(m.role)}</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="11px" c="dimmed">Perimeter Access:</Text>
                          <Badge size="xs" variant="outline" color="teal">Curve25519 Active</Badge>
                        </Group>
                        <Group justify="space-between">
                          <Text size="11px" c="dimmed">Scope:</Text>
                          <Text size="11px" c="dimmed" truncate>Security Triage &amp; Remediation</Text>
                        </Group>
                      </Stack>
                    </Box>

                    <Box mt="md" pt="xs" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                      {isActive ? (
                        <Button
                          fullWidth
                          size="xs"
                          variant="filled"
                          color="teal"
                          leftSection={<CheckIcon size={13} />}
                          disabled
                          style={{ backgroundColor: "#0B2E22", color: "#FFFFFF" }}
                        >
                          Currently Active Workspace
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          size="xs"
                          variant="light"
                          color="teal"
                          onClick={() => onSelectWorkspace(m.organizationId)}
                        >
                          Open Workspace as {formatRole(m.role)}
                        </Button>
                      )}
                    </Box>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </Box>

        {/* SECTION 2: My Organizations (Owner & Administrator) */}
        <Box mt="lg">
          <Group gap="xs" mb="xs" align="center">
            <CrownIcon size={16} color="var(--color-primary, #0B2E22)" />
            <Text size="sm" fw={700} style={{ textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-primary)" }}>
              My Organizations — Workspace Owner ({ownedWorkspaces.length})
            </Text>
          </Group>
          <Text size="xs" c="dimmed" mb="md">
            Workspaces where you possess full administrative governance, member invitation authority, and cryptographic policy management.
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {ownedWorkspaces.map((m) => {
              const isActive = m.organizationId === activeOrgId;
              return (
                <Card
                  key={m.organizationId}
                  p="md"
                  radius="md"
                  style={{
                    backgroundColor: "var(--surface-card)",
                    border: isActive ? "2px solid #0B2E22" : "1px solid var(--border-contrast)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Group justify="space-between" align="flex-start" mb="xs">
                      <Box style={{ minWidth: 0, flex: 1 }}>
                        <Text size="sm" fw={700} truncate style={{ color: "var(--text-primary)" }}>
                          {m.organizationName}
                        </Text>
                        <Text size="xs" ff="monospace" c="dimmed" truncate>
                          slug: {m.organizationSlug}
                        </Text>
                      </Box>
                      <Badge size="xs" variant="light" color="teal">
                        Organization Owner
                      </Badge>
                    </Group>

                    <Divider my="xs" style={{ borderColor: "var(--border-subtle)" }} />

                    <Stack gap={4}>
                      <Group justify="space-between">
                        <Text size="11px" c="dimmed">Domain Perimeter:</Text>
                        <Text size="xs" fw={600} truncate>{m.domain || `${m.organizationSlug}.caulvyn.com`}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="11px" c="dimmed">Administrative Role:</Text>
                        <Text size="xs" fw={600}>Permanent Administrator</Text>
                      </Group>
                    </Stack>
                  </Box>

                  <Box mt="md" pt="xs" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                    <Stack gap="xs">
                      {isActive ? (
                        <Button
                          fullWidth
                          size="xs"
                          variant="filled"
                          color="teal"
                          leftSection={<CheckIcon size={13} />}
                          disabled
                          style={{ backgroundColor: "#0B2E22", color: "#FFFFFF" }}
                        >
                          Currently Active Workspace
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          size="xs"
                          variant="default"
                          onClick={() => onSelectWorkspace(m.organizationId)}
                        >
                          Switch to Owner Dashboard
                        </Button>
                      )}
                      <Button
                        component="a"
                        href={`/onboarding?slug=${encodeURIComponent(m.organizationSlug)}`}
                        fullWidth
                        size="xs"
                        variant="subtle"
                        color="teal"
                        rightSection={<ArrowRightIcon size={12} />}
                      >
                        Launch Setup &amp; Onboarding Wizard
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              );
            })}
          </SimpleGrid>
        </Box>
      </Stack>
    </Box>
  );
}
