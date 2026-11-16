import asyncio
import pytest
from fastapi.testclient import TestClient
from app.config import settings
from app.main import app
from app.orchestrator import run_stage1_and_stage2, run_challenge_and_deliverables, PITCHES


client = TestClient(app)


def test_health_check():
    """Verify health endpoint returns status ok and mode."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["mode"] in ("mock", "live")


def test_get_samples():
    """Verify samples endpoint returns lightweight pre-configured ideas."""
    response = client.get("/api/samples")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) >= 1
    assert samples[0]["name"] == "CampusBite"


def test_full_pipeline_mock_execution(monkeypatch):
    """Test full multi-agent workflow deterministically using mock mode."""
    monkeypatch.setattr(settings, "llm_mode", "mock")
    # 1. Submit an idea
    payload = {
        "name": "EcoRoute",
        "description": "Smart route optimization for urban electric bicycle delivery couriers.",
        "problem": "Couriers deplete battery rapidly and encounter steep terrain, cutting shift earnings by 30%.",
        "target_users": "Gig economy delivery couriers using e-bikes in hilly metropolitan areas.",
        "proposed_solution": "An altitude-aware and battery-conserving navigation app with dynamic rerouting.",
    }
    response = client.post("/api/pitches", json=payload)
    assert response.status_code == 200
    pitch = response.json()
    pitch_id = pitch["id"]
    assert pitch["status"] in ("idle", "stage1_running")

    # 2. Wait for Stage 1 & 2 to complete (async background task)
    asyncio.run(run_stage1_and_stage2(pitch_id))

    # Check status
    response = client.get(f"/api/pitches/{pitch_id}")
    assert response.status_code == 200
    record = response.json()
    assert record["status"] == "awaiting_challenge"
    assert record["stage1_specialists"]["investor"] is not None
    assert record["stage1_specialists"]["technical"] is not None
    assert record["stage1_specialists"]["user"] is not None
    assert record["stage2_initial_synthesis"] is not None

    # 3. Explicitly launch Stage 3 (Challenge My Idea)
    challenge_resp = client.post(f"/api/pitches/{pitch_id}/challenge")
    assert challenge_resp.status_code == 200

    # Wait for Stage 3 & 4 and deliverables compilation
    asyncio.run(run_challenge_and_deliverables(pitch_id))

    # 4. Check completed status
    response = client.get(f"/api/pitches/{pitch_id}")
    assert response.status_code == 200
    completed_record = response.json()
    assert completed_record["status"] == "completed"
    assert len(completed_record["stage3_challenge"]["critiques"]) > 0
    assert completed_record["stage4_refined_analysis"] is not None
    assert completed_record["pitch_content"] is not None

    # 5. Fetch Boardroom Report
    report_resp = client.get(f"/api/pitches/{pitch_id}/report")
    assert report_resp.status_code == 200
    assert "# VentureLens Boardroom Evaluation Report" in report_resp.text
    assert "EcoRoute" in report_resp.text
    assert "Challenge My Idea" in report_resp.text

    # 6. Fetch Standalone Pitch Website
    site_resp = client.get(f"/api/pitches/{pitch_id}/site")
    assert site_resp.status_code == 200
    assert "<!DOCTYPE html>" in site_resp.text
    assert "Standalone Embedded CSS" in site_resp.text
    assert "EcoRoute" in site_resp.text
