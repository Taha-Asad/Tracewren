# Project Milestone Progress Report — Week 3

| Attribute | Details |
| :--- | :--- |
| **Project Identifier** | `PTUT - PRJ - 089` |
| **Project Title** | **BugBountyTrack — Private Bug Bounty & Vulnerability Disclosure Platform** |
| **Student Candidate** | **Taha Asadullah** (Roll No: `24-ST-013`, Section: `SET-B`) |
| **Academic Supervisor** | **Sir Umar Hayat** (Assistant Professor, PTUT Lahore) |
| **Academic Institution** | Punjab Tianjin University of Technology (PTUT), Lahore |
| **Department** | Department of Software Engineering Technology |
| **Milestone Period** | **Week 3** — High-Level Architecture & Cloud Topology |
| **Official Submissions Drive** | [View University Submissions Folder (Google Drive)](https://drive.google.com/drive/folders/1KH_WK98ek_vsiBNtW76Kuds8jstbvL6o?usp=sharing) |

---

## Weekly Progress Report

### 1. Work Completed This Week
- **3-Tier Zero-Plaintext Distributed Architecture (`Figure 3.1`)**: Formulated and specified the 3-Tier Distributed Architecture model separating Client Presentation & WebCrypto Boundary (Tier 1), Serverless Presentation & Gateway / API Server Tier (Tier 2), and Relational Database & Cloud Storage Persistence (Tier 3), strictly enforcing zero-plaintext server visibility.
- **Data Flow Architecture (`DFD Level 0 & Level 1`)**:
  - Constructed the **DFD Level 0 System Context Diagram (`Figure 3.2`)**, mapping the central process (`0.0`) against 2 primary human external entities (Researcher `E1`, Defender `E2`) and 4 supporting cloud services (GitHub `E3`, Resend `E4`, Cloudflare R2 `E5`, GitHub Actions `E6`).
  - Constructed the **DFD Level 1 Functional Decomposition Diagram (`Figure 3.3`)**, modularizing the 7 core sub-processes (`1.0`–`7.0`) and 7 data stores (`D1`–`D7`) into a cohesive 4-stage pipeline (Governance $\rightarrow$ Intake $\rightarrow$ Triage $\rightarrow$ Audit) with clean non-crossing data flows.
- **Defensible System Boundaries & Trust Domain Isolation (`Figure 3.4`)**: Defined 4 non-overlapping security trust enclaves (Browser Client Cryptographic Perimeter, Serverless API Blind Routing Perimeter, Neon PostgreSQL Multi-Tenant RLS Vault, and Cloudflare R2 Object Storage Perimeter) along with a comprehensive STRIDE threat mitigation matrix.
- **Production Cloud Infrastructure Stack & Feasibility Justification (`Figure 3.5`)**: Mapped the end-to-end cloud infrastructure topology (Cloudflare Edge Anycast DNS/WAF/Turnstile $\rightarrow$ Vercel Serverless Fleet on Node.js 22 LTS $\rightarrow$ Neon Serverless PostgreSQL 16 via PgBouncer $\rightarrow$ Cloudflare R2). Formulated an engineering cost model establishing **$0.00/month** academic demonstration feasibility and **~$61.00/month** commercial multi-tenant operational baseline.
- **Standardized Deliverable Documentation**: Authored the full 340-line formal technical specification [`HIGH_LEVEL_ARCHITECTURE.md`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/HIGH_LEVEL_ARCHITECTURE.md) and compiled [`HIGH_LEVEL_ARCHITECTURE.docx`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/HIGH_LEVEL_ARCHITECTURE.docx).

### 2. Evidence & Technical Verification
- **High-DPI 24-Bit RGB Architectural Visual Assets**: Rendered all 5 architectural diagrams at $3\times$ resolution using `@mermaid-js/mermaid-cli` with Chromium Puppeteer and modern typography:
  - [`fig3_1_3tier_architecture.png`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/diagrams/fig3_1_3tier_architecture.png) ($3966 \times 3174$ px, $724.7\text{ KB}$)
  - [`fig3_2_dfd_level_0.png`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/diagrams/fig3_2_dfd_level_0.png) ($3828 \times 1554$ px, $462.1\text{ KB}$)
  - [`fig3_3_dfd_level_1.png`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/diagrams/fig3_3_dfd_level_1.png) ($3813 \times 7209$ px, $1.17\text{ MB}$)
  - [`fig3_4_security_trust_boundaries.png`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/diagrams/fig3_4_security_trust_boundaries.png) ($5424 \times 2811$ px, $836.4\text{ KB}$)
  - [`fig3_5_cloud_topology.png`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/diagrams/fig3_5_cloud_topology.png) ($6000 \times 4533$ px, $766.5\text{ KB}$)
- **Automated OpenXML Integrity Inspection**: Executed automated XML validation scripts verifying that [`HIGH_LEVEL_ARCHITECTURE.docx`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/HIGH_LEVEL_ARCHITECTURE.docx) embeds exactly 5 `<w:drawing>` DrawingML image elements ($3.96\text{ MB}$ total image payload) and contains strictly **0 ASCII / character-based diagram lines**.
- **Page Layout & Headless PDF Rendering Audit**: Converted the Word document to PDF using headless LibreOffice and visually inspected all 26 pages, confirming zero orphan headings, zero empty white page voids, and centered bold captions (`Figure 3.X: ...`) underneath every figure.
- **Traceability Verification**: Confirmed 100% bidirectional coverage against the submitted IEEE 830 SRS (`Revision 2.8`) requirements (`FR-1` through `FR-8` and `NFR-01` through `NFR-09`).

### 3. Challenges & Technical Solutions
- **Challenge 1: Monospace Code Block Fallthrough**: Fenced code blocks in markdown previously emitted character art (`+---+`, `|`) as monospace body paragraphs in Word.
  - *Solution*: Replaced all ASCII blocks with formal Mermaid (`.mmd`) specifications and updated the OpenXML compiler to embed only rendered raster PNG and vector SVG assets.
- **Challenge 2: Oversized Image Dimensions Triggering Blank Page Gaps**: Diagrams previously scaled to an 8-inch height ceiling (`max_cy = 7,500,000` EMUs), causing Word to force premature page breaks that left 5–7 inches of empty white voids on preceding pages.
  - *Solution*: Calibrated inline diagram height to $\approx 3.98\text{ inches}$ ($3,650,000\text{ EMUs}$) and added automatic page breaks before major chapters (`## 2`, `## 3`, `## 4`, `## 5`, `## 6`) and before Section `3.2`, ensuring every section starts cleanly at the top of a page without empty voids.
- **Challenge 3: Complex DFD Level 1 Visual Spaghetti**: An initial attempt to link 6 external entities, 7 processes, and 7 data stores simultaneously produced an unreadable 30-line tangled mesh.
  - *Solution*: Decomposed the DFD Level 1 into 4 discrete, self-contained functional modules (Governance, Intake, Triage, and Remediation/Audit) with localized data stores, transforming the mesh into a clean linear pipeline.

### 4. Next Week Plan
- **Week 4 Milestone: Detailed Database Design & Relational Schema Modeling**:
  - Model complete PostgreSQL 16 relational schema normalized to Third Normal Form (3NF) across all 15 core entities (`organizations`, `users`, `user_memberships`, `reports`, `report_recipients`, `triage_comments`, `remediation_records`, `attachments`, `audit_events`, `cluster_storage_state`, etc.).
  - Implement and test declarative PostgreSQL `FORCE ROW LEVEL SECURITY` policies under unprivileged role `bbt_app` (`NOSUPERUSER NOBYPASSRLS`).
  - Draft initial idempotent SQL migration scripts (`001_initial_schema.sql`) and complete Data Dictionary specifications.

---

### Verification & Submission Reference
- **Google Drive Submissions Folder**: [https://drive.google.com/drive/folders/1KH_WK98ek_vsiBNtW76Kuds8jstbvL6o?usp=sharing](https://drive.google.com/drive/folders/1KH_WK98ek_vsiBNtW76Kuds8jstbvL6o?usp=sharing)
- **Primary Word Document**: [`university submissions/week-3/HIGH_LEVEL_ARCHITECTURE.docx`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/HIGH_LEVEL_ARCHITECTURE.docx)
- **Synchronized Copy**: [`university submissions/Resources/HIGH_LEVEL_ARCHITECTURE.docx`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/Resources/HIGH_LEVEL_ARCHITECTURE.docx)
- **High-Resolution Diagram Assets**: [`university submissions/week-3/diagrams/`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-3/diagrams)
