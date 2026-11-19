"use client";

import React from "react";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";
import { CreateProgramModal } from "./CreateProgramModal";
import { InviteMemberModal, InviteResult } from "./InviteMemberModal";
import { RecordInternalVerificationModal } from "./RecordInternalVerificationModal";
import { RevokeMemberModal } from "./RevokeMemberModal";
import { IngestReportModal } from "./IngestReportModal";
import { MasterRecoveryKeyModal } from "./MasterRecoveryKeyModal";
import { Membership, ProgramItem, TriageMemberItem } from "../types";

export interface WorkspaceModalsContainerProps {
  // Create Workspace
  modalOpen: boolean;
  onCloseWorkspaceModal: () => void;
  handleCreateWorkspace: (e: React.FormEvent) => void;
  createError: string | null;
  newOrgName: string;
  onNewOrgNameChange: (v: string) => void;
  newSlug: string;
  onNewSlugChange: (v: string) => void;
  newDomain: string;
  onNewDomainChange: (v: string) => void;
  creating: boolean;

  // Create Program
  createProgOpen: boolean;
  onCloseCreateProg: () => void;
  handleCreateProgram: (e: React.FormEvent) => void;
  newProgName: string;
  onNewProgNameChange: (v: string) => void;
  newProgSlug: string;
  onNewProgSlugChange: (v: string) => void;
  newProgVisibility: string;
  onNewProgVisibilityChange: (v: string) => void;
  newProgScope: string;
  onNewProgScopeChange: (v: string) => void;

  // Invite Member
  inviteMemberOpen: boolean;
  onCloseInviteMember: () => void;
  handleInviteMember: (e: React.FormEvent) => void;
  newMemberEmail: string;
  onNewMemberEmailChange: (v: string) => void;
  newMemberRole: string;
  onNewMemberRoleChange: (v: string) => void;
  newMemberProgram: string;
  onNewMemberProgramChange: (v: string) => void;
  programsList: ProgramItem[];
  sendingInvite: boolean;
  lastInviteResult?: InviteResult | null;
  onClearLastInviteResult?: () => void;

  // Record Internal Verification
  verifiedModalOpen: boolean;
  onCloseVerifiedModal: () => void;
  activeReportTitle?: string;
  activeReportId?: string;
  onConfirmInternalVerification?: (attestation: any) => void;

  // Revoke Member
  removeMemberTarget: TriageMemberItem | null;
  onCloseRevokeMember: () => void;
  handleConfirmRemoveMember: () => void;
  removingMember: boolean;

  // Ingest Report
  intakeModalOpen: boolean;
  onCloseIntakeModal: () => void;
  handleIngestReport: (e: React.FormEvent) => void;
  intakeProgramSlug: string;
  onIntakeProgramSlugChange: (v: string) => void;
  intakeTargetAsset: string;
  onIntakeTargetAssetChange: (v: string) => void;
  intakeTitle: string;
  onIntakeTitleChange: (v: string) => void;
  intakeSummary: string;
  onIntakeSummaryChange: (v: string) => void;
  intakeSeverity: "Critical" | "High" | "Medium" | "Low";
  onIntakeSeverityChange: (sev: "Critical" | "High" | "Medium" | "Low") => void;
  intakeCvss: number;
  intakeSubmitting: boolean;

  // Master Recovery Key
  masterKeyModalOpen: boolean;
  onCloseMasterKeyModal: () => void;
  activeOrg?: Membership;
}

export function WorkspaceModalsContainer(props: WorkspaceModalsContainerProps) {
  return (
    <>
      <CreateWorkspaceModal
        opened={props.modalOpen}
        onClose={props.onCloseWorkspaceModal}
        onSubmit={props.handleCreateWorkspace}
        createError={props.createError}
        newOrgName={props.newOrgName}
        onNewOrgNameChange={props.onNewOrgNameChange}
        newSlug={props.newSlug}
        onNewSlugChange={props.onNewSlugChange}
        newDomain={props.newDomain}
        onNewDomainChange={props.onNewDomainChange}
        creating={props.creating}
      />

      <CreateProgramModal
        opened={props.createProgOpen}
        onClose={props.onCloseCreateProg}
        onSubmit={props.handleCreateProgram}
        newProgName={props.newProgName}
        onNewProgNameChange={props.onNewProgNameChange}
        newProgSlug={props.newProgSlug}
        onNewProgSlugChange={props.onNewProgSlugChange}
        newProgVisibility={props.newProgVisibility}
        onNewProgVisibilityChange={props.onNewProgVisibilityChange}
        newProgScope={props.newProgScope}
        onNewProgScopeChange={props.onNewProgScopeChange}
      />

      <InviteMemberModal
        opened={props.inviteMemberOpen}
        onClose={props.onCloseInviteMember}
        onSubmit={props.handleInviteMember}
        newMemberEmail={props.newMemberEmail}
        onNewMemberEmailChange={props.onNewMemberEmailChange}
        newMemberRole={props.newMemberRole}
        onNewMemberRoleChange={props.onNewMemberRoleChange}
        newMemberProgram={props.newMemberProgram}
        onNewMemberProgramChange={props.onNewMemberProgramChange}
        programsList={props.programsList}
        sending={props.sendingInvite}
        lastInviteResult={props.lastInviteResult}
        onClearLastInviteResult={props.onClearLastInviteResult}
      />

      <RecordInternalVerificationModal
        opened={props.verifiedModalOpen}
        onClose={props.onCloseVerifiedModal}
        reportTitle={props.activeReportTitle}
        reportId={props.activeReportId}
        onConfirm={props.onConfirmInternalVerification}
      />

      <RevokeMemberModal
        removeMemberTarget={props.removeMemberTarget}
        onClose={props.onCloseRevokeMember}
        onConfirmRemove={props.handleConfirmRemoveMember}
        removingMember={props.removingMember}
      />

      <IngestReportModal
        opened={props.intakeModalOpen}
        onClose={props.onCloseIntakeModal}
        onSubmit={props.handleIngestReport}
        programsList={props.programsList}
        intakeProgramSlug={props.intakeProgramSlug}
        onIntakeProgramSlugChange={props.onIntakeProgramSlugChange}
        intakeTargetAsset={props.intakeTargetAsset}
        onIntakeTargetAssetChange={props.onIntakeTargetAssetChange}
        intakeTitle={props.intakeTitle}
        onIntakeTitleChange={props.onIntakeTitleChange}
        intakeSummary={props.intakeSummary}
        onIntakeSummaryChange={props.onIntakeSummaryChange}
        intakeSeverity={props.intakeSeverity}
        onIntakeSeverityChange={props.onIntakeSeverityChange}
        intakeCvss={props.intakeCvss}
        intakeSubmitting={props.intakeSubmitting}
      />

      <MasterRecoveryKeyModal
        opened={props.masterKeyModalOpen}
        onClose={props.onCloseMasterKeyModal}
        activeOrg={props.activeOrg}
      />
    </>
  );
}
