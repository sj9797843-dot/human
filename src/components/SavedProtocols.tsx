import React from 'react';
import { Bookmark, Trash2, Printer, Calendar, ArrowRight, UserCheck, Dumbbell } from 'lucide-react';

interface SavedProtocolsProps {
  protocols: Array<{ id: string; title: string; date: string; data: any }>;
  onDeleteProtocol: (id: string) => void;
  onClearAll: () => void;
  onLoadProtocol: (protocol: any) => void;
}

export const SavedProtocols: React.FC<SavedProtocolsProps> = ({
  protocols,
  onDeleteProtocol,
  onClearAll,
  onLoadProtocol,
}) => {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Personalized Health Records
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
              Saved Biomechanical & Hypertrophy Protocols
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Access your previous clinical posture audits, corrective regimens, and targeted muscle growth plans.
            </p>
          </div>

          {protocols.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-900/40 rounded-xl hover:bg-rose-900/60 transition-all self-start sm:self-auto"
            >
              Clear All Protocols
            </button>
          )}
        </div>
      </div>

      {protocols.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Protocols Saved Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Run a Full Body Biomechanics scan or analyze an individual muscle group, then click "Save Protocol" to bookmark it here for fast reference.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {protocols.map((p) => {
            const isFullBody = p.data?.type === 'full-body';
            return (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        isFullBody
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      }`}
                    >
                      {isFullBody ? <UserCheck className="w-3 h-3" /> : <Dumbbell className="w-3 h-3" />}
                      {isFullBody ? 'Full Body Scan' : 'Targeted Body Part'}
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(p.date).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{p.title}</h3>

                  {isFullBody ? (
                    <p className="text-xs text-slate-300 line-clamp-2">
                      Root Cause: {p.data?.result?.problemDiagnosis?.biomechanicalRootCause || 'N/A'}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-300 line-clamp-2">
                      Growth Focus: {p.data?.result?.partOverview?.insertionAndLeverNotes || 'N/A'}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => onLoadProtocol(p.data)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Print Protocol"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProtocol(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete Protocol"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
