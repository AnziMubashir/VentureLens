# VentureLens: 3-Person Live Demo & Code Walkthrough Guide

**Document Purpose:** A complete, timed presentation script and code walkthrough guide for a 3-member team demonstrating VentureLens to faculty evaluators.

---

## 1. Team Roles & Sub-Agent Assignment Overview

| Member | Assigned Sub-Agent | Presentation Topic (~2 Mins) | Code Walkthrough (~1 Min) |
|---|---|---|---|
| **Member 1 (Lead)** | **Investor Agent** | Problem statement, venture submission, and commercial viability evaluation. | `IdeaInput`, `InvestorAnalysis`, and `INVESTOR_AGENT_SYSTEM_PROMPT`. |
| **Member 2** | **Technical Agent** | System architecture, parallel async execution, and LLM structured output. | `run_stage1_and_stage2` (`asyncio.gather`) and `GeminiProvider`. |
| **Member 3** | **User Agent & Board Chair** | User friction, "Challenge My Idea" peer critiques, and dual deliverables. | `CHALLENGE_CRITIQUE_SYSTEM_PROMPT` and `templates/pitch_site.html`. |

**Total Presentation Duration:** ~9–10 Minutes (including live software interaction and code inspection).

---

## 2. Minute-by-Minute Presentation Script

```
[00:00 - 03:00] Member 1: Intro, Submission & Investor Agent Evaluation
[03:00 - 05:30] Member 2: Architecture, Concurrency & Technical Agent Evaluation
[05:30 - 08:30] Member 3: User Agent, "Challenge My Idea" & Deliverables Hub
[08:30 - 10:00] Q&A & Conclusion
```

---

### Member 1: Project Vision, Submission & Investor Agent

#### 🎤 Speaking Script (~2 Minutes)

> *"Good morning, Professor. Today, our team is presenting **VentureLens**, an AI-powered virtual boardroom designed to evaluate, stress-test, and present early-stage venture ideas.*
>
> *Most people trying to validate a startup idea use generic chatbots like ChatGPT. But standard LLMs suffer from a critical flaw: **confirmation bias**. They default to polite, agreeable summaries that gloss over real-world commercial failure points.*
>
> *VentureLens takes a completely different approach. Instead of a single chatbot, we convene a panel of three specialized, independent AI agents coordinated by an executive Board Chair: an **Investor Agent**, a **Technical Agent**, and a **User Agent**.*
>
> *(Action on screen: Open `http://localhost:5173`)*
>
> *I am assigned to the **Investor Agent**. The Investor’s responsibility is cold, commercial realism. It doesn't care how cool the technology is; it evaluates market size, customer willingness to pay, recurring revenue models, and defensibility against incumbents.*
>
> *(Action on screen: Click 'CampusBite' under Quick Demo Fill)*
>
> *For our demonstration, we are evaluating **CampusBite** — an automated mobile pre-ordering and smart heated locker system for university cafeterias, solving the 25-minute queue bottleneck between classes.*
>
> *(Action on screen: Click 'Begin Multi-Agent Evaluation')*
>
> *As soon as I submit, the boardroom convenes. Notice the status grid at the top: our three specialist agents are now evaluating this venture **in parallel** over live Server-Sent Events.*
>
> *Once Stage 1 finishes, let's look at the Investor tab:  
> The Investor Agent validates that the university student and faculty market has strong daily volume. However, it immediately flags commercial risks: hardware deployment capital costs, dining vendor revenue-sharing friction, and seasonal churn during summer breaks. It recommends starting with a 3% platform fee rather than heavy upfront locker leasing.*
>
> *Now, I’ll hand over to Member 2, who will walk through the Technical Agent and our system architecture."*

---

#### 💻 Member 1: Code Walkthrough (~1 Minute)

> *"Now I will briefly show the code behind our data validation and the Investor Agent.*
>
> 1. *Open `backend/app/schemas.py`: Point to `IdeaInput` and `InvestorAnalysis`.*  
>    *"Here in `schemas.py`, we define our strict Pydantic models. Notice that `IdeaInput` validates character boundaries so incomplete ideas are caught before hitting the LLM. The `InvestorAnalysis` schema requires distinct fields: `market_opportunity`, `revenue_models`, `commercial_risks`, and `verdict`. The model is not allowed to return free-form text; it must conform to this schema."*
>
> 2. *Open `backend/app/prompts.py`: Point to `INVESTOR_AGENT_SYSTEM_PROMPT`.*  
>    *"Here in `prompts.py`, we give the Investor Agent a dedicated persona as a senior venture capitalist. We instruct it to be skeptical of unvalidated claims, focus on unit economics and CAC inflation, and explicitly forbid it from hallucinating fake market statistics."*
>
> 3. *Open `frontend/src/components/IdeaForm.tsx`.*  
>    *"On the frontend, `IdeaForm.tsx` provides instant 1-click loading for our two curated sample ventures, so we can demonstrate the system in seconds without manual typing."*

---

### Member 2: System Architecture, Concurrency & Technical Agent

#### 🎤 Speaking Script (~2 Minutes)

> *"Thank you, Member 1. I am assigned to the **Technical Agent**, and I will also explain our engineering architecture.*
>
> *While Member 1’s Investor Agent cares about making money, my Technical Agent is the engineering reality check. Its job is to assess software feasibility, recommend an appropriate modern stack, identify security bottlenecks, and most importantly, define strict boundaries for an MVP so the founders don’t spend 6 months over-engineering.*
>
> *(Action on screen: Click the 'Technical' tab in Stage 1 Findings)*
>
> *Looking at the Technical Agent’s evaluation for CampusBite:  
> It rates the project as moderately feasible. It recommends a React frontend with a Python FastAPI async backend, containerized via Docker. However, it flags a major technical hurdle: real-time IoT synchronization with smart heated locker hardware and POS integration with legacy campus cafeteria systems. Crucially, it defines the MVP boundary: launch with a single cafeteria and QR-code PIN verification, deferring complex multi-building automated lockers to v2.*
>
> *From a system engineering perspective, how does VentureLens actually run?*
>
> *We deliberately avoided heavy agent frameworks like LangGraph or CrewAI. For a fixed advisory board, heavy frameworks introduce massive dependency bloat, fragile state graphs, and non-deterministic routing that fails during live demos. Instead, we built a clean, native Python `asyncio` orchestrator.*
>
> *When Member 1 clicked submit, our backend executed all three specialist agents simultaneously using `asyncio.gather`. This cut our Stage 1 runtime from 15 seconds down to just 4 seconds.*
>
> *We also integrated the official Google GenAI SDK using `gemini-3.5-flash-lite`. By using native JSON schema enforcement, the model cannot return malformed JSON. Furthermore, we built a deterministic **Mock Mode** (`LLM_MODE=mock`) that runs completely offline with zero quota consumption, ensuring 100% demo reliability even if university Wi-Fi drops.*
>
> *Now, Member 3 will show you what happens when our agents start arguing in the 'Challenge My Idea' stage."*

---

#### 💻 Member 2: Code Walkthrough (~1 Minute)

> *"Let me show you our async orchestration and Gemini integration.*
>
> 1. *Open `backend/app/orchestrator.py`: Scroll to `run_stage1_and_stage2` (around line 50).*  
>    *"Here in `orchestrator.py`, notice lines 65–75. We spawn `investor_task`, `technical_task`, and `user_task` concurrently using `asyncio.gather`. All three LLM calls happen at the exact same time across the network. As soon as they complete, we emit a Server-Sent Event (`publish_event`) so the React UI updates instantly."*
>
> 2. *Open `backend/app/llm.py`: Scroll to `GeminiProvider._generate_structured` (around line 270).*  
>    *"Here in `llm.py`, we pass `response_schema=schema_cls` directly into Google's `GenerateContentConfig`. We also implemented an automatic retry handler, and if the API ever encounters rate-limiting or network failure, it gracefully falls back to our deterministic `MockProvider` so our presentation never crashes."*
>
> 3. *Open `backend/.env`.*  
>    *"Finally, in `.env`, we can toggle between `LLM_MODE=live` and `LLM_MODE=mock` with a single switch. API keys remain strictly on the backend and are never exposed to the browser."*

---

### Member 3: User Agent, "Challenge My Idea" & Dual Deliverables

#### 🎤 Speaking Script (~2 Minutes)

> *"Thank you, Member 2. I am assigned to the **User Agent**, and I will also demonstrate our flagship feature: **Challenge My Idea**, along with our two synchronized deliverables.*
>
> *My User Agent represents the human being who has to use this product. It evaluates persona pain points, habit inertia, and adoption friction.  
> Looking at the User tab in Stage 1: it validates that students feel acute stress when waiting in 25-minute queues between lectures. But it warns: if the app requires creating an account, entering credit card details, and downloading a 100MB app before placing an order, students will just buy a snack from a vending machine instead.*
>
> *(Action on screen: Scroll to Stage 2: Initial Synthesis)*
>
> *Now look at Stage 2. The Board Chair consolidated all three views and surfaced our **Identified Domain Tensions**:  
> The Investor wants mandatory up-front user verification and immediate enterprise monetization; the User Agent warns that verification causes high bounce rates; and the Technical Agent warns that complex enterprise billing will delay launch by months.*
>
> *(Action on screen: Click the red 'Challenge My Idea' button)*
>
> *Now, watch Stage 3: **Challenge My Idea**. This is where VentureLens shines.  
> Instead of accepting early assumptions, the agents cross-examine each other:
> - Look at Critique 1: The Technical Agent challenges the Investor's demand for multi-tenant enterprise billing in v1, noting it introduces severe security audit overhead and suggesting a simple Stripe checkout instead.
> - Look at Critique 2: The User Agent challenges the Investor's mandatory identity verification, suggesting a cardless guest mode.
> - Look at Critique 3: The Investor challenges the Technical Agent for deferring all analytics, noting we can't prove retention without telemetry.*
>
> *(Action on screen: Scroll to Stage 4 and Deliverables Hub)*
>
> *In Stage 4, the Board Chair resolves these tensions and renders the final Refined Analysis with explicit trade-offs.*
>
> *Finally, VentureLens compiles this refined analysis into **two synchronized deliverables**:*
>
> 1. *Here in Tab 1 is the **Boardroom Report**: A 10-section executive audit report covering strengths, risks, trade-offs, and an MVP roadmap. We can copy it, print it cleanly as a PDF, or download the `.md` file.*
> 2. *Here in Tab 2 is the **Static Pitch Website**: A presentation landing page generated from the exact same analysis. Notice we have a live sandboxed iframe preview with desktop and mobile toggles. When I click **'Download Standalone Site'**, it gives us a single `.html` file with **100% embedded CSS**. It requires zero external CDNs and opens completely offline on any device.*
>
> *Both deliverables match 100% because they are derived from the same refined analysis.*
>
> *Now, let me briefly show the code for the challenge stage and standalone website generator."*

---

#### 💻 Member 3: Code Walkthrough (~1 Minute)

> *"Let me show the code behind the Challenge stage and our deliverables compiler.*
>
> 1. *Open `backend/app/prompts.py`: Point to `CHALLENGE_CRITIQUE_SYSTEM_PROMPT`.*  
>    *"Here in `prompts.py`, we instruct the agents to act as opposing debaters in Stage 3. They specifically scrutinize claims made by peer agents to expose hidden friction and costs. This produces a list of `CritiqueItem` objects containing the challenged claim, the concern, and a suggested pivot."*
>
> 2. *Open `backend/app/deliverables.py`: Point to `generate_standalone_pitch_html`.*  
>    *"In `deliverables.py`, we use Jinja2 to compile the pitch website. Notice line 10: we use `select_autoescape(['html', 'xml'])`. This guarantees that user input is sanitized, preventing XSS injection."*
>
> 3. *Open `backend/app/templates/pitch_site.html`.*  
>    *"Notice lines 9–150 of `pitch_site.html`. All CSS is completely embedded inside the `<style>` tag. There are zero external stylesheet links, zero external Google fonts, and zero script tags. This satisfies our assignment requirement that the presentation site is genuinely standalone and offline-capable."*
>
> *"Thank you, Professor. We are now open for any questions about our architecture, multi-agent logic, or test suite."*

---

## 3. Quick Reference: Cheatsheet for Answering Evaluator Questions

| Evaluator Question | Recommended Answer |
|---|---|
| **"Why is this multi-agent instead of a single LLM prompt?"** | *"A single prompt blends perspectives and defaults to agreeable confirmation bias. In VentureLens, each agent has an isolated prompt and schema, creating genuine creative tension (e.g. Investor wanting monetization vs User warning of friction) that gets stress-tested in the Challenge stage."* |
| **"Why didn't you use LangGraph or CrewAI?"** | *"Our pipeline is a deterministic Directed Acyclic Graph (DAG). Native Python `asyncio` gives us faster execution, 100% predictable state, zero framework bloat, and full testability without black-box routing failures."* |
| **"What happens if the Gemini API goes down or hits rate limits?"** | *"We built a two-layer safety net: first, an automated 1-second retry; second, an automatic graceful fallback to our deterministic `MockProvider`. Setting `LLM_MODE=mock` runs the entire system offline with zero API calls."* |
| **"How do you ensure the Report and Pitch Website agree?"** | *"Both deliverables are compiled from the exact same Pydantic object: `RefinedAnalysis`. The pitch content generator cannot invent new features; it pulls directly from the resolved trade-offs and MVP boundary."* |
