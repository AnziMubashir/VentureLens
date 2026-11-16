import time
import httpx

FRONTEND_URL = "http://localhost:5173"

def run_e2e_test():
    print(f"Connecting to Vite frontend server at {FRONTEND_URL}...")
    client = httpx.Client(base_url=FRONTEND_URL, timeout=30.0)

    # 1. Test frontend HTML serving
    res = client.get("/")
    assert res.status_code == 200, f"Expected 200 from frontend, got {res.status_code}"
    assert "VentureLens" in res.text, "VentureLens title missing from frontend HTML"
    print("✓ Frontend HTML served successfully on port 5173")

    # 2. Test Vite Proxy to Backend /api/health
    health_res = client.get("/api/health")
    assert health_res.status_code == 200, f"Expected 200 from proxied health, got {health_res.status_code}"
    health_data = health_res.json()
    print(f"✓ Proxied API Health Check: Status={health_data['status']}, Mode={health_data['mode']}")

    # 3. Test Vite Proxy to /api/samples
    samples_res = client.get("/api/samples")
    assert samples_res.status_code == 200
    samples = samples_res.json()
    assert len(samples) == 2
    print(f"✓ Proxied Sample Ideas: Retrieved {len(samples)} samples: {[s['name'] for s in samples]}")

    # 4. Test Pitch Submission through Proxy
    sample = samples[0] # CampusBite
    payload = {
        "name": sample["name"],
        "description": sample["description"],
        "problem": sample["problem"],
        "target_users": sample["target_users"],
        "proposed_solution": sample["proposed_solution"],
    }
    submit_res = client.post("/api/pitches", json=payload)
    assert submit_res.status_code == 200
    pitch = submit_res.json()
    pitch_id = pitch["id"]
    print(f"✓ Pitch Submitted via Proxy: ID={pitch_id}, Initial Status={pitch['status']}")

    # 5. Poll until Stage 2 completes (status='awaiting_challenge')
    print("Waiting for Stage 1 & 2 execution...")
    for _ in range(30):
        time.sleep(1.0)
        p_res = client.get(f"/api/pitches/{pitch_id}")
        p = p_res.json()
        if p["status"] == "awaiting_challenge":
            break

    assert p["status"] == "awaiting_challenge", f"Expected 'awaiting_challenge', got {p['status']}"
    assert p["stage1_specialists"]["investor"] is not None
    assert p["stage1_specialists"]["technical"] is not None
    assert p["stage1_specialists"]["user"] is not None
    assert p["stage2_initial_synthesis"] is not None
    print("✓ Stage 1 & 2 Complete: Specialist findings and Board Chair Initial Synthesis verified")
    print(f"   Executive Summary: {p['stage2_initial_synthesis']['executive_summary'][:80]}...")

    # 6. User clicks 'Challenge My Idea'
    print("Simulating user action: Triggering 'Challenge My Idea' via proxy...")
    chal_res = client.post(f"/api/pitches/{pitch_id}/challenge")
    assert chal_res.status_code == 200
    print("✓ Challenge Action Triggered successfully")

    # 7. Poll until Stage 3 & 4 complete (status='completed')
    print("Waiting for Stage 3 & 4 and deliverables generation...")
    for _ in range(40):
        time.sleep(1.0)
        p_res = client.get(f"/api/pitches/{pitch_id}")
        p = p_res.json()
        if p["status"] in ("completed", "failed"):
            break

    assert p["status"] == "completed", f"Expected 'completed', got {p['status']}"
    assert len(p["stage3_challenge"]["critiques"]) > 0
    assert p["stage4_refined_analysis"] is not None
    assert p["boardroom_report_md"] is not None
    assert p["pitch_site_html"] is not None
    print(f"✓ Pipeline Completed! Refined Chair Verdict: {p['stage4_refined_analysis']['final_chair_verdict'][:80]}...")
    print(f"   Critiques count: {len(p['stage3_challenge']['critiques'])}")
    print(f"   Resolved Trade-Offs: {len(p['stage4_refined_analysis']['trade_offs_made'])}")

    # 8. Test Deliverables Retrieval through Proxy
    report_res = client.get(f"/api/pitches/{pitch_id}/report")
    assert report_res.status_code == 200
    assert "# VentureLens Boardroom Evaluation Report" in report_res.text
    print(f"✓ Proxied Report Retrieval: {len(report_res.text)} bytes of Markdown")

    site_res = client.get(f"/api/pitches/{pitch_id}/site")
    assert site_res.status_code == 200
    assert "<!DOCTYPE html>" in site_res.text
    assert "VentureLens Standalone Embedded CSS" in site_res.text
    assert "http://" not in site_res.text and "https://" not in site_res.text
    print(f"✓ Proxied Standalone Site Retrieval: {len(site_res.text)} bytes of HTML with 100% embedded CSS")

    print("\n=======================================================")
    print(">>> COMPLETE FRONTEND + BACKEND USER JOURNEY VERIFIED! <<<")
    print("=======================================================")

if __name__ == "__main__":
    run_e2e_test()
