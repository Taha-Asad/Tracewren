import Link from "next/link";
import { Container, Title, Text, Box, Group, Paper, Stack } from "@mantine/core";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--canvas-bg, #FAFAF7)",
        color: "var(--text-primary, #181C19)",
        transition: "background-color 200ms ease, color 200ms ease",
      }}
    >
      <Navbar />

      <Box
        component="main"
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "clamp(4rem, 8vw, 7rem)",
          paddingBottom: "clamp(4rem, 8vw, 7rem)",
        }}
      >
        {/* Giant Full-Section 404 Background Watermark */}
        <Box
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        >
          <Text
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "clamp(12rem, 34vw, 28rem)",
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: "-0.06em",
              color: "var(--text-primary, #181C19)",
              opacity: 0.06,
              margin: 0,
            }}
          >
            404
          </Text>
        </Box>

        <Container size="820px" px="md" style={{ width: "100%", position: "relative", zIndex: 1 }}>
          <Stack align="center" gap="xl" style={{ textAlign: "center" }}>
            {/* Top Security Scope Badge */}
            <Group
              gap={8}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--surface-subtle, #F0EDE6)",
                border: "1px solid var(--border-contrast, #DDD8CE)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#F59E0B",
                  boxShadow: "0 0 8px rgba(245, 158, 11, 0.4)",
                  display: "inline-block",
                }}
                aria-hidden="true"
              />
              <Text
                size="12px"
                fw={700}
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  letterSpacing: "0.06em",
                  color: "var(--text-secondary, #454B47)",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                }}
              >
                Observation Boundary · RFC 9116 / 404
              </Text>
            </Group>

            {/* Foreground Headline */}
            <Box>
              <Title
                order={1}
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontSize: "var(--type-h2, clamp(1.85rem, 3.8vw, 2.6rem))",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary, #181C19)",
                  lineHeight: 1.15,
                  margin: 0,
                }}
              >
                This path has no active disclosure record.
              </Title>
            </Box>

            {/* Explanatory Context */}
            <Text
              size="md"
              style={{
                maxWidth: "580px",
                color: "var(--text-secondary, #454B47)",
                lineHeight: 1.6,
                fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
              }}
            >
              The requested route does not exist within the tenant cryptographic boundary,
              or has been quarantined under current access policy rules.
            </Text>

            {/* Telemetry Box */}
            <Paper
              withBorder
              className="standard-card-padding"
              style={{
                width: "100%",
                maxWidth: "620px",
                textAlign: "left",
                backgroundColor: "var(--surface-card, #F4F3EE)",
                borderColor: "var(--border-subtle, #E5E2DA)",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Group justify="space-between" mb="xs" pb="xs" style={{ borderBottom: "1px solid var(--border-subtle, #E5E2DA)" }}>
                <Group gap={6}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#EF4444", display: "inline-block" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#F59E0B", display: "inline-block" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10B981", display: "inline-block" }} />
                </Group>
                <Text size="xs" style={{ fontFamily: "var(--font-mono, monospace)", color: "var(--text-muted, #737B76)" }}>
                  edge-boundary-router.log
                </Text>
              </Group>
              <Box
                component="pre"
                style={{
                  margin: 0,
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.78rem",
                  lineHeight: 1.6,
                  color: "var(--text-secondary, #454B47)",
                  overflowX: "auto",
                }}
              >
                <code>
                  <span style={{ color: "var(--text-muted, #737B76)" }}>&gt;</span> STATUS: 404 NOT_FOUND [E_BOUNDARY_VIOLATION]{"\n"}
                  <span style={{ color: "var(--text-muted, #737B76)" }}>&gt;</span> PROTOCOL: RFC 9116 / Zero-Knowledge Isolation{"\n"}
                  <span style={{ color: "var(--text-muted, #737B76)" }}>&gt;</span> AUDIT: Route verification completed with zero side-channel leaks
                </code>
              </Box>
            </Paper>

            {/* Action Buttons */}
            <Group gap="md" mt="sm" wrap="wrap" justify="center">
              <Link
                href="/"
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "11px 22px",
                  borderRadius: "8px",
                  fontFamily: "var(--font-sans, sans-serif)",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Return to Homepage</span>
              </Link>

              <Link
                href="/platform"
                className="btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "11px 22px",
                  borderRadius: "8px",
                  fontFamily: "var(--font-sans, sans-serif)",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <span>Explore Platform</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </Group>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
