import React, { useState, useEffect } from 'react';
import { UnitSystem } from './types';
import { Header } from './components/Header';
import { FullBodyAnalyzer } from './components/FullBodyAnalyzer';
import { BodyPartAnalyzer } from './components/BodyPartAnalyzer';
import { SupplementDirectory } from './components/SupplementDirectory';
import { SavedProtocols } from './components/SavedProtocols';
import { ShieldCheck, Activity, Heart, ArrowUpRight, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'full-body' | 'body-part' | 'supplements' | 'history'>('full-body');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [useHighThinking, setUseHighThinking] = useState<boolean>(true);

  // Saved Protocols in LocalStorage
  const [savedProtocols, setSavedProtocols] = useState<
    Array<{ id: string; title: string; date: string; data: any }>
  >([]);

  const [activeModalProtocol, setActiveModalProtocol] = useState<any | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('somascan_saved_protocols');
      if (stored) {
        setSavedProtocols(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Could not load saved protocols:', e);
    }
  }, []);

  const handleSaveProtocol = (title: string, data: any) => {
    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      date: new Date().toISOString(),
      data,
    };
    const updated = [newEntry, ...savedProtocols];
    setSavedProtocols(updated);
    try {
      localStorage.setItem('somascan_saved_protocols', JSON.stringify(updated));
    } catch (e) {
      console.error('Could not save protocol:', e);
    }
  };

  const handleDeleteProtocol = (id: string) => {
    const updated = savedProtocols.filter((p) => p.id !== id);
    setSavedProtocols(updated);
    try {
      localStorage.setItem('somascan_saved_protocols', JSON.stringify(updated));
    } catch (e) {
      console.error('Could not delete protocol:', e);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved protocols?')) {
      setSavedProtocols([]);
      localStorage.removeItem('somascan_saved_protocols');
    }
  };

  const handleLoadProtocol = (data: any) => {
    setActiveModalProtocol(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unitSystem={unitSystem}
        setUnitSystem={setUnitSystem}
        useHighThinking={useHighThinking}
        setUseHighThinking={setUseHighThinking}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'full-body' && (
          <FullBodyAnalyzer
            unitSystem={unitSystem}
            useHighThinking={useHighThinking}
            onSaveProtocol={handleSaveProtocol}
          />
        )}

        {activeTab === 'body-part' && (
          <BodyPartAnalyzer
            unitSystem={unitSystem}
            useHighThinking={useHighThinking}
            onSaveProtocol={handleSaveProtocol}
          />
        )}

        {activeTab === 'supplements' && <SupplementDirectory />}

        {activeTab === 'history' && (
          <SavedProtocols
            protocols={savedProtocols}
            onDeleteProtocol={handleDeleteProtocol}
            onClearAll={handleClearAll}
            onLoadProtocol={handleLoadProtocol}
          />
        )}
      </main>

      {/* Saved Protocol Modal Preview */}
      {activeModalProtocol && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveModalProtocol(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-400">Archived Record</span>
              <h3 className="text-lg font-bold text-white mt-1">
                {activeModalProtocol.type === 'full-body'
                  ? `Full Body Assessment: ${activeModalProtocol.result?.problemDiagnosis?.primaryIssue || ''}`
                  : `Targeted Growth: ${activeModalProtocol.result?.partOverview?.name || ''}`}
              </h3>
              <span className="text-xs text-slate-400">
                Created: {new Date(activeModalProtocol.timestamp).toLocaleString()}
              </span>
            </div>

            {/* Content summary */}
            {activeModalProtocol.type === 'full-body' ? (
              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">Root Biomechanical Cause:</span>
                  <p>{activeModalProtocol.result?.problemDiagnosis?.biomechanicalRootCause}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">Prescribed Corrective Exercises:</span>
                  <ul className="list-disc list-inside space-y-1">
                    {activeModalProtocol.result?.correctiveExercises?.map((ex: any, idx: number) => (
                      <li key={idx}>
                        <strong className="text-white">{ex.name}:</strong> {ex.sets} × {ex.reps} ({ex.purpose})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">Supplements:</span>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProtocol.result?.supplementProtocol?.map((s: any, idx: number) => (
                      <span key={idx} className="bg-slate-800 px-2 py-1 rounded text-emerald-300">
                        {s.name} ({s.dosage})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">Limb Leverage & Growth Challenge:</span>
                  <p>{activeModalProtocol.result?.partOverview?.insertionAndLeverNotes}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">Prescribed Exercises:</span>
                  <ul className="list-disc list-inside space-y-1">
                    {activeModalProtocol.result?.tailoredExercises?.map((ex: any, idx: number) => (
                      <li key={idx}>
                        <strong className="text-white">{ex.name}:</strong> {ex.sets} × {ex.reps} (
                        {ex.tier.replace('_', ' ')})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">Synchronized Meal & Supplement Timing:</span>
                  <div className="space-y-1.5">
                    {activeModalProtocol.result?.supplementDietPlan?.mealPlan?.map((m: any, idx: number) => (
                      <div key={idx} className="border-b border-slate-800 pb-1">
                        <strong className="text-teal-300">{m.timeOfDay} ({m.mealName}):</strong>{' '}
                        <span>{m.targetedSupplements.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModalProtocol(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Human · Biomechanics & Hypertrophy Platform · Clinical Sports Science</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Powered by Gemini 3.1 Pro High-Thinking Biomechanical Engine</span>
            <span>·</span>
            <span>Evidence-Based Kinesiology</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
