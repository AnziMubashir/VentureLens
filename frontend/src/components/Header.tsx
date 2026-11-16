import React from 'react';
import { Layers, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { HealthStatus } from '../types';

interface HeaderProps {
  health: HealthStatus | null;
  onReset?: () => void;
  hasActiveSession?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ health, onReset, hasActiveSession }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-400/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">VentureLens</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                Boardroom v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">See your idea from every angle.</p>
          </div>
        </div>

        {/* Right Status Badges & Actions */}
        <div className="flex items-center space-x-3">
          {health && (
            <div className="flex items-center space-x-2 text-xs bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full">
              <span className={`w-2 h-2 rounded-full ${health.mode === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
              <span className="text-slate-300">
                {health.mode === 'live' ? (
                  <span className="flex items-center gap-1 text-emerald-300 font-medium">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Live Gemini ({health.gemini_model || '3.5-flash'})
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-blue-300 font-medium">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    Demo Mock Mode
                  </span>
                )}
              </span>
            </div>
          )}

          {hasActiveSession && onReset && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
              title="Start a new venture evaluation"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>New Pitch</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
