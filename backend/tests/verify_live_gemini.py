import asyncio
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.config import settings
from app.llm import GeminiProvider
from app.deliverables import generate_boardroom_report_markdown, generate_standalone_pitch_html
from app.schemas import IdeaInput, SpecialistOutputs, PitchRecord


async def test_live_gemini_pipeline():
    api_key = settings.gemini_api_key
    model = settings.gemini_model
    print(f"Connecting to Live Gemini API | Model: {model} | API Key present: {bool(api_key)}")

    provider = GeminiProvider(api_key=api_key, model=model)

    idea = IdeaInput(
        name="CampusBite",
        description="A synchronized mobile pre-ordering and smart heated locker pickup system for campus dining.",
        problem="Students and staff waste 25 minutes waiting in crowded cafeteria queues between classes, causing missed meals.",
        target_users="University students, faculty, and on-campus food court vendors.",
        proposed_solution="A mobile app with automated pickup notifications when orders are placed into PIN-secured heated lockers.",
    )

    print("\n--- Running Stage 1: 3 Specialist Agents concurrently via asyncio.gather ---")
    investor_task = provider.generate_investor_analysis(idea)
    tech_task = provider.generate_technical_analysis(idea)
    user_task = provider.generate_user_analysis(idea)

    investor_out, tech_out, user_out = await asyncio.gather(
        investor_task, tech_task, user_task
    )

    specialists = SpecialistOutputs(
        investor=investor_out,
        technical=tech_out,
        user=user_out,
    )
    print("✓ Investor Verdict:", investor_out.verdict[:90], "...")
    print("✓ Technical Feasibility:", tech_out.feasibility_assessment[:90], "...")
    print("✓ User Value Proposition:", user_out.user_value_proposition[:90], "...")

    print("\n--- Running Stage 2: Main Agent Initial Synthesis ---")
    synthesis_out = await provider.generate_initial_synthesis(idea, specialists)
    print("✓ Executive Summary:", synthesis_out.executive_summary[:100], "...")
    print(f"✓ Agreements identified: {len(synthesis_out.key_agreements)}")
    print(f"✓ Conflicts identified: {len(synthesis_out.conflicting_perspectives)}")

    print("\n--- Running Stage 3: 'Challenge My Idea' Cross-Critique Round ---")
    challenge_out = await provider.generate_challenge_critiques(idea, specialists, synthesis_out)
    print(f"✓ Critiques generated: {len(challenge_out.critiques)}")
    for idx, c in enumerate(challenge_out.critiques, 1):
        print(f"   [{idx}] {c.source_agent.capitalize()} challenged {c.target_agent.capitalize()}: {c.challenged_claim[:60]}...")

    print("\n--- Running Stage 4: Main Agent Final Synthesis (Refined Analysis) ---")
    refined_out = await provider.generate_final_synthesis(idea, specialists, synthesis_out, challenge_out)
    print("✓ Final Chair Verdict:", refined_out.final_chair_verdict[:90], "...")
    print(f"✓ Resolved Trade-Offs: {len(refined_out.trade_offs_made)}")
    print(f"✓ Actionable MVP Features: {len(refined_out.actionable_mvp)}")

    print("\n--- Generating Deliverables (Milestone 3) ---")
    pitch_content = await provider.generate_pitch_content(idea, refined_out)

    record = PitchRecord(
        id="live-gemini-demo",
        idea=idea,
        status="completed",
        stage1_specialists=specialists,
        stage2_initial_synthesis=synthesis_out,
        stage3_challenge=challenge_out,
        stage4_refined_analysis=refined_out,
        pitch_content=pitch_content,
    )

    report_md = generate_boardroom_report_markdown(record)
    site_html = generate_standalone_pitch_html(record)

    print(f"✓ Boardroom Report Markdown generated: {len(report_md)} bytes")
    print(f"✓ Standalone HTML Pitch Website compiled: {len(site_html)} bytes")
    print("✓ Standalone check (no external CSS/JS links):", ("http://" not in site_html and "https://" not in site_html))
    print("\n>>> LIVE GEMINI MULTI-AGENT PIPELINE AND DELIVERABLES TEST PASSED! <<<")


if __name__ == "__main__":
    asyncio.run(test_live_gemini_pipeline())
