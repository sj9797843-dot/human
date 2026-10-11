import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Full Body Structure & Problem Biomechanical Analysis
app.post('/api/analyze-body', async (req, res) => {
  try {
    const {
      heightCm,
      weightKg,
      gender,
      bodyFrame,
      problemDescription,
      painLocation,
      dailyActivity,
      fitnessGoal,
      useHighThinking = true,
    } = req.body;

    if (!problemDescription || !heightCm || !weightKg) {
      return res.status(400).json({ error: 'Height, weight, and problem description are required.' });
    }

    const systemInstruction = `You are a world-class clinical biomechanist, orthopedic rehabilitation specialist, and sports scientist.
Your role is to deeply analyze human body structure, height-to-limb levers, anthropometric proportions, and reported physical complaints/symptoms.
You explain root biomechanical causes, recommend targeted therapeutic treatments, prescribe corrective exercises adapted to lever lengths, and formulate an evidence-based supplement and nutrition protocol.
Be compassionate, medically sound, precise, and practical. Always provide an unequivocal medical disclaimer that this analysis is educational and should not replace emergency medical care.

Output MUST be valid JSON adhering strictly to this structure:
{
  "bodyMetrics": {
    "bmi": number,
    "bmiCategory": string,
    "ponderalIndex": number,
    "structuralType": string,
    "leverAnalysis": string,
    "heightBiomechanicalImplications": string
  },
  "problemDiagnosis": {
    "primaryIssue": string,
    "biomechanicalRootCause": string,
    "affectedMusclesOveractive": string[],
    "affectedMusclesUnderactive": string[],
    "jointStressors": string[],
    "riskLevel": "Low" | "Moderate" | "Elevated"
  },
  "treatmentPlan": [
    {
      "phase": string,
      "title": string,
      "description": string,
      "frequency": string,
      "recoveryProtocol": string,
      "ergonomicAdvice": string
    }
  ],
  "correctiveExercises": [
    {
      "name": string,
      "targetMuscle": string,
      "purpose": string,
      "sets": string,
      "reps": string,
      "tempo": string,
      "biomechanicalCues": string[],
      "videoDemonstrationTip": string,
      "whatToAvoid": string
    }
  ],
  "supplementProtocol": [
    {
      "name": string,
      "category": string,
      "dosage": string,
      "optimalTiming": string,
      "biologicalMechanism": string,
      "whyItWorksForThisStructure": string,
      "foodSources": string[],
      "safetyNote": string
    }
  ],
  "lifestyleAndPosturalAdjustments": string[],
  "medicalDisclaimer": string
}`;

    const prompt = `Analyze this individual's body structure, biomechanics, and reported issue:
- Height: ${heightCm} cm (${(heightCm / 30.48).toFixed(1)} ft)
- Weight: ${weightKg} kg (${(weightKg * 2.20462).toFixed(1)} lbs)
- Biological Sex/Gender: ${gender || 'Unspecified'}
- Body Frame / Bone Build: ${bodyFrame || 'Medium frame'}
- Daily Activity Level / Occupation: ${dailyActivity || 'Sedentary/Desk bound'}
- Primary Fitness / Health Goal: ${fitnessGoal || 'Pain relief & structural balance'}
- Pain / Discomfort Location: ${painLocation || 'General'}
- Reported Problem & Symptoms: "${problemDescription}"

Analyze their height and body size impact on their physical structure (e.g. spinal load, knee torque, moment arms, posture imbalances).
Deliver an in-depth diagnosis of what's happening, a multi-phase treatment protocol, specific exercises with biomechanical cues calibrated to their stature, and evidence-based supplements that aid tissue healing, joint lubrication, or muscular recovery.`;

    let response;
    const modelToUse = useHighThinking ? 'gemini-3.1-pro-preview' : 'gemini-3.8-flash';

    try {
      const config: any = {
        systemInstruction,
        responseMimeType: 'application/json',
      };

      if (useHighThinking) {
        config.thinkingConfig = {
          thinkingLevel: ThinkingLevel.HIGH,
        };
      }

      response = await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config,
      });
    } catch (modelErr: any) {
      console.warn(`Primary model ${modelToUse} failed, falling back to gemini-3.8-flash:`, modelErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
    }

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-body:', error);
    res.status(500).json({ error: error.message || 'Failed to complete body analysis' });
  }
});

// Targeted Single Body Part Analysis, Hypertrophy & Supplement Diet Plan
app.post('/api/analyze-body-part', async (req, res) => {
  try {
    const {
      bodyPart,
      heightCm,
      weightKg,
      bodyFrame,
      currentLimitationOrGoal,
      experienceLevel,
      useHighThinking = true,
    } = req.body;

    if (!bodyPart) {
      return res.status(400).json({ error: 'bodyPart is required' });
    }

    const systemInstruction = `You are an elite biomechanist, hypertrophy researcher, and sports nutrition specialist.
The user wants to analyze a SPECIFIC body part (e.g., Chest, Biceps, Lats, Quads, Calves, Shoulders, Glutes, Hamstrings, Triceps, Abs/Core, Neck/Traps).
They need to:
1. Understand how their specific height, limb lengths, bone frame, and insertions impact growth for this body part.
2. Understand the deep importance and physiological role of supplements for muscle size, protein synthesis, myofibrillar hypertrophy, recovery, and nutrient partitioning.
3. Master how to increase its size through progressive mechanical tension, optimal range of motion, and structural biomechanics.
4. Receive a prioritized exercise list customized to their height and structure (compounds, stretch-mediated isolations, execution cues).
5. Receive a complete supplement diet plan with macro targets, meal timings, whole foods, and synchronized supplement intake.

Output MUST be valid JSON adhering strictly to this structure:
{
  "partOverview": {
    "name": string,
    "anatomicalFocus": string,
    "insertionAndLeverNotes": string,
    "heightSpecificGrowthChallenge": string,
    "growthPotentialScore": number
  },
  "supplementImportance": {
    "coreConcept": string,
    "whySupplementsMatterForGrowth": string,
    "nutrientPartitioningRole": string,
    "cellularMechanisms": string[],
    "recommendedStack": [
      {
        "supplement": string,
        "dosage": string,
        "timing": string,
        "clinicalBenefit": string,
        "priorityLevel": "Essential" | "Highly Recommended" | "Advanced Optimization"
      }
    ]
  },
  "sizeGrowthStrategy": {
    "mechanicalTensionFocus": string,
    "optimalVolumeWeeklySets": string,
    "optimalFrequencyPerWeek": string,
    "progressiveOverloadCue": string,
    "mindMuscleConnectionHack": string,
    "commonStickingPoints": string[]
  },
  "tailoredExercises": [
    {
      "name": string,
      "tier": "primary_compound" | "isolation" | "stretch_mediated",
      "targetHead": string,
      "sets": string,
      "reps": string,
      "restPeriod": string,
      "executionCue": string,
      "heightSpecificAdjustment": string,
      "commonMistake": string
    }
  ],
  "supplementDietPlan": {
    "dailyCalorieTargetAdvice": string,
    "macroBreakdown": {
      "proteinGrams": number,
      "carbsGrams": number,
      "fatsGrams": number,
      "hydrationLiters": number
    },
    "mealPlan": [
      {
        "timeOfDay": string,
        "mealName": string,
        "wholeFoods": string[],
        "targetedSupplements": string[],
        "physiologicalGoal": string
      }
    ]
  },
  "recoveryAndMobility": [
    {
      "technique": string,
      "frequency": string,
      "reason": string
    }
  ]
}`;

    const prompt = `Analyze this specific body part for size growth, biomechanics, and nutrition:
- Body Part: "${bodyPart}"
- Height: ${heightCm ? `${heightCm} cm` : 'Average (175 cm)'}
- Weight: ${weightKg ? `${weightKg} kg` : '75 kg'}
- Frame Build: ${bodyFrame || 'Medium frame'}
- Experience Level: ${experienceLevel || 'Intermediate'}
- User's Goal / Current Limitation for this part: "${currentLimitationOrGoal || 'Maximizing size and fixing plateau'}"

Provide an anatomical deep dive on how someone of this height and stature must train this muscle to trigger hypertrophy, explain the exact science of why specific supplements are crucial for this muscle tissue synthesis, and deliver an exact workout schedule and supplement diet plan.`;

    let response;
    const modelToUse = useHighThinking ? 'gemini-3.1-pro-preview' : 'gemini-3.8-flash';

    try {
      const config: any = {
        systemInstruction,
        responseMimeType: 'application/json',
      };

      if (useHighThinking) {
        config.thinkingConfig = {
          thinkingLevel: ThinkingLevel.HIGH,
        };
      }

      response = await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config,
      });
    } catch (modelErr: any) {
      console.warn(`Primary model ${modelToUse} failed for body part, falling back to gemini-3.8-flash:`, modelErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
    }

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-body-part:', error);
    res.status(500).json({ error: error.message || 'Failed to complete body part analysis' });
  }
});

// Curated Educational Supplement Reference Directory
app.get('/api/supplements-directory', (_req, res) => {
  const directory = [
    {
      id: 'creatine-monohydrate',
      name: 'Creatine Monohydrate',
      category: 'Hypertrophy & Cellular ATP',
      evidenceGrade: 'Grade A (Gold Standard)',
      primaryRole: 'Replenishes phosphocreatine stores in myocytes, accelerating ATP re-synthesis during high-tension contractions and increasing intracellular hydration.',
      standardDose: '3–5 grams daily consistently (no loading required).',
      bestTiming: 'Post-workout with carbohydrates or morning with first meal.',
      structureApplication: 'Crucial for taller lifters with longer lever arms who require prolonged time under tension to achieve failure.',
      commonMyths: 'Does not cause hair loss, kidney damage in healthy individuals, or subcutaneous water bloating.',
    },
    {
      id: 'whey-isolate',
      name: 'Whey Protein Isolate / Micellar Casein',
      category: 'Muscle Protein Synthesis (MPS)',
      evidenceGrade: 'Grade A',
      primaryRole: 'Supplies high leucine (>2.7g per serving) to trigger the mTORC1 signaling cascade for post-damage myofibrillar repair.',
      standardDose: '25–40 grams per serving to reach leucine threshold.',
      bestTiming: 'Within 2 hours pre- or post-resistance training, and before sleep (casein).',
      structureApplication: 'Essential when caloric surplus or maintenance requires high bioavailability without digestive distress.',
      commonMyths: 'Protein timing window is wider than 30 minutes; total 24-hour distribution matters most.',
    },
    {
      id: 'omega-3',
      name: 'Omega-3 Fish Oil (EPA & DHA)',
      category: 'Joint Health & Systemic Anti-Inflammatory',
      evidenceGrade: 'Grade A',
      primaryRole: 'Resolves neuro-inflammatory prostaglandins, protects synovial joint fluid, enhances muscle anabolic sensitivity to amino acids.',
      standardDose: '2,000–3,000 mg combined EPA+DHA daily.',
      bestTiming: 'With a dietary fat-containing meal for maximum lipid absorption.',
      structureApplication: 'Protects knee and spinal joints from compressive shear stress in tall or heavy individuals.',
      commonMyths: 'Plant ALA (flax) has only a ~5% conversion rate to DHA; marine sources are superior for joint recovery.',
    },
    {
      id: 'd3-k2',
      name: 'Vitamin D3 + K2 (MK-7)',
      category: 'Bone Density & Endocrine Support',
      evidenceGrade: 'Grade A',
      primaryRole: 'Regulates calcium absorption into bone mineral matrix (K2 prevents vascular calcification) while supporting androgen receptors and immune balance.',
      standardDose: '2,000–5,000 IU D3 + 100 mcg K2 daily.',
      bestTiming: 'Morning with dietary fat.',
      structureApplication: 'Fortifies spinal vertebral bodies and long femurs under heavy compound axial loads.',
      commonMyths: 'D3 without K2 can lead to ectopic soft-tissue calcium deposition over long high-dose regimens.',
    },
    {
      id: 'magnesium-glycinate',
      name: 'Magnesium Bisglycinate',
      category: 'Neuromuscular Relaxation & Deep Sleep',
      evidenceGrade: 'Grade A',
      primaryRole: 'Blocks NMDA excitation receptors to calm peripheral motor neurons, relieves muscle cramps, and supports stage-4 slow-wave growth hormone release.',
      standardDose: '200–400 mg elemental magnesium.',
      bestTiming: '30–60 minutes before bedtime.',
      structureApplication: 'Relieves hypertonic postural muscles (traps, hip flexors, lumbar erectors) that tighten during static sitting.',
      commonMyths: 'Magnesium oxide has ~4% bioavailability and causes laxative effects; glycinate/malate are far superior.',
    },
    {
      id: 'curcumin-piperine',
      name: 'Curcumin (BCM-95 or with Piperine)',
      category: 'Tissue Healing & Pain Modulation',
      evidenceGrade: 'Grade B+',
      primaryRole: 'Inhibits COX-2 and NF-kB pathways, reducing chronic tendon and cartilage soreness without blunting acute muscular hypertrophy signaling.',
      standardDose: '500–1,000 mg standardized extract with 5mg black pepper extract.',
      bestTiming: 'Evening with meals.',
      structureApplication: 'Helps manage persistent tendonitis, patellar tracking irritation, and rotator cuff impingement.',
      commonMyths: 'Unlike pharmaceutical NSAIDs (ibuprofen), curcumin does not blunt long-term muscle hypertrophy adaptation.',
    },
    {
      id: 'collagen-vitc',
      name: 'Hydrolyzed Collagen Peptides + Vitamin C',
      category: 'Ligament & Tendon Hypertrophy',
      evidenceGrade: 'Grade B+',
      primaryRole: 'Provides proline, glycine, and hydroxyproline cross-links needed to remodel collagen fibrils in tendons and ligaments under high tensile load.',
      standardDose: '15 grams collagen peptides + 50mg Vitamin C.',
      bestTiming: '45–60 minutes prior to targeted joint rehabilitation exercises.',
      structureApplication: 'Critical for tendons in long limbs which endure greater rotational torque during eccentric stretching.',
      commonMyths: 'Taking collagen at random times without exercise provides less localized tendon delivery; timing 45 min before rehab is key.',
    },
    {
      id: 'l-citrulline',
      name: 'L-Citrulline (Pure)',
      category: 'Nitric Oxide & Fascial Pump',
      evidenceGrade: 'Grade A',
      primaryRole: 'Elevates plasma L-arginine, boosting endothelial nitric oxide synthesis to expand capillary beds, oxygen delivery, and fascial stretch.',
      standardDose: '6–8 grams pure L-Citrulline (or 8–10g Citrulline Malate 2:1).',
      bestTiming: '30–45 minutes pre-training.',
      structureApplication: 'Enhances peripheral perfusion in long extremities (arms and calves) where blood pooling and mind-muscle connection is difficult.',
      commonMyths: 'Citrulline is significantly more effective than oral L-arginine, which undergoes first-pass hepatic degradation.',
    },
  ];
  res.json(directory);
});

// Configure Vite or serve static files
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
