# Project Milestone Progress Report — Week 6

| Attribute | Details |
| :--- | :--- |
| **Project Identifier** | `PTUT - PRJ - 089` |
| **Project Title** | **BugBountyTrack — Private Bug Bounty & Vulnerability Disclosure Platform** |
| **Student Candidate** | **Taha Asadullah** (Roll No: `24-ST-013`, Section: `SET-B`) |
| **Academic Supervisor** | **Sir Umar Hayat** (Assistant Professor, PTUT Lahore) |
| **Academic Institution** | Punjab Tianjin University of Technology (PTUT), Lahore |
| **Department** | Department of Software Engineering Technology |
| **Milestone Period** | **Week 6** — Core Business Logic & Vertical Slice |
| **Official Submissions Drive** | [View Week 6 Submissions Folder (Google Drive)](https://drive.google.com/drive/folders/1WrnxbEQmUIxHfszNN43jWl0VSWsbWQus?usp=drive_link) |

---

## Weekly Progress Report

### 1. Work Completed This Week
- Implemented core engineering deliverables according to the 12-week academic plan:
  - Formulated and codified the **FIRST.org CVSS 3.1 Domain Calculation Engine (`Figure 6.1`)**: constructed a pure TypeScript, zero-dependency engine (`apps/api/src/cvss/cvss.engine.ts`) strictly executing the FIRST.org Common Vulnerability Scoring System (CVSS) version 3.1 specification. Implemented vector parsing and tokenizer, mathematical calculation of the Impact Sub-Score (ISS), scope-dependent branches (unchanged vs. changed scope), Exploitability sub-scores (8.22 coefficient), the official Appendix A floating-point roundup algorithm (`roundup(v)`), and qualitative severity ratings.
  - Implemented the **Dynamic Bounty Estimation & SLA Policy Engine**: mapped calculated CVSS base scores directly to organization-defined bounty reward brackets (minimum, median, and maximum disbursements) and severity-driven Service Level Agreements (SLAs: Critical 24h, High 72h, Medium 14d, Low 30d).
  - Engineered the **Server-Side Input Validation & Exception Handling Pipeline (`Figure 6.3`)**:
    - Codified `SubmitReportDto` and `CalculateCvssDto` with strict `class-validator` rules enforcing RFC 4122 UUIDv4 identifiers, regular expression vector grammar validation, 64-character lowercase hexadecimal SHA-256 proof hashes, and operational label enumerations.
    - Configured NestJS global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true` ensuring rejection of malformed or extraneous payload fields.
    - Implemented `PrismaExceptionFilter` mapping relational database exceptions (P2002 Unique Violation to 409 Conflict, P2025 Record Not Found to 404 Not Found, P2003 Foreign Key Violation to 422 Unprocessable) into RFC 7807 compliant problem details while strictly masking database credentials and column structures from client responses.
  - Constructed the **End-to-End Vertical Slice (`Figure 6.2`)**:
    - **Client Presentation Tier (`apps/web`)**: Implemented `CvssCalculatorWidget.tsx`, an interactive React 19 component providing real-time metric selection, live score preview, formula breakdown, SLA countdown indicators, and bounty tier callouts.
    - **Transport & Controller Layer (`apps/api`)**: Built `/reports/submit`, `/cvss/calculate`, and `/cvss/bounty-estimate` endpoints protected by session authorization and tenant-scoping guards.
    - **Data Persistence Layer (`prisma`)**: Verified multi-tenant integrity in `ReportsService`, executing atomic report record insertion into the Neon Serverless PostgreSQL database with relational bindings to `programs` and `tenants`.
  - Formulated the **Bounty Evaluation & SLA Lifecycle State Machine (`Figure 6.4`)**: defined lifecycle states (`SUBMITTED`, `TRIAGED`, `IN_REMEDIATION`, `VALIDATING`, `RESOLVED`, `BOUNTY_DISBURSED`) and rejection flows (`DUPLICATE`, `OUT_OF_SCOPE`, `INFORMATIVE`) with automated SLA countdown breach escalation.
  - Standardized formal university deliverables: authored `CORE_BUSINESS_LOGIC_AND_VERTICAL_SLICE.md` (and mirrored `week-06-core-business-logic-and-vertical-slice.md`), compiled the Word document `CORE_BUSINESS_LOGIC_AND_VERTICAL_SLICE.docx`, and exported the PDF deliverable `CORE_BUSINESS_LOGIC_AND_VERTICAL_SLICE.pdf`.

### 2. Evidence & Technical Verification
- Validated endpoints and empirical execution evidence:
  - **Comprehensive Automated Test Execution**: Executed the Vitest testing runner across 11 test suites, confirming **117 passed tests (100% success rate, 0 failures, 0 skipped)** in $1.76\text{ seconds}$:
    - `cvss.engine.spec.ts` (19 tests passed)
    - `reports.service.spec.ts` (4 tests passed)
    - `auth.service.spec.ts` (31 tests passed)
    - `roles.guard.spec.ts` (18 tests passed)
    - `auth.controller.spec.ts` (12 tests passed)
    - `session-auth.guard.spec.ts` (9 tests passed)
    - `decorators.spec.ts` (9 tests passed)
    - `register-workspace.dto.spec.ts` (8 tests passed)
    - `complete-onboarding.dto.spec.ts` (5 tests passed)
    - `app.controller.spec.ts` (1 test passed)
    - `auth.module.spec.ts` (1 test passed)
  - **NIST NVD Benchmark Verification**:
    - CVE-2021-44228 (Log4Shell): `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H` $\rightarrow$ Score: **10.0 (Critical)**
    - CVE-2019-11510 (Pulse Secure): `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` $\rightarrow$ Score: **9.8 (Critical)**
    - CVE-2021-41773 (Apache HTTP Server): `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N` $\rightarrow$ Score: **7.5 (High)**
    - CVE-2022-22965 (Spring4Shell): `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:H/I:H/A:H` $\rightarrow$ Score: **9.0 (Critical)**
    - CVE-2021-3156 (Sudo Baron Samedit): `CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H` $\rightarrow$ Score: **7.8 (High)**
  - **Compile-Time Static Type Verification**:
    - Backend: `npm run build` in `apps/api` compiled cleanly with exit code `0`.
    - Frontend: `npx tsc --noEmit` in `apps/web` compiled cleanly with exit code `0`.
  - **Architectural Diagram Assets Rendered & Embedded**:
    - `fig6_1_cvss_calculation_engine_pipeline.png` ($4008 \times 2451$ px, $552\text{ KB}$, pure black background, white outlines)
    - `fig6_2_end_to_end_vertical_slice_architecture.png` ($3282 \times 3225$ px, $562\text{ KB}$, pure black background, white outlines)
    - `fig6_3_server_side_validation_and_error_flow.png` ($3282 \times 3774$ px, $692\text{ KB}$, pure black background, white outlines)
    - `fig6_4_bounty_sla_state_machine.png` ($2628 \times 3315$ px, $276\text{ KB}$, pure black background, white outlines)
  - Native editable diagram files created: `.drawio` format generated for all 4 figures adhering strictly to the minimalist monochrome standard.
  - Word and PDF verification: `CORE_BUSINESS_LOGIC_AND_VERTICAL_SLICE.docx` ($1.84\text{ MB}$) compiled with Times New Roman typography, 1-inch margins, centered captions, and strictly **0 ASCII / Unicode mock icons**, converted cleanly into `CORE_BUSINESS_LOGIC_AND_VERTICAL_SLICE.pdf`.

### 3. Challenges & Technical Solutions
- Resolved integration blockers and optimized business logic accuracy:
  - **Challenge 1: Floating-Point Rounding Divergence in CVSS 3.1 Appendix A**: Standard JavaScript floating-point arithmetic (`Math.ceil(val * 10) / 10`) produces rounding anomalies (e.g. $4.000000000000001$ rounding up to $4.1$).
    - *Solution*: Implemented the official FIRST.org Appendix A algorithm using scaled integer modulo logic (`Math.round(val * 100000) % 10000 === 0 ? intVal / 100000 : (Math.floor(intVal / 10000) + 1) / 10`). Validated against all NIST edge cases to achieve 100% mathematical parity.
  - **Challenge 2: Cross-Tenant Program Spoofing in Report Submission**: An authenticated attacker in Organization A could submit a vulnerability referencing a Program ID belonging to Organization B, leaking report submissions across multi-tenant boundaries.
    - *Solution*: Codified a mandatory tenant-ownership guard inside `ReportsService.submitReport()` that verifies the targeted program's `organizationId` matches the authenticated tenant context before proceeding with report creation, throwing an unauthorized domain exception on mismatch.
  - **Challenge 3: Database Column Leakage on Validation & Persistence Failures**: Raw database exceptions exposed internal table structures, foreign key constraints, and column names to clients.
    - *Solution*: Implemented `PrismaExceptionFilter` to intercept database error codes (P2002, P2025, P2003) and normalize them into RFC 7807 Problem Details responses with user-safe descriptions, sanitizing internal database error strings.

### 4. Next Week Plan
- Proceed with official university milestone objectives for Week 7:
  - **Week 7: Live Working Prototype Milestone Gate**:
    - **End-to-End Functional Smoke Testing**: Execute comprehensive smoke test demonstrating the complete functional user journey across the live working prototype (workspace onboarding, multi-tenant authentication, interactive CVSS 3.1 calculation, report submission, and database persistence).
    - **Mid-Term Progress Report & Slide Deck Compilation**: Author and compile the formal academic Mid-Term Progress Report and Presentation Slide Deck covering Weeks 1–7 engineering achievements, architectural topology, and empirical verification metrics.
    - **Faculty Supervisor Evaluation Preparation**: Finalize live demonstration environment and rehearsal protocols for formal evaluation by faculty supervisor (Sir Umar Hayat).

---

### Verification & Submission Reference
- **Google Drive Submissions Folder**: [https://drive.google.com/drive/folders/1WrnxbEQmUIxHfszNN43jWl0VSWsbWQus?usp=drive_link](https://drive.google.com/drive/folders/1WrnxbEQmUIxHfszNN43jWl0VSWsbWQus?usp=drive_link)
- **Primary Word Document**: `CORE_BUSINESS_LOGIC_AND_VERTICAL_SLICE.docx`
- **Primary PDF Document**: `CORE_BUSINESS_LOGIC_AND_VERTICAL_SLICE.pdf`
- **Technical Specification Markdown**: `CORE_BUSINESS_LOGIC_AND_VERTICAL_SLICE.md`
- **Native Editable Diagrams**: `diagrams/fig6_1_cvss_calculation_engine_pipeline.drawio`, `diagrams/fig6_2_end_to_end_vertical_slice_architecture.drawio`, `diagrams/fig6_3_server_side_validation_and_error_flow.drawio`, `diagrams/fig6_4_bounty_sla_state_machine.drawio`
