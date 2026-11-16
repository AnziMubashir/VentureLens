# VentureLens: Simplified Implementation Plan

**Context:** University Software Engineering Assignment Demonstration  
**Goal:** Deliver a working, reliable, end-to-end multi-agent evaluation platform meeting all core assignment requirements without enterprise over-engineering.

---

## 1. Core System Architecture

VentureLens is built as a lightweight two-tier application:

- **Frontend:** React + Vite + TypeScript + Tailwind CSS (Single Page Application).
- **Backend:** Python + FastAPI (Async REST API + Server-Sent Events).
- **Agent Orchestration:** Native Python `asyncio` coordinating genuine, distinct LLM calls via Google Gemini API (or Mock Mode). No LangGraph, CrewAI, or heavy agent frameworks.
- **Data Validation:** Pydantic v2 schemas enforcing strict JSON outputs from all agents.
- **Persistence:** Simple in-memory storage (with optional lightweight local JSON dumps). No database servers or migrations.
- **Demonstration Reliability:** Built-in deterministic mock provider (`LLM_MODE=mock`) allowing complete offline execution without API keys or quota constraints.

```
[ React SPA (Vite + Tailwind) ]
         │                  ▲
  POST   │                  │  Server-Sent Events (SSE) / Polling
         ▼                  │
[ FastAPI Backend (Python Async) ]
         │
         ├── Stage 1: Specialist Analysis (Investor, Technical, User via asyncio.gather)
         ├── Stage 2: Main Agent Initial Synthesis (Agreements & Disagreements)
         ├── Stage 3: Challenge My Idea (Cross-agent critiques via asyncio.gather)
         ├── Stage 4: Main Agent Final Synthesis (Refined Analysis & Trade-offs)
         ├── Stage 5: Boardroom Report Generation (Markdown + On-screen display)
         └── Stage 6: Static Pitch Website Compilation (Jinja2 HTML Template)
         │
         └── LLM Layer: Gemini API (Live) OR Deterministic Mock (Demo)
```

---

## 2. Agent Workflow & Genuine Multi-Agent Separation

To ensure this is a genuine multi-agent system rather than a single prompt with cosmetic headings, each agent operates with isolated system instructions, distinct analytical responsibilities, and strict Pydantic schemas.

### The Pipeline Stages

1. **Stage 1 — Specialist Evaluations (Parallel via `asyncio.gather`):**
   - **Investor Agent:** Market need, commercial viability, revenue models, competitive differentiation, business risks.
   - **Technical Agent:** Technical feasibility, recommended stack, implementation complexity, scalability/security, realistic MVP scoping.
   - **User Agent:** Target user pain points, adoption friction, user value, essential user-facing features.
2. **Stage 2 — Main Agent Initial Synthesis:**
   - Collects the three specialist outputs.
   - Identifies points of agreement, conflicting recommendations, and cross-dependencies.
   - Produces and presents the Initial Board Synthesis on screen.
   - **User Action:** The user reviews the initial synthesis and clicks the **"Challenge My Idea"** button to explicitly launch Stage 3 as the normal workflow.
3. **Stage 3 — Challenge My Idea (Parallel Cross-Critique):**
   - Triggered explicitly by the user's "Challenge My Idea" action.
   - Each specialist agent receives the *other two* agents' findings.
   - Specialists critically challenge assumptions (e.g., Technical flags infrastructure cost of Investor's feature; User flags adoption friction of Technical's security requirements).
4. **Stage 4 — Main Agent Final Synthesis:**
   - Synthesizes the critiques and documents explicit trade-offs.
   - Produces the authoritative **Refined Analysis** (the single source of truth for both deliverables).
5. **Stage 5 & 6 — Deliverables Generation:**
   - **Boardroom Report:** Formatted markdown/structured view containing executive summary, strengths, risks, trade-offs, recommendations, and MVP scope.
   - **Static Pitch Website:** Structured JSON mapped into a genuinely standalone, single-file HTML template with 100% embedded CSS (zero external CDN or web font dependencies), downloadable for offline viewing.

---

## 3. Simplified Project Structure

```
VentureLens/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI entry point, CORS, routes
│   │   ├── config.py           # Environment variables (GEMINI_API_KEY, LLM_MODE)
│   │   ├── schemas.py          # Pydantic models for all agent inputs and outputs
│   │   ├── llm.py              # Gemini API client & Deterministic Mock provider
│   │   ├── prompts.py          # Dedicated system prompts for each agent
│   │   ├── orchestrator.py     # Clean asyncio workflow coordinator
│   │   └── templates/
│   │       └── pitch_site.html # Clean Jinja2 standalone pitch website template
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main view container
│   │   ├── api.ts              # Backend API & SSE client
│   │   ├── types.ts            # TypeScript interfaces matching Pydantic schemas
│   │   └── components/
│   │       ├── IdeaForm.tsx         # Submission form with validation
│   │       ├── BoardroomProgress.tsx# Live status cards for each agent
│   │       ├── ChallengeMatrix.tsx  # Side-by-side cross-critique display
│   │       ├── ReportView.tsx       # Boardroom Report viewer & markdown download
│   │       └── PitchPreview.tsx     # Standalone HTML preview & download button
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docs/
│   ├── PROJECT_BLUEPRINT.md
│   └── IMPLEMENTATION_PLAN.md
├── .gitignore
└── README.md
```

---

## 4. API Endpoints (Minimal & Direct)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/pitches` | Submits idea, runs Stage 1 (specialists) and Stage 2 (initial synthesis), returns `pitch_id`. |
| `GET` | `/api/pitches/{id}` | Returns current status, stage outputs, and deliverables. |
| `GET` | `/api/pitches/{id}/events` | SSE stream emitting live stage events (`investor_done`, `chair_synthesis_done`, etc.). |
| `POST` | `/api/pitches/{id}/challenge` | Explicitly launches Stage 3 (Challenge My Idea), leading through Stage 4 and deliverables. |
| `GET` | `/api/pitches/{id}/site` | Serves or downloads the compiled standalone pitch website HTML (embedded CSS). |
| `GET` | `/api/samples` | Returns 1–2 lightweight pre-defined sample ideas for quick 1-click demonstration filling. |

---

## 5. Structured Data Contracts (Pydantic)

- **`IdeaInput`**: `name`, `description`, `problem`, `target_users`, `proposed_solution`.
- **`SpecialistOutput`**: `perspective` (investor/tech/user), `strengths`, `risks`, `recommendations`, `mvp_focus`.
- **`InitialSynthesis`**: `executive_summary`, `agreements`, `conflicts`, `dependencies`.
- **`CritiqueItem`**: `target_agent`, `challenged_claim`, `concern`, `suggested_pivot`.
- **`RefinedAnalysis`**: `synthesized_strengths`, `critical_risks`, `trade_offs`, `final_recommendations`, `mvp_specification`.
- **`PitchContent`**: `headline`, `problem`, `solution`, `key_features`, `target_audience`, `business_model`.

---

## 6. Implementation Milestones

### Milestone 1: Backend Foundation & Deterministic Mock Mode
- Setup FastAPI, configuration (`LLM_MODE=live|mock`), and Pydantic schemas.
- Implement `MockProvider` returning immediate, schema-valid data for all 6 stages.
- Build background orchestration runner with in-memory state dictionary and SSE events.

### Milestone 2: Multi-Agent Logic & Gemini Integration
- Write focused system prompts for Investor, Technical, User, and Main Agent.
- Implement Gemini API caller using structured JSON output.
- Implement Stage 1 (parallel specialist calls), Stage 2 (initial synthesis), Stage 3 (cross-critiques), and Stage 4 (final synthesis).
- Implement basic error handling and single-retry logic for JSON validation.

### Milestone 3: Deliverables Generation
- Implement Boardroom Report generator (clean Markdown output).
- Implement Static Pitch Website generator: Jinja2 template compiling `PitchContent` into a standalone, styled HTML file.

### Milestone 4: Frontend Development
- Build simple, professional React UI with Tailwind CSS.
- Create Idea Submission Form with validation and a "Load Sample Idea" button for quick demo input.
- Create Boardroom Progress screen showing live agent status cards.
- Create Challenge My Idea comparison display showing cross-critiques and resolved trade-offs.
- Create Report Viewer with Markdown download and Pitch Website iframe preview with HTML download.

### Milestone 5: Verification & Demo Rehearsal
- Run end-to-end evaluations in both Mock mode (offline) and Live mode (Gemini).
- Verify consistency between the Boardroom Report and the Static Pitch Website.
- Validate that all core assignment requirements are fully functional and ready for presentation.
