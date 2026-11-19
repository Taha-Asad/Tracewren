# Professional v4 · design handoff

Authoritative requirements remain [SRS Revision 2.8](../../requirements/SRS.md), frozen by DEC-026. No requirement or application code was changed. The v3 native artifact matches its pre-revision SHA-256: `a2362272d20e4e17b99c3beb8a65935eb524003ff66d094dd0b93b360eebfa50`.

## Shared layout

Desktop: 216px persistent navigation, 64px topbar, 32px content inset. Body text is normally 14–15px; page titles are 22–26px. Reports retain the same identity/header and five reading tabs. A compact status-and-action surface precedes the content. The right rail separates assessment from current work and records the latest meaningful developments. Original findings use a two-column expected/observed comparison and numbered steps with a code well. Evidence-file components expose editable filename and metadata properties.

At 1366 × 768, the report and rail remain readable in a vertically scrolling body. The 1024px queue reduces the metadata columns into grouped rows. At 390 × 844, content stacks, controls stay at least 44px high and evidence comparisons become vertical. The narrow original/evidence/activity tabs preserve Retest pending. Narrow failed and completed cases retain their outcomes.

Warm canvas `#F2F0E9`; paper `#FFFEF9`; charcoal `#242E30`; teal `#17645D`. Other colours mark severity or meaningful warning/error/success/internal states. The legacy brass roles now resolve to teal or mint. There are no raster UI screenshots, decorative charts, neon effects, gold objects or gradient banners in the product layouts.

## Workflow and permission safeguards

- Class A metadata remains available in queues. Class B report title, body and evidence require local unlock and a valid report grant. Researchers never receive the internal-note lane. Organization ownership alone still does not grant normal report decryption.
- Guest recovery keeps file/passphrase separation, local-only restoration and the saved-file acknowledgement before leaving the receipt. Personal key recovery and account password reset remain separate.
- Fix evidence, actual deployment and requesting retest remain three separate actions. **Deployment recorded is a checkpoint inside FIX_PROPOSED, not an additional FSM state.** The UI displays Fix proposed with the next action Request retest at that checkpoint.
- Code-commit existence/ancestry is distinct from deployment and fix verification. Configuration evidence retains the shared encrypted snapshot and hash; plaintext ≤160 KiB and ciphertext ≤256 KiB limits remain in the original controls.
- The attestation binds the active remediation attempt, tested environment/version, steps, evidence and outcome. A failed attempt returns to ACCEPTED; replacement proposal/deployment/retest use attempt 2. Prior evidence remains linked to attempt 1.
- Researcher and internal verification remain distinct. Internal attestation asks whether the verifier authored the fix. An unverified closure requires ≥14 eligible days, no response and no confirmed capacity pause; it never claims a verified fix.
- Owner MFA, risk acceptance, spam recovery, historical access, recipient conflicts, capacity-paused deadlines and permanent withdrawal retain the original requirement-specific flows. Explicit **Demo: switch role** dialogs demonstrate different actors without implying that ordinary researcher sessions can perform defender actions.
- Case tabs are separate editable snapshots with a shared context tuple. Entering a case updates native prototype routing variables so the dashboard and queue reopen the current canonical state instead of silently rewinding it. Prepared snapshots do not implement server concurrency or authorization.

## Evidence provenance

The available design sources contain synthetic report text and attachment references, not original binary attachments or actual screenshots. V4 preserves `evidence-request.txt` (4 KiB), `response-comparison.txt` (2 KiB), `failed-retest-response.txt`, `retest-response.txt` and `attempt-2-retest.txt`. Where no size exists, the UI says size unavailable. Text-file previews do not imply a screenshot or executable attachment is embedded.

Supporting queue cases have only their existing metadata. They open matching IDs and disclose that private report material is unavailable. Researcher supporting rows retain their existing titles and program identities; they do not reuse BBT-0241’s findings or attestation.

Existing deployment times are retained exactly. The original fixture places attempt 1’s deployed-at time before its assessment time. That is deployment metadata, not a supplied event-recording timestamp. Activity preserves the logical recorded sequence; unspecified event times use descriptive sequence labels rather than invented clock times. Production should use actual recorded-at timestamps alongside deployed-at values.

## Verification and reproduction

[Saved-file verification](../../evidence/design-professional-v4/verification.json) executes the native action AST, checks all contextual tabs and matching queue IDs, the recovery gate, separate closure routes and the complete submission → failed retest → replacement → researcher closure journey. It also checks geometry, text contrast and destinations across the native file.

[Presenter verification](runtime/verification.json) records actual mouse clicks and scrolling in FigCraft, including the desktop journey and narrow recovery/failure/fixed branches. Screenshot exports are in `full/`; actual presenter captures are in `runtime/`.

Authoring code lives in [tools/design/professional-v4](../../tools/design/professional-v4/README.md). `refinement.py` owns the revised report/queue/narrow compositions and routing; existing v3 account, owner, recovery and exception families remain editable. V3 and requirements are preserved.


## Visual reading refinement

The report diagram represents the supplied controlled workspace A → export endpoint → workspace B reproduction. Its 403/200 comparison is the original report observation, not evidence of a current retest result. The severity bars show only the existing suggested 9.8 and defender-assessed 8.1 values. Queue stages are navigation controls, not a live statistical dashboard.

The five report tabs use segmented controls and meaningful icons. Case context opens a right-hand drawer; filenames open their own evidence inspectors, showing existing report excerpts and honestly identifying unavailable attachment bytes. Timeline markers and remediation milestones distinguish code evidence, deployment, retest and the failed/replacement attempt path.

Disclosures for request details, score rationale, earlier events, audience/decryption and prior attempts use native precomputed open/closed reading states. The presenter cannot reflow parents when a variable changes visibility, so these states are compiled with Auto Layout before playback. Header interactions retain the case identity, role, lifecycle and attempt, with a return route to the original state. Essential reproduction instructions remain visible and request code starts open. Reusable disclosure and milestone components are retained; page 14 groups the generated reading states.

The preceding v4 artifact and its key exports are preserved in `archive/` for comparison. V3 remains unchanged.


Current saved-file checks cover the complete failed-retest/replacement/closure route, 3,560 contextual tab transitions, 33 queue-row routes and 582 disclosure layouts/return routes, with no geometry, text-contrast or destination failures. The `runtime/` captures record the earlier v4 lifecycle baseline. New reading-control captures and their exact playback scope are recorded in `runtime-hooks/verification.json`; final prior-attempt and narrow playback were interrupted when the window closed, while their saved layouts and destinations passed.

## Editable illustrations

`BBT/Illustration/boundary`, `retest`, `failed`, `submission` and `verified` are native reusable components with separately editable shapes and existing semantic colour bindings. The SVGs and authoring source are supplied in `figma/assets/illustrations/` and `tools/design/professional-v4/illustrations.py`. These are conceptual artwork, not evidence previews. Failed retests retain an unresolved mark; unverified closure never receives the verified shield. Actual verifier names appear in completed checkpoint summaries, and the fuller verifier disclosure remains with the remediation record.

The illustration refinement was checked through saved-file lifecycle/role/tab/disclosure interactions, geometry and contrast, plus rendered desktop/narrow views. No new complete GUI presenter replay is claimed by this refinement. Earlier presenter validation scope remains documented in the runtime evidence.
