"use client";

import React from "react";
import { Alert, Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";

export interface CreateWorkspaceModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  createError: string | null;
  newOrgName: string;
  onNewOrgNameChange: (val: string) => void;
  newSlug: string;
  onNewSlugChange: (val: string) => void;
  newDomain: string;
  onNewDomainChange: (val: string) => void;
  creating: boolean;
}

export function CreateWorkspaceModal({
  opened,
  onClose,
  onSubmit,
  createError,
  newOrgName,
  onNewOrgNameChange,
  newSlug,
  onNewSlugChange,
  newDomain,
  onNewDomainChange,
  creating,
}: CreateWorkspaceModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>Create New Organization Workspace</Text>}
      centered
      styles={{ content: { backgroundColor: "var(--surface-card)" } }}
    >
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          {createError && <Alert color="red" variant="light">{createError}</Alert>}
          <TextInput
            label="Organization Name"
            placeholder="e.g. Acme Cyber Defense"
            required
            value={newOrgName}
            onChange={(e) => onNewOrgNameChange(e.currentTarget.value)}
          />
          <TextInput
            label="Workspace URL Slug"
            placeholder="acme-cyber-defense"
            required
            value={newSlug}
            onChange={(e) => onNewSlugChange(e.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          />
          <TextInput
            label="Primary Security Domain"
            placeholder="e.g. acmewidgets.com"
            value={newDomain}
            onChange={(e) => onNewDomainChange(e.currentTarget.value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="teal" loading={creating}>
              Provision Workspace
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
