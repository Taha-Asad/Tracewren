"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

const GUIDE_ITEMS = [
  {
    title: "Installation & setup",
    description: "Prepare your environment and configure a workspace.",
    href: "/docs/installation",
    icon: (
      <svg
        width="20"
        height="20"
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
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    title: "User manual",
    description: "Learn reporting, triage, and team workflows.",
    href: "/docs/user-manual",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="11" x2="13" y2="11" />
      </svg>
    ),
  },
  {
    title: "Remediation & retesting",
    description: "Follow fixes through verification and closure.",
    href: "/docs/remediation",
    icon: (
      <svg
        width="20"
        height="20"
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
        <polyline points="9 15 12 18 15 15" />
        <path d="M12 12v6" />
      </svg>
    ),
  },
];

export function VideoGuideSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoThumbLoaded, setVideoThumbLoaded] = useState(false);
  const thumbImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (thumbImgRef.current?.complete) {
      setVideoThumbLoaded(true);
    }
  }, []);

  return (
    <Box
      component="section"
      id="workflow"
      aria-labelledby="video-guide-title"
      style={{
        width: "100%",
        paddingTop: "clamp(3.5rem, 5.5vw, 5rem)",
        paddingBottom: "clamp(3.5rem, 5.5vw, 5rem)",
        backgroundColor: "var(--canvas-bg)",
        color: "var(--text-primary)",
        transition: "background-color 200ms ease",
      }}
    >
      <Container
        size="1600px"
        px={{ base: "md", md: "xl" }}
        style={{ maxWidth: "1600px", width: "100%" }}
      >
        {/* 1. Section Header */}
        <Box mb={{ base: "xl", md: 36 }}>
          <Title
            id="video-guide-title"
            order={2}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--type-h2)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            See how Caulvyn works.
          </Title>
          <Text
            size="sm"
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(0.88rem, 1.4vw, 1rem)",
              lineHeight: 1.5,
              marginTop: "0.5rem",
              maxWidth: 620,
            }}
          >
            Watch how reports, evidence, discussions, and retests stay connected
            from intake to verification in a single continuous workspace.
          </Text>
        </Box>

        {/* 2. Full-Width Video Walkthrough Card */}
        <Box
          mb={{ base: "2.5rem", md: "3.5rem" }}
          style={{ width: "100%" }}
        >
          <Paper
            withBorder
            style={{
              backgroundColor: "#161D20",
              borderColor: "var(--border-subtle, #2B3A3F)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow:
                "0 20px 48px -10px rgba(18, 24, 27, 0.22), 0 4px 14px rgba(18, 24, 27, 0.12)",
              transition: "transform 220ms ease, box-shadow 220ms ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Browser Window Header Chrome */}
            <Box
              style={{
                backgroundColor: "#12181A",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              {/* Traffic Lights */}
              <Group gap={7} wrap="nowrap" align="center">
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#EF4444",
                    opacity: 0.85,
                  }}
                />
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#F59E0B",
                    opacity: 0.85,
                  }}
                />
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    opacity: 0.85,
                  }}
                />
              </Group>

              {/* Centered URL Bar */}
              <Box
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 14px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "0.74rem",
                  fontFamily: "var(--font-mono)",
                  color: "rgba(255, 255, 255, 0.72)",
                  maxWidth: 420,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, opacity: 0.7 }}
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>caulvyn.workspace/BBT-0041 · Video walkthrough</span>
              </Box>

              {/* Video Preview Badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  backgroundColor: "rgba(59, 130, 246, 0.16)",
                  border: "1px solid rgba(59, 130, 246, 0.35)",
                  color: "#93C5FD",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#3B82F6",
                    display: "inline-block",
                    boxShadow: "0 0 8px #3B82F6",
                  }}
                  aria-hidden="true"
                />
                Video preview
              </span>
            </Box>

            {/* Video Viewport Area with Interactive Play Overlay */}
            <Box
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                maxHeight: "680px",
                backgroundColor: "#0D1214",
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={() => setModalOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Play Caulvyn product walkthrough video"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setModalOpen(true);
                }
              }}
            >
              {/* Loading Shimmer Placeholder until completely loaded */}
              {!videoThumbLoaded && (
                <div className="skeleton-shimmer-effect" aria-hidden="true" />
              )}

              {/* Product Preview Screenshot Background */}
              <picture>
                <source
                  srcSet="/hero-product-preview.webp"
                  type="image/webp"
                />
                <img
                  ref={thumbImgRef}
                  src="/hero-product-preview.png"
                  alt="Caulvyn vulnerability report interface preview with workspace export across authorization boundary"
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setVideoThumbLoaded(true)}
                  onError={() => setVideoThumbLoaded(true)}
                  className={`image-reveal ${videoThumbLoaded ? "is-loaded" : ""}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    display: "block",
                    filter: isHovered ? "brightness(0.85)" : "brightness(0.92)",
                    transition: "filter 220ms ease, transform 350ms ease, opacity 320ms ease",
                    transform: isHovered ? "scale(1.012)" : "scale(1)",
                  }}
                />
              </picture>

              {/* Dark Ambient Glass Tint */}
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(14, 20, 23, 0.25) 0%, rgba(14, 20, 23, 0.1) 40%, rgba(14, 20, 23, 0.75) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Large Central Glowing Play Button */}
              <Box
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.08 : 1})`,
                  width: "clamp(64px, 7.5vw, 88px)",
                  height: "clamp(64px, 7.5vw, 88px)",
                  borderRadius: "50%",
                  backgroundColor: "#2563EB",
                  background:
                    "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                  border: "2px solid rgba(255, 255, 255, 0.35)",
                  boxShadow: isHovered
                    ? "0 0 36px 8px rgba(59, 130, 246, 0.65), 0 12px 32px rgba(0, 0, 0, 0.5)"
                    : "0 0 24px 2px rgba(59, 130, 246, 0.45), 0 8px 24px rgba(0, 0, 0, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 240ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="#FFFFFF"
                  style={{
                    transform: "translateX(2px)",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                  aria-hidden="true"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </Box>

              {/* Bottom Video Controls Bar Overlay */}
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "14px 18px",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(10, 15, 17, 0.88) 100%)",
                  backdropFilter: "blur(6px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {/* Timeline Scrubber Bar */}
                <Box
                  style={{
                    width: "100%",
                    height: "4px",
                    borderRadius: "2px",
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    position: "relative",
                  }}
                >
                  <Box
                    style={{
                      width: "38%",
                      height: "100%",
                      borderRadius: "2px",
                      backgroundColor: "#3B82F6",
                    }}
                  />
                </Box>

                <Group justify="space-between" align="center" wrap="nowrap">
                  <Group gap={10} wrap="nowrap" align="center">
                    {/* Small Play Button */}
                    <Box
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="#FFFFFF"
                        style={{ transform: "translateX(1px)" }}
                        aria-hidden="true"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </Box>
                    <Text
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.74rem",
                        color: "rgba(255, 255, 255, 0.88)",
                      }}
                    >
                      0:58 / 2:45
                    </Text>
                  </Group>

                  <Group gap={10} wrap="nowrap" align="center">
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        backgroundColor: "rgba(255, 255, 255, 0.14)",
                        color: "#FFFFFF",
                      }}
                    >
                      1080p HD
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                  </Group>
                </Group>
              </Box>
            </Box>

            {/* Video Footer Caption */}
            <Box
              style={{
                backgroundColor: "#161D20",
                padding: "12px 18px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <Box>
                <Text
                  fw={700}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                    color: "#FFFFFF",
                    lineHeight: 1.25,
                  }}
                >
                  Product walkthrough
                </Text>
                <Text
                  size="xs"
                  style={{
                    color: "rgba(255, 255, 255, 0.68)",
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}
                >
                  Follow a report from submission to triage, fix deployment, and retest.
                </Text>
              </Box>

              <button
                type="button"
                className="btn-video-watch"
                onClick={() => setModalOpen(true)}
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
                <span>Watch full video (2:45)</span>
              </button>
            </Box>
          </Paper>
        </Box>

        {/* 3. Get Started with the Guides (Directly Below Video) */}
        <Box style={{ width: "100%" }}>
          {/* Header with Horizontal Divider */}
          <Box
            mb={{ base: "lg", md: 28 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              width: "100%",
            }}
          >
            <Title
              order={3}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.25rem, 2.6vw, 1.7rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.25,
                whiteSpace: "nowrap",
              }}
            >
              Get started with the guides.
            </Title>
            <Box
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--border-subtle, #E5E2DA)",
                minWidth: 40,
              }}
            />
          </Box>

          {/* 3-Column Responsive Grid of Guide Cards with Standardized Card Padding */}
          <Grid gap={{ base: "md", md: "lg" }} mb="xl">
            {GUIDE_ITEMS.map((guide) => (
              <Grid.Col key={guide.title} span={{ base: 12, md: 4 }}>
                <Link
                  href={guide.href}
                  style={{ textDecoration: "none", display: "block", height: "100%" }}
                >
                  <Paper
                    className="standard-card-padding landing-interactive-card"
                    withBorder
                    style={{
                      padding:
                        "clamp(12px, 2.5vw, 16px) clamp(10px, 2.5vw, 16px) 12px clamp(10px, 2.5vw, 16px)",
                      borderRadius: "12px",
                      backgroundColor: "var(--surface-card, #FFFFFF)",
                      borderColor: "var(--border-subtle, #E5E2DA)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <Stack gap="xs">
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        {/* Illuminated Document Icon */}
                        <Box
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "8px",
                            backgroundColor:
                              "var(--card-icon-bg, rgba(11, 46, 34, 0.07))",
                            border:
                              "1px solid var(--card-icon-border, rgba(11, 46, 34, 0.12))",
                            color: "var(--card-icon-color, #0B2E22)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {guide.icon}
                        </Box>

                        {/* Navigation Right Arrow */}
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "6px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-muted)",
                            backgroundColor: "var(--surface-subtle, #F8F7F3)",
                            flexShrink: 0,
                          }}
                        >
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
                        </span>
                      </Group>

                      <Box mt={4}>
                        <Text
                          fw={700}
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1rem",
                            color: "var(--text-primary)",
                            lineHeight: 1.3,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {guide.title}
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: "var(--text-secondary)",
                            marginTop: 4,
                            lineHeight: 1.45,
                          }}
                        >
                          {guide.description}
                        </Text>
                      </Box>
                    </Stack>
                  </Paper>
                </Link>
              </Grid.Col>
            ))}
          </Grid>

          {/* Centered Open Documentation Button with Strict 8px Radius */}
          <Box style={{ display: "flex", justifyContent: "center" }} mt="md">
            <Link
              href="/docs"
              style={{ textDecoration: "none" }}
            >
              <button
                type="button"
                className="btn-smooth btn-secondary"
                style={{
                  borderRadius: "8px",
                  padding: "0 1.75rem",
                  height: "44px",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>Open documentation</span>
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
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            </Link>
          </Box>
        </Box>
      </Container>

      {/* Interactive Walkthrough Modal Dialog */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <Group gap={8} align="center">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#10B981",
                display: "inline-block",
                boxShadow: "0 0 8px #10B981",
              }}
            />
            <Text fw={700} style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}>
              Caulvyn Walkthrough: Report BBT-0041 to Verified Fix
            </Text>
          </Group>
        }
        size="xl"
        centered
        radius="md"
        styles={{
          header: {
            backgroundColor: "var(--surface-card)",
            borderBottom: "1px solid var(--border-subtle)",
          },
          content: {
            backgroundColor: "var(--surface-card)",
          },
        }}
      >
        <Stack gap="md" pt="xs">
          <Box
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#0D1214",
            }}
          >
            <picture>
              <source
                srcSet="/hero-product-preview.webp"
                type="image/webp"
              />
              <img
                src="/hero-product-preview.png"
                alt="Product walkthrough simulation"
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </picture>

            <Box
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "16px",
                background: "linear-gradient(180deg, transparent 0%, rgba(10,15,17,0.92) 100%)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text size="sm" fw={600} style={{ color: "#FFFFFF" }}>
                Step 3 of 4: Researcher Retest & Evidence Verification
              </Text>
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  color: "#34D399",
                  fontSize: "0.74rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                PASS VERIFIED
              </span>
            </Box>
          </Box>

          <Text size="sm" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
            This walkthrough demonstrates how vulnerability reports transition through triage, fix deployment to production, and researcher verification in a single auditable thread without scattered communication.
          </Text>

          <Group justify="flex-end" pt="xs">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              style={{ borderRadius: "8px" }}
            >
              Close walkthrough
            </Button>
            <Link href="/workspace/new" style={{ textDecoration: "none" }}>
              <Button
                variant="filled"
                style={{
                  backgroundColor: "var(--color-primary)",
                  borderRadius: "8px",
                }}
              >
                Create test workspace
              </Button>
            </Link>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
