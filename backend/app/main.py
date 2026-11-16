import asyncio
import json
from typing import List
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, PlainTextResponse, StreamingResponse
from app.config import settings
from app.schemas import IdeaInput, PitchRecord, SampleIdea
from app.orchestrator import (
    create_pitch,
    get_pitch,
    list_pitches,
    run_stage1_and_stage2,
    run_challenge_and_deliverables,
    subscribe_events,
    unsubscribe_events,
)

app = FastAPI(
    title=settings.app_name,
    description="Multi-agent AI-powered idea evaluation virtual boardroom backend.",
    version="1.0.0",
)

# Enable CORS for local React / Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pre-defined lightweight sample ideas (1-2 examples)
# ---------------------------------------------------------------------------

SAMPLE_IDEAS: List[SampleIdea] = [
    SampleIdea(
        id="sample-1",
        name="CampusBite",
        description="A synchronized mobile pre-ordering and smart heated locker pickup system for university campus cafeterias.",
        problem="University students and staff waste 20-30 minutes waiting in crowded dining queues between lecture periods, resulting in missed meals and class delays.",
        target_users="Undergraduate and graduate students, faculty, and on-campus dining hall operators.",
        proposed_solution="A lightweight mobile app allowing students to order 15 minutes before class ends, with orders placed into PIN-secured heated collection cubbies.",
    ),
    SampleIdea(
        id="sample-2",
        name="DevPulse",
        description="An intelligent developer workflow digest and burnout detector for engineering leads.",
        problem="Engineering managers spend 4+ hours per week manually aggregating GitHub PR velocity, Jira bottlenecks, and after-hours commit patterns to gauge team health.",
        target_users="Software engineering managers, tech leads, and remote-first development teams.",
        proposed_solution="A passive integration that synthesizes git activity and review latency into automated weekly risk digests and capacity forecasts.",
    ),
]


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Verify backend status and active LLM operating mode."""
    return {
        "status": "ok",
        "app": settings.app_name,
        "mode": settings.llm_mode,
        "gemini_model": settings.gemini_model,
    }


@app.get("/api/samples", response_model=List[SampleIdea], tags=["Samples"])
async def get_sample_ideas():
    """Returns 1-2 curated sample venture ideas for rapid demonstration."""
    return SAMPLE_IDEAS


@app.post("/api/pitches", response_model=PitchRecord, tags=["Pitches"])
async def submit_pitch(idea: IdeaInput, background_tasks: BackgroundTasks):
    """
    Submits a new idea and kicks off Stage 1 (Specialist Analyses)
    and Stage 2 (Initial Synthesis) in the background.
    """
    record = create_pitch(idea)
    # Launch Stage 1 & 2 asynchronously
    background_tasks.add_task(run_stage1_and_stage2, record.id)
    return record


@app.get("/api/pitches", response_model=List[PitchRecord], tags=["Pitches"])
async def get_all_pitches():
    """Lists all pitches stored in memory."""
    return list_pitches()


@app.get("/api/pitches/{pitch_id}", response_model=PitchRecord, tags=["Pitches"])
async def get_pitch_by_id(pitch_id: str):
    """Retrieves full record and stage progression for a specific pitch."""
    record = get_pitch(pitch_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Pitch '{pitch_id}' not found")
    return record


@app.post("/api/pitches/{pitch_id}/challenge", response_model=PitchRecord, tags=["Pitches"])
async def trigger_challenge(pitch_id: str, background_tasks: BackgroundTasks):
    """
    Explicit user action: Launches Stage 3 (Challenge My Idea),
    Stage 4 (Final Synthesis), and compiles the deliverables.
    """
    record = get_pitch(pitch_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Pitch '{pitch_id}' not found")

    if record.status != "awaiting_challenge":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot challenge pitch in status '{record.status}'. Stage 2 must be complete first.",
        )

    # Launch Stage 3 & 4 asynchronously
    background_tasks.add_task(run_challenge_and_deliverables, record.id)
    return record


@app.get("/api/pitches/{pitch_id}/report", tags=["Deliverables"])
async def get_boardroom_report(pitch_id: str):
    """Returns the compiled Boardroom Report in Markdown format."""
    record = get_pitch(pitch_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Pitch '{pitch_id}' not found")
    if not record.boardroom_report_md:
        raise HTTPException(status_code=400, detail="Boardroom report has not been generated yet.")
    return PlainTextResponse(content=record.boardroom_report_md, media_type="text/markdown")


@app.get("/api/pitches/{pitch_id}/site", tags=["Deliverables"])
async def get_pitch_website(pitch_id: str):
    """
    Returns the standalone HTML pitch website.
    Can be previewed in an iframe or saved as a .html file.
    """
    record = get_pitch(pitch_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Pitch '{pitch_id}' not found")
    if not record.pitch_site_html:
        raise HTTPException(status_code=400, detail="Pitch website has not been compiled yet.")
    return HTMLResponse(content=record.pitch_site_html)


@app.get("/api/pitches/{pitch_id}/events", tags=["Streaming"])
async def stream_pitch_events(pitch_id: str):
    """
    Server-Sent Events (SSE) stream delivering real-time agent progression updates.
    """
    record = get_pitch(pitch_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Pitch '{pitch_id}' not found")

    queue = subscribe_events(pitch_id)

    async def event_generator():
        try:
            # Yield initial connection confirmation
            yield f"event: connected\ndata: {json.dumps({'pitch_id': pitch_id, 'status': record.status})}\n\n"
            while True:
                # Wait for next event or timeout check
                try:
                    message = await asyncio.wait_for(queue.get(), timeout=25.0)
                    yield f"event: {message['event']}\ndata: {json.dumps(message['data'])}\n\n"
                    if message["event"] in ("pipeline_completed", "pipeline_error"):
                        break
                except asyncio.TimeoutError:
                    # Keep-alive heartbeat
                    yield ": ping\n\n"
        finally:
            unsubscribe_events(pitch_id, queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
