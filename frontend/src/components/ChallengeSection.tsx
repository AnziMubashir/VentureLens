import React from 'react';
import { Flame, ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react';
import { ChallengeAnalysis } from '../types';

interface ChallengeSectionProps {
  challenge: ChallengeAnalysis;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({ challenge }) => {
  if (!challenge || !challenge.critiques || challenge.critiques.length === 0) return null;

  const agentBadge = (agent: string) => {
    switch (agent.toLowerCase()) {
      case 'investor':
        return <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Investor Agent</span>;
      case 'technical':
        return <span className="text-xs px-2 py-0.5 rounded font-semibold bg-sky-100 text-sky-800 border border-sky-200">Technical Agent</span>;
      case 'user':
        return <span className="text-xs px-2 py-0.5 rounded font-semibold bg-violet-100 text-violet-800 border border-violet-200">User Agent</span>;
      default:
        return <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-800 border border-slate-200">{agent}</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="border-b border-slate-200 bg-red-50/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-sm">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Stage 3: "Challenge My Idea" Peer Cross-Critiques
            </h2>
            <p className="text-xs text-slate-500">
              Specialists critically challenging each other's assumptions to expose overlooked friction and technical debt.
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-semibold border border-red-200">
          Stage 3 Complete
        </span>
      </div>

      {/* Critiques Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {challenge.critiques.map((item, idx) => (
          <div
            key={idx}
            className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
          >
            <div>
              {/* Interaction Direction */}
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-200">
                <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                  {agentBadge(item.source_agent)}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {agentBadge(item.target_agent)}
                </div>
              </div>

              {/* Challenged Claim */}
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Challenged Claim
                </span>
                <p className="text-xs font-semibold text-slate-900 bg-white p-2.5 rounded border border-slate-200/80">
                  "{item.challenged_claim}"
                </p>
              </div>

              {/* Underlying Concern */}
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>The Risk / Concern</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-red-50/40 p-2.5 rounded border border-red-100">
                  {item.concern}
                </p>
              </div>
            </div>

            {/* Suggested Pivot */}
            <div className="mt-2 pt-2.5 border-t border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1 mb-1">
                <Lightbulb className="w-3 h-3 text-emerald-600" />
                <span>Suggested Pivot</span>
              </span>
              <p className="text-xs text-emerald-950 font-medium bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                {item.suggested_pivot}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
