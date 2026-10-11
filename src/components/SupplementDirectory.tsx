import React, { useState, useEffect } from 'react';
import { DirectorySupplement } from '../types';
import { Pill, Sparkles, ShieldCheck, Clock, Search, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

export const SupplementDirectory: React.FC = () => {
  const [supplements, setSupplements] = useState<DirectorySupplement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSupplement, setActiveSupplement] = useState<DirectorySupplement | null>(null);

  useEffect(() => {
    fetch('/api/supplements-directory')
      .then((res) => res.json())
      .then((data) => {
        setSupplements(data);
        if (data.length > 0) setActiveSupplement(data[0]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Hypertrophy & Cellular ATP', 'Muscle Protein Synthesis (MPS)', 'Joint Health & Systemic Anti-Inflammatory', 'Bone Density & Endocrine Support', 'Neuromuscular Relaxation & Deep Sleep', 'Ligament & Tendon Hypertrophy', 'Nitric Oxide & Fascial Pump'];

  const filtered = supplements.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.primaryRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.structureApplication.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
            <Pill className="w-4 h-4" />
            Nutraceutical Pharmacology Reference
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3 tracking-tight">
            Scientific Supplement Directory & Biomechanical Applications
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Understand how clinical ergogenic aids directly support muscular hypertrophy, joint cartilage, synovial fluid viscosity, and neurological recovery. Each entry is vetted against human clinical trial meta-analyses with specific guidance for varying height and frame sizes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, tissue mechanism, or benefit..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white text-xs focus:border-emerald-500 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-white">{filtered.length}</span> verified compounds
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400 text-sm">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-3" />
          Loading clinical pharmacology database...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveSupplement(item)}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
                activeSupplement?.id === item.id
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {item.evidenceGrade}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{item.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.primaryRole}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Clinical Dose:</span>
                  <span className="font-bold text-white text-[11px]">{item.standardDose}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Optimal Timing:</span>
                  <span className="font-medium text-emerald-300 text-[11px]">{item.bestTiming}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-teal-300 font-bold block uppercase tracking-wide">
                    Structure & Lever Application
                  </span>
                  <p className="text-[11px] text-slate-300 leading-snug">{item.structureApplication}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 space-y-1">
                  <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wide">
                    Myth vs Reality
                  </span>
                  <p className="text-[11px] text-amber-200/90 leading-snug">{item.commonMyths}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
