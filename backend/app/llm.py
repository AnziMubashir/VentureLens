import asyncio
import logging
from typing import Protocol, Type, TypeVar, runtime_checkable
from pydantic import BaseModel
from google import genai
from google.genai import types

from app.config import settings
from app.prompts import (
    INVESTOR_AGENT_SYSTEM_PROMPT,
    TECHNICAL_AGENT_SYSTEM_PROMPT,
    USER_AGENT_SYSTEM_PROMPT,
    CHAIR_INITIAL_SYNTHESIS_SYSTEM_PROMPT,
    CHALLENGE_CRITIQUE_SYSTEM_PROMPT,
    CHAIR_FINAL_SYNTHESIS_SYSTEM_PROMPT,
    PITCH_CONTENT_SYSTEM_PROMPT,
)
from app.schemas import (
    IdeaInput,
    InvestorAnalysis,
    TechnicalAnalysis,
    UserAnalysis,
    SpecialistOutputs,
    InitialSynthesis,
    CritiqueItem,
    ChallengeAnalysis,
    RefinedAnalysis,
    PitchContent,
    PitchFeature,
)

logger = logging.getLogger(__name__)
T = TypeVar("T", bound=BaseModel)


# ---------------------------------------------------------------------------
# Provider Interface
# ---------------------------------------------------------------------------

@runtime_checkable
class LLMProvider(Protocol):
    """Protocol defining the interface for LLM operations across all pipeline stages."""

    async def generate_investor_analysis(self, idea: IdeaInput) -> InvestorAnalysis: ...
    async def generate_technical_analysis(self, idea: IdeaInput) -> TechnicalAnalysis: ...
    async def generate_user_analysis(self, idea: IdeaInput) -> UserAnalysis: ...
    async def generate_initial_synthesis(
        self, idea: IdeaInput, specialists: SpecialistOutputs
    ) -> InitialSynthesis: ...
    async def generate_challenge_critiques(
        self, idea: IdeaInput, specialists: SpecialistOutputs, initial_synthesis: InitialSynthesis
    ) -> ChallengeAnalysis: ...
    async def generate_final_synthesis(
        self,
        idea: IdeaInput,
        specialists: SpecialistOutputs,
        initial_synthesis: InitialSynthesis,
        challenge: ChallengeAnalysis,
    ) -> RefinedAnalysis: ...
    async def generate_pitch_content(
        self, idea: IdeaInput, refined: RefinedAnalysis
    ) -> PitchContent: ...


# ---------------------------------------------------------------------------
# Deterministic Mock Provider (Zero-quota, offline demo)
# ---------------------------------------------------------------------------

class MockProvider:
    """
    Deterministic mock provider ensuring the complete multi-agent workflow
    runs reliably offline with zero quota consumption and zero API key dependency.
    """

    async def generate_investor_analysis(self, idea: IdeaInput) -> InvestorAnalysis:
        await asyncio.sleep(0.2)
        return InvestorAnalysis(
            market_opportunity=f"Strong addressable market targeting {idea.target_users}. Initial segment shows favorable willingness-to-pay dynamics.",
            revenue_models=[
                "B2B SaaS tiered subscription model",
                "Transaction-based platform fee (3-5%)",
                "Enterprise compliance and reporting add-ons",
            ],
            competitive_differentiation=f"Direct focus on {idea.problem} provides a narrower, more defensible wedge than legacy generalist competitors.",
            commercial_risks=[
                "Customer acquisition cost (CAC) inflation in competitive ad channels",
                "Sales cycle elongation in mid-market accounts",
                "Retention risks if initial time-to-value exceeds 14 days",
            ],
            recommendations=[
                "Validate willingness-to-pay via 15 targeted pre-sales interviews",
                "Begin with single self-serve tier before introducing enterprise contracts",
                "Establish clear referral and expansion loops early",
            ],
            verdict="Commercially viable with clear monetization paths, provided early sales friction is mitigated.",
        )

    async def generate_technical_analysis(self, idea: IdeaInput) -> TechnicalAnalysis:
        await asyncio.sleep(0.2)
        return TechnicalAnalysis(
            feasibility_assessment=f"High technical feasibility using established web and cloud architectures for '{idea.name}'.",
            recommended_stack=[
                "Frontend: React with TypeScript and Tailwind CSS",
                "Backend: Python FastAPI with asynchronous execution",
                "Storage: PostgreSQL for relational data + Redis for caching",
                "Infrastructure: Containerized micro-service deployed via Docker",
            ],
            architecture_overview="Modular service architecture with async task queues for long-running processes, protected by JWT authentication and rate limiting.",
            mvp_scope=[
                "Core workflow for primary user persona",
                "Basic reporting and export capability",
                "Admin dashboard for usage analytics",
            ],
            technical_risks=[
                "Data synchronization complexity under concurrent writes",
                "Third-party API rate limits and upstream latency",
                "GDPR / data privacy compliance for user-submitted content",
            ],
            verdict="Technically sound and practical to build as an MVP within standard semester project timelines.",
        )

    async def generate_user_analysis(self, idea: IdeaInput) -> UserAnalysis:
        await asyncio.sleep(0.2)
        return UserAnalysis(
            target_personas=[
                f"Primary: Everyday {idea.target_users} experiencing daily friction",
                "Secondary: Team leads and coordinators seeking visibility",
            ],
            core_pain_points=[
                f"Severe workflow disruption caused by {idea.problem}",
                "Existing solutions are overly complex, fragmented, or expensive",
                "Lack of actionable guidance and real-time feedback",
            ],
            user_value_proposition=f"Provides an intuitive, calm interface that solves {idea.problem} without requiring extensive training.",
            adoption_barriers=[
                "Habit inertia and reluctance to adopt another tool",
                "Onboarding friction if setup requires manual configuration",
                "Perceived data security concerns during initial sign-up",
            ],
            key_user_features=[
                "Zero-configuration quick-start flow",
                "Clear progress indicators and contextual explanations",
                "One-click export and sharing options",
            ],
            verdict="High user appeal with immediate pain relief, provided onboarding friction is kept near zero.",
        )

    async def generate_initial_synthesis(
        self, idea: IdeaInput, specialists: SpecialistOutputs
    ) -> InitialSynthesis:
        await asyncio.sleep(0.2)
        return InitialSynthesis(
            executive_summary=f"The board has evaluated '{idea.name}'. While all specialists agree on the acute pain point ({idea.problem}), key tensions exist between commercial monetization timelines and technical simplicity.",
            key_agreements=[
                f"Unanimous agreement that {idea.target_users} are underserved by current market offerings.",
                "Consensus that the MVP must be strictly scoped to the primary workflow to avoid delay.",
                "Agreement that user trust and low onboarding friction are critical for early adoption.",
            ],
            conflicting_perspectives=[
                "Investor prioritizes multi-tier monetized features immediately; Technical urges a simple free MVP to avoid premature architecture complexity.",
                "Investor recommends mandatory verification; User warns that extra verification steps will inflate bounce rates.",
            ],
            cross_dependencies=[
                "Technical stack selection directly dictates hosting and operational cost, influencing subscription margins.",
                "User adoption rates directly constrain the timing of transaction-fee revenue models.",
            ],
        )

    async def generate_challenge_critiques(
        self, idea: IdeaInput, specialists: SpecialistOutputs, initial_synthesis: InitialSynthesis
    ) -> ChallengeAnalysis:
        await asyncio.sleep(0.2)
        return ChallengeAnalysis(
            critiques=[
                CritiqueItem(
                    source_agent="technical",
                    target_agent="investor",
                    challenged_claim="Immediate enterprise-grade compliance and multi-tenant billing in v1.",
                    concern="Building complex enterprise billing and role-based permissions will double MVP development time and introduce severe security audit overhead.",
                    suggested_pivot="Launch MVP with a single Stripe checkout tier; defer custom enterprise billing to v2 post-traction.",
                ),
                CritiqueItem(
                    source_agent="user",
                    target_agent="investor",
                    challenged_claim="Mandatory identity verification before users can test the core solution.",
                    concern="Users exploring early-stage tools abandon sign-up when hit with immediate identity or payment walls.",
                    suggested_pivot="Offer a friction-free guest demo mode; gate only persistent exports and saved sessions behind registration.",
                ),
                CritiqueItem(
                    source_agent="investor",
                    target_agent="technical",
                    challenged_claim="Deferred analytics dashboard to post-MVP phase.",
                    concern="Without basic retention and cohort tracking from day one, we cannot prove market traction or justify further development.",
                    suggested_pivot="Incorporate a lightweight telemetry tool (e.g. PostHog or simple event logging) into the initial MVP launch.",
                ),
            ]
        )

    async def generate_final_synthesis(
        self,
        idea: IdeaInput,
        specialists: SpecialistOutputs,
        initial_synthesis: InitialSynthesis,
        challenge: ChallengeAnalysis,
    ) -> RefinedAnalysis:
        await asyncio.sleep(0.2)
        return RefinedAnalysis(
            synthesized_strengths=[
                f"Focused solution specifically answering {idea.problem} for {idea.target_users}.",
                "Lean, manageable technical architecture using modern async standards.",
                "Clear path from free exploration to self-serve monetization.",
            ],
            critical_risks=[
                "Early customer churn if the core user onboarding path requires manual setup.",
                "Over-engineering the product before confirming recurring user habits.",
            ],
            trade_offs_made=[
                "Trade-off 1: Replaced immediate complex enterprise billing with a simple self-serve checkout to preserve technical launch velocity.",
                "Trade-off 2: Removed mandatory up-front verification in favor of a low-friction trial flow to maximize user conversion.",
                "Trade-off 3: Added lightweight usage telemetry to the MVP to satisfy investor validation needs without burdening engineering.",
            ],
            refined_recommendations=[
                "Proceed with a focused 6-week MVP build centered strictly on the primary problem flow.",
                "Conduct 10 weekly user testing sessions with target users using the prototype.",
                "Track weekly active usage as the primary north-star metric prior to monetizing.",
            ],
            actionable_mvp=[
                "Streamlined idea input and evaluation interface",
                "Core algorithmic workflow resolving user problem",
                "One-click report generation and standalone site export",
                "Lightweight usage telemetry (Deferred: enterprise SSO, team billing, multi-tenancy)",
            ],
            final_chair_verdict=f"Approved for MVP development. '{idea.name}' demonstrates strong fundamentals once early onboarding friction and premature monetization complexity are eliminated.",
        )

    async def generate_pitch_content(
        self, idea: IdeaInput, refined: RefinedAnalysis
    ) -> PitchContent:
        await asyncio.sleep(0.2)
        return PitchContent(
            headline=f"Transforming How {idea.target_users} Solve {idea.problem}",
            tagline=f"{idea.name} — Clear, reliable, and intelligent execution.",
            problem_statement=idea.problem,
            solution_overview=idea.proposed_solution,
            target_audiences=[idea.target_users, "Early-stage innovators", "Product leaders"],
            key_features=[
                PitchFeature(title="Intelligent Analysis", description="Multi-perspective evaluation stress-tested across business, tech, and user domains."),
                PitchFeature(title="Actionable Scoping", description="Clear MVP boundary definition preventing premature over-engineering."),
                PitchFeature(title="Zero-Friction Access", description="Immediate value delivery without cumbersome configuration or setup walls."),
            ],
            business_model="Freemium entry tier with transparent monthly subscription for active professionals.",
            call_to_action="Start Exploring Today",
        )


# ---------------------------------------------------------------------------
# Live Gemini Provider (Google GenAI SDK)
# ---------------------------------------------------------------------------

class GeminiProvider:
    """
    Live provider using the official Google GenAI SDK with structured Pydantic output.
    Includes single-retry logic and automatic graceful fallback to MockProvider
    in case of quota exhaustion or upstream network failures.
    """

    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        self.client = genai.Client(api_key=api_key)
        self.model = model
        self.fallback = MockProvider()

    async def _generate_structured(
        self,
        system_instruction: str,
        user_prompt: str,
        schema_cls: Type[T],
        fallback_fn,
    ) -> T:
        """Helper to invoke Gemini with schema enforcement and single retry."""
        for attempt in range(2):
            try:
                response = await self.client.aio.models.generate_content(
                    model=self.model,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        response_mime_type="application/json",
                        response_schema=schema_cls,
                        temperature=0.7,
                    ),
                )
                if response.text:
                    return schema_cls.model_validate_json(response.text)
                raise ValueError("Empty response received from Gemini API.")
            except Exception as e:
                logger.warning(
                    f"Gemini API attempt {attempt + 1} for schema {schema_cls.__name__} failed: {e}"
                )
                if attempt == 0:
                    await asyncio.sleep(1.0)
                    continue

        # If both attempts fail (e.g. rate limit, quota, network drop), fall back gracefully
        logger.error(
            f"Gemini API calls exhausted for {schema_cls.__name__}. Gracefully activating fallback mock output."
        )
        return await fallback_fn()

    async def generate_investor_analysis(self, idea: IdeaInput) -> InvestorAnalysis:
        user_prompt = f"""Venture Idea: {idea.name}
Description: {idea.description}
Problem Addressed: {idea.problem}
Target Users: {idea.target_users}
Proposed Solution: {idea.proposed_solution}

Evaluate this venture from an investor perspective. Assess the commercial opportunity, revenue models, competitive differentiation, commercial risks, actionable business recommendations, and overall verdict."""

        return await self._generate_structured(
            system_instruction=INVESTOR_AGENT_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            schema_cls=InvestorAnalysis,
            fallback_fn=lambda: self.fallback.generate_investor_analysis(idea),
        )

    async def generate_technical_analysis(self, idea: IdeaInput) -> TechnicalAnalysis:
        user_prompt = f"""Venture Idea: {idea.name}
Description: {idea.description}
Problem Addressed: {idea.problem}
Target Users: {idea.target_users}
Proposed Solution: {idea.proposed_solution}

Evaluate this venture from a software engineering perspective. Assess technical feasibility, recommended technology stack, architecture overview, MVP feature scope, technical risks, and overall verdict."""

        return await self._generate_structured(
            system_instruction=TECHNICAL_AGENT_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            schema_cls=TechnicalAnalysis,
            fallback_fn=lambda: self.fallback.generate_technical_analysis(idea),
        )

    async def generate_user_analysis(self, idea: IdeaInput) -> UserAnalysis:
        user_prompt = f"""Venture Idea: {idea.name}
Description: {idea.description}
Problem Addressed: {idea.problem}
Target Users: {idea.target_users}
Proposed Solution: {idea.proposed_solution}

Evaluate this venture from a user experience perspective. Assess target personas, core pain points, user value proposition, adoption barriers, essential user-facing features, and overall verdict."""

        return await self._generate_structured(
            system_instruction=USER_AGENT_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            schema_cls=UserAnalysis,
            fallback_fn=lambda: self.fallback.generate_user_analysis(idea),
        )

    async def generate_initial_synthesis(
        self, idea: IdeaInput, specialists: SpecialistOutputs
    ) -> InitialSynthesis:
        user_prompt = f"""Venture: {idea.name}
Problem: {idea.problem}
Solution: {idea.proposed_solution}

--- Specialist Agent Findings ---
Investor Agent:
{specialists.investor.model_dump_json(indent=2) if specialists.investor else 'None'}

Technical Agent:
{specialists.technical.model_dump_json(indent=2) if specialists.technical else 'None'}

User Agent:
{specialists.user.model_dump_json(indent=2) if specialists.user else 'None'}

Synthesize an Executive Summary, key consensus points, conflicting recommendations/priorities, and cross-domain dependencies."""

        return await self._generate_structured(
            system_instruction=CHAIR_INITIAL_SYNTHESIS_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            schema_cls=InitialSynthesis,
            fallback_fn=lambda: self.fallback.generate_initial_synthesis(idea, specialists),
        )

    async def generate_challenge_critiques(
        self, idea: IdeaInput, specialists: SpecialistOutputs, initial_synthesis: InitialSynthesis
    ) -> ChallengeAnalysis:
        user_prompt = f"""Venture: {idea.name}

Specialist Evaluations:
Investor: {specialists.investor.model_dump_json() if specialists.investor else 'None'}
Technical: {specialists.technical.model_dump_json() if specialists.technical else 'None'}
User: {specialists.user.model_dump_json() if specialists.user else 'None'}

Initial Board Synthesis:
{initial_synthesis.model_dump_json()}

Execute the 'Challenge My Idea' cross-critique stage. Identify 3-4 incisive challenges where one specialist challenges another specialist's assumptions, costs, friction, or risks."""

        return await self._generate_structured(
            system_instruction=CHALLENGE_CRITIQUE_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            schema_cls=ChallengeAnalysis,
            fallback_fn=lambda: self.fallback.generate_challenge_critiques(
                idea, specialists, initial_synthesis
            ),
        )

    async def generate_final_synthesis(
        self,
        idea: IdeaInput,
        specialists: SpecialistOutputs,
        initial_synthesis: InitialSynthesis,
        challenge: ChallengeAnalysis,
    ) -> RefinedAnalysis:
        user_prompt = f"""Venture: {idea.name} ({idea.problem})

Initial Specialist Verdicts:
- Investor: {specialists.investor.verdict if specialists.investor else 'N/A'}
- Technical: {specialists.technical.verdict if specialists.technical else 'N/A'}
- User: {specialists.user.verdict if specialists.user else 'N/A'}

Cross-Critiques from 'Challenge My Idea' Stage:
{challenge.model_dump_json(indent=2)}

Deliver the final Refined Analysis: synthesized strengths, critical unmitigated risks, explicit trade-offs resolved, refined recommendations, actionable MVP scope, and decisive closing Board Chair verdict."""

        return await self._generate_structured(
            system_instruction=CHAIR_FINAL_SYNTHESIS_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            schema_cls=RefinedAnalysis,
            fallback_fn=lambda: self.fallback.generate_final_synthesis(
                idea, specialists, initial_synthesis, challenge
            ),
        )

    async def generate_pitch_content(
        self, idea: IdeaInput, refined: RefinedAnalysis
    ) -> PitchContent:
        user_prompt = f"""Venture: {idea.name}
Problem: {idea.problem}
Solution: {idea.proposed_solution}
Target Users: {idea.target_users}

Refined Boardroom Analysis:
{refined.model_dump_json(indent=2)}

Generate presentation copy for the standalone pitch website including headline, tagline, problem statement, solution overview, target audiences, core feature cards, business model, and call to action."""

        return await self._generate_structured(
            system_instruction=PITCH_CONTENT_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            schema_cls=PitchContent,
            fallback_fn=lambda: self.fallback.generate_pitch_content(idea, refined),
        )


# ---------------------------------------------------------------------------
# Factory Function
# ---------------------------------------------------------------------------

def get_llm_provider() -> LLMProvider:
    """Returns the configured LLM provider based on settings."""
    if settings.llm_mode.lower() == "live":
        if settings.gemini_api_key:
            return GeminiProvider(api_key=settings.gemini_api_key, model=settings.gemini_model)
        logger.warning(
            "LLM_MODE is set to 'live' but GEMINI_API_KEY is not configured. Falling back to MockProvider."
        )
    return MockProvider()
