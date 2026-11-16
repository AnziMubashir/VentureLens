import asyncio
import pytest
from app.config import settings
from app.llm import LLMProvider, MockProvider, GeminiProvider, get_llm_provider
from app.prompts import (
    INVESTOR_AGENT_SYSTEM_PROMPT,
    TECHNICAL_AGENT_SYSTEM_PROMPT,
    USER_AGENT_SYSTEM_PROMPT,
    CHAIR_INITIAL_SYNTHESIS_SYSTEM_PROMPT,
    CHALLENGE_CRITIQUE_SYSTEM_PROMPT,
    CHAIR_FINAL_SYNTHESIS_SYSTEM_PROMPT,
    PITCH_CONTENT_SYSTEM_PROMPT,
)
from app.schemas import IdeaInput


def test_prompts_defined_and_distinct():
    """Verify each agent has a dedicated, non-empty, and distinct system prompt."""
    prompts = [
        INVESTOR_AGENT_SYSTEM_PROMPT,
        TECHNICAL_AGENT_SYSTEM_PROMPT,
        USER_AGENT_SYSTEM_PROMPT,
        CHAIR_INITIAL_SYNTHESIS_SYSTEM_PROMPT,
        CHALLENGE_CRITIQUE_SYSTEM_PROMPT,
        CHAIR_FINAL_SYNTHESIS_SYSTEM_PROMPT,
        PITCH_CONTENT_SYSTEM_PROMPT,
    ]
    for p in prompts:
        assert isinstance(p, str)
        assert len(p.strip()) > 100

    # Ensure specialists have genuine domain separation
    assert "Investor Agent" in INVESTOR_AGENT_SYSTEM_PROMPT
    assert "monetization" in INVESTOR_AGENT_SYSTEM_PROMPT.lower()

    assert "Technical Agent" in TECHNICAL_AGENT_SYSTEM_PROMPT
    assert "architecture" in TECHNICAL_AGENT_SYSTEM_PROMPT.lower()

    assert "User Agent" in USER_AGENT_SYSTEM_PROMPT
    assert "user experience" in USER_AGENT_SYSTEM_PROMPT.lower()

    assert "Board Chair" in CHAIR_INITIAL_SYNTHESIS_SYSTEM_PROMPT
    assert "Challenge My Idea" in CHALLENGE_CRITIQUE_SYSTEM_PROMPT


def test_providers_implement_protocol():
    """Verify both MockProvider and GeminiProvider satisfy the LLMProvider protocol."""
    mock = MockProvider()
    assert isinstance(mock, LLMProvider)

    gemini = GeminiProvider(api_key="fake-test-key")
    assert isinstance(gemini, LLMProvider)


def test_provider_factory(monkeypatch):
    """Verify provider factory correctly honors LLM_MODE settings and handles missing keys."""
    # 1. Mock mode
    monkeypatch.setattr(settings, "llm_mode", "mock")
    provider = get_llm_provider()
    assert isinstance(provider, MockProvider)

    # 2. Live mode without key -> graceful fallback to MockProvider
    monkeypatch.setattr(settings, "llm_mode", "live")
    monkeypatch.setattr(settings, "gemini_api_key", None)
    provider_no_key = get_llm_provider()
    assert isinstance(provider_no_key, MockProvider)

    # 3. Live mode with key -> GeminiProvider
    monkeypatch.setattr(settings, "gemini_api_key", "test-api-key")
    provider_with_key = get_llm_provider()
    assert isinstance(provider_with_key, GeminiProvider)


def test_gemini_fallback_on_api_error(monkeypatch):
    """Verify GeminiProvider automatically falls back to deterministic mock if API call fails."""
    gemini = GeminiProvider(api_key="invalid-key")
    idea = IdeaInput(
        name="StudySync",
        description="Collaborative note-taking with AI study flashcards.",
        problem="Students struggle to organize lecture notes and create review materials before exams.",
        target_users="College students taking heavy lecture courses.",
        proposed_solution="Real-time shared editor that generates spaced-repetition flashcards.",
    )

    # Calling with invalid key should attempt twice, log error, and fall back to valid mock output without crashing
    result = asyncio.run(gemini.generate_investor_analysis(idea))
    assert result is not None
    assert result.perspective == "investor"
    assert len(result.revenue_models) > 0
    assert len(result.recommendations) > 0
