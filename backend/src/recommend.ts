import { EXERCISES, type Exercise } from './data/exercises.js';
import { SYMPTOM_MAP, type SymptomMatch } from './data/symptomMap.js';
import { SYMPTOM_TITLES, type SymptomId } from './symptoms.js';

// Builds today's plan from the check-in.
//
// 1. The 1–10 rating sets how much and how hard:
//      1–3  → up to 2 gentle exercises
//      4–6  → up to 3 gentle or moderate exercises
//      7–10 → up to 5 exercises of any effort
//    (The deck suggests beginners start with 2–5 cards per session.)
// 2. Exercises with a "caution" for any chosen symptom are left out.
// 3. Each remaining exercise scores 2 per "direct" match and 1 per "related"
//    match. Highest score first; ties go to the gentler card.
// 4. With no symptoms chosen (or no matches), a gentle starter set is used.

export interface PlanReason {
  symptom: SymptomId;
  symptomTitle: string;
  level: 'direct' | 'related';
  reason: string;
}

export interface PlanExercise extends Exercise {
  score: number;
  reasons: PlanReason[];
}

export interface Plan {
  message: string;
  limit: number;
  exercises: PlanExercise[];
  skipped: { id: number; name: string; symptomTitle: string; reason: string }[];
}

const STARTER_SET = [1, 9, 13, 22, 3]; // gentle, no equipment beyond a towel or stick

function bandFor(rating: number): { limit: number; maxEffort: number } {
  if (rating <= 3) return { limit: 2, maxEffort: 1 };
  if (rating <= 6) return { limit: 3, maxEffort: 2 };
  return { limit: 5, maxEffort: 3 };
}

export function buildPlan(rating: number, symptoms: SymptomId[]): Plan {
  const { limit, maxEffort } = bandFor(rating);
  const chosen = new Set(symptoms);
  const matches = SYMPTOM_MAP.filter((m) => chosen.has(m.symptom));

  const cautions = new Map<number, SymptomMatch>();
  for (const m of matches) if (m.level === 'caution' && !cautions.has(m.exercise)) cautions.set(m.exercise, m);

  const byId = new Map(EXERCISES.map((e) => [e.id, e]));
  const scored = new Map<number, PlanExercise>();
  for (const m of matches) {
    if (m.level === 'caution' || cautions.has(m.exercise)) continue;
    const ex = byId.get(m.exercise);
    if (!ex || ex.effort > maxEffort) continue;
    const entry = scored.get(ex.id) ?? { ...ex, score: 0, reasons: [] };
    entry.score += m.level === 'direct' ? 2 : 1;
    entry.reasons.push({ symptom: m.symptom, symptomTitle: SYMPTOM_TITLES[m.symptom], level: m.level, reason: m.reason });
    scored.set(ex.id, entry);
  }

  let exercises = [...scored.values()]
    .sort((a, b) => b.score - a.score || a.effort - b.effort || a.id - b.id)
    .slice(0, limit);

  const matchedCount = exercises.length;
  const onlyRelated = matchedCount > 0 && exercises.every((e) => e.reasons.every((r) => r.level === 'related'));

  // Fill any open slots with gentle general exercises (no reasons attached).
  for (const id of STARTER_SET) {
    if (exercises.length >= limit) break;
    const e = byId.get(id)!;
    if (e.effort > maxEffort || cautions.has(id) || exercises.some((x) => x.id === id)) continue;
    exercises.push({ ...e, score: 0, reasons: [] });
  }

  const skipped = [...cautions.values()].map((m) => ({
    id: m.exercise,
    name: byId.get(m.exercise)!.name,
    symptomTitle: SYMPTOM_TITLES[m.symptom],
    reason: m.reason,
  }));

  let message: string;
  if (rating <= 3) {
    message = "Today sounds hard, so we kept it short and gentle. If your pain is new or much worse than usual, contact your care team before exercising.";
  } else if (rating <= 6) {
    message = 'Here are a few exercises picked for how you feel today. Go slowly and stop if anything hurts.';
  } else {
    message = "You're feeling good today, so this set can include more exercises and more effort. Go at your own pace.";
  }
  if (chosen.size === 0) {
    message += ' You did not pick any symptoms, so these are gentle general exercises.';
  } else if (matchedCount === 0) {
    message += ' None of the cards lists a benefit for the symptoms you chose, so these are gentle general exercises. Ask your therapist which cards fit you best.';
  } else if (onlyRelated) {
    message += ' The cards focus on tight muscles, flexibility and posture. None of them names your symptoms directly, so ask your therapist which cards fit you best.';
  }

  return { message, limit, exercises, skipped };
}
