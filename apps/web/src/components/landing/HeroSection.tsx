"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (heroImgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);
  return (
    <Box
      component="section"
      id="hero-section"
      style={{
        width: "100%",
        color: "var(--text-primary)",
        paddingTop: "clamp(2.5rem, 5vw, 4.25rem)",
        paddingBottom: "2.5rem",
      }}
    >
      <Container
        size="1600px"
        px={{ base: "md", md: "xl" }}
        style={{ maxWidth: "1600px", width: "100%" }}
      >
        <Grid gap={{ base: "2rem", md: "2.5rem", lg: 50 }} align="center">
          {/* Left Column: Proposition, Headline, Subhead & Action Buttons */}
          <Grid.Col span={{ base: 12, md: 5.5 }}>
            <Stack gap="lg" style={{ maxWidth: 540 }}>
              {/* Eyebrow Label */}
              <Text
                size="sm"
                fw={600}
                style={{
                  letterSpacing: "-0.01em",
                  color: "var(--text-muted)",
                }}
              >
                Private vulnerability disclosure
              </Text>

              {/* Main Display Headline (Dual-Tone) */}
              <Title
                order={1}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h1)",
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: "-0.035em",
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                From the first report{" "}
                <span className="hero-headline-accent">
                  to a verified fix.
                </span>
              </Title>

              {/* Subhead Paragraph */}
              <Text
                size="lg"
                style={{
                  fontSize: "var(--type-lead)",
                  lineHeight: 1.6,
                  maxWidth: "56ch",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                Collect useful evidence, coordinate the response, and keep verification in the same workspace.
              </Text>

              {/* Primary & Secondary Action CTAs */}
              <Box mt="xs">
                <Group gap="md" wrap="wrap">
                  {/* Primary CTA (8px Sleek Rounded Rectangle) */}
                  <Link
                    href="/workspace/new"
                    className="btn-smooth btn-primary"
                    style={{
                      borderRadius: "8px",
                      padding: "12px 24px",
                      height: "46px",
                      fontSize: "0.95rem",
                    }}
                  >
                    Create workspace
                  </Link>

                  {/* Secondary CTA (8px Sleek Rounded Rectangle with Inline SVG Arrow) */}
                  <Link
                    href="/programs"
                    className="btn-smooth btn-secondary"
                    style={{
                      borderRadius: "8px",
                      padding: "12px 24px",
                      height: "46px",
                      fontSize: "0.95rem",
                      gap: "8px",
                    }}
                  >
                    <span>Browse public programs</span>
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

                {/* Sub-CTA Note */}
                <Text
                  size="xs"
                  mt="sm"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  For software teams and security researchers.
                </Text>
              </Box>
            </Stack>
          </Grid.Col>

          {/* Right Column: Complete Hero Product Preview Showing on ALL Screens */}
          <Grid.Col
            span={{ base: 12, md: 6.5 }}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              style={{
                width: "100%",
                maxWidth: "780px",
                position: "relative",
              }}
            >
              {/* Ambient Emerald Glow behind the frame (Desktop) */}
              <Box
                visibleFrom="md"
                style={{
                  position: "absolute",
                  inset: "-14px",
                  borderRadius: "28px",
                  background:
                    "radial-gradient(ellipse at center, rgba(11, 46, 34, 0.22) 0%, rgba(11, 46, 34, 0.05) 55%, transparent 75%)",
                  filter: "blur(20px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Hardware Application Shell Frame */}
              <Box
                style={{
                  position: "relative",
                  zIndex: 1,
                  backgroundColor: "var(--header-dark-bg, #141B1E)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow:
                    "0 24px 60px -12px rgba(18, 24, 27, 0.38), 0 4px 16px rgba(0, 0, 0, 0.15)",
                  padding: "clamp(8px, 1.5vw, 12px)",
                  transition: "transform 250ms ease, box-shadow 250ms ease",
                }}
              >
                {/* Titlebar with Traffic Lights & SVG Security Status Pills */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 6px 8px 6px",
                    minHeight: "26px",
                    gap: "8px",
                  }}
                >
                  {/* Left: Window Control Dots */}
                  <Group gap={6} wrap="nowrap" align="center" style={{ flexShrink: 0 }}>
                    <Box
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        backgroundColor: "#EF4444",
                        opacity: 0.85,
                      }}
                    />
                    <Box
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        backgroundColor: "#F59E0B",
                        opacity: 0.85,
                      }}
                    />
                    <Box
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        backgroundColor: "#10B981",
                        opacity: 0.85,
                      }}
                    />
                  </Group>

                  {/* Center: Context Pill with Vector SVG Lock (Strictly bounded so it never pushes out on xs) */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "clamp(0.65rem, 1.8vw, 0.72rem)",
                      fontFamily: "var(--font-mono)",
                      userSelect: "none",
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "rgba(255, 255, 255, 0.75)",
                      maxWidth: "calc(100% - 60px)",
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: 0 }}
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      caulvyn.workspace/BBT-0041
                    </span>
                  </div>

                  {/* Right: Verified Status Pill (Visible on sm and up, cleanly hidden on xs to prevent overflow) */}
                  <Box visibleFrom="sm" style={{ flexShrink: 0 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        lineHeight: 1,
                        backgroundColor: "rgba(16, 185, 129, 0.12)",
                        border: "1px solid rgba(16, 185, 129, 0.28)",
                        color: "#34D399",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span
                        style={{
                          display: "inline-block",
                          lineHeight: 1,
                          transform: "translateY(0.5px)",
                        }}
                      >
                        Verified fix
                      </span>
                    </div>
                  </Box>
                </div>

                {/* Inner Window Display: Full 1920x1316 Product UI Complete on All Screens */}
                <Box
                  className="image-loading-container"
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "var(--surface-subtle)",
                    position: "relative",
                    width: "100%",
                    minHeight: "200px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {!isLoaded && (
                    <div className="skeleton-shimmer-effect" aria-hidden="true" />
                  )}
                  <picture>
                    <source srcSet="/hero-product-preview.webp" type="image/webp" />
                    <img
                      ref={heroImgRef}
                      src="/hero-product-preview.png"
                      alt="Caulvyn vulnerability disclosure and verified remediation workspace interface preview"
                      width={1920}
                      height={1316}
                      loading="eager"
                      decoding="async"
                      onLoad={() => setIsLoaded(true)}
                      onError={() => setIsLoaded(true)}
                      className={`image-reveal ${isLoaded ? "is-loaded" : ""}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: "10px",
                      }}
                    />
                  </picture>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
