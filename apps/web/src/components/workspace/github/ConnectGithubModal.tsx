"use client";

import React, { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { GithubIcon, CheckIcon, LockIcon } from "../icons";
import { GitHubUser, GithubConnectionState } from "./types";

export interface ConnectGithubModalProps {
  opened: boolean;
  onClose: () => void;
  onConnected: (connection: GithubConnectionState) => void;
}

export function ConnectGithubModal({
  opened,
  onClose,
  onConnected,
}: ConnectGithubModalProps) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<GitHubUser | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = token.trim();
    if (!cleanToken) {
      setError("Please paste a valid GitHub Personal Access Token.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/github/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: cleanToken }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "GitHub authentication failed. Please verify your token.");
      }

      const user: GitHubUser = data.user;
      setVerifiedUser(user);

      const connectionState: GithubConnectionState = {
        connected: true,
        token: cleanToken,
        user,
        selectedRepo: null,
        selectedBranch: null,
      };

      setTimeout(() => {
        onConnected(connectionState);
        setLoading(false);
        setVerifiedUser(null);
        setToken("");
        onClose();
      }, 700);
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Failed to connect to GitHub.";
      setError(msg);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <GithubIcon size={20} />
          <Text fw={700} size="md">
            Connect GitHub Account
          </Text>
        </Group>
      }
      centered
      size="md"
      styles={{ content: { backgroundColor: "var(--surface-card)" } }}
    >
      <form onSubmit={handleConnect}>
        <Stack gap="md">
          <Text size="xs" c="dimmed">
            Connect your personal or company GitHub account via Personal Access Token (PAT).
            BugBountyTrack will discover your repositories (public and private) and pull
            candidate commits directly from GitHub without typing repository paths or SHAs.
          </Text>

          {error && (
            <Alert color="red" variant="light" title="Authentication Error">
              {error}
            </Alert>
          )}

          {verifiedUser && (
            <Alert
              color="teal"
              variant="light"
              title="GitHub Connected Successfully"
              icon={<CheckIcon size={16} color="#16654C" />}
            >
              <Group gap="xs" mt="xs">
                <Avatar src={verifiedUser.avatarUrl} radius="xl" size="sm" />
                <Box>
                  <Text size="xs" fw={700}>{verifiedUser.name} (@{verifiedUser.login})</Text>
                  <Text size="11px" c="dimmed">
                    {verifiedUser.publicRepos} public · {verifiedUser.totalPrivateRepos} private repositories discovered
                  </Text>
                </Box>
              </Group>
            </Alert>
          )}

          <PasswordInput
            label="GitHub Personal Access Token (PAT)"
            placeholder="ghp_... or github_pat_..."
            required
            value={token}
            onChange={(e) => setToken(e.currentTarget.value)}
            description="Classic or fine-grained token with 'repo' and 'read:org' permissions."
          />

          <Box
            p="xs"
            style={{
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "6px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Group justify="space-between" align="center" wrap="wrap">
              <Box>
                <Text size="11px" fw={700} c="dimmed">
                  NEED A TOKEN?
                </Text>
                <Text size="xs" c="dimmed">
                  Generate a pre-scoped token in 1 click on GitHub:
                </Text>
              </Box>
              <Button
                component="a"
                href="https://github.com/settings/tokens/new?scopes=repo,read:org,user:email&description=BugBountyTrack%20Remediation%20Engine"
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                variant="light"
                color="teal"
                leftSection={<LockIcon size={12} />}
              >
                Generate Token on GitHub
              </Button>
            </Group>
          </Box>

          <Divider my="xs" style={{ borderColor: "var(--border-subtle)" }} />

          <Group justify="flex-end" mt="xs">
            <Button variant="default" size="xs" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="teal"
              size="xs"
              loading={loading}
              disabled={Boolean(verifiedUser)}
            >
              Verify &amp; Connect Account
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
