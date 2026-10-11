import React, { useState } from 'react';
import { UnitSystem, BodyAnalysisResult } from '../types';
import {
  AlertCircle,
  Activity,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  BookmarkPlus,
  Printer,
  RotateCcw,
  Pill,
  Dumbbell,
  Compass,
} from 'lucide-react';

interface FullBodyAnalyzerProps {
  unitSystem: UnitSystem;
  useHighThinking: boolean;
  onSaveProtocol: (title: string, data: any) => void;
}

export const FullBodyAnalyzer: React.FC<FullBodyAnalyzerProps> = ({
  unitSystem,
  useHighThinking,
  onSaveProtocol,
}) => {
  // Form State
  const [heightMetric, setHeightMetric] = useState<number>(178);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(10);

  const [weightMetric, setWeightMetric] = useState<number>(76);
  const [weightLbs, setWeightLbs] = useState<number>(168);

  const [gender, setGender] = useState<string>('Male');
  const [bodyFrame, setBodyFrame] = useState<string>('Medium frame (balanced limb ratios)');
  const [dailyActivity, setDailyActivity] = useState<string>('Desk bound / Sedentary (7-9 hrs sitting)');
  const [painLocation, setPainLocation] = useState<string>('Lower Back & Pelvis');
  const [fitnessGoal, setFitnessGoal] = useState<string>('Alleviate joint compression & fix posture');
  const [problemDescription, setProblemDescription] = useState<string>(
    'Lower back aches after sitting 30 minutes, shoulders roll forward, and hips feel tight when standing. Also feels like knees take too much pressure when climbing stairs.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BodyAnalysisResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Compute Height in cm & Weight in kg
  const activeHeightCm =
    unitSystem === 'metric'
      ? heightMetric
      : Math.round((heightFeet * 12 + heightInches) * 2.54);

  const activeWeightKg =
    unitSystem === 'metric' ? weightMetric : Math.round(weightLbs * 0.453592);

  // Quick mathematical estimations
  const calculatedBmi =
    activeHeightCm > 0
      ? (activeWeightKg / Math.pow(activeHeightCm / 100, 2)).toFixed(1)
      : '0';

  const quickTemplates = [
    {
      title: 'Tall Stature & Lumbar Strain',
      desc: 'I am tall with long limbs; lower back aches during standing and deadlifts, forward head posture.',
      loc: 'Lower Back & Spine',
    },
    {
      title: 'Desk Posture & Shoulder Impingement',
      desc: 'Shoulders slump forward, sharp pinching when lifting arms overhead, chronic neck tension.',
      loc: 'Shoulders & Neck',
    },
    {
      title: 'Anterior Pelvic Tilt & Knee Cave',
      desc: 'Exaggerated lower back arch, protruding belly, knees cave inward during squats or walking.',
      loc: 'Hips, Pelvis & Knees',
    },
    {
      title: 'Sciatic Discomfort & Piriformis Spasm',
      desc: 'Shooting tingling from glute down hamstring after driving or sitting on hard chairs.',
      loc: 'Glutes & Hamstrings',
    },
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription.trim()) {
      setError('Please provide a description of your physical complaint or body structure concern.');
      return;
    }

    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/analyze-body', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heightCm: activeHeightCm,
          weightKg: activeWeightKg,
          gender,
          bodyFrame,
          dailyActivity,
          painLocation,
          fitnessGoal,
          problemDescription,
          useHighThinking,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to complete analysis');
      }

      const data: BodyAnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while connecting to the biomechanics engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveProtocol(`Full Body Scan - ${result.problemDiagnosis.primaryIssue}`, {
      type: 'full-body',
      timestamp: new Date().toISOString(),
      heightCm: activeHeightCm,
      weightKg: activeWeightKg,
      result,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Comprehensive Anthropometric Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3 tracking-tight">
            Analyze Body Structure, Height Levers & Chronic Symptoms
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Input your exact stature, limb proportions, and physical discomfort. Our biomechanical AI engine analyzes your center of mass, moment arms, and overactive muscle compensations to formulate a clinical treatment plan, corrective exercises, and targeted supplements.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-slate-400 block">Height Lever Analysis</span>
              <span className="text-white font-bold">Moment Arm Math</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-slate-400 block">Postural Diagnosis</span>
              <span className="text-white font-bold">Imbalance Mapping</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-slate-400 block">Corrective Exercises</span>
              <span className="text-white font-bold">Form & Tempo Cues</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-slate-400 block">Clinical Supplements</span>
              <span className="text-white font-bold">Tissue & Joint Repair</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Form */}
      <form onSubmit={handleAnalyze} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            1. Anthropometric Measurements & Structural Build
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Height and limb lengths directly dictate gravitational load on your spine and joints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Height Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Height {unitSystem === 'metric' ? '(cm)' : '(Feet & Inches)'}
            </label>
            {unitSystem === 'metric' ? (
              <div className="relative">
                <input
                  type="number"
                  min={120}
                  max={240}
                  value={heightMetric}
                  onChange={(e) => setHeightMetric(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">cm</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    min={4}
                    max={7}
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">ft</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={heightInches}
                    onChange={(e) => setHeightInches(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">in</span>
                </div>
              </div>
            )}
            <span className="text-[11px] text-slate-400 block">
              Active: {activeHeightCm} cm (~{(activeHeightCm / 30.48).toFixed(1)} ft)
            </span>
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Body Weight {unitSystem === 'metric' ? '(kg)' : '(lbs)'}
            </label>
            {unitSystem === 'metric' ? (
              <div className="relative">
                <input
                  type="number"
                  min={35}
                  max={250}
                  value={weightMetric}
                  onChange={(e) => setWeightMetric(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">kg</span>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="number"
                  min={77}
                  max={550}
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">lbs</span>
              </div>
            )}
            <span className="text-[11px] text-slate-400 block">
              Active: {activeWeightKg} kg (~{(activeWeightKg * 2.20462).toFixed(1)} lbs) · BMI: {calculatedBmi}
            </span>
          </div>

          {/* Biological Sex */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Biological Sex / Hip Q-Angle</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="Male">Male (Narrower pelvis, lower Q-angle)</option>
              <option value="Female">Female (Broader pelvis, wider Q-angle & knee torque)</option>
              <option value="Other">Other / Individual Proportions</option>
            </select>
            <span className="text-[11px] text-slate-400 block">Calibrates pelvis-to-knee alignment vectors</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bone Frame Build */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Bone Frame & Limb Ratios</label>
            <select
              value={bodyFrame}
              onChange={(e) => setBodyFrame(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="Ectomorph - Long limbs, narrow ribcage, delicate joints">
                Long Limbs / Narrow Joint Frame (High lever torque)
              </option>
              <option value="Mesomorph - Balanced limb ratios, athletic frame">
                Medium Frame / Balanced Limb Ratios
              </option>
              <option value="Endomorph - Broad dense ribcage, shorter thick levers">
                Heavy Dense Frame / Shorter Levers (High compressive load)
              </option>
              <option value="Long torso with relatively short legs">Long Torso / Short Legs</option>
              <option value="Short torso with disproportionately long legs">Short Torso / Long Legs (Long Femurs)</option>
            </select>
          </div>

          {/* Daily Activity */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Daily Ergonomics & Activity</label>
            <select
              value={dailyActivity}
              onChange={(e) => setDailyActivity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="Desk bound / Sedentary (7-9 hrs sitting)">Desk Bound / Sedentary (7-9 hrs sitting)</option>
              <option value="Standing occupation (cashier, retail, teacher)">Standing Occupation (Static foot & lumbar load)</option>
              <option value="Moderate active (walking, light fitness)">Moderate Active (Light walking & gym)</option>
              <option value="Heavy manual labor / Repetitive lifting">Heavy Manual Labor / Repetitive Lifting</option>
              <option value="Athlete / Heavy strength training">Competitive Athlete / Heavy Weightlifting</option>
            </select>
          </div>

          {/* Primary Pain Location */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Primary Pain / Tension Focus</label>
            <select
              value={painLocation}
              onChange={(e) => setPainLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="Lower Back & Pelvis">Lower Back & Pelvis (Lumbar disc / SI Joint)</option>
              <option value="Neck & Upper Traps">Neck & Upper Traps (Cervical text-neck)</option>
              <option value="Shoulders & Rotator Cuff">Shoulders & Rotator Cuff (Anterior impingement)</option>
              <option value="Knees & Patellar Tendon">Knees & Patella (Tracking issues / Patellar strain)</option>
              <option value="Hips & Glutes">Hips & Glutes (Hip flexor tightness / Piriformis)</option>
              <option value="Thoracic Spine & Ribcage">Thoracic Spine & Ribcage (Mid-back hunch)</option>
              <option value="Ankles & Feet">Ankles & Feet (Flat feet / Pronation / Achilles)</option>
              <option value="Full Body Stiffness">Full Body / Generalized Postural Fatigue</option>
            </select>
          </div>
        </div>

        {/* Quick Example Clickers */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400">Quick Clinical Problem Templates</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {quickTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setProblemDescription(t.desc);
                  setPainLocation(t.loc);
                }}
                className="text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-slate-700 transition-all text-xs"
              >
                <div className="font-bold text-white mb-0.5">{t.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Tell Your Problem & Symptoms According to Your Body Structure *
          </label>
          <textarea
            rows={4}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Describe what hurts, when it hurts (e.g. after sitting, when squatting, morning stiffness), your posture habits, and any specific structural quirks..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 focus:outline-none placeholder:text-slate-600"
            required
          />
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Biomechanical Engine Notice</p>
              <p className="text-red-300 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>
              Engine: {useHighThinking ? 'Gemini 3.1 Pro (Deep Biomechanical Reasoning)' : 'Gemini 3.8 Flash (High Speed)'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Computing Levers & Formulating Protocol...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Full Biomechanical Analysis</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results View */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div>
              <span className="text-xs text-slate-400 font-medium">Diagnostic Report Generated</span>
              <h2 className="text-base font-bold text-white">
                {result.problemDiagnosis.primaryIssue}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Save Protocol</span>
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

          {/* Section 1: Biomechanical Metrics & Root Diagnosis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Structural Metrics */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Anthropometric Metrics</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">BMI & Classification</span>
                  <div className="text-lg font-extrabold text-white">{result.bodyMetrics.bmi}</div>
                  <span className="text-xs text-emerald-400 font-medium">{result.bodyMetrics.bmiCategory}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Ponderal Index</span>
                  <div className="text-lg font-extrabold text-white">
                    {result.bodyMetrics.ponderalIndex || (activeWeightKg / Math.pow(activeHeightCm / 100, 3)).toFixed(2)}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{result.bodyMetrics.structuralType}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-teal-300 block">Limb Levers & Moment Arms</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.bodyMetrics.leverAnalysis}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-emerald-300 block">Height-Specific Implication</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.bodyMetrics.heightBiomechanicalImplications}
                </p>
              </div>
            </div>

            {/* Problem Diagnosis */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>Clinical Biomechanical Diagnosis</span>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
                    result.problemDiagnosis.riskLevel === 'Low'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : result.problemDiagnosis.riskLevel === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {result.problemDiagnosis.riskLevel} Risk Level
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Root Biomechanical Cause</span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {result.problemDiagnosis.biomechanicalRootCause}
                </p>
              </div>

              {/* Overactive vs Underactive Muscle Imbalances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Overactive / Shortened (Needs Release)
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {result.problemDiagnosis.affectedMusclesOveractive.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Underactive / Inhibited (Needs Activation)
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {result.problemDiagnosis.affectedMusclesUnderactive.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Joint Stressors */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 block mb-1.5">Critical Joint Stress Points</span>
                <div className="flex flex-wrap gap-2">
                  {result.problemDiagnosis.jointStressors.map((j, i) => (
                    <span key={i} className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">
                      {j}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Multi-Phase Treatment & Recovery Protocol */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Therapeutic Pathway
              </span>
              <h3 className="text-xl font-bold text-white">Phased Treatment & De-Loading Protocol</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {result.treatmentPlan.map((phase, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                        {phase.phase}
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        {phase.frequency}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{phase.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{phase.description}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Recovery Modality</span>
                      <span className="text-slate-300 font-medium">{phase.recoveryProtocol}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Ergonomic Correction</span>
                      <span className="text-slate-300 font-medium">{phase.ergonomicAdvice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Tailored Corrective Exercises */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-teal-400 font-bold flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4" />
                Corrective Biomechanics
              </span>
              <h3 className="text-xl font-bold text-white">Prescribed Corrective Exercises & Form Cues</h3>
              <p className="text-xs text-slate-400 mt-1">
                Calibrated to your height and limb levers to strengthen stabilizers and eliminate compressive torque.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {result.correctiveExercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-emerald-400 font-bold block">{exercise.targetMuscle}</span>
                      <h4 className="text-base font-bold text-white">{exercise.name}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-200 block">
                        {exercise.sets} × {exercise.reps}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Tempo: {exercise.tempo}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{exercise.purpose}</p>

                  {/* Biomechanical cues */}
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-teal-300 block">Biomechanical Execution Cues:</span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {exercise.biomechanicalCues.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-emerald-400 font-bold block">Video / Form Tip</span>
                      <span className="text-slate-300 text-[11px]">{exercise.videoDemonstrationTip}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40">
                      <span className="text-[10px] text-rose-400 font-bold block">What to Avoid</span>
                      <span className="text-rose-200 text-[11px]">{exercise.whatToAvoid}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Evidence-Based Supplement Protocol */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                <Pill className="w-4 h-4" />
                Targeted Nutritional Pharmacology
              </span>
              <h3 className="text-xl font-bold text-white">Targeted Supplement & Tissue Healing Protocol</h3>
              <p className="text-xs text-slate-400 mt-1">
                Nutrients specifically chosen to support synovial fluid, ligament tensile strength, and muscle relaxation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {result.supplementProtocol.map((supp, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {supp.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{supp.dosage}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{supp.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{supp.biologicalMechanism}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Optimal Timing</span>
                      <span className="text-slate-200 font-medium">{supp.optimalTiming}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Why For Your Body Structure
                      </span>
                      <span className="text-teal-300 text-[11px]">{supp.whyItWorksForThisStructure}</span>
                    </div>
                    {supp.safetyNote && (
                      <div className="text-[10px] text-amber-300/90 bg-amber-950/30 p-1.5 rounded border border-amber-900/30">
                        {supp.safetyNote}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Lifestyle & Postural Adjustments */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white">Daily Postural & Ergonomic Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.lifestyleAndPosturalAdjustments.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-3 text-amber-200/90 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-300 block uppercase tracking-wide">
                Educational Biomechanical Notice
              </span>
              <p className="text-slate-300 leading-relaxed">{result.medicalDisclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
