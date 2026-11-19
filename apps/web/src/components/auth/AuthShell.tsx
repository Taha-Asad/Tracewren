"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Group,
  Stack,
  Text,
  Badge,
} from "@mantine/core";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  visualBadge?: string;
  visualHeadline?: string;
  visualDescription?: string;
  maxWidth?: number;
}

export function AuthShell({
  children,
  title,
  subtitle,
  visualBadge = "Zero-Knowledge VDP",
  visualHeadline = "Verified remediation pipelines with zero plaintext exposure.",
  visualDescription = "Exploit payloads remain encrypted from researcher keystroke to defender terminal. RFC 9580 Curve25519 client-side cryptography guarantees the platform never touches plaintext.",
  maxWidth = 520,
}: AuthShellProps) {
  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "var(--canvas-bg)",
        transition: "background-color 200ms ease",
      }}
    >
      {/* 2-Column Responsive Grid */}
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          width: "100%",
          minHeight: "100vh",
        }}
        className="auth-split-grid"
      >
        {/* =========================================================================
            COLUMN 1: Visual & Editorial Brand Panel (Desktop-first, elegant gradient)
            ========================================================================= */}
        <Box
          className="auth-visual-column"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "none",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 48px",
            background: "linear-gradient(155deg, #051610 0%, #09261D 40%, #081C15 70%, #06110D 100%)",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#FFFFFF",
          }}
        >
          {/* Ambient Lighting & Micro-Grid Overlay */}
          <Box
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(circle at 15% 20%, rgba(34, 197, 94, 0.12) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(16, 185, 129, 0.10) 0%, transparent 50%)`,
              pointerEvents: "none",
            }}
          />
          <Box
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
              pointerEvents: "none",
            }}
          />

          {/* Top: Brand Header in Visual Column */}
          <Box style={{ position: "relative", zIndex: 2 }}>
            <Group justify="space-between" align="center">
              <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }}>
                <Group gap={10} align="center">
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: "rgba(34, 197, 94, 0.15)",
                      border: "1px solid rgba(34, 197, 94, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ADE80"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </Box>
                  <Text
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      color: "#FFFFFF",
                    }}
                  >
                    caulvyn
                  </Text>
                </Group>
              </Link>

              <Badge
                size="sm"
                variant="outline"
                style={{
                  color: "#4ADE80",
                  borderColor: "rgba(74, 222, 128, 0.3)",
                  backgroundColor: "rgba(74, 222, 128, 0.08)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {visualBadge}
              </Badge>
            </Group>
          </Box>

          {/* Center: Showcase Illustration & Telemetry Card */}
          <Box style={{ position: "relative", zIndex: 2, margin: "auto 0" }}>
            <Stack gap="xl">
              {/* Product Preview Card */}
              <Box
                style={{
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backgroundColor: "rgba(8, 28, 21, 0.65)",
                  backdropFilter: "blur(16px)",
                  padding: "16px",
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(74, 222, 128, 0.1)",
                }}
              >
                <Box
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 220,
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Image
                    src="/hero-product-preview.webp"
                    alt="Caulvyn Cryptographic Triage Pipeline"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                    style={{ objectFit: "cover", objectPosition: "top left" }}
                    priority
                  />
                </Box>

                {/* Telemetry Chips under Preview */}
                <Group justify="space-between" align="center" mt={12}>
                  <Group gap={6} align="center">
                    <Box
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#4ADE80",
                        boxShadow: "0 0 8px #4ADE80",
                      }}
                    />
                    <Text size="xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.75)" }}>
                      Curve25519 Active Keypair
                    </Text>
                  </Group>

                  <Text size="xs" style={{ fontFamily: "var(--font-mono)", color: "#4ADE80", fontWeight: 600 }}>
                    Deterministic FSM
                  </Text>
                </Group>
              </Box>

              {/* Editorial Message */}
              <Stack gap={10}>
                <Text
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    letterSpacing: "-0.02em",
                    color: "#FFFFFF",
                  }}
                >
                  {visualHeadline}
                </Text>
                <Text
                  size="sm"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: "rgba(255, 255, 255, 0.68)",
                    lineHeight: 1.6,
                    maxWidth: 460,
                  }}
                >
                  {visualDescription}
                </Text>
              </Stack>
            </Stack>
          </Box>

          {/* Bottom: Trust & Compliance Badges in Visual Column */}
          <Box style={{ position: "relative", zIndex: 2 }}>
            <Group gap="lg" align="center">
              <Group gap={6} align="center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <Text size="xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.7)" }}>
                  RFC 9580 v6
                </Text>
              </Group>

              <Box style={{ width: 1, height: 12, backgroundColor: "rgba(255, 255, 255, 0.15)" }} />

              <Group gap={6} align="center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <Text size="xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.7)" }}>
                  RFC 9116 Safe Harbor
                </Text>
              </Group>

              <Box style={{ width: 1, height: 12, backgroundColor: "rgba(255, 255, 255, 0.15)" }} />

              <Group gap={6} align="center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <Text size="xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.7)" }}>
                  Zero Plaintext
                </Text>
              </Group>
            </Group>
          </Box>
        </Box>

        {/* =========================================================================
            COLUMN 2: Interactive Form Panel
            ========================================================================= */}
        <Box
          className="auth-form-column"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px 20px 32px 20px",
            minHeight: "100vh",
            backgroundColor: "var(--canvas-bg)",
          }}
        >
          {/* Header Navigation in Form Column */}
          <Box style={{ width: "100%", maxWidth: "100%", marginBottom: 16 }}>
            <Group justify="space-between" align="center">
              {/* On mobile, show brand logo in form header */}
              <Box className="auth-mobile-logo">
                <BrandLogo size="md" withTagline={false} />
              </Box>

              <Group gap="sm" align="center" style={{ marginLeft: "auto" }}>
                <ThemeToggle size={34} />
                <Link
                  href="/"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--surface-card)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 150ms ease",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  <span>Back to home</span>
                </Link>
              </Group>
            </Group>
          </Box>

          {/* Form Content Centered */}
          <Box
            style={{
              width: "100%",
              maxWidth: `${maxWidth}px`,
              margin: "auto auto",
              padding: "16px 0",
            }}
          >
            {/* Title & Subtitle */}
            <Stack gap={6} mb={24}>
              <Text
                component="h1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                {title}
              </Text>
              <Text
                size="sm"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </Text>
            </Stack>

            {/* Elevated Form Card */}
            <Box
              style={{
                backgroundColor: "var(--surface-card)",
                borderRadius: "14px",
                border: "1px solid var(--border-subtle)",
                padding: "clamp(20px, 4vw, 32px)",
                boxShadow: "var(--shadow-elevated, 0 8px 30px rgba(24, 28, 25, 0.07))",
                transition: "background-color 200ms ease, border-color 200ms ease",
              }}
            >
              {children}
            </Box>
          </Box>

          {/* Mobile Footer Assurance (visible only when visual column is collapsed) */}
          <Box className="auth-mobile-footer" mt={24} style={{ display: "none" }}>
            <Group justify="center" gap="md" wrap="wrap">
              <Group gap={5} align="center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--heading-accent, #16654C)" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <Text size="xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  RFC 9580 Curve25519
                </Text>
              </Group>

              <Box style={{ width: 1, height: 12, backgroundColor: "var(--border-subtle)" }} />

              <Group gap={5} align="center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--heading-accent, #16654C)" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <Text size="xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  RFC 9116 Safe Harbor
                </Text>
              </Group>

              <Box style={{ width: 1, height: 12, backgroundColor: "var(--border-subtle)" }} />

              <Group gap={5} align="center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--heading-accent, #16654C)" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <Text size="xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  Zero Plaintext
                </Text>
              </Group>
            </Group>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
