"use client";

import Link from "next/link";
import {
  Box,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export function CtaBannerSection() {
  return (
    <Box
      component="section"
      id="get-started-cta"
      aria-labelledby="cta-banner-heading"
      style={{
        width: "100%",
        paddingTop: "clamp(3rem, 5vw, 4.5rem)",
        paddingBottom: "clamp(3.5rem, 5.5vw, 5rem)",
        backgroundColor: "var(--canvas-bg)",
        transition: "background-color 200ms ease",
      }}
    >
      <Container
        size="1600px"
        px={{ base: "md", md: "xl" }}
        style={{ maxWidth: "1600px", width: "100%" }}
      >
        <Box className="cta-gradient-banner">
          <Stack
            gap="lg"
            align="center"
            style={{
              textAlign: "center",
              maxWidth: 720,
              margin: "0 auto",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Ambient Badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: "rgba(52, 211, 153, 0.15)",
                border: "1px solid rgba(52, 211, 153, 0.35)",
                color: "#86EFAC",
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#34D399",
                  display: "inline-block",
                  boxShadow: "0 0 8px #34D399",
                }}
                aria-hidden="true"
              />
              Responsible Disclosure Platform
            </span>

            {/* Display Headline */}
            <Title
              id="cta-banner-heading"
              order={2}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-h2)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Give your next report
              <br />
              a clear path forward.
            </Title>

            {/* Subheading */}
            <Text
              style={{
                fontSize: "clamp(0.92rem, 1.4vw, 1.05rem)",
                color: "rgba(255, 255, 255, 0.85)",
                lineHeight: 1.6,
                maxWidth: 560,
                margin: 0,
              }}
            >
              Start with a defined scope and a clear reporting process. Keep researchers and engineering teams aligned from discovery to retest.
            </Text>

            {/* Action Buttons Group */}
            <Group gap="md" justify="center" wrap="wrap" mt="xs">
              <Link
                href="/workspace/new"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  backgroundColor: "#FFFFFF",
                  color: "#0B2E22",
                  padding: "12px 26px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 180ms cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F7F5";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.25)";
                }}
              >
                Create workspace
              </Link>

              <Link
                href="/demo"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 180ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span>Explore the platform</span>
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

            {/* Sub-Link Note */}
            <Link
              href="/auth/login"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                color: "rgba(255, 255, 255, 0.72)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                transition: "color 150ms ease",
                marginTop: "4px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255, 255, 255, 0.72)")
              }
            >
              <span>Already a member? Log in to dashboard</span>
              <svg
                width="12"
                height="12"
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
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
