# VentureLens: Project Blueprint

> \*\*Assumptions\*\* (marked \*\*\[A]\*\* throughout)
> - \*\*\[A1]\*\* \*VentureLens\* is the product name; \*Pitch Room\* is the name of the multi-agent workflow inside it (the PDF uses both).
> - \*\*\[A2]\*\* Single-user demo: no accounts, no payments. The PDF lists the database as optional, so history is optional.
> - \*\*\[A3]\*\* \*\*Gemini API\*\* is the initial LLM provider, accessed through a thin wrapper so it can be swapped later.
> - \*\*\[A8]\*\* The initial synthesis is displayed to the user before the challenge stage starts, but the pipeline continues automatically (no manual approval step).

\---

## 1\. Product Overview and Objectives

VentureLens is a web-based multi-agent AI system that evaluates and refines early-stage startup, product, or software ideas. A user submits an idea; three specialist agents analyze it, a Main Agent coordinates and synthesizes, the agents challenge each other, and the system outputs a **Boardroom Report** and a **Static Pitch Website**.

**Objectives (from the PDF):**

1. Multi-perspective evaluation instead of one generic AI answer.
2. Early identification of business, technical, and user risks.
3. Refinement into a realistic, actionable MVP.
4. A practical orchestrator + sub-agent architecture.
5. Two outputs: an analytical report and a visual pitch.

**Out of scope (per PDF):** guaranteeing success, investment decisions, financial transactions, investor outreach, legal/financial advice, and a functional product implementation. The system evaluates and refines ideas only. It does **not** use numeric validation scores.

\---

## 2\. Functional Requirements and User Workflows

|ID|Requirement|
|-|-|
|FR1|Accept idea name/description, problem, target users, proposed solution, and optional context, with validation.|
|FR2|Run Investor, Technical, and User agents on the submission, each producing structured output.|
|FR3|Main Agent collects outputs and produces an initial synthesis (agreements, conflicts, dependencies) that is **displayed to the user before the challenge stage begins**.|
|FR4|Run the Challenge My Idea stage (cross-agent critique), then a final synthesis.|
|FR5|Generate a structured Boardroom Report (strengths, risks, recommendations, MVP).|
|FR6|Generate a static pitch website consistent with the report.|
|FR7|Show progress while the pipeline runs; allow viewing and downloading both outputs.|
|FR8|Show a clear "evaluation only, not advice" disclaimer.|
|FR9|*(Optional)* Store and list previous pitches.|
|FR10|**Mock mode:** a deterministic mock provider returns fixed, schema-valid agent outputs so the full pipeline runs without Gemini or network access.|

**Primary workflow:** Submit idea → watch agent progress → **initial synthesis appears on screen** → challenge stage runs → refined analysis → view Boardroom Report → view/download Pitch Website.

**Failure workflow:** If an agent call fails or returns invalid output, retry once; if it still fails, show a clear error with a "retry stage" option.

\---

## 3\. Agent Responsibilities

All agents share one contract: input is the structured idea (plus other agents' output where noted), output is **schema-validated JSON**, and each stays inside its own perspective.

**Investor Agent (business/commercial):** market and value proposition, potential revenue models, differentiation and competitive advantages, business risks.

**Technical Agent (feasibility):** technical feasibility, required technologies/infrastructure, development complexity, security and scalability concerns, and a technically realistic recommended MVP.

**User Agent (user experience):** target users and pain points, practical user value, adoption barriers, essential user-facing features.

**Main Agent (Board Chair / orchestrator):**

1. Coordinates the workflow of the three agents.
2. Collects and organizes their structured outputs.
3. Identifies agreements, conflicting recommendations, and dependencies.
4. Produces the synthesized evaluation, runs the challenge stage, and writes the final synthesis, report, and pitch content.

**\[A4]** The Main Agent is implemented as deterministic orchestration code plus LLM calls for synthesis; it is not a free-roaming autonomous agent. This keeps behavior predictable and debuggable.

\---

## 4\. Challenge My Idea Stage

**Purpose:** Prevent the first round from being treated as final by exposing conflicting assumptions, weaknesses, and overlooked implications.

**Mechanism:**

1. **Input assembly.** Main Agent packages the initial synthesis and all three first-round outputs.
2. **Parallel cross-critique.** Each specialist receives the *other two* agents' findings and returns a critique list. Each item contains: `target\_agent`, `target\_claim`, `concern`, `implication`, `suggested\_adjustment`.
3. **Conflict collection.** Main Agent groups critiques by theme and flags unresolved conflicts.
4. **Final synthesis.** Main Agent integrates critiques, makes explicit trade-offs, and produces the **refined analysis**, the single source of truth for both outputs.

**Example (from PDF):** Investor recommends user verification → Technical flags authentication/security/infrastructure cost → User flags privacy concerns and friction → Main Agent records the trade-off in the final assessment.

**\[A5]** One critique round only (no iterative loops), to bound cost and latency.

\---

## 5\. Output Requirements

### Boardroom Report

Generated from the refined analysis. Required sections:

* Idea summary
* Strengths
* Risks (business, technical, user)
* Cross-agent conflicts and trade-offs (from the challenge stage)
* Recommendations
* Proposed MVP (scope, core features, what is deferred)
* Evaluation-only disclaimer

Rendered in-app; **\[A6]** downloadable as Markdown (PDF export only if time allows).

### Static Pitch Website

* Visually designed, **static** (no backend, no working product features).
* Sections (from PDF): Product Name and Value Proposition, Problem, Solution, Target Users, Core Features, Competitive Differentiation, Business and Value Proposition, Future Vision.
* **Consistency rule:** it must align with the report on product name, value proposition, problem/solution, users/features, differentiation, and MVP/vision.
* **Implementation approach \[A7]:** the Main Agent emits a `pitch\_content` JSON block from the refined analysis; a fixed HTML/CSS template is populated from it (with HTML escaping). This guarantees consistency and avoids broken or unsafe model-written HTML. Output is a single self-contained `.html` file shown in a sandboxed iframe preview and available for download.

\---

## 6\. Recommended Technology Stack

|Layer|Choice|Justification|
|-|-|-|
|Frontend|React (Vite) + Tailwind|Fast to build; component model suits multi-stage UI.|
|Backend|Python + FastAPI (async)|Native async for parallel agent calls; Pydantic for schema validation; simple SSE streaming.|
|LLM provider|Gemini API (Google Gen AI SDK) **\[A3]**|Provider fixed up front to avoid decision drift; supports JSON-schema structured output. Wrapped so it stays swappable.|
|Agent layer|Plain Python modules over the provider wrapper|A custom orchestrator is simpler and more transparent than a heavy framework for a fixed 3-agent pipeline.|
|Structured output|Pydantic v2 models|Enforces agent contracts; failed validation triggers a retry.|
|Progress updates|Server-Sent Events|One-way streaming is sufficient; simpler than WebSockets.|
|Storage (optional)|PostgreSQL via SQLAlchemy 2.0 async + Alembic|Stores pitches and stage outputs as JSONB. SQLite is acceptable for a local demo.|
|Demo fallback|Deterministic mock provider (`LLM\_MODE=mock`)|Demo must work if Gemini quota or network fails; see Section 7.|
|Secrets|`.env` on backend only|PDF requirement: API credentials never reach the client.|
|Deployment|Frontend on Vercel/Netlify; backend on Render/Railway|Low-cost, simple hosting for a demo.|

\---

## 7\. System Architecture and Agent Communication Flow

```
\[React SPA] --POST /pitches--> \[FastAPI Backend] ----> \[LLM Provider API]
     ^                              |
     |<------ SSE progress ---------+
                                    |
                         \[Orchestrator (Main Agent)]
                                    |
     Stage 1  Investor | Technical | User     (parallel, asyncio.gather)
     Stage 2  Main Agent: initial synthesis  (shown to user via SSE)
     Stage 3  Challenge: each specialist critiques the other two (parallel)
     Stage 4  Main Agent: final synthesis -> refined analysis
     Stage 5  Boardroom Report generation
     Stage 6  pitch\_content JSON -> HTML template -> static site
                                    |
                            \[PostgreSQL, optional]
```

**Key design points:**

* Pipeline state (`pending / running / done / failed` per stage) is held **in memory** for the local demo. This supports UI updates and page refresh while the server is running, but **does not guarantee recovery after a server restart**. Persisting state to the database is the optional upgrade (FR9).
* **Mock mode:** the LLM wrapper exposes one interface with two implementations, Gemini and a deterministic mock. Setting `LLM\_MODE=mock` (or an automatic fallback prompt after repeated Gemini failures) swaps in fixed, schema-valid outputs for every stage, including critiques and `pitch\_content`. The UI shows a visible "Mock mode" badge so demo output is never mistaken for live analysis.
* Agents never call each other directly; **all communication is routed through the Main Agent**, which controls what each agent sees.
* Each agent has a dedicated system prompt file, kept separate from code to support the Agile prompt-iteration the PDF anticipates.
* Backend endpoints: `POST /pitches`, `GET /pitches/{id}/events` (SSE), `GET /pitches/{id}`, `GET /pitches/{id}/report`, `GET /pitches/{id}/site`, and optionally `GET /pitches`.

\---

## 8\. Essential UI Screens

|Screen|Purpose|
|-|-|
|**Landing / Idea Submission**|Form for name/description, problem, target users, solution, optional context; inline validation.|
|**Boardroom Session (progress)**|Live view of each agent's status and key outputs. Displays the **initial synthesis** once ready and keeps it visible while the challenge stage runs, so the two-stage evaluation can be demonstrated.|
|**Challenge Results**|Shows cross-agent critiques, conflicts, and trade-offs side by side.|
|**Boardroom Report**|Readable structured report with download.|
|**Pitch Website Preview**|Sandboxed iframe preview with download.|
|**Past Pitches** *(optional)*|List of previous submissions.|

\---

## 9\. Development Milestones

Aligned with the PDF's six iterations, with setup first:

0. **Setup:** repo, FastAPI + Vite skeleton, env handling, LLM wrapper with Gemini and **mock** implementations, Pydantic schemas.
1. **Iteration 1:** idea submission UI and validated `POST /pitches`.
2. **Iteration 2:** Investor, Technical, and User agents with prompts and schema-validated output (parallel execution).
3. **Iteration 3:** Main Agent orchestration and initial synthesis; SSE progress to the UI, with the initial synthesis displayed before the challenge stage.
4. **Iteration 4:** Challenge My Idea (cross-critique + final synthesis).
5. **Iteration 5:** Boardroom Report generation and rendering.
6. **Iteration 6:** pitch content generation, HTML template, and preview/download.
7. **Evaluation and refinement:** run varied ideas, tune prompts, fix UX gaps.
8. **Deployment:** deploy frontend and backend; optional DB persistence if time allows.

**Priority rule:** a working end-to-end happy path (Milestones 0 to 6) comes before polish or optional features.

\---

## 10\. Risks, Limitations, and Testing

### Risks and Mitigations

|Risk|Mitigation|
|-|-|
|Malformed or off-schema LLM output|Pydantic validation + one retry + clear error state.|
|Gemini quota exhaustion or network failure during demo|Mock mode (FR10) with visible badge; rehearse the demo in both modes.|
|Latency (many sequential LLM calls)|Parallelize Stages 1 and 3; stream progress; cap output length.|
|API cost / rate limits|One critique round **\[A5]**; request throttling; per-IP limits.|
|Server restart loses in-memory pipeline state|Accepted for local demo; optional DB persistence.|
|Agents blurring their roles|Tight role prompts; role-adherence checks in testing.|
|Report/website inconsistency|Both derive from the same refined analysis; site built from structured JSON **\[A7]**.|
|Vague or generic advice|Require idea-specific references in prompts; test with varied ideas.|
|Credential leakage or prompt injection via user input|Keys backend-only; treat user text as data; escape all output in HTML.|
|Users treating output as authoritative|Persistent disclaimer; no scoring or guarantees.|

### Limitations

* No live market, competitor, or user data; analysis relies on the model's general knowledge and the user's input (PDF lists these as future work).
* Outputs are advisory and may contain errors.
* The pitch website is presentation-only.

### Testing Requirements (per PDF)

* **Unit:** schema validation, orchestrator logic, HTML template rendering and escaping.
* **Integration:** frontend ↔ backend ↔ LLM, using mock mode for deterministic runs plus a small number of live Gemini runs.
* **Mock mode:** full pipeline completes end to end in mock mode with no network; mock outputs pass the same schema validation as live outputs; the mock badge is shown.
* **Initial synthesis visibility:** verify it renders before challenge-stage results arrive and stays visible alongside them.
* **AI workflow:** verify each agent stays in role, the challenge stage references other agents' claims, and the final synthesis includes the challenge findings.
* **Consistency:** automated check that product name, MVP, and key features match between report and site.
* **UI:** responsiveness, input validation, error and retry states.
* **Evaluation:** test with at least 4 to 5 diverse ideas (e.g., consumer app, B2B tool, hardware-adjacent, weak/vague idea) and review relevance and usefulness.

