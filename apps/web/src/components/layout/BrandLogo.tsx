"use client";

import Link from "next/link";
import { Group, Text, Box } from "@mantine/core";
import { project } from "@/lib/project";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
}

export function BrandLogo({ size = "md", withTagline = false }: BrandLogoProps) {
  const isLarge = size === "lg";
  const iconSize = isLarge ? 30 : size === "sm" ? 20 : 24;

  return (
    <Link
      href="/"
      aria-label={`${project.displayName} home`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <Group gap="xs" wrap="nowrap" align="center">
        {/* Geometric Shield / Cross SVG Mark */}
        <Box
          style={{
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--card-icon-color, var(--heading-accent, #0B2E22))",
            flexShrink: 0,
          }}
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </Box>

        <Box>
          <Text
            component="span"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: isLarge ? "1.35rem" : "1.18rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              display: "block",
            }}
          >
            caulvyn
          </Text>

          {withTagline && (
            <Text
              size="xs"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                marginTop: "2px",
                lineHeight: 1.2,
                color: "var(--text-muted)",
              }}
            >
              Vulnerability Disclosure
            </Text>
          )}
        </Box>
      </Group>
    </Link>
  );
}
