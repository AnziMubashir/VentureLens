# VentureLens

> **See your idea from every angle.**

VentureLens is an AI-powered virtual boardroom that helps entrepreneurs, engineers, and product builders evaluate, stress-test, and present early-stage startup, product, and software ideas.

Instead of relying on a single generic AI chatbot or superficial numeric validation scores, VentureLens convenes a panel of specialized AI agents representing distinct commercial, technical, and user experience domains, coordinated by an executive orchestrator (the Board Chair).

---

## Key Features

- **Specialized Multi-Agent Evaluation:**
  - **Investor Agent:** Commercial viability, unit economics, market opportunity, differentiation, and business risks.
  - **Technical Agent:** Feasibility, architecture, tech stack, scalability, security, and realistic MVP scoping.
  - **User Agent:** Persona definition, pain point validation, adoption friction, and essential user-facing features.
- **"Challenge My Idea" (Two-Stage Synthesis):** 
  Specialist agents don't just speak in isolation; they critically cross-examine each other's recommendations in a dedicated second round, exposing conflicting assumptions and unresolved trade-offs.
- **Dual Synchronized Deliverables:**
  - **Boardroom Report:** A comprehensive analytical report containing executive synthesis, risk matrices, trade-offs, and an actionable MVP specification (exportable as Markdown and printable to PDF).
  - **Static Pitch Website:** A standalone, responsive presentation landing page compiled directly from the refined analysis into an exportable single-file HTML deliverable with sandboxed preview.
- **Deterministic Mock Mode:**
  A built-in offline demonstration engine that provides instant, schema-valid agent evaluations for pre-configured and custom ventures without consuming API quotas or requiring internet access.

---

## System Architecture

```
[ React 18 + Vite + Tailwind SPA ]
         │                  ▲
  REST   │                  │  Server-Sent Events (SSE)
         ▼                  │
[ FastAPI Async Backend & State Machine ]
         │
         ├── Stage 1: Parallel Specialist Analysis (Investor, Tech, User)
         ├── Stage 2: Board Chair Initial Synthesis (Agreements & Conflicts)
         ├── Stage 3: Parallel Cross-Critique ("Challenge My Idea")
         ├── Stage 4: Board Chair Final Synthesis (Refined Analysis & Trade-offs)
         ├── Stage 5: Boardroom Report Generation (Markdown & Styled View)
         └── Stage 6: Static Pitch Site Compilation (Jinja2 + Tailwind -> Standalone HTML)
         │
         ├── LLM Layer: Google Gemini API (Live) | Deterministic Provider (Mock)
         └── Storage: SQLite via aiosqlite (Local pitch history & state persistence)
```

---

## Repository Structure

```
VentureLens/
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation & quickstart
├── docs/                       # Project specifications & architecture
│   ├── PROJECT_BLUEPRINT.md    # Initial technical blueprint
│   ├── IMPLEMENTATION_PLAN.md  # Detailed system architecture & milestone plan
│   ├── Product_Requirements_Document.md
│   ├── Software_Requirements_Specification.md
│   └── UI_UX_Design.md
├── prompts/                    # System instructions for specialized agents
│   └── masterprompt.txt        # Master product prompt
├── backend/                    # FastAPI backend service
└── frontend/                   # React + Vite frontend application
```

---

## Quickstart & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- (Optional) Google Gemini API Key (not required in Mock Mode)

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run FastAPI development server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run Vite development server
npm run dev
```

### Live vs. Demonstration Mock Mode
Set the operating mode in `backend/.env`:
```env
# Use deterministic mock mode (offline-safe, instant, zero quota consumption)
LLM_MODE=mock

# Or use live Google Gemini API
LLM_MODE=live
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Project Status

- [x] Initial Requirements Analysis & Master Prompt Review
- [x] Technical Blueprint & Contradiction Resolution
- [x] Implementation Plan (`docs/IMPLEMENTATION_PLAN.md`)
- [ ] Phase 1: Formal Documentation (PRD, SRS, UI/UX Design, Architecture, Roadmap)
- [ ] Phase 2: Core Backend Engine & Deterministic Mock Provider
- [ ] Phase 3: Specialist Agent Implementations & Parallel Stage 1
- [ ] Phase 4: Board Chair Orchestration & Challenge My Idea Stage
- [ ] Phase 5: Boardroom Report & Static Pitch Website Generators
- [ ] Phase 6: Polished React Boardroom Interface
- [ ] Phase 7: Verification, Test Suite & Live University Demo

---

## Disclaimer

VentureLens is an educational and analytical evaluation tool designed for educational, research, and ideation purposes. It does not provide legal, financial, or investment advice.
