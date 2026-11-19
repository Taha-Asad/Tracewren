"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { CheckIcon, GitCommitIcon, GitBranchIcon, GithubIcon, LockIcon } from "../icons";
import { GitHubRepo, GitHubCommitSummary, GithubConnectionState } from "./types";
import { ConnectGithubModal } from "./ConnectGithubModal";

export interface GitHubCommitPickerProps {
  currentOrgId?: string | null;
  connection: GithubConnectionState | null;
  onConnectionChange: (conn: GithubConnectionState | null) => void;
  selectedRepo: string;
  onRepoChange: (repo: string) => void;
  targetBranch: string;
  onBranchChange: (branch: string) => void;
  selectedCommitSha: string;
  onCommitChange: (sha: string) => void;
  onCommitSelectedDirectly?: (commit: GitHubCommitSummary) => void;
}

export function GitHubCommitPicker({
  connection,
  onConnectionChange,
  selectedRepo,
  onRepoChange,
  targetBranch,
  onBranchChange,
  selectedCommitSha,
  onCommitChange,
  onCommitSelectedDirectly,
}: GitHubCommitPickerProps) {
  const [connectModalOpened, setConnectModalOpened] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);

  const [commits, setCommits] = useState<GitHubCommitSummary[]>([]);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [commitsError, setCommitsError] = useState<string | null>(null);

  const [showManualInput, setShowManualInput] = useState(false);

  // Fetch repositories whenever connection changes or refresh is requested
  const fetchRepositories = useCallback(async () => {
    if (!connection?.token) {
      setRepos([]);
      return;
    }

    setLoadingRepos(true);
    setReposError(null);

    try {
      const res = await fetch("/api/github/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: connection.token }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to fetch repositories.");
      }

      setRepos(data.repos || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading repositories.";
      setReposError(msg);
    } finally {
      setLoadingRepos(false);
    }
  }, [connection?.token]);

  useEffect(() => {
    if (connection?.connected && connection.token) {
      fetchRepositories();
    }
  }, [connection?.connected, connection?.token, fetchRepositories]);

  // Fetch live commits whenever repository or branch changes
  const fetchCommits = useCallback(async (repo: string, branch: string) => {
    if (!repo || !repo.includes("/")) {
      setCommits([]);
      return;
    }

    setLoadingCommits(true);
    setCommitsError(null);

    try {
      const res = await fetch("/api/github/commits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: connection?.token || undefined,
          repo,
          branch: branch || "main",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to fetch commits from GitHub.");
      }

      setCommits(data.commits || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load commits.";
      setCommitsError(msg);
      setCommits([]);
    } finally {
      setLoadingCommits(false);
    }
  }, [connection?.token]);

  useEffect(() => {
    if (selectedRepo && selectedRepo.includes("/")) {
      fetchCommits(selectedRepo, targetBranch);
    }
  }, [selectedRepo, targetBranch, fetchCommits]);

  const handleSelectRepo = (val: string | null) => {
    if (!val) return;
    onRepoChange(val);
    const matched = repos.find((r) => r.fullName === val);
    const branch = matched?.defaultBranch || "main";
    if (matched) {
      onBranchChange(branch);
    }
    if (connection) {
      onConnectionChange({
        ...connection,
        selectedRepo: val,
        selectedBranch: branch,
      });
    }
  };

  const handleBranchChange = (branch: string) => {
    onBranchChange(branch);
    if (connection) {
      onConnectionChange({
        ...connection,
        selectedBranch: branch,
      });
    }
  };

  const handleDisconnect = () => {
    onConnectionChange(null);
    setRepos([]);
    setCommits([]);
  };

  const selectRepoOptions = repos.map((r) => ({
    value: r.fullName,
    label: `${r.fullName} ${r.isPrivate ? "(Private)" : "(Public)"}`,
  }));

  return (
    <Stack gap="md">
      {/* GitHub Account Header Bar */}
      <Paper
        p="sm"
        radius="md"
        style={{
          backgroundColor: "var(--surface-subtle)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <Group justify="space-between" align="center" wrap="wrap" gap="xs">
          {connection?.connected && connection.user ? (
            <Group gap="sm" align="center">
              <Avatar src={connection.user.avatarUrl} radius="xl" size="md" />
              <Box>
                <Group gap="xs" align="center">
                  <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>
                    {connection.user.name} (@{connection.user.login})
                  </Text>
                  <Badge size="xs" variant="filled" color="teal">
                    GitHub Connected
                  </Badge>
                  {connection.user.totalPrivateRepos > 0 && (
                    <Badge size="xs" variant="outline" color="teal" leftSection={<LockIcon size={10} />}>
                      {connection.user.totalPrivateRepos} Private Repos
                    </Badge>
                  )}
                </Group>
                <Text size="11px" c="dimmed">
                  Managing personal and organization repositories directly via authenticated GitHub API.
                </Text>
              </Box>
            </Group>
          ) : (
            <Group gap="sm" align="center">
              <Box
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "var(--surface-card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--border-contrast)",
                }}
              >
                <GithubIcon size={18} />
              </Box>
              <Box>
                <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>
                  Connect Live GitHub Account
                </Text>
                <Text size="11px" c="dimmed">
                  Authenticate with GitHub to stream personal &amp; private repositories and select commits directly.
                </Text>
              </Box>
            </Group>
          )}

          <Group gap="xs">
            {connection?.connected ? (
              <>
                <Button
                  size="xs"
                  variant="subtle"
                  color="gray"
                  loading={loadingRepos}
                  onClick={fetchRepositories}
                >
                  Refresh Repos
                </Button>
                <Button size="xs" variant="default" color="red" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                size="xs"
                color="teal"
                leftSection={<GithubIcon size={14} />}
                onClick={() => setConnectModalOpened(true)}
              >
                Connect GitHub Account
              </Button>
            )}
          </Group>
        </Group>
      </Paper>

      {/* Repository & Branch Controls */}
      <Group grow align="flex-start" wrap="wrap">
        <Box style={{ flex: 2, minWidth: 260 }}>
          {repos.length > 0 ? (
            <Select
              label="Select Repository directly from GitHub"
              placeholder="Search your personal & organization repos..."
              searchable
              clearable={false}
              data={selectRepoOptions}
              value={selectedRepo}
              onChange={handleSelectRepo}
              description={`Discovered ${repos.length} repositories from your GitHub account.`}
              rightSection={loadingRepos ? <Loader size="xs" /> : undefined}
            />
          ) : (
            <TextInput
              label="GitHub Repository"
              placeholder="owner/repo (e.g. acme-cyber/core-api)"
              value={selectedRepo}
              onChange={(e) => onRepoChange(e.currentTarget.value)}
              description={
                connection?.connected
                  ? "Loading your repositories from GitHub..."
                  : "Connect your GitHub account above, or enter a public repository."
              }
              rightSection={loadingRepos ? <Loader size="xs" /> : undefined}
            />
          )}
          {reposError && (
            <Text size="11px" c="red" mt={4}>
              {reposError}
            </Text>
          )}
        </Box>

        <Box style={{ flex: 1, minWidth: 150 }}>
          <TextInput
            label="Target Release Branch"
            placeholder="main"
            value={targetBranch}
            onChange={(e) => handleBranchChange(e.currentTarget.value)}
            leftSection={<GitBranchIcon size={14} />}
            description="Branch ancestry target."
          />
        </Box>
      </Group>

      {/* Live Commit Stream */}
      <Box>
        <Group justify="space-between" align="center" mb="xs">
          <Group gap="xs">
            <GitCommitIcon size={16} />
            <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>
              Live Commits from GitHub ({selectedRepo || "No repository selected"})
            </Text>
          </Group>
          <Group gap="xs">
            {selectedRepo && (
              <Button
                size="compact-xs"
                variant="subtle"
                color="teal"
                loading={loadingCommits}
                onClick={() => fetchCommits(selectedRepo, targetBranch)}
              >
                Refresh Commits
              </Button>
            )}
            <Button
              size="compact-xs"
              variant="subtle"
              color="gray"
              onClick={() => setShowManualInput(!showManualInput)}
            >
              {showManualInput ? "Hide Manual SHA Input" : "Enter SHA Manually"}
            </Button>
          </Group>
        </Group>

        {showManualInput && (
          <Paper p="sm" mb="sm" radius="md" style={{ backgroundColor: "var(--surface-subtle)" }}>
            <TextInput
              label="Custom Commit SHA (40-hex)"
              placeholder="Enter specific commit hex SHA..."
              value={selectedCommitSha}
              onChange={(e) => onCommitChange(e.currentTarget.value)}
              description="Use this if you want to verify an older commit hash not listed below."
            />
          </Paper>
        )}

        {loadingCommits && (
          <Card p="md" radius="md" style={{ backgroundColor: "var(--surface-subtle)", textAlign: "center" }}>
            <Group justify="center" gap="xs">
              <Loader size="xs" color="teal" />
              <Text size="xs" c="dimmed">
                Streaming live commits from GitHub for <strong>{selectedRepo}</strong>...
              </Text>
            </Group>
          </Card>
        )}

        {commitsError && (
          <Alert color="orange" variant="light" title="GitHub Commits Notice">
            {commitsError}
          </Alert>
        )}

        {!loadingCommits && commits.length === 0 && !commitsError && (
          <Card p="md" radius="md" style={{ backgroundColor: "var(--surface-subtle)" }}>
            <Text size="xs" c="dimmed" ta="center">
              {selectedRepo
                ? "No commits found on branch " + targetBranch + " for " + selectedRepo
                : "Select a repository to stream live commits from GitHub."}
            </Text>
          </Card>
        )}

        {!loadingCommits && commits.length > 0 && (
          <Stack gap="xs">
            {commits.map((c) => {
              const isSelected = selectedCommitSha === c.sha;
              return (
                <Paper
                  key={c.sha}
                  p="sm"
                  radius="md"
                  onClick={() => {
                    onCommitChange(c.sha);
                    if (onCommitSelectedDirectly) onCommitSelectedDirectly(c);
                  }}
                  style={{
                    backgroundColor: isSelected ? "var(--surface-card)" : "var(--surface-subtle)",
                    border: isSelected ? "2px solid #16654C" : "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
                    <Box style={{ flex: 1, minWidth: 240 }}>
                      <Group gap="xs" align="center" mb={4}>
                        <Text size="xs" fw={700} style={{ color: "var(--text-primary)" }}>
                          {c.message}
                        </Text>
                        <Badge size="xs" variant="filled" color={isSelected ? "teal" : "gray"}>
                          {c.shortSha}
                        </Badge>
                        {c.gpgVerified ? (
                          <Badge size="xs" variant="light" color="teal" leftSection={<CheckIcon size={10} color="#16654C" />}>
                            GPG Verified
                          </Badge>
                        ) : (
                          <Badge size="xs" variant="light" color="gray">
                            Unsigned
                          </Badge>
                        )}
                      </Group>
                      <Group gap="xs" align="center">
                        {c.authorAvatar && (
                          <Avatar src={c.authorAvatar} radius="xl" size="xs" />
                        )}
                        <Text size="11px" c="dimmed">
                          {c.authorName} committed on {new Date(c.committedAt).toLocaleDateString()} at {new Date(c.committedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Text>
                      </Group>
                    </Box>

                    <Button
                      size="xs"
                      variant={isSelected ? "filled" : "light"}
                      color="teal"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCommitChange(c.sha);
                        if (onCommitSelectedDirectly) onCommitSelectedDirectly(c);
                      }}
                    >
                      {isSelected ? "Selected" : "Select Commit"}
                    </Button>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Connect Modal */}
      <ConnectGithubModal
        opened={connectModalOpened}
        onClose={() => setConnectModalOpened(false)}
        onConnected={(newConn) => {
          onConnectionChange(newConn);
        }}
      />
    </Stack>
  );
}
