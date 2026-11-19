"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { AuthShell } from "@/components/auth/AuthShell";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default function LoginPage() {
  const [accountType, setAccountType] = useState<"defender" | "hunter">("defender");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showMfa, setShowMfa] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both your work email and master passphrase.");
      return;
    }

    if (showMfa && totpCode.trim().length !== 6) {
      setErrorMessage("Please enter a valid 6-digit authenticator TOTP code.");
      return;
    }

    setLoading(true);

    try {
      // Dispatch authentication request to backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          totpCode: showMfa ? totpCode : undefined,
          accountType,
          rememberMe,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403 && errorData.mfaRequired) {
          setShowMfa(true);
          setErrorMessage("Step-up TOTP MFA required for this account. Please enter your 6-digit code.");
          setLoading(false);
          return;
        }
        throw new Error(errorData.message || "Invalid email or password.");
      }

      setSuccessMessage("Authentication successful. Redirecting to your workspace...");
      setTimeout(() => {
        window.location.href = "/workspace";
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication service is currently unavailable.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in to your workspace"
      subtitle="Access end-to-end encrypted vulnerability triage, remediation pipelines, and verified retests."
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {/* Social OAuth Authentication */}
          <OAuthButtons mode="login" disabled={loading} />

          {/* Account Category Selector */}
          <Box>
            <Text
              size="xs"
              fw={600}
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--text-secondary)",
                marginBottom: 6,
              }}
            >
              Signing in as
            </Text>
            <SegmentedControl
              value={accountType}
              onChange={(val) => setAccountType(val as "defender" | "hunter")}
              fullWidth
              size="sm"
              data={[
                {
                  label: (
                    <span>
                      <span className="auth-segmented-full">Organization Defender / Owner</span>
                      <span className="auth-segmented-short">Defender / Owner</span>
                    </span>
                  ),
                  value: "defender",
                },
                {
                  label: (
                    <span>
                      <span className="auth-segmented-full">Security Researcher</span>
                      <span className="auth-segmented-short">Researcher</span>
                    </span>
                  ),
                  value: "hunter",
                },
              ]}
              styles={{
                root: {
                  backgroundColor: "var(--surface-subtle)",
                  border: "1px solid var(--border-subtle)",
                },
                indicator: {
                  backgroundColor: "var(--surface-card)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                },
                label: {
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.80rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  padding: "6px 8px",
                },
              }}
            />
          </Box>

          {/* Feedback Alerts */}
          {errorMessage && (
            <Alert
              color="red"
              variant="light"
              title="Authentication Notice"
              styles={{
                root: {
                  borderRadius: "8px",
                  border: "1px solid rgba(220, 38, 38, 0.25)",
                },
                title: { fontWeight: 600, fontSize: "0.85rem" },
                message: { fontSize: "0.82rem" },
              }}
            >
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert
              color="green"
              variant="light"
              title="Clearance Granted"
              styles={{
                root: {
                  borderRadius: "8px",
                  border: "1px solid rgba(34, 197, 94, 0.25)",
                },
                title: { fontWeight: 600, fontSize: "0.85rem" },
                message: { fontSize: "0.82rem" },
              }}
            >
              {successMessage}
            </Alert>
          )}

          {/* Email Input */}
          <TextInput
            label="Work email"
            type="email"
            required
            placeholder={accountType === "defender" ? "sarah@startup.io" : "alex@analytical.org"}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            disabled={loading}
            styles={{
              label: {
                fontFamily: "var(--font-sans)",
                fontSize: "0.84rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 4,
              },
              input: {
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                backgroundColor: "var(--canvas-bg)",
                borderColor: "var(--border-contrast)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                height: 42,
              },
            }}
          />

          {/* Password Input */}
          <Box>
            <Group justify="space-between" mb={4}>
              <Text
                component="label"
                size="sm"
                fw={600}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.84rem",
                  color: "var(--text-primary)",
                }}
              >
                Password
              </Text>
              <Anchor
                component={Link}
                href="/auth/reset-password"
                size="xs"
                style={{
                  color: "var(--heading-accent, #16654C)",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Anchor>
            </Group>
            <PasswordInput
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              disabled={loading}
              styles={{
                input: {
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                  backgroundColor: "var(--canvas-bg)",
                  borderColor: "var(--border-contrast)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  height: 42,
                },
              }}
            />
          </Box>

          {/* Step-Up MFA TOTP Input (Conditional or Toggle) */}
          {showMfa ? (
            <TextInput
              label="6-Digit Authenticator TOTP Code"
              description="Required for Workspace Administrator and privileged roles."
              placeholder="123456"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.currentTarget.value.replace(/\D/g, ""))}
              disabled={loading}
              autoFocus
              styles={{
                label: {
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                },
                description: {
                  fontSize: "0.76rem",
                  color: "var(--text-muted)",
                  marginBottom: 6,
                },
                input: {
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.25em",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  backgroundColor: "var(--canvas-bg)",
                  borderColor: "var(--heading-accent)",
                  borderRadius: "8px",
                  height: 44,
                  fontWeight: 700,
                },
              }}
            />
          ) : (
            <Group justify="flex-end">
              <Anchor
                component="button"
                type="button"
                size="xs"
                onClick={() => setShowMfa(true)}
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>Sign in with Step-Up TOTP Code</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Anchor>
            </Group>
          )}

          {/* Remember this Device */}
          <Checkbox
            label="Remember this session for 30 days"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.currentTarget.checked)}
            disabled={loading}
            styles={{
              label: {
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
              },
            }}
          />

          {/* Submit Action Button */}
          <Button
            type="submit"
            fullWidth
            loading={loading}
            style={{
              backgroundColor: "var(--color-primary, #0B2E22)",
              color: "#FFFFFF",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "0.92rem",
              height: 44,
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(11, 46, 34, 0.2)",
              transition: "all 150ms ease",
              marginTop: 4,
            }}
          >
            {loading ? "Authenticating..." : "Sign in to workspace"}
          </Button>

          {/* Divider */}
          <Divider my={6} label="OR" labelPosition="center" />

          {/* Anonymous Guest Intake Helper Callout */}
          <Box
            style={{
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "10px",
              border: "1px dashed var(--border-contrast)",
              padding: "12px 14px",
              textAlign: "center",
            }}
          >
            <Text
              size="xs"
              fw={600}
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
                marginBottom: 3,
              }}
            >
              Reporting a security defect?
            </Text>
            <Text
              size="xs"
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.4,
                marginBottom: 8,
              }}
            >
              You do not need an account or password to submit a report.
            </Text>
            <Link
              href="/programs/default/submit"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--heading-accent, #16654C)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>Submit encrypted report without account</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </Box>

          {/* Link to Create Workspace */}
          <Group justify="center" gap={6} mt={4}>
            <Text size="xs" style={{ color: "var(--text-secondary)" }}>
              Need a new workspace for your company?
            </Text>
            <Link
              href="/workspace/new"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--heading-accent, #16654C)",
                textDecoration: "none",
              }}
            >
              Create workspace
            </Link>
          </Group>
        </Stack>
      </form>
    </AuthShell>
  );
}
