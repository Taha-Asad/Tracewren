"use client";

import React, { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { GithubIcon, CheckIcon } from "../icons";

export interface CompanyGithubConfig {
  companyOrg: string;
  defaultRepo: string;
  defaultBranch: string;
  patToken?: string;
}

export interface ConfigureGithubModalProps {
  opened: boolean;
  onClose: () => void;
  currentConfig: CompanyGithubConfig;
  onSaveConfig: (config: CompanyGithubConfig) => void;
}

export function ConfigureGithubModal({
  opened,
  onClose,
  currentConfig,
  onSaveConfig,
}: ConfigureGithubModalProps) {
  const [org, setOrg] = useState(currentConfig.companyOrg || "");
  const [repo, setRepo] = useState(currentConfig.defaultRepo || "");
  const [branch, setBranch] = useState(currentConfig.defaultBranch || "main");
  const [token, setToken] = useState(currentConfig.patToken || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOrg = org.trim().replace(/^@/, "");
    const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, "");
    const cleanBranch = branch.trim() || "main";

    onSaveConfig({
      companyOrg: cleanOrg,
      defaultRepo: cleanRepo,
      defaultBranch: cleanBranch,
      patToken: token.trim() || undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <GithubIcon size={20} />
          <Text fw={700} size="md">
            Configure Company GitHub Integration
          </Text>
        </Group>
      }
      centered
      size="lg"
      styles={{ content: { backgroundColor: "var(--surface-card)" } }}
    >
      <form onSubmit={handleSave}>
        <Stack gap="md">
          <Text size="xs" c="dimmed">
            Connect your company&apos;s GitHub organization or account to verify candidate remediation
            commits, branch ancestry comparisons, and cryptographic GPG signatures per FR-6.
          </Text>

          {savedSuccess && (
            <Alert
              color="teal"
              variant="light"
              title="Integration Saved"
              icon={<CheckIcon size={16} color="#16654C" />}
            >
              Company GitHub account parameters updated and persisted for this organization.
            </Alert>
          )}

          <TextInput
            label="Company GitHub Organization / Account"
            placeholder="e.g. acme-cyber or your-company-org"
            required
            value={org}
            onChange={(e) => setOrg(e.currentTarget.value)}
            description="The GitHub organization or username owning your production repositories."
          />

          <TextInput
            label="Default Repository Name"
            placeholder="e.g. core-api or security-platform"
            required
            value={repo}
            onChange={(e) => setRepo(e.currentTarget.value)}
            description="Default repository checked during remediation verification."
          />

          <TextInput
            label="Target Release Branch"
            placeholder="main"
            required
            value={branch}
            onChange={(e) => setBranch(e.currentTarget.value)}
            description="Production or staging target branch (e.g. main, master, release/v1)."
          />

          <PasswordInput
            label="GitHub Personal Access Token (PAT) — Optional"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.currentTarget.value)}
            description="Optional fine-grained PAT with repo:read permission for private repositories."
          />

          <Divider my="xs" style={{ borderColor: "var(--border-subtle)" }} />

          <Box
            p="sm"
            style={{
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "6px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Text size="11px" fw={700} c="dimmed" mb={4}>
              CONFIGURED REPOSITORY TARGET
            </Text>
            <Group justify="space-between" align="center" wrap="wrap">
              <Text size="xs" ff="monospace" fw={600} style={{ color: "var(--text-primary)" }}>
                https://github.com/{org.trim() || "your-org"}/{repo.trim() || "your-repo"}
              </Text>
              <Badge size="xs" variant="light" color="teal">
                Active Tenant Binding
              </Badge>
            </Group>
          </Box>

          <Group justify="flex-end" mt="xs">
            <Button variant="default" size="xs" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="teal" size="xs">
              Save &amp; Connect Company GitHub
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
