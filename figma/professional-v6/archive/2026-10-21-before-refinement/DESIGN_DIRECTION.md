# V6 / selected authorization-boundary concept

The sole visual authority is the user's final concept: [Authorization boundary finding, retest pending](../concept/Authorization%20boundary%20finding,%20retest%20pending.png). The adjacent investigation concept supplies secondary context, not a competing direction.

## Layout and spacing

- Primary desktop: 1600 × 1080. Reference-sized report: 1488 × 1058. Compact queue/report: 1366 × 900. Mobile: 390 × 844.
- A 264px warm light sidebar, 64px masthead, 32px horizontal content inset, 40px report-column gutter and 428px context column on the wider report views.
- The reference-sized report keeps a 692px manuscript column. At 1366px the navigation and context column narrow while report text remains full size.
- Mobile stacks the finding diagram and comparison. It uses 20px horizontal padding, 24px initial body padding and 44px primary actions.
- Forms use focused widths. Dialogs keep 28px padding and their own vertical scroll region. Long content extends through native scrolling instead of shrinking type or colliding with actions.
- Shared body type is 15–16px; supporting metadata is 12–14px. Large finding titles use a classic serif face with an explicit reading measure. Sections have a single rule and a clear heading.

## Visual language

| Purpose | Value |
| --- | --- |
| Reading canvas | `#FAF9F6` |
| Sidebar | `#EFEDE7` |
| Text | `#111827` |
| Secondary text | `#586171` |
| Forest action | `#224B3D` |
| Rule | `#D7DAD5` |
| Retest / failed status | `#B12E13` |
| Medium assessment | `#9E5109` |
| Serif headings | Noto Serif |
| Interface | IBM Plex Sans |
| Request snippets | IBM Plex Mono |

Rust marks status and failed observations; it is not the default primary action. Severity and lifecycle stay separate. The diagram, labels, controls and report content are editable native layers. The approved concept image appears only on the reference page.

## Report fixture

The hero report is BBT-0241, reported by Alex Rivera on 17 October 2026. Attempt 1 is deployed to Production v0.8.4 on 19 October, 14:22 UTC. Attempt 2 is a distinct replacement on v0.8.5, with earlier failure evidence retained.

The concept's score pair is consistent throughout the canonical report: defender 6.5 Medium; researcher suggestion 8.1 High. The defender vector is `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N`; the suggestion differs in integrity impact (`I:H`). Authentication is required; demonstrated metadata read access determines the defender assessment.

## Workflow coverage

Public scope → guest/account access → report → review → recovery confirmation → defender unlock → triage → assessment → code/config proposal → deployment → retest → distinct outcome.

Researcher verification, internal verification and timeout closure remain distinct. Role switches are labelled demo controls. Shared conversation and defender-only notes retain separate views. Each report tab preserves its role, lifecycle and numbered attempt.
