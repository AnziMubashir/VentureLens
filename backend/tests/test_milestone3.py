import pytest
from app.deliverables import generate_boardroom_report_markdown, generate_standalone_pitch_html
from app.schemas import (
    IdeaInput,
    PitchRecord,
    SpecialistOutputs,
    InvestorAnalysis,
    TechnicalAnalysis,
    UserAnalysis,
    InitialSynthesis,
    CritiqueItem,
    ChallengeAnalysis,
    RefinedAnalysis,
    PitchContent,
    PitchFeature,
)


@pytest.fixture
def sample_completed_record():
    """Provides a fully populated PitchRecord for deliverables testing."""
    idea = IdeaInput(
        name="StudyPulse",
        description="Collaborative study analytics and burnout detection for students.",
        problem="College students suffer from chronic study burnout and fragmented exam preparation.",
        target_users="University students enrolled in intensive STEM programs.",
        proposed_solution="A focused study group sync app that monitors workload and schedules spaced repetition.",
    )
    specialists = SpecialistOutputs(
        investor=InvestorAnalysis(
            market_opportunity="High potential in higher-ed SaaS.",
            revenue_models=["Freemium student tier", "Departmental site licenses"],
            competitive_differentiation="Integrates burnout detection with active study materials.",
            commercial_risks=["High summer churn", "Low willingness to pay among undergrads"],
            recommendations=["Partner with academic success centers"],
            verdict="Commercially viable with clear B2B2C upside.",
        ),
        technical=TechnicalAnalysis(
            feasibility_assessment="Straightforward web application architecture.",
            recommended_stack=["FastAPI", "React", "PostgreSQL"],
            architecture_overview="Async REST API with background task scheduling.",
            mvp_scope=["Shared notes editor", "Burnout tracker", "Spaced review generator"],
            technical_risks=["Sync latency during concurrent note editing"],
            verdict="Technically realistic for an MVP.",
        ),
        user=UserAnalysis(
            target_personas=["Exhausted premed and engineering students"],
            core_pain_points=["Overwhelming exam cramming", "Isolation while studying"],
            user_value_proposition="Reduces study anxiety and saves 5+ hours weekly.",
            adoption_barriers=["Reluctance to install another app during exams"],
            key_user_features=["1-click study room join", "Automated flashcards"],
            verdict="Strong user pain relief and emotional resonance.",
        ),
    )
    initial_synthesis = InitialSynthesis(
        executive_summary="The board agrees StudyPulse addresses an acute student pain point but warns of summer retention dips.",
        key_agreements=["High student demand for cramming relief", "Need for immediate value in v1"],
        conflicting_perspectives=["Investor wants paid tier immediately; User urges free launch to build network"],
        cross_dependencies=["Freemium adoption dictates institutional pilot timing"],
    )
    challenge = ChallengeAnalysis(
        critiques=[
            CritiqueItem(
                source_agent="user",
                target_agent="investor",
                challenged_claim="Require credit card for 14-day trial",
                concern="Students abandon signups instantly when asked for cards",
                suggested_pivot="Offer cardless 30-day guest mode for campus email holders",
            ),
            CritiqueItem(
                source_agent="technical",
                target_agent="investor",
                challenged_claim="Build campus LMS integration in v1",
                concern="LMS APIs require lengthy university IT approval cycles",
                suggested_pivot="Launch as standalone web app first; defer LMS sync to v2",
            ),
        ]
    )
    refined = RefinedAnalysis(
        synthesized_strengths=["Direct solution for STEM burnout", "Lean async architecture"],
        critical_risks=["Academic calendar seasonality", "Undergrad payment friction"],
        trade_offs_made=[
            "Removed credit card requirement to maximize campus viral spread",
            "Deferred LMS integration to keep initial engineering scope under 6 weeks",
        ],
        refined_recommendations=["Target midterm season for campus launches", "Run weekly student feedback loops"],
        actionable_mvp=["Flashcard generator", "Study group sync", "Burnout risk widget"],
        final_chair_verdict="Approved for MVP development with strict focus on organic student adoption.",
    )
    pitch = PitchContent(
        headline="End Study Burnout. Master Your STEM Courses.",
        tagline="StudyPulse — Intelligent study group coordination and exam preparation.",
        problem_statement=idea.problem,
        solution_overview=idea.proposed_solution,
        target_audiences=["STEM Undergrads", "Pre-med cohorts", "Academic peer tutors"],
        key_features=[
            PitchFeature(title="Spaced Repetition Engine", description="Automated memory reinforcement based on cognitive science."),
            PitchFeature(title="Burnout Radar", description="Early warning indicators before academic exhaustion sets in."),
            PitchFeature(title="Live Study Pods", description="Synchronized peer accountability sessions with zero setup."),
        ],
        business_model="Free for students during semester pilots, with premium analytics add-on.",
        call_to_action="Claim Your Study Pod",
    )

    return PitchRecord(
        id="test-session-12345",
        idea=idea,
        status="completed",
        stage1_specialists=specialists,
        stage2_initial_synthesis=initial_synthesis,
        stage3_challenge=challenge,
        stage4_refined_analysis=refined,
        pitch_content=pitch,
    )


def test_boardroom_report_generation(sample_completed_record):
    """Verify the Boardroom Report Markdown contains all required analytical sections."""
    report = generate_boardroom_report_markdown(sample_completed_record)

    assert "# VentureLens Boardroom Evaluation Report" in report
    assert "StudyPulse" in report
    assert "`test-session-12345`" in report
    assert "## 1. Executive Summary" in report
    assert "## 2. Venture Foundation" in report
    assert "## 3. Initial Specialist Outlooks (Stage 1)" in report
    assert "## 4. Validated Strategic Strengths" in report
    assert "## 5. Critical Weaknesses & Risks" in report
    assert "## 6. \"Challenge My Idea\" Cross-Critiques (Stage 3)" in report
    assert "## 7. Resolved Trade-Offs & Adjustments" in report
    assert "## 8. Refined Recommendations" in report
    assert "## 9. Actionable MVP Specification" in report
    assert "## 10. Evaluation Disclaimer" in report

    # Verify specific analytical contents
    assert "STEM programs" in report or "students" in report.lower()
    assert "User Agent" in report
    assert "Deferred LMS integration" in report
    assert "Approved for MVP development" in report


def test_standalone_pitch_html_generation(sample_completed_record):
    """Verify the Pitch Website is genuinely standalone with embedded CSS and zero external links."""
    html = generate_standalone_pitch_html(sample_completed_record)

    # Standalone HTML structure
    assert "<!DOCTYPE html>" in html
    assert "<title>StudyPulse — Pitch Presentation</title>" in html
    assert "<style>" in html
    assert "VentureLens Standalone Embedded CSS" in html

    # Essential sections
    assert "End Study Burnout. Master Your STEM Courses." in html
    assert "The Problem" in html
    assert "Our Solution" in html
    assert "Core Value Drivers" in html
    assert "Spaced Repetition Engine" in html
    assert "Target Audiences" in html
    assert "Business & Monetization Model" in html
    assert "Claim Your Study Pod" in html
    assert "Evaluation Deliverable" in html

    # CRITICAL: Verify ZERO external CDN dependencies
    assert "http://" not in html
    assert "https://" not in html
    assert "<script" not in html
    assert "<link rel=\"stylesheet\"" not in html
    assert "fonts.googleapis.com" not in html
    assert "cdn." not in html


def test_xss_escaping_in_pitch_html():
    """Verify that user-supplied HTML entities are safely escaped by Jinja2."""
    idea = IdeaInput(
        name="<script>alert('pwned')</script>",
        description="Safe description",
        problem="Safe problem",
        target_users="Safe users",
        proposed_solution="Safe solution",
    )
    pitch = PitchContent(
        headline="Safe headline",
        tagline="Safe tagline",
        problem_statement="<b>Bold Problem</b>",
        solution_overview="Safe solution",
        target_audiences=["Safe audience"],
        key_features=[PitchFeature(title="Feature <1>", description="Desc & notes")],
        business_model="Free",
        call_to_action="Click <here>",
    )
    record = PitchRecord(id="test-xss", idea=idea, pitch_content=pitch)
    html = generate_standalone_pitch_html(record)

    # Script tags should be escaped, never raw
    assert "<script>alert" not in html
    assert "&lt;script&gt;alert" in html
    assert "&lt;b&gt;Bold Problem&lt;/b&gt;" in html
