export type UnitSystem = 'metric' | 'imperial';

export interface BodyMetrics {
  bmi: number;
  bmiCategory: string;
  ponderalIndex: number;
  structuralType: string;
  leverAnalysis: string;
  heightBiomechanicalImplications: string;
}

export interface ProblemDiagnosis {
  primaryIssue: string;
  biomechanicalRootCause: string;
  affectedMusclesOveractive: string[];
  affectedMusclesUnderactive: string[];
  jointStressors: string[];
  riskLevel: 'Low' | 'Moderate' | 'Elevated';
}

export interface TreatmentPhase {
  phase: string;
  title: string;
  description: string;
  frequency: string;
  recoveryProtocol: string;
  ergonomicAdvice: string;
}

export interface CorrectiveExercise {
  name: string;
  targetMuscle: string;
  purpose: string;
  sets: string;
  reps: string;
  tempo: string;
  biomechanicalCues: string[];
  videoDemonstrationTip: string;
  whatToAvoid: string;
}

export interface SupplementItem {
  name: string;
  category: string;
  dosage: string;
  optimalTiming: string;
  biologicalMechanism: string;
  whyItWorksForThisStructure: string;
  foodSources: string[];
  safetyNote: string;
}

export interface BodyAnalysisResult {
  bodyMetrics: BodyMetrics;
  problemDiagnosis: ProblemDiagnosis;
  treatmentPlan: TreatmentPhase[];
  correctiveExercises: CorrectiveExercise[];
  supplementProtocol: SupplementItem[];
  lifestyleAndPosturalAdjustments: string[];
  medicalDisclaimer: string;
}

export interface BodyPartStackItem {
  supplement: string;
  dosage: string;
  timing: string;
  clinicalBenefit: string;
  priorityLevel: 'Essential' | 'Highly Recommended' | 'Advanced Optimization';
}

export interface BodyPartExercise {
  name: string;
  tier: 'primary_compound' | 'isolation' | 'stretch_mediated';
  targetHead: string;
  sets: string;
  reps: string;
  restPeriod: string;
  executionCue: string;
  heightSpecificAdjustment: string;
  commonMistake: string;
}

export interface DietMeal {
  timeOfDay: string;
  mealName: string;
  wholeFoods: string[];
  targetedSupplements: string[];
  physiologicalGoal: string;
}

export interface BodyPartAnalysisResult {
  partOverview: {
    name: string;
    anatomicalFocus: string;
    insertionAndLeverNotes: string;
    heightSpecificGrowthChallenge: string;
    growthPotentialScore: number;
  };
  supplementImportance: {
    coreConcept: string;
    whySupplementsMatterForGrowth: string;
    nutrientPartitioningRole: string;
    cellularMechanisms: string[];
    recommendedStack: BodyPartStackItem[];
  };
  sizeGrowthStrategy: {
    mechanicalTensionFocus: string;
    optimalVolumeWeeklySets: string;
    optimalFrequencyPerWeek: string;
    progressiveOverloadCue: string;
    mindMuscleConnectionHack: string;
    commonStickingPoints: string[];
  };
  tailoredExercises: BodyPartExercise[];
  supplementDietPlan: {
    dailyCalorieTargetAdvice: string;
    macroBreakdown: {
      proteinGrams: number;
      carbsGrams: number;
      fatsGrams: number;
      hydrationLiters: number;
    };
    mealPlan: DietMeal[];
  };
  recoveryAndMobility: Array<{
    technique: string;
    frequency: string;
    reason: string;
  }>;
}

export interface DirectorySupplement {
  id: string;
  name: string;
  category: string;
  evidenceGrade: string;
  primaryRole: string;
  standardDose: string;
  bestTiming: string;
  structureApplication: string;
  commonMyths: string;
}

export type SelectedBodyZone =
  | 'chest'
  | 'biceps'
  | 'triceps'
  | 'shoulders'
  | 'lats'
  | 'upper_back'
  | 'lower_back'
  | 'core'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'neck_traps';
