import os
from jinja2 import Environment, FileSystemLoader, select_autoescape
from app.schemas import PitchRecord


# Locate templates directory
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")
jinja_env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=select_autoescape(["html", "xml"]),
)


def generate_boardroom_report_markdown(record: PitchRecord) -> str:
    """
    Builds a comprehensive, professional Markdown document representing
    the final Boardroom Report derived directly from the Refined Analysis.
    """
    idea = record.idea
    refined = record.stage4_refined_analysis
    synthesis = record.stage2_initial_synthesis
    specialists = record.stage1_specialists
    critiques = record.stage3_challenge.critiques if record.stage3_challenge else []

    strengths = "\n".join(f"- {s}" for s in (refined.synthesized_strengths if refined else []))
    risks = "\n".join(f"- {r}" for r in (refined.critical_risks if refined else []))
    trade_offs = "\n".join(f"- {t}" for t in (refined.trade_offs_made if refined else []))
    recs = "\n".join(f"- {r}" for r in (refined.refined_recommendations if refined else []))
    mvp = "\n".join(f"- {m}" for m in (refined.actionable_mvp if refined else []))

    critique_section = ""
    for idx, c in enumerate(critiques, 1):
        critique_section += (
            f"### Challenge {idx}: {c.source_agent.capitalize()} Agent &rarr; {c.target_agent.capitalize()} Agent\n"
            f"- **Challenged Claim:** {c.challenged_claim}\n"
            f"- **Underlying Concern:** {c.concern}\n"
            f"- **Suggested Pivot:** {c.suggested_pivot}\n\n"
        )

    return f"""# VentureLens Boardroom Evaluation Report

**Venture Name:** {idea.name}  
**Evaluation Session ID:** `{record.id}`  
**Date of Evaluation:** {record.created_at}  
**Board Chair Final Verdict:** {refined.final_chair_verdict if refined else "Pending Synthesis"}

---

## 1. Executive Summary
{synthesis.executive_summary if synthesis else idea.description}

---

## 2. Venture Foundation
- **Problem Statement:** {idea.problem}
- **Target Customer / User Segment:** {idea.target_users}
- **Proposed Solution:** {idea.proposed_solution}

---

## 3. Initial Specialist Outlooks (Stage 1)
- **Investor Agent:** {specialists.investor.verdict if specialists and specialists.investor else "N/A"}
- **Technical Agent:** {specialists.technical.verdict if specialists and specialists.technical else "N/A"}
- **User Agent:** {specialists.user.verdict if specialists and specialists.user else "N/A"}

---

## 4. Validated Strategic Strengths
{strengths or "- No validated strengths recorded."}

---

## 5. Critical Weaknesses & Risks
{risks or "- No critical risks recorded."}

---

## 6. "Challenge My Idea" Cross-Critiques (Stage 3)
{critique_section or "No peer critiques recorded."}

---

## 7. Resolved Trade-Offs & Adjustments
{trade_offs or "- No trade-offs recorded."}

---

## 8. Refined Recommendations
{recs or "- No recommendations recorded."}

---

## 9. Actionable MVP Specification
The Board Chair defines the following feature boundaries for the initial build:
{mvp or "- MVP scope pending definition."}

---

## 10. Evaluation Disclaimer
*This report was automatically compiled by the VentureLens AI Boardroom for academic evaluation and venture stress-testing. It does not constitute formal financial, legal, or investment advice.*
"""


def generate_standalone_pitch_html(record: PitchRecord) -> str:
    """
    Compiles a genuinely standalone HTML pitch presentation website using Jinja2.
    Contains 100% embedded CSS with zero external CDN or font dependencies.
    """
    if not record.pitch_content:
        return "<html><body><h1>Pitch content not yet generated</h1></body></html>"

    template = jinja_env.get_template("pitch_site.html")
    return template.render(
        idea=record.idea,
        pitch=record.pitch_content,
        refined=record.stage4_refined_analysis,
    )
