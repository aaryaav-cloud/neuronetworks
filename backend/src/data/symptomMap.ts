import type { SymptomId } from '../symptoms.js';

// How each exercise card lines up with each symptom, based on the card's
// "Benefits" (and, for cautions, its "Tips").
//
//   direct  – a benefit on the card speaks to this symptom's area or cause
//   related – no benefit names this symptom, but one supports comfort or movement
//   caution – the card's own tips warn about something this symptom makes risky;
//             the exercise is left out of that person's plan
//
// Important: every card targets tight muscles, flexibility, posture or strength.
// No card lists a benefit for nerve sensations (burning, stinging, tingling,
// numbness, electric shocks, touch sensitivity). Matches for those are marked
// "related" and say so plainly. A therapist should review this map.

export type MatchLevel = 'direct' | 'related' | 'caution';

export interface SymptomMatch {
  symptom: SymptomId;
  exercise: number; // card number
  level: MatchLevel;
  reason: string; // shown to the patient
}

const NO_DIRECT = 'No card lists a benefit for this kind of pain.';

export const SYMPTOM_MAP: SymptomMatch[] = [
  // ---- Electric-shock sensations (stingers / burners)
  { symptom: 'electric_shock', exercise: 1, level: 'related', reason: `${NO_DIRECT} This card "loosens and relaxes neck muscles," and stingers often start at the neck.` },
  { symptom: 'electric_shock', exercise: 24, level: 'related', reason: `${NO_DIRECT} This card "helps relieve tension in the shoulders and torso."` },

  // ---- Burning pain
  { symptom: 'burning', exercise: 12, level: 'related', reason: `${NO_DIRECT} With this card, "your arm will feel more relaxed."` },
  { symptom: 'burning', exercise: 1, level: 'related', reason: `${NO_DIRECT} This card "helps relieve tension in the shoulders."` },

  // ---- Stinging pain
  { symptom: 'stinging', exercise: 1, level: 'related', reason: `${NO_DIRECT} This card "helps relieve tension in the shoulders."` },
  { symptom: 'stinging', exercise: 12, level: 'related', reason: `${NO_DIRECT} With this card, "your arm will feel more relaxed."` },

  // ---- Constant sharp or stabbing shoulder pain
  { symptom: 'shoulder_stabbing', exercise: 1, level: 'direct', reason: 'Helps relieve tension in the shoulders.' },
  { symptom: 'shoulder_stabbing', exercise: 2, level: 'direct', reason: 'Loosens the teres minor, one of the rotator cuff muscles of the shoulder.' },
  { symptom: 'shoulder_stabbing', exercise: 7, level: 'direct', reason: 'Releases tightness in the upper back and shoulders and stretches the rotator cuff.' },
  { symptom: 'shoulder_stabbing', exercise: 20, level: 'direct', reason: 'Helps relieve tightness in the shoulders.' },
  { symptom: 'shoulder_stabbing', exercise: 24, level: 'direct', reason: 'Helps relieve tension in the shoulders and torso.' },
  { symptom: 'shoulder_stabbing', exercise: 5, level: 'related', reason: 'Stretches and relaxes the back of the shoulder (posterior deltoid).' },

  // ---- Deep night ache
  { symptom: 'night_ache', exercise: 12, level: 'related', reason: 'Helps your arm rest more at your side and feel more relaxed, which can make resting easier.' },
  { symptom: 'night_ache', exercise: 1, level: 'related', reason: 'Loosens and relaxes neck muscles and shoulder tension.' },
  { symptom: 'night_ache', exercise: 24, level: 'related', reason: 'Helps relieve tension in the shoulders and torso.' },

  // ---- Paresthesia (tingling / pins and needles)
  { symptom: 'paresthesia', exercise: 13, level: 'related', reason: `${NO_DIRECT} This card keeps the shoulder moving: it "helps improve shoulder flexibility and range of motion."` },
  { symptom: 'paresthesia', exercise: 14, level: 'related', reason: `${NO_DIRECT} This card keeps the shoulder moving: it "helps improve shoulder flexibility and range of motion."` },

  // ---- Numbness or loss of sensation
  { symptom: 'numbness', exercise: 13, level: 'related', reason: `${NO_DIRECT} This card keeps the shoulder moving: it "helps improve shoulder flexibility and range of motion."` },
  { symptom: 'numbness', exercise: 14, level: 'related', reason: `${NO_DIRECT} This card keeps the shoulder moving: it "helps improve shoulder flexibility and range of motion."` },

  // ---- Neuropathic allodynia (light touch hurts)
  { symptom: 'allodynia', exercise: 13, level: 'related', reason: `${NO_DIRECT} This card keeps the shoulder moving without pressing on the skin.` },
  { symptom: 'allodynia', exercise: 14, level: 'related', reason: `${NO_DIRECT} This card keeps the shoulder moving without pressing on the skin.` },
  { symptom: 'allodynia', exercise: 2, level: 'caution', reason: 'This card presses a ball into a tender spot. Its tip says it "might feel uncomfortable at first," which can be too much when light touch hurts.' },
  { symptom: 'allodynia', exercise: 1, level: 'caution', reason: 'This card asks you to hold a towel firmly over your collarbone, which presses on the skin.' },

  // ---- Chronic crushing or heavy arm pain
  { symptom: 'crushing_heavy', exercise: 12, level: 'related', reason: 'Your arm will feel more relaxed and rest more easily at your side.' },
  { symptom: 'crushing_heavy', exercise: 4, level: 'related', reason: 'Stretches the upper arm and shoulders.' },
  { symptom: 'crushing_heavy', exercise: 6, level: 'related', reason: 'Stretches the upper arms and shoulders.' },

  // ---- Traction (stretch) pain
  { symptom: 'traction', exercise: 21, level: 'related', reason: 'Works the shoulder blades without pulling on the arm.' },
  { symptom: 'traction', exercise: 23, level: 'related', reason: 'Strengthens the upper back without pulling on the arm.' },
  { symptom: 'traction', exercise: 7, level: 'caution', reason: 'This card pulls the arm with a towel. Its own warning: "Don\'t yank on the towel. Avoid overstretching your arm!"' },
  { symptom: 'traction', exercise: 12, level: 'caution', reason: 'This card stretches the arm straight, and its tip says "be very careful not to overstretch."' },
  { symptom: 'traction', exercise: 10, level: 'caution', reason: 'This card pulls the elbow toward the other arm to stretch it.' },
  { symptom: 'traction', exercise: 5, level: 'caution', reason: 'This card pulls the arm across the body. Its own warning: "Don\'t tug!"' },

  // ---- Thoracic outlet compression pain (neck / collarbone)
  { symptom: 'thoracic_outlet', exercise: 9, level: 'direct', reason: 'Stretches the front shoulder and chest, counteracts rounded shoulders, and improves posture.' },
  { symptom: 'thoracic_outlet', exercise: 22, level: 'direct', reason: 'Stretches the front shoulder, chest and back, counteracts rounded shoulders, and improves posture.' },
  { symptom: 'thoracic_outlet', exercise: 3, level: 'direct', reason: 'Stretches the front shoulder and chest, counteracts rounded shoulders, and improves posture.' },
  { symptom: 'thoracic_outlet', exercise: 8, level: 'direct', reason: 'Stretches the front shoulder and chest and counteracts rounded shoulders.' },
  { symptom: 'thoracic_outlet', exercise: 11, level: 'direct', reason: 'Stretches the front shoulder and chest and helps counteract rounded shoulders.' },
  { symptom: 'thoracic_outlet', exercise: 6, level: 'direct', reason: 'Stretches the chest (pectoral) muscles.' },
  { symptom: 'thoracic_outlet', exercise: 1, level: 'related', reason: 'Gently stretches the front of the neck, near the collarbone.' },
  { symptom: 'thoracic_outlet', exercise: 21, level: 'related', reason: 'Works the shoulder blades in good standing alignment.' },
  { symptom: 'thoracic_outlet', exercise: 23, level: 'related', reason: 'Strengthens the upper back, which supports posture.' },
  { symptom: 'thoracic_outlet', exercise: 10, level: 'caution', reason: 'This card holds the arm up overhead, which can bring on this kind of pain.' },
  { symptom: 'thoracic_outlet', exercise: 4, level: 'caution', reason: 'This card puts the arm in an overhead position, which can bring on this kind of pain.' },

  // ---- Myofascial secondary pain (sore, tight muscles)
  { symptom: 'myofascial', exercise: 1, level: 'direct', reason: 'Loosens and relaxes neck muscles and relieves shoulder tension.' },
  { symptom: 'myofascial', exercise: 2, level: 'direct', reason: 'Loosens a tight rotator cuff muscle (teres minor) by massaging the tender spot.' },
  { symptom: 'myofascial', exercise: 7, level: 'direct', reason: 'Releases tightness in the upper back and shoulders.' },
  { symptom: 'myofascial', exercise: 24, level: 'direct', reason: 'Helps relieve tension in the shoulders and torso.' },
  { symptom: 'myofascial', exercise: 20, level: 'direct', reason: 'Stretches tight shoulder muscles while working weak ones.' },
  { symptom: 'myofascial', exercise: 5, level: 'related', reason: 'Stretches and relaxes the back and the back of the shoulder.' },
  { symptom: 'myofascial', exercise: 15, level: 'related', reason: 'Builds endurance in the shoulder and back muscles.' },
];
