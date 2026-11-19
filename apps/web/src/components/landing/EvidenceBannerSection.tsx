"use client";

import {
  Box,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export function EvidenceBannerSection() {
  return (
    <Box
      component="section"
      aria-labelledby="evidence-banner-title"
      style={{
        width: "100%",
        paddingTop: "0.5rem",
        paddingBottom: "2.5rem",
      }}
    >
      <Container
        size="1600px"
        px={{ base: "md", md: "xl" }}
        style={{ maxWidth: "1600px", width: "100%" }}
      >
        <Box
          style={{
            backgroundColor: "var(--color-primary, #0B2E22)",
            background:
              "radial-gradient(circle at 85% 15%, rgba(52, 211, 153, 0.16) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(16, 79, 59, 0.35) 0%, transparent 50%), linear-gradient(135deg, #07261B 0%, #0B3527 50%, #0E4432 100%)",
            borderRadius: "16px",
            padding: "clamp(18px, 3.5vw, 32px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 20px 48px -12px rgba(7, 38, 27, 0.45)",
          }}
        >
          <Grid align="center" gap={{ base: "xl", md: "xl", lg: 32 }}>
            {/* 1. Narrative Headline & Continuity Context */}
            {/* On mobile/tablet (<= 990px), headline appears FIRST (order 1) */}
            {/* On desktop (> 990px), headline sits in the middle (order 2) */}
            <Grid.Col
              span={{ base: 12, md: 4.5, lg: 5 }}
              order={{ base: 1, md: 2 }}
              className="banner-divider-col"
            >
              <Stack gap="xs">
                <Title
                  id="evidence-banner-title"
                  order={2}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--type-h2)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.025em",
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  Keep the evidence.
                  <br />
                  Keep the context.
                </Title>

                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.88)",
                    fontSize: "clamp(0.85rem, 1.3vw, 0.94rem)",
                    lineHeight: 1.5,
                    margin: 0,
                    maxWidth: 440,
                  }}
                >
                  Reports, discussions, and retest outcomes stay connected from
                  intake to closure.
                </Text>
              </Stack>
            </Grid.Col>

            {/* 2. Embedded Evidence Sample Card */}
            {/* On mobile/tablet (<= 990px), card appears SECOND (order 2) */}
            {/* On desktop (> 990px), card sits on the left (order 1) */}
            <Grid.Col
              span={{ base: 12, md: 4.5, lg: 4 }}
              order={{ base: 2, md: 1 }}
            >
              <Box
                className="standard-card-padding"
                style={{
                  backgroundColor: "var(--surface-card)",
                  borderRadius: "12px",
                  padding: "clamp(12px, 2.5vw, 16px) clamp(10px, 2.5vw, 16px) 10px clamp(10px, 2.5vw, 16px)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.12)",
                }}
              >
                <Grid align="stretch" gap={0}>
                  {/* Expected 403 Forbidden */}
                  <Grid.Col
                    span={6}
                    style={{
                      paddingRight: "12px",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Stack gap={2}>
                      <Group gap={6} align="center">
                        <Box
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "var(--text-muted)",
                          }}
                        />
                        <Text
                          size="xs"
                          fw={600}
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.72rem",
                            letterSpacing: "0.01em",
                            textTransform: "uppercase",
                          }}
                        >
                          Expected
                        </Text>
                      </Group>
                      <Text
                        fw={700}
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.95rem",
                          color: "var(--text-primary)",
                          letterSpacing: "-0.015em",
                          lineHeight: 1.25,
                        }}
                      >
                        403 Forbidden
                      </Text>
                      <Text
                        size="xs"
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.7rem",
                          lineHeight: 1.35,
                          marginTop: "2px",
                        }}
                      >
                        Workspace membership required.
                      </Text>
                    </Stack>
                  </Grid.Col>

                  {/* Observed 200 OK (Clean Green State) */}
                  <Grid.Col span={6} style={{ paddingLeft: "12px" }}>
                    <Stack gap={2}>
                      <Group gap={6} align="center">
                        <Box
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#10B981",
                            boxShadow: "0 0 6px rgba(16, 185, 129, 0.4)",
                          }}
                        />
                        <Text
                          size="xs"
                          fw={600}
                          style={{
                            color: "var(--badge-success-text, #175C34)",
                            fontSize: "0.72rem",
                            letterSpacing: "0.01em",
                            textTransform: "uppercase",
                          }}
                        >
                          Observed
                        </Text>
                      </Group>
                      <Text
                        fw={700}
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.95rem",
                          color: "var(--badge-success-text, #175C34)",
                          letterSpacing: "-0.015em",
                          lineHeight: 1.25,
                        }}
                      >
                        200 OK
                      </Text>
                      <Text
                        size="xs"
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.7rem",
                          lineHeight: 1.35,
                          marginTop: "2px",
                        }}
                      >
                        Metadata for another workspace returned.
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>

                {/* Bottom Sample Evidence Label */}
                <Text
                  size="xs"
                  ta="center"
                  mt={8}
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    borderTop: "1px dashed var(--border-subtle)",
                    paddingTop: "6px",
                  }}
                >
                  Original test - sample evidence
                </Text>
              </Box>
            </Grid.Col>

            {/* 3. Right Column: Verification Invariants Checklist */}
            {/* Always appears third (order 3) */}
            <Grid.Col
              span={{ base: 12, md: 3, lg: 3 }}
              order={3}
              className="banner-divider-col"
            >
              <Stack gap="sm">
                {[
                  "Clear scope",
                  "Shared context",
                  "Recorded outcomes",
                ].map((item) => (
                  <Group key={item} gap="xs" wrap="nowrap" align="center">
                    {/* Filled White Circular Badge with Green Checkmark */}
                    <Box
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                      }}
                      aria-hidden="true"
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0B2E22"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </Box>

                    <Text
                      fw={600}
                      style={{
                        color: "#FFFFFF",
                        fontSize: "0.95rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
