# VentureLens: Software Requirements Specification (SRS)

**Document Version:** 1.0.0  
**Standard:** IEEE 830-1998 Aligned (Adapted for Academic Software Engineering Demonstration)  
**System Name:** VentureLens Virtual Boardroom  

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for VentureLens, a multi-agent AI system designed to evaluate early-stage venture concepts through specialized analytical personas and automated cross-agent challenge cycles.

### 1.2 System Scope
The system comprises a React 18 single-page application communicating via REST and Server-Sent Events (SSE) with an asynchronous Python FastAPI backend. The backend orchestrates multi-agent evaluations using Google Gemini models with deterministic offline fallback capability.

---

## 2. Overall Description

### 2.1 System Architecture
The application implements a clean two-tier decoupled architecture:

```
[ Client Tier: React 18 + Vite + Tailwind SPA ]
         │                  ▲
  REST   │                  │  Server-Sent Events (SSE)
         ▼                  │
[ Server Tier: FastAPI Async Application ]
         │
         ├── Core Orchestrator (Board Chair State Machine)
         ├── Domain Agents (Investor, Technical, User, Chair)
         ├── LLM Layer: GeminiProvider (Live) / MockProvider (Demo)
         ├── Deliverables Engine: Jinja2 Standalone Compiler + Markdown Builder
         └── Storage: Thread-safe in-memory Pitch Repository
```

### 2.2 User Characteristics
The system is operated by university faculty evaluators, students, and early-stage startup creators. No technical programming knowledge is required to use the graphical web interface.

---

## 3. Specific Functional Requirements

| ID | Requirement Title | Description | Input | Processing | Output |
|---|---|---|---|---|---|
| **FR-01** | Idea Submission | Validates and accepts submission of a venture concept. | `IdeaInput` (JSON) | Enforces character limits and non-empty checks. | `PitchRecord` with status `idle` or `stage1_running`. |
| **FR-02** | Sample Idea Pre-Loading | Returns curated sample venture ideas. | `GET /api/samples` | Retrieves static sample records. | Array of `SampleIdea` objects (`CampusBite`, `DevPulse`). |
| **FR-03** | Parallel Specialist Analysis | Executes Investor, Technical, and User agents simultaneously. | `IdeaInput` | Asynchronously invokes specialist agents via `asyncio.gather`. | `SpecialistOutputs` populated into `PitchRecord`. |
| **FR-04** | Initial Board Synthesis | Board Chair synthesizes Stage 1 findings. | `SpecialistOutputs` | Extracts consensus, contradictions, and cross-dependencies. | `InitialSynthesis` populated; status set to `awaiting_challenge`. |
| **FR-05** | Real-Time Event Streaming | Emits live progress events to connected UI clients. | `GET /api/pitches/{id}/events` | Subscribes client to async event queue; emits SSE frames. | SSE stream (`text/event-stream`). |
| **FR-06** | Interactive Challenge Trigger | User manually authorizes progression to Stage 3. | `POST /api/pitches/{id}/challenge` | Validates status is `awaiting_challenge`; schedules Stage 3 & 4. | Updated `PitchRecord` with status `stage3_running`. |
| **FR-07** | Cross-Critique Execution | Specialists critically evaluate claims made by peer agents. | `SpecialistOutputs` + `InitialSynthesis` | Models cross-examination between domains. | `ChallengeAnalysis` containing array of `CritiqueItem`. |
| **FR-08** | Refined Final Synthesis | Board Chair formulates definitive trade-offs and verdict. | All previous stage outputs | Synthesizes resolved trade-offs, refined recs, and MVP scope. | `RefinedAnalysis` populated. |
| **FR-09** | Boardroom Report Export | Compiles comprehensive analytical report. | `RefinedAnalysis` + Stage Data | Formats clean, structured Markdown document. | Text response (`text/markdown`). |
| **FR-10** | Standalone Pitch Site Export | Compiles standalone presentation website. | `PitchContent` + `IdeaInput` | Renders Jinja2 template with 100% embedded CSS. | HTML response (`text/html`). |
| **FR-11** | Deterministic Mock Mode | Runs complete evaluation pipeline offline without API access. | Config `LLM_MODE=mock` | Uses hardcoded, schema-valid data generators. | Instantaneous, schema-valid `PitchRecord`. |
| **FR-12** | Live Gemini Integration | Connects to Google GenAI SDK for live AI analysis. | Config `LLM_MODE=live` | Invokes Gemini models with structured JSON schema enforcement. | Schema-validated AI response. |

---

## 4. Non-Functional Requirements

### 4.1 Performance & Concurrency (NFR-01)
- Parallel Stage 1 specialist calls must execute concurrently via `asyncio.gather` rather than sequentially, reducing total wall-clock time by over 50%.
- Server-Sent Events must deliver stage transition notifications to the frontend within 150ms of backend state changes.

### 4.2 Reliability & Fault Tolerance (NFR-02)
- If the Gemini API experiences network timeouts, 503 load spikes, or rate limiting, the backend must perform a single retry followed by an automatic graceful fallback to the deterministic `MockProvider` to prevent demonstration failure.
- In Mock Mode, the complete pipeline must execute with zero external network connectivity.

### 4.3 Security & Secret Management (NFR-03)
- API keys must never be exposed to the client or embedded in frontend bundles. All model calls remain strictly server-side.
- The `.env` file must be excluded from Git version control via `.gitignore`.
- User input rendered into the pitch website must be sanitized via Jinja2 autoescaping to prevent Cross-Site Scripting (XSS).

### 4.4 Portability & Simplicity (NFR-04)
- The backend must run on standard Python 3.11+ without requiring Docker or external database servers.
- The generated Pitch Website must be genuinely standalone (single-file `.html`), requiring zero external CDN links or network access to render.

---

## 5. External Interface Specifications

### 5.1 REST Endpoints
- `GET /api/health` -> System health and operating mode status.
- `GET /api/samples` -> Curated sample ideas for 1-click form filling.
- `POST /api/pitches` -> Submit idea, return `pitch_id`, begin Stage 1 & 2.
- `GET /api/pitches` -> List all in-memory pitches.
- `GET /api/pitches/{id}` -> Full state and stage outputs for a pitch.
- `POST /api/pitches/{id}/challenge` -> Explicit action to launch Stage 3 & 4.
- `GET /api/pitches/{id}/report` -> Serves formatted Markdown report.
- `GET /api/pitches/{id}/site` -> Serves standalone single-file HTML pitch website.
- `GET /api/pitches/{id}/events` -> Server-Sent Events (SSE) stream.
