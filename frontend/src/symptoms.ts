// The pain types a patient can pick on the check-in.
// The ids must match backend/src/symptoms.ts (SYMPTOM_TITLES).
export interface Symptom {
  id: string;
  title: string;
  hint: string;
}

export const SYMPTOMS: Symptom[] = [
  { id: 'electric_shock', title: 'Electric-shock sensations (stingers / burners)', hint: 'Sudden zaps that shoot down the arm' },
  { id: 'burning', title: 'Burning pain', hint: 'A hot, burning feeling in the arm or hand' },
  { id: 'stinging', title: 'Stinging pain', hint: 'A sharp, prickly sting on the skin' },
  { id: 'shoulder_stabbing', title: 'Constant sharp or stabbing shoulder pain', hint: 'Steady stabbing pain in the shoulder' },
  { id: 'night_ache', title: 'Deep night ache', hint: 'A deep ache that gets worse at night' },
  { id: 'paresthesia', title: 'Paresthesia (tingling / pins and needles)', hint: 'Tingling, like your arm fell asleep' },
  { id: 'numbness', title: 'Numbness or loss of sensation', hint: 'Hard to feel touch, or no feeling at all' },
  { id: 'allodynia', title: 'Neuropathic allodynia', hint: 'Light touch, like clothing, feels painful' },
  { id: 'crushing_heavy', title: 'Chronic crushing or heavy arm pain', hint: 'The arm feels squeezed or very heavy' },
  { id: 'traction', title: 'Traction (stretch) pain', hint: 'Hurts when the arm is pulled or stretched' },
  { id: 'thoracic_outlet', title: 'Thoracic outlet compression pain', hint: 'Pain near the neck or collarbone, often when the arm is raised' },
  { id: 'myofascial', title: 'Myofascial secondary pain', hint: 'Sore, tight muscles around the shoulder and neck' },
];

export const MOODS = ['', 'Very bad', 'Bad', 'Pretty bad', 'Not great', 'Okay', 'A little better', 'Good', 'Pretty good', 'Very good', 'Great'];
