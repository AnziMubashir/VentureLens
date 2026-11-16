import asyncio
import json
import uuid
from typing import Dict, List, Optional
from app.deliverables import (
    generate_boardroom_report_markdown,
    generate_standalone_pitch_html,
)
from app.llm import get_llm_provider
from app.schemas import (
    IdeaInput,
    PitchRecord,
    SpecialistOutputs,
    InitialSynthesis,
    ChallengeAnalysis,
    RefinedAnalysis,
    PitchContent,
)

# In-memory storage for university demonstration
PITCHES: Dict[str, PitchRecord] = {}

# Active SSE listener queues per pitch ID
SUBSCRIBERS: Dict[str, List[asyncio.Queue]] = {}


def get_pitch(pitch_id: str) -> Optional[PitchRecord]:
    """Retrieve a pitch record by ID."""
    return PITCHES.get(pitch_id)


def list_pitches() -> List[PitchRecord]:
    """List all created pitches."""
    return list(PITCHES.values())


async def publish_event(pitch_id: str, event_type: str, payload: dict):
    """Publish a real-time event to all active SSE subscribers for this pitch."""
    if pitch_id in SUBSCRIBERS:
        message = {
            "pitch_id": pitch_id,
            "event": event_type,
            "data": payload,
        }
        for queue in SUBSCRIBERS[pitch_id]:
            await queue.put(message)


def subscribe_events(pitch_id: str) -> asyncio.Queue:
    """Subscribe to events for a specific pitch ID."""
    queue = asyncio.Queue()
    if pitch_id not in SUBSCRIBERS:
        SUBSCRIBERS[pitch_id] = []
    SUBSCRIBERS[pitch_id].append(queue)
    return queue


def unsubscribe_events(pitch_id: str, queue: asyncio.Queue):
    """Unsubscribe an SSE queue."""
    if pitch_id in SUBSCRIBERS and queue in SUBSCRIBERS[pitch_id]:
        SUBSCRIBERS[pitch_id].remove(queue)
        if not SUBSCRIBERS[pitch_id]:
            del SUBSCRIBERS[pitch_id]


def create_pitch(idea: IdeaInput) -> PitchRecord:
    """Initialize a new pitch record in memory."""
    pitch_id = str(uuid.uuid4())
    record = PitchRecord(id=pitch_id, idea=idea, status="idle")
    PITCHES[pitch_id] = record
    return record


async def run_stage1_and_stage2(pitch_id: str):
    """
    Executes:
    - Stage 1: Parallel specialist evaluations (Investor, Technical, User)
    - Stage 2: Main Agent Initial Synthesis
    Leaves status at 'awaiting_challenge' for user review and explicit launch of Stage 3.
    """
    record = get_pitch(pitch_id)
    if not record:
        return

    provider = get_llm_provider()

    try:
        # --- Stage 1: Parallel Specialist Evaluations ---
        record.status = "stage1_running"
        await publish_event(pitch_id, "stage1_started", {"status": "stage1_running"})

        investor_task = provider.generate_investor_analysis(record.idea)
        technical_task = provider.generate_technical_analysis(record.idea)
        user_task = provider.generate_user_analysis(record.idea)

        investor_out, tech_out, user_out = await asyncio.gather(
            investor_task, technical_task, user_task
        )

        record.stage1_specialists = SpecialistOutputs(
            investor=investor_out,
            technical=tech_out,
            user=user_out,
        )
        record.status = "stage1_complete"
        await publish_event(pitch_id, "stage1_complete", {
            "investor": investor_out.model_dump(),
            "technical": tech_out.model_dump(),
            "user": user_out.model_dump(),
        })

        # --- Stage 2: Main Agent Initial Synthesis ---
        record.status = "stage2_running"
        await publish_event(pitch_id, "stage2_started", {"status": "stage2_running"})

        initial_synthesis = await provider.generate_initial_synthesis(
            record.idea, record.stage1_specialists
        )
        record.stage2_initial_synthesis = initial_synthesis
        record.status = "awaiting_challenge"
        await publish_event(pitch_id, "stage2_complete", {
            "initial_synthesis": initial_synthesis.model_dump(),
            "status": "awaiting_challenge",
        })

    except Exception as e:
        record.status = "failed"
        record.error = str(e)
        await publish_event(pitch_id, "pipeline_error", {"error": str(e)})


async def run_challenge_and_deliverables(pitch_id: str):
    """
    Executes:
    - Stage 3: Challenge My Idea (Cross-Critiques)
    - Stage 4: Main Agent Final Synthesis (Refined Analysis)
    - Stage 5: Boardroom Report Generation
    - Stage 6: Static Pitch Website Compilation
    """
    record = get_pitch(pitch_id)
    if not record or not record.stage1_specialists or not record.stage2_initial_synthesis:
        return

    provider = get_llm_provider()

    try:
        # --- Stage 3: Challenge My Idea ---
        record.status = "stage3_running"
        await publish_event(pitch_id, "stage3_started", {"status": "stage3_running"})

        challenge_out = await provider.generate_challenge_critiques(
            record.idea, record.stage1_specialists, record.stage2_initial_synthesis
        )
        record.stage3_challenge = challenge_out
        await publish_event(pitch_id, "stage3_complete", {
            "critiques": [c.model_dump() for c in challenge_out.critiques]
        })

        # --- Stage 4: Main Agent Final Synthesis ---
        record.status = "stage4_running"
        await publish_event(pitch_id, "stage4_started", {"status": "stage4_running"})

        refined_analysis = await provider.generate_final_synthesis(
            record.idea,
            record.stage1_specialists,
            record.stage2_initial_synthesis,
            record.stage3_challenge,
        )
        record.stage4_refined_analysis = refined_analysis

        # --- Deliverable Content Generation ---
        pitch_content = await provider.generate_pitch_content(record.idea, refined_analysis)
        record.pitch_content = pitch_content

        # Generate Boardroom Report Markdown
        record.boardroom_report_md = generate_boardroom_report_markdown(record)

        # Generate Standalone Static Pitch Website HTML
        record.pitch_site_html = generate_standalone_pitch_html(record)

        record.status = "completed"
        await publish_event(pitch_id, "pipeline_completed", {
            "status": "completed",
            "refined_analysis": refined_analysis.model_dump(),
        })

    except Exception as e:
        record.status = "failed"
        record.error = str(e)
        await publish_event(pitch_id, "pipeline_error", {"error": str(e)})
