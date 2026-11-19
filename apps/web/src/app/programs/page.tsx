"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRightIcon, ShieldIcon } from "@/components/workspace/icons";

interface PublicProgram {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  visibility: string;
  policyMarkdown?: string;
  activeReportsCount: number;
  defendersCount: number;
  organization?: {
    id: string;
    name: string;
    slug: string;
    domain?: string | null;
    domainVerified?: boolean;
  };
}

export default function PublicProgramsPage() {
  const [programs, setPrograms] = useState<PublicProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/v1/public/programs")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPrograms(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.organization?.name || "").toLowerCase().includes(q)
    );
  });

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--canvas-bg)",
      }}
    >
      <Navbar />

      <Box component="main" style={{ flex: 1, padding: "clamp(2rem, 4vw, 3.5rem) 0" }}>
        <Container size="1600px" px={{ base: "md", md: "xl" }} style={{ maxWidth: "1600px" }}>
          <Stack gap="xl">
            <Box>
              <Text
                size="xs"
                fw={700}
                style={{
                  color: "var(--heading-accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Public Vulnerability Disclosure Directory
              </Text>
              <Title
                order={1}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h2)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  lineHeight: 1.15,
                }}
              >
                Active Public Security Programs
              </Title>
              <Text
                mt="xs"
                style={{
                  fontSize: "var(--type-lead)",
                  color: "var(--text-secondary)",
                  maxWidth: "62ch",
                  lineHeight: 1.6,
                }}
              >
                Browse authorized public disclosure scopes and submit encrypted vulnerability findings as a guest researcher without creating an account.
              </Text>
            </Box>

            <Group justify="space-between" align="center" wrap="wrap" gap="md">
              <TextInput
                placeholder="Filter programs by name, organization, or slug..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                style={{ minWidth: 280, maxWidth: 420, flex: 1 }}
              />
              <Button
                component={Link}
                href="/cvss"
                variant="outline"
                size="sm"
                style={{
                  borderColor: "var(--border-contrast)",
                  color: "var(--text-primary)",
                }}
              >
                Open CVSS 3.1 Calculator
              </Button>
            </Group>

            {loading ? (
              <Box py="xl" style={{ display: "flex", justifyContent: "center" }}>
                <Loader color="dark" size="md" />
              </Box>
            ) : filtered.length === 0 ? (
              <Card
                p="xl"
                radius="md"
                style={{
                  backgroundColor: "var(--surface-card)",
                  border: "1px dashed var(--border-contrast)",
                }}
              >
                <Text fw={700} size="md" style={{ color: "var(--text-primary)" }}>
                  No matching public programs found
                </Text>
                <Text size="sm" c="dimmed" mt={4}>
                  Public programs published by tenant organizations will appear here automatically.
                </Text>
              </Card>
            ) : (
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
                {filtered.map((prog) => (
                  <Card
                    key={prog.id}
                    p="lg"
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
                        <Group gap={8} align="center">
                          <ShieldIcon size={18} color="var(--heading-accent)" />
                          <Text fw={700} size="md" style={{ color: "var(--text-primary)" }}>
                            {prog.name}
                          </Text>
                        </Group>
                        <Badge
                          variant="light"
                          styles={{
                            root: {
                              backgroundColor: "var(--surface-banner)",
                              color: "var(--surface-banner-text)",
                              fontSize: "12px",
                              padding: "8px 12px",
                              height: "auto",
                              lineHeight: 1.2,
                              borderRadius: "6px",
                              textTransform: "uppercase",
                              fontWeight: 700,
                            },
                          }}
                        >
                          PUBLIC
                        </Badge>
                      </Group>

                      <Text size="xs" ff="monospace" c="dimmed" mb="sm">
                        org: {prog.organization?.name || prog.slug} · scope: {prog.slug}
                      </Text>

                      <Text size="sm" c="dimmed" lineClamp={3} mb="md" style={{ lineHeight: 1.55 }}>
                        {(prog.policyMarkdown || "Authorized security research covered under standard safe harbor terms.").replace(/[#*]/g, "")}
                      </Text>
                    </Box>

                    <Box pt="sm" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                      <Group justify="space-between" align="center" mb="sm">
                        <Text size="xs" c="dimmed">
                          Reports Logged: <strong>{prog.activeReportsCount}</strong>
                        </Text>
                        <Text size="xs" c="dimmed">
                          Triage Team: <strong>{prog.defendersCount}</strong>
                        </Text>
                      </Group>
                      <Button
                        component={Link}
                        href={`/programs/${encodeURIComponent(prog.slug)}`}
                        fullWidth
                        size="sm"
                        style={{ backgroundColor: "var(--color-primary, #0B2E22)", color: "#FFFFFF" }}
                        rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                      >
                        Submit Guest Report
                      </Button>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
