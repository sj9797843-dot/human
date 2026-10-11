import React, { useState } from 'react';
import { UnitSystem, SelectedBodyZone, BodyPartAnalysisResult } from '../types';
import { InteractiveBodyMap } from './InteractiveBodyMap';
import {
  Activity,
  AlertCircle,
  BookmarkPlus,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Info,
  Layers,
  Pill,
  Printer,
  Sparkles,
  Utensils,
  Zap,
} from 'lucide-react';

interface BodyPartAnalyzerProps {
  unitSystem: UnitSystem;
  useHighThinking: boolean;
  onSaveProtocol: (title: string, data: any) => void;
}

export const BodyPartAnalyzer: React.FC<BodyPartAnalyzerProps> = ({
  unitSystem,
  useHighThinking,
  onSaveProtocol,
}) => {
  const [selectedZone, setSelectedZone] = useState<SelectedBodyZone>('chest');
  const [heightMetric, setHeightMetric] = useState<number>(178);
  const [weightMetric, setWeightMetric] = useState<number>(76);
  const [bodyFrame, setBodyFrame] = useState<string>('Medium frame');
  const [experienceLevel, setExperienceLevel] = useState<string>('Intermediate (1-3 yrs lifting)');
  const [currentLimitationOrGoal, setCurrentLimitationOrGoal] = useState<string>(
    'Struggling to build thickness and upper portion; feels like shoulders and triceps take over the movement.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BodyPartAnalysisResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const zoneNames: Record<SelectedBodyZone, string> = {
    chest: 'Pectoralis Major & Minor (Chest)',
    biceps: 'Biceps Brachii & Brachialis (Arms)',
    triceps: 'Triceps Brachii (Long, Lateral & Medial Heads)',
    shoulders: 'Deltoids (Anterior, Lateral & Posterior Shoulders)',
    lats: 'Latissimus Dorsi (V-Taper & Back Width)',
    upper_back: 'Rhomboids, Traps & Mid-Back Density',
    lower_back: 'Erector Spinae & Lumbar Stabilizers',
    core: 'Rectus Abdominis, Obliques & Deep Core',
    quadriceps: 'Quadriceps Femoris (Leg Fullness & Sweep)',
    hamstrings: 'Hamstrings (Posterior Chain & Knee Flexors)',
    glutes: 'Gluteus Maximus, Medius & Hip Extensors',
    calves: 'Gastrocnemius & Soleus (Lower Leg Density)',
    neck_traps: 'Trapezius & Cervical Musculature',
  };

  const handleZoneSelect = (zone: SelectedBodyZone) => {
    setSelectedZone(zone);
    // Suggest relevant goal preset
    const presets: Record<SelectedBodyZone, string> = {
      chest: 'Maximize upper chest shelf and inner cleavage without shoulder impingement.',
      biceps: 'Increase bicep peak and arm thickness; overcome long arm leverage deficit.',
      triceps: 'Grow horseshoe triceps lateral and long head for massive arm circumference.',
      shoulders: 'Build 3D lateral deltoid caps while protecting rotator cuffs.',
      lats: 'Widen the V-taper wingspan and improve mind-muscle connection during pulldowns.',
      upper_back: 'Thicken rhomboids and mid-traps to cure slumping posture and add back density.',
      lower_back: 'Build bulletproof lumbar erectors and de-load spinal shear stress.',
      core: 'Carve deep abdominal definition and build rotational core bracing power.',
      quadriceps: 'Develop deep outer quad sweep despite long femurs and knee stress.',
      hamstrings: 'Grow dense posterior hamstring hanging belly through stretch-mediated hypertrophy.',
      glutes: 'Build maximum glute volume and shelf without excessive quad dominance.',
      calves: 'Overcome stubborn calf genetics and high tendon insertions with loaded stretch.',
      neck_traps: 'Thicken upper traps and neck circumference for athletic presence and head stability.',
    };
    setCurrentLimitationOrGoal(presets[zone] || 'Maximize muscle size, thickness and symmetry.');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/analyze-body-part', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyPart: zoneNames[selectedZone],
          heightCm: heightMetric,
          weightKg: weightMetric,
          bodyFrame,
          experienceLevel,
          currentLimitationOrGoal,
          useHighThinking,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to complete body part analysis');
      }

      const data: BodyPartAnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with hypertrophy biomechanics engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveProtocol(`Targeted Muscle Growth - ${zoneNames[selectedZone]}`, {
      type: 'body-part',
      bodyPart: selectedZone,
      timestamp: new Date().toISOString(),
      result,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">
            Targeted Muscle Group Hypertrophy
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3 tracking-tight">
            Analyze Specific Body Parts, Size Growth Mechanics & Supplement Diet Plans
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Select an individual muscle zone on the interactive body map. Discover how your height, limb insertions, and biomechanical leverage impact that specific muscle, learn the crucial physiological role of targeted supplements, and get customized size-building exercises and a synchronized supplement meal plan.
          </p>
        </div>
      </div>

      {/* Interactive Anatomy Map & Selection Card */}
      <InteractiveBodyMap selectedZone={selectedZone} onSelectZone={handleZoneSelect} />

      {/* Analysis Configuration Form */}
      <form onSubmit={handleAnalyze} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-teal-400" />
            Calibrate Biomechanical Parameters for: <span className="text-emerald-400">{zoneNames[selectedZone]}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Tall vs shorter individuals require vastly different ranges of motion, grip widths, and exercise selections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Height (cm)</label>
            <input
              type="number"
              min={120}
              max={230}
              value={heightMetric}
              onChange={(e) => setHeightMetric(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block mt-1">~{(heightMetric / 30.48).toFixed(1)} ft</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Weight (kg)</label>
            <input
              type="number"
              min={35}
              max={220}
              value={weightMetric}
              onChange={(e) => setWeightMetric(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block mt-1">~{(weightMetric * 2.20462).toFixed(1)} lbs</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Limb Insertion / Frame</label>
            <select
              value={bodyFrame}
              onChange={(e) => setBodyFrame(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="Long levers / High tendon insertions">Long Levers / High Tendon Insertions</option>
              <option value="Medium frame / Average insertions">Medium Frame / Average Insertions</option>
              <option value="Short levers / Low full muscle bellies">Short Levers / Full Muscle Bellies</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Training Experience</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="Beginner (< 1 year)">Beginner (&lt; 1 year)</option>
              <option value="Intermediate (1-3 yrs lifting)">Intermediate (1-3 yrs lifting)</option>
              <option value="Advanced (3+ years consistent)">Advanced (3+ years consistent)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Your Growth Goal or Sticking Point for this Muscle Group
          </label>
          <textarea
            rows={3}
            value={currentLimitationOrGoal}
            onChange={(e) => setCurrentLimitationOrGoal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500 focus:outline-none placeholder:text-slate-600"
            placeholder="e.g., Struggling to feel my lats activate during pull-ups, or biceps won't grow despite doing curls..."
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>
              Engine: {useHighThinking ? 'Gemini 3.1 Pro (Deep Biomechanical Reasoning)' : 'Gemini 3.8 Flash'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Muscle Fibers & Diet Synchrony...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Analyze {zoneNames[selectedZone].split(' ')[0]} & Generate Diet Plan</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results View */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div>
              <span className="text-xs text-slate-400 font-medium">Hypertrophy Blueprint Generated</span>
              <h2 className="text-base font-bold text-white">{result.partOverview.name}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Save Blueprint</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Section 1: Anatomical Insertion & Lever Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">
                  Biomechanical Leverage Analysis
                </span>
                <h3 className="text-xl font-bold text-white">Anatomical Levers & Growth Potential</h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Growth Ceiling Score</span>
                <div className="text-lg font-extrabold text-teal-300">
                  {result.partOverview.growthPotentialScore || 92} / 100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Anatomical Insertion & Moment Arms
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.partOverview.insertionAndLeverNotes}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Height-Specific Growth Challenge
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.partOverview.heightSpecificGrowthChallenge}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Understand the Importance of Supplements for this Muscle */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block">
                  Nutritional Bioenergetics
                </span>
                <h3 className="text-xl font-bold text-white">The Scientific Importance of Supplements for Size</h3>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/30 to-slate-950 border border-emerald-500/20 space-y-3">
              <h4 className="text-sm font-bold text-emerald-300">{result.supplementImportance.coreConcept}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.supplementImportance.whySupplementsMatterForGrowth}
              </p>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  Nutrient Partitioning & Myofibrillar Repair:
                </span>
                <p className="text-xs text-teal-300/90 leading-relaxed">
                  {result.supplementImportance.nutrientPartitioningRole}
                </p>
              </div>
            </div>

            {/* Cellular Mechanisms */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Key Biological Cellular Triggers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.supplementImportance.cellularMechanisms.map((mech, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{mech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Supplement Stack for this muscle */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Recommended Size Supplement Stack</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.supplementImportance.recommendedStack.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.supplement}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          item.priorityLevel === 'Essential'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        {item.priorityLevel}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-semibold">{item.dosage}</div>
                    <div className="text-[11px] text-slate-400">Timing: {item.timing}</div>
                    <p className="text-xs text-slate-300 pt-1 leading-relaxed">{item.clinicalBenefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: How to Increase Its Size (Hypertrophy Strategy) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-teal-400 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                Hypertrophy Science
              </span>
              <h3 className="text-xl font-bold text-white">How to Increase Its Size: Mechanical Tension Blueprint</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Weekly Volume</span>
                <div className="text-base font-bold text-white">{result.sizeGrowthStrategy.optimalVolumeWeeklySets}</div>
                <span className="text-[10px] text-teal-400">Effective working sets</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Frequency Target</span>
                <div className="text-base font-bold text-white">{result.sizeGrowthStrategy.optimalFrequencyPerWeek}</div>
                <span className="text-[10px] text-teal-400">Per 7-day microcycle</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Overload Driver</span>
                <div className="text-xs font-bold text-white line-clamp-2">{result.sizeGrowthStrategy.progressiveOverloadCue}</div>
                <span className="text-[10px] text-emerald-400">Progression principle</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Mind-Muscle Hack</span>
                <div className="text-xs font-bold text-white line-clamp-2">{result.sizeGrowthStrategy.mindMuscleConnectionHack}</div>
                <span className="text-[10px] text-teal-400">Neuro-motor cue</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Primary Mechanical Tension Strategy
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {result.sizeGrowthStrategy.mechanicalTensionFocus}
              </p>
            </div>
          </div>

          {/* Section 4: Tailored Exercises for Size Growth */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4" />
                Prescribed Movement Arsenal
              </span>
              <h3 className="text-xl font-bold text-white">Size-Increasing Exercises Calibrated to Height</h3>
              <p className="text-xs text-slate-400 mt-1">
                Selected specifically to match the muscle’s line of pull and eliminate tendon strain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {result.tailoredExercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
                        {ex.tier.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {ex.sets} × {ex.reps}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                    <span className="text-[11px] text-slate-400 block">Target: {ex.targetHead}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{ex.executionCue}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-teal-300 font-bold block">Height Adjustment</span>
                      <span className="text-slate-300 text-[11px]">{ex.heightSpecificAdjustment}</span>
                    </div>
                    <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30">
                      <span className="text-[10px] text-rose-400 font-bold block">Mistake to Avoid</span>
                      <span className="text-rose-200 text-[11px]">{ex.commonMistake}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Complete Supplement Diet Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-teal-400 font-bold flex items-center gap-1.5">
                  <Utensils className="w-4 h-4" />
                  Hypertrophy Nutrition
                </span>
                <h3 className="text-xl font-bold text-white">Synchronized Supplement & Whole Food Diet Plan</h3>
              </div>

              {/* Macro Targets */}
              <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Protein</span>
                  <span className="text-emerald-400 font-bold">{result.supplementDietPlan.macroBreakdown.proteinGrams}g</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-slate-400 block text-[10px]">Carbs</span>
                  <span className="text-teal-400 font-bold">{result.supplementDietPlan.macroBreakdown.carbsGrams}g</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-slate-400 block text-[10px]">Fats</span>
                  <span className="text-amber-400 font-bold">{result.supplementDietPlan.macroBreakdown.fatsGrams}g</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-slate-400 block text-[10px]">Water</span>
                  <span className="text-sky-400 font-bold">{result.supplementDietPlan.macroBreakdown.hydrationLiters}L</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">Caloric Guideline:</span>
              {result.supplementDietPlan.dailyCalorieTargetAdvice}
            </div>

            {/* Timed Meal Plan */}
            <div className="space-y-4">
              {result.supplementDietPlan.mealPlan.map((meal, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
                >
                  <div className="md:col-span-3">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
                      {meal.timeOfDay}
                    </span>
                    <h5 className="text-sm font-bold text-white mt-0.5">{meal.mealName}</h5>
                    <span className="text-[10px] text-slate-400 block mt-1">{meal.physiologicalGoal}</span>
                  </div>

                  <div className="md:col-span-5 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300 block">Whole Foods:</span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {meal.wholeFoods.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-4 space-y-1.5 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                    <span className="text-[11px] font-bold text-emerald-400 block flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5" />
                      Timed Supplements:
                    </span>
                    <ul className="text-xs text-emerald-200/90 space-y-1">
                      {meal.targetedSupplements.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
