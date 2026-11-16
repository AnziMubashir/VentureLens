# VentureLens: Product Requirements Document (PRD)

**Document Version:** 1.0.0  
**Status:** Approved  
**Product:** VentureLens — Multi-Agent AI Idea Evaluation Platform  
**Tagline:** *See your idea from every angle.*  
**Target Delivery:** CS325 Software Engineering University Working Demonstration  

---

## 1. Product Vision & Problem Statement

### 1.1 Product Vision
VentureLens is an AI-powered virtual boardroom designed to help startup founders, software engineers, and product creators evaluate, stress-test, and present early-stage ideas. Rather than providing a single generic LLM response or superficial numeric validation scores, VentureLens simulates a seasoned advisory board composed of three specialized analytical agents coordinated by an executive Board Chair.

### 1.2 Problem Statement
Early-stage innovators face two critical failure modes:
1. **Confirmation Bias & Blind Spots:** Founders often evaluate their ideas in an echo chamber, overlooking commercial unit economics, technical implementation bottlenecks, or practical user adoption friction.
2. **Superficial AI Validation:** Generic chatbots (ChatGPT, Claude) default to sycophantic praise or produce broad, ungrounded advice that blends commercial, technical, and UX perspectives into a single bland summary without exposing conflicting trade-offs.

---

## 2. Product Objectives & Value Proposition

1. **Genuine Multi-Perspective Rigor:** Deliver three genuinely independent evaluations across business (Investor), engineering (Technical), and user experience (User) domains.
2. **Critical Cross-Examination ("Challenge My Idea"):** Implement a dedicated second-stage peer critique where specialists challenge each other's assumptions to expose overlooked risks and mandatory trade-offs.
3. **Synchronized End Deliverables:** Automatically produce two consistent, high-leverage outputs from the exact same refined analysis:
   - A structured, exportable **Boardroom Report** (Markdown / printable view).
   - A genuinely standalone, single-file **Static Pitch Website** (embedded CSS, offline-ready).
4. **Demonstration Reliability:** Provide a zero-quota, deterministic mock mode so that university demonstrations never fail due to upstream API rate limits or network issues.

---

## 3. Target Audience & User Personas

### Persona A: The Student / Hackathon Founder (Alex, 21)
- **Context:** Building an MVP for an academic project or hackathon within a 48-hour to semester timeline.
- **Pain Point:** Prone to premature technical over-engineering while ignoring customer acquisition friction.
- **Goal:** Get a realistic MVP boundary definition and an immediate pitch website to demo to peers and professors.

### Persona B: The Technical Innovator (Priya, 28)
- **Context:** Senior software engineer with a novel developer tool idea.
- **Pain Point:** Strong on tech stack decisions, but weak on commercial monetization models and defensibility.
- **Goal:** Stress-test commercial viability without paying high consulting fees.

---

## 4. User Journey & Core Workflows

```
[ Step 1: Submission ]
  User enters venture details (or clicks a 1-click sample idea).
         │
         ▼
[ Step 2: Stage 1 & 2 Execution ]
  Live Boardroom session opens; Investor, Technical, and User agents analyze concurrently.
  Board Chair emits Initial Synthesis (Agreements & Conflicting Perspectives).
         │
         ▼
[ Step 3: Interactive Review & Challenge Trigger ]
  User reviews the initial findings on-screen.
  User explicitly clicks "Challenge My Idea" to launch peer cross-critiques.
         │
         ▼
[ Step 4: Stage 3 & 4 Execution ]
  Specialists cross-examine peer claims in parallel.
  Board Chair reconciles conflicts and produces the final Refined Analysis.
         │
         ▼
[ Step 5: Deliverables Hub ]
  User views and downloads the Boardroom Report (Markdown).
  User previews the Static Pitch Website in a sandboxed iframe and downloads the standalone HTML.
```

---

## 5. Functional Scope & Feature Descriptions

### 5.1 In-Scope Capabilities
- **FR-1 Idea Submission:** Form collecting Name, Description, Problem, Target Users, and Proposed Solution with inline validation.
- **FR-2 Sample Idea Pre-loader:** 1-click loader for 2 curated ventures (`CampusBite` and `DevPulse`).
- **FR-3 Specialist Agent Evaluations (Stage 1):**
  - *Investor Agent:* Market need, revenue models, differentiation, business risks.
  - *Technical Agent:* Feasibility, recommended stack, MVP boundary, technical risks.
  - *User Agent:* Personas, pain points, adoption friction, essential UX features.
- **FR-4 Board Chair Initial Synthesis (Stage 2):** Executive summary, consensus areas, conflicting recommendations, cross-dependencies.
- **FR-5 Interactive Challenge Action:** Explicit user action to initiate Stage 3.
- **FR-6 "Challenge My Idea" Cross-Critiques (Stage 3):** Specialists critique peer claims with challenged claim, concern, and suggested pivot.
- **FR-7 Board Chair Refined Analysis (Stage 4):** Synthesized strengths, unmitigated risks, resolved trade-offs, and final verdict.
- **FR-8 Boardroom Report Deliverable:** Readable in-app presentation + Markdown download.
- **FR-9 Static Pitch Website Deliverable:** Sandboxed iframe preview + standalone single-file HTML download with 100% embedded CSS.
- **FR-10 Real-Time Event Streaming:** Live updates over Server-Sent Events (SSE).
- **FR-11 Deterministic Mock Provider:** Built-in offline mode for quota-free demo reliability.
- **FR-12 Mandatory Advisory Disclaimer:** Prominently featured on interface and exports.

### 5.2 Out-of-Scope (Strictly Deprioritized)
- User accounts, registration, passwords, and authentication.
- Payment gateways, subscription billing, or stripe checkouts.
- Relational database migrations (PostgreSQL/Alembic) — lightweight in-memory storage is used.
- Auto-investor email outreach or third-party CRM integrations.
- Numeric validation scores (e.g. "87/100 Startup Score") — the PDF explicitly rejects arbitrary scoring in favor of qualitative analysis.

---

## 6. Success Metrics & Demonstration Acceptance Criteria

1. **End-to-End Execution:** Complete user workflow completes smoothly in both Mock Mode (offline) and Live Gemini Mode.
2. **Visual Transparency:** The user observes distinct agent status cards progressing through actual backend events rather than fake timers.
3. **Multi-Agent Distinctness:** Specialist outputs demonstrate clear domain separation without generic persona blending.
4. **Deliverable Consistency:** Both the Boardroom Report and Pitch Website reflect the exact same refined analysis.
5. **Demonstration Standard:** The interface can be understood within 5 seconds and primary actions identified within 3 seconds.
