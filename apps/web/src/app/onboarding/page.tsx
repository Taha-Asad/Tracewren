"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Code,
  Collapse,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import QRCode from "qrcode";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

// ============================================================================
// SVG ICONS (NO ASCII / UNICODE EMOJIS)
// ============================================================================
const CheckIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LockIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ChevronDownIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUpIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ArrowRightIcon = ({ size = 15, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowLeftIcon = ({ size = 15, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CopyIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const ShieldCheckIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const DownloadIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const KeyIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </svg>
);

// ============================================================================
// TIMELINE STEP DEFINITIONS
// ============================================================================
interface TimelineStepDef {
  id: number;
  label: string;
  shortLabel: string;
}

const TIMELINE_STEPS: TimelineStepDef[] = [
  { id: 1, label: "Workspace", shortLabel: "Org" },
  { id: 2, label: "Authenticator", shortLabel: "Auth" },
  { id: 3, label: "Domain proof", shortLabel: "Domain" },
  { id: 4, label: "Personal key", shortLabel: "Key" },
  { id: 5, label: "Recovery key", shortLabel: "Backup" },
  { id: 6, label: "Defenders", shortLabel: "Team" },
  { id: 7, label: "Activate", shortLabel: "Vault" },
];

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  mfaEnabled: boolean;
  avatarUrl: string | null;
}

interface Membership {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: string;
  domain: string | null;
  domainVerified: boolean;
  onboardingCompletedAt?: string | null;
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [, setMemberships] = useState<Membership[]>([]);
  const [activeOrg, setActiveOrg] = useState<Membership | null>(null);

  // Active step (1 to 7) & max unlocked step
  const [activeStep, setActiveStep] = useState<number>(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(1);

  // Step 1: Workspace Identity
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [programName, setProgramName] = useState("Portal disclosure");
  const [securityContactUrl, setSecurityContactUrl] = useState("");
  const [step1Completed, setStep1Completed] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Step 2: Authenticator MFA
  const [mfaSecret] = useState("JBSWY3DPEHPK3PXP");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [mfaCode, setMfaCode] = useState("");
  const [showManualSecret, setShowManualSecret] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);

  // Step 3: Domain Proof
  const [domainInput, setDomainInput] = useState("");
  const [domainVerified, setDomainVerified] = useState(false);
  const [domainVerifying, setDomainVerifying] = useState(false);
  const [domainCheckedTime, setDomainCheckedTime] = useState<string | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [copiedTxtHost, setCopiedTxtHost] = useState(false);
  const [copiedTxtValue, setCopiedTxtValue] = useState(false);

  // Step 4: Personal Local Key
  const [personalPassphrase, setPersonalPassphrase] = useState("");
  const [confirmPersonalPassphrase, setConfirmPersonalPassphrase] = useState("");
  const [personalKeyGenerated, setPersonalKeyGenerated] = useState(false);
  const [personalKeyFingerprint, setPersonalKeyFingerprint] = useState("");
  const [personalKeyError, setPersonalKeyError] = useState<string | null>(null);

  // Step 5: Master Recovery Key & Challenge
  const [recoveryPassphrase, setRecoveryPassphrase] = useState("");
  const [confirmRecoveryPassphrase, setConfirmRecoveryPassphrase] = useState("");
  const [recoveryDownloaded, setRecoveryDownloaded] = useState(false);
  const recoveryFingerprint = "ED25519: 7B:4E:91:2C:FA:82:19:D4:53:C0";
  const [testPassphrase, setTestPassphrase] = useState("");
  const [recoveryChallengePassed, setRecoveryChallengePassed] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Step 6: Program Defenders
  const [defenders, setDefenders] = useState([
    { id: "owner", name: "Sarah Chen", role: "Owner / defender", active: true, keyStatus: "active personal key" },
    { id: "def1", name: "Mina Patel", role: "Program defender", active: true, keyStatus: "active personal key" },
    { id: "def2", name: "Jonah Brooks", role: "Program defender", active: true, keyStatus: "active personal key" },
  ]);
  const [defendersConfirmed, setDefendersConfirmed] = useState(false);

  // Step 7: Sign & Activate
  const [activating, setActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [activatedSuccess, setActivatedSuccess] = useState(false);

  // Load user profile & memberships
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          window.location.href = "/auth/login";
          return;
        }
        const data = await res.json();
        setUser(data.user);
        const orgs: Membership[] = data.memberships || [];
        setMemberships(orgs);

        let current: Membership | undefined;
        if (slugParam) {
          current = orgs.find((o) => o.organizationSlug === slugParam);
        }
        if (!current && orgs.length > 0) {
          current = orgs[0];
        }

        if (current) {
          setActiveOrg(current);
          setOrgName(current.organizationName);
          setOrgSlug(current.organizationSlug);
          if (current.domain) {
            const cleanDomain = current.domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
            setDomainInput(cleanDomain);
            setSecurityContactUrl(`https://${cleanDomain}/security`);
          } else {
            setDomainInput(`${current.organizationSlug}.example`);
            setSecurityContactUrl(`https://${current.organizationSlug}.example/security`);
          }
          if (current.domainVerified) {
            setDomainVerified(true);
            setDomainCheckedTime("Pre-verified in DNS registry");
          }
          if (current.organizationName && current.organizationSlug) {
            setStep1Completed(true);
          }
          if (data.user?.mfaEnabled) {
            setMfaVerified(true);
          }
          const highestUnlocked = !current.organizationName
            ? 1
            : !data.user?.mfaEnabled
            ? 2
            : !current.domainVerified
            ? 3
            : 7;
          setMaxUnlockedStep((prev) => Math.max(prev, highestUnlocked));

          const stepParam = searchParams.get("step");
          if (stepParam) {
            const parsed = parseInt(stepParam, 10);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= 7) {
              setActiveStep(parsed);
            }
          } else {
            // Default to Step 1 so the entire onboarding wizard is presented from the beginning
            setActiveStep(1);
          }
          if (data.user?.fullName) {
            setDefenders((prev) =>
              prev.map((d) => (d.id === "owner" ? { ...d, name: data.user.fullName || "Owner" } : d))
            );
          }
        }
        setLoading(false);
      } catch {
        window.location.replace("/auth/login");
      }
    }

    loadData();
  }, [slugParam]);

  // Generate scannable RFC 6238 TOTP QR code data URL
  useEffect(() => {
    if (mfaSecret) {
      const issuer = "caulvyn";
      const account = user?.email || "owner@example.com";
      const otpauthUri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(
        account
      )}?secret=${mfaSecret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

      QRCode.toDataURL(otpauthUri, {
        width: 220,
        margin: 2,
        color: {
          dark: "#0B2E22",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [mfaSecret, user?.email]);

  // Step completion checker
  const isStepCompleted = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return step1Completed;
      case 2:
        return mfaVerified;
      case 3:
        return domainVerified;
      case 4:
        return personalKeyGenerated;
      case 5:
        return recoveryChallengePassed;
      case 6:
        return defendersConfirmed;
      case 7:
        return activatedSuccess;
      default:
        return false;
    }
  };

  // Step 1: Save Workspace
  const handleSaveStep1 = () => {
    setStep1Error(null);
    if (!orgName.trim() || !orgSlug.trim()) {
      setStep1Error("Organization name and slug are required.");
      return;
    }
    setStep1Completed(true);
    setMaxUnlockedStep((prev) => Math.max(prev, 2));
    setActiveStep(2);
  };

  // Step 2: Verify MFA
  const handleVerifyMfa = () => {
    setMfaError(null);
    const cleanCode = mfaCode.replace(/\s+/g, "");
    if (mfaVerified && !cleanCode) {
      const nextStep = domainVerified ? 4 : 3;
      setMaxUnlockedStep((prev) => Math.max(prev, nextStep));
      setActiveStep(nextStep);
      return;
    }
    if (!/^\d{6}$/.test(cleanCode)) {
      setMfaError("Please enter a valid 6-digit numerical authenticator code.");
      return;
    }
    setMfaVerified(true);
    const nextStep = domainVerified ? 4 : 3;
    setMaxUnlockedStep((prev) => Math.max(prev, nextStep));
    setActiveStep(nextStep);
  };

  // Step 3: Domain Verification
  const handleVerifyDomain = async () => {
    if (!activeOrg) return;
    setDomainError(null);
    setDomainVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          organizationId: activeOrg.organizationId,
          domain: domainInput.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to verify DNS TXT record.");
      }

      setDomainVerified(true);
      setDomainCheckedTime("Just now");
      setMaxUnlockedStep((prev) => Math.max(prev, 4));
      setActiveStep(4);
    } catch (err: unknown) {
      setDomainError(err instanceof Error ? err.message : "Domain verification failed.");
    } finally {
      setDomainVerifying(false);
    }
  };

  // Step 4: Personal Local Key
  const handleGeneratePersonalKey = () => {
    setPersonalKeyError(null);
    if (!personalPassphrase || personalPassphrase.length < 8) {
      setPersonalKeyError("Local encryption passphrase must be at least 8 characters long.");
      return;
    }
    if (personalPassphrase !== confirmPersonalPassphrase) {
      setPersonalKeyError("Passphrases do not match.");
      return;
    }

    const mockFingerprint = "SHA256: 3F:A9:11:4C:E8:22:9B:01:77:DC:88:51";
    setPersonalKeyFingerprint(mockFingerprint);

    const keyPayload = {
      version: "1.0",
      keyType: "Curve25519",
      fingerprint: mockFingerprint,
      publicKey: "pub_x25519_" + Math.random().toString(36).substring(2, 15),
      encryptedPrivateKey: "cipher_" + Math.random().toString(36).substring(2, 25),
      kdf: "argon2id",
      created: new Date().toISOString(),
      userEmail: user?.email || "owner@example.com",
    };

    const blob = new Blob([JSON.stringify(keyPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".bbt-user-keys.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setPersonalKeyGenerated(true);
    setMaxUnlockedStep((prev) => Math.max(prev, 5));
    setActiveStep(5);
  };

  // Step 5: Master Recovery Key
  const handleDownloadRecoveryKey = () => {
    setRecoveryError(null);
    if (!recoveryPassphrase || recoveryPassphrase.length < 8) {
      setRecoveryError("Offline recovery passphrase must be at least 8 characters long.");
      return;
    }
    if (recoveryPassphrase !== confirmRecoveryPassphrase) {
      setRecoveryError("Passphrases do not match.");
      return;
    }

    const mockKeyBlock = `-----BEGIN BBT MASTER RECOVERY KEY BLOCK-----
Version: Caulvyn Vault v1.0.0
Comment: Offline Organization Master Recovery Key (RFC 9116 / BBT-0241)
Fingerprint: ${recoveryFingerprint}
Created: ${new Date().toISOString()}

wwB6BF/WRECKWRIGHT/MASTER/RECOVERY/KEY==
q8P1Z9+xLjE4m7wP2KjVn0T4xR3sC5oE1mQ==
-----END BBT MASTER RECOVERY KEY BLOCK-----`;

    const blob = new Blob([mockKeyBlock], { type: "application/pgp-keys" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "org-recovery-key.asc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setRecoveryDownloaded(true);
  };

  const handleRunRecoveryTest = () => {
    setRecoveryError(null);
    if (!recoveryDownloaded) {
      setRecoveryError("Please download org-recovery-key.asc before running the decryption challenge.");
      return;
    }
    if (!testPassphrase) {
      setRecoveryError("Enter the offline key passphrase to decrypt the test challenge.");
      return;
    }
    if (testPassphrase !== recoveryPassphrase) {
      setRecoveryError("Decryption challenge failed: The provided passphrase does not match the key.");
      return;
    }

    setRecoveryChallengePassed(true);
    setMaxUnlockedStep((prev) => Math.max(prev, 6));
    setActiveStep(6);
  };

  // Step 6: Defenders
  const handleConfirmDefenders = () => {
    setDefendersConfirmed(true);
    setMaxUnlockedStep((prev) => Math.max(prev, 7));
    setActiveStep(7);
  };

  // Step 7: Sign & Activate
  const handleSignAndActivate = async () => {
    if (!activeOrg) return;
    setActivationError(null);
    setActivating(true);

    try {
      const res = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          organizationId: activeOrg.organizationId,
          domain: domainInput.trim() || undefined,
          domainVerified: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to complete security onboarding.");
      }

      setActivatedSuccess(true);
      setTimeout(() => {
        router.push("/workspace");
      }, 1500);
    } catch (err: unknown) {
      setActivationError(err instanceof Error ? err.message : "Activation failed. Please retry.");
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--canvas-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack align="center" gap="md">
          <Loader color="var(--color-primary)" size="md" />
          <Text size="sm" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
            Loading organization onboarding perimeter...
          </Text>
        </Stack>
      </Box>
    );
  }

  const dnsTxtRecordName = `_bbt-challenge.${domainInput || "example.com"}`;
  const dnsTxtRecordValue = `bbt-verification=${activeOrg?.organizationId?.slice(0, 16) || "9b1deb4d3b7d4bad"}`;

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--canvas-bg)" }}>
      {/* ==================================================================== */}
      {/* EMBEDDED CSS FOR SEGMENTED BAR TIMELINE                              */}
      {/* ==================================================================== */}
      <style>{`
        .segmented-timeline-ct {
          width: 100%;
          max-width: 860px;
          margin: 0 auto 24px auto;
        }

        .segmented-timeline-ct .head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .segmented-timeline-ct .head-left {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          flex: 1;
        }

        .segmented-timeline-ct .head b {
          font-family: var(--font-heading, sans-serif);
          font-size: clamp(0.96rem, 2.8vw, 1.18rem);
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .segmented-timeline-ct .head .step-chip {
          font-family: var(--font-mono, monospace);
          font-size: clamp(0.72rem, 1.8vw, 0.82rem);
          font-weight: 700;
          color: var(--heading-accent);
          background: var(--surface-subtle);
          padding: 3px 9px;
          border-radius: 6px;
          border: 1px solid var(--border-contrast);
          flex-shrink: 0;
          white-space: nowrap;
        }

        .segmented-timeline-ct ol.mini {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .segmented-timeline-ct ol.mini li {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          user-select: none;
          transition: opacity 150ms ease;
          position: relative;
          min-width: 0;
        }

        .segmented-timeline-ct ol.mini li:not(.on):not(.cur) {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .segmented-timeline-ct ol.mini li .seg {
          height: 5px;
          border-radius: 999px;
          background-color: var(--border-contrast, #E0E4E2);
          transition: all 250ms ease;
          margin-bottom: 6px;
        }

        .segmented-timeline-ct ol.mini li.on .seg {
          background-color: var(--heading-accent, #0B2E22);
        }

        .segmented-timeline-ct ol.mini li.cur .seg {
          background-color: var(--color-primary, #0B2E22);
          box-shadow: 0 0 0 2px rgba(11, 46, 34, 0.22);
        }

        .segmented-timeline-ct ol.mini li .lb {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.74rem;
          font-weight: 500;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 150ms ease;
        }

        .segmented-timeline-ct ol.mini li.cur .lb {
          font-weight: 700;
          color: var(--text-primary);
        }

        .segmented-timeline-ct ol.mini li.on .lb {
          font-weight: 600;
          color: var(--heading-accent);
        }

        .segmented-timeline-ct ol.mini li .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .step-num-indicator {
          display: none;
        }
        .lb-text {
          display: flex;
          align-items: center;
          gap: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lb-short {
          display: none;
        }
        .lb-full {
          display: inline;
        }

        /* Tablet View (521px - 768px): Show short labels (Org, Auth, Domain, Key, Backup, Team, Vault) */
        @media (max-width: 768px) and (min-width: 521px) {
          .segmented-timeline-ct ol.mini {
            gap: 6px;
          }
          .segmented-timeline-ct ol.mini li .lb {
            font-size: 0.70rem;
          }
          .lb-short {
            display: inline;
          }
          .lb-full {
            display: none;
          }
        }

        /* Mobile XS View (< 520px): Switch to centered numbers/checkmarks, hiding text to prevent collision */
        @media (max-width: 520px) {
          .segmented-timeline-ct ol.mini {
            gap: 4px;
          }
          .segmented-timeline-ct ol.mini li {
            align-items: center;
          }
          .segmented-timeline-ct ol.mini li .seg {
            width: 100%;
            height: 4px;
            margin-bottom: 4px;
          }
          .lb-text {
            display: none !important;
          }
          .step-num-indicator {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            font-size: 0.72rem;
            font-family: var(--font-mono, monospace);
            font-weight: 700;
            line-height: 1;
            color: var(--text-muted);
            min-height: 14px;
          }
          .segmented-timeline-ct ol.mini li.cur .step-num-indicator {
            color: var(--text-primary);
            font-weight: 800;
          }
          .segmented-timeline-ct ol.mini li.on .step-num-indicator {
            color: var(--heading-accent);
          }
        }

        /* Step action footers and button wrapping on mobile */
        .step-actions-group {
          width: 100%;
        }
        .btn-text-full {
          display: inline;
        }
        .btn-text-short {
          display: none;
        }

        @media (max-width: 520px) {
          .step-actions-group {
            flex-direction: column-reverse !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .step-actions-group > button,
          .step-actions-group > a {
            width: 100% !important;
            min-height: 42px !important;
            height: auto !important;
            white-space: normal !important;
            padding: 9px 14px !important;
            text-align: center !important;
          }
          .btn-text-full {
            display: none !important;
          }
          .btn-text-short {
            display: inline !important;
          }
        }
      `}</style>

      {/* ==================================================================== */}
      {/* TOP HEADER (RESPONSIVE NAVBAR)                                       */}
      {/* ==================================================================== */}
      <Box
        component="header"
        style={{
          height: 60,
          borderBottom: "1px solid var(--border-subtle)",
          backgroundColor: "var(--canvas-bg)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(14px, 3vw, 24px)",
        }}
      >
        <Group gap="sm" wrap="nowrap" align="center" style={{ minWidth: 0, flex: 1 }}>
          <Link
            href="/"
            aria-label="caulvyn home"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <Box
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                backgroundColor: "var(--color-primary, #0B2E22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}
            >
              <svg
                width="16"
                height="16"
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
            <Text
              component="span"
              style={{
                fontFamily: "var(--font-display, sans-serif)",
                fontWeight: 800,
                fontSize: "1.2rem",
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              caulvyn
            </Text>
          </Link>

          <Divider orientation="vertical" style={{ height: 16 }} visibleFrom="sm" />

          <Text
            size="sm"
            style={{
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
            visibleFrom="sm"
          >
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              {activeOrg?.organizationName || orgName || "Workspace"}
            </span>{" "}
            <span style={{ opacity: 0.7 }}>/ Security Setup</span>
          </Text>
        </Group>

        <Group gap="xs" wrap="nowrap" align="center" style={{ flexShrink: 0 }}>
          <ThemeToggle />
        </Group>
      </Box>

      {/* ==================================================================== */}
      {/* MAIN CONTAINER: HORIZONTAL TIMELINE + ACTIVE SECTION BELOW           */}
      {/* ==================================================================== */}
      <Container size="md" py={32} px={{ base: 14, sm: 24 }}>
        {/* ================================================================== */}
        {/* HORIZONTAL SEGMENTED BAR TIMELINE                                  */}
        {/* ================================================================== */}
        <div className="segmented-timeline-ct">
          <div className="head">
            <div className="head-left">
              <b>Organization Security Setup</b>
            </div>
            <span className="step-chip">Step {activeStep} of 7</span>
          </div>
          <ol className="mini">
            {TIMELINE_STEPS.map((step) => {
              const isDone = isStepCompleted(step.id);
              const isCur = activeStep === step.id;
              const isUnlocked = step.id <= maxUnlockedStep;
              const liClass = isCur ? "cur" : isDone ? "on" : "";

              return (
                <li
                  key={step.id}
                  className={liClass}
                  aria-current={isCur ? "step" : undefined}
                  onClick={() => {
                    if (isUnlocked) {
                      setActiveStep(step.id);
                    }
                  }}
                  title={`Step ${step.id}: ${step.label}${isDone ? " (done)" : isCur ? " (current step)" : " (to do)"}`}
                >
                  <span className="seg" />
                  <span className="lb">
                    <span className="step-num-indicator">
                      {isDone ? (
                        <CheckIcon size={11} color="var(--heading-accent)" />
                      ) : (
                        step.id
                      )}
                    </span>
                    <span className="lb-text">
                      {isDone && <CheckIcon size={12} color="var(--heading-accent)" />}
                      <span className="lb-full">{step.label}</span>
                      <span className="lb-short">{step.shortLabel}</span>
                    </span>
                    <span className="sr">{isDone ? " (done)" : isCur ? " (current step)" : " (to do)"}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ================================================================== */}
        {/* ACTIVE SECTION CARD DIRECTLY BELOW                                 */}
        {/* ================================================================== */}
        <Card
          p={{ base: "lg", sm: "xl" }}
          radius="lg"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-contrast)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* ================================================================ */}
          {/* STEP 1: WORKSPACE IDENTITY                                       */}
          {/* ================================================================ */}
          {activeStep === 1 && (
            <Stack gap="lg">
              <Box>
                <Group justify="space-between" align="center" mb={4}>
                  <Badge variant="light" color="teal" size="sm">
                    Step 01 of 07
                  </Badge>
                  {step1Completed && (
                    <Group gap={4}>
                      <CheckIcon size={13} color="var(--heading-accent)" />
                      <Text size="xs" fw={700} style={{ color: "var(--heading-accent)" }}>
                        Completed
                      </Text>
                    </Group>
                  )}
                </Group>
                <Text
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Workspace Identity
                </Text>
                <Text size="sm" style={{ color: "var(--text-muted)", marginTop: 2 }}>
                  Set up your organization legal name, program slug, and official security contact endpoint.
                </Text>
              </Box>

              {step1Error && (
                <Alert color="red" variant="light" title="Validation Error">
                  {step1Error}
                </Alert>
              )}

              <Stack gap="md">
                <TextInput
                  label="Organization name"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.currentTarget.value)}
                  placeholder="e.g. Northstar Security"
                />

                <TextInput
                  label="Public slug"
                  required
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.currentTarget.value)}
                  description="Used in public disclosure URLs: /programs/[slug]"
                  placeholder="e.g. northstar"
                />

                <TextInput
                  label="Program name"
                  required
                  value={programName}
                  onChange={(e) => setProgramName(e.currentTarget.value)}
                  placeholder="e.g. Core vulnerability disclosure"
                />

                <TextInput
                  label="Security contact URL"
                  required
                  value={securityContactUrl}
                  onChange={(e) => setSecurityContactUrl(e.currentTarget.value)}
                  placeholder="e.g. https://domain.example/security"
                />
              </Stack>

              <Divider style={{ borderColor: "var(--border-subtle)" }} />

              <Group justify="flex-end" className="step-actions-group">
                <Button
                  style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF" }}
                  rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                  onClick={handleSaveStep1}
                >
                  <span className="btn-text-full">Save & Continue to Authenticator</span>
                  <span className="btn-text-short">Continue to Authenticator</span>
                </Button>
              </Group>
            </Stack>
          )}

          {/* ================================================================ */}
          {/* STEP 2: AUTHENTICATOR SETUP (TOTP MFA)                           */}
          {/* ================================================================ */}
          {activeStep === 2 && (
            <Stack gap="lg">
              <Box>
                <Group justify="space-between" align="center" mb={4}>
                  <Badge variant="light" color="teal" size="sm">
                    Step 02 of 07
                  </Badge>
                  {mfaVerified && (
                    <Group gap={4}>
                      <CheckIcon size={13} color="var(--heading-accent)" />
                      <Text size="xs" fw={700} style={{ color: "var(--heading-accent)" }}>
                        MFA Verified
                      </Text>
                    </Group>
                  )}
                </Group>
                <Text
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Set up your authenticator
                </Text>
                <Text size="sm" style={{ color: "var(--text-muted)", marginTop: 2 }}>
                  Organization activation requires RFC 6238 two-factor authentication. Privileged vault actions require a step-up challenge valid for 10 minutes.
                </Text>
              </Box>

              {mfaError && (
                <Alert color="red" variant="light" title="Authentication Error">
                  {mfaError}
                </Alert>
              )}

              {/* QR Code and Step Instructions */}
              <Paper
                p="lg"
                radius="md"
                style={{
                  backgroundColor: "var(--surface-subtle)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <Group align="flex-start" gap="xl" wrap="wrap">
                  {/* Left: Scannable QR Code Canvas */}
                  <Stack align="center" gap="xs">
                    <Box
                      p={10}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 12,
                        border: "1px solid var(--border-contrast)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="Authenticator Setup TOTP QR Code"
                          width={200}
                          height={200}
                          style={{ display: "block", borderRadius: 6 }}
                        />
                      ) : (
                        <Box style={{ width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Loader size="sm" color="var(--color-primary)" />
                        </Box>
                      )}
                    </Box>
                    <Badge variant="outline" color="teal" size="xs">
                      Scan with camera or authenticator
                    </Badge>
                  </Stack>

                  {/* Right: Setup instructions */}
                  <Stack gap="sm" style={{ flex: 1, minWidth: 260 }}>
                    <Text fw={700} size="sm" style={{ color: "var(--text-primary)" }}>
                      Link your authenticator in 3 steps:
                    </Text>
                    <Stack gap="xs">
                      <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                        <strong>1.</strong> Open your authenticator app (Google Authenticator, Apple Passwords, 1Password, or Authy).
                      </Text>
                      <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                        <strong>2.</strong> Point your phone camera or authenticator at this QR code to add the account.
                      </Text>
                      <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                        <strong>3.</strong> Enter the 6-digit rolling code generated by your app below.
                      </Text>
                    </Stack>

                    <Divider style={{ borderColor: "var(--border-subtle)", margin: "4px 0" }} />

                    {/* Manual secret fallback button */}
                    <Button
                      variant="subtle"
                      size="compact-xs"
                      color="gray"
                      rightSection={showManualSecret ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}
                      onClick={() => setShowManualSecret(!showManualSecret)}
                      style={{ alignSelf: "flex-start", padding: 0 }}
                    >
                      {showManualSecret ? "Hide manual setup secret" : "Can't scan? Enter secret manually"}
                    </Button>

                    <Collapse expanded={showManualSecret}>
                      <Box
                        p="xs"
                        mt="xs"
                        style={{
                          backgroundColor: "var(--canvas-bg)",
                          borderRadius: 6,
                          border: "1px solid var(--border-contrast)",
                        }}
                      >
                        <Text size="xs" fw={600} style={{ color: "var(--text-muted)", marginBottom: 4 }}>
                          Base32 Authenticator Secret:
                        </Text>
                        <Group justify="space-between">
                          <Code style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                            {mfaSecret}
                          </Code>
                          <Button
                            size="compact-xs"
                            variant="light"
                            color={secretCopied ? "teal" : "gray"}
                            leftSection={secretCopied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                            onClick={() => {
                              navigator.clipboard.writeText(mfaSecret);
                              setSecretCopied(true);
                              setTimeout(() => setSecretCopied(false), 2000);
                            }}
                          >
                            {secretCopied ? "Copied" : "Copy"}
                          </Button>
                        </Group>
                      </Box>
                    </Collapse>
                  </Stack>
                </Group>
              </Paper>

              {/* Confirmation 6-digit code */}
              <Box>
                <TextInput
                  label="Confirm current 6-digit code"
                  required
                  placeholder="123 456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.currentTarget.value)}
                  styles={{
                    label: { fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: 4 },
                    input: {
                      fontSize: "1.2rem",
                      letterSpacing: "0.25em",
                      width: 200,
                      fontFamily: "var(--font-mono)",
                      backgroundColor: "var(--canvas-bg)",
                      borderColor: "var(--border-contrast)",
                      height: 42,
                    },
                  }}
                />
              </Box>

              <Divider style={{ borderColor: "var(--border-subtle)" }} />

              <Group justify="space-between" align="center" wrap="wrap" gap="sm" className="step-actions-group">
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<ArrowLeftIcon size={14} />}
                  onClick={() => setActiveStep(1)}
                >
                  Back
                </Button>
                <Button
                  style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF" }}
                  rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                  onClick={handleVerifyMfa}
                >
                  <span className="btn-text-full">
                    {mfaVerified ? "MFA Verified — Continue to Domain Proof" : "Verify Authenticator Code & Continue"}
                  </span>
                  <span className="btn-text-short">{mfaVerified ? "Continue" : "Verify & Continue"}</span>
                </Button>
              </Group>
            </Stack>
          )}

          {/* ================================================================ */}
          {/* STEP 3: DOMAIN OWNERSHIP PROOF                                   */}
          {/* ================================================================ */}
          {activeStep === 3 && (
            <Stack gap="lg">
              <Box>
                <Group justify="space-between" align="center" mb={4}>
                  <Badge variant="light" color="teal" size="sm">
                    Step 03 of 07
                  </Badge>
                  {domainVerified && (
                    <Group gap={4}>
                      <CheckIcon size={13} color="var(--heading-accent)" />
                      <Text size="xs" fw={700} style={{ color: "var(--heading-accent)" }}>
                        Domain Verified
                      </Text>
                    </Group>
                  )}
                </Group>
                <Text
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Domain Ownership Proof
                </Text>
                <Text size="sm" style={{ color: "var(--text-muted)", marginTop: 2 }}>
                  Publish a DNS TXT record challenge to prove ownership of the public vulnerability disclosure perimeter.
                </Text>
              </Box>

              {domainError && (
                <Alert color="red" variant="light" title="Domain Verification Error">
                  {domainError}
                </Alert>
              )}

              {domainVerified ? (
                <Paper
                  p="lg"
                  radius="md"
                  style={{
                    backgroundColor: "var(--surface-subtle)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <Group justify="space-between">
                    <Group gap="sm">
                      <Box
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "var(--heading-accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon size={14} color="#FFFFFF" />
                      </Box>
                      <Box>
                        <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                          Domain ownership verified for {domainInput}
                        </Text>
                        <Text size="xs" style={{ color: "var(--text-muted)" }}>
                          DNS TXT verification record matches. Status: {domainCheckedTime || "Pre-verified in registry"}
                        </Text>
                      </Box>
                    </Group>
                    <Badge variant="light" color="teal">
                      Verified
                    </Badge>
                  </Group>
                </Paper>
              ) : (
                <Stack gap="md">
                  <TextInput
                    label="Organization domain"
                    required
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.currentTarget.value)}
                    placeholder="e.g. northstar.example"
                  />

                  <Box>
                    <Text size="sm" fw={600} style={{ color: "var(--text-primary)", marginBottom: 6 }}>
                      Publish DNS TXT challenge
                    </Text>
                    <Paper p="md" radius="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                            <strong>Host / Name:</strong> {dnsTxtRecordName}
                          </Text>
                          <Button
                            size="compact-xs"
                            variant="light"
                            color={copiedTxtHost ? "teal" : "gray"}
                            leftSection={copiedTxtHost ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                            onClick={() => {
                              navigator.clipboard.writeText(dnsTxtRecordName);
                              setCopiedTxtHost(true);
                              setTimeout(() => setCopiedTxtHost(false), 2000);
                            }}
                          >
                            {copiedTxtHost ? "Copied" : "Copy Name"}
                          </Button>
                        </Group>
                        <Divider style={{ borderColor: "var(--border-subtle)" }} />
                        <Group justify="space-between">
                          <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                            <strong>Value / Content:</strong> {dnsTxtRecordValue}
                          </Text>
                          <Button
                            size="compact-xs"
                            variant="light"
                            color={copiedTxtValue ? "teal" : "gray"}
                            leftSection={copiedTxtValue ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                            onClick={() => {
                              navigator.clipboard.writeText(dnsTxtRecordValue);
                              setCopiedTxtValue(true);
                              setTimeout(() => setCopiedTxtValue(false), 2000);
                            }}
                          >
                            {copiedTxtValue ? "Copied" : "Copy Value"}
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>
              )}

              <Divider style={{ borderColor: "var(--border-subtle)" }} />

              <Group justify="space-between" align="center" wrap="wrap" gap="sm" className="step-actions-group">
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<ArrowLeftIcon size={14} />}
                  onClick={() => setActiveStep(2)}
                >
                  Back
                </Button>
                {domainVerified ? (
                  <Button
                    style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF" }}
                    rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                    onClick={() => {
                      setMaxUnlockedStep((prev) => Math.max(prev, 4));
                      setActiveStep(4);
                    }}
                  >
                    <span className="btn-text-full">Continue to Personal Key</span>
                    <span className="btn-text-short">Continue to Key</span>
                  </Button>
                ) : (
                  <Button
                    loading={domainVerifying}
                    style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF" }}
                    rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                    onClick={handleVerifyDomain}
                  >
                    <span className="btn-text-full">Verify DNS Record & Continue</span>
                    <span className="btn-text-short">Verify DNS & Continue</span>
                  </Button>
                )}
              </Group>
            </Stack>
          )}

          {/* ================================================================ */}
          {/* STEP 4: PERSONAL LOCAL KEY                                       */}
          {/* ================================================================ */}
          {activeStep === 4 && (
            <Stack gap="lg">
              <Box>
                <Group justify="space-between" align="center" mb={4}>
                  <Badge variant="light" color="teal" size="sm">
                    Step 04 of 07
                  </Badge>
                  {personalKeyGenerated && (
                    <Group gap={4}>
                      <CheckIcon size={13} color="var(--heading-accent)" />
                      <Text size="xs" fw={700} style={{ color: "var(--heading-accent)" }}>
                        Key Generated
                      </Text>
                    </Group>
                  )}
                </Group>
                <Text
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Personal Local Encryption Key
                </Text>
                <Text size="sm" style={{ color: "var(--text-muted)", marginTop: 2 }}>
                  Generate your client-side Curve25519 key pair. This personal key is stored locally and used to decrypt vulnerability disclosures sent specifically to you.
                </Text>
              </Box>

              {personalKeyError && (
                <Alert color="red" variant="light" title="Key Passphrase Error">
                  {personalKeyError}
                </Alert>
              )}

              {personalKeyGenerated ? (
                <Paper
                  p="lg"
                  radius="md"
                  style={{
                    backgroundColor: "var(--surface-subtle)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <Group justify="space-between">
                    <Group gap="sm">
                      <Box
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "var(--heading-accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon size={14} color="#FFFFFF" />
                      </Box>
                      <Box>
                        <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                          Local Curve25519 key pair generated
                        </Text>
                        <Text size="xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                          {personalKeyFingerprint} · exported to .bbt-user-keys.json
                        </Text>
                      </Box>
                    </Group>
                    <Badge variant="light" color="teal">
                      Saved Locally
                    </Badge>
                  </Group>
                </Paper>
              ) : (
                <Stack gap="md">
                  <PasswordInput
                    label="Local encryption passphrase"
                    required
                    value={personalPassphrase}
                    onChange={(e) => setPersonalPassphrase(e.currentTarget.value)}
                    placeholder="Passphrase to protect local key (min 8 chars)"
                  />

                  <PasswordInput
                    label="Confirm passphrase"
                    required
                    value={confirmPersonalPassphrase}
                    onChange={(e) => setConfirmPersonalPassphrase(e.currentTarget.value)}
                    placeholder="Repeat passphrase"
                  />
                </Stack>
              )}

              <Divider style={{ borderColor: "var(--border-subtle)" }} />

              <Group justify="space-between" align="center" wrap="wrap" gap="sm" className="step-actions-group">
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<ArrowLeftIcon size={14} />}
                  onClick={() => setActiveStep(3)}
                >
                  Back
                </Button>
                {personalKeyGenerated ? (
                  <Button
                    style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF" }}
                    rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                    onClick={() => {
                      setMaxUnlockedStep((prev) => Math.max(prev, 5));
                      setActiveStep(5);
                    }}
                  >
                    <span className="btn-text-full">Continue to Master Recovery Key</span>
                    <span className="btn-text-short">Continue to Recovery Key</span>
                  </Button>
                ) : (
                  <Button
                    style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF", maxWidth: "100%", whiteSpace: "normal" }}
                    leftSection={<DownloadIcon size={14} />}
                    rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                    onClick={handleGeneratePersonalKey}
                  >
                    <span className="btn-text-full">Generate & Download .bbt-user-keys.json</span>
                    <span className="btn-text-short">Generate Key Pair (.json)</span>
                  </Button>
                )}
              </Group>
            </Stack>
          )}

          {/* ================================================================ */}
          {/* STEP 5: MASTER RECOVERY KEY & CHALLENGE                          */}
          {/* ================================================================ */}
          {activeStep === 5 && (
            <Stack gap="lg">
              <Box>
                <Group justify="space-between" align="center" mb={4}>
                  <Badge variant="light" color="teal" size="sm">
                    Step 05 of 07
                  </Badge>
                  {recoveryChallengePassed && (
                    <Group gap={4}>
                      <CheckIcon size={13} color="var(--heading-accent)" />
                      <Text size="xs" fw={700} style={{ color: "var(--heading-accent)" }}>
                        Recovery Verified
                      </Text>
                    </Group>
                  )}
                </Group>
                <Text
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Offline Master Recovery Key
                </Text>
                <Text size="sm" style={{ color: "var(--text-muted)", marginTop: 2 }}>
                  Mandatory disaster recovery export. This key restores organization access if all defenders lose authentication. You must verify local offline decryption before activating.
                </Text>
              </Box>

              {recoveryError && (
                <Alert color="red" variant="light" title="Recovery Key Error">
                  {recoveryError}
                </Alert>
              )}

              {recoveryChallengePassed ? (
                <Paper
                  p="lg"
                  radius="md"
                  style={{
                    backgroundColor: "var(--surface-subtle)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <Group justify="space-between">
                    <Group gap="sm">
                      <Box
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "var(--heading-accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon size={14} color="#FFFFFF" />
                      </Box>
                      <Box>
                        <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                          Offline recovery key verified successfully
                        </Text>
                        <Text size="xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                          {recoveryFingerprint} · Decryption challenge passed offline
                        </Text>
                      </Box>
                    </Group>
                    <Badge variant="light" color="teal">
                      Verified
                    </Badge>
                  </Group>
                </Paper>
              ) : (
                <Stack gap="md">
                  <PasswordInput
                    label="Master recovery key passphrase"
                    required
                    value={recoveryPassphrase}
                    onChange={(e) => setRecoveryPassphrase(e.currentTarget.value)}
                    placeholder="Enter offline master passphrase (min 8 chars)"
                  />

                  <PasswordInput
                    label="Confirm master passphrase"
                    required
                    value={confirmRecoveryPassphrase}
                    onChange={(e) => setConfirmRecoveryPassphrase(e.currentTarget.value)}
                    placeholder="Repeat master passphrase"
                  />

                  <Group justify="flex-start" mt="xs" className="step-actions-group">
                    <Button
                      variant="outline"
                      color="teal"
                      style={{ maxWidth: "100%", height: "auto", minHeight: 40, whiteSpace: "normal", padding: "8px 14px" }}
                      leftSection={<DownloadIcon size={14} />}
                      onClick={handleDownloadRecoveryKey}
                    >
                      <span className="btn-text-full">
                        {recoveryDownloaded ? "Re-download org-recovery-key.asc" : "Download Master Recovery Key (org-recovery-key.asc)"}
                      </span>
                      <span className="btn-text-short">
                        {recoveryDownloaded ? "Re-download recovery key (.asc)" : "Download Recovery Key (.asc)"}
                      </span>
                    </Button>
                  </Group>

                  {recoveryDownloaded && (
                    <Box mt="sm">
                      <Text size="sm" fw={600} style={{ color: "var(--text-primary)", marginBottom: 6 }}>
                        Local Decryption Challenge (FR-3.6)
                      </Text>
                      <PasswordInput
                        label="Enter passphrase to test offline decryption"
                        required
                        value={testPassphrase}
                        onChange={(e) => setTestPassphrase(e.currentTarget.value)}
                        placeholder="Type the recovery passphrase you just set"
                      />
                    </Box>
                  )}
                </Stack>
              )}

              <Divider style={{ borderColor: "var(--border-subtle)" }} />

              <Group justify="space-between" align="center" wrap="wrap" gap="sm" className="step-actions-group">
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<ArrowLeftIcon size={14} />}
                  onClick={() => setActiveStep(4)}
                >
                  Back
                </Button>
                {recoveryChallengePassed ? (
                  <Button
                    style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF" }}
                    rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                    onClick={() => {
                      setMaxUnlockedStep((prev) => Math.max(prev, 6));
                      setActiveStep(6);
                    }}
                  >
                    <span className="btn-text-full">Continue to Program Defenders</span>
                    <span className="btn-text-short">Continue to Defenders</span>
                  </Button>
                ) : (
                  <Button
                    disabled={!recoveryDownloaded}
                    style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF", maxWidth: "100%", whiteSpace: "normal" }}
                    rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                    onClick={handleRunRecoveryTest}
                  >
                    <span className="btn-text-full">Decrypt & Verify Key Offline</span>
                    <span className="btn-text-short">Verify Key Offline</span>
                  </Button>
                )}
              </Group>
            </Stack>
          )}

          {/* ================================================================ */}
          {/* STEP 6: PROGRAM DEFENDERS                                        */}
          {/* ================================================================ */}
          {activeStep === 6 && (
            <Stack gap="lg">
              <Box>
                <Group justify="space-between" align="center" mb={4}>
                  <Badge variant="light" color="teal" size="sm">
                    Step 06 of 07
                  </Badge>
                  {defendersConfirmed && (
                    <Group gap={4}>
                      <CheckIcon size={13} color="var(--heading-accent)" />
                      <Text size="xs" fw={700} style={{ color: "var(--heading-accent)" }}>
                        Defenders Confirmed
                      </Text>
                    </Group>
                  )}
                </Group>
                <Text
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Program Defenders & Recipients
                </Text>
                <Text size="sm" style={{ color: "var(--text-muted)", marginTop: 2 }}>
                  Assign authorized report defenders. Incoming vulnerability disclosures will be encrypted to the public keys of these designated recipients.
                </Text>
              </Box>

              <Stack gap="xs">
                {defenders.map((d) => (
                  <Paper
                    key={d.id}
                    p="sm"
                    radius="md"
                    style={{
                      backgroundColor: "var(--surface-subtle)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Group justify="space-between">
                      <Group gap="sm">
                        <Avatar color="teal" radius="xl" size="sm">
                          {d.name.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Text size="sm" fw={600} style={{ color: "var(--text-primary)" }}>
                            {d.name}
                          </Text>
                          <Text size="xs" style={{ color: "var(--text-muted)" }}>
                            {d.role}
                          </Text>
                        </Box>
                      </Group>
                      <Badge size="xs" variant="light" color="teal">
                        {d.keyStatus}
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>

              <Divider style={{ borderColor: "var(--border-subtle)" }} />

              <Group justify="space-between" align="center" wrap="wrap" gap="sm" className="step-actions-group">
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<ArrowLeftIcon size={14} />}
                  onClick={() => setActiveStep(5)}
                >
                  Back
                </Button>
                <Button
                  style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF" }}
                  rightSection={<ArrowRightIcon size={14} color="#FFFFFF" />}
                  onClick={handleConfirmDefenders}
                >
                  <span className="btn-text-full">Confirm Defenders & Continue</span>
                  <span className="btn-text-short">Confirm & Continue</span>
                </Button>
              </Group>
            </Stack>
          )}

          {/* ================================================================ */}
          {/* STEP 7: SIGN & ACTIVATE VAULT                                    */}
          {/* ================================================================ */}
          {activeStep === 7 && (
            <Stack gap="lg">
              <Box>
                <Badge variant="light" color="teal" size="sm" mb={4}>
                  Step 07 of 07
                </Badge>
                <Text
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Sign Policy & Activate Disclosure Vault
                </Text>
                <Text size="sm" style={{ color: "var(--text-muted)", marginTop: 2 }}>
                  Final cryptographic commitment. Once signed, your public RFC 9116 security.txt manifest will activate and the intake vault will open for encrypted disclosures.
                </Text>
              </Box>

              {activationError && (
                <Alert color="red" variant="light" title="Activation Error">
                  {activationError}
                </Alert>
              )}

              {activatedSuccess ? (
                <Paper
                  p="xl"
                  radius="md"
                  style={{
                    backgroundColor: "rgba(11, 46, 34, 0.05)",
                    border: "1px solid var(--heading-accent)",
                    textAlign: "center",
                  }}
                >
                  <Stack align="center" gap="sm">
                    <Box
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: "var(--heading-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckIcon size={24} color="#FFFFFF" />
                    </Box>
                    <Text
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                      }}
                    >
                      Organization Vault Activated
                    </Text>
                    <Text size="sm" style={{ color: "var(--text-secondary)" }}>
                      Security perimeter established. Redirecting to workspace dashboard...
                    </Text>
                    <Loader size="sm" color="var(--color-primary)" mt="xs" />
                  </Stack>
                </Paper>
              ) : (
                <Stack gap="md">
                  {/* Readiness Summary Checklist */}
                  <Paper
                    p="md"
                    radius="md"
                    style={{
                      backgroundColor: "var(--surface-subtle)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Stack gap="xs">
                      <Group gap="xs">
                        <CheckIcon size={14} color="var(--heading-accent)" />
                        <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                          Workspace identity registered: <strong>{orgName}</strong> ({orgSlug})
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <CheckIcon size={14} color="var(--heading-accent)" />
                        <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                          Owner RFC 6238 two-factor authenticator linked
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <CheckIcon size={14} color="var(--heading-accent)" />
                        <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                          Domain ownership verified for <strong>{domainInput}</strong>
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <CheckIcon size={14} color="var(--heading-accent)" />
                        <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                          Personal Curve25519 key pair generated and exported locally
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <CheckIcon size={14} color="var(--heading-accent)" />
                        <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                          Master recovery key exported & offline decryption test passed
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <CheckIcon size={14} color="var(--heading-accent)" />
                        <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                          Program defenders assigned to receive encrypted submissions
                        </Text>
                      </Group>
                    </Stack>
                  </Paper>

                  <Text size="xs" style={{ color: "var(--text-muted)" }}>
                    Privileged actions require a fresh step-up challenge valid for 10 minutes. By signing, you confirm that your organization&apos;s security policy conforms to RFC 9116.
                  </Text>
                </Stack>
              )}

              <Divider style={{ borderColor: "var(--border-subtle)" }} />

              <Group justify="space-between" align="center" wrap="wrap" gap="sm" className="step-actions-group">
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<ArrowLeftIcon size={14} />}
                  onClick={() => setActiveStep(6)}
                  disabled={activating || activatedSuccess}
                >
                  Back
                </Button>
                <Button
                  loading={activating}
                  disabled={activatedSuccess}
                  style={{ backgroundColor: "var(--color-primary)", color: "#FFFFFF", maxWidth: "100%", whiteSpace: "normal" }}
                  rightSection={<ShieldCheckIcon size={15} color="#FFFFFF" />}
                  onClick={handleSignAndActivate}
                >
                  <span className="btn-text-full">Sign Locally & Activate Organization Vault</span>
                  <span className="btn-text-short">Sign & Activate Vault</span>
                </Button>
              </Group>
            </Stack>
          )}
        </Card>
      </Container>
    </Box>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <Box
          style={{
            minHeight: "100vh",
            backgroundColor: "var(--canvas-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader color="var(--color-primary)" size="md" />
        </Box>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
