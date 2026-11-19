"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import QRCode from "qrcode";
import { AuthShell } from "@/components/auth/AuthShell";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

function generateBase32Secret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < 16; i++) {
      secret += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 16; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return secret;
}

export default function CreateWorkspacePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [slug, setSlug] = useState("");
  const [domain, setDomain] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Mandatory TOTP MFA state (SRS §2.4.1)
  const [totpSecret, setTotpSecret] = useState<string>("JBSWY3DPEHPK3PXP");
  const [totpCode, setTotpCode] = useState<string>("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate clean slug from organization name
  useEffect(() => {
    if (!slugManuallyEdited && orgName) {
      const generated = orgName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  }, [orgName, slugManuallyEdited]);

  const handleProceedToStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!orgName.trim() || !slug.trim() || !email.trim() || !password) {
      setErrorMessage("Please complete all required workspace and owner credentials.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Master passphrase must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Master passphrase and confirmation do not match.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("Please accept the Terms of Service and certify domain authorization to proceed.");
      return;
    }

    const secret = generateBase32Secret();
    setTotpSecret(secret);

    const otpauthUrl = `otpauth://totp/BugBountyTrack:${encodeURIComponent(email.trim())}?secret=${secret}&issuer=BugBountyTrack`;
    try {
      const url = await QRCode.toDataURL(otpauthUrl, {
        width: 170,
        margin: 1,
        color: { dark: "#0B2E22", light: "#FFFFFF" },
      });
      setQrCodeDataUrl(url);
    } catch {
      // Fallback
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (totpCode.trim().length !== 6) {
      setErrorMessage("Please enter the 6-digit TOTP verification code from your authenticator app to complete mandatory MFA setup.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register-organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orgName: orgName.trim(),
          slug: slug.trim(),
          domain: domain.trim() || undefined,
          fullName: fullName.trim() || undefined,
          email: email.trim(),
          password,
          totpSecret,
          totpCode: totpCode.trim(),
          agreedToTerms: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Unable to register organization. Slug or email may already be taken."
        );
      }

      setSuccessMessage("Authenticator paired and workspace created! Redirecting to onboarding wizard...");
      setTimeout(() => {
        window.location.href = `/onboarding?slug=${encodeURIComponent(slug.trim())}`;
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please check network connectivity.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your organization workspace"
      subtitle="Establish a zero-knowledge vulnerability disclosure perimeter with RFC 9116 manifests and verified retests."
      visualBadge="Multi-Tenant Vault"
      visualHeadline="Establish your encrypted vulnerability disclosure perimeter."
      visualDescription="Provision an isolated tenant perimeter with browser-generated Curve25519 recovery keys, published RFC 9116 security.txt manifests, and verified git-linked retests."
      maxWidth={580}
    >
      <form onSubmit={step === 1 ? handleProceedToStep2 : handleSubmit}>
        <Stack gap="lg">
          {/* Social OAuth Workspace Onboarding */}
          <OAuthButtons mode="signup" disabled={loading} />

          {/* Step Stepper Indicator */}
          <SimpleGrid cols={2} spacing="xs">
            <Card
              p="xs"
              radius="sm"
              style={{
                backgroundColor: step === 1 ? "var(--surface-subtle)" : "transparent",
                border: step === 1 ? "1px solid #16654C" : "1px solid var(--border-subtle)",
              }}
            >
              <Group gap="xs">
                <Box
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: step === 1 ? "#16654C" : "#9E9E9E",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  1
                </Box>
                <Text size="xs" fw={step === 1 ? 700 : 500}>1. Perimeter &amp; Owner</Text>
              </Group>
            </Card>

            <Card
              p="xs"
              radius="sm"
              style={{
                backgroundColor: step === 2 ? "var(--surface-subtle)" : "transparent",
                border: step === 2 ? "1px solid #16654C" : "1px solid var(--border-subtle)",
              }}
            >
              <Group gap="xs">
                <Box
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: step === 2 ? "#16654C" : "#9E9E9E",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  2
                </Box>
                <Text size="xs" fw={step === 2 ? 700 : 500}>2. Mandatory MFA (TOTP)</Text>
              </Group>
            </Card>
          </SimpleGrid>

          {/* Feedback Alerts */}
          {errorMessage && (
            <Alert
              color="red"
              variant="light"
              title="Registration Notice"
              styles={{
                root: { borderRadius: "8px", border: "1px solid rgba(220, 38, 38, 0.25)" },
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
              title="Perimeter Initialized"
              styles={{
                root: { borderRadius: "8px", border: "1px solid rgba(34, 197, 94, 0.25)" },
                title: { fontWeight: 600, fontSize: "0.85rem" },
                message: { fontSize: "0.82rem" },
              }}
            >
              {successMessage}
            </Alert>
          )}

          {step === 1 && (
            <>
              {/* Section 1: Organization Details */}
              <Box>
                <Group justify="space-between" align="center" mb={12}>
                  <Text
                    size="sm"
                    fw={700}
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    1. Organization Perimeter
                  </Text>
                  <Badge size="xs" variant="outline" color="green">
                    Multi-Tenant Isolated
                  </Badge>
                </Group>

                <Stack gap="sm">
                  <TextInput
                    label="Organization name"
                    required
                    placeholder="Acme Cyber Systems"
                    value={orgName}
                    onChange={(e) => setOrgName(e.currentTarget.value)}
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
                        height: 42,
                      },
                    }}
                  />

                  <Box>
                    <TextInput
                      label="Workspace URL slug"
                      required
                      description="Public discovery directory for researchers."
                      placeholder="acme-cyber"
                      value={slug}
                      onChange={(e) => {
                        setSlugManuallyEdited(true);
                        setSlug(e.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                      }}
                      disabled={loading}
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
                          marginBottom: 4,
                        },
                        input: {
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.88rem",
                          backgroundColor: "var(--canvas-bg)",
                          borderColor: "var(--border-contrast)",
                          borderRadius: "8px",
                          height: 42,
                        },
                      }}
                    />
                    {slug && (
                      <Text
                        size="xs"
                        mt={4}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--heading-accent, #16654C)",
                        }}
                      >
                        Public intake URL: /programs/{slug}
                      </Text>
                    )}
                  </Box>

                  <TextInput
                    label="Primary security domain"
                    description="Optional domain where your RFC 9116 security.txt will be published."
                    placeholder="acme.com"
                    value={domain}
                    onChange={(e) => setDomain(e.currentTarget.value)}
                    disabled={loading}
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
                        marginBottom: 4,
                      },
                      input: {
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.88rem",
                        backgroundColor: "var(--canvas-bg)",
                        borderColor: "var(--border-contrast)",
                        borderRadius: "8px",
                        height: 42,
                      },
                    }}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Section 2: Owner Administrator Account */}
              <Box>
                <Group justify="space-between" align="center" mb={12}>
                  <Text
                    size="sm"
                    fw={700}
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    2. Workspace Owner Credentials
                  </Text>
                  <Badge size="xs" variant="light" color="blue">
                    Root Custody
                  </Badge>
                </Group>

                <Stack gap="sm">
                  <TextInput
                    label="Your full name"
                    placeholder="Sarah Chen"
                    value={fullName}
                    onChange={(e) => setFullName(e.currentTarget.value)}
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
                        height: 42,
                      },
                    }}
                  />

                  <TextInput
                    label="Work email"
                    required
                    type="email"
                    placeholder="sarah@acme.com"
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
                        height: 42,
                      },
                    }}
                  />

                  <Grid gap="xs">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <PasswordInput
                        label="Master passphrase"
                        required
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
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
                            height: 42,
                          },
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <PasswordInput
                        label="Confirm passphrase"
                        required
                        placeholder="Repeat passphrase"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
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
                            height: 42,
                          },
                        }}
                      />
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Box>

              {/* Cryptographic Protection Guarantee Callout */}
              <Box
                style={{
                  backgroundColor: "var(--surface-subtle)",
                  borderRadius: "10px",
                  border: "1px solid var(--border-contrast)",
                  padding: "12px 14px",
                }}
              >
                <Group gap="xs" wrap="nowrap" align="flex-start">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--heading-accent, #16654C)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginTop: 2, flexShrink: 0 }}
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <Text
                    size="xs"
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.45,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Upon creation, an offline <strong>Organization Master Recovery Key</strong> is generated
                    in your browser. Your master passphrase encrypts your personal subkeys via OpenPGP Argon2id S2K.
                  </Text>
                </Group>
              </Box>

              {/* Terms & Domain Authorization Checkbox */}
              <Checkbox
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.currentTarget.checked)}
                disabled={loading}
                label={
                  <Text size="xs" style={{ color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    I agree to the <strong>Terms of Service</strong>, <strong>Safe Harbor Policy</strong>, and certify legal authorization to publish vulnerability disclosure guidelines for this domain.
                  </Text>
                }
                styles={{
                  label: { cursor: "pointer", paddingLeft: 8 },
                }}
              />

              {/* Step 1 Submit Button */}
              <Button
                type="submit"
                fullWidth
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
                }}
              >
                Proceed to Step 2: Mandatory MFA Setup
              </Button>
            </>
          )}

          {step === 2 && (
            <Stack gap="md">
              <Box>
                <Group justify="space-between" align="center" mb={6}>
                  <Text
                    size="sm"
                    fw={700}
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    2. Mandatory Authenticator Pairing (RFC 6238 TOTP)
                  </Text>
                  <Badge size="xs" color="teal" variant="filled">
                    SRS §2.4.1 Mandatory
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  All Organization Owner accounts require mandatory Time-based One-Time Password MFA enrollment prior to initial workspace activation.
                </Text>
              </Box>

              {/* QR Code Card */}
              <Card
                p="md"
                radius="md"
                style={{
                  backgroundColor: "var(--surface-subtle)",
                  border: "1px solid var(--border-contrast)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {qrCodeDataUrl ? (
                  <Box
                    style={{
                      padding: 8,
                      backgroundColor: "#FFFFFF",
                      borderRadius: 8,
                      border: "1px solid #D5E5DC",
                      marginBottom: 12,
                    }}
                  >
                    <img
                      src={qrCodeDataUrl}
                      alt="TOTP Authenticator QR Code"
                      width={160}
                      height={160}
                      style={{ display: "block" }}
                    />
                  </Box>
                ) : (
                  <Box p="xl">
                    <Text size="xs" c="dimmed">Generating secure QR code...</Text>
                  </Box>
                )}

                <Text size="xs" fw={600} mb={4} style={{ color: "var(--text-primary)" }}>
                  Manual Secret Key
                </Text>
                <Group gap="xs" justify="center">
                  <Text
                    size="xs"
                    ff="monospace"
                    fw={700}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "var(--surface-card)",
                      borderRadius: 4,
                      border: "1px solid var(--border-subtle)",
                      letterSpacing: "0.08em",
                      color: "var(--text-primary)",
                    }}
                  >
                    {totpSecret.match(/.{1,4}/g)?.join(" ") || totpSecret}
                  </Text>
                  <Button
                    size="xs"
                    variant="subtle"
                    color="teal"
                    onClick={() => {
                      if (typeof navigator !== "undefined") {
                        navigator.clipboard.writeText(totpSecret);
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }
                    }}
                  >
                    {copiedKey ? "Copied" : "Copy"}
                  </Button>
                </Group>
                <Text size="11px" c="dimmed" mt={8}>
                  Scan with Google Authenticator, 1Password, Bitwarden, or your hardware key.
                </Text>
              </Card>

              <TextInput
                label="6-Digit Authenticator Verification Code"
                description="Enter the numeric code generated by your authenticator app to complete registration."
                required
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.currentTarget.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
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
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.1rem",
                    letterSpacing: "0.2em",
                    textAlign: "center",
                    backgroundColor: "var(--canvas-bg)",
                    borderColor: "var(--border-contrast)",
                    borderRadius: "8px",
                    height: 44,
                  },
                }}
              />

              <Group justify="space-between" mt="md">
                <Button
                  variant="default"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back to Details
                </Button>
                <Button
                  type="submit"
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
                  }}
                >
                  {loading ? "Activating workspace..." : "Verify MFA & Activate Workspace"}
                </Button>
              </Group>
            </Stack>
          )}

          {/* Back to Login Link */}
          <Group justify="center" gap={6} mt={2}>
            <Text size="xs" style={{ color: "var(--text-secondary)" }}>
              Already registered your organization?
            </Text>
            <Link
              href="/auth/login"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--heading-accent, #16654C)",
                textDecoration: "none",
              }}
            >
              Sign in to workspace
            </Link>
          </Group>
        </Stack>
      </form>
    </AuthShell>
  );
}
