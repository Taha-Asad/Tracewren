"use client";

import {
  Box,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

const TOOLSET_ITEMS = [
  {
    title: "Reporting portal",
    description: "A simple, scoped path for researchers to submit reports.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "Evidence & discussion",
    description: "Collect and review evidence with shared, in-context discussion.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Remediation & retest",
    description: "Track fixes, request a researcher retest, and keep the outcome recorded.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
  {
    title: "Audit history",
    description: "Keep a clear record of reports, changes, and key actions.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 22 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

export function ToolsetSection() {
  return (
    <Box
      component="section"
      id="toolset-section"
      aria-labelledby="toolset-heading"
      style={{
        width: "100%",
        backgroundColor: "var(--section-alt-bg, #F4EFE6)",
        color: "var(--text-primary)",
        borderTop: "1px solid var(--section-alt-border, #E8E3D8)",
        borderBottom: "1px solid var(--section-alt-border, #E8E3D8)",
        paddingTop: "clamp(3rem, 5vw, 4.5rem)",
        paddingBottom: "clamp(3.5rem, 5.5vw, 5rem)",
        transition: "background-color 200ms ease, border-color 200ms ease",
      }}
    >
      <Container
        size="1600px"
        px={{ base: "md", md: "xl" }}
        style={{ maxWidth: "1600px", width: "100%" }}
      >
        {/* Section Header with Responsive Horizontal Divider Line */}
        <Box
          mb={{ base: "xl", md: 36 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            width: "100%",
          }}
        >
          <Title
            id="toolset-heading"
            order={2}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.35rem, 3.8vw, 1.85rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.25,
              wordBreak: "break-word",
              maxWidth: 640,
            }}
          >
            A focused toolset for responsible disclosure.
          </Title>
          <Box
            visibleFrom="sm"
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "var(--border-subtle, #E5E2DA)",
              minWidth: 40,
            }}
          />
        </Box>

        {/* 4 Cards Grid with Standardized Card Padding */}
        <Grid gap={{ base: "md", md: "lg" }}>
          {TOOLSET_ITEMS.map((item) => (
            <Grid.Col key={item.title} span={{ base: 12, sm: 6, lg: 3 }}>
              <Paper
                className="standard-card-padding landing-interactive-card"
                withBorder
                style={{
                  padding: "clamp(12px, 2.5vw, 16px) clamp(10px, 2.5vw, 16px) 10px clamp(10px, 2.5vw, 16px)",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface-card, #FFFFFF)",
                  borderColor: "var(--border-subtle, #E5E2DA)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
              >
                <Stack gap="sm" style={{ height: "100%" }}>
                  {/* Distinct Icon inside High-Craft Illuminated Container */}
                  <Box
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "10px",
                      backgroundColor:
                        "var(--card-icon-bg, rgba(11, 46, 34, 0.07))",
                      border:
                        "1px solid var(--card-icon-border, rgba(11, 46, 34, 0.12))",
                      color: "var(--card-icon-color, #0B2E22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 180ms ease",
                    }}
                  >
                    {item.icon}
                  </Box>

                  {/* Card Title */}
                  <Title
                    order={3}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      letterSpacing: "-0.015em",
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </Title>

                  {/* Description Copy */}
                  <Text
                    size="sm"
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
