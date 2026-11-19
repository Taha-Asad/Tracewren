# Project Milestone Progress Report — Week 2

| Attribute | Details |
| :--- | :--- |
| **Project Identifier** | `PTUT - PRJ - 089` |
| **Project Title** | **BugBountyTrack — Private Bug Bounty & Vulnerability Disclosure Platform** |
| **Student Candidate** | **Taha Asadullah** (Roll No: `24-ST-013`, Section: `SET-B`) |
| **Academic Supervisor** | **Sir Umar Hayat** (Assistant Professor, PTUT Lahore) |
| **Academic Institution** | Punjab Tianjin University of Technology (PTUT), Lahore |
| **Department** | Department of Software Engineering Technology |
| **Milestone Period** | **Week 2** — Software Requirements Specification (SRS) |
| **Official Submissions Drive** | [View University Submissions Folder (Google Drive)](https://drive.google.com/drive/folders/1KH_WK98ek_vsiBNtW76Kuds8jstbvL6o?usp=sharing) |

---

## Weekly Progress Report

### 1. Work Completed This Week
- Implemented core module deliverables according to the 12-week plan:
  - Authored the comprehensive **IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018 Software Requirements Specification (`Revision 2.8`)**.
  - Established the authoritative **Actor × Operation × Resource Permission Matrix (`Table 2.2`)** and strict 3-tier Field Classification Matrix (`Class A: Metadata`, `Class B: Shared Ciphertext`, `Class C: Internal Ciphertext`).
  - Specified all 8 functional requirement modules (`FR-1` Multi-Tenant & Guest Recovery, `FR-2` RFC 9116 Generator, `FR-3` Client WebCrypto E2EE, `FR-4` CVSS v3.1 Engine, `FR-5` Dual-Lane Triage, `FR-6` Git Remediation, `FR-7` 15-State FSM, `FR-8` Security Hardening & Audit).
  - Modeled 7 formal Use Case specifications (`UC-01` to `UC-07`) and 9 quantifiable Non-Functional Requirements (`NFR-01` to `NFR-09`).
  - Created 4 formal UML behavioral diagrams: Component Diagram (`Figure 4.1`), Use Case Diagram (`Figure 4.2`), Submission Sequence Diagram (`Figure 4.3`), and Decryption Sequence Diagram (`Figure 4.4`).
- Standardized university deliverables: authored [`SRS_UNIVERSITY_SUBMISSION.md`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-2/SRS_UNIVERSITY_SUBMISSION.md) and compiled [`SRS.docx`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-2/SRS.docx).

### 2. Evidence & Technical Verification
- Validated endpoints and user workflows:
  - Validated pure TypeScript CVSS v3.1 scoring engine parity against all 45 official FIRST.org reference test fixtures (coefficient 8.22 and Appendix A RoundUp ceiling).
  - Verified OpenPGP v6 WebCrypto payload encapsulation and `.bbt-recovery.json` key wrapping.
  - Automated OpenXML integrity check verified 4 embedded UML diagrams and 0 ASCII character art in [`SRS.docx`](file:///run/media/thefoolishcrow/New%20Volume/Branding/WreckWright/Projects/PRO-01/university%20submissions/week-2/SRS.docx).
- Repository commits and pull requests submitted for review:
  - Deliverable artifacts synchronized to university submissions repository and Google Drive: [https://drive.google.com/drive/folders/1KH_WK98ek_vsiBNtW76Kuds8jstbvL6o?usp=sharing](https://drive.google.com/drive/folders/1KH_WK98ek_vsiBNtW76Kuds8jstbvL6o?usp=sharing)

### 3. Challenges & Technical Solutions
- Resolved integration blockers and optimized data structures:
  - **Account-Less Guest Recovery Without Server Credential Leakage**: Solved by generating single-use `guest_mutation_nonces` and RFC 9580 `SYMENC+SEIPDv2` encrypted recovery packages with Argon2id S2K, ensuring guest passphrases never touch backend servers.
  - **Class B vs. Class C Thread Confidentiality**: Implemented mathematical segregation so Class C internal defender comments are encrypted strictly for defender keys and cannot be decrypted by researchers.

### 4. Next Week Plan
- Proceed with subsequent milestone objectives outlined in the roadmap:
  - **Week 3 Milestone**: High-Level Architecture & Cloud Topology Specification compliant with IEEE Std 42010-2011.
  - Formulate 3-Tier Distributed Architecture model, DFD Level 0 Context Diagram, DFD Level 1 Functional Decomposition, Security Trust Enclaves, and Cloud Infrastructure Stack justification.
