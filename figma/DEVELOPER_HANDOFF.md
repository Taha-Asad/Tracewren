# Developer handoff

## Product structure

Use the source screen catalog **SCR-01–SCR-12** as families, not a limit of 12 frames. [SCREEN_INDEX.csv](SCREEN_INDEX.csv) maps every native view to its screen family, requirement cluster, priority and node ID. Native page **13 · Developer handoff** has the same interaction, security, responsive and state contracts in editable form.

| Family | Delivered experience |
|---|---|
| SCR-01 | Directory, program identity, scope, policy, fingerprint and signed discovery preview |
| SCR-02 | Guest and registered intake, local key setup, structured report, review/encryption, receipt and recovery acknowledgement |
| SCR-03 | Locked/unlocked triage, shared/internal discussion, official vs suggested CVSS, eight Base metrics and assessment history |
| SCR-04 | Code/config proposal, check results, cancellation, actual deployment, retest request, and replacement attempt 2 |
| SCR-05 | Researcher and internal attestations, fixer-authorship disclosure, failed retest, guarded unverified timeout and reopening |
| SCR-06 | Policy signing, DNS verification and read-only GitHub credential management |
| SCR-07 | Owner organization setup, mandatory MFA, personal key, offline recovery export/challenge, recipients and activation |
| SCR-08 · P2 | Redaction controls, signed export preview, local verifier and tamper outcomes |
| SCR-09 | Registration, sign-in, MFA, reset request/link/expired/success, profile, security and session revocation |
| SCR-10 | Personal backup/restore/revoke, guest recovery/token rotation, audited owner recovery, defender B+C and researcher B-only re-wrap |
| SCR-11 | Memberships, invitations, role change, program defender roster, scoped removal and historical grants |
| SCR-12 | Metadata queue with filters, contextual loading/empty/error, audit explorer/verification and capacity lock/recovery |

## Visual system

Primitive → semantic → component variables are saved in the file. The source masters on **01 · Foundations & components** are reused across screens. Button and input variants include primary/secondary/destructive, hover/focus/disabled and default/focused/error/multiline states. Navigation and semantic chips have documented source masters. Text styles use **Inter** for interface text and **Nunito Sans Bold** for headings; both were confirmed through the installed FigCraft font API. Typography colors remain bound independently of text styles.

The palette distinguishes the warm canvas, light everyday surface, selected work and temporary overlay. Petrol marks the main action. Brass is a restrained studio accent. Priority, verification and private discussion all have text labels as well as hue. Phosphor duotone icons are editable vectors; original SVGs and their MIT license are in [assets/icons](assets/icons).

## Layout and scrolling

- At 1440/1366: 216px sidebar, 64px fixed topbar, 32px main inset, 24px section gaps; metadata rows are 76px.
- At 1024: 184px sidebar and compact queue cards; omit secondary columns before truncating reference/category.
- Below 1100: put the report action/assessment rail below primary report content.
- Below 600: stack forms and audience context; dialogs become narrow sheets with internal scrolling. Dedicated 390px reporting, recovery, retest and reset views are connected.
- Main regions scroll beneath the topbar. Dialog content scrolls when necessary; never hide the save/confirm actions below a non-scrollable clip. Primary targets and link wrappers are at least 44px in the design.

## Interaction rules

Native starts and destinations are saved. Present mode supports click navigation, Escape/close, overlay swaps, queue filters, loading progress and prepared success/failure states. The recovery acknowledgement gate and redaction toggles use native local variables. Form values are editable design text, not live input widgets. The prototype does not persist independent report records; supporting queue examples open representative states of one canonical report.

In implementation, preserve drafts on validation/network/concurrency failures, cancel safely, trap focus within dialogs, return focus to the trigger, announce status changes and use keyboard-visible focus. Protect changed drafts from accidental outside dismissal. Use 120–180ms feedback when motion is allowed and instant changes for reduced motion. This native review file uses instant transitions.

## Security contracts that affect UI

- A: readable service metadata. B: shared encrypted content. C: defender-only encrypted notes. Never put B/C in queue/email/search/previews/logs. The internal lane is a distinct recipient boundary, not a hidden tab alone.
- An Owner ordinary session does not automatically fetch/decrypt report content. Assigned report grants are separate from membership and future program recipients.
- Guest `.bbt-recovery.json`, registered `.bbt-user-keys.json` and offline `org-recovery-key.asc` are separate formats. Private files and passphrases remain local; password reset revokes sessions but does not recreate keys.
- Removing a report grant, removing a program assignment, leaving an organization and globally revoking a key have different scopes. Historical defender grants include B+C; researcher replacement includes B only.
- Require fresh owner MFA for privileged operations. Recovery fetch logs the event before returning ciphertext; local offline-key decryption is a separate step.
- Enforce current state/recipient versions. On 409 keep the draft, refresh and require review. A stale attestation must not silently apply to a new remediation attempt.
- Proposal checks verify existence/ancestry or bind an encrypted config snapshot/hash. Record actual deployment separately. Retests bind actor, attempt, environment/version, steps, outcome, evidence, authorship disclosure where applicable, and timestamp.
- Researcher-verified, internally verified and unverified timeout closures remain separate. Timeouts require ≥14 eligible days, no response and no confirmed pause. Withdrawal is permanently terminal; spam recovery requires Owner+MFA; other reopening requires a recorded reason.
- A logical capacity failure can confirm a saved deadline pause. A physical-storage failure may prevent that commit: say **pause not confirmed**, not paused. Never credit object capacity before confirmed deletion.

## Validation and remaining work

Saved-file geometry, all native action destinations, semantic and actual text contrast, and representative parsed native action traces were checked. Every top-level view has a PNG review export. Evidence is in [evidence/design-review](../evidence/design-review).

Outstanding: human FigCraft playback/scroll inspection; browser focus/keyboard/screen-reader and automated accessibility checks after implementation; actual account/MFA/DNS/crypto/GitHub/storage/email/billing services; real recovery downloads and file pickers; real TOTP QR enrollment asset; final legal copy, fingerprints and branding sign-off; pending live-user research; and the commercial policy gaps in [SOURCE_REVIEW.md](SOURCE_REVIEW.md). Native action trace checks are not backend authorization or cryptographic verification.

No production app was created, launched, deployed or connected. Existing project documents were preserved.
