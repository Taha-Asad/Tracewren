# Professional v6 / product refinement

[Editable FigCraft file](../BugBountyTrack-Professional-v6.figcraft) · [Search every screen](index.html) · [Reference-sized report](full/Concept1488.png) · [Current design direction](DESIGN_DIRECTION.md) · [Before and after](refinement-review.html)

V6 was refined on 21 October after feedback that the earlier design felt artificial. The current edition uses restrained sans-serif typography, neutral surfaces, readable HTTP evidence, compact metadata and validation states that retain their form context. Text, vectors, variables, components and native interactions remain editable. The previous v6 file and sample previews are preserved under `archive/2026-10-21-before-refinement/`.

## Screen coverage

520 catalogued views across 13 pages include full screens, context-preserving tabs, dialogs, workflow stages and responsive studies. This count does not mean 520 independent product features.

| Family | Views |
| --- | ---: |
| Public scope and disclosure | 9 |
| Private submission and recovery | 6 |
| Reports, queues and loading | 37 |
| Researcher desk | 2 |
| Report workspaces and tabs | 203 |
| Remediation, retest and evidence dialogs | 90 |
| Organization and program settings | 34 |
| Identity and key recovery | 17 |
| Audit and capacity | 15 |
| Mobile | 59 |
| Review and workflow guides | 4 |
| Foundations | 1 |
| Edge states and catalog | 43 |

The earlier workflow coverage is retained. Retest-pending screens now open on Overview to match the selected concept; their remediation content has its own tab. Compact and reference-sized report studies are additional views.

## Review the design

Open the v6 file in FigCraft. The main retest-pending report is selected on **05 · V6 / Report workspaces**. The **Concept1488** frame matches the reference dimensions; **Case1366** checks the compact report spread.

For the connected prototype, open **00 · V6 / Start & coverage**, select **Start**, enter Present and choose **Start full journey**. The journey covers guest access, report review, recovery confirmation, triage, failed attempt 1, replacement attempt 2 and researcher verification. Separate starts cover the queue, researcher follow-up, owner setup and 390px journey.

Use **State reference** / **EdgeIndex** for empty, error, conflict, expired, interrupted and permission states. Every state provides a useful return path. Shared conversation and internal notes remain distinct; case tabs retain their report, actor, lifecycle and attempt.

[Browse all viewport exports](index.html). Long forms, report history and sidebars scroll in the native prototype; PNGs show the initial viewport.

## Important previews

[Reports](full/Queue.png) · [Original finding](full/CaseTriage.png) · [Submission review](full/Review.png) · [Remediation](full/CasePending__remediation.png) · [Researcher retest](full/ResearcherPending.png) · [Failed retest](full/CaseFailed.png) · [Verified attempt 2](full/CaseVerified2.png) · [Keys](full/KeyDesk.png) · [Owner setup](full/OwnerOnboarding.png) · [Edge states](full/EdgeIndex.png) · [Mobile report](full/MobileOriginal.png) · [Mobile outcome](full/MobileComplete.png)

## Validation and limits

[Saved-file verification](verification.json) checks geometry, text contrast, native destinations, context-preserving tabs, the desktop and mobile journeys, alternate closure outcomes and preserved prior-file hashes. Saved-file checks passed: 51 desktop actions, 29 mobile actions, 1037 context-preserving tab links, and 6 concept-specific actions. Zero unexpected layout bounds, text-contrast failures or missing destinations were found. Prior design hashes are unchanged. [Real FigCraft presenter playback](runtime/verification.json) also passed the connected desktop and mobile journeys with actual clicks and scrolling. The 21 October refinement passed live desktop and mobile playback; the application is left on the revised report workspace.

This is a design prototype with synthetic fixtures and prepared input values. Authentication, encryption, signatures, file operations, GitHub and backend authorization do not execute. Account credentials and encryption keys remain separate in the represented flows.

[Editable authoring source](../../tools/design/professional-v6/README.md) · [Requirements coverage](REQUIREMENTS.md)
