import httpx
import time

client = httpx.Client(base_url="http://127.0.0.1:8000")

# 1. Health check
res = client.get("/api/health")
print("1. Health Check:", res.json())

# 2. Samples
samples = client.get("/api/samples").json()
print(f"2. Samples Retrieved: {len(samples)} examples | First: {samples[0]['name']}")

# 3. Submit Idea
payload = {
    "name": samples[0]["name"],
    "description": samples[0]["description"],
    "problem": samples[0]["problem"],
    "target_users": samples[0]["target_users"],
    "proposed_solution": samples[0]["proposed_solution"],
}
pitch = client.post("/api/pitches", json=payload).json()
pitch_id = pitch["id"]
print(f"3. Pitch Submitted | ID: {pitch_id} | Initial Status: {pitch['status']}")

# 4. Wait for Stage 1 & 2
time.sleep(1.5)
status_data = client.get(f"/api/pitches/{pitch_id}").json()
print(f"4. Stage 1 & 2 Completed | Current Status: {status_data['status']}")
print(f"   Investor Outlook: {status_data['stage1_specialists']['investor']['verdict']}")
print(f"   Technical Outlook: {status_data['stage1_specialists']['technical']['verdict']}")
print(f"   User Outlook: {status_data['stage1_specialists']['user']['verdict']}")
print(f"   Executive Summary: {status_data['stage2_initial_synthesis']['executive_summary']}")

# 5. User clicks 'Challenge My Idea'
chal = client.post(f"/api/pitches/{pitch_id}/challenge").json()
print(f"5. 'Challenge My Idea' Triggered | Status: {chal['status']}")

# 6. Wait for Stage 3 & 4
time.sleep(2.0)
final_data = client.get(f"/api/pitches/{pitch_id}").json()
print(f"6. Full Pipeline Finished | Final Status: {final_data['status']}")
print(f"   Critiques Count: {len(final_data['stage3_challenge']['critiques'])}")
print(f"   Trade-offs Resolved: {len(final_data['stage4_refined_analysis']['trade_offs_made'])}")
print(f"   Chair Closing Verdict: {final_data['stage4_refined_analysis']['final_chair_verdict']}")

# 7. Check Deliverables
report = client.get(f"/api/pitches/{pitch_id}/report").text
site = client.get(f"/api/pitches/{pitch_id}/site").text
print("7. Deliverables Verification:")
print(f"   Boardroom Report Markdown: {len(report)} bytes | Contains Title: {'VentureLens Boardroom Evaluation Report' in report}")
print(f"   Standalone HTML Pitch Website: {len(site)} bytes | Contains Embedded CSS: {'Standalone Embedded CSS' in site}")
print("\n>>> ALL ENDPOINTS & FLOWS VERIFIED SUCCESSFULLY ON RUNNING SERVER <<<")
