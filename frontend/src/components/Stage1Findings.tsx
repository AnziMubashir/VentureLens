import React, { useState } from 'react';
import { DollarSign, Cpu, Users, ChevronRight } from 'lucide-react';
import { SpecialistOutputs } from '../types';

interface Stage1FindingsProps {
  specialists: SpecialistOutputs;
}

export const Stage1Findings: React.FC<Stage1FindingsProps> = ({ specialists }) => {
  const [activeTab, setActiveTab] = useState<'investor' | 'technical' | 'user'>('investor');

  const investor = specialists.investor;
  const technical = specialists.technical;
  const user = specialists.user;

  if (!investor && !technical && !user) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Header & Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Stage 1: Specialized Domain Evaluations</span>
          </h2>
          <p className="text-xs text-slate-500">
            Independent analyses generated concurrently across commercial, architectural, and user perspectives.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-lg bg-slate-200/80 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('investor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'investor'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Investor</span>
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'technical'
                ? 'bg-white text-sky-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span>Technical</span>
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'user'
                ? 'bg-white text-violet-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-violet-600" />
            <span>User UX</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* INVESTOR VIEW */}
        {activeTab === 'investor' && investor && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Commercial Verdict
              </span>
              <p className="text-sm font-medium text-emerald-950">{investor.verdict}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Market & Opportunity</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {investor.market_opportunity}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Competitive Moat</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {investor.competitive_differentiation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Revenue Models</h4>
                <ul className="space-y-1.5">
                  {investor.revenue_models.map((m, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Commercial Risks</h4>
                <ul className="space-y-1.5">
                  {investor.commercial_risks.map((r, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-red-50/50 p-2 rounded border border-red-100/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Recommendations</h4>
                <ul className="space-y-1.5">
                  {investor.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TECHNICAL VIEW */}
        {activeTab === 'technical' && technical && (
          <div className="space-y-6">
            <div className="bg-sky-50 border border-sky-200/80 rounded-lg p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 block mb-1">
                Engineering Verdict
              </span>
              <p className="text-sm font-medium text-sky-950">{technical.verdict}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Feasibility Assessment</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {technical.feasibility_assessment}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Architecture Overview</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {technical.architecture_overview}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Recommended Stack</h4>
                <ul className="space-y-1.5">
                  {technical.recommended_stack.map((s, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100 font-mono">
                      <ChevronRight className="w-3.5 h-3.5 text-sky-600 flex-shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Essential MVP Scope</h4>
                <ul className="space-y-1.5">
                  {technical.mvp_scope.map((f, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Technical & Scaling Risks</h4>
                <ul className="space-y-1.5">
                  {technical.technical_risks.map((r, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-red-50/50 p-2 rounded border border-red-100/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* USER VIEW */}
        {activeTab === 'user' && user && (
          <div className="space-y-6">
            <div className="bg-violet-50 border border-violet-200/80 rounded-lg p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-800 block mb-1">
                User Adoption Verdict
              </span>
              <p className="text-sm font-medium text-violet-950">{user.verdict}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">User Value Proposition</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {user.user_value_proposition}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Target Personas</h4>
                <ul className="space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {user.target_personas.map((p, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Core Pain Points</h4>
                <ul className="space-y-1.5">
                  {user.core_pain_points.map((p, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <ChevronRight className="w-3.5 h-3.5 text-violet-600 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Adoption Barriers</h4>
                <ul className="space-y-1.5">
                  {user.adoption_barriers.map((b, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-amber-50/50 p-2 rounded border border-amber-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Essential User Features</h4>
                <ul className="space-y-1.5">
                  {user.key_user_features.map((f, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
