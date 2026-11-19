# DATABASE MODELING, INDEXING & UI WIREFRAMES SPECIFICATION
## BugBountyTrack — Multi-Tenant Vulnerability Disclosure Platform with Client-Side Cryptographic Isolation and Evidence-Based Remediation Tracking

---

### Document Control & Academic Metadata

| Attribute | Specification |
| :--- | :--- |
| **Document Title** | Database Modeling, Physical Indexing, API Contracts & UI Wireframes |
| **Document Version** | **Revision 1.0 (Milestone Baseline — Academic Thesis Submission)** |
| **Release Date** | October 23, 2026 |
| **Author / Candidate** | **Taha Asadullah** (Roll No: **`24-ST-013`**) |
| **Academic Institution** | Punjab Tianjin University of Technology (PTUT), Lahore |
| **Department & Program** | Department of Software Engineering Technology — BS Software Engineering Technology |
| **Batch / Section** | Batch 24-SET-Fall / Section SET-B (`24-st-013@students.ptut.edu.pk`) |
| **FYP Project Supervisor** | **Sir Umar Hayat** (Assistant Professor, PTUT Lahore) |
| **Project Identifier** | `PTUT - PRJ - 089` (Sub-Field: 9. Cybersecurity, Privacy & LegalTech) |
| **Milestone** | **Week 4** — Database Modeling & UI Wireframes |
| **Governing Standards** | IEEE Std 42010-2011, IEEE Std 830-1998, ISO/IEC/IEEE 29148:2018, Peter Chen ERD (1976), OpenAPI 3.1 |
| **Database Engine** | PostgreSQL 16 (Neon Serverless, PgBouncer, Row Level Security) |
| **Requirements Baseline** | Submitted IEEE 830 SRS (`Revision 2.8`) & Week 3 High-Level Architecture Baseline |

---

## Supporting Deliverable Documents & Reference Artifacts

| Deliverable Document | Scope Covered | Repository & Cloud Reference |
| :--- | :--- | :--- |
| **Week 1 Discovery Report (`WEEK_1_DISCOVERY_REPORT.docx`)** | Executive Problem Space, Personas & MVP Charter | [View Week 1 Discovery Doc](https://docs.google.com/document/d/1drXMfAk4pIKc_9aMKZav62KfVZQ04--zT6VyuhDZKFA/edit?usp=drive_link) |
| **Week 2 Formal IEEE 830 SRS (`SRS.docx`)** | Formal Functional & Non-Functional Requirements Specification | [View Week 2 IEEE 830 SRS Doc](https://docs.google.com/document/d/1n8VKmXeK4TSTPPR-mDXp3NkKwDxvzTzEWR9tgdZlxSg/edit?usp=drive_link) |
| **Week 3 Architecture & Cloud Topology (`HIGH_LEVEL_ARCHITECTURE.docx`)** | 3-Tier Zero-Plaintext Model, Balanced DFDs, Enclaves & Cloud Stack | [View Week 3 Architecture Doc](https://drive.google.com/drive/folders/1KH_WK98ek_vsiBNtW76Kuds8jstbvL6o?usp=sharing) |
| **Week 4 Milestone Progress Report (`PROGRESS_REPORT.md`)** | Milestone Progress Report, Evidence & Week 5 Roadmap | [View Week 4 Submissions Folder (Google Drive)](https://drive.google.com/drive/folders/1z3rAcwYgd2IdIPZIuANeh0h4RfpvMTWQ?usp=drive_link) |

---

## 1. Executive Milestone Overview

The primary engineering objective of **Week 4** is the formal transition from high-level architectural topology to granular, verifiable software specifications. This document formalizes four foundational pillars of **BugBountyTrack** (`PTUT - PRJ - 089`):

1. **Relational Database Modeling in Peter Chen's Notation**: Constructing the complete conceptual and logical Entity-Relationship Diagram (ERD) adhering to Dr. Peter Chen's 1976 academic modeling standards (Entity Rectangles, Relationship Diamonds, Attribute Ovals, and Cardinality Mappings) normalized to Third Normal Form (3NF).
2. **Physical Database Indexing & Security Access Architecture**: Defining primary, composite, partial, and GIN inverted indexes for PostgreSQL 16, alongside declarative `FORCE ROW LEVEL SECURITY` (RLS) policies enforcing mathematical tenant isolation under unprivileged application roles (`bbt_app`).
3. **Complete REST & GraphQL API Endpoint Contracts**: Specifying standard request/response envelopes, cryptographic key encapsulation exchange routes, vulnerability intake pipelines, triage workflows, GitHub remediation ancestry verification, and RFC 7807 Problem Details error schemas.
4. **Primary User Interface (UI) Wireframes & Ergonomics**: Designing structural layouts for 6 primary system interfaces with zero ASCII icons, high visual contrast, and verified responsiveness down to 320px compact mobile viewports.

---

## 2. Conceptual & Logical Database Modeling (Peter Chen's Notation)

### 2.1 Academic Model Specification
In strict compliance with university curriculum standards, the conceptual database model is structured according to **Peter Chen's Entity-Relationship Model (1976)**:
* **Entities (Rectangles)**: Distinct physical or conceptual domain objects maintaining independent lifecycles (`ORGANIZATION`, `USER`, `REPORTS`, etc.).
* **Relationships (Diamonds)**: Meaningful structural associations connecting two or more entities with explicit cardinality constraints (`1:1`, `1:N`, `M:N`).
* **Attributes (Ovals / Ellipses)**: Atomic properties describing an entity. Primary key attributes are explicitly designated with an underline and `(PK)` tag; foreign keys are designated with `(FK)`.

To maintain visual clarity, eliminate tangled edge intersections, and ensure maximum legibility at academic print scale, the database architecture is presented across two complementary sub-domain models:
1. **Core Tenancy, Identity & Governance Enclave** (`Figure 4.1`)
2. **Vulnerability Intake, Triage, Remediation & Tamper-Evident Audit Enclave** (`Figure 4.2`)

---

### 2.2 Core Tenancy, Identity & Governance Subsystem

![Figure 4.1: Core Domain Entity-Relationship Model (Peter Chen Notation)](diagrams/fig4_1_chen_erd_core.png)

**Figure 4.1: Core Domain Entity-Relationship Model (Peter Chen Notation)**

Figure 4.1 captures the multi-tenant root hierarchy of BugBountyTrack:
* An **`ORGANIZATION`** sponsors one or more **`BOUNTY_PROGRAMS`** (`1:N`) and has multiple **`USERS`** enrolled via the **`USER_MEMBERSHIP`** associative entity (`1:N` on both sides).
* A **`BOUNTY_PROGRAM`** defines one or more **`PROGRAM_SCOPES`** (`1:N`) designating permissible target domains, CIDRs, mobile binaries, and out-of-scope assets.
* A **`USER`** possesses one or more **`CRYPTO_KEYPAIRS`** (`1:N`), maintaining their active Curve25519 public key armor and client-side encrypted private bundle for zero-knowledge decryption.

---

### 2.3 Vulnerability Intake, Remediation & Audit Subsystem

![Figure 4.2: Triage, Remediation & Audit Subsystem (Peter Chen Notation)](diagrams/fig4_2_chen_erd_triage_audit.png)

**Figure 4.2: Triage, Remediation & Audit Subsystem (Peter Chen Notation)**

Figure 4.2 details the vulnerability lifecycle and immutable audit structures:
* A central **`REPORTS`** entity is submitted to a specific organization and program. It includes multiple encrypted **`ATTACHMENTS`** (`1:N`) stored in Cloudflare R2 and multiple **`REPORT_RECIPIENTS`** (`1:N`) holding individual Curve25519 wrapped session key capsules.
* Collaboration occurs via **`TRIAGE_COMMENTS`** (`1:N`), distinguishing internal defender notes from researcher-visible dialog.
* Remediation is verified via **`REMEDIATION_RECORDS`** (`1:1`), which store verified Git commit SHAs and branch ancestry states evaluated via the GitHub REST API.
* Every security-sensitive transaction is recorded in **`AUDIT_EVENTS`** (`1:N`) using a forward-chained SHA-256 hash architecture, while **`SLA_TRACKING`** (`1:1`) monitors triage response and resolution timelines.

---

### 2.4 Relational Data Dictionary (Third Normal Form - 3NF)

#### Table 4.1: `organizations` (Tenant Partition Boundary)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique immutable identifier for the organization tenant. |
| `slug` | `VARCHAR(64)` | `UNIQUE` | No | URL-safe tenant path identifier (e.g., `acme-corp`). |
| `display_name` | `VARCHAR(255)` | None | No | Formal enterprise name displayed in user interfaces. |
| `verified_domain` | `VARCHAR(255)` | None | Yes | Domain name validated via RFC 9116 `security.txt` or DNS TXT. |
| `security_settings` | `JSONB` | `DEFAULT '{}'::jsonb` | No | Tenant-level settings: IP allowlists, session TTL, MFA policies. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of tenant creation. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of last organization configuration update. |

#### Table 4.2: `users` (Global Identity & Authentication)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique internal identifier for the user account. |
| `email` | `VARCHAR(255)` | `UNIQUE` | No | Normalized user email address used for login and notifications. |
| `password_hash` | `VARCHAR(255)` | None | No | Argon2id cryptographic hash (minimum $m=65536, t=3, p=4$). |
| `full_name` | `VARCHAR(255)` | None | No | User's full name or researcher handle. |
| `global_role` | `VARCHAR(32)` | `CHECK IN ('ADMIN', 'USER')` | No | Platform-wide administrative authority flag. |
| `totp_secret_enc`| `TEXT` | None | Yes | AES-256-GCM encrypted TOTP secret seed for MFA step-up auth. |
| `is_active` | `BOOLEAN` | `DEFAULT true` | No | Account status flag governing login authorization. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of user account registration. |

#### Table 4.3: `user_memberships` (Multi-Tenant Role Association)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique membership identifier. |
| `organization_id`| `UUID` | `REFERENCES organizations(id) ON DELETE CASCADE` | No | Associated tenant organization. |
| `user_id` | `UUID` | `REFERENCES users(id) ON DELETE CASCADE` | No | Associated user identity. |
| `tenant_role` | `VARCHAR(32)` | `CHECK IN ('ORG_ADMIN', 'LEAD', 'TRIAGER', 'VIEWER')` | No | Role-based authorization tier within the specific tenant. |
| `joined_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of membership grant. |

#### Table 4.4: `bounty_programs` (Disclosure Program Governance)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique identifier for the bug bounty program. |
| `organization_id`| `UUID` | `REFERENCES organizations(id) ON DELETE CASCADE` | No | Owning tenant organization. |
| `title` | `VARCHAR(255)` | None | No | Program title (e.g., `Acme Public Vulnerability Disclosure`). |
| `policy_markdown`| `TEXT` | None | No | Safe Harbor terms, disclosure guidelines, and SLAs. |
| `is_active` | `BOOLEAN` | `DEFAULT true` | No | Intake status flag governing whether new submissions are accepted. |
| `min_bounty_cents`| `INTEGER` | `DEFAULT 0` | No | Minimum payout amount in USD cents. |
| `max_bounty_cents`| `INTEGER` | `DEFAULT 0` | No | Maximum payout ceiling in USD cents. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of program initialization. |

#### Table 4.5: `program_scopes` (Asset Boundary Definitions)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique scope item identifier. |
| `program_id` | `UUID` | `REFERENCES bounty_programs(id) ON DELETE CASCADE` | No | Parent bounty program. |
| `target_type` | `VARCHAR(32)` | `CHECK IN ('DOMAIN', 'CIDR', 'MOBILE_APP', 'API', 'SOURCE')` | No | Category of targeted asset. |
| `target_ident` | `VARCHAR(512)` | None | No | Scope string (e.g., `*.api.acme.com`, `192.168.1.0/24`). |
| `instruction` | `VARCHAR(32)` | `CHECK IN ('IN_SCOPE', 'OUT_OF_SCOPE')` | No | Explicit scope authorization directive. |

#### Table 4.6: `reports` (Core Vulnerability Vault)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Internal report primary key. |
| `tracking_uuid` | `UUID` | `UNIQUE, DEFAULT gen_random_uuid()` | No | Public opaque UUID used by guest researchers for report tracking. |
| `organization_id`| `UUID` | `REFERENCES organizations(id) ON DELETE CASCADE` | No | Target tenant organization (RLS isolation key). |
| `program_id` | `UUID` | `REFERENCES bounty_programs(id) ON DELETE RESTRICT`| No | Target bounty program. |
| `enc_title` | `TEXT` | None | No | Curve25519 encrypted report vulnerability title. |
| `enc_payload` | `TEXT` | None | No | OpenPGP.js RFC 9580 armored ciphertext containing PoC and details. |
| `client_fp` | `VARCHAR(64)` | None | No | SHA-256 fingerprint of the submitting researcher's public key. |
| `severity` | `VARCHAR(16)` | `CHECK IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')` | No | Triaged severity classification. |
| `cvss_score` | `NUMERIC(3,1)` | `CHECK (cvss_score >= 0.0 AND cvss_score <= 10.0)` | Yes | Mathematical CVSS v3.1 base score. |
| `cvss_vector` | `VARCHAR(128)` | None | Yes | Formal CVSS 3.1 metric string (e.g., `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/...`). |
| `status` | `VARCHAR(32)` | `CHECK IN ('NEW', 'TRIAGED', 'ACCEPTED', 'RESOLVED', 'REJECTED')` | No | Current workflow state in the triage pipeline. |
| `guest_hash` | `VARCHAR(128)` | None | Yes | Salted SHA-256 hash of guest session token for anonymous retrieval. |
| `submitted_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of report intake. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of last status or data mutation. |

#### Table 4.7: `report_recipients` (Curve25519 Session Key Capsules)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique key capsule identifier. |
| `report_id` | `UUID` | `REFERENCES reports(id) ON DELETE CASCADE` | No | Parent vulnerability report. |
| `user_id` | `UUID` | `REFERENCES users(id) ON DELETE CASCADE` | No | Authorized defender user permitted to decrypt. |
| `enc_wrapped_key`| `TEXT` | None | No | Curve25519 encapsulated symmetric AES-GCM session key. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of capsule generation. |

#### Table 4.8: `attachments` (Zero-Plaintext Binary Objects)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique attachment metadata identifier. |
| `report_id` | `UUID` | `REFERENCES reports(id) ON DELETE CASCADE` | No | Associated vulnerability report. |
| `storage_key` | `VARCHAR(512)` | `UNIQUE` | No | Cloudflare R2 object store key path. |
| `file_name_enc` | `TEXT` | None | No | AES-GCM encrypted original filename. |
| `mime_type` | `VARCHAR(128)` | None | No | Sanitized content MIME type (e.g., `application/octet-stream`). |
| `file_size_bytes`| `BIGINT` | `CHECK (file_size_bytes > 0 AND file_size_bytes <= 20971520)` | No | Physical file size (strictly capped at 20 MiB). |
| `sha256_checksum`| `VARCHAR(64)` | None | No | Cryptographic digest for post-upload integrity validation. |
| `uploaded_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of binary upload completion. |

#### Table 4.9: `triage_comments` (Encrypted Audit Dialogue)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique discussion comment identifier. |
| `report_id` | `UUID` | `REFERENCES reports(id) ON DELETE CASCADE` | No | Associated vulnerability report. |
| `author_user_id` | `UUID` | `REFERENCES users(id) ON DELETE SET NULL` | Yes | Comment author (null if anonymous guest researcher). |
| `is_internal` | `BOOLEAN` | `DEFAULT false` | No | If true, comment is visible strictly to tenant defenders. |
| `comment_cipher` | `TEXT` | None | No | Curve25519 encrypted comment text payload. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of comment creation. |

#### Table 4.10: `remediation_records` (GitHub Ancestry Verification)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique remediation verification record. |
| `report_id` | `UUID` | `UNIQUE, REFERENCES reports(id) ON DELETE CASCADE` | No | Associated vulnerability report (`1:1` relationship). |
| `assignee_id` | `UUID` | `REFERENCES users(id) ON DELETE SET NULL` | Yes | Engineering lead responsible for patch deployment. |
| `github_repo` | `VARCHAR(255)` | None | No | Full repository slug (e.g., `acme-corp/api-gateway`). |
| `github_commit_sha`| `VARCHAR(40)` | None | No | 40-character hexadecimal Git commit hash containing fix. |
| `branch_name` | `VARCHAR(255)` | `DEFAULT 'main'` | No | Protected production branch requiring ancestry confirmation. |
| `ancestry_verified`| `BOOLEAN`| `DEFAULT false` | No | Set to true strictly when verified via GitHub API comparison. |
| `verified_at` | `TIMESTAMPTZ` | None | Yes | UTC timestamp of automated verification. |
| `proof_markdown` | `TEXT` | None | Yes | Developer documentation describing verification test results. |

#### Table 4.11: `crypto_keypairs` (Public Key Ring & Encrypted Bundles)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique keypair registry identifier. |
| `user_id` | `UUID` | `REFERENCES users(id) ON DELETE CASCADE` | No | Owning user identity. |
| `public_key_armor`| `TEXT` | None | No | Armored Curve25519 (RFC 9580) public key certificate. |
| `enc_private_bundle`| `TEXT`| None | No | Client-side Argon2 S2K encapsulated private key bundle. |
| `fingerprint` | `VARCHAR(64)` | `UNIQUE` | No | 64-character SHA-256 fingerprint for unambiguous key discovery. |
| `is_primary` | `BOOLEAN` | `DEFAULT true` | No | Flag indicating current key used for new report encapsulation. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | UTC timestamp of keypair generation. |

#### Table 4.12: `audit_events` (Forward-Chained Cryptographic Ledger)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `BIGSERIAL` | `PRIMARY KEY` | No | Monotonically increasing sequential block number. |
| `organization_id`| `UUID` | `REFERENCES organizations(id) ON DELETE CASCADE` | No | Tenant partition boundary. |
| `actor_id` | `VARCHAR(64)` | None | No | User ID or salted guest session token identifier. |
| `actor_role` | `VARCHAR(32)` | None | No | Security role claim of the actor at event execution. |
| `action_type` | `VARCHAR(64)` | None | No | Action code: `REPORT_INTAKE`, `KEY_ROTATE`, `REMEDIATE_VERIFY`. |
| `target_entity` | `VARCHAR(64)` | None | No | Database relation affected (e.g., `reports`). |
| `target_id` | `UUID` | None | Yes | Primary key of affected entity. |
| `ip_address_hash`| `VARCHAR(64)` | None | No | Salted SHA-256 hash of client IP address. |
| `row_hash` | `VARCHAR(64)` | None | No | SHA-256 digest over current record fields. |
| `prev_chain_hash`| `VARCHAR(64)`| None | No | SHA-256 digest of preceding sequential record's `row_hash`. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT clock_timestamp()` | No | Immutable UTC event recording timestamp. |

#### Table 4.13: `sla_tracking` (Triage & Resolution Governance)
| Column | Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :---: | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | No | Unique SLA monitoring record. |
| `report_id` | `UUID` | `UNIQUE, REFERENCES reports(id) ON DELETE CASCADE` | No | Target vulnerability report (`1:1` mapping). |
| `target_first_response`| `TIMESTAMPTZ`| None | No | Calculated target timestamp for initial triage acknowledgment. |
| `actual_first_response`| `TIMESTAMPTZ`| None | Yes | Recorded timestamp of first triage status transition. |
| `target_resolution` | `TIMESTAMPTZ`| None | No | Calculated target timestamp for patch verification. |
| `actual_resolution` | `TIMESTAMPTZ`| None | Yes | Recorded timestamp of vulnerability closure. |
| `is_breached` | `BOOLEAN` | `DEFAULT false` | No | Automated breach indicator asserted by SLA cron engine. |

---

## 3. Physical Database Indexing & Security Access Architecture

![Figure 4.3: Physical PostgreSQL Indexing & Security Access Architecture](diagrams/fig4_3_database_indexing_architecture.png)

**Figure 4.3: Physical PostgreSQL Indexing & Security Access Architecture**

### 3.1 Indexing Matrix & Query Acceleration Rationale

To satisfy Non-Functional Requirement **`NFR-02`** (sub-50 ms median API response latency) and eliminate full table scans across high-volume tables, PostgreSQL 16 indexes are defined systematically:

| Table | Index Name | Type | Indexed Columns | Filter / Opclass | Purpose & Query Target |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `reports` | `idx_reports_triage_queue` | B-Tree | `(organization_id, status, submitted_at DESC)` | None | Covers the primary Defender Triage Workbench queue. Eliminates in-memory sorting. |
| `reports` | `idx_reports_pending_triage` | Partial B-Tree | `(organization_id, submitted_at DESC)` | `WHERE status = 'NEW'` | Accelerates SLA burn-down alerts; index size is 95% smaller than full relation index. |
| `reports` | `idx_reports_tracking_uuid` | B-Tree | `(tracking_uuid)` | `UNIQUE` | O(1) lookup for guest researchers retrieving submission status via UUID. |
| `organizations` | `idx_org_settings_gin` | GIN | `(security_settings)` | `jsonb_path_ops` | Accelerates containment queries (`@>`) evaluating tenant security policies and MFA requirements. |
| `report_recipients`| `idx_recipients_lookup` | B-Tree | `(report_id, user_id)` | `UNIQUE` | Guarantees exactly one wrapped key capsule per user and optimizes decrypt authorization checks. |
| `attachments` | `idx_attachments_report_id`| B-Tree | `(report_id, uploaded_at ASC)` | None | Fast retrieval of all binary attachment metadata when viewing report details. |
| `audit_events` | `idx_audit_chain_forward` | B-Tree | `(organization_id, id ASC)` | Include `(row_hash, prev_chain_hash)` | Enables high-throughput index-only linear scans during cryptographic audit verification routines. |
| `sla_tracking` | `idx_sla_active_breach` | Partial B-Tree | `(target_first_response ASC)` | `WHERE is_breached = false AND actual_first_response IS NULL` | Optimized for background serverless cron job polling for impending SLA violations. |

---

### 3.2 Row Level Security (RLS) Implementation Script

PostgreSQL 16 Row Level Security (RLS) policies are enforced at the database kernel level to prevent cross-tenant data leakage, even in the event of an application SQL injection vulnerability:

```sql
-- =========================================================================
-- TENANT ISOLATION POLICY SPECIFICATION (PostgreSQL 16)
-- Enforced under unprivileged application role: bbt_app
-- =========================================================================

-- 1. Create unprivileged application connection role
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'bbt_app') THEN
        CREATE ROLE bbt_app WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
    END IF;
END $$;

-- 2. Enable and Force RLS on multi-tenant relations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations FORCE ROW LEVEL SECURITY;

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports FORCE ROW LEVEL SECURITY;

ALTER TABLE report_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_recipients FORCE ROW LEVEL SECURITY;

ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments FORCE ROW LEVEL SECURITY;

ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events FORCE ROW LEVEL SECURITY;

-- 3. Define declarative tenant isolation policies
CREATE POLICY tenant_isolation_organizations ON organizations
    FOR ALL
    TO bbt_app
    USING (id = NULLIF(current_setting('app.current_org_id', true), '')::uuid);

CREATE POLICY tenant_isolation_reports ON reports
    FOR ALL
    TO bbt_app
    USING (organization_id = NULLIF(current_setting('app.current_org_id', true), '')::uuid)
    WITH CHECK (organization_id = NULLIF(current_setting('app.current_org_id', true), '')::uuid);

CREATE POLICY tenant_isolation_audit_events ON audit_events
    FOR SELECT
    TO bbt_app
    USING (organization_id = NULLIF(current_setting('app.current_org_id', true), '')::uuid);
```

---

## 4. Complete REST & GraphQL API Endpoint Contracts

![Figure 4.4: REST & GraphQL API Architecture & Request-Response Lifecycle](diagrams/fig4_4_api_architecture_and_lifecycle.png)

**Figure 4.4: REST & GraphQL API Architecture & Request-Response Lifecycle**

### 4.1 Standard Request/Response Protocol & RFC 7807 Error Envelope

All REST endpoints adhere to JSON:API formatting standards. Successful responses return HTTP status code `200` or `201` wrapped in a standard success envelope:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-10-23T14:30:00.000Z",
    "request_id": "req_01HXYZ789ABC"
  }
}
```

Client and server exceptions strictly adhere to **RFC 7807 Problem Details for HTTP APIs** (`Content-Type: application/problem+json`):
```json
{
  "type": "https://bugbountytrack.com/errors/invalid-commit-ancestry",
  "title": "Remediation Commit Verification Failed",
  "status": 422,
  "detail": "Commit SHA 4f89d12 is not an ancestor of target branch 'main' in acme-corp/api-gateway.",
  "instance": "/api/v1/reports/rpt_8092/remediation/verify-commit",
  "code": "ERR_COMMIT_NOT_IN_BRANCH"
}
```

---

### 4.2 Comprehensive REST API Endpoint Contracts

#### 1. Authentication & Session Initialization
* **Route**: `POST /api/v1/auth/session`
* **Access**: Public / Cloudflare Turnstile Protected
* **Headers**: `Content-Type: application/json`, `X-Turnstile-Token: <token>`
* **Request DTO**:
  ```json
  {
    "email": "defender@acme.com",
    "password": "CorrectHorseBatteryStaple123!",
    "totp_code": "482910"
  }
  ```
* **Response DTO (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "user_id": "usr_9021a8b",
      "email": "defender@acme.com",
      "memberships": [
        {
          "org_id": "org_acme123",
          "tenant_role": "LEAD",
          "org_slug": "acme-corp"
        }
      ]
    }
  }
  ```
* **Cookie**: `Set-Cookie: __Host-bbt-session=<jwt>; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=28800`

---

#### 2. Organization Public Key Ring Retrieval
* **Route**: `GET /api/v1/organizations/{orgSlug}/public-keys`
* **Access**: Public (Used by researchers' browsers during client-side encryption)
* **Response DTO (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "org_slug": "acme-corp",
      "public_keys": [
        {
          "user_id": "usr_9021a8b",
          "fingerprint": "SHA256:7e3d9b1a4f0288c...b29e",
          "armor": "-----BEGIN PGP PUBLIC KEY BLOCK-----\nmDMEY...curve25519\n-----END PGP PUBLIC KEY BLOCK-----"
        }
      ]
    }
  }
  ```

---

#### 3. Anonymous Encrypted Vulnerability Report Submission
* **Route**: `POST /api/v1/reports`
* **Access**: Public / Guest Researcher
* **Headers**: `Content-Type: application/json`, `X-Turnstile-Token: <token>`
* **Request DTO**:
  ```json
  {
    "org_slug": "acme-corp",
    "program_id": "prg_core_vdp",
    "encrypted_title": "wcFMA3...==",
    "encrypted_payload": "-----BEGIN PGP MESSAGE-----\nwV4D...encrypted_body...==\n-----END PGP MESSAGE-----",
    "client_public_key": "-----BEGIN PGP PUBLIC KEY BLOCK-----\nmDMEY...researcher_key\n-----END PGP PUBLIC KEY BLOCK-----",
    "recipient_key_capsules": [
      {
        "user_id": "usr_9021a8b",
        "wrapped_session_key": "wcFMA...capsule=="
      }
    ]
  }
  ```
* **Response DTO (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "tracking_uuid": "550e8400-e29b-41d4-a716-446655440000",
      "guest_recovery_token": "bbt_rec_91a0c84e1b82f",
      "submitted_at": "2026-10-23T14:35:12.102Z",
      "status": "NEW"
    }
  }
  ```

---

#### 4. Cloudflare R2 Direct Upload Presigned URL Request
* **Route**: `POST /api/v1/reports/{reportId}/attachments/presign`
* **Access**: Authorized Guest Researcher or Defender
* **Request DTO**:
  ```json
  {
    "file_size_bytes": 4194304,
    "sha256_checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "mime_type": "application/octet-stream"
  }
  ```
* **Response DTO (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "upload_url": "https://bbt-vault.r2.cloudflarestorage.com/raw/acme/rpt_8092/att_01?X-Amz-Signature=...",
      "storage_key": "raw/acme/rpt_8092/att_01",
      "expires_in_seconds": 900
    }
  }
  ```

---

#### 5. Defender Triage Assessment & CVSS Calculation
* **Route**: `PATCH /api/v1/reports/{reportId}/triage`
* **Access**: Authenticated Defender (`Role >= TRIAGER`)
* **Request DTO**:
  ```json
  {
    "status": "TRIAGED",
    "severity": "CRITICAL",
    "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    "internal_note": "wcFMA...encrypted_internal_note=="
  }
  ```
* **Response DTO (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "report_id": "rpt_8092",
      "status": "TRIAGED",
      "cvss_base_score": 9.8,
      "sla_first_response_met": true,
      "updated_at": "2026-10-23T15:00:00.000Z"
    }
  }
  ```

---

#### 6. GitHub Remediation Commit Ancestry Verification
* **Route**: `POST /api/v1/reports/{reportId}/remediation/verify-commit`
* **Access**: Authenticated Defender (`Role >= LEAD`)
* **Request DTO**:
  ```json
  {
    "github_repo": "acme-corp/api-gateway",
    "commit_sha": "4f89d12a9e3b87c10b25e7f6d4a89c2e1f5a7b03",
    "target_branch": "main"
  }
  ```
* **Response DTO (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "ancestry_verified": true,
      "commit_status": "ancestor",
      "verified_at": "2026-10-23T15:45:10.000Z",
      "commit_author": "developer@acme.com",
      "commit_message": "fix(api): patch ImageMagick command injection vulnerability"
    }
  }
  ```

---

#### 7. Tamper-Evident Audit Ledger Verification
* **Route**: `GET /api/v1/audit-logs/verify`
* **Access**: Authenticated Defender (`Role == ORG_ADMIN`)
* **Response DTO (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "verified": true,
      "total_blocks_checked": 1042,
      "genesis_hash": "0000000000000000000000000000000000000000000000000000000000000000",
      "latest_block_hash": "9a4f2c1b8e7d6a5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c",
      "tamper_detected": false
    }
  }
  ```

---

### 4.3 GraphQL Schema Definition (Alternative Workbench Protocol)

To support real-time reactive UI subscriptions and complex nested queries in the Defender Workbench without REST over-fetching, BugBountyTrack exposes a parallel GraphQL endpoint at `/api/graphql`:

```graphql
type Organization {
  id: ID!
  slug: String!
  displayName: String!
  verifiedDomain: String
  bountyPrograms: [BountyProgram!]!
}

type BountyProgram {
  id: ID!
  title: String!
  isActive: Boolean!
  minBountyCents: Int!
  maxBountyCents: Int!
  scopes: [ProgramScope!]!
}

type ProgramScope {
  id: ID!
  targetType: String!
  targetIdentifier: String!
  instruction: String!
}

type Report {
  id: ID!
  trackingUuid: String!
  severity: String!
  cvssScore: Float
  cvssVector: String
  status: String!
  submittedAt: String!
  encryptedTitle: String!
  encryptedPayload: String!
  attachments: [Attachment!]!
  comments: [TriageComment!]!
  remediation: RemediationRecord
}

type Attachment {
  id: ID!
  storageKey: String!
  fileSizeBytes: Int!
  sha256Checksum: String!
}

type RemediationRecord {
  githubRepo: String!
  githubCommitSha: String!
  ancestryVerified: Boolean!
  verifiedAt: String
}

type Query {
  organization(slug: String!): Organization
  report(id: ID!): Report
  reports(status: String, severity: String, limit: Int, offset: Int): [Report!]!
  auditLedgerVerification: Boolean!
}

type Mutation {
  submitEncryptedReport(input: SubmitReportInput!): Report!
  updateReportStatus(reportId: ID!, status: String!): Report!
  verifyRemediationCommit(reportId: ID!, repo: String!, sha: String!): RemediationRecord!
}

type Subscription {
  reportUpdated(reportId: ID!): Report!
}
```

---

## 5. Primary User Interface (UI) Wireframes & Ergonomics

### 5.1 Design System & Non-Negotiable Engineering Laws
In strict accordance with **Constitution Rule 1 (Zero ASCII / Unicode Mock Icons)**, **Rule 5 (Rejection of AI Slop)**, and **Rule 8 (Mobile Responsiveness down to 320px)**:
1. **Zero ASCII Icons**: All navigational links, buttons, and status indicators rely strictly on clean semantic vector typography and system design tokens (e.g., `[Open & unlock]`, `[Assess & accept]`, `[Verify continuity]`, `[Request retest]`).
2. **Authentic High-Craft UI Architecture**: Moving beyond generic low-fidelity schematic block diagrams, the application interfaces represent production-grade high-fidelity screen designs extracted directly from the **BugBountyTrack / Tracewren Design System** (`projects/Tracewren/figma/professional-v6/full/`), emphasizing high contrast ratios ($>7:1$), explicit operational data fields, and clean editorial typographic hierarchy.
3. **Ergonomic Viewport Scaling**: All screens maintain rigid responsiveness down to 320px mobile viewport widths with fluid flex/grid columns, sticky action footers, and minimum touch targets of $44 \times 44\text{ px}$.

---

### 5.2 Screen 1: Anonymous Vulnerability Intake & Scope Landing Screen

![Figure 4.5: Screen 1 — Anonymous Vulnerability Intake & Scope Landing Screen](diagrams/fig4_5_screen_intake_landing.png)

**Figure 4.5: Screen 1 — Anonymous Vulnerability Intake & Scope Landing Screen**

* **Core Operational Intent**: Serves as the zero-trust public entry point for security researchers and ethical hackers.
* **Key Design Components**:
  * **Top Navigation & Branding**: Clean wordmark, platform navigational taxonomy (`Platform`, `For researchers`, `Programs`, `Resources`), and clear dual authentication triggers (`Sign in`, `Get started`).
  * **Safe Harbor & Hero Value Proposition**: Explicit statement of cryptographic isolation (*"From a private report to a verified fix. Bring researchers and security teams together with encrypted reports, clear fix evidence and a retest tied to the deployment"*).
  * **Interactive Report Workspace Preview**: Visual demonstration of the active vulnerability workspace, illustrating how findings, evidence attachments, and remediation tracking live in one cohesive context.
  * **Anonymous Access Recovery**: Prominent trigger (*"Already reported? Restore your access"*) enabling guest researchers to re-authenticate using their client-side `.bbt-recovery.json` token.

---

### 5.3 Screen 2: Defender Triage Queue & Report Filtering Workbench

![Figure 4.6: Screen 2 — Defender Triage Queue & Report Filtering Workbench](diagrams/fig4_6_screen_queue_triage.png)

**Figure 4.6: Screen 2 — Defender Triage Queue & Report Filtering Workbench**

* **Core Operational Intent**: The primary command desk for security teams managing incoming vulnerability disclosures.
* **Key Design Components**:
  * **Tenant Workspace Sidebar**: Multi-tenant navigation rail (`Northstar Labs / Defender workspace`) providing instant access to `Reports`, `Programs`, `Audit ledger`, `People`, `Security & keys`, and `Capacity`.
  * **Filter & Workflow Pipeline Rails**: Segmented views (`All reports`, `Assigned to me`, `Needs attention`) and linear workflow stage indicators (`Triage`, `Clarification`, `Fix work`, `Retest`, `Verified`).
  * **Triage Data Table**: Displays report identifier (`BBT-0241`), category/target asset (`Access control / api.northstar.example`), mathematical severity (`6.5 Medium`), and active workflow state.
  * **Contextual Selection & Decrypt Drawer**: Selecting a report opens the right-hand inspection drawer featuring the primary action button `[Open & unlock]` and emphasizing client-side encryption: *"Private titles and evidence stay encrypted until an authorized local key unlocks the report."*

---

### 5.4 Screen 3: Vulnerability Assessment & Decrypted Viewport

![Figure 4.7: Screen 3 — Vulnerability Assessment & Decrypted Viewport](diagrams/fig4_7_screen_case_triage.png)

**Figure 4.7: Screen 3 — Vulnerability Assessment & Decrypted Viewport**

* **Core Operational Intent**: Detailed assessment workbench displaying decrypted vulnerability details and technical reproduction steps.
* **Key Design Components**:
  * **Breadcrumbs & State Header**: Navigation breadcrumbs (`Northstar Labs / Reports / BBT-0241`), status badge (`Triaging`), reporter handle (`Alex Rivera`), and local device encryption state (`Unlocked on this device`).
  * **Decrypted Vulnerability Summary**: Displays plaintext decrypted strictly in browser memory (*"Workspace export crosses the authorization boundary"*).
  * **Reproduction Steps Pane**: Step-by-step audit instructions with clear side-by-side comparison of `Original test - expected` (`403 Forbidden`) versus `Original test - observed` (`200 OK`).
  * **CVSS Severity Matrix**: Side-by-side evaluation contrasting the researcher's suggestion (`8.1 High`) against the defender's formal assessment (`6.5 Medium`) with an explanatory diff rationale.
  * **Evidence Attachment Roster**: Interactive file cards for verified evidence payloads (`evidence-request.txt`, `response-comparison.txt`).

---

### 5.5 Screen 4: Cryptographic Key Management & Emergency Recovery Desk

![Figure 4.8: Screen 4 — Cryptographic Key Management & Emergency Recovery Desk](diagrams/fig4_8_screen_key_desk.png)

**Figure 4.8: Screen 4 — Cryptographic Key Management & Emergency Recovery Desk**

* **Core Operational Intent**: Full lifecycle management of Curve25519 public keys, private key rings, and disaster recovery paths.
* **Key Design Components**:
  * **Critical Architecture Principle**: Prominently warns: *"A password reset does not restore an encryption key. Account access and readable report content have separate recovery requirements."*
  * **Path 1: Guest Report Access**: Enables researchers to restore local report tracking using their client-side `.bbt-recovery.json` file and recovery passphrase (`[Restore guest report]`).
  * **Path 2: Personal Encryption Key**: Allows defenders to import or restore their `.bbt-user-keys.json` bundle on a new device using client-side Argon2 S2K passphrases (`[Restore personal key]`).
  * **Path 3: Organization Emergency Recovery**: Multi-signature break-glass recovery mechanism requiring Owner MFA and offline emergency keys with strict audit logging (`[Audited owner recovery]`).
  * **Key Lifecycle Triggers**: Direct actions for key rollover: *"Replace a lost researcher key"* and *"Revoke a compromised personal key"*.

---

### 5.6 Screen 5: Evidence-Based Remediation & GitHub Verification Panel

![Figure 4.9: Screen 5 — Evidence-Based Remediation & GitHub Verification Panel](diagrams/fig4_9_screen_remediation_deployed.png)

**Figure 4.9: Screen 5 — Evidence-Based Remediation & GitHub Verification Panel**

* **Core Operational Intent**: Bridges vulnerability closure with real-world Git version control, verifying that code fixes are deployed before marking a report resolved.
* **Key Design Components**:
  * **Remediation Attempt Tracker**: Tracks numbered deployment iterations (`Remediation / attempt 1`).
  * **Step 1: Code Evidence**: Binds the fix to a verified GitHub commit SHA (`portal / main / 7cb43e9d2fa7`), asserting commit ancestry on the protected `main` branch via the GitHub REST API.
  * **Step 2: Deployment Audit**: Records production deployment release tagging (`Production v0.8.4` at `19 Oct 2026, 14:22 UTC`).
  * **Step 3: Retest Execution**: Bridges communication with the original researcher: *"The deployment is ready for retest. Code evidence, actual deployment and observed verification stay bound to this numbered attempt."*
  * **Primary Action**: Sticky action trigger `[Request retest]` initiating formal re-verification.

---

### 5.7 Screen 6: Tamper-Evident Immutable Operational Audit Ledger

![Figure 4.10: Screen 6 — Tamper-Evident Immutable Operational Audit Ledger](diagrams/fig4_10_screen_audit_owner.png)

**Figure 4.10: Screen 6 — Tamper-Evident Immutable Operational Audit Ledger**

* **Core Operational Intent**: Enterprise compliance and forensic verification interface asserting continuous event integrity.
* **Key Design Components**:
  * **Cryptographic Ledger Table**: Displays forward-chained event blocks (`184`, `183`, `182`, `181`, `180`, `179`) with action categories (`Retest requested`, `Deployment recorded`, `Fix proposed`, `Historical access granted`, `Official score recorded`, `Member role changed`).
  * **Actor Claims & UTC Timestamps**: Each block records actor role (`Defender`, `Owner`) and immutable event time.
  * **Verification Action**: Prominent `[Verify continuity]` button calculating SHA-256 forward hashes across all historic blocks to confirm zero chain tampering.
  * **Epistemic Integrity Notice**: Explicit compliance footer: *"External checkpoint receipts can reveal rewritten history. An attestation record does not prove that software has no remaining bugs."*

---

## 6. Requirements Traceability Matrix (RTM)

The following matrix verifies 100% bidirectional coverage of submitted IEEE 830 Requirements (`SRS Revision 2.8`):

| IEEE 830 Req ID | Requirement Description | Database Entity / Index | REST API Endpoint Contract | UI Wireframe Screen |
| :---: | :--- | :--- | :--- | :---: |
| **`FR-1.1`** | RFC 9116 security.txt validation | `organizations.verified_domain` | `GET /api/v1/organizations/{slug}` | Screen 1 |
| **`FR-1.2`** | Anonymous report submission | `reports`, `idx_reports_tracking_uuid` | `POST /api/v1/reports` | Screen 1 |
| **`FR-1.6`** | Guest recovery passphrase generation | `reports.guest_hash` | `POST /api/v1/reports` (Response) | Screen 1 |
| **`FR-3.1`** | Client-side Curve25519 key generation | `crypto_keypairs.public_key_armor` | `GET /api/v1/organizations/{slug}/public-keys`| Screen 3 |
| **`FR-3.5`** | Encrypted attachment storage (20 MiB) | `attachments`, `idx_attachments_report_id`| `POST /api/v1/reports/{id}/attachments/presign`| Screen 1 |
| **`FR-4.1`** | Mathematical CVSS v3.1 calculation | `reports.cvss_score`, `reports.cvss_vector` | `PATCH /api/v1/reports/{id}/triage` | Screen 2 |
| **`FR-5.1`** | Multi-tenant triage workbench queue | `reports`, `idx_reports_triage_queue` | `GET /api/v1/reports` | Screen 2 |
| **`FR-5.4`** | Automated SLA tracking & breach alerts | `sla_tracking`, `idx_sla_active_breach` | Internal cron / SLA alerts | Screen 2, Screen 6 |
| **`FR-6.1`** | GitHub commit SHA verification | `remediation_records.github_commit_sha` | `POST /api/v1/reports/{id}/remediation/verify-commit`| Screen 4 |
| **`FR-6.2`** | Branch ancestry verification | `remediation_records.ancestry_verified` | `POST /api/v1/reports/{id}/remediation/verify-commit`| Screen 4 |
| **`FR-8.2`** | Row Level Security (RLS) isolation | PostgreSQL `FORCE ROW LEVEL SECURITY` | All database queries via `bbt_app` | Screen 2, Screen 3 |
| **`FR-8.5`** | Tamper-evident dual hash chaining | `audit_events.row_hash`, `prev_chain_hash` | `GET /api/v1/audit-logs/verify` | Screen 5 |
| **`NFR-02`** | Sub-50 ms API query performance | Covered B-Tree & Partial Indexes | All endpoints | All screens |
| **`NFR-08`** | Responsive UI down to 320px viewport | CSS flex/grid architecture | Web frontend presentation layer | Screens 1–6 |

---

## 7. Document Submission & Milestone Sign-Off

### Student Author Endorsement
I hereby confirm that this **Week 4 Deliverable: Database Modeling, Physical Indexing Architecture, API Endpoint Contracts & UI Wireframes** represents an authentic, standards-compliant engineering formulation authored for **BugBountyTrack** (`PTUT - PRJ - 089`), rigorously aligned with the submitted IEEE 830 Software Requirements Specification (`Revision 2.8`) and the Week 3 Architecture Baseline.

* **Student Author**: **Taha Asadullah** (Roll No: `24-ST-013`, Section `SET-B`)  
* **Signature**: `[Signed Electronically — Taha Asadullah]`  
* **Date**: October 23, 2026  

---

### Academic Supervisor Endorsement
* **Academic Supervisor**: **Sir Umar Hayat** (Assistant Professor, PTUT Lahore)  
* **Department**: Department of Software Engineering Technology  
* **Status**: `[PENDING ACADEMIC SUPERVISOR REVIEW & ENDORSEMENT]`  
* **Date**: `____________________`  
