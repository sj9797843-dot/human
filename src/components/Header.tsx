import React from 'react';
import { UnitSystem } from '../types';
import { Activity, Brain, Sparkles, BookOpen, UserCheck, Dumbbell } from 'lucide-react';

interface HeaderProps {
  activeTab: 'full-body' | 'body-part' | 'supplements' | 'history';
  setActiveTab: (tab: 'full-body' | 'body-part' | 'supplements' | 'history') => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  useHighThinking: boolean;
  setUseHighThinking: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unitSystem,
  setUnitSystem,
  useHighThinking,
  setUseHighThinking,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">Human</span>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold border border-emerald-500/30 px-1.5 py-0.5 rounded">
                Biomechanics & Growth
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Structural analysis, corrective therapy & hypertrophy nutrition
            </p>
          </div>
        </div>

        {/* Global Controls: Units & High Thinking Mode */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Unit Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                unitSystem === 'metric'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Metric (cm/kg)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                unitSystem === 'imperial'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Imperial (ft/lbs)
            </button>
          </div>

          {/* High Thinking Mode Toggle */}
          <button
            type="button"
            onClick={() => setUseHighThinking(!useHighThinking)}
            title="Toggle Gemini 3.1 Pro High-Thinking Mode"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              useHighThinking
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Brain className={`w-3.5 h-3.5 ${useHighThinking ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <span>High Thinking Mode</span>
            <span
              className={`text-[10px] px-1 py-0.2 rounded font-bold uppercase ${
                useHighThinking ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {useHighThinking ? 'Pro 3.1' : 'Flash'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab('full-body')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'full-body'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Full Body & Problem Analysis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('body-part')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'body-part'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-teal-400" />
            <span>Targeted Body Part & Growth</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supplements')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'supplements'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Supplement Science Directory</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'history'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Saved Protocols</span>
          </button>
        </div>
      </div>
    </header>
  );
};
