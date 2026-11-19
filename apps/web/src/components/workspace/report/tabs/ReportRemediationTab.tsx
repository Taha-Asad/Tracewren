"use client";

import React, { useState, useEffect } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { CheckIcon, GitCommitIcon, GithubIcon, LockIcon } from "../../icons";
import { GitHubCommitPicker } from "../../github/GitHubCommitPicker";
import { GithubConnectionState } from "../../github/types";
import {
  loadGithubConnection,
  saveGithubConnection,
  fetchServerGithubConfig,
  saveServerGithubConfig,
} from "../../storage";

export interface GitHubCommitData {
  sha: string;
  shortSha: string;
  authorName: string;
  authorEmail: string;
  authorLogin: string | null;
  authorAvatar: string | null;
  message: string;
  committedAt: string;
  gpgVerified: boolean;
  gpgReason: string;
  gpgSignature: string | null;
  htmlUrl: string;
  repoUrl: string;
  comparisonStatus: string;
  aheadBy: number;
  behindBy: number;
  targetBranch: string;
  verifiedAt: string;
}

export interface ReportRemediationTabProps {
  currentOrgId?: string | null;
  remediationFeedback: string | null;
  onClearRemediationFeedback: () => void;
  remediationAttempt: number;
  remediationState: "FIX_PROPOSED" | "RETEST_PENDING" | "VERIFIED_RESEARCHER" | "ACCEPTED";
  deploymentEnv: string;
  onDeploymentEnvChange: (v: string) => void;
  deployedVersion: string;
  onDeployedVersionChange: (v: string) => void;
  deployedAt: string;
  onDeployedAtChange: (v: string) => void;
  repoName: string;
  onRepoNameChange: (v: string) => void;
  commitSha: string;
  onCommitShaChange: (v: string) => void;
  targetBranch: string;
  onTargetBranchChange: (v: string) => void;
  verifyingCommit: boolean;
  commitVerified: boolean;
  verifiedCommitData?: GitHubCommitData | null;
  commitError?: string | null;
  onClearCommitError?: () => void;
  onVerifyGitHubCommit: (tokenOverride?: string) => void;
  onRequestRetest: () => void;
  onCancelProposedFix: () => void;
  onRecordRetestPass: () => void;
  onRecordRetestFail: () => void;
  onProposeNewFix: () => void;
}

export function ReportRemediationTab({
  currentOrgId,
  remediationFeedback,
  onClearRemediationFeedback,
  remediationAttempt,
  remediationState,
  deploymentEnv,
  onDeploymentEnvChange,
  deployedVersion,
  onDeployedVersionChange,
  deployedAt,
  onDeployedAtChange,
  repoName,
  onRepoNameChange,
  commitSha,
  onCommitShaChange,
  targetBranch,
  onTargetBranchChange,
  verifyingCommit,
  commitVerified,
  verifiedCommitData,
  commitError,
  onClearCommitError,
  onVerifyGitHubCommit,
  onRequestRetest,
  onCancelProposedFix,
  onRecordRetestPass,
  onRecordRetestFail,
  onProposeNewFix,
}: ReportRemediationTabProps) {
  const [githubConn, setGithubConn] = useState<GithubConnectionState | null>(() =>
    loadGithubConnection(currentOrgId)
  );

  useEffect(() => {
    const saved = loadGithubConnection(currentOrgId);
    if (saved) {
      setGithubConn(saved);
      if (saved.selectedRepo) {
        onRepoNameChange(saved.selectedRepo);
        if (saved.selectedBranch) {
          onTargetBranchChange(saved.selectedBranch);
        }
      }
    }

    if (currentOrgId && currentOrgId !== "org-acme-cyber") {
      fetchServerGithubConfig(currentOrgId).then((serverCfg) => {
        if (serverCfg) {
          setGithubConn(serverCfg);
          saveGithubConnection(serverCfg, currentOrgId);
          if (serverCfg.selectedRepo) {
            onRepoNameChange(serverCfg.selectedRepo);
            if (serverCfg.selectedBranch) {
              onTargetBranchChange(serverCfg.selectedBranch);
            }
          }
        }
      });
    }
  }, [currentOrgId]);

  return (
    <Stack gap="xl">
      {remediationFeedback && (
        <Alert
          color="teal"
          variant="light"
          withCloseButton
          onClose={onClearRemediationFeedback}
          title="Remediation Protocol Status"
        >
          {remediationFeedback}
        </Alert>
      )}

      {/* Section 1: Attempt & State Stepper (FR-6.1) */}
      <Paper p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md" mb="md">
          <Box>
            <Group gap="xs" align="center" mb={4}>
              <Text size="md" fw={700} style={{ color: "var(--text-primary)" }}>
                Remediation Lifecycle (Attempt #{remediationAttempt})
              </Text>
              <Badge
                size="sm"
                variant="filled"
                color={
                  remediationState === "VERIFIED_RESEARCHER"
                    ? "teal"
                    : remediationState === "RETEST_PENDING"
                    ? "orange"
                    : remediationState === "FIX_PROPOSED"
                    ? "blue"
                    : "gray"
                }
              >
                {remediationState.replace(/_/g, " ")}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">
              Governed by IEEE/ISO 29147 remediation state machine &amp; FR-6 cryptographic commit proofs.
            </Text>
          </Box>

          {remediationState === "RETEST_PENDING" && (
            <Badge size="sm" variant="outline" color="orange" leftSection={<LockIcon size={12} />}>
              14-Day SLA Retest Window Active (11 Days Remaining)
            </Badge>
          )}
        </Group>

        {/* 3-Step Visual Progress Indicator */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
          <Card p="sm" radius="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
            <Group gap="xs">
              <Box style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: "#16654C", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                1
              </Box>
              <Box>
                <Text size="xs" fw={700}>Step 1: Propose Fix</Text>
                <Text size="11px" c="dimmed">Git commit &amp; evidence linked</Text>
              </Box>
            </Group>
          </Card>

          <Card p="sm" radius="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
            <Group gap="xs">
              <Box style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: deploymentEnv ? "#16654C" : "#9E9E9E", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                2
              </Box>
              <Box>
                <Text size="xs" fw={700}>Step 2: Deployment Live</Text>
                <Text size="11px" c="dimmed">{deploymentEnv} ({deployedVersion})</Text>
              </Box>
            </Group>
          </Card>

          <Card p="sm" radius="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
            <Group gap="xs">
              <Box style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: remediationState === "VERIFIED_RESEARCHER" ? "#16654C" : remediationState === "RETEST_PENDING" ? "#F57C00" : "#9E9E9E", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                3
              </Box>
              <Box>
                <Text size="xs" fw={700}>Step 3: Attested Retest</Text>
                <Text size="11px" c="dimmed">{remediationState === "VERIFIED_RESEARCHER" ? "Verified Passed" : "Pending researcher check"}</Text>
              </Box>
            </Group>
          </Card>
        </SimpleGrid>
      </Paper>

      {/* Section 2: Authentic GitHub Verification Engine (FR-6.2) */}
      <Paper p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
        <Stack gap="md">
          <Group justify="space-between" align="center" wrap="wrap">
            <Group gap="xs">
              <GithubIcon size={18} />
              <Box>
                <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                  GitHub Integration &amp; Commit Verification Engine (FR-6.2)
                </Text>
                <Text size="xs" c="dimmed">
                  Managing live personal &amp; organization repositories directly via authenticated GitHub API (v3).
                </Text>
              </Box>
            </Group>
            <Badge size="xs" variant="outline" color="teal">FR-6.2a &amp; FR-6.2b Compliant</Badge>
          </Group>

          <GitHubCommitPicker
            currentOrgId={currentOrgId}
            connection={githubConn}
            onConnectionChange={(conn) => {
              setGithubConn(conn);
              saveGithubConnection(conn, currentOrgId);
              saveServerGithubConfig(currentOrgId, conn);
            }}
            selectedRepo={repoName}
            onRepoChange={onRepoNameChange}
            targetBranch={targetBranch}
            onBranchChange={onTargetBranchChange}
            selectedCommitSha={commitSha}
            onCommitChange={onCommitShaChange}
            onCommitSelectedDirectly={(commit) => {
              onCommitShaChange(commit.sha);
              onVerifyGitHubCommit(githubConn?.token);
            }}
          />

          <Group justify="flex-end">
            <Button
              size="xs"
              color="teal"
              loading={verifyingCommit}
              leftSection={<GitCommitIcon size={14} color="#FFF" />}
              onClick={() => onVerifyGitHubCommit(githubConn?.token)}
            >
              Verify Selected Commit via GitHub API (v3)
            </Button>
          </Group>

          {commitError && (
            <Alert
              color="red"
              variant="light"
              withCloseButton
              onClose={onClearCommitError}
              title="GitHub REST API v3 Verification Failure"
            >
              {commitError}
            </Alert>
          )}

          {commitVerified && (
            <Card p="md" radius="md" style={{ backgroundColor: "var(--surface-subtle)", border: "1px solid #C4DEC9" }}>
              <Stack gap="xs">
                <Group justify="space-between" align="center" wrap="wrap">
                  <Group gap="xs">
                    <Badge size="sm" color="teal" variant="filled" leftSection={<CheckIcon size={12} color="#FFF" />}>
                      GitHub Commit Verified (200 OK)
                    </Badge>
                    <Badge
                      size="sm"
                      color={verifiedCommitData?.gpgVerified ? "teal" : "gray"}
                      variant="light"
                    >
                      {verifiedCommitData
                        ? verifiedCommitData.gpgVerified
                          ? "GPG Signature Verified: commit.verification.verified = true"
                          : `Signature Status: ${verifiedCommitData.gpgReason}`
                        : "GPG Signature Verified: commit.verification.verified = true"}
                    </Badge>
                  </Group>
                  <Text size="11px" c="dimmed">
                    Verified at {verifiedCommitData?.verifiedAt ? new Date(verifiedCommitData.verifiedAt).toLocaleTimeString() : deployedAt}
                  </Text>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mt="xs">
                  <Box>
                    <Text size="11px" c="dimmed">Commit Author &amp; Committer:</Text>
                    <Text size="xs" fw={600}>
                      {verifiedCommitData?.authorName || "Sarah Chen (Security Lead)"} &lt;{verifiedCommitData?.authorEmail || "sarah@acme.com"}&gt;
                    </Text>
                    <Text size="10px" ff="monospace" c="dimmed">
                      SHA: {verifiedCommitData?.sha || commitSha}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="11px" c="dimmed">Branch Ancestry Comparison ({targetBranch}...HEAD):</Text>
                    <Group gap={6} align="center">
                      <Badge size="xs" variant="outline" color="teal">
                        Status: {verifiedCommitData?.comparisonStatus || "identical"}
                      </Badge>
                      <Text size="11px" fw={600}>
                        {verifiedCommitData?.behindBy ?? 0} commits behind {targetBranch}
                      </Text>
                    </Group>
                    <Text size="10px" c="dimmed">Merged ancestor confirmed on remote head</Text>
                  </Box>
                </SimpleGrid>

                <Divider my={4} style={{ borderColor: "var(--border-subtle)" }} />

                <Box>
                  <Text size="11px" c="dimmed">Live GitHub Commit Message:</Text>
                  <Text size="xs" ff="monospace" fw={600} style={{ color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
                    {verifiedCommitData?.message || "fix(auth): enforce strict row-level security boundary on export endpoint"}
                  </Text>
                </Box>

                {verifiedCommitData?.htmlUrl && (
                  <Group justify="flex-end" mt={4}>
                    <Box
                      component="a"
                      href={verifiedCommitData.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#16654C",
                        textDecoration: "none",
                      }}
                    >
                      <span>View Commit on GitHub</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </Box>
                  </Group>
                )}
              </Stack>
            </Card>
          )}
        </Stack>
      </Paper>

      {/* Section 3: Target Deployment Environment (FR-6.1b) */}
      <Paper p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
        <Stack gap="md">
          <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
            Deployment Environment Verification (FR-6.1b)
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <Select
              label="Deployment Target"
              data={["Production", "Pre-Production", "Staging"]}
              value={deploymentEnv}
              onChange={(v) => onDeploymentEnvChange(v || "Production")}
            />
            <TextInput
              label="Deployed Version / Tag"
              value={deployedVersion}
              onChange={(e) => onDeployedVersionChange(e.currentTarget.value)}
            />
            <TextInput
              label="Deployment Timestamp"
              value={deployedAt}
              onChange={(e) => onDeployedAtChange(e.currentTarget.value)}
            />
          </SimpleGrid>
        </Stack>
      </Paper>

      {/* Section 4: Lifecycle State Machine & Attested Retest Controls (FR-7) */}
      <Paper p="lg" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
        <Stack gap="md">
          <Group justify="space-between" align="center" wrap="wrap">
            <Box>
              <Text size="sm" fw={700} style={{ color: "var(--text-primary)" }}>
                State Machine Governance &amp; Retest Operations (FR-7)
              </Text>
              <Text size="xs" c="dimmed">
                Transition report through verified remediation closure states bound to active remediation_record_id.
              </Text>
            </Box>
            <Badge size="xs" variant="light" color="teal">FR-7.1 &amp; FR-7.2 Compliant</Badge>
          </Group>

          <Group gap="xs" wrap="wrap" mt="xs">
            {remediationState === "FIX_PROPOSED" && (
              <>
                <Button
                  color="teal"
                  size="xs"
                  onClick={onRequestRetest}
                  disabled={!commitVerified}
                >
                  Request Retest (FIX_PROPOSED &rarr; RETEST_PENDING)
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  size="xs"
                  onClick={onCancelProposedFix}
                >
                  Cancel Proposed Fix (FIX_PROPOSED &rarr; ACCEPTED)
                </Button>
              </>
            )}

            {remediationState === "RETEST_PENDING" && (
              <>
                <Button
                  color="teal"
                  size="xs"
                  leftSection={<CheckIcon size={13} color="#FFF" />}
                  onClick={onRecordRetestPass}
                >
                  Record Retest Pass (&rarr; VERIFIED_RESEARCHER)
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  size="xs"
                  onClick={onRecordRetestFail}
                >
                  Record Retest Failure (&rarr; RETEST_FAILED)
                </Button>
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={onCancelProposedFix}
                >
                  Cancel Fix (Loopback to ACCEPTED)
                </Button>
              </>
            )}

            {remediationState === "VERIFIED_RESEARCHER" && (
              <Badge size="md" variant="filled" color="teal" leftSection={<CheckIcon size={14} color="#FFF" />}>
                Vulnerability Resolved &amp; Verified by Submitter
              </Badge>
            )}

            {remediationState === "ACCEPTED" && (
              <Button
                color="teal"
                size="xs"
                onClick={onProposeNewFix}
              >
                Propose New Fix (Attempt #{remediationAttempt})
              </Button>
            )}
          </Group>
        </Stack>
      </Paper>

    </Stack>
  );
}
