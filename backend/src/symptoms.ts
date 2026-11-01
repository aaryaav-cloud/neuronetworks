// The symptom ids the check-in accepts. The frontend shows the same list
// (frontend/src/symptoms.ts); keep the two in sync when you add one.
export const SYMPTOM_TITLES = {
  electric_shock: 'Electric-shock sensations (stingers / burners)',
  burning: 'Burning pain',
  stinging: 'Stinging pain',
  shoulder_stabbing: 'Constant sharp or stabbing shoulder pain',
  night_ache: 'Deep night ache',
  paresthesia: 'Paresthesia (tingling / pins and needles)',
  numbness: 'Numbness or loss of sensation',
  allodynia: 'Neuropathic allodynia',
  crushing_heavy: 'Chronic crushing or heavy arm pain',
  traction: 'Traction (stretch) pain',
  thoracic_outlet: 'Thoracic outlet compression pain',
  myofascial: 'Myofascial secondary pain',
} as const;

export type SymptomId = keyof typeof SYMPTOM_TITLES;

export const SYMPTOM_IDS = Object.keys(SYMPTOM_TITLES) as SymptomId[];

export function isSymptomId(value: unknown): value is SymptomId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(SYMPTOM_TITLES, value);
}
