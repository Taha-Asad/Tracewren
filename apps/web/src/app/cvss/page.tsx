"use client";

import Link from "next/link";
import { Badge, Box, Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CvssCalculatorWidget } from "@/components/workspace/CvssCalculatorWidget";

export default function PublicCvssCalculatorPage() {
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
            <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
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
                  FIRST.org Standard Specification
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
                  CVSS 3.1 Severity &amp; Remediation SLA Calculator
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
                  Compute standardized CVSS 3.1 Base Scores, vector strings, and statutory remediation SLA windows before submitting a vulnerability finding.
                </Text>
              </Box>
              <Button
                component={Link}
                href="/programs"
                size="sm"
                style={{ backgroundColor: "var(--color-primary, #0B2E22)", color: "#FFFFFF" }}
              >
                Browse Public Programs
              </Button>
            </Group>

            <CvssCalculatorWidget />
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
