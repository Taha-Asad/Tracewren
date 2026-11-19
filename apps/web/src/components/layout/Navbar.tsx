"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Avatar,
  Box,
  Container,
  Drawer,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { project } from "@/lib/project";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Platform", href: "/#platform" },
  { label: "Workflow", href: "/#workflow" },
  { label: "For researchers", href: "/#researchers" },
  { label: "Programs", href: "/programs" },
  { label: "CVSS 3.1", href: "/cvss" },
];

interface NavbarUser {
  id: string;
  email: string;
  fullName: string | null;
}

export function Navbar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [authUser, setAuthUser] = useState<NavbarUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.user) {
          setAuthUser(data.user);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    setAuthUser(null);
    close();
    window.location.href = "/";
  };

  const userInitial = (authUser?.fullName?.[0] || authUser?.email?.[0] || "U").toUpperCase();

  return (
    <Box
      component="header"
      style={{
        width: "100%",
        padding: "16px 20px 0 20px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container
        size="1600px"
        px={0}
        style={{
          maxWidth: "1600px",
          width: "100%",
        }}
      >
        {/* Dark Floating Capsule Header */}
        <Box
          style={{
            backgroundColor: "var(--header-dark-bg, #1A2225)",
            borderRadius: "14px",
            padding: "10px 22px",
            boxShadow: "0 6px 24px -4px rgba(18, 24, 27, 0.18), 0 2px 6px -1px rgba(18, 24, 27, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            transition: "all 200ms ease",
          }}
        >
          <Group justify="space-between" align="center" wrap="nowrap" h={44}>
            {/* 1. Left: Simple Avatar Placeholder + Brand Title */}
            <Link
              href="/"
              aria-label={`${project.displayName} home`}
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* Avatar Placeholder */}
              <Avatar
                radius="xl"
                size={34}
                color="gray"
                variant="filled"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#1A2225",
                  fontWeight: 700,
                  fontSize: "1rem",
                  fontFamily: "var(--font-display)",
                  border: "2px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                  userSelect: "none",
                }}
              >
                C
              </Avatar>

              {/* Brand Wordmark */}
              <Text
                component="span"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "#FFFFFF",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                caulvyn
              </Text>
            </Link>

            {/* 2. Center: Desktop Navigation Links (Visible on md and up) */}
            <Group gap="lg" visibleFrom="md">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.82)",
                      textDecoration: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      transition: "color 150ms ease, background-color 150ms ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </Group>

            {/* 3. Right: Action Buttons (Visible on md and up) */}
            <Group gap="sm" visibleFrom="md" align="center">
              {/* Theme Toggle Button with Ripple Effect */}
              <ThemeToggle size={36} />

              {authUser ? (
                <>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "rgba(255, 255, 255, 0.85)",
                      backgroundColor: "transparent",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "color 150ms ease, background-color 150ms ease",
                    }}
                  >
                    Sign out
                  </button>
                  <Link
                    href="/workspace"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      backgroundColor: "#FFFFFF",
                      color: "#162124",
                      textDecoration: "none",
                      padding: "7px 14px",
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        backgroundColor: "#0B2E22",
                        color: "#FFFFFF",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {userInitial}
                    </span>
                    Open Workspace
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.98rem",
                      fontWeight: 500,
                      color: "rgba(255, 255, 255, 0.88)",
                      textDecoration: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      transition: "color 150ms ease, background-color 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.88)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Log in
                  </Link>

                  <Link
                    href="/workspace/new"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      backgroundColor: "#FFFFFF",
                      color: "#162124",
                      textDecoration: "none",
                      padding: "9px 18px",
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 180ms cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F3F7F5";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFFFFF";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.12)";
                    }}
                  >
                    Create workspace
                  </Link>
                </>
              )}
            </Group>

            {/* 4. Mobile & Tablet Controls (Theme Toggle + Clean Ghost Menu Trigger) */}
            <Group gap="xs" hiddenFrom="md" align="center">
              <ThemeToggle size={38} />

              <button
                type="button"
                onClick={toggle}
                aria-label={opened ? "Close navigation menu" : "Open navigation menu"}
                style={{
                  width: 40,
                  height: 40,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: "#FFFFFF",
                  padding: 0,
                  transition: "background-color 150ms ease, transform 120ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.95)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
            </Group>
          </Group>
        </Box>
      </Container>

      {/* 5. Beautified Dark Mobile Drawer (High Z-Index so it NEVER hides behind navbar) */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="340px"
        padding="xl"
        hiddenFrom="md"
        withCloseButton={false}
        zIndex={3000}
        overlayProps={{
          backgroundOpacity: 0.65,
          blur: 8,
          zIndex: 2999,
        }}
        styles={{
          root: {
            zIndex: 3000,
          },
          inner: {
            zIndex: 3001,
          },
          content: {
            backgroundColor: "#161D20",
            borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.4)",
            color: "#FFFFFF",
            zIndex: 3002,
          },
          body: {
            height: "100%",
            padding: 0,
          },
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "24px 20px",
          }}
        >
          {/* Drawer Top Header: Avatar + Title + Clean Close Button */}
          <Box>
            <Group justify="space-between" align="center" pb="lg" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <Link
                href="/"
                onClick={close}
                aria-label={`${project.displayName} home`}
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Avatar
                  radius="xl"
                  size={32}
                  variant="filled"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#161D20",
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {project.displayName.charAt(0)}
                </Avatar>
                <Text
                  fw={700}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.15rem",
                    color: "#FFFFFF",
                    letterSpacing: "-0.025em",
                  }}
                >
                  caulvyn
                </Text>
              </Link>

              {/* Drawer Controls: Theme Toggle + Close Button */}
              <Group gap="xs" align="center">
                <ThemeToggle size={34} />

                <button
                  type="button"
                  onClick={close}
                  aria-label="Close navigation menu"
                  style={{
                    width: 36,
                    height: 36,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    color: "rgba(255, 255, 255, 0.75)",
                    padding: 0,
                    transition: "background-color 150ms ease, color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.75)";
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </Group>
            </Group>

            {/* Navigation Links in Drawer */}
            <Stack gap="xs" mt="xl">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                style={{
                  letterSpacing: "0.1em",
                  color: "rgba(255, 255, 255, 0.72)",
                  paddingLeft: "8px",
                  fontSize: "0.72rem",
                  marginBottom: "4px",
                }}
              >
                Navigation
              </Text>

              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={close}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      padding: "11px 14px",
                      borderRadius: "8px",
                      backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.transform = "translateX(3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isActive ? "rgba(255, 255, 255, 0.1)" : "transparent";
                      e.currentTarget.style.color = isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <span>{link.label}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                );
              })}
            </Stack>
          </Box>

          {/* Drawer Bottom Actions: Login & Create Workspace (Not Complete Rounded) */}
          <Box style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem" }}>
            <Stack gap="sm">
              {authUser ? (
                <>
                  <Link
                    href="/workspace"
                    onClick={close}
                    style={{
                      width: "100%",
                      height: "44px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      backgroundColor: "#FFFFFF",
                      color: "#162124",
                      borderRadius: "8px",
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    Open Workspace ({authUser.fullName || authUser.email})
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      height: "44px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.92rem",
                      fontWeight: 500,
                      color: "#FFFFFF",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.16)",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={close}
                    style={{
                      width: "100%",
                      height: "44px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.92rem",
                      fontWeight: 500,
                      color: "#FFFFFF",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.16)",
                      borderRadius: "8px",
                      textDecoration: "none",
                    }}
                  >
                    Log in
                  </Link>

                  <Link
                    href="/workspace/new"
                    onClick={close}
                    style={{
                      width: "100%",
                      height: "44px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      backgroundColor: "#FFFFFF",
                      color: "#162124",
                      borderRadius: "8px",
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    Create workspace
                  </Link>
                </>
              )}

              {/* Status pill footnote */}
              <Group gap="xs" justify="center" mt="xs">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#22C55E",
                    display: "inline-block",
                  }}
                />
                <Text size="xs" style={{ color: "rgba(255, 255, 255, 0.72)", fontSize: "0.75rem" }}>
                  Zero-Knowledge Isolation Active
                </Text>
              </Group>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
