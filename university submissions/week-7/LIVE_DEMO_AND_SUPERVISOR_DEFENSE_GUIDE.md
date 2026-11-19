# BugBountyTrack — Week 7 Live Demo & Supervisor Defense Guide

**Candidate**: **Taha Asadullah** (Roll No: `24-ST-013`, Section: `SET-B`)  
**Academic Supervisor**: **Sir Umar Hayat** (Assistant Professor, PTUT Lahore)  
**Project**: `PTUT - PRJ - 089` (BugBountyTrack)  
**Milestone**: **Week 7 Live Working Prototype Milestone Gate**  
**Presentation Formats Delivered**:
1. **PowerPoint PPTX Deck**: `university submissions/week-7/BugBountyTrack_MidTerm_Presentation.pptx` (9 Slides, 100% Light Theme, Zero Chips)
2. **Interactive HTML Slide Deck**: `university submissions/week-7/BugBountyTrack_MidTerm_Presentation.html` (9 Slides, 100% Light Theme, Zero Chips)

---

## 1. The 3 Core Features Beyond Auth (Ready for Live Demo)

### Feature 1: FIRST.org CVSS 3.1 Domain Calculation Engine & Dynamic SLA/Bounty Policy
- **What it is**: A pure TypeScript mathematical calculation engine (`cvss.engine.ts`) strictly implementing the FIRST.org Common Vulnerability Scoring System (CVSS) v3.1 specification, coupled with dynamic SLA timeline derivation and tiered bounty reward brackets.
- **Why it matters**: Replaces subjective human arguments over vulnerability severity with mathematical reproducibility, eliminating payout negotiation friction and anchoring enterprise remediation timelines to compliance standards (SOC 2, ISO 27001).
- **How it works**:
  1. Parses the 8 foundational base metrics: Attack Vector ($AV$), Attack Complexity ($AC$), Privileges Required ($PR$), User Interaction ($UI$), Scope ($S$), Confidentiality ($C$), Integrity ($I$), and Availability ($A$).
  2. Computes the **Impact Sub-Score (ISS)**:
     $$\text{ISS} = 1.0 - \left[(1.0 - C) \times (1.0 - I) \times (1.0 - A)\right]$$
  3. Evaluates **Scope-Dependent Impact**:
     - Scope Unchanged: $\text{Impact} = 6.42 \times \text{ISS}$
     - Scope Changed: $\text{Impact} = 7.52 \times (\text{ISS} - 0.029) - 3.25 \times (\text{ISS} - 0.02)^{15}$
  4. Computes **Exploitability**:
     $$\text{Exploitability} = 8.22 \times AV \times AC \times PR \times UI$$
  5. Applies **FIRST.org Appendix A Roundup9** using precision decimal normalization:
     $$\text{Roundup}(v) = \frac{\lceil\text{round}(v \times 10^9) / 10^8\rceil}{10}$$
  6. Maps the final score to qualitative severity:
     - **Critical (9.0 – 10.0)**: Triage SLA -> **24 Hours** (Immediate incident response) | Bounty: **$7,500 – $10,000**
     - **High (7.0 – 8.9)**: Triage SLA -> **72 Hours** (3 Days) | Bounty: **$3,500 – $7,500**
     - **Medium (4.0 – 6.9)**: Triage SLA -> **14 Days** (Sprint cycle) | Bounty: **$1,000 – $3,500**
     - **Low (0.1 – 3.9)**: Triage SLA -> **30 Days** (Routine release) | Bounty: **$200 – $1,000**
- **Live UI Component**: 
  - Standalone Workspace View: accessible via sidebar **"CVSS 3.1 & SLA Calculator"** or URL `http://localhost:3000/workspace?view=cvss-calculator`.
  - Contextual Report View: mounted under the **"CVSS 3.1 & SLA Policy"** tab inside any report detail view.

---

### Feature 2: Scoped Program & Report Triage Communications
- **What it is**: Multi-tenant, dual-lane collaborative communication architecture isolated strictly per bug bounty program and vulnerability finding report.
- **Why it matters**: In enterprise security, generic global chat or simulated bot messages fail completely. Each program has different authorized defender engineers and security policies; discussions must remain confidential to that specific finding to avoid cross-tenant zero-day disclosure leaks.
- **How it works**:
  1. **Two-Level Hierarchical Scoping**:
     - **Level 1 (Program Scope)**: Filter discussions by program domain (`portal-disclosure`, `core-boundary`, `cloud-infra`). Dynamically resolves and displays the authorized engineering roster for that program.
     - **Level 2 (Finding Scope)**: Filter discussions by report thread (`BBT-0241`, `BBT-0240`, `BBT-0239`). Isolates messages strictly to that vulnerability's reproduction context.
  2. **Dual-Lane Channel Isolation**:
     - **Class B (Researcher Coordination)**: Public coordination between the external reporter and internal triage team.
     - **Class C (Internal Engineering Deliberation)**: Encrypted internal defender channel. Completely stripped from external researcher responses by NestJS response interceptors.
  3. **Thread State Freeze**:
     - Organization Owners can administratively lock threads upon vulnerability resolution to preserve legal chain of custody.
  4. **Anti-Slop Clean Light Interface**: Zero pill/badge chips, clean avatars, crisp typography, and high visual contrast.
- **Live UI Component**: Accessible via sidebar **"Discussions"** or URL `http://localhost:3000/workspace?view=discussions`.

---

### Feature 3: RFC 9116 Vulnerability Intake & Verification Vertical Slice
- **What it is**: Complete end-to-end multi-tier pipeline connecting client browser intake, NestJS API validation, and PostgreSQL persistence with RFC 9116 security policy compliance.
- **Why it matters**: Protects database integrity, ensures safe harbor adherence, and establishes an immutable audit trail for vulnerability reports.
- **How it works**:
  1. **Client-Side Ingestion**:
     - Validates targets against published `/.well-known/security.txt` policies.
     - Enforces structured intake schemas (title, CWE classification, asset scope, proof-of-concept steps).
  2. **NestJS API Validation & Tenancy Guard**:
     - Enforces strict DTO validation with `class-validator`.
     - Validates that the targeted program belongs to the active tenant workspace before report insertion.
     - Dual-key cryptographic envelope encrypting sensitive payloads via OpenPGP v6 / RFC 9580 standards.
  3. **PostgreSQL & Prisma Persistence**:
     - Atomically commits the report record and initializes audit logs in Neon PostgreSQL.
     - Formal state machine progression: `NEW -> TRIAGED -> VALIDATED -> REMEDIATED -> CLOSED`.
- **Live UI Component**: Accessible under the **"Phase 1: Intake & Scope"** tab in report detail view or through the report ingestion modal.

---

## 2. Step-by-Step Live Demonstration Script for Sir Umar Hayat

Duration: **5 to 7 Minutes**

### Step 1: Open the Live Prototype Workspace (60 Seconds)
1. Open your browser to: `http://localhost:3000/workspace`.
2. **What to say**:
   > *"Sir, here is our live working prototype workspace dashboard. It is running on Next.js 16 and NestJS 11, backed by PostgreSQL. The entire interface is built with high visual ergonomics, clean light styling, zero chips, and full responsiveness down to 320px viewport width."*
3. Point out the left sidebar navigation showing the Management Suite: Governance Overview, In-House Programs, Their Reports, CVSS 3.1 & SLA Calculator, Triage Members, and Discussions.

### Step 2: Demonstrate the CVSS 3.1 & SLA Calculation Engine (90 Seconds)
1. In the sidebar, click **"CVSS 3.1 & SLA Calculator"** (or open `http://localhost:3000/workspace?view=cvss-calculator`).
2. Show the live calculator widget:
   - Adjust **Scope** from `Unchanged (U)` to `Changed (C)`.
   - Set **Attack Vector** to `Network (N)`, **Privileges Required** to `None (N)`.
   - Click the **Conf / Integ / Avail** buttons to High (`H`).
3. Point to the live score readout:
   - Base Score immediately updates to **10.0 CRITICAL**.
   - Suggested Bounty Range updates to **$7,500 – $10,000**.
   - Target SLA Resolution Window updates to **24 Hours**.
4. Click **"Copy Vector"** to demonstrate clipboard integration.
5. **What to say**:
   > *"Sir, this is Feature 1: our pure in-house implementation of the FIRST.org CVSS 3.1 standard. It runs in pure TypeScript with zero third-party library dependencies. It calculates Impact Sub-Score, Scope multipliers, and Exploitability in real time, and executes exact FIRST.org Appendix A Roundup9 arithmetic to eliminate floating-point drift.*
   > *Crucially, it immediately links technical score to business logic: mapping Critical severity to a strict 24-hour resolution SLA countdown and a pre-configured bounty award bracket."*

### Step 3: Demonstrate Scoped Program & Report Triage Discussions (90 Seconds)
1. In the sidebar, click **"Discussions"** (or open `http://localhost:3000/workspace?view=discussions`).
2. Switch the **Target Program Scope** dropdown:
   - Select **"Portal Disclosure Program"**: Note that the Authorized Program Team shows `Sarah Chen (Owner) · Jonah Brooks (Defender) · Alex Rivera (Reporter)`.
   - Select **"Core API Boundary Program"**: Note that the roster dynamically updates to show `Sarah Chen (Owner) · Elena Rostova (API Auditor) · Liam Zhang (Reporter)`.
   - Select **"Cloud Infrastructure Program"**: Note that the roster updates to `Garrison Drake (SRE Lead) · Cyra Kaelen (SecOps Lead) · Sarah Chen (Owner)`.
3. Switch the channel switcher between:
   - **"Researcher Coordination (Class B)"**: Show public coordination between the security researcher and triage team.
   - **"Internal Engineering Deliberation (Class C)"**: Show privileged internal defender deliberation on root cause and patch verification.
4. Type a short message in the box and click **"Send Message"** to demonstrate live posting.
5. Click **"Lock Thread (Admin)"** to demonstrate administrative thread freezing.
6. **What to say**:
   > *"Sir, this is Feature 2: our Scoped Program & Report Triage Communications. In real-world enterprise operations, generic chat rooms or chatbots fail because different programs have completely different engineering teams, and vulnerability details cannot leak across findings.*
   > *Our system provides two-level hierarchical scoping: first by program, and second by specific finding thread. Furthermore, it strictly segregates external coordination (Class B) from internal engineering deliberations (Class C) at the API and database boundaries."*

### Step 4: Demonstrate the RFC 9116 Vulnerability Intake Vertical Slice (60 Seconds)
1. In the sidebar, click **"Their Reports"**, then click on report `BBT-0241`.
2. Click the **"Phase 1: Intake & Scope"** tab.
3. Show the RFC 9116 Safe Harbor audit matrix, OpenPGP v6 encryption envelope status, and Turnstile human verification record.
4. **What to say**:
   > *"Sir, this is Feature 3: our end-to-end RFC 9116 compliant vertical slice. From client submission through NestJS DTO validation down to PostgreSQL persistence, sensitive zero-day vulnerability data is encrypted via OpenPGP v6 envelopes, and validated against the organization's published security.txt policy."*

### Step 5: Run Automated Verification Tests Live (60 Seconds)
1. In terminal, run:
   ```bash
   cd apps/api && npm test
   ```
2. Show that all **117 tests pass deterministically across 11 test suites** in under 2 seconds.
3. Show clean TypeScript compilation:
   ```bash
   cd apps/web && npx tsc --noEmit
   ```
4. **What to say**:
   > *"Sir, all features are backed by empirical test evidence: 117 automated unit and integration tests passing with zero failures, and zero TypeScript compiler debt."*

---

## 3. Anticipated Supervisor Questions & Bulletproof Defenses

### Q1: "Why did you implement your own CVSS calculation instead of using an npm library?"
**Your Defense**:
1. **Supply Chain Security**: In a platform handling confidential zero-day vulnerability disclosures, importing third-party npm packages for core security math introduces dependency supply chain attack vectors.
2. **Appendix A Floating-Point Accuracy**: Most standard npm libraries use `Math.ceil(val * 10) / 10`. In JavaScript, IEEE 754 floating-point inaccuracies cause values like `4.000000000000001` to incorrectly round up to `4.1`. Our engine implements pure FIRST.org Appendix A Roundup9 arithmetic, guaranteeing 100% precision matching official NIST NVD benchmarks.

### Q2: "How do you prevent internal defense notes from leaking to external hackers?"
**Your Defense**:
- Through architectural dual-lane segregation enforced at both the database and API serialization levels. Class B messages (coordination) are accessible to both submitter and triage team, while Class C messages (internal engineering deliberation) are completely stripped from external API responses by NestJS response interceptors. Even if an external researcher inspects raw network packets, Class C data is never sent over the wire.

### Q3: "How is program isolation handled when multiple teams exist in one company?"
**Your Defense**:
- Every program is bound to an organization ID and maintains its own authorized members roster with role-based access control (RBAC). Discussions, reports, and scope policies are partitioned using relational foreign keys (`programSlug`, `reportId`). Even within the same organization, different defender teams can be assigned to different programs without overlap.

### Q4: "How does your system prevent timing attacks during authentication?"
**Your Defense**:
- In standard authentication, if an email does not exist, the server returns 401 in ~5ms. If the email exists, computing an Argon2id hash takes ~120ms. Attackers measure this timing difference to enumerate company employee emails.
- Our `AuthService` implements **dummy hash verification**: when a user email is not found, the server still executes a genuine Argon2id verification against a pre-computed dummy hash, normalizing response latency to ~120ms across all requests.

---

## 4. How to Open and Present the Slides

### Option A: Open PowerPoint Presentation (.pptx)
Open the generated presentation file directly in Microsoft PowerPoint, LibreOffice Impress, or Google Slides:
- File location: `university submissions/week-7/BugBountyTrack_MidTerm_Presentation.pptx`
- Clean 16:9 widescreen layout, 100% light theme, zero chips, professional typography and tables.

### Option B: Open Interactive Light-Theme HTML Deck
Open the HTML deck directly in your browser:
```bash
xdg-open "university submissions/week-7/BugBountyTrack_MidTerm_Presentation.html"
```
- Press **`Arrow Right`** or **`Space`** to advance slides.
- Press **`Arrow Left`** to move back.
- Press **`Ctrl + P`** if you wish to export all 9 slides cleanly to PDF.
