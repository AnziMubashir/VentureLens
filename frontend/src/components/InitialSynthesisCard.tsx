import React from 'react';
import { Crown, Flame, AlertCircle, CheckCircle2, GitMerge } from 'lucide-react';
import { InitialSynthesis } from '../types';

interface InitialSynthesisCardProps {
  synthesis: InitialSynthesis;
  onChallenge: () => void;
  isChallenging: boolean;
  canChallenge: boolean;
}

export const InitialSynthesisCard: React.FC<InitialSynthesisCardProps> = ({
  synthesis,
  onChallenge,
  isChallenging,
  canChallenge,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="border-b border-slate-200 bg-indigo-50/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Stage 2: Board Chair Initial Synthesis
            </h2>
            <p className="text-xs text-slate-500">
              Consolidation of specialist findings, consensus areas, and identified domain tensions.
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200">
          Stage 2 Complete
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Executive Summary */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Executive Overview</h3>
          <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/80">
            {synthesis.executive_summary}
          </p>
        </div>

        {/* Agreements & Cross-Dependencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Key Agreements */}
          <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-lg p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Consensus & Shared Findings</span>
            </h3>
            <ul className="space-y-2">
              {synthesis.key_agreements.map((item, idx) => (
                <li key={idx} className="text-xs text-emerald-950 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cross Dependencies */}
          <div className="bg-blue-50/50 border border-blue-200/60 rounded-lg p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3 flex items-center gap-1.5">
              <GitMerge className="w-4 h-4 text-blue-600" />
              <span>Cross-Domain Dependencies</span>
            </h3>
            <ul className="space-y-2">
              {synthesis.cross_dependencies.map((item, idx) => (
                <li key={idx} className="text-xs text-blue-950 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Conflicting Perspectives / Disagreements Callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Identified Domain Tensions & Conflicting Recommendations</span>
          </h3>
          <p className="text-xs text-amber-800 mb-3">
            The specialists disagree on several critical implementation, pricing, or security trade-offs:
          </p>
          <ul className="space-y-2">
            {synthesis.conflicting_perspectives.map((item, idx) => (
              <li key={idx} className="text-xs text-amber-950 bg-white/70 p-2.5 rounded border border-amber-200/60 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CHALLENGE MY IDEA ACTION CALLOUT */}
        {canChallenge && (
          <div className="mt-8 pt-6 border-t border-slate-200 bg-gradient-to-r from-red-50/50 via-white to-amber-50/50 rounded-xl p-6 border text-center">
            <div className="max-w-xl mx-auto">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Stage 3: Ready to Stress-Test Your Venture?
              </h3>
              <p className="text-xs text-slate-600 mt-1 mb-5">
                Authorize the <strong>"Challenge My Idea"</strong> stage. Specialist agents will critically cross-examine peer claims, expose hidden costs or friction, and allow the Board Chair to forge resolved trade-offs.
              </p>

              <button
                type="button"
                onClick={onChallenge}
                disabled={isChallenging}
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-8 rounded-lg shadow-sm hover:shadow transition-all text-sm uppercase tracking-wider"
              >
                {isChallenging ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Executing Cross-Agent Critiques...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    <span>Challenge My Idea</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
