# Professional v3 · developer handoff

This visual refinement supplements the [full product handoff](../DEVELOPER_HANDOFF.md). The frozen SRS Revision 2.8 remains authoritative. No new product features, permission rules, currencies or service commitments are introduced.

## Palette and typography

The original palette is restored exactly. `action` replaces the literal `teal` role name while preserving its value. Code-well roles alias the original navigation colors. See [tokens](design-tokens.json) and the [32-color saved-native comparison](../../evidence/design-professional-v3/palette-equivalence.json).

| Role | Value |
|---|---|
| Application canvas | `#F2F0E9` |
| Working surface | `#FFFEF9` |
| Graphite navigation | `#263638` |
| Primary action | `#17645D` |
| Selected case / active work | `#E0EFEB` |
| Main text | `#242E30` |
| Muted text | `#586668` |

Use Inter for interface text and headings, with Regular and SemiBold as the principal weights. Work-page headings are generally 20–26px. JetBrains Mono is retained for evidence/request excerpts. Warm rounded headings and cream primary buttons have been replaced. Keep source style and semantic variable bindings; do not copy individual colors into new components.

## Composition and density

Use 216px desktop navigation, 184px compact navigation, a 64px topbar and 32px content inset. Mobile keeps 20px inset. Working lists remain continuous rather than a grid of equal cards. Client rows are 78px, personal report rows 80px and primary controls 44px. Controls and active-work surfaces use 4px corners.

The current retest aligns the report title/context with its action and the existing evidence checkpoints. The owner’s active program aligns program identity with the triage route. Case details and assessment are a rule-separated margin beside the report document; the report remains the primary reading surface. Selected queue rails appear only on the selected row. Critical/low severity labels use the original danger/info colors alongside explicit severity text.

## Preserved flows and data boundaries

Research: local unlocked report titles → retest for the exact active attempt → fixed/failed attestation. Draft editing, reversible advisory preparation controls, and locked-device metadata views remain. These controls add no server submission requirements.

Client: metadata queue → authorized local unlock → report/conversation/evidence → assessment → fix evidence → actual deployment → retest → explicit closure. The internal conversation remains a separate recipient lane. Owner authority alone still does not decrypt report content. Account/password reset, sessions, MFA, members, invitations, keys, recovery, audit, capacity and exception paths remain reachable.

All original v1 view keys remain. Coffee v2’s documentation-only `CoffeeChanges` key is replaced by `RefinementChanges`; product workflow keys remain. Both previous files are preserved separately.

## Responsive and feedback

1440 × 900 and 1366 × 768 retain the report document and assessment margin. Main content scrolls beneath the fixed topbar. At 1024px the queue uses the compact metadata ledger; a production report should stack context under the document below 1100px. Compact prototype report links open prepared desktop case views. At 390px, the report and conversation are one scrolling document with full-width actions. Dialogs should become viewport-safe sheets below 600px.

Existing loading, empty, validation, network, key/state conflict, capacity and recorded-success states are retained in their workflows. Preserve drafts on failure and show success only after a committed service response. Native transitions are instant; implementation may use restrained 120–180ms feedback with reduced-motion support.

## Verification and implementation limits

Saved-file geometry, text contrast and prototype destinations passed. Native action traces check the existing recovery gate, redaction, remediation and owner/recovery guards plus work tabs, draft feedback, preparation controls and focus return. The original 32 palette values and four additional aliases were verified from the saved file.

Fields are editable design text with prepared values. File pickers/downloads, signing, encryption, MFA, email and backend outcomes are demonstrations. Supporting sample rows open representative canonical-report states rather than separate persisted records. Manual FigCraft playback, keyboard focus, screen-reader semantics, production input handling and security behavior require separate checks. No implementation or accessibility certification is claimed.
