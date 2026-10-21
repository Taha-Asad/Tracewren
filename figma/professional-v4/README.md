# BugBountyTrack · Professional v4

Open [BugBountyTrack-Professional-v4.figcraft](../BugBountyTrack-Professional-v4.figcraft) in FigCraft. The file opens on the report workspace. Select **ReportTriage → Present**. The **StartHere** flow remains available for the full submission journey. V3 is preserved byte-for-byte.

The illustration pass adds five original editable vector scenes: workspace-boundary finding, active retest, unresolved retest, encrypted submission and verified outcome. They appear beside the actual finding and workflow checkpoints on desktop and narrow screens. [Illustration notes and sources](ILLUSTRATIONS.md).

The visual reading pass adds a native request-path diagram, connected event timelines, segmented icon tabs, actual CVSS score bars, inline disclosure controls, a right-hand case drawer and matching evidence-inspector modals. Remediation uses a code → deployment → retest track and a visible attempt 1 → attempt 2 progression. The queue has clickable stage navigation.

[Before/after illustrations](comparisons/ReportTriage-illustrations-before-after.png) · [Illustration set](illustration-set.png) · [Preview the report workspace](full/ReportTriage.png) · [Expanded disclosure](full/ScoreAccordionOpen.png) · [Active retest](full/ResearcherRetestPending.png) · [Drawer in the presenter](runtime-hooks/03-case-drawer.png) · [Evidence modal](runtime-hooks/06-evidence-modal.png)

| Before | V4 change |
| --- | --- |
| Report tabs returned to a triage snapshot | Original report, evidence, conversation, remediation and activity preserve the case, role, lifecycle and attempt |
| Queue rows opened another report | Every row opens its matching ID; supporting records honestly disclose unavailable private content |
| Review omitted the report material | Guest, registered and narrow reviews include the reproduction, impact and original attachments |
| Completed reports emphasized reopening | Verifier, environment, active attempt and observed verification evidence come first; reopening is secondary |
| Recovery controls repeated confirmations | One download demonstration, one saved acknowledgement and a gated open-report action |
| Dashboard could show a stale retest | The canonical case route and status follow progress through failed retest and closure |

- [Before/after this visual reading pass](comparisons/Visual-hooks-before-after.png)
- [Queue comparison](comparisons/Queue-before-after.png)
- [Report workspace comparison](comparisons/ReportTriage-before-after.png)
- [Submission review comparison](comparisons/SubmitReview-before-after.png)
- [Completed report comparison](comparisons/VerifiedResearcherTwo-before-after.png)
- [Active retest](full/ResearcherRetestPending.png) · [390px active case](full/MobileActive.png) · [390px completed case](full/MobileCompletedTwo.png)
- [Handoff and safeguards](DEVELOPER_HANDOFF.md) · [exports](PREVIEWS.md) · [screen index](SCREEN_INDEX.csv)

The file retains all original v3 screen keys, editable text and vectors, reusable components and Auto Layout. Open/closed disclosure snapshots live on **14 · Expandable reading states**, so expanding text has room and preserves the current case. These snapshots are prototype states rather than extra product features.

Verification executes the saved native interactions and separately exercises the real FigCraft presenter. The prototype uses existing synthetic fixtures and prepared inputs. It does not run encryption, downloads, signatures, account services or backend permission checks; no executable service/security certification is claimed.
