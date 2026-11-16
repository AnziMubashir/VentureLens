import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { IdeaForm } from './components/IdeaForm';
import { AgentStatusGrid } from './components/AgentStatusGrid';
import { Stage1Findings } from './components/Stage1Findings';
import { InitialSynthesisCard } from './components/InitialSynthesisCard';
import { ChallengeSection } from './components/ChallengeSection';
import { RefinedAnalysisCard } from './components/RefinedAnalysisCard';
import { DeliverablesHub } from './components/DeliverablesHub';
import {
  fetchHealth,
  fetchSamples,
  submitPitch,
  fetchPitch,
  triggerChallenge,
  subscribeToPitchEvents,
} from './api';
import { HealthStatus, IdeaInput, PitchRecord, SampleIdea } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [samples, setSamples] = useState<SampleIdea[]>([]);
  const [pitch, setPitch] = useState<PitchRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChallenging, setIsChallenging] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Load backend health and sample ideas on mount
  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch((err) => {
        console.error('Health fetch failed:', err);
        setGlobalError('Unable to connect to backend server. Please verify FastAPI is running on port 8000.');
      });

    fetchSamples()
      .then(setSamples)
      .catch((err) => console.error('Samples fetch failed:', err));
  }, []);

  // Subscribe to SSE stream whenever an active pitch is present and not terminal
  useEffect(() => {
    if (!pitch || pitch.status === 'completed' || pitch.status === 'failed') return;

    const unsubscribe = subscribeToPitchEvents(
      pitch.id,
      (event, data) => {
        console.log(`[SSE ${event}]`, data);

        if (event === 'stage1_started') {
          setPitch((prev) => prev ? { ...prev, status: 'stage1_running' } : null);
        } else if (event === 'stage1_complete') {
          setPitch((prev) => prev ? {
            ...prev,
            status: 'stage1_complete',
            stage1_specialists: data,
          } : null);
        } else if (event === 'stage2_started') {
          setPitch((prev) => prev ? { ...prev, status: 'stage2_running' } : null);
        } else if (event === 'stage2_complete') {
          setPitch((prev) => prev ? {
            ...prev,
            status: 'awaiting_challenge',
            stage2_initial_synthesis: data.initial_synthesis,
          } : null);
          setIsChallenging(false);
        } else if (event === 'stage3_started') {
          setPitch((prev) => prev ? { ...prev, status: 'stage3_running' } : null);
        } else if (event === 'stage3_complete') {
          setPitch((prev) => prev ? {
            ...prev,
            stage3_challenge: { critiques: data.critiques },
          } : null);
        } else if (event === 'stage4_started') {
          setPitch((prev) => prev ? { ...prev, status: 'stage4_running' } : null);
        } else if (event === 'pipeline_completed') {
          // Re-fetch the entire record to get full deliverables
          fetchPitch(pitch.id)
            .then(setPitch)
            .finally(() => setIsChallenging(false));
        } else if (event === 'pipeline_error') {
          setPitch((prev) => prev ? { ...prev, status: 'failed', error: data.error } : null);
          setIsChallenging(false);
        }
      },
      (err) => {
        console.warn('SSE connection warning:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [pitch?.id, pitch?.status]);

  const handleSubmitIdea = async (idea: IdeaInput) => {
    setIsSubmitting(true);
    setGlobalError(null);
    try {
      const newPitch = await submitPitch(idea);
      setPitch(newPitch);
    } catch (err: any) {
      setGlobalError(err.message || 'Failed to submit idea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerChallenge = async () => {
    if (!pitch) return;
    setIsChallenging(true);
    try {
      const updated = await triggerChallenge(pitch.id);
      setPitch(updated);
    } catch (err: any) {
      setGlobalError(err.message || 'Failed to start challenge stage');
      setIsChallenging(false);
    }
  };

  const handleReset = () => {
    setPitch(null);
    setGlobalError(null);
    setIsChallenging(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Header */}
      <Header
        health={health}
        onReset={handleReset}
        hasActiveSession={!!pitch}
      />

      {/* Persistent Disclaimer */}
      <DisclaimerBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Global Error Banner */}
        {globalError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-red-100 rounded border border-red-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View 1: Submission Form (when no active pitch) */}
        {!pitch && (
          <IdeaForm
            samples={samples}
            onSubmit={handleSubmitIdea}
            isSubmitting={isSubmitting}
          />
        )}

        {/* View 2: Active Boardroom Session */}
        {pitch && (
          <div>
            
            {/* Active Session Top Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 font-mono block">
                  Active Virtual Boardroom
                </span>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span>{pitch.idea.name}</span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {pitch.idea.description}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center space-x-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Evaluate Another Idea</span>
                </button>
              </div>
            </div>

            {/* Stage Progress Matrix (All 4 Board Members) */}
            <AgentStatusGrid pitch={pitch} />

            {/* Stage 1: Specialist Evaluations */}
            {pitch.stage1_specialists && (
              <Stage1Findings specialists={pitch.stage1_specialists} />
            )}

            {/* Stage 2: Initial Board Synthesis + "Challenge My Idea" CTA */}
            {pitch.stage2_initial_synthesis && (
              <InitialSynthesisCard
                synthesis={pitch.stage2_initial_synthesis}
                onChallenge={handleTriggerChallenge}
                isChallenging={isChallenging || pitch.status === 'stage3_running'}
                canChallenge={pitch.status === 'awaiting_challenge'}
              />
            )}

            {/* Stage 3: "Challenge My Idea" Cross-Critiques */}
            {pitch.stage3_challenge && (
              <ChallengeSection challenge={pitch.stage3_challenge} />
            )}

            {/* Stage 4: Refined Analysis & Actionable MVP */}
            {pitch.stage4_refined_analysis && (
              <RefinedAnalysisCard refined={pitch.stage4_refined_analysis} />
            )}

            {/* Stage 5 & 6: Deliverables Hub (Boardroom Report + Pitch Website) */}
            {pitch.status === 'completed' && (
              <DeliverablesHub pitch={pitch} />
            )}

          </div>
        )}

      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>VentureLens &bull; Multi-Agent AI Idea Evaluation Platform &bull; CS325 Software Engineering Demonstration</p>
      </footer>

    </div>
  );
}

export default App;
