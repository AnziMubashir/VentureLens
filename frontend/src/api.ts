import { HealthStatus, IdeaInput, PitchRecord, SampleIdea } from './types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch backend health');
  return res.json();
}

export async function fetchSamples(): Promise<SampleIdea[]> {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to fetch sample ideas');
  return res.json();
}

export async function submitPitch(idea: IdeaInput): Promise<PitchRecord> {
  const res = await fetch(`${API_BASE}/pitches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(idea),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to submit idea' }));
    throw new Error(err.detail || 'Failed to submit idea');
  }
  return res.json();
}

export async function fetchPitch(pitchId: string): Promise<PitchRecord> {
  const res = await fetch(`${API_BASE}/pitches/${pitchId}`);
  if (!res.ok) throw new Error(`Failed to fetch pitch ${pitchId}`);
  return res.json();
}

export async function triggerChallenge(pitchId: string): Promise<PitchRecord> {
  const res = await fetch(`${API_BASE}/pitches/${pitchId}/challenge`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to trigger challenge' }));
    throw new Error(err.detail || 'Failed to trigger challenge');
  }
  return res.json();
}

export function getReportDownloadUrl(pitchId: string): string {
  return `${API_BASE}/pitches/${pitchId}/report`;
}

export function getPitchSiteUrl(pitchId: string): string {
  return `${API_BASE}/pitches/${pitchId}/site`;
}

export function subscribeToPitchEvents(
  pitchId: string,
  onEvent: (event: string, data: any) => void,
  onError?: (err: any) => void
): () => void {
  const eventSource = new EventSource(`${API_BASE}/pitches/${pitchId}/events`);

  const eventTypes = [
    'connected',
    'stage1_started',
    'stage1_complete',
    'stage2_started',
    'stage2_complete',
    'stage3_started',
    'stage3_complete',
    'stage4_started',
    'pipeline_completed',
    'pipeline_error',
  ];

  eventTypes.forEach((type) => {
    eventSource.addEventListener(type, (e: MessageEvent) => {
      try {
        const parsed = JSON.parse(e.data);
        onEvent(type, parsed);
      } catch (err) {
        onEvent(type, e.data);
      }
    });
  });

  eventSource.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}
