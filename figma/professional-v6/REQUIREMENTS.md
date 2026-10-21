# V6 / requirements and state coverage

The previous native design's requirements coverage is retained from SRS revision 2.8 and expressed through the final selected visual concept. `ScreenMap` links the twelve SRS screen families to their native views. `WorkflowGuide` explains lifecycle transitions and distinct outcomes.

| Flow | Principal views |
| --- | --- |
| Public scope, policy and trust | Program, Policy, ProgramKey |
| Guest/account intake | Access, GuestAccess, RegisteredAccess, ReportForm, Review |
| Receipt and saved recovery confirmation | Receipt, RecoveryFile, RecoveryGate |
| Metadata queue and local unlock | Queue, CaseLocked, Unlock, UnlockError |
| Assessment and clarification | CaseTriage, Assessment, AssessmentHistory, RequestInfo, Clarification |
| Code/config evidence and deployment | Fix1/2, CommitChecked1/2, Config1/2, Deploy1/2, Invite1/2 |
| Researcher attestation | RetestForm/2, FailedAttestation/2, ResearcherFailed, ResearcherVerified1/2 |
| Internal verification / timeout | InternalVerification1/2, AuthorshipRequired, TimeoutGate1/2, TimeoutEligible1/2 |
| Other outcomes | Rejected, Duplicated, RiskAccepted, Withdrawn, CancelledDefender, Reopened |
| Organization operations | OwnerOnboarding, OwnerOverview, PolicySettings, Integrations, Members |
| Identity and recovery | SignIn, KeyDesk, GuestRestore, PersonalRestore, HistoricalDefender/Researcher |
| Operational audit and capacity | Audit, AuditOwner, AuditMismatch, Capacity |
| Optional redacted export | Export, ExportPreview |
| Responsive journey | MobileProgram, MobileReportForm, MobileReview, MobileActive, MobileFailed, MobileComplete |
| Recovery and exceptions | EdgeIndex and its linked 42 states; eight additional narrow studies |

Each desktop case base has role- and attempt-specific evidence, remediation, conversation and activity views. Defender views also have internal notes and case-details overlays. Retest-pending defaults to Overview in v6; four previous `__report` keys are now represented by their base Overview frame, while their former default content is available under `__remediation`.

The approved concept changes the canonical report fixture to 6.5 Medium defender / 8.1 High researcher. Unrelated queue records keep their own source severity. The concept image and generated report diagrams are never presented as raw attachment evidence. Evidence inspectors identify excerpts and absent original bytes honestly.

Source: [SRS](../../requirements/SRS.md), [v5 coverage](../professional-v5/REQUIREMENTS.md), and the [approved concept](../concept/Authorization%20boundary%20finding,%20retest%20pending.png).
