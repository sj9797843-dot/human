import React, { useState } from 'react';
import { SelectedBodyZone } from '../types';

interface InteractiveBodyMapProps {
  selectedZone: SelectedBodyZone;
  onSelectZone: (zone: SelectedBodyZone) => void;
}

interface MuscleZoneData {
  id: SelectedBodyZone;
  name: string;
  view: 'front' | 'back' | 'both';
  pathD: string;
  category: string;
}

export const InteractiveBodyMap: React.FC<InteractiveBodyMapProps> = ({
  selectedZone,
  onSelectZone,
}) => {
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');

  // Anatomical zone definitions for standard proportional svg viewport (0 0 300 600)
  const frontZones: Array<{ id: SelectedBodyZone; name: string; d: string; labelPos: [number, number] }> = [
    {
      id: 'neck_traps',
      name: 'Neck & Trapezius',
      d: 'M130,70 Q150,55 170,70 L176,105 L124,105 Z',
      labelPos: [150, 85],
    },
    {
      id: 'shoulders',
      name: 'Deltoids / Shoulders',
      d: 'M115,105 Q90,115 85,155 Q105,160 118,140 Z M185,105 Q210,115 215,155 Q195,160 182,140 Z',
      labelPos: [85, 130],
    },
    {
      id: 'chest',
      name: 'Pectorals (Chest)',
      d: 'M120,110 Q150,115 180,110 L188,165 Q150,185 112,165 Z',
      labelPos: [150, 140],
    },
    {
      id: 'biceps',
      name: 'Biceps & Brachialis',
      d: 'M85,160 Q72,190 75,225 Q95,225 105,190 Z M215,160 Q228,190 225,225 Q205,225 195,190 Z',
      labelPos: [65, 195],
    },
    {
      id: 'core',
      name: 'Abdominals & Core',
      d: 'M114,175 Q150,185 186,175 L182,270 Q150,285 118,270 Z',
      labelPos: [150, 225],
    },
    {
      id: 'quadriceps',
      name: 'Quadriceps (Thighs)',
      d: 'M106,290 Q145,295 145,335 L142,440 Q118,445 102,400 Z M194,290 Q155,295 155,335 L158,440 Q182,445 198,400 Z',
      labelPos: [150, 360],
    },
    {
      id: 'calves',
      name: 'Tibialis & Calves',
      d: 'M102,455 Q125,460 122,545 L106,550 Q92,500 102,455 Z M198,455 Q175,460 178,545 L194,550 Q208,500 198,455 Z',
      labelPos: [150, 500],
    },
  ];

  const backZones: Array<{ id: SelectedBodyZone; name: string; d: string; labelPos: [number, number] }> = [
    {
      id: 'neck_traps',
      name: 'Upper Traps & Cervical Spine',
      d: 'M128,70 Q150,55 172,70 L188,115 L150,140 L112,115 Z',
      labelPos: [150, 95],
    },
    {
      id: 'shoulders',
      name: 'Rear Deltoids',
      d: 'M112,108 Q88,118 84,155 Q102,158 114,142 Z M188,108 Q212,118 216,155 Q198,158 186,142 Z',
      labelPos: [85, 130],
    },
    {
      id: 'triceps',
      name: 'Triceps (Long & Lateral Heads)',
      d: 'M84,158 Q72,190 76,230 Q92,228 100,195 Z M216,158 Q228,190 224,230 Q208,228 200,195 Z',
      labelPos: [65, 195],
    },
    {
      id: 'upper_back',
      name: 'Rhomboids & Mid Traps',
      d: 'M120,120 L180,120 L176,170 L124,170 Z',
      labelPos: [150, 145],
    },
    {
      id: 'lats',
      name: 'Latissimus Dorsi (Lats)',
      d: 'M115,145 Q105,185 118,235 L126,230 L124,165 Z M185,145 Q195,185 182,235 L174,230 L176,165 Z',
      labelPos: [205, 190],
    },
    {
      id: 'lower_back',
      name: 'Lumbar Spine & Erector Spinae',
      d: 'M125,175 L175,175 L172,260 L128,260 Z',
      labelPos: [150, 215],
    },
    {
      id: 'glutes',
      name: 'Gluteus Maximus & Medius',
      d: 'M116,265 Q150,270 184,265 L190,320 Q150,335 110,320 Z',
      labelPos: [150, 295],
    },
    {
      id: 'hamstrings',
      name: 'Hamstrings (Biceps Femoris / Semitendinosus)',
      d: 'M106,325 Q145,330 145,360 L140,445 Q115,450 102,410 Z M194,325 Q155,330 155,360 L160,445 Q185,450 198,410 Z',
      labelPos: [150, 385],
    },
    {
      id: 'calves',
      name: 'Gastrocnemius & Soleus (Calves)',
      d: 'M102,455 Q125,460 120,545 L106,550 Q90,500 102,455 Z M198,455 Q175,460 180,545 L194,550 Q210,500 198,455 Z',
      labelPos: [150, 500],
    },
  ];

  const currentZones = activeView === 'front' ? frontZones : backZones;

  const zoneCatalog = [
    { id: 'chest', label: 'Chest (Pecs)', tag: 'Upper Body' },
    { id: 'shoulders', label: 'Shoulders (Delts)', tag: 'Upper Body' },
    { id: 'biceps', label: 'Biceps & Arms', tag: 'Arms' },
    { id: 'triceps', label: 'Triceps', tag: 'Arms' },
    { id: 'lats', label: 'Lats (V-Taper)', tag: 'Back' },
    { id: 'upper_back', label: 'Upper Back & Rhomboids', tag: 'Back' },
    { id: 'lower_back', label: 'Lower Back & Spine', tag: 'Posterior' },
    { id: 'core', label: 'Abs & Core Stability', tag: 'Torso' },
    { id: 'quadriceps', label: 'Quadriceps (Thighs)', tag: 'Lower Body' },
    { id: 'hamstrings', label: 'Hamstrings', tag: 'Lower Body' },
    { id: 'glutes', label: 'Glutes', tag: 'Lower Body' },
    { id: 'calves', label: 'Calves & Soleus', tag: 'Lower Body' },
    { id: 'neck_traps', label: 'Traps & Neck', tag: 'Upper Body' },
  ];

  return (
    <div className="flex flex-col items-center bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
            Interactive Biomechanical Anatomy
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">Select Target Muscle Group</h3>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveView('front')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'front'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Anterior (Front)
          </button>
          <button
            type="button"
            onClick={() => setActiveView('back')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'back'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Posterior (Back)
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Anatomical Map */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-3 relative bg-slate-950/60 rounded-xl border border-slate-800/80">
          <svg
            viewBox="0 0 300 580"
            className="w-full max-w-[260px] h-[440px] drop-shadow-2xl select-none"
            aria-label="Interactive Anatomical Muscle Map"
          >
            {/* Ambient Body Silhouette Guide */}
            <defs>
              <linearGradient id="bodyBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="activeZoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Head & Cranium silhouette */}
            <circle cx="150" cy="35" r="24" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />

            {/* Render all clickable muscle zones */}
            {currentZones.map((zone) => {
              const isSelected = selectedZone === zone.id;
              return (
                <g key={zone.id} className="cursor-pointer group" onClick={() => onSelectZone(zone.id)}>
                  <path
                    d={zone.d}
                    fill={isSelected ? 'url(#activeZoneGrad)' : '#1e293b'}
                    stroke={isSelected ? '#34d399' : '#334155'}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    filter={isSelected ? 'url(#activeGlow)' : undefined}
                    className="transition-all duration-300 group-hover:fill-emerald-800/80 group-hover:stroke-emerald-400"
                  />
                </g>
              );
            })}

            {/* Forearm & Hands silhouettes */}
            <path
              d="M74,228 Q60,265 52,310 L68,312 Q80,265 88,230 Z M226,228 Q240,265 248,310 L232,312 Q220,265 212,230 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* Feet silhouettes */}
            <path
              d="M98,552 L112,552 L118,572 L92,572 Z M202,552 L188,552 L182,572 L208,572 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1.2"
            />
          </svg>

          <span className="text-[11px] text-slate-400 mt-2 text-center">
            Click on any highlighted muscle segment or choose from the list
          </span>
        </div>

        {/* Quick Muscle Selector Grid */}
        <div className="md:col-span-6 flex flex-col gap-2">
          <div className="text-xs text-slate-400 font-medium mb-1">
            Currently Selected:{' '}
            <span className="text-emerald-400 font-bold uppercase tracking-wide">
              {zoneCatalog.find((z) => z.id === selectedZone)?.label || selectedZone}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {zoneCatalog.map((item) => {
              const active = selectedZone === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectZone(item.id as SelectedBodyZone)}
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs font-semibold ${
                    active
                      ? 'bg-emerald-500/15 border-emerald-500/80 text-emerald-300 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-white text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-400">{item.tag}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
