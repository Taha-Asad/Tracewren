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

export function CheckpointSection() {
  return (
    <Box
      component="section"
      id="checkpoint-section"
      aria-labelledby="checkpoint-section-title"
      style={{
        width: "100%",
        color: "var(--text-primary)",
        paddingTop: "2rem",
        paddingBottom: "3rem",
      }}
    >
      <Container
        size="1600px"
        px={{ base: "md", md: "xl" }}
        style={{ maxWidth: "1600px", width: "100%" }}
      >
        {/* Main Card with Multi-Stop Ambient Emerald Gradient Mesh */}
        <Box
          style={{
            background:
              "radial-gradient(circle at 12% 20%, rgba(16, 185, 129, 0.22) 0%, transparent 42%), radial-gradient(circle at 88% 85%, rgba(14, 165, 233, 0.16) 0%, transparent 48%), linear-gradient(135deg, #061F17 0%, #0A2F24 50%, #0D3E30 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 20px 48px -12px rgba(6, 31, 23, 0.45)",
            padding: "clamp(20px, 3.5vw, 36px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Grid align="center" gap={{ base: "xl", lg: 40 }}>
            {/* Left Column: Heading, Subhead & Dotting Timeline */}
            <Grid.Col span={{ base: 12, md: 6.5, lg: 6.8 }}>
              <Stack gap="xl">
                {/* Section Title & Subtitle */}
                <Stack gap="xs">
                  <Title
                    id="checkpoint-section-title"
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
                    A deployed fix
                    <br />
                    is a checkpoint.
                  </Title>

                  <Text
                    style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontSize: "clamp(0.9rem, 1.4vw, 1rem)",
                      lineHeight: 1.55,
                      maxWidth: 480,
                      margin: 0,
                    }}
                  >
                    Keep retest requests and verification outcomes explicit, so
                    closure has a clear basis.
                  </Text>
                </Stack>

                {/* Pencil Timeline (Technical Drafting Aesthetic - Zero Glow) */}
                <Box style={{ position: "relative", paddingLeft: "4px" }}>
                  <Stack gap={0}>
                    {/* Node 1: Report received */}
                    <Box style={{ display: "flex", gap: "16px" }}>
                      {/* Timeline Pencil Ring & Hairline Dotted Line */}
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: 24,
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                            border: "1.5px solid #10B981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "none",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#34D399"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </Box>

                        {/* Fine Pencil Dotted Line Connector */}
                        <Box
                          style={{
                            width: "1.5px",
                            flex: 1,
                            minHeight: "36px",
                            borderLeft: "1.5px dashed rgba(255, 255, 255, 0.28)",
                            margin: "4px 0",
                          }}
                        />
                      </Box>

                      {/* Content */}
                      <Box pb="md">
                        <Text
                          fw={700}
                          style={{
                            color: "#FFFFFF",
                            fontSize: "0.95rem",
                            lineHeight: 1.25,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          Report received
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: "rgba(255, 255, 255, 0.72)",
                            marginTop: "2px",
                            lineHeight: 1.4,
                          }}
                        >
                          Report triaged and under review.
                        </Text>
                      </Box>
                    </Box>

                    {/* Node 2: Fix deployed */}
                    <Box style={{ display: "flex", gap: "16px" }}>
                      {/* Timeline Pencil Ring & Hairline Dotted Line */}
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: 24,
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                            border: "1.5px solid #10B981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "none",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#34D399"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </Box>

                        {/* Fine Pencil Dotted Line Connector */}
                        <Box
                          style={{
                            width: "1.5px",
                            flex: 1,
                            minHeight: "36px",
                            borderLeft: "1.5px dashed rgba(52, 211, 153, 0.45)",
                            margin: "4px 0",
                          }}
                        />
                      </Box>

                      {/* Content */}
                      <Box pb="md">
                        <Text
                          fw={700}
                          style={{
                            color: "#FFFFFF",
                            fontSize: "0.95rem",
                            lineHeight: 1.25,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          Fix deployed
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: "rgba(255, 255, 255, 0.72)",
                            marginTop: "2px",
                            lineHeight: 1.4,
                          }}
                        >
                          A fix has been deployed to production.
                        </Text>
                      </Box>
                    </Box>

                    {/* Node 3: Researcher retest pending (Pencil Concentric Ring) */}
                    <Box style={{ display: "flex", gap: "16px" }}>
                      <Box
                        style={{
                          width: 24,
                          display: "flex",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "rgba(2, 132, 199, 0.2)",
                            border: "1.5px solid #38BDF8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "none",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7DD3FC"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </Box>
                      </Box>

                      {/* Content */}
                      <Box>
                        <Group gap="xs" align="center" wrap="wrap">
                          <Text
                            fw={700}
                            style={{
                              color: "#FFFFFF",
                              fontSize: "0.95rem",
                              lineHeight: 1.25,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            Researcher retest pending
                          </Text>
                          {/* Chip with Pixel-Perfect Dot & Text Alignment */}
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(2, 132, 199, 0.2)",
                              border: "1px solid rgba(56, 189, 248, 0.45)",
                              color: "#7DD3FC",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              lineHeight: 1,
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                backgroundColor: "#38BDF8",
                                flexShrink: 0,
                                display: "inline-block",
                              }}
                              aria-hidden="true"
                            />
                            <span
                              style={{
                                display: "inline-block",
                                lineHeight: 1,
                                transform: "translateY(0.5px)",
                              }}
                            >
                              Active milestone
                            </span>
                          </span>
                        </Group>
                        <Text
                          size="xs"
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            marginTop: "4px",
                            lineHeight: 1.45,
                            maxWidth: 420,
                          }}
                        >
                          Waiting for the researcher to retest the fix and
                          confirm the outcome.
                        </Text>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid.Col>

            {/* Right Column: High-Craft Interactive Interface Card (Direction 1) + Commented Image */}
            <Grid.Col span={{ base: 12, md: 5.5, lg: 5.2 }}>
              <Box
                className="standard-card-padding"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "clamp(12px, 2.5vw, 16px) clamp(10px, 2.5vw, 16px) 10px clamp(10px, 2.5vw, 16px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow:
                    "0 18px 40px -10px rgba(0, 0, 0, 0.28), 0 4px 12px rgba(0, 0, 0, 0.12)",
                }}
              >
                <Stack gap="md">
                  {/* Card Header: On small screens (xs/sm) heading and chip are on SEPARATE lines */}
                  <Stack gap="xs" hiddenFrom="sm">
                    <Text
                      fw={700}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.05rem",
                        color: "var(--text-primary)",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      Deployment and retest
                    </Text>
                    <Box>
                      <span className="retest-pending-chip">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ flexShrink: 0 }}
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span
                          style={{
                            display: "inline-block",
                            lineHeight: 1,
                            transform: "translateY(0.5px)",
                          }}
                        >
                          Retest pending
                        </span>
                      </span>
                    </Box>
                  </Stack>

                  {/* Card Header: On desktop/tablet (sm and up) side-by-side */}
                  <Group justify="space-between" align="center" wrap="nowrap" visibleFrom="sm">
                    <Text
                      fw={700}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.05rem",
                        color: "var(--text-primary)",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      Deployment and retest
                    </Text>

                    {/* Retest Pending Chip with Optically Centered Icon & Text */}
                    <span className="retest-pending-chip">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span
                        style={{
                          display: "inline-block",
                          lineHeight: 1,
                          transform: "translateY(0.5px)",
                        }}
                      >
                        Retest pending
                      </span>
                    </span>
                  </Group>

                  {/* Telemetry / Verified Artifact Strip */}
                  <Box className="checkpoint-telemetry-box">
                    <Group gap={10} wrap="nowrap" align="flex-start">
                      {/* Checkmark icon moved to the start (top-left aligned with text) */}
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          backgroundColor: "rgba(16, 185, 129, 0.12)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>

                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          fw={700}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.76rem",
                            color: "var(--text-primary)",
                            lineHeight: 1.2,
                          }}
                        >
                          build: production-release-v0.8.4
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.68rem",
                            lineHeight: 1.2,
                            marginTop: 2,
                          }}
                        >
                          Automated CI/CD · Commit 7f14b3a
                        </Text>
                        {/* PASS moved to next line and written as status:pass */}
                        <Box mt={6}>
                          <span className="status-pass-chip">
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                backgroundColor: "#16A34A",
                                display: "inline-block",
                              }}
                              aria-hidden="true"
                            />
                            status: pass
                          </span>
                        </Box>
                      </Box>
                    </Group>
                  </Box>

                  {/* Metadata Key-Value Grid: 2-by-2 above 435px, 1-by-1 strictly below 435px */}
                  <Box className="checkpoint-metadata-grid">
                    <Box>
                      <Text
                        size="xs"
                        style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}
                      >
                        Current attempt
                      </Text>
                      <Text
                        fw={700}
                        style={{
                          color: "var(--text-primary)",
                          fontSize: "0.92rem",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        01
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        size="xs"
                        style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}
                      >
                        Version
                      </Text>
                      <Text
                        fw={700}
                        style={{
                          color: "var(--text-primary)",
                          fontSize: "0.92rem",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        v0.8.4
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        size="xs"
                        style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}
                      >
                        Deployed to
                      </Text>
                      <Text
                        fw={600}
                        style={{ color: "var(--text-primary)", fontSize: "0.88rem" }}
                      >
                        Production
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        size="xs"
                        style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}
                      >
                        Deployed
                      </Text>
                      <Text
                        size="xs"
                        fw={500}
                        style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}
                      >
                        Nov 13 2026, 14:22 UTC
                      </Text>
                    </Box>
                  </Box>

                  {/* Action Buttons: Strict 8px Radius Invariant, Responsive Stacking on Mobile/Tablet */}
                  <Box
                    pt="xs"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <button
                      type="button"
                      className="btn-smooth btn-primary"
                      style={{
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        padding: "10px 14px",
                        width: "100%",
                        minWidth: 0,
                        minHeight: "38px",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ flexShrink: 0 }}
                        aria-hidden="true"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>View remediation & retest</span>
                    </button>

                    <button
                      type="button"
                      className="btn-smooth btn-secondary"
                      style={{
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        padding: "10px 14px",
                        width: "100%",
                        minWidth: 0,
                        minHeight: "38px",
                      }}
                    >
                      <span>Record internal verification</span>
                    </button>
                  </Box>

                  {/* Preserved Image Asset per user request (kept commented without removal):
                  <Box
                    style={{
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.25)",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <picture>
                      <source
                        srcSet="/deployment-retest-card.webp"
                        type="image/webp"
                      />
                      <img
                        src="/deployment-retest-card.png"
                        alt="Deployment and retest verification record preview with version v0.8.4"
                        width={800}
                        height={440}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                    </picture>
                  </Box>
                  */}
                </Stack>
              </Box>
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
