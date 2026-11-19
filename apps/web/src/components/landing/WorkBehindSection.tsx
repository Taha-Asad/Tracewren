"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import {
  Box,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";

const SLICE_DATA: Record<
  string,
  { label: string; color: string; count: string; share: string; detail: string }
> = {
  verified: {
    label: "VERIFIED FIX",
    color: "#10B981",
    count: "27",
    share: "54%",
    detail: "Researcher confirmed",
  },
  pending: {
    label: "RETEST PENDING",
    color: "#F59E0B",
    count: "13",
    share: "26%",
    detail: "Awaiting confirmation",
  },
  deployed: {
    label: "FIX DEPLOYED",
    color: "#0284C7",
    count: "6",
    share: "12%",
    detail: "Production release v0.8.4",
  },
  triaged: {
    label: "UNDER TRIAGE",
    color: "#64748B",
    count: "4",
    share: "8%",
    detail: "Scope & severity review",
  },
};

export function WorkBehindSection() {
  const [activeSlice, setActiveSlice] = useState<string | null>(null);
  const [activeProgressTooltip, setActiveProgressTooltip] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 47.99em)");

  // Mobile & Outside Interaction Listener:
  // Single click opens, double click or clicking anywhere else closes it.
  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // If clicked inside any interactive slice, legend item, progress bar, or tooltip popover, do not dismiss here
      if (
        target.closest("[data-slice-trigger]") ||
        target.closest("[data-legend-trigger]") ||
        target.closest("[data-pill-trigger]") ||
        target.closest("[data-progress-trigger]") ||
        target.closest(".mantine-Tooltip-tooltip")
      ) {
        return;
      }

      // Clicked anywhere else: dismiss all active tooltips & active slice
      setActiveSlice(null);
      setActiveProgressTooltip(null);
    };

    document.addEventListener("click", handleOutsideInteraction);
    document.addEventListener("touchend", handleOutsideInteraction, { passive: true });

    return () => {
      document.removeEventListener("click", handleOutsideInteraction);
      document.removeEventListener("touchend", handleOutsideInteraction);
    };
  }, []);
  return (
    <Box
      component="section"
      id="work-behind-section"
      aria-labelledby="work-behind-heading"
      style={{
        width: "100%",
        backgroundColor: "var(--section-alt-bg, #F4EFE6)",
        color: "var(--text-primary)",
        borderTop: "1px solid var(--section-alt-border, #E8E3D8)",
        borderBottom: "1px solid var(--section-alt-border, #E8E3D8)",
        paddingTop: "clamp(3.5rem, 5.5vw, 5rem)",
        paddingBottom: "clamp(4rem, 6vw, 5.5rem)",
        transition: "background-color 200ms ease, border-color 200ms ease",
      }}
    >
      <Container
        size="1600px"
        px={{ base: "md", md: "xl" }}
        style={{ maxWidth: "1600px", width: "100%" }}
      >
        {/* Section Top Header: Headline + Explore Platform Link */}
        <Box
          mb={{ base: "xl", md: 36 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
            width: "100%",
          }}
        >
          <Title
            id="work-behind-heading"
            order={2}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            See the work behind every outcome.
          </Title>

          <Link
            href="/platform"
            className="link-accent"
            style={{
              color: "var(--link-accent, #0B2E22)",
            }}
          >
            <span style={{ color: "var(--link-accent, #0B2E22)" }}>
              Explore the platform
            </span>
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
        </Box>

        {/* 1. Main Report Progress Card (Bar Graph + Pie Chart with Standardized Card Padding) */}
        <Paper
          className="standard-card-padding"
          withBorder
          style={{
            padding: "clamp(12px, 2.5vw, 16px) clamp(10px, 2.5vw, 16px) 12px clamp(10px, 2.5vw, 16px)",
            borderRadius: "12px",
            backgroundColor: "var(--surface-card, #FFFFFF)",
            borderColor: "var(--border-subtle, #E5E2DA)",
            boxShadow:
              "0 4px 20px -4px rgba(24, 28, 25, 0.06), 0 1px 3px rgba(24, 28, 25, 0.03)",
            marginBottom: "2rem",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {/* Card Top Title Bar */}
          <Box
            pb="md"
            mb="lg"
            style={{
              borderBottom: "1px solid var(--border-subtle, #E5E2DA)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <Box>
              <Text
                fw={700}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.015em",
                }}
              >
                Report progress
              </Text>
              <Text
                size="xs"
                style={{ color: "var(--text-muted)", marginTop: "2px" }}
              >
                Illustrative workspace · Sample data
              </Text>
            </Box>

            {/* Chip with Pixel-Perfect Optical Center Alignment */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "0.72rem",
                fontWeight: 600,
                lineHeight: 1,
                backgroundColor: "var(--card-icon-bg, rgba(11, 46, 34, 0.07))",
                border:
                  "1px solid var(--card-icon-border, rgba(11, 46, 34, 0.12))",
                color: "var(--card-icon-color, #0B2E22)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
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
                Live evaluation telemetry
              </span>
            </span>
          </Box>

          {/* Two-Column Analytics Layout: Bar Graph + Vertical Line + Pie Chart */}
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem",
              width: "100%",
            }}
          >
            {/* Column 1: Bar Graph (Lifecycle Milestones) */}
            <Box
              style={{
                flex: "1 1 340px",
                minWidth: 0,
                maxWidth: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack gap="lg">
                <Text
                  size="sm"
                  fw={600}
                  style={{
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontSize: "0.74rem",
                  }}
                >
                  Vulnerability Lifecycle Milestones
                </Text>

                {/* Progress Bar 1: Triage Complete with Beautified Designed Tooltip */}
                <Tooltip
                  withArrow
                  position="top"
                  withinPortal={true}
                  disabled={!isMobile}
                  opened={Boolean(isMobile && activeProgressTooltip === 1)}
                  events={{ hover: true, focus: true, touch: true }}
                  styles={{
                    tooltip: {
                      backgroundColor: "rgba(10, 22, 19, 0.96)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      border: "1px solid rgba(255, 255, 255, 0.16)",
                      borderTop: "1.5px solid #10B981",
                      boxShadow:
                        "0 14px 34px -4px rgba(0, 0, 0, 0.65), 0 0 16px -2px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      whiteSpace: "nowrap",
                      zIndex: 10000,
                      maxWidth: "calc(100vw - 24px)",
                      boxSizing: "border-box",
                    },
                    arrow: {
                      borderTop: "1px solid rgba(255, 255, 255, 0.16)",
                      backgroundColor: "rgba(10, 22, 19, 0.96)",
                    },
                  }}
                  label={
                    <Box style={{ display: "flex", flexDirection: "column", gap: "4px", whiteSpace: "nowrap" }}>
                      <Group gap={6} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#10B981",
                            boxShadow: "0 0 8px #10B981",
                            flexShrink: 0,
                          }}
                        />
                        <Text
                          fw={700}
                          style={{
                            fontSize: "0.68rem",
                            color: "#34D399",
                            letterSpacing: "0.05em",
                            fontFamily: "var(--font-mono)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          TRIAGE COMPLETE
                        </Text>
                      </Group>
                      <Group gap={8} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                        <Text
                          fw={800}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.96rem",
                            color: "#FFFFFF",
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                          }}
                        >
                          48 / 50
                        </Text>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            fontFamily: "var(--font-mono)",
                            backgroundColor: "rgba(16, 185, 129, 0.22)",
                            color: "#34D399",
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                          }}
                        >
                          96%
                        </span>
                        <Text size="xs" style={{ color: "#CBD5E1", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                          · Mean 2.4h
                        </Text>
                      </Group>
                    </Box>
                  }
                >
                  <Box
                    data-progress-trigger="true"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActiveProgressTooltip(1)}
                    onMouseLeave={() => setActiveProgressTooltip(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProgressTooltip((prev) => (prev === 1 ? null : 1));
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setActiveProgressTooltip(null);
                    }}
                  >
                    <Group justify="space-between" mb={6} wrap="nowrap">
                      <Group gap={8} wrap="nowrap" align="center">
                        <Box
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            backgroundColor: "#10B981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </Box>
                        <Text
                          size="sm"
                          fw={600}
                          style={{ color: "var(--text-primary)" }}
                        >
                          Triage complete
                        </Text>
                      </Group>
                      <Text
                        size="xs"
                        fw={600}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        96% · 48/50
                      </Text>
                    </Group>

                    {/* Multi-Stage Visual Bar */}
                    <Box
                      style={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "var(--surface-subtle, #F0EDE6)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Box
                        style={{
                          width: "96%",
                          height: "100%",
                          backgroundColor: "#10B981",
                          borderRadius: 6,
                          transition: "width 400ms ease",
                        }}
                      />
                    </Box>
                    <Text
                      size="xs"
                      style={{
                        color: "var(--text-muted)",
                        marginTop: 4,
                        fontSize: "0.72rem",
                      }}
                    >
                      Mean triage time: 2.4 hours
                    </Text>
                  </Box>
                </Tooltip>

                {/* Progress Bar 2: Fix Deployed with Beautified Designed Tooltip */}
                <Tooltip
                  withArrow
                  position="top"
                  withinPortal={true}
                  disabled={!isMobile}
                  opened={Boolean(isMobile && activeProgressTooltip === 2)}
                  events={{ hover: true, focus: true, touch: true }}
                  styles={{
                    tooltip: {
                      backgroundColor: "rgba(10, 22, 19, 0.96)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      border: "1px solid rgba(255, 255, 255, 0.16)",
                      borderTop: "1.5px solid #0D9488",
                      boxShadow:
                        "0 14px 34px -4px rgba(0, 0, 0, 0.65), 0 0 16px -2px rgba(13, 148, 136, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      whiteSpace: "nowrap",
                      zIndex: 10000,
                      maxWidth: "calc(100vw - 24px)",
                      boxSizing: "border-box",
                    },
                    arrow: {
                      borderTop: "1px solid rgba(255, 255, 255, 0.16)",
                      backgroundColor: "rgba(10, 22, 19, 0.96)",
                    },
                  }}
                  label={
                    <Box style={{ display: "flex", flexDirection: "column", gap: "4px", whiteSpace: "nowrap" }}>
                      <Group gap={6} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#0D9488",
                            boxShadow: "0 0 8px #0D9488",
                            flexShrink: 0,
                          }}
                        />
                        <Text
                          fw={700}
                          style={{
                            fontSize: "0.68rem",
                            color: "#2DD4BF",
                            letterSpacing: "0.05em",
                            fontFamily: "var(--font-mono)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          FIX DEPLOYED
                        </Text>
                      </Group>
                      <Group gap={8} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                        <Text
                          fw={800}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.96rem",
                            color: "#FFFFFF",
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                          }}
                        >
                          41 / 50
                        </Text>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            fontFamily: "var(--font-mono)",
                            backgroundColor: "rgba(13, 148, 136, 0.22)",
                            color: "#2DD4BF",
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                          }}
                        >
                          82%
                        </span>
                        <Text size="xs" style={{ color: "#CBD5E1", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                          · Mean 1.8d
                        </Text>
                      </Group>
                    </Box>
                  }
                >
                  <Box
                    data-progress-trigger="true"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActiveProgressTooltip(2)}
                    onMouseLeave={() => setActiveProgressTooltip(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProgressTooltip((prev) => (prev === 2 ? null : 2));
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setActiveProgressTooltip(null);
                    }}
                  >
                    <Group justify="space-between" mb={6} wrap="nowrap">
                      <Group gap={8} wrap="nowrap" align="center">
                        <Box
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            backgroundColor: "#0D9488",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </Box>
                        <Text
                          size="sm"
                          fw={600}
                          style={{ color: "var(--text-primary)" }}
                        >
                          Fix deployed
                        </Text>
                      </Group>
                      <Text
                        size="xs"
                        fw={600}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        82% · 41/50
                      </Text>
                    </Group>

                    {/* Multi-Stage Visual Bar */}
                    <Box
                      style={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "var(--surface-subtle, #F0EDE6)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Box
                        style={{
                          width: "82%",
                          height: "100%",
                          backgroundColor: "#0D9488",
                          borderRadius: 6,
                          transition: "width 400ms ease",
                        }}
                      />
                    </Box>
                    <Text
                      size="xs"
                      style={{
                        color: "var(--text-muted)",
                        marginTop: 4,
                        fontSize: "0.72rem",
                      }}
                    >
                      Mean time to production deploy: 1.8 days
                    </Text>
                  </Box>
                </Tooltip>

                {/* Progress Bar 3: Verification Recorded with Beautified Designed Tooltip */}
                <Tooltip
                  withArrow
                  position="top"
                  withinPortal={true}
                  disabled={!isMobile}
                  opened={Boolean(isMobile && activeProgressTooltip === 3)}
                  events={{ hover: true, focus: true, touch: true }}
                  styles={{
                    tooltip: {
                      backgroundColor: "rgba(10, 22, 19, 0.96)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      border: "1px solid rgba(255, 255, 255, 0.16)",
                      borderTop: "1.5px solid #0284C7",
                      boxShadow:
                        "0 14px 34px -4px rgba(0, 0, 0, 0.65), 0 0 16px -2px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      whiteSpace: "nowrap",
                      zIndex: 10000,
                      maxWidth: "calc(100vw - 24px)",
                      boxSizing: "border-box",
                    },
                    arrow: {
                      borderTop: "1px solid rgba(255, 255, 255, 0.16)",
                      backgroundColor: "rgba(10, 22, 19, 0.96)",
                    },
                  }}
                  label={
                    <Box style={{ display: "flex", flexDirection: "column", gap: "4px", whiteSpace: "nowrap" }}>
                      <Group gap={6} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#0284C7",
                            boxShadow: "0 0 8px #0284C7",
                            flexShrink: 0,
                          }}
                        />
                        <Text
                          fw={700}
                          style={{
                            fontSize: "0.68rem",
                            color: "#38BDF8",
                            letterSpacing: "0.05em",
                            fontFamily: "var(--font-mono)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          VERIFICATION RECORDED
                        </Text>
                      </Group>
                      <Group gap={8} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                        <Text
                          fw={800}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.96rem",
                            color: "#FFFFFF",
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                          }}
                        >
                          34 / 50
                        </Text>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            fontFamily: "var(--font-mono)",
                            backgroundColor: "rgba(2, 132, 199, 0.22)",
                            color: "#38BDF8",
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                          }}
                        >
                          68%
                        </span>
                        <Text size="xs" style={{ color: "#CBD5E1", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                          · 0 regressions
                        </Text>
                      </Group>
                    </Box>
                  }
                >
                  <Box
                    data-progress-trigger="true"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActiveProgressTooltip(3)}
                    onMouseLeave={() => setActiveProgressTooltip(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProgressTooltip((prev) => (prev === 3 ? null : 3));
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setActiveProgressTooltip(null);
                    }}
                  >
                    <Group justify="space-between" mb={6} wrap="nowrap">
                      <Group gap={8} wrap="nowrap" align="center">
                        <Box
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            backgroundColor: "#0284C7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </Box>
                        <Text
                          size="sm"
                          fw={600}
                          style={{ color: "var(--text-primary)" }}
                        >
                          Verification recorded
                        </Text>
                      </Group>
                      <Text
                        size="xs"
                        fw={600}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        68% · 34/50
                      </Text>
                    </Group>

                    {/* Multi-Stage Visual Bar */}
                    <Box
                      style={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "var(--surface-subtle, #F0EDE6)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Box
                        style={{
                          width: "68%",
                          height: "100%",
                          backgroundColor: "#0284C7",
                          borderRadius: 6,
                          transition: "width 400ms ease",
                        }}
                      />
                    </Box>
                    <Text
                      size="xs"
                      style={{
                        color: "var(--text-muted)",
                        marginTop: 4,
                        fontSize: "0.72rem",
                      }}
                    >
                      Researcher retest outcome documented
                    </Text>
                  </Box>
                </Tooltip>
              </Stack>

              <Text
                size="xs"
                style={{
                  color: "var(--text-muted)",
                  marginTop: "1.25rem",
                  fontSize: "0.78rem",
                  fontStyle: "italic",
                }}
              >
                Deployment and verification are tracked separately.
              </Text>
            </Box>

            {/* Vertical HR Line (Desktop) */}
            <Box
              visibleFrom="md"
              style={{
                width: "1px",
                backgroundColor: "var(--border-subtle, #E5E2DA)",
                margin: "0 1.5rem",
                alignSelf: "stretch",
                flexShrink: 0,
              }}
            />

            {/* Horizontal HR Line (Mobile fallback) */}
            <Box
              hiddenFrom="md"
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "var(--border-subtle, #E5E2DA)",
                margin: "1.25rem 0",
              }}
            />

            {/* Column 2: Pie / Donut Chart Graph with Per-Slice Concise Tooltips */}
            <Box
              style={{
                flex: "1 1 300px",
                minWidth: 0,
                maxWidth: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                size="sm"
                fw={600}
                style={{
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontSize: "0.74rem",
                  alignSelf: "flex-start",
                  marginBottom: "0.6rem",
                }}
              >
                Findings by Verification Status
              </Text>

              {/* Dynamic Designed Status Pill (Updates with exact concise data per hovered slice) */}
              <Box
                data-pill-trigger="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlice(null);
                }}
                style={{
                  width: "100%",
                  minHeight: "44px",
                  borderRadius: "8px",
                  backgroundColor: activeSlice
                    ? "rgba(10, 22, 19, 0.96)"
                    : "var(--surface-subtle, #F8F7F3)",
                  backdropFilter: activeSlice ? "blur(14px)" : "none",
                  WebkitBackdropFilter: activeSlice ? "blur(14px)" : "none",
                  border: activeSlice
                    ? `1px solid ${SLICE_DATA[activeSlice].color}`
                    : "1px solid var(--border-subtle, #E5E2DA)",
                  borderTop: activeSlice
                    ? `1.5px solid ${SLICE_DATA[activeSlice].color}`
                    : "1px solid var(--border-subtle, #E5E2DA)",
                  padding: "7px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 180ms ease",
                  marginBottom: "0.85rem",
                  cursor: activeSlice ? "pointer" : "default",
                  boxShadow: activeSlice
                    ? `0 10px 28px -4px rgba(0,0,0,0.4), 0 0 16px -2px ${SLICE_DATA[activeSlice].color}40, inset 0 1px 0 rgba(255,255,255,0.12)`
                    : "none",
                }}
              >
                {activeSlice ? (
                  <Group
                    justify="space-between"
                    align="center"
                    style={{ width: "100%" }}
                    wrap="nowrap"
                  >
                    <Group gap={6} wrap="nowrap" align="center" style={{ flexShrink: 0, minWidth: 0 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: SLICE_DATA[activeSlice].color,
                          boxShadow: `0 0 8px ${SLICE_DATA[activeSlice].color}`,
                          flexShrink: 0,
                        }}
                      />
                      <Text
                        fw={700}
                        style={{
                          fontSize: "0.72rem",
                          color: SLICE_DATA[activeSlice].color,
                          letterSpacing: "0.04em",
                          fontFamily: "var(--font-mono)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {SLICE_DATA[activeSlice].label.toUpperCase()}
                      </Text>
                    </Group>
                    <Group gap={6} wrap="nowrap" align="center" style={{ flexShrink: 0 }}>
                      <Text
                        fw={800}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.88rem",
                          color: "#FFFFFF",
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {SLICE_DATA[activeSlice].count} / 50
                      </Text>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-mono)",
                          backgroundColor: `${SLICE_DATA[activeSlice].color}26`,
                          color: SLICE_DATA[activeSlice].color,
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {SLICE_DATA[activeSlice].share}
                      </span>
                      {/* Secondary detail string visible on tablet and desktop, hidden on xs (320-400px) */}
                      <Text
                        size="xs"
                        className="mantine-visible-from-sm"
                        style={{ color: "#CBD5E1", fontSize: "0.7rem", whiteSpace: "nowrap" }}
                      >
                        · {SLICE_DATA[activeSlice].detail}
                      </Text>
                    </Group>
                  </Group>
                ) : (
                  <Group
                    justify="space-between"
                    align="center"
                    style={{ width: "100%" }}
                    wrap="nowrap"
                  >
                    <Group gap={6} wrap="nowrap" align="center" style={{ minWidth: 0, flexShrink: 1 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "var(--text-muted)",
                          opacity: 0.6,
                          flexShrink: 0,
                        }}
                      />
                      {/* Desktop / tablet instruction */}
                      <Text
                        size="xs"
                        fw={500}
                        className="mantine-visible-from-sm"
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.74rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Hover slice or legend for exact metrics
                      </Text>
                      {/* Mobile / xs instruction (320px-400px) - never halves or wraps */}
                      <Text
                        size="xs"
                        fw={500}
                        className="mantine-hidden-from-sm"
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.72rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Hover / tap for metrics
                      </Text>
                    </Group>
                    {/* Desktop / tablet badge */}
                    <span
                      className="mantine-visible-from-sm"
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        backgroundColor: "var(--surface-subtle, #F0EDE6)",
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      50 Findings Total
                    </span>
                    {/* Mobile / xs badge (320px-400px) - clean and compact */}
                    <span
                      className="mantine-hidden-from-sm"
                      style={{
                        display: "inline-block",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        backgroundColor: "var(--surface-subtle, #F0EDE6)",
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      50 Total
                    </span>
                  </Group>
                )}
              </Box>

              {/* Vector SVG Donut Chart with Independent Interactive Slices */}
              <Box
                style={{
                  position: "relative",
                  width: 170,
                  height: 170,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="170"
                  height="170"
                  viewBox="0 0 170 170"
                  style={{ transform: "rotate(-90deg)" }}
                  aria-hidden="true"
                >
                  {/* Background Track */}
                  <circle
                    cx="85"
                    cy="85"
                    r="62"
                    fill="none"
                    stroke="var(--surface-subtle, #F0EDE6)"
                    strokeWidth="20"
                  />

                  {/* Slice 1: Verified Fix (54%) */}
                  <circle
                    data-slice-trigger="true"
                    cx="85"
                    cy="85"
                    r="62"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={activeSlice === "verified" ? 25 : 20}
                    opacity={
                      activeSlice && activeSlice !== "verified" ? 0.35 : 1
                    }
                    strokeDasharray="210.5 389.5"
                    strokeDashoffset="0"
                    style={{
                      pointerEvents: "stroke",
                      cursor: "pointer",
                      transition: "stroke-width 150ms ease, opacity 150ms ease",
                    }}
                    onMouseEnter={() => setActiveSlice("verified")}
                    onMouseLeave={() => setActiveSlice(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlice((prev) => (prev === "verified" ? null : "verified"));
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setActiveSlice(null);
                    }}
                  />

                  {/* Slice 2: Retest Pending (26%) */}
                  <circle
                    data-slice-trigger="true"
                    cx="85"
                    cy="85"
                    r="62"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth={activeSlice === "pending" ? 25 : 20}
                    opacity={
                      activeSlice && activeSlice !== "pending" ? 0.35 : 1
                    }
                    strokeDasharray="101.3 389.5"
                    strokeDashoffset="-210.5"
                    style={{
                      pointerEvents: "stroke",
                      cursor: "pointer",
                      transition: "stroke-width 150ms ease, opacity 150ms ease",
                    }}
                    onMouseEnter={() => setActiveSlice("pending")}
                    onMouseLeave={() => setActiveSlice(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlice((prev) => (prev === "pending" ? null : "pending"));
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setActiveSlice(null);
                    }}
                  />

                  {/* Slice 3: Fix Deployed (12%) */}
                  <circle
                    data-slice-trigger="true"
                    cx="85"
                    cy="85"
                    r="62"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth={activeSlice === "deployed" ? 25 : 20}
                    opacity={
                      activeSlice && activeSlice !== "deployed" ? 0.35 : 1
                    }
                    strokeDasharray="46.7 389.5"
                    strokeDashoffset="-311.8"
                    style={{
                      pointerEvents: "stroke",
                      cursor: "pointer",
                      transition: "stroke-width 150ms ease, opacity 150ms ease",
                    }}
                    onMouseEnter={() => setActiveSlice("deployed")}
                    onMouseLeave={() => setActiveSlice(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlice((prev) => (prev === "deployed" ? null : "deployed"));
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setActiveSlice(null);
                    }}
                  />

                  {/* Slice 4: Under Triage (8%) */}
                  <circle
                    data-slice-trigger="true"
                    cx="85"
                    cy="85"
                    r="62"
                    fill="none"
                    stroke="#64748B"
                    strokeWidth={activeSlice === "triaged" ? 25 : 20}
                    opacity={
                      activeSlice && activeSlice !== "triaged" ? 0.35 : 1
                    }
                    strokeDasharray="31.2 389.5"
                    strokeDashoffset="-358.5"
                    style={{
                      pointerEvents: "stroke",
                      cursor: "pointer",
                      transition: "stroke-width 150ms ease, opacity 150ms ease",
                    }}
                    onMouseEnter={() => setActiveSlice("triaged")}
                    onMouseLeave={() => setActiveSlice(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlice((prev) => (prev === "triaged" ? null : "triaged"));
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setActiveSlice(null);
                    }}
                  />
                </svg>

                {/* Donut Chart Center Text (Dynamic per active slice) */}
                <Box
                  style={{
                    position: "absolute",
                    textAlign: "center",
                    userSelect: "none",
                    pointerEvents: "none",
                    transition: "all 150ms ease",
                  }}
                >
                  <Text
                    fw={800}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.75rem",
                      lineHeight: 1,
                      color: activeSlice
                        ? SLICE_DATA[activeSlice].color
                        : "var(--text-primary)",
                      letterSpacing: "-0.03em",
                      transition: "color 150ms ease",
                    }}
                  >
                    {activeSlice ? SLICE_DATA[activeSlice].count : "50"}
                  </Text>
                  <Text
                    size="xs"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      marginTop: 2,
                    }}
                  >
                    {activeSlice
                      ? `${SLICE_DATA[activeSlice].share} findings`
                      : "Total findings"}
                  </Text>
                </Box>
              </Box>

              {/* Chart Legend with Concise Designed Tooltips and Responsive Grid */}
              <Grid gap="xs" mt="md" style={{ width: "100%" }}>
                {/* Legend Item 1: Verified Fix */}
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Tooltip
                    withArrow
                    position="top"
                    withinPortal={true}
                    disabled={!isMobile}
                    opened={Boolean(isMobile && activeSlice === "verified")}
                    events={{ hover: true, focus: true, touch: true }}
                    styles={{
                      tooltip: {
                        backgroundColor: "rgba(10, 22, 19, 0.96)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderTop: "1.5px solid #10B981",
                        boxShadow:
                          "0 14px 34px -4px rgba(0, 0, 0, 0.65), 0 0 16px -2px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                        borderRadius: 8,
                        padding: "8px 12px",
                        whiteSpace: "nowrap",
                        zIndex: 10000,
                        maxWidth: "calc(100vw - 24px)",
                        boxSizing: "border-box",
                      },
                      arrow: {
                        borderTop: "1px solid rgba(255, 255, 255, 0.16)",
                        backgroundColor: "rgba(10, 22, 19, 0.96)",
                      },
                    }}
                    label={
                      <Box style={{ display: "flex", flexDirection: "column", gap: "4px", whiteSpace: "nowrap" }}>
                        <Group gap={6} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "#10B981",
                              boxShadow: "0 0 8px #10B981",
                              flexShrink: 0,
                            }}
                          />
                          <Text
                            fw={700}
                            style={{
                              fontSize: "0.68rem",
                              color: "#34D399",
                              letterSpacing: "0.05em",
                              fontFamily: "var(--font-mono)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            VERIFIED FIX
                          </Text>
                        </Group>
                        <Group gap={8} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                          <Text
                            fw={800}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.96rem",
                              color: "#FFFFFF",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            27 / 50
                          </Text>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              fontFamily: "var(--font-mono)",
                              backgroundColor: "rgba(16, 185, 129, 0.22)",
                              color: "#34D399",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            54%
                          </span>
                          <Text size="xs" style={{ color: "#CBD5E1", fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                            · Signed retest
                          </Text>
                        </Group>
                      </Box>
                    }
                  >
                    <Group
                      data-legend-trigger="verified"
                      gap={8}
                      wrap="nowrap"
                      align="center"
                      style={{
                        cursor: "pointer",
                        padding: "4px 6px",
                        borderRadius: 6,
                        backgroundColor:
                          activeSlice === "verified"
                            ? "var(--surface-subtle, #F0EDE6)"
                            : "transparent",
                        transition: "background-color 150ms ease",
                      }}
                      onMouseEnter={() => setActiveSlice("verified")}
                      onMouseLeave={() => setActiveSlice(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlice((prev) => (prev === "verified" ? null : "verified"));
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setActiveSlice(null);
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#10B981",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                        aria-hidden="true"
                      />
                      <Text
                        size="xs"
                        style={{
                          color: "var(--text-primary)",
                          lineHeight: 1.2,
                          fontWeight: activeSlice === "verified" ? 700 : 500,
                        }}
                      >
                        Verified fix (54%)
                      </Text>
                    </Group>
                  </Tooltip>
                </Grid.Col>

                {/* Legend Item 2: Retest Pending */}
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Tooltip
                    withArrow
                    position="top"
                    withinPortal={true}
                    disabled={!isMobile}
                    opened={Boolean(isMobile && activeSlice === "pending")}
                    events={{ hover: true, focus: true, touch: true }}
                    styles={{
                      tooltip: {
                        backgroundColor: "rgba(10, 22, 19, 0.96)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderTop: "1.5px solid #F59E0B",
                        boxShadow:
                          "0 14px 34px -4px rgba(0, 0, 0, 0.65), 0 0 16px -2px rgba(245, 158, 11, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                        borderRadius: 8,
                        padding: "8px 12px",
                        whiteSpace: "nowrap",
                        zIndex: 10000,
                        maxWidth: "calc(100vw - 24px)",
                        boxSizing: "border-box",
                      },
                      arrow: {
                        borderTop: "1px solid rgba(255, 255, 255, 0.16)",
                        backgroundColor: "rgba(10, 22, 19, 0.96)",
                      },
                    }}
                    label={
                      <Box style={{ display: "flex", flexDirection: "column", gap: "4px", whiteSpace: "nowrap" }}>
                        <Group gap={6} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "#F59E0B",
                              boxShadow: "0 0 8px #F59E0B",
                              flexShrink: 0,
                            }}
                          />
                          <Text
                            fw={700}
                            style={{
                              fontSize: "0.68rem",
                              color: "#FBBF24",
                              letterSpacing: "0.05em",
                              fontFamily: "var(--font-mono)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            RETEST PENDING
                          </Text>
                        </Group>
                        <Group gap={8} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                          <Text
                            fw={800}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.96rem",
                              color: "#FFFFFF",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            13 / 50
                          </Text>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              fontFamily: "var(--font-mono)",
                              backgroundColor: "rgba(245, 158, 11, 0.22)",
                              color: "#FBBF24",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            26%
                          </span>
                          <Text size="xs" style={{ color: "#CBD5E1", fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                            · Awaiting retest
                          </Text>
                        </Group>
                      </Box>
                    }
                  >
                    <Group
                      data-legend-trigger="pending"
                      gap={8}
                      wrap="nowrap"
                      align="center"
                      style={{
                        cursor: "pointer",
                        padding: "4px 6px",
                        borderRadius: 6,
                        backgroundColor:
                          activeSlice === "pending"
                            ? "var(--surface-subtle, #F0EDE6)"
                            : "transparent",
                        transition: "background-color 150ms ease",
                      }}
                      onMouseEnter={() => setActiveSlice("pending")}
                      onMouseLeave={() => setActiveSlice(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlice((prev) => (prev === "pending" ? null : "pending"));
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setActiveSlice(null);
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#F59E0B",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                        aria-hidden="true"
                      />
                      <Text
                        size="xs"
                        style={{
                          color: "var(--text-primary)",
                          lineHeight: 1.2,
                          fontWeight: activeSlice === "pending" ? 700 : 500,
                        }}
                      >
                        Retest pending (26%)
                      </Text>
                    </Group>
                  </Tooltip>
                </Grid.Col>

                {/* Legend Item 3: Fix Deployed */}
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Tooltip
                    withArrow
                    position="top"
                    withinPortal={true}
                    disabled={!isMobile}
                    opened={Boolean(isMobile && activeSlice === "deployed")}
                    events={{ hover: true, focus: true, touch: true }}
                    styles={{
                      tooltip: {
                        backgroundColor: "rgba(10, 22, 19, 0.96)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderTop: "1.5px solid #0284C7",
                        boxShadow:
                          "0 14px 34px -4px rgba(0, 0, 0, 0.65), 0 0 16px -2px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                        borderRadius: 8,
                        padding: "8px 12px",
                        whiteSpace: "nowrap",
                        zIndex: 10000,
                        maxWidth: "calc(100vw - 24px)",
                        boxSizing: "border-box",
                      },
                      arrow: {
                        borderTop: "1px solid rgba(255, 255, 255, 0.16)",
                        backgroundColor: "rgba(10, 22, 19, 0.96)",
                      },
                    }}
                    label={
                      <Box style={{ display: "flex", flexDirection: "column", gap: "4px", whiteSpace: "nowrap" }}>
                        <Group gap={6} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "#0284C7",
                              boxShadow: "0 0 8px #0284C7",
                              flexShrink: 0,
                            }}
                          />
                          <Text
                            fw={700}
                            style={{
                              fontSize: "0.68rem",
                              color: "#38BDF8",
                              letterSpacing: "0.05em",
                              fontFamily: "var(--font-mono)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            FIX DEPLOYED
                          </Text>
                        </Group>
                        <Group gap={8} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                          <Text
                            fw={800}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.96rem",
                              color: "#FFFFFF",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            6 / 50
                          </Text>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              fontFamily: "var(--font-mono)",
                              backgroundColor: "rgba(2, 132, 199, 0.22)",
                              color: "#38BDF8",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            12%
                          </span>
                          <Text size="xs" style={{ color: "#CBD5E1", fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                            · Release v0.8.4
                          </Text>
                        </Group>
                      </Box>
                    }
                  >
                    <Group
                      data-legend-trigger="deployed"
                      gap={8}
                      wrap="nowrap"
                      align="center"
                      style={{
                        cursor: "pointer",
                        padding: "4px 6px",
                        borderRadius: 6,
                        backgroundColor:
                          activeSlice === "deployed"
                            ? "var(--surface-subtle, #F0EDE6)"
                            : "transparent",
                        transition: "background-color 150ms ease",
                      }}
                      onMouseEnter={() => setActiveSlice("deployed")}
                      onMouseLeave={() => setActiveSlice(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlice((prev) => (prev === "deployed" ? null : "deployed"));
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setActiveSlice(null);
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#0284C7",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                        aria-hidden="true"
                      />
                      <Text
                        size="xs"
                        style={{
                          color: "var(--text-primary)",
                          lineHeight: 1.2,
                          fontWeight: activeSlice === "deployed" ? 700 : 500,
                        }}
                      >
                        Deployed (12%)
                      </Text>
                    </Group>
                  </Tooltip>
                </Grid.Col>

                {/* Legend Item 4: Under Triage */}
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Tooltip
                    withArrow
                    position="top"
                    withinPortal={true}
                    disabled={!isMobile}
                    opened={Boolean(isMobile && activeSlice === "triaged")}
                    events={{ hover: true, focus: true, touch: true }}
                    styles={{
                      tooltip: {
                        backgroundColor: "rgba(10, 22, 19, 0.96)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        border: "1px solid rgba(255, 255, 255, 0.16)",
                        borderTop: "1.5px solid #64748B",
                        boxShadow:
                          "0 14px 34px -4px rgba(0, 0, 0, 0.65), 0 0 16px -2px rgba(100, 116, 139, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                        borderRadius: 8,
                        padding: "8px 12px",
                        whiteSpace: "nowrap",
                        zIndex: 10000,
                        maxWidth: "calc(100vw - 24px)",
                        boxSizing: "border-box",
                      },
                      arrow: {
                        borderTop: "1px solid rgba(255, 255, 255, 0.16)",
                        backgroundColor: "rgba(10, 22, 19, 0.96)",
                      },
                    }}
                    label={
                      <Box style={{ display: "flex", flexDirection: "column", gap: "4px", whiteSpace: "nowrap" }}>
                        <Group gap={6} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "#64748B",
                              boxShadow: "0 0 8px #64748B",
                              flexShrink: 0,
                            }}
                          />
                          <Text
                            fw={700}
                            style={{
                              fontSize: "0.68rem",
                              color: "#CBD5E1",
                              letterSpacing: "0.05em",
                              fontFamily: "var(--font-mono)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            UNDER TRIAGE
                          </Text>
                        </Group>
                        <Group gap={8} wrap="nowrap" align="center" style={{ whiteSpace: "nowrap" }}>
                          <Text
                            fw={800}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.96rem",
                              color: "#FFFFFF",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            4 / 50
                          </Text>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              fontFamily: "var(--font-mono)",
                              backgroundColor: "rgba(100, 116, 139, 0.22)",
                              color: "#CBD5E1",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            8%
                          </span>
                          <Text size="xs" style={{ color: "#CBD5E1", fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                            · Intake queue
                          </Text>
                        </Group>
                      </Box>
                    }
                  >
                    <Group
                      data-legend-trigger="triaged"
                      gap={8}
                      wrap="nowrap"
                      align="center"
                      style={{
                        cursor: "pointer",
                        padding: "4px 6px",
                        borderRadius: 6,
                        backgroundColor:
                          activeSlice === "triaged"
                            ? "var(--surface-subtle, #F0EDE6)"
                            : "transparent",
                        transition: "background-color 150ms ease",
                      }}
                      onMouseEnter={() => setActiveSlice("triaged")}
                      onMouseLeave={() => setActiveSlice(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlice((prev) => (prev === "triaged" ? null : "triaged"));
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setActiveSlice(null);
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#64748B",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                        aria-hidden="true"
                      />
                      <Text
                        size="xs"
                        style={{
                          color: "var(--text-primary)",
                          lineHeight: 1.2,
                          fontWeight: activeSlice === "triaged" ? 700 : 500,
                        }}
                      >
                        Triaged (8%)
                      </Text>
                    </Group>
                  </Tooltip>
                </Grid.Col>
              </Grid>
            </Box>
          </Box>
        </Paper>

        {/* 2. Three Supporting Sub-Cards (Program Scope, Report Evidence, Verification Record) */}
        <Grid gap={{ base: "md", md: "lg" }}>
          {/* Card 1: Program Scope with Standardized Card Padding */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              className="standard-card-padding"
              withBorder
              style={{
                padding: "clamp(12px, 2.5vw, 16px) clamp(10px, 2.5vw, 16px) 12px clamp(10px, 2.5vw, 16px)",
                borderRadius: "12px",
                backgroundColor: "var(--surface-card, #FFFFFF)",
                borderColor: "var(--border-subtle, #E5E2DA)",
                height: "100%",
                boxShadow: "0 1px 3px rgba(24, 28, 25, 0.04)",
              }}
            >
              <Stack gap="sm">
                <Text
                  fw={700}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.98rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Program scope
                </Text>
                <Text
                  size="xs"
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.45,
                  }}
                >
                  Define which systems and assets are in scope for reporting.
                </Text>

                <Box
                  pt="xs"
                  style={{
                    borderTop: "1px solid var(--border-subtle, #E5E2DA)",
                  }}
                >
                  <Stack gap={8}>
                    {[
                      { name: "Northstar Labs", status: "Active" },
                      { name: "Atlas App", status: "Active" },
                      { name: "Helix Services", status: "Active" },
                    ].map((item) => (
                      <Group
                        key={item.name}
                        justify="space-between"
                        wrap="nowrap"
                      >
                        <Text
                          size="xs"
                          fw={500}
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.name}
                        </Text>
                        <span
                          className="status-badge-active"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            lineHeight: 1,
                            color: "var(--badge-success-text, #175C34)",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "#10B981",
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
                              color: "var(--badge-success-text, #175C34)",
                            }}
                          >
                            {item.status}
                          </span>
                        </span>
                      </Group>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Card 2: Report Evidence with Standardized Card Padding */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              className="standard-card-padding"
              withBorder
              style={{
                padding: "clamp(12px, 2.5vw, 16px) clamp(10px, 2.5vw, 16px) 10px clamp(10px, 2.5vw, 16px)",
                borderRadius: "12px",
                backgroundColor: "var(--surface-card, #FFFFFF)",
                borderColor: "var(--border-subtle, #E5E2DA)",
                height: "100%",
                boxShadow: "0 1px 3px rgba(24, 28, 25, 0.04)",
              }}
            >
              <Stack gap="sm">
                <Text
                  fw={700}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.98rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Report evidence
                </Text>
                <Text
                  size="xs"
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.45,
                  }}
                >
                  Review the files and details that demonstrate the issue.
                </Text>

                <Box
                  pt="xs"
                  style={{
                    borderTop: "1px solid var(--border-subtle, #E5E2DA)",
                  }}
                >
                  <Stack gap={8}>
                    {[
                      {
                        name: "evidence-request.txt",
                        size: "4 KB · text/plain",
                        href: "/evidence-request.txt",
                      },
                      {
                        name: "response-comparison.txt",
                        size: "2 KB · text/plain",
                        href: "/response-comparison.txt",
                      },
                    ].map((file) => (
                      <a
                        key={file.name}
                        href={file.href}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interactive-file-row"
                      >
                        <Group gap={8} wrap="nowrap" style={{ minWidth: 0 }}>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              color: "var(--text-muted)",
                              flexShrink: 0,
                            }}
                            aria-hidden="true"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <Box style={{ minWidth: 0 }}>
                            <Text
                              size="xs"
                              fw={600}
                              style={{
                                color: "var(--text-primary)",
                                fontFamily: "var(--font-mono)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {file.name}
                            </Text>
                            <Text
                              size="xs"
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.68rem",
                              }}
                            >
                              {file.size}
                            </Text>
                          </Box>
                        </Group>

                        <span
                          className="download-icon-pill"
                          title={`Download ${file.name}`}
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
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </span>
                      </a>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Card 3: Verification Record with Standardized Card Padding */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              className="standard-card-padding"
              withBorder
              style={{
                padding: "clamp(12px, 2.5vw, 16px) clamp(10px, 2.5vw, 16px) 10px clamp(10px, 2.5vw, 16px)",
                borderRadius: "12px",
                backgroundColor: "var(--surface-card, #FFFFFF)",
                borderColor: "var(--border-subtle, #E5E2DA)",
                height: "100%",
                boxShadow: "0 1px 3px rgba(24, 28, 25, 0.04)",
              }}
            >
              <Stack gap="sm">
                <Text
                  fw={700}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.98rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Verification record
                </Text>
                <Text
                  size="xs"
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.45,
                  }}
                >
                  Follow the remediation, retest request, and current status in
                  one place.
                </Text>

                <Box
                  pt="xs"
                  style={{
                    borderTop: "1px solid var(--border-subtle, #E5E2DA)",
                  }}
                >
                  <Stack gap={8}>
                    <Group gap={8} wrap="nowrap" align="center">
                      <Box
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          backgroundColor: "#10B981",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </Box>
                      <Box>
                        <Text
                          size="xs"
                          fw={600}
                          style={{ color: "var(--text-primary)" }}
                        >
                          Fix deployed to production (v0.8.4)
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.68rem",
                          }}
                        >
                          by Sarah Chen · 19 Oct 2026
                        </Text>
                      </Box>
                    </Group>

                    <Group gap={8} wrap="nowrap" align="center">
                      <Box
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          backgroundColor: "#0284C7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </Box>
                      <Box>
                        <Text
                          size="xs"
                          fw={600}
                          style={{ color: "var(--text-primary)" }}
                        >
                          Retest pending
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.68rem",
                          }}
                        >
                          Waiting for researcher retest outcome
                        </Text>
                      </Box>
                    </Group>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
