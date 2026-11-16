import React from 'react';
import { Award, ShieldAlert, CheckCircle, Scale, Target } from 'lucide-react';
import { RefinedAnalysis } from '../types';

interface RefinedAnalysisCardProps {
  refined: RefinedAnalysis;
}

export const RefinedAnalysisCard: React.FC<RefinedAnalysisCardProps> = ({ refined }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="border-b border-slate-200 bg-indigo-50/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Stage 4: Board Chair Refined Analysis & Actionable MVP
            </h2>
            <p className="text-xs text-slate-500">
              Post-challenge reconciliation: decisive trade-offs and defined feature boundaries.
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
          Refined Analysis Delivered
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Final Chair Verdict Callout */}
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5">
            <Award className="w-4 h-4" />
            <span>Board Chair Executive Verdict</span>
          </div>
          <p className="text-base font-medium text-slate-100 leading-relaxed">
            {refined.final_chair_verdict}
          </p>
        </div>

        {/* Strengths & Critical Risks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Validated Strengths */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Validated Defensible Strengths</span>
            </h3>
            <ul className="space-y-2">
              {refined.synthesized_strengths.map((item, idx) => (
                <li key={idx} className="text-xs text-emerald-950 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Risks */}
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Critical Unmitigated Risks</span>
            </h3>
            <ul className="space-y-2">
              {refined.critical_risks.map((item, idx) => (
                <li key={idx} className="text-xs text-red-950 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Resolved Trade-Offs (The core value of Challenge My Idea) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Resolved Domain Trade-Offs</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Explicit decisions settling conflicting specialist recommendations:
          </p>
          <ul className="space-y-2.5">
            {refined.trade_offs_made.map((tradeOff, idx) => (
              <li key={idx} className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200/80 font-medium">
                {tradeOff}
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable MVP Specification */}
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Actionable MVP Feature Boundaries</span>
          </h3>
          <p className="text-xs text-blue-700 mb-3">
            Essential feature scope for initial launch (deferred enterprise features excluded):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {refined.actionable_mvp.map((item, idx) => (
              <div key={idx} className="text-xs text-blue-950 bg-white p-2.5 rounded-lg border border-blue-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
