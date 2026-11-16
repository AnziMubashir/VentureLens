# VentureLens: UI/UX Design Specification

**Document Version:** 1.0.0  
**Design Standard:** Professional SaaS Virtual Boardroom  
**Core Aesthetic:** Calm, Modern, Intelligent, Trustworthy  

---

## 1. Design Philosophy & Visual Identity

### 1.1 Guiding Principles
VentureLens is designed as an executive virtual boardroom. It avoids the chaotic, cluttered visual tropes of generic AI dashboards (excessive neon gradients, gimmicky glassmorphism, floating decorative particles, or ungrounded numeric dials).

Instead, the interface embodies:
- **Calm Authority:** Muted, purposeful slate backgrounds with crisp content cards and generous whitespace.
- **Cognitive Clarity:** The multi-agent workflow is rendered transparently. The user always knows which agent is analyzing, what claims are being challenged, and how trade-offs are reconciled.
- **Immediate Legibility:** Clean typography hierarchy, explicit visual badges for each agent domain, and intuitive stage transitions.

### 1.2 Evaluation Standard (The 3 Questions)
Every screen and component in VentureLens is designed to satisfy three strict benchmarks:
1. **5-Second Comprehension:** Can a first-time user understand what this screen represents within five seconds?
2. **3-Second Actionability:** Can the user identify the primary next action within three seconds?
3. **Professional SaaS Feel:** Does the experience feel comparable to Linear, Stripe, or Vercel rather than a student class assignment?

---

## 2. Color System & Design Tokens

| Role | Color Name | Hex Code | Purpose / Usage |
|---|---|---|---|
| **Primary Base** | Deep Slate | `#0f172a` (Slate 900) | Top navigation header, primary text headers, high-contrast accents. |
| **Canvas Background** | Slate Clean | `#f8fafc` (Slate 50) | Main page backdrop, providing soft contrast against pure white cards. |
| **Card Surface** | Pure White | `#ffffff` | Content cards, form inputs, modal dialogs. |
| **Border & Divider** | Slate Border | `#e2e8f0` (Slate 200) | Subtle card borders, dividers, and structural separation. |
| **Primary Action** | Royal Blue | `#2563eb` (Blue 600) | Primary CTA buttons, active state indicators. Hover: `#1d4ed8` (Blue 700). |
| **Investor Domain** | Emerald | `#059669` (Emerald 600) | Investor Agent badges, commercial outlooks, financial metrics. |
| **Technical Domain** | Sky Blue | `#0284c7` (Sky 600) | Technical Agent badges, architectural tags, feasibility indicators. |
| **User Domain** | Purple / Violet | `#7c3aed` (Violet 600) | User Agent badges, UX considerations, persona insights. |
| **Board Chair Domain** | Indigo | `#4f46e5` (Indigo 600) | Board Chair orchestrator badges, executive syntheses, final verdicts. |
| **Conflict & Challenge** | Crimson | `#dc2626` (Red 600) | Challenge My Idea critique badges, critical risks, challenged claims. |
| **Tension & Warning** | Amber | `#d97706` (Amber 600) | Disagreements, trade-offs, onboarding friction warnings. |
| **Text Primary** | Dark Slate | `#0f172a` (Slate 900) | High-contrast body text, headings. |
| **Text Secondary** | Muted Slate | `#475569` (Slate 600) | Explanatory labels, card body paragraphs. |
| **Text Muted** | Subtle Slate | `#94a3b8` (Slate 400) | Timestamps, metadata, footnotes, disclaimers. |

---

## 3. Typography System

The application relies on a modern, ultra-reliable system font stack to ensure instantaneous font rendering with zero web font latency:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Hierarchy & Scales
- **Display H1 (Hero Title):** `2.25rem` (36px), `font-bold` (700), `letter-spacing: -0.025em`.
- **Page H2 (Section Title):** `1.5rem` (24px), `font-bold` (700), `letter-spacing: -0.02em`.
- **Card H3 (Component Header):** `1.125rem` (18px), `font-semibold` (600).
- **Sub-header / Lead Text:** `1rem` (16px), `font-normal` (400), `text-slate-600`, `line-height: 1.5`.
- **Body Text:** `0.9375rem` (15px), `font-normal` (400), `text-slate-700`, `line-height: 1.6`.
- **Badge / Microcopy:** `0.75rem` (12px), `font-semibold` (600), `uppercase`, `letter-spacing: 0.05em`.

---

## 4. Component Design Specifications

### 4.1 Buttons
- **Primary Action Button:** Solid `#2563eb` with white text, `px-5 py-2.5`, `rounded-lg`, subtle shadow `shadow-sm`. Hover: `#1d4ed8` with `transition-all`.
- **Challenge Action Button:** Large accent button `#dc2626` (Red 600) with white text, prominent flame/spark icon, indicating a deliberate stress-testing phase.
- **Secondary / Outline Button:** Border `#e2e8f0`, white background, slate text `#334155`. Hover: `#f1f5f9`.
- **Sample Loader Buttons:** Compact pill buttons with a subtle spark icon (`bg-blue-50 text-blue-700 hover:bg-blue-100`).

### 4.2 Form Inputs
- Clear floating labels, placeholder text, and subtle focus states (`focus:ring-2 focus:ring-blue-500 focus:border-blue-500`).
- Character counters where appropriate to prevent truncated submissions.

### 4.3 Agent Status Cards
Four distinct cards representing the virtual boardroom members:
- **Header:** Agent avatar / domain icon + Persona Name + Domain Tag.
- **Status Badge:**
  - `idle`: Gray pill ("Waiting").
  - `analyzing`: Pulsing blue/amber ring with animated spinner ("Analyzing...").
  - `complete`: Green checkmark ("Evaluation Complete").
- **Key Verdict Callout:** Highlighting the agent's core outlook once complete.

### 4.4 Challenge My Idea Critique Cards
- Side-by-side comparative layout.
- Clear arrow indicator: `[Source Agent] -> Challenges -> [Target Agent]`.
- Distinct colored subsections for **Challenged Claim**, **Underlying Concern**, and **Suggested Pivot**.

---

## 5. Screen-by-Screen User Flows

### Screen 1: Idea Submission & Sample Fill
- **Top:** Header with VentureLens logo, tagline, and active mode pill (`Demo Mock` or `Live Gemini`).
- **Hero:** Clean explanation of the virtual boardroom process.
- **Action Strip:** "Need inspiration? Load sample idea: [CampusBite (Campus Dining)] [DevPulse (Developer Tool)]".
- **Form Card:** Clean single-column layout for Idea Name, Description, Problem, Target Users, and Proposed Solution.
- **Primary CTA:** "Convene the Boardroom" (Blue, 3-second actionability).

### Screen 2: Boardroom Session & Live Analysis (Stage 1 & 2)
- Real-time SSE progress indicators for Investor, Technical, and User agents.
- As each specialist completes, their card displays key findings (Market, Feasibility, UX).
- Once all three finish, the **Board Chair Initial Synthesis** renders with Executive Summary, Consensus points, and Conflicting Perspectives.

### Screen 3: "Challenge My Idea" Action Checkpoint
- Prominent callout card highlighting conflicting recommendations.
- Explanatory copy: *"The specialists disagree on several key assumptions. Authorize the challenge stage to stress-test these findings."*
- **Primary CTA:** "Challenge My Idea" (Red/Crimson button).

### Screen 4: Challenge Matrix & Refined Synthesis (Stage 3 & 4)
- Displays peer cross-critiques in a clean matrix.
- Displays the Board Chair's **Refined Analysis** detailing resolved trade-offs and the final verdict.

### Screen 5: Dual Deliverables Hub
- **Tab 1: Boardroom Report:**
  - Formatted Markdown viewer with copy and download button (`.md` export).
  - Print button (`window.print()` formatted via `@media print`).
- **Tab 2: Static Pitch Website:**
  - Sandboxed `<iframe>` preview of the compiled presentation website.
  - Direct download button for the standalone `.html` file.
  - Device toggle for Desktop / Mobile preview framing.

---

## 6. Design System Anti-Patterns (What to Avoid)
- NO gratuitous gradients across the entire canvas.
- NO illegible white text on light gray cards.
- NO arbitrary numeric rating circles (e.g. "82/100 Viability") that mislead founders.
- NO simulated loading bars with arbitrary countdown timers (all transitions map to actual SSE events).
