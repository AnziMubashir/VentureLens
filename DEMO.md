# VentureLens — Demo & Local Execution Guide

Welcome to **VentureLens**! This guide provides simple, baby-step instructions on how to run the application on your local machine, what the program will give you, and everything you can make it do during a demonstration.

---

## 1. Quick Start: How to Run the Program (Baby Steps)

You will need **two terminal windows** (one for the backend, one for the frontend).

### Terminal 1: Start the Backend (FastAPI)

1. Open PowerShell or Terminal.
2. Navigate to the project root folder:
   ```bash
   cd D:\SEM-5\SoftwareEngineering\VentureLens
   ```
3. Activate the Python virtual environment:
   - **On Windows (PowerShell):**
     ```powershell
     backend\.venv\Scripts\Activate.ps1
     ```
     *(If script execution is disabled on your machine, simply run `backend\.venv\Scripts\activate.bat`)*
   - **On macOS/Linux:**
     ```bash
     source backend/.venv/bin/activate
     ```
4. Start the backend server:
   ```bash
   uvicorn app.main:app --app-dir backend --reload --port 8000
   ```
5. You should see:
   ```text
   INFO: Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   ```
   *(Interactive Swagger API documentation is available at `http://127.0.0.1:8000/docs`)*

---

### Terminal 2: Start the Frontend (React + Vite)

1. Open a **second** terminal window.
2. Navigate to the `frontend` directory:
   ```bash
   cd D:\SEM-5\SoftwareEngineering\VentureLens\frontend
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. You should see:
   ```text
     VITE v5.4.21  ready in 250 ms

     ➜  Local:   http://localhost:5173/
   ```

---

### Step 3: Open the App in Your Browser

Open Chrome, Edge, or Firefox and go to:
👉 **`http://localhost:5173`**

You are now in the **VentureLens Virtual Boardroom**!

---

## 2. What You Can Make the Program Do (Walkthrough)

### Action 1: 1-Click Sample Idea Loading
- At the top of the form, you will see two pill buttons under **"Quick demo fill"**:
  - **CampusBite** (Campus Dining & Smart Lockers)
  - **DevPulse** (Developer Digest & Burnout Detection)
- Click either button. The form instantly populates with a complete, realistic venture concept (Name, Description, Problem, Target Users, Proposed Solution).
- *Alternatively, you can type in your own custom startup idea!*

### Action 2: Convene the Boardroom (Stage 1 & Stage 2)
- Click the blue button: **"Begin Multi-Agent Evaluation"**.
- Watch the **Agent Status Grid** at the top:
  - **Investor Agent**, **Technical Agent**, and **User Agent** start analyzing **in parallel**! You will see live pulsing indicators.
  - The real-time updates are streamed directly from the backend via **Server-Sent Events (SSE)** without refreshing the page.
- Once the specialists finish:
  - **Stage 1 Findings** appear below: Click through the **Investor**, **Technical**, and **User** tabs to inspect their domain evaluations.
  - **Stage 2 Initial Synthesis** appears: Read the Board Chair's executive overview, consensus areas, and **Identified Domain Tensions** (where the agents disagree!).

### Action 3: "Challenge My Idea" (Stage 3 & Stage 4)
- Look at the bottom of Stage 2. A prominent crimson banner will invite you:
  - *"Ready to Stress-Test Your Venture?"*
- Click the red button: **"Challenge My Idea"**.
- The specialists now **cross-examine each other**:
  - The Technical Agent challenges the Investor's complex enterprise billing.
  - The User Agent challenges the Investor's mandatory user verification.
  - The Investor Agent challenges the Technical Agent's deferred analytics.
- The Board Chair resolves these tensions and delivers the **Refined Analysis**:
  - Validated Strengths
  - Critical Unmitigated Risks
  - **Resolved Domain Trade-Offs** (explicitly settling the conflicts)
  - Actionable MVP Boundaries
  - Final Board Chair Executive Verdict

### Action 4: Explore the Deliverables Hub
At the bottom of the page, the **Deliverables Hub** activates with two tabs:

1. **Tab 1: Boardroom Report**
   - Read the structured executive report.
   - Click **"Copy Markdown"** to copy the full report to your clipboard.
   - Click **"Print / Save PDF"** to open your browser's print dialog (formatted cleanly via print stylesheets).
   - Click **"Download Report (.md)"** to save the `.md` file to your computer.

2. **Tab 2: Static Pitch Website**
   - Preview the generated standalone pitch website in a **live sandboxed iframe**.
   - Switch between **Desktop** and **Mobile** viewport framing.
   - Click **"Open in Tab"** to view it full-screen.
   - Click **"Download Standalone Site (.html)"** to save the presentation file.
   - *Try opening the downloaded `.html` file while disconnected from Wi-Fi — it works 100% offline because all CSS is embedded with zero CDN links!*

### Action 5: Reset for Another Evaluation
- Click the **"New Pitch"** button in the top navigation bar to reset the boardroom and test another concept.

---

## 3. What the Program Gives You (Deliverables & Outputs)

| Output | Description | Where to Find It |
|---|---|---|
| **Investor Evaluation** | Commercial viability, market size, revenue models, differentiation, and commercial risks. | Stage 1 Tab (Emerald) |
| **Technical Evaluation** | Software architecture, recommended tech stack, feasibility, MVP feature boundaries, and scaling risks. | Stage 1 Tab (Sky Blue) |
| **User UX Evaluation** | Target personas, pain point severity, user value proposition, and adoption friction barriers. | Stage 1 Tab (Violet) |
| **Initial Board Synthesis** | High-level executive summary, points of consensus, and domain tensions. | Stage 2 Card |
| **Cross-Critiques Matrix** | Direct challenges from one specialist to another with claim, concern, and suggested pivot. | Stage 3 Section |
| **Refined Board Analysis** | Final reconciled strengths, risks, resolved trade-offs, and Board Chair verdict. | Stage 4 Card |
| **Boardroom Report (`.md`)** | Comprehensive 10-section analytical Markdown audit report suitable for archiving or printing. | Deliverables Hub Tab 1 |
| **Static Pitch Website (`.html`)** | Responsive presentation website with 100% embedded CSS, zero external CDN dependencies, and offline-ready. | Deliverables Hub Tab 2 |

---

## 4. How to Switch Between Live Gemini and Demo Mock Mode

In `backend/.env`, you can change the operating mode:

```env
# OPTION A: Live AI using Google Gemini API
LLM_MODE=live
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.5-flash-lite

# OPTION B: Deterministic Mock Mode (Offline-Safe / Demo-Safe)
LLM_MODE=mock
```

> **Pro-Tip for Live University Grading:**  
> If campus Wi-Fi is unstable or you want instantaneous, 100% predictable responses without worrying about API quotas, set `LLM_MODE=mock`. The entire system runs offline with rich, pre-computed analyses while preserving the exact same multi-agent workflow!

---

## 5. Running the Automated Test Suite

To demonstrate code quality and test coverage to your professor, run:

```bash
cd D:\SEM-5\SoftwareEngineering\VentureLens
backend\.venv\Scripts\pytest.exe backend\tests
```

**Expected Result:**
```text
============================= 10 passed in 4.67s =============================
```
This proves all API endpoints, multi-agent schemas, Gemini fallback logic, Markdown reports, and HTML sanitization pass with 100% success.
