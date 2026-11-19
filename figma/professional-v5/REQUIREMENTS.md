# SRS coverage and boundaries

Authority: `requirements/SRS.md`, revision 2.8. These are design and prepared interaction states; native FigCraft does not execute the backend, cryptography, signatures, mail, file download or authorization services.

| SRS family | V5 entry | Required boundaries retained |
| --- | --- | --- |
| SCR-01 Discovery & Safe Harbor | Program, Policy, ProgramKey | Explicit scope/exclusions, hosted policy, 64-character fingerprint and signed manifest |
| SCR-02 Encrypted submission | Access → ReportForm → Review → Receipt | Guest and registered paths, neutral category versus encrypted title, actual report steps/impact/files, separate recovery passphrase and saved-file acknowledgement |
| SCR-03 Confidential triage | CaseTriage and its five case tabs | Local unlock, stable ID/state/actor/attempt, shared versus internal lanes, official versus suggested severity, eight Base metrics and shared score explanation |
| SCR-04 Remediation | Fix1/Fix2, CommitChecked, Config, Deploy, Invite | Numbered records; Git ancestry is separate from deployment; actual deployment precedes retest; cancellation retains a superseded record |
| SCR-05 Retest & closure | RetestForm, InternalVerification, TimeoutGate | Attempt-bound observations; failed attempt → Accepted; replacement is new; researcher/internal/unverified outcomes stay distinct; internal authorship choice required |
| SCR-06 Program settings | PolicySettings, Integrations | DNS ownership, browser signing, bounded manifest expiry, read-only GitHub credentials, owner step-up and classified verification failures |
| SCR-07 Onboarding | OwnerOnboarding | Workspace, mandatory MFA, DNS proof, personal key, offline recovery challenge, defender assignment, sign/activate |
| SCR-08 Optional export | Export / ExportPreview | P2 is non-blocking; allowlisted metadata, redaction, closure sequence M and chain through K; private report prose excluded |
| SCR-09 Authentication | SignIn, Register, PasswordReset, MFA gates | Account password and encryption passphrase separated; password reset revokes sessions, not encryption-key loss |
| SCR-10 Keys & recovery | KeyDesk | Guest restore local-only, signature-only token rotation, personal backup, audited owner fetch, defender B+C versus researcher B-only re-wrap, historical keys retained after rotation |
| SCR-11 Membership | Members / PeopleRead | Owner-managed membership, program versus organization scope, key revocation and separate historical access |
| SCR-12 Queue, quotas & audit | Queue, Capacity, Audit | Class A queue/notifications, correct IDs, source quota examples and protected reserves, logical pause versus physical failure, retained checkpoint verification |

The 390px journey covers guest submission/recovery, case reading tabs, failed retest, an explicit defender role switch, replacement evidence, deployment, retest invitation, an explicit researcher switch and verification. Desktop layouts cover all twelve families. The handoff specifies how the remaining administrative forms collapse at narrow widths; those are not claimed as a separately replayed mobile journey.

## Fixture provenance

BBT-0241, its finding, expected 403/observed 200, original filenames, scores and supplied attempt evidence are retained from the existing synthetic design fixtures. Supporting organization queue records remain metadata-only where their private content was not supplied. No new vulnerability, raw attachment screenshot, performance statistic or new timestamp is invented.

The supplied attempt-1 deployment timestamp (17 Oct, 13:40) precedes its supplied assessment timestamp (13:55). V5 retains that deployment metadata rather than inventing a replacement timestamp. The activity order represents record progression; deployment metadata is not presented as the recording time. Missing event timestamps remain descriptive rather than fabricated.

## Prototype limits

Input fields contain prepared examples. The main code-evidence journey is connected. Configuration evidence retains required file/hash/encryption controls, but no configuration artifact was supplied, so the prototype does not fabricate a completed configuration proposal. New observations for a further failed attempt similarly require new evidence rather than silently reusing attempt 1.

SRS performance, WCAG/assistive-technology, cryptographic, API, concurrency and server-permission acceptance criteria remain implementation obligations. Native layout/contrast and interaction checks do not certify those services.
