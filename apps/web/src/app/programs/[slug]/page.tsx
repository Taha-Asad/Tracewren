"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldIcon, CheckIcon, LockIcon } from "@/components/workspace/icons";

interface PublicProgramDetail {
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
  };
}

function PublicProgramSubmissionContent() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  const [program, setProgram] = useState<PublicProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Guest report form state
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [targetAsset, setTargetAsset] = useState("");
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<"Critical" | "High" | "Medium" | "Low">("High");
  const [cvssScore, setCvssScore] = useState("7.8");
  const [summary, setSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/v1/public/programs/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.id) {
          setProgram(data);
          setTargetAsset(`https://${data.organization?.domain || `${data.slug}.caulvyn.com`}/api`);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSeverityChange = (val: string | null) => {
    const sev = (val || "Medium") as "Critical" | "High" | "Medium" | "Low";
    setSeverity(sev);
    setCvssScore(sev === "Critical" ? "9.8" : sev === "High" ? "7.8" : sev === "Medium" ? "6.5" : "3.1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;
    setErrorMsg(null);

    if (!title.trim() || !summary.trim()) {
      setErrorMsg("Vulnerability title and reproduction steps are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: program.organizationId,
          orgSlug: program.organization?.slug || program.slug,
          programSlug: program.slug,
          title: title.trim(),
          summary: summary.trim(),
          severity,
          cvss: parseFloat(cvssScore) || 6.5,
          targetAsset: targetAsset.trim() || `https://${program.slug}.caulvyn.com/api`,
          reporter: reporterName.trim()
            ? `${reporterName.trim()}${reporterEmail.trim() ? ` (${reporterEmail.trim()})` : " (Guest Researcher)"}`
            : "Anonymous Researcher",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to submit guest vulnerability report.");
      }

      const data = await res.json();
      setSubmittedId(data?.report?.id || data?.report?.reportId || "SUBMITTED");
      setTitle("");
      setSummary("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--canvas-bg)" }}>
      <Navbar />

      <Box component="main" style={{ flex: 1, padding: "clamp(2rem, 4vw, 3.5rem) 0" }}>
        <Container size="1600px" px={{ base: "md", md: "xl" }} style={{ maxWidth: "1600px" }}>
          {loading ? (
            <Box py="xl" style={{ display: "flex", justifyContent: "center" }}>
              <Loader color="teal" size="md" />
            </Box>
          ) : !program ? (
            <Card p="xl" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
              <Title order={2} size="h3" mb="xs">Public Program Not Found</Title>
              <Text size="sm" c="dimmed" mb="md">
                This disclosure program is either private (invite-only) or does not exist.
              </Text>
              <Button component={Link} href="/programs" color="teal" variant="light">
                Return to Public Programs
              </Button>
            </Card>
          ) : (
            <Grid gap="xl" align="flex-start">
              {/* Left Column: Program Policy & Safe Harbor */}
              <Grid.Col span={{ base: 12, lg: 5 }}>
                <Card p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
                  <Stack gap="md">
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ShieldIcon size={20} color="var(--heading-accent)" />
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
                              fontWeight: 700,
                            },
                          }}
                        >
                          PUBLIC SCOPE
                        </Badge>
                      </Group>
                      <Text size="xs" ff="monospace" c="dimmed">/{program.slug}</Text>
                    </Group>

                    <Title
                      order={1}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--type-h2)",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        lineHeight: 1.15,
                      }}
                    >
                      {program.name}
                    </Title>

                    <Text size="sm" c="dimmed">
                      Organization: <strong>{program.organization?.name || program.slug}</strong> · Designated Triagers: <strong>{program.defendersCount}</strong>
                    </Text>

                    <Box
                      p="md"
                      style={{
                        backgroundColor: "var(--surface-subtle)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 8,
                        whiteSpace: "pre-wrap",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {program.policyMarkdown || "Standard Safe Harbor policy applies."}
                    </Box>

                    <Group gap="xs">
                      <Button component={Link} href="/programs" variant="subtle" color="gray" size="xs">
                        Back to Public Programs
                      </Button>
                      <Button component={Link} href="/cvss" variant="outline" size="xs" style={{ borderColor: "var(--border-contrast)", color: "var(--text-primary)" }}>
                        Calculate CVSS 3.1 Score
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>

              {/* Right Column: Guest Vulnerability Intake Form */}
              <Grid.Col span={{ base: 12, lg: 7 }}>
                <Card p="xl" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
                  <Stack gap="md">
                    <Group justify="space-between" align="center">
                      <Box>
                        <Title order={2} style={{ fontSize: "var(--type-h3)", fontWeight: 700, color: "var(--text-primary)" }}>
                          Guest Vulnerability Submission
                        </Title>
                        <Text size="sm" c="dimmed">
                          Submit directly to {program.name} without registration. Your finding receives a trackable mnemonic Report ID.
                        </Text>
                      </Box>
                      <Group gap={6} style={{ color: "var(--heading-accent)" }}>
                        <LockIcon size={14} />
                        <Text size="xs" fw={600} style={{ color: "var(--heading-accent)" }}>
                          Zero-Account Intake
                        </Text>
                      </Group>
                    </Group>

                    {submittedId && (
                      <Alert
                        variant="light"
                        title="Vulnerability Report Submitted"
                        icon={<CheckIcon size={16} />}
                        styles={{
                          root: {
                            backgroundColor: "var(--surface-banner)",
                            color: "var(--surface-banner-text)",
                            border: "1px solid var(--border-contrast)",
                          },
                        }}
                      >
                        Your report has been persisted to the organization triage queue with Report ID{" "}
                        <strong>{submittedId}</strong>.
                      </Alert>
                    )}

                    {errorMsg && (
                      <Alert color="red" variant="light" title="Submission Error">
                        {errorMsg}
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                      <Stack gap="md">
                        <Grid gap="md">
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                              label="Researcher Handle / Name (Optional)"
                              placeholder="e.g. Alex Rivera"
                              value={reporterName}
                              onChange={(e) => setReporterName(e.currentTarget.value)}
                            />
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                              label="Contact Email (Optional)"
                              placeholder="researcher@example.com"
                              value={reporterEmail}
                              onChange={(e) => setReporterEmail(e.currentTarget.value)}
                            />
                          </Grid.Col>
                        </Grid>

                        <TextInput
                          label="Vulnerability Title"
                          required
                          placeholder="e.g. Broken Object Level Authorization on /api/v1/export"
                          value={title}
                          onChange={(e) => setTitle(e.currentTarget.value)}
                        />

                        <Grid gap="md">
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <TextInput
                              label="Affected Target Asset / Endpoint"
                              required
                              placeholder="https://api.example.com/v1/users"
                              value={targetAsset}
                              onChange={(e) => setTargetAsset(e.currentTarget.value)}
                            />
                          </Grid.Col>
                          <Grid.Col span={{ base: 6, sm: 3 }}>
                            <Select
                              label="Severity"
                              value={severity}
                              onChange={handleSeverityChange}
                              data={["Critical", "High", "Medium", "Low"]}
                            />
                          </Grid.Col>
                          <Grid.Col span={{ base: 6, sm: 3 }}>
                            <TextInput
                              label="CVSS 3.1 Score"
                              value={cvssScore}
                              onChange={(e) => setCvssScore(e.currentTarget.value)}
                            />
                          </Grid.Col>
                        </Grid>

                        <Textarea
                          label="Proof of Concept & Reproduction Steps"
                          required
                          minRows={6}
                          placeholder="1. Send authenticated GET request to...&#10;2. Observe cross-tenant response..."
                          value={summary}
                          onChange={(e) => setSummary(e.currentTarget.value)}
                        />

                        <Button
                          type="submit"
                          loading={submitting}
                          size="md"
                          style={{ backgroundColor: "var(--color-primary, #0B2E22)", color: "#FFFFFF" }}
                        >
                          Submit Encrypted Finding as Guest
                        </Button>
                      </Stack>
                    </form>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default function PublicProgramSubmissionPage() {
  return (
    <Suspense
      fallback={
        <Box style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--canvas-bg)" }}>
          <Loader color="teal" size="md" />
        </Box>
      }
    >
      <PublicProgramSubmissionContent />
    </Suspense>
  );
}
