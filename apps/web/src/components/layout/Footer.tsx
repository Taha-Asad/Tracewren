"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { project } from "@/lib/project";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Box
      component="footer"
      id="colophon"
      style={{
        backgroundColor: "var(--surface-subtle)",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
        marginTop: "auto",
        paddingTop: "clamp(3.5rem, 5vw, 4.5rem)",
        paddingBottom: "2.5rem",
        transition: "background-color 200ms ease, border-color 200ms ease",
      }}
    >
      <Container
        size="1600px"
        px={{ base: "md", md: "xl" }}
        style={{ maxWidth: "1600px", width: "100%" }}
      >
        <Grid gap={{ base: "xl", md: 36, lg: 44 }}>
          {/* Column 1: Identity & Proposition */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="xs">
              <BrandLogo size="lg" />

              <Text
                size="xs"
                style={{
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "-0.01em",
                  marginTop: "2px",
                }}
              >
                A toolkit by Wreckwright Development.
              </Text>

              <Text
                size="sm"
                style={{
                  maxWidth: 380,
                  lineHeight: 1.6,
                  marginTop: "0.25rem",
                  fontFamily: "var(--font-sans)",
                  color: "var(--text-secondary)",
                }}
              >
                {project.tagline}. High-assurance vulnerability disclosure with
                client-side cryptographic isolation and verifiable remediation proofs.
              </Text>

              <Group gap="xs" mt="xs">
                <span
                  className="badge badge-success"
                  style={{ fontSize: "0.75rem" }}
                >
                  RFC 9116 Compliant
                </span>
                <span
                  className="badge badge-pending"
                  style={{ fontSize: "0.75rem" }}
                >
                  CVSS v3.1 Engine
                </span>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Column 2: Product */}
          <Grid.Col span={{ base: 6, sm: 3, lg: 2 }}>
            <Stack gap="xs">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                style={{ letterSpacing: "0.08em", color: "var(--text-primary)" }}
              >
                Product
              </Text>

              <Link href="/#cryptography" className="footer-link">
                Platform
              </Link>
              <Link href="/#checkpoint-section" className="footer-link">
                Workflow
              </Link>
              <Link href="/guidelines" className="footer-link">
                Security
              </Link>
              <Link href="/#both-sides" className="footer-link">
                FAQ
              </Link>
            </Stack>
          </Grid.Col>

          {/* Column 3: Researchers */}
          <Grid.Col span={{ base: 6, sm: 3, lg: 2 }}>
            <Stack gap="xs">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                style={{ letterSpacing: "0.08em", color: "var(--text-primary)" }}
              >
                Researchers
              </Text>

              <Link href="/demo" className="footer-link">
                Reporting guide
              </Link>
              <Link href="/guidelines" className="footer-link">
                Disclosure policy
              </Link>
              <Link href="/guidelines#safe-harbor" className="footer-link">
                Safe Harbor
              </Link>
              <Link href="/pgp-key" className="footer-link">
                Public PGP Key
              </Link>
            </Stack>
          </Grid.Col>

          {/* Column 4: Resources */}
          <Grid.Col span={{ base: 6, sm: 3, lg: 2 }}>
            <Stack gap="xs">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                style={{ letterSpacing: "0.08em", color: "var(--text-primary)" }}
              >
                Resources
              </Text>

              <Link href="/.well-known/security.txt" className="footer-link">
                Documentation
              </Link>
              <Link href="/workspace/new" className="footer-link">
                Installation & setup
              </Link>
              <Link href="/remediation" className="footer-link">
                User manual
              </Link>
              <Link href="/remediation#git-proof" className="footer-link">
                Git Retest Proof
              </Link>
            </Stack>
          </Grid.Col>

          {/* Column 5: Account */}
          <Grid.Col span={{ base: 6, sm: 3, lg: 2 }}>
            <Stack gap="xs">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                style={{ letterSpacing: "0.08em", color: "var(--text-primary)" }}
              >
                Account
              </Text>

              <Link href="/auth/login" className="footer-link">
                Log in
              </Link>
              <Link href="/portal" className="footer-link">
                Dashboard
              </Link>
              <Link href="/workspace/new" className="footer-link">
                Create workspace
              </Link>
              <Link href="/status" className="footer-link">
                System Status
              </Link>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Institutional Context Divider Banner */}
        <Box
          mt={{ base: "xl", md: "2.5rem" }}
          pt="md"
          pb="md"
          px="md"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
          }}
        >
          <Group justify="space-between" wrap="wrap" gap="xs">
            <Group gap="sm" wrap="wrap">
              <Text
                size="xs"
                fw={600}
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
              >
                {project.portalId}
              </Text>
              <span style={{ color: "var(--border-subtle)" }}>|</span>
              <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                Author: {project.studentAuthor} ({project.rollNo})
              </Text>
              <span style={{ color: "var(--border-subtle)" }}>|</span>
              <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                Supervisor: {project.supervisor}
              </Text>
            </Group>
            <Text
              size="xs"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
              }}
            >
              {project.session} • {project.batch}
            </Text>
          </Group>
        </Box>

        {/* Bottom Bar */}
        <Box
          style={{
            borderTop: "1px solid var(--border-subtle)",
            marginTop: "2rem",
            paddingTop: "1.5rem",
          }}
        >
          <Group justify="space-between" wrap="wrap" gap="sm">
            <Group gap="md" wrap="wrap">
              <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                © {currentYear} Caulvyn. All rights reserved.
              </Text>
              <span style={{ color: "var(--border-contrast)", opacity: 0.5 }}>·</span>
              <Link href="/privacy" className="footer-link" style={{ fontSize: "0.78rem" }}>
                Privacy Policy
              </Link>
              <Link href="/terms" className="footer-link" style={{ fontSize: "0.78rem" }}>
                Terms of Service
              </Link>
              <Link href="/.well-known/security.txt" className="footer-link" style={{ fontSize: "0.78rem" }}>
                Security.txt
              </Link>
            </Group>

            <Group gap="md">
              <Text
                size="xs"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-secondary)",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "var(--heading-accent)",
                    display: "inline-block",
                    boxShadow: "0 0 6px var(--heading-accent)",
                  }}
                  aria-hidden="true"
                />
                Client-Side Cryptographic Isolation Active
              </Text>
            </Group>
          </Group>
        </Box>
      </Container>
    </Box>
  );
}
