# Professional v6 / public website and product completion

[Editable FigCraft file](../BugBountyTrack-Professional-v6.figcraft) · [All screen previews](index.html) · [Complete landing page](full/LandingFull.png) · [Competitor review](COMPETITOR_REVIEW.md)

The 7 November completion adds the public website and the product entry points missing from the report-focused edition. The design keeps v6's refined typography, neutral surfaces, forest actions and existing report workflows.

**Open page 13 · V6 / Public website and select Landing** to start at the new public entry. The file opens on this frame. `LandingFull` is the complete long-form desktop layout; `Landing` is the scrollable desktop prototype. `MobileLanding` and `TabletLanding` cover 390px and 1024px widths.

New pages:

| Native page | Contents |
| --- | --- |
| 13 · Public website | Landing, platform, team/researcher introductions, trust, discovery, help, contact and review starts |
| 14 · Accounts & notifications | Onboarding, profile, security, preferences, account menus and notifications with actor-specific contexts |
| 15 · Program management | Program list, creation, saved draft, scope editing and saved scope draft |
| 16 · Public & account mobile | Mobile website navigation, discovery, profile and notifications; tablet landing study |

The completion adds **61 views/states**, bringing the catalogue to **581 views across 17 pages**. Counts include dialogs, responsive studies and state variations. The earlier 520 views and their screen IDs remain present. [The previous v6 file is backed up here](archive/2026-11-07-before-completion/BugBountyTrack-Professional-v6.figcraft).

Use `CompletionIndex` for the new review starts, including expired email verification and a directory with no results. The original `Start` review screen also links to the landing page, additions index and mobile landing. The original submission → triage → failed retest → replacement fix → verified outcome journey remains available.

Saved-file checks passed with **zero unexpected layout bounds, text-contrast failures or missing destinations**. Original report workflows passed 80 desktop/mobile actions and 1,037 context-preserving tab links. The completion passed 39 saved-file navigation actions and 28 real presenter actions.

[Saved-file completion verification](completion-verification.json) checks the added journeys, actor context, notification routing, preference state, preserved screen IDs, layout, contrast and destinations. [Native presenter playback](runtime/completion/verification.json) records actual clicks and scrolling. The research and prototype limits are documented in [the competitor review](COMPETITOR_REVIEW.md).

Inputs use prepared values. Email, contact submission, authentication, encryption, session revocation and domain verification are represented design outcomes. This task updates the design artifact and its authoring/review material.

---

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
