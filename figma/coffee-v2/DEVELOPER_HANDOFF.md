# Coffee v2 · developer notes

This refines the existing design and supplements the [full product handoff](../DEVELOPER_HANDOFF.md). The frozen SRS Revision 2.8 remains authoritative; v2 introduces no scanner, AI processing, reward currency or commercial feature commitment.

## Layout and materials

Use a 216px espresso sidebar and 64px topbar on desktop, with a 32px content inset. Everyday work sits on a continuous parchment surface. Active retest and case decisions use an espresso emphasis area. Use quiet rules to divide ledgers; reserve inset wells for evidence, inputs and transient feedback. Source semantic colors are in [design-tokens.json](design-tokens.json); primary action is a semantic `color/action` variable.

The 78px client row is a reusable component with reference, category, asset, severity, state and owner properties. Researcher rows are 80px. Native source components precede screen assembly. Keep 44px action targets. Inter serves interface text, Nunito Sans headings and JetBrains Mono request/evidence excerpts; these fonts were available to the native authoring API. Use the named styles and variable bindings rather than copying individual colors.

## Workflows and permissions

Research desk: current retest → exact attempt → independent fixed/failed attestation. The local draft resumes in an overlay; Save changes a native status variable. Scope/evidence preparation controls toggle reversibly and are advisory. They do not become additional server-side submission gates. Own-report titles appear only after local unlock; the locked-device state uses neutral metadata.

Client: queue → locked case → local unlock → case document → assessment/decision → fix → deployment → retest. Report, conversation and evidence tabs open prepared native views. The internal lane has separate recipients; researcher views never gain it. Focus reading presents the same unlocked report, with a visible return route and no data mutation.

Owner: program readiness, assigned metadata, people/invitations, policy, recovery and capacity. Ownership alone does not grant decrypted report content. Active report grants and fresh owner MFA retain their existing boundaries. The existing account/profile/password reset, sessions and keys screens remain reachable; password reset does not recreate an encryption key.

## Responsive and scrolling

1440 × 900 and 1366 × 768 retain a document plus decision margin. The main region scrolls beneath the fixed topbar. At 1024px use the 184px sidebar and compact metadata ledger. Case context should stack below the report under 1100px in implementation; compact review links currently open the prepared desktop case views. At 390px use one scrolling document, 20px inset and full-width actions. Mobile input/reply content sits below the fold rather than shrinking text. Dialogs become viewport-safe sheets below 600px; preserve drafts and restore focus to the trigger.

## Feedback and motion

Loading, empty, network, stale recipient/state, capacity, key restore and recorded-success states remain in the actual associated flow. Keep user text on failure. Show committed success only after the server confirms it. Native transitions are instant. In implementation use restrained 120–180ms feedback and honor reduced motion. Focus trapping, semantic labels, keyboard order and screen-reader announcements require executable UI testing.

## Verification and limits

The saved native file passed geometry, text contrast, destination and parsed action checks. The native action checks exercise the guest recovery gate, export redaction, attempt-2 remediation routes, owner/recovery guards and the new v2 checklist/draft/tab/focus actions. All original view keys remain. Fresh before/after exports compare the work surfaces.

Fields are editable design text with prepared values. Encrypt, send, MFA, DNS, signatures, downloads, file pickers and backend decisions are demonstrations. Supporting sample rows open representative canonical-report states, not separate persisted records. No live playback, real form input, browser accessibility conformance or security certification is claimed. Final legal copy, real public keys/QR codes and live services remain implementation work.
