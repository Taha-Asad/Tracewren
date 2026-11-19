# Project Milestone Progress Report — Week 5

| Attribute | Details |
| :--- | :--- |
| **Project Identifier** | `PTUT - PRJ - 089` |
| **Project Title** | **BugBountyTrack — Private Bug Bounty & Vulnerability Disclosure Platform** |
| **Student Candidate** | **Taha Asadullah** (Roll No: `24-ST-013`, Section: `SET-B`) |
| **Academic Supervisor** | **Sir Umar Hayat** (Assistant Professor, PTUT Lahore) |
| **Academic Institution** | Punjab Tianjin University of Technology (PTUT), Lahore |
| **Department** | Department of Software Engineering Technology |
| **Milestone Period** | **Week 5** — Project Scaffolding & Core Auth Layer |
| **Official Submissions Drive** | [View Week 5 Submissions Folder (Google Drive)](https://drive.google.com/drive/folders/11Dt-qZ29yQ6CMlFvIOJrwUI7KLh2kFg6?usp=drive_link) |

---

## Weekly Progress Report

### 1. Work Completed This Week
- Implemented core engineering deliverables according to the 12-week academic plan:
  - Formulated and enforced the **Git Repository Governance & Branch Protection Architecture (`Figure 5.1`)**: structured the project under a trunk-based Git workflow with dual protected branches (`main` and `develop`), authored `.github/workflows/ci.yml` orchestrating 3 automated CI gates (code hygiene/linting, Vitest automated suites, and Prisma schema validation), configured `.github/pull_request_template.md` and `.github/BRANCH_PROTECTION.md`, and deployed client-side pre-push hook `.git/hooks/pre-push` preventing direct pushes to production branches.
  - Implemented the **Monorepo Directory Scaffolding (`Figure 5.2`)**: cleanly decoupled the NestJS enterprise backend (`apps/api`), the Next.js 15 client web portal (`apps/web`), and shared configuration packages (`packages/`) governed by npm workspaces and strict TypeScript project references.
  - Formulated and verified the **Database Connection Architecture (`Figure 5.3`)**: configured connection pooling for application runtime via Neon's PgBouncer pooler (`DATABASE_URL`, port 5432) alongside dedicated compute TCP sessions for Prisma schema migrations (`DIRECT_DATABASE_URL`), bound to schema `bbt_core` with TLS 1.3 transport encryption.
  - Implemented the **Multi-Tenant User Authentication Subsystem (`Figure 5.4`)**:
    - **Atomic Workspace Registration (`registerWorkspace`)**: multi-tenant transaction provisioning `User`, `Organization`, `UserMembership` with `ORG_OWNER` privileges, a default public `BountyProgram`, and initial session.
    - **Argon2id Password Hashing Engine**: cryptographic implementation configured to OWASP standards ($m=65536\text{ KiB}, t=3, p=4$).
    - **Constant-Time Timing Discrepancy Defense**: implemented pre-computed dummy hash verification (`DUMMY_ARGON2_HASH`) neutralizing user enumeration timing attacks against unallocated email addresses.
    - **Session Token Security**: generated cryptographically secure 256-bit random tokens (`crypto.randomBytes(32)`), stored only as SHA-256 hashes in the database with 30-day lifecycle, and dispatched via HTTP-only, Secure, SameSite=Lax cookies (`caulvyn_session`).
    - **Hierarchical RBAC Authorization Guards**: constructed `SessionAuthGuard` (session validation and tenant resolution), `RolesGuard` (`ORG_OWNER`, `ORG_ADMIN`, `ORG_DEFENDER`, `ORG_READONLY`), and `ProgramRolesGuard` (`LEAD_TRIAGER`, `TRIAGER`, `REVIEWER`, `REMEDIATOR`).
  - Standardized formal university deliverables: authored `PROJECT_SCAFFOLDING_AND_CORE_AUTH_LAYER.md` (and mirrored `week-05-project-scaffolding-and-core-auth-layer.md`), compiled the Word document `PROJECT_SCAFFOLDING_AND_CORE_AUTH_LAYER.docx`, and exported the 12-page PDF deliverable `PROJECT_SCAFFOLDING_AND_CORE_AUTH_LAYER.pdf`.

### 2. Evidence & Technical Verification
- Validated endpoints and empirical execution evidence:
  - **Live Database Connection Verification**: Verified active connectivity to cloud PostgreSQL instance on Neon via Prisma CLI execute command (`npx prisma db execute --schema=prisma/schema.prisma --stdin <<<'SELECT 1 as connected;'`), exiting cleanly with code `0`.
  - **Automated Unit & Integration Test Suite**: Invocated the Vitest testing runner across 9 test files, confirming **94 passed tests (100% success rate, 0 failures, 0 skipped)** in $1.71\text{ seconds}$:
    - `auth.service.spec.ts` (31 tests passed)
    - `roles.guard.spec.ts` (18 tests passed)
    - `auth.controller.spec.ts` (12 tests passed)
    - `session-auth.guard.spec.ts` (9 tests passed)
    - `decorators.spec.ts` (9 tests passed)
    - `register-workspace.dto.spec.ts` (8 tests passed)
    - `complete-onboarding.dto.spec.ts` (5 tests passed)
    - `app.controller.spec.ts` (1 test passed)
    - `auth.module.spec.ts` (1 test passed)
  - **Architectural Diagram Assets Rendered & Embedded**:
    - `fig5_1_git_branch_protection_workflow.png` ($1260 \times 4401$ px, $254\text{ KB}$, pure black background, white outlines)
    - `fig5_2_monorepo_directory_scaffolding.png` ($3564 \times 3225$ px, $200\text{ KB}$, pure black background, white outlines)
    - `fig5_3_database_connection_and_pooling.png` ($3591 \times 3021$ px, $241\text{ KB}$, pure black background, white outlines)
    - `fig5_4_multitenant_auth_and_session_lifecycle.png` ($4992 \times 3369$ px, $856\text{ KB}$, pure black background, white outlines)
  - OpenXML automated integrity inspection verified all 4 DrawingML elements ($1.38\text{ MB}$ total document footprint) with Times New Roman typography, 1-inch margins, pure black table borders, and strictly **0 ASCII / Unicode mock icons**.
  - Headless LibreOffice PDF conversion verified a clean **12-page compilation** with centered figure captions, page breaks before major chapters, running academic headers, and dynamic page numbering.
- Repository commits and pull requests submitted for review:
  - Official university submission folder on Google Drive: [https://drive.google.com/drive/folders/11Dt-qZ29yQ6CMlFvIOJrwUI7KLh2kFg6?usp=drive_link](https://drive.google.com/drive/folders/11Dt-qZ29yQ6CMlFvIOJrwUI7KLh2kFg6?usp=drive_link)

### 3. Challenges & Technical Solutions
- Resolved integration blockers and optimized security posture:
  - **Challenge 1: User Enumeration via Password Hash Timing Discrepancies**: If a user does not exist in the database, returning a 401 response immediately takes $\approx 5\text{ ms}$, whereas evaluating a genuine Argon2id hash takes $\approx 120\text{ ms}$. Attackers can exploit this delta to enumerate registered enterprise emails.
    - *Solution*: Integrated a constant-time dummy hash verification pathway (`DUMMY_ARGON2_HASH`) in `AuthService.login()`. When a user query returns null, the service executes a genuine Argon2id verification against the pre-computed hash, normalizing execution duration to $\approx 120\text{ ms}$ regardless of email existence.
  - **Challenge 2: Connection Pool Exhaustion During Serverless Migrations**: PgBouncer transaction-mode connection poolers reject DDL schema migration queries that alter table state or lock namespaces.
    - *Solution*: Configured dual connection strings in Prisma: `DATABASE_URL` routed through PgBouncer for high-concurrency runtime queries, and `DIRECT_DATABASE_URL` opening dedicated TCP compute sessions for administrative DDL migrations.
  - **Challenge 3: Multi-Tenant Boundary Leakage During Workspace Provisioning**: Partial database failures during signup could leave orphan user records without an assigned organization, corrupting tenancy isolation.
    - *Solution*: Wrapped workspace registration, owner user creation, membership assignment, default program provisioning, and initial session generation within a single atomic Prisma transaction (`prisma.$transaction`).

### 4. Next Week Plan
- Proceed with subsequent milestone objectives outlined in the roadmap:
  - **Week 6 Milestone: Cryptographic Intake Pipeline & WebCrypto Implementation**:
    - Implement client-side Curve25519 WebCrypto keypair generation and passphrase wrapping.
    - Construct the dual-recipient OpenPGP.js encryption pipeline for anonymous bug report submission.
    - Build Cloudflare R2 presigned streaming endpoints for client-side encrypted attachments.

---

### Verification & Submission Reference
- **Google Drive Submissions Folder**: [https://drive.google.com/drive/folders/11Dt-qZ29yQ6CMlFvIOJrwUI7KLh2kFg6?usp=drive_link](https://drive.google.com/drive/folders/11Dt-qZ29yQ6CMlFvIOJrwUI7KLh2kFg6?usp=drive_link)
- **Primary Word Document**: `PROJECT_SCAFFOLDING_AND_CORE_AUTH_LAYER.docx`
- **Primary PDF Document**: `PROJECT_SCAFFOLDING_AND_CORE_AUTH_LAYER.pdf`
- **Technical Specification Markdown**: `PROJECT_SCAFFOLDING_AND_CORE_AUTH_LAYER.md`
- **Native Editable Diagrams**: `diagrams/fig5_1_git_branch_protection_workflow.drawio`, `diagrams/fig5_2_monorepo_directory_scaffolding.drawio`, `diagrams/fig5_3_database_connection_and_pooling.drawio`, `diagrams/fig5_4_multitenant_auth_and_session_lifecycle.drawio`
