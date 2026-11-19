"use client";

import React from "react";
import { Button, Group, Modal, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";

export interface CreateProgramModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newProgName: string;
  onNewProgNameChange: (val: string) => void;
  newProgSlug: string;
  onNewProgSlugChange: (val: string) => void;
  newProgVisibility: string;
  onNewProgVisibilityChange: (val: string) => void;
  newProgScope: string;
  onNewProgScopeChange: (val: string) => void;
}

export function CreateProgramModal({
  opened,
  onClose,
  onSubmit,
  newProgName,
  onNewProgNameChange,
  newProgSlug,
  onNewProgSlugChange,
  newProgVisibility,
  onNewProgVisibilityChange,
  newProgScope,
  onNewProgScopeChange,
}: CreateProgramModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>Create New In-House Disclosure Program</Text>}
      centered
      styles={{ content: { backgroundColor: "var(--surface-card)" } }}
    >
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <TextInput
            label="Program Title"
            placeholder="e.g. Mobile Apps & API Perimeter"
            required
            value={newProgName}
            onChange={(e) => onNewProgNameChange(e.currentTarget.value)}
          />
          <TextInput
            label="Program Slug"
            placeholder="mobile-api-scope"
            required
            value={newProgSlug}
            onChange={(e) => onNewProgSlugChange(e.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          />
          <Select
            label="Visibility Scope"
            data={[
              { label: "Public Disclosure (RFC 9116 Manifest)", value: "PUBLIC" },
              { label: "Private Invite-Only", value: "INVITE_ONLY" },
            ]}
            value={newProgVisibility}
            onChange={(v) => onNewProgVisibilityChange(v || "PUBLIC")}
          />
          <Textarea
            label="In-Scope Targets (One per line)"
            placeholder="api.example.com&#10;mobile.example.com"
            minRows={3}
            value={newProgScope}
            onChange={(e) => onNewProgScopeChange(e.currentTarget.value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="teal">
              Publish Program Scope
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
