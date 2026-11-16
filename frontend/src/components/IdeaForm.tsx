import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import { IdeaInput, SampleIdea } from '../types';

interface IdeaFormProps {
  samples: SampleIdea[];
  onSubmit: (idea: IdeaInput) => void;
  isSubmitting: boolean;
}

export const IdeaForm: React.FC<IdeaFormProps> = ({ samples, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<IdeaInput>({
    name: '',
    description: '',
    problem: '',
    target_users: '',
    proposed_solution: '',
  });

  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadSample = (sample: SampleIdea) => {
    setActiveSampleId(sample.id);
    setFormData({
      name: sample.name,
      description: sample.description,
      problem: sample.problem,
      target_users: sample.target_users,
      proposed_solution: sample.proposed_solution,
    });
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Venture name is required';
    if (!formData.description.trim()) errs.description = 'Brief concept description is required';
    if (!formData.problem.trim()) errs.problem = 'Problem statement is required';
    if (!formData.target_users.trim()) errs.target_users = 'Target user definition is required';
    if (!formData.proposed_solution.trim()) errs.proposed_solution = 'Proposed solution is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Hero Welcome */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Perspective AI Evaluation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Convene Your Virtual Boardroom
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
          Submit your early-stage venture idea. Three specialized AI agents will stress-test it, challenge each other, and compile an executive report and pitch website.
        </p>

        {/* 1-Click Sample Pre-loaders */}
        {samples.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Quick demo fill:
            </span>
            {samples.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => loadSample(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center space-x-1.5 font-medium ${
                  activeSampleId === s.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {activeSampleId === s.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{s.name}</span>
                <span className="text-[10px] opacity-75">
                  ({s.name === 'CampusBite' ? 'Campus Dining' : 'Developer Tool'})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Submission Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        {/* Venture Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Venture / Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. EcoRoute, MedScribe AI, CampusBite"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.name ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>}
        </div>

        {/* Concept Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Concept Overview (Elevator Pitch) <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief high-level explanation of what your venture does..."
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.description ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600 font-medium">{errors.description}</p>}
        </div>

        {/* Problem Statement */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Specific Problem Being Solved <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={formData.problem}
            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
            placeholder="What exact pain point, operational friction, or financial loss do your users experience?"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.problem ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.problem && <p className="mt-1 text-xs text-red-600 font-medium">{errors.problem}</p>}
        </div>

        {/* Target Users */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Target Users & Customers <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.target_users}
            onChange={(e) => setFormData({ ...formData, target_users: e.target.value })}
            placeholder="e.g. Undergraduate college students, Solo software developers, Freelance graphic designers"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.target_users ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.target_users && <p className="mt-1 text-xs text-red-600 font-medium">{errors.target_users}</p>}
        </div>

        {/* Proposed Solution */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Proposed Solution & Core Workflow <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.proposed_solution}
            onChange={(e) => setFormData({ ...formData, proposed_solution: e.target.value })}
            placeholder="Explain how your software or product will solve this problem..."
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.proposed_solution ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.proposed_solution && <p className="mt-1 text-xs text-red-600 font-medium">{errors.proposed_solution}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all text-base"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Convening Boardroom Session...</span>
              </>
            ) : (
              <>
                <span>Begin Multi-Agent Evaluation</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            Launches parallel Investor, Technical, and User analysis with zero setup required.
          </p>
        </div>

      </form>
    </div>
  );
};
