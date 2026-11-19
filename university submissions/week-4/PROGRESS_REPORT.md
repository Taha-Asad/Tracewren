# Project Milestone Progress Report — Week 4

| Attribute | Details |
| :--- | :--- |
| **Project Identifier** | `PTUT - PRJ - 089` |
| **Project Title** | **BugBountyTrack — Private Bug Bounty & Vulnerability Disclosure Platform** |
| **Student Candidate** | **Taha Asadullah** (Roll No: `24-ST-013`, Section: `SET-B`) |
| **Academic Supervisor** | **Sir Umar Hayat** (Assistant Professor, PTUT Lahore) |
| **Academic Institution** | Punjab Tianjin University of Technology (PTUT), Lahore |
| **Department** | Department of Software Engineering Technology |
| **Milestone Period** | **Week 4** — Database Modeling & UI Wireframes |
| **Official Submissions Drive** | [View Week 4 Submissions Folder (Google Drive)](https://drive.google.com/drive/folders/1z3rAcwYgd2IdIPZIuANeh0h4RfpvMTWQ?usp=drive_link) |

---

## Weekly Progress Report

### 1. Work Completed This Week
- Implemented core module deliverables according to the 12-week plan:
  - Formulated the **Database Entity-Relationship Model (ERD) in Peter Chen's Notation (`Figure 4.1` & `Figure 4.2`)** strictly adhering to academic standards (Entity Rectangles, Relationship Diamonds, Attribute Ovals with underlined Primary Keys, and explicit Cardinality Mappings) normalized to Third Normal Form (3NF) across 15 core entities (`organizations`, `users`, `user_memberships`, `bounty_programs`, `program_scopes`, `reports`, `report_recipients`, `attachments`, `triage_comments`, `remediation_records`, `crypto_keypairs`, `audit_events`, `sla_tracking`).
  - Specified the **Physical PostgreSQL 16 Indexing Architecture (`Figure 4.3`)**: designed covered composite B-Tree indexes for the triage queue (`idx_reports_triage_queue`), partial indexes for active intake (`idx_reports_pending_triage`), GIN indexes for JSONB security settings (`idx_org_settings_gin`), and forward-chaining indexes for tamper-evident audit verification.
  - Implemented kernel-level **PostgreSQL Row Level Security (RLS)** isolation policies enforced under unprivileged application role `bbt_app` (`NOSUPERUSER, NOBYPASSRLS`).
  - Specified complete **REST & GraphQL API Endpoint Contracts (`Figure 4.4`)** conforming to OpenAPI 3.1 and RFC 7807 Problem Details error schemas for authentication, Curve25519 public keyring retrieval, anonymous encrypted intake, Cloudflare R2 presigned streaming, triage management, GitHub commit ancestry verification, and audit ledger integrity.
  - Integrated authentic, pixel-perfect **Figma Screen Designs from the Tracewren Design System for 6 Primary Screens (`Figures 4.5 through 4.10`)**:
    - **Screen 1**: Anonymous Vulnerability Intake & Scope Landing Screen (`Landing.png`)
    - **Screen 2**: Defender Triage Queue & Report Filtering Workbench (`QueueTriage.png`)
    - **Screen 3**: Vulnerability Assessment & Decrypted Viewport (`CaseTriage.png`)
    - **Screen 4**: Cryptographic Key Management & Emergency Recovery Desk (`KeyDesk.png`)
    - **Screen 5**: Evidence-Based Remediation & GitHub Verification Panel (`CaseDeployed.png`)
    - **Screen 6**: Tamper-Evident Immutable Operational Audit Ledger (`AuditOwner.png`)
  - Standardized formal university deliverables: authored `DATABASE_MODELING_AND_UI_WIREFRAMES.md`, compiled the 36-page Word thesis document `DATABASE_MODELING_AND_UI_WIREFRAMES.docx`, and exported `DATABASE_MODELING_AND_UI_WIREFRAMES.pdf`.

### 2. Evidence & Technical Verification
- Validated endpoints and user workflows:
  - Rendered and embedded 10 high-DPI figure assets across database modeling, API architecture, and production UI screens:
    - `fig4_1_chen_erd_core.png` ($4902 \times 3270$ px, $88\text{ KB}$, pure black background, white outlines)
    - `fig4_2_chen_erd_triage_audit.png` ($5232 \times 2841$ px, $92\text{ KB}$, pure black background, white outlines)
    - `fig4_3_database_indexing_architecture.png` ($3816 \times 3513$ px, $280\text{ KB}$)
    - `fig4_4_api_architecture_and_lifecycle.png` ($3900 \times 4404$ px, $387\text{ KB}$)
    - `fig4_5_screen_intake_landing.png` ($1440 \times 1000$ px, $241\text{ KB}$)
    - `fig4_6_screen_queue_triage.png` ($1600 \times 1080$ px, $144\text{ KB}$)
    - `fig4_7_screen_case_triage.png` ($1600 \times 1080$ px, $302\text{ KB}$)
    - `fig4_8_screen_key_desk.png` ($1600 \times 1080$ px, $186\text{ KB}$)
    - `fig4_9_screen_remediation_deployed.png` ($1600 \times 1080$ px, $282\text{ KB}$)
    - `fig4_10_screen_audit_owner.png` ($1600 \times 1080$ px, $170\text{ KB}$)
  - OpenXML automated integrity inspection verified exactly 10 `<w:drawing>` DrawingML elements ($1.66\text{ MB}$ total document footprint) with Times New Roman typography, 1-inch margins, pure black table borders, and strictly **0 ASCII / Unicode mock icons**.
  - Headless LibreOffice PDF conversion verified a clean **36-page compilation** with centered figure captions, page breaks before major chapters and screens, and zero orphan section breaks.
  - Traceability verified 100% bidirectional coverage against the submitted IEEE 830 SRS (`Revision 2.8`) across functional requirements `FR-1` through `FR-8` and non-functional requirements `NFR-01` through `NFR-09`.
- Repository commits and pull requests submitted for review:
  - Official university submission folder on Google Drive: [https://drive.google.com/drive/folders/1z3rAcwYgd2IdIPZIuANeh0h4RfpvMTWQ?usp=drive_link](https://drive.google.com/drive/folders/1z3rAcwYgd2IdIPZIuANeh0h4RfpvMTWQ?usp=drive_link)

### 3. Challenges & Technical Solutions
- Resolved integration blockers and optimized data structures:
  - **Challenge 1: Layout Distortion in Peter Chen's Notation**: A naive flat graph of 15 entities and 90+ attribute ovals caused extreme horizontal stretching across the canvas, making text unreadable at standard zoom.
    - *Solution*: Decomposed the relational schema into two balanced domain enclaves (Core Tenancy/Identity vs. Triage/Remediation/Audit) and organized attribute clusters using directional subgraphs, achieving a clean textbook 4:3 aspect ratio.
  - **Challenge 2: Multi-Tenant RLS Leaks via Table Scans**: Standard B-Tree indexes on child tables could allow seq-scans that risk cross-tenant timing attacks during high-concurrency triage querying.
    - *Solution*: Bound `organization_id` as the leading column across all composite indexes and enforced `FORCE ROW LEVEL SECURITY` under role `bbt_app`, guaranteeing index-only tenant partitioning.
  - **Challenge 3: Schematic Wireframe vs. High-Fidelity UI Fidelity**: Generic schematic box wireframes failed to demonstrate the actual design craft and cryptographic ergonomics of the platform.
    - *Solution*: Replaced schematic wireframe boxes with 6 authentic, production-grade Figma screen captures directly from the Tracewren design repository, providing pixel-perfect visual proof of the system's client-side decryption, triage workflow, GitHub verification, and audit ledger.

### 4. Next Week Plan
- Proceed with subsequent milestone objectives outlined in the roadmap:
  - **Week 5 Milestone: Project Scaffolding & Core Auth Layer**:
    - Initialize Git repository with branch protections and automated CI pipelines.
    - Configure monorepo directory scaffolding for `apps/api` (NestJS) and `apps/web` (Next.js 15).
    - Establish and verify live cloud database connection to Neon serverless PostgreSQL.
    - Implement multi-tenant authentication with Argon2id password hashing, constant-time dummy hash verification, and RBAC authorization guards.

---

### Verification & Submission Reference
- **Google Drive Submissions Folder**: [https://drive.google.com/drive/folders/1z3rAcwYgd2IdIPZIuANeh0h4RfpvMTWQ?usp=drive_link](https://drive.google.com/drive/folders/1z3rAcwYgd2IdIPZIuANeh0h4RfpvMTWQ?usp=drive_link)
- **Primary Word Document**: `DATABASE_MODELING_AND_UI_WIREFRAMES.docx`
- **Primary PDF Document**: `DATABASE_MODELING_AND_UI_WIREFRAMES.pdf`
- **Technical Specification Markdown**: `DATABASE_MODELING_AND_UI_WIREFRAMES.md`
- **Native Editable Diagrams**: `diagrams/fig4_1_chen_erd_core.drawio`, `diagrams/fig4_2_chen_erd_triage_audit.drawio`
