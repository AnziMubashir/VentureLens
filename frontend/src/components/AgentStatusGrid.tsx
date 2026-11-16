import React from 'react';
import { DollarSign, Cpu, Users, Crown, CheckCircle2, Clock } from 'lucide-react';
import { PitchRecord } from '../types';

interface AgentStatusGridProps {
  pitch: PitchRecord;
}

export const AgentStatusGrid: React.FC<AgentStatusGridProps> = ({ pitch }) => {
  const status = pitch.status;
  const specialists = pitch.stage1_specialists;

  const isStage1Running = status === 'stage1_running';
  const isStage1Done = [
    'stage1_complete',
    'stage2_running',
    'awaiting_challenge',
    'stage3_running',
    'stage4_running',
    'completed',
  ].includes(status);

  const isStage3Running = status === 'stage3_running';
  const isCompleted = status === 'completed';

  const agents = [
    {
      id: 'investor',
      name: 'Investor Agent',
      domain: 'Commercial & Unit Economics',
      icon: DollarSign,
      color: 'emerald',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      state: isStage3Running
        ? 'Critiquing peers'
        : isStage1Done
        ? 'Evaluation Complete'
        : isStage1Running
        ? 'Analyzing Market & Margin...'
        : 'Waiting',
      isWorking: isStage1Running || isStage3Running,
      isDone: isStage1Done,
      verdict: specialists?.investor?.verdict,
    },
    {
      id: 'technical',
      name: 'Technical Agent',
      domain: 'Architecture & MVP Scope',
      icon: Cpu,
      color: 'sky',
      bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      state: isStage3Running
        ? 'Critiquing peers'
        : isStage1Done
        ? 'Evaluation Complete'
        : isStage1Running
        ? 'Assessing Feasibility & Stack...'
        : 'Waiting',
      isWorking: isStage1Running || isStage3Running,
      isDone: isStage1Done,
      verdict: specialists?.technical?.verdict,
    },
    {
      id: 'user',
      name: 'User Agent',
      domain: 'UX & Adoption Friction',
      icon: Users,
      color: 'violet',
      bgColor: 'bg-violet-50 text-violet-700 border-violet-200',
      badgeColor: 'bg-violet-100 text-violet-800 border-violet-300',
      state: isStage3Running
        ? 'Critiquing peers'
        : isStage1Done
        ? 'Evaluation Complete'
        : isStage1Running
        ? 'Examining User Pain & Friction...'
        : 'Waiting',
      isWorking: isStage1Running || isStage3Running,
      isDone: isStage1Done,
      verdict: specialists?.user?.verdict,
    },
    {
      id: 'chair',
      name: 'Board Chair',
      domain: 'Orchestrator & Final Synthesis',
      icon: Crown,
      color: 'indigo',
      bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      state: isCompleted
        ? 'Refined Analysis Delivered'
        : status === 'stage4_running'
        ? 'Reconciling Trade-Offs...'
        : status === 'awaiting_challenge'
        ? 'Initial Synthesis Ready'
        : status === 'stage2_running'
        ? 'Synthesizing Stage 1...'
        : 'Coordinating Board',
      isWorking: status === 'stage2_running' || status === 'stage4_running',
      isDone: isCompleted || status === 'awaiting_challenge',
      verdict: pitch.stage4_refined_analysis?.final_chair_verdict,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {agents.map((agent) => {
        const Icon = agent.icon;
        return (
          <div
            key={agent.id}
            className={`bg-white border rounded-xl p-4 shadow-sm transition-all relative overflow-hidden ${
              agent.isWorking
                ? 'border-blue-400 ring-2 ring-blue-100 shadow-md'
                : agent.isDone
                ? 'border-slate-200'
                : 'border-slate-200 opacity-70'
            }`}
          >
            {/* Top Indicator Bar */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${agent.bgColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  agent.isWorking
                    ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                    : agent.isDone
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                {agent.isWorking ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                    <span>Active</span>
                  </>
                ) : agent.isDone ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Idle</span>
                  </>
                )}
              </span>
            </div>

            {/* Title & Domain */}
            <h3 className="font-bold text-slate-900 text-sm">{agent.name}</h3>
            <p className="text-xs text-slate-500 mb-2">{agent.domain}</p>

            {/* Current Activity Message */}
            <div className="text-xs font-medium text-slate-700 mt-2 bg-slate-50 rounded p-2 border border-slate-100 min-h-[44px] flex items-center">
              {agent.state}
            </div>

            {/* Quick Verdict snippet if available */}
            {agent.verdict && (
              <div className="mt-2 text-[11px] text-slate-600 line-clamp-2 italic border-t border-slate-100 pt-1.5">
                "{agent.verdict}"
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
