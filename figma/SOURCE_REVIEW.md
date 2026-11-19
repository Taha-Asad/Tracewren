# Source review — design baseline

The authoritative source is **[requirements/SRS.md](../requirements/SRS.md), Revision 2.8**, frozen by **[DEC-026](../decisions/DECISION_LOG.md)**. Existing specifications were not edited.

Reviewed the written project suite: README, project metadata, project summary, comprehensive overview, BRD, frozen SRS, university edition, discovery report, personas, charter/MVP, interview ledger, HOD proposal, WBS, CVSS fixtures, high-level architecture, key management, decision log, and Week 1–3 deliverables. Structural/behavioral Mermaid sources and their rendered lifecycle diagram informed the workflow. DOCX text and XLSX cell content were extracted; Resources copies were hash checked as duplicates of the canonical compiled documents. Document-generation and verification scripts/configurations were inventoried for provenance, rather than executed as application tests.

The inventory contains **19 Markdown documents**, **14 DOCX files** (7 unique compiled documents), **2 XLSX files** (1 unique workbook), **10 diagram sources**, and 19 configuration/tooling files. See [source-inventory.json](../evidence/design-review/source-inventory.json) for exact paths and hashes.

## What the product actually needs

Small teams and external researchers need a confidential path from policy discovery to encrypted intake, defensible assessment, concrete fix evidence, an actual deployment record and an attempt-bound retest. These are separate checkpoints. This is a vulnerability coordination tool, not a scanner or a general issue tracker.

The provisional personas are Alex Rivera (external researcher) and Sarah Chen (startup security lead). **The interview ledger records 0/4 completed interviews.** No usability findings, SUS score, security certification or live-user validation are claimed by this design.

## Conflicts resolved for this design

| Topic | Frozen SRS behavior used | Stale or conflicting context |
|---|---|---|
| Report access | Active report recipient snapshot; owner ordinary session is metadata-only unless also granted | Older prose describes program assignment as sufficient for all historical reports |
| Routing labels | 8 labels including **CRYPTOGRAPHIC_CONFIGURATION** | Older discovery/charter enumerations contain SSRF instead |
| Timeout | At least **14 eligible days**; paused periods excluded | HOD proposal uses 7 days and an older state name |
| Guest submission limit | **5 new submission sessions/hour/IP** | Architecture/overview use 10 |
| Evidence limits | Up to **3 files**, **25 MiB encrypted each**, **50 MiB combined report** | Earlier prose only states a per-file limit |
| Config evidence audience | Shared **Class B**, per SRS **FR-6.3** and SCR-04 | University summary says Class C |
| Branch verification | Compare proposed commit **BASE** to target branch **HEAD** | Older examples reverse the comparison |
| Lifecycle cron | `/api/cron/lifecycle-evaluate` | Architecture uses an older internal route |
| Audit names | `tenant_row_hash`, `report_chain_hash`, `bbt_app_runtime` | Older prose uses `row_hash` and `bbt_app` |
| Capacity | 20 MiB intake / 6 MiB security reserve / 300 KiB critical floor / 1 GiB evidence per tenant | Old WBS/BRD quotas differ |
| Priority | Guest recovery, owner MFA and key lifecycle remain P1 | Older WBS schedules some of these only after the academic demo |
| Commercial claims | P2/commercial section, with undecided entitlements marked as a design gap | Older documents disagree on Community/Team quotas and program counts |

Source inconsistencies are recorded here; the frozen specification remains untouched.

## Decisions still needed before implementation

1. Reconcile commercial quotas, renewal/downgrade and tax presentation before building billing enforcement. DEC-022 supplies a single $49/month Team plan, not an agreed entitlement table.
2. Specify organization membership invitation expiry and resend/revoke behavior. The commercial private-program invitation policy is separately defined as 72-hour, single-use and email-bound.
3. Specify platform operator roles, strong authentication, suspension/appeal, retention and researcher access while a tenant is suspended. The WBS mentions a console; the frozen SRS does not supply this policy.
4. Conduct the pending interviews and an observed keyboard/recovery usability study. The design follows the specified requirements and should be validated with target users.
5. Supply final reviewed legal policy text and real program fingerprints. All domains, keys and report content in the file are synthetic fixtures.
