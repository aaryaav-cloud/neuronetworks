// The 24 exercise cards from the Michigan Medicine Brachial Plexus Program deck
// by Lynnette Rasmussen, OTRL. © 2017 Regents of the University of Michigan.
// Transcribed from photos of the cards; all exercise text, benefits and tips are theirs.
// effort: 1 = gentle, 2 = moderate, 3 = challenging.
// Generated from the card photos; edit here if a card was transcribed wrong.

export type ExerciseKind = 'stretch' | 'range' | 'strength' | 'core';

export interface Exercise {
  id: number; // the number printed on the card
  name: string;
  kind: ExerciseKind;
  effort: 1 | 2 | 3;
  need: string;
  setup: string;
  steps: string[];
  benefits: string[];
  tips: string[];
  photoFront: string | null; // original photo file name, for reference
  photoBack: string | null;
  timer: ExerciseTimer;
}

// How the guided timer runs an exercise, taken from the hold times and
// repetitions printed on each card.
//   hold  – seconds for each repetition (the stretch, hold or movement)
//   rest  – seconds to relax between repetitions
//   reps  – repetitions per side
//   sides – 2 when the card says to repeat on the other side
export interface ExerciseTimer {
  hold: number;
  rest: number;
  reps: number;
  sides: 1 | 2;
  holdCue: string;
  restCue: string;
}

const T = (hold: number, reps: number, rest: number, sides: 1 | 2, holdCue: string, restCue = 'Relax and breathe'): ExerciseTimer =>
  ({ hold, reps, rest, sides, holdCue, restCue });

const TIMERS: Record<number, ExerciseTimer> = {
  1: T(3, 6, 4, 1, 'Breathe out and gently stretch', 'Return to start'),          // hold 3, repeat 5-6
  2: T(60, 1, 0, 2, 'Press and roll gently on the ball'),                          // up to a minute, other side
  3: T(30, 3, 10, 1, 'Hold the stretch'),                                          // hold 30 s, repeat 3
  4: T(30, 3, 10, 1, 'Hold the stretch', 'Relax to start position'),               // hold 30 s, repeat 3
  5: T(3, 10, 3, 1, 'Hold the stretch'),                                           // count of 3, repeat 8-10
  6: T(3, 10, 3, 1, 'Lift and hold', 'Relax to start position'),                   // count of 3, repeat 8-10
  7: T(3, 10, 3, 1, 'Gently stretch and hold'),                                    // count of 3, repeat 8-10
  8: T(3, 10, 3, 1, 'Turn away and hold'),                                         // count to 3, repeat 8-10
  9: T(3, 10, 3, 1, 'Lean in and hold'),                                           // count to 3, repeat 8-10
  10: T(3, 10, 3, 1, 'Gentle pressure and hold'),                                  // count of 3, repeat 8-10
  11: T(30, 1, 0, 1, 'Lean forward and hold'),                                     // hold 30 s
  12: T(3, 10, 3, 1, 'Stretch and hold'),                                          // count to 3, repeat 8-10
  13: T(3, 10, 3, 1, 'Lift and hold', 'Relax to start position'),                  // count of 3, repeat 8-10
  14: T(3, 10, 3, 2, 'Push out and hold', 'Return to start'),                      // count of 3, 8-10 each side
  15: T(15, 3, 20, 1, 'Hold the plank and keep breathing', 'Rest'),                // hold 15-60 s, up to 3 times
  16: T(3, 12, 3, 1, 'Breathe out and curl up', 'Breathe in and lower slowly'),    // 12-16 reps
  17: T(3, 12, 3, 1, 'Breathe out and lift your hips', 'Breathe in and lower slowly'), // 12-16 reps
  18: T(3, 12, 3, 1, 'Breathe out and lift', 'Breathe in and lower slightly'),     // 12-16 reps
  19: T(3, 12, 3, 1, 'Breathe out and twist to one side', 'Breathe in, back to center'), // 12-16 reps
  20: T(20, 10, 10, 1, 'Walk 10 steps forward, then 10 back', 'Rest'),            // 10 steps each way, 10 times
  21: T(4, 10, 3, 1, 'Slide your arms up the wall', 'Return to start'),           // 10 reps (build to 3 sets)
  22: T(10, 4, 5, 2, 'Open your arm and breathe into your back', 'Bring your arm back'), // 3-4 each side
  23: T(2, 8, 4, 1, 'Breathe out, lift slightly and pause', 'Breathe in and lower'), // pause 2 s, 5-8 times
  24: T(30, 1, 0, 2, 'Twist and hold, breathing smoothly'),                       // up to 30 s, other side
};

const CARDS: Omit<Exercise, 'timer'>[] = [
  {
    "id": 1,
    "name": "Towel Stretch",
    "kind": "stretch",
    "effort": 1,
    "need": "Pillow case or thin large towel, approximate size of standard pillow case but not too thick.",
    "setup": "Roll the towel as if wringing out a wash cloth until it becomes tightly wound.",
    "steps": [
      "Sit up straight, shoulders down and back.",
      "Position towel as pictured, placing it over the involved side shoulder, keeping it rolled tight.",
      "Place one end of the towel behind your back, then underneath the armpit of your uninvolved side. Hold it snugly at your side.",
      "Grasp the other end of the towel that comes over your shoulder with both hands. Hold it snugly, pressing downward.",
      "Inhale through your nose to prepare for the movement.",
      "Slowly exhale, gently rolling head away from the towel until a stretch is felt in front of neck (towel side).",
      "Hold stretch for slow count of 3.",
      "Return to start position.",
      "Repeat 5-6 times."
    ],
    "benefits": [
      "Loosens and relaxes neck muscles.",
      "Helps relieve tension in the shoulders."
    ],
    "tips": [
      "Don't overstretch by pulling your head too far down. This should be a gentle stretch.",
      "Make sure you firmly hold the towel over your collarbone to help maximize the stretch.",
      "If your neck feels tight on the opposite side, you can repeat this exercise on the other shoulder."
    ],
    "photoFront": "IMG_2613",
    "photoBack": "IMG_2614"
  },
  {
    "id": 2,
    "name": "Teres Minor",
    "kind": "stretch",
    "effort": 1,
    "need": "Tennis ball, a long sock, and open space to stand against a wall.",
    "setup": "Place the ball in a long sock and push it to the bottom. Using a sock will help you have more control of the position of the ball. Place the sock over your shoulder of the involved arm. The ball should rest between your back and the wall. Make sure the ball is resting below the shoulder blade near your armpit. Hold the other end of the sock in front of you.",
    "steps": [
      "Find the tender spot below your shoulder blade, toward your armpit, and position the ball over the area.",
      "Press your back against the wall.",
      "While pressing, you can either hold still or shift side to side. This will massage the tender area.",
      "Continue rolling or pressing against the ball for up to a minute.",
      "Repeat on other side."
    ],
    "benefits": [
      "Helps loosen the teres minor muscle, one of the rotator cuff muscles."
    ],
    "tips": [
      "This exercise might feel uncomfortable at first, but the muscle will begin to relax as you repeat this exercise.",
      "You can try the above exercise while lying on the floor. You will press ball into the floor. You may not need to use the sock to control the ball in this position.",
      "If you don't have a sock, try placing ball between you and the wall."
    ],
    "photoFront": "IMG_2615",
    "photoBack": "IMG_2616"
  },
  {
    "id": 3,
    "name": "External Rotation (Table)",
    "kind": "stretch",
    "effort": 1,
    "need": "Smooth table and chair with no arms, or stool to sit on.",
    "setup": "Sit facing sideways at a table, as in the picture. Don't sit too close to the table. Place your forearm of your involved side on the table, with your elbow bent at 90 degrees. Rest your other arm on your thigh.",
    "steps": [
      "Bend forward at the waist, keeping your back straight.",
      "Make sure your elbow is in line with your shoulder when you bend forward.",
      "Press your chest toward the floor for a count of 3.",
      "Relax.",
      "You should feel a stretch in front of your chest below your collarbone.",
      "Hold for 30 seconds.",
      "Repeat 3 times."
    ],
    "benefits": [
      "Stretches the anterior shoulder and chest muscles.",
      "Counteracts tendency to round the shoulders.",
      "Improves posture."
    ],
    "tips": [
      "Keep your head in line with your shoulders."
    ],
    "photoFront": "IMG_2617",
    "photoBack": "IMG_2618"
  },
  {
    "id": 4,
    "name": "Forward Shoulder Flexion",
    "kind": "stretch",
    "effort": 1,
    "need": "Smooth table and chair with no arms, or stool to sit on.",
    "setup": "Sit upright facing the table.",
    "steps": [
      "Sit facing the table far enough away so that when you bend forward you clear your head.",
      "Place both hands on table.",
      "Slide your arms forward along the table as you bend at the waist.",
      "Keep your back and elbows straight until a stretch is felt in your upper arms and shoulders.",
      "Hold for 30 seconds.",
      "Relax to start position.",
      "Repeat 3 times."
    ],
    "benefits": [
      "Stretches the upper arm and shoulders.",
      "Provides opportunity for the arm to be in an overhead position if this is difficult."
    ],
    "tips": [
      "This should be a pain free stretch. If you are feeling pain, back off the stretch slightly.",
      "As you repeat the exercise, see if you can bend further, but don't let your head drop below your shoulders when leaning forward as this can cause overstretch in the joint."
    ],
    "photoFront": "IMG_2619",
    "photoBack": "IMG_2620"
  },
  {
    "id": 5,
    "name": "Posterior Capsule Stretch",
    "kind": "stretch",
    "effort": 2,
    "need": "This exercise can either be done lying on the floor, bed, or couch, standing or sitting.",
    "setup": "Stand up, or sit in a chair. If you want to do this lying down, choose a firm surface.",
    "steps": [
      "Standing or sitting: Raise your affected arm in front of you to shoulder height. Bend elbow slightly. Reach toward your opposite shoulder.",
      "Grasp the raised arm at the elbow with your opposite hand and gently bring your arm across the front of your body. DON'T TUG!",
      "Gently squeeze shoulder blades together as you stretch arm across your body. You should feel a stretch in the back of your upper arm.",
      "Hold for slow count of 3. Relax.",
      "Repeat 8-10 times.",
      "Lying on back: Place a pillow under your head.",
      "If you are on a bed or couch, your involved arm should be near the edge. Use your uninvolved arm to hold your involved wrist. Allow your elbow to bend. Lower your elbow toward the floor.",
      "If lying on the floor, your elbow will be out to the side, 90° from your body. Press your hand downwards.",
      "Carefully roll onto your side toward your affected arm so you are rolling on to your shoulder. You should feel a stretch in the back of your arm.",
      "Hold for slow count of 3.",
      "Repeat 8-10 times."
    ],
    "benefits": [
      "Stretches and relaxes the back and posterior deltoid.",
      "Increases flexibility.",
      "Improves posture."
    ],
    "tips": [
      "A good stretch after you have lifted something heavy.",
      "Can be done to both sides to maximize stretch.",
      "You can try holding this stretch for 30 seconds.",
      "Performing this stretch on the floor will maximize the benefits."
    ],
    "photoFront": "IMG_2621",
    "photoBack": "IMG_2622"
  },
  {
    "id": 6,
    "name": "Shoulder Extension",
    "kind": "stretch",
    "effort": 2,
    "need": "A stick approximately 3 feet long, 1 inch in diameter. You can use a broom stick.",
    "setup": "This stretch is done while standing.",
    "steps": [
      "Stand straight with legs shoulder width apart.",
      "Keep chin parallel to the ground.",
      "Hold the stick with both hands behind your back, both palms facing away from you.",
      "Slowly lift your arms away from your hips, and squeeze your shoulder blades together.",
      "Feel the stretch in your upper arms, shoulders, and chest.",
      "Hold for slow count of 3.",
      "Relax to start position.",
      "Repeat 8-10 times."
    ],
    "benefits": [
      "Stretches the pectoral (chest) muscles.",
      "Stretches the upper arms and shoulders."
    ],
    "tips": [
      "Great stretch to counteract the forward bending tasks we do throughout a day."
    ],
    "photoFront": "IMG_2623",
    "photoBack": "IMG_2624"
  },
  {
    "id": 7,
    "name": "Internal Rotation",
    "kind": "stretch",
    "effort": 2,
    "need": "A towel.",
    "setup": "Stand with your feet shoulder width apart.",
    "steps": [
      "While holding the towel in your uninvolved hand, raise your arm overhead. Allow your elbow to bend behind the top of your head.",
      "The towel should drop behind your back.",
      "With your involved hand, reach behind your back and grasp the other end of the towel. You might need some help.",
      "Gently straighten your top arm elbow so that your uninvolved arm moves up your back. DON'T YANK ON THE TOWEL. AVOID OVERSTRETCHING YOUR ARM!",
      "Now reverse the direction of the pull by straightening your bottom elbow. Allow the top arm to bend behind your head.",
      "Hold for a slow count of 3 in each direction.",
      "Relax slightly between each change in movement.",
      "Repeat 8-10 times.",
      "You can repeat this exercise with the involved arm overhead, and the uninvolved arm down behind your back."
    ],
    "benefits": [
      "Releases tightness in upper back and shoulders.",
      "Stretches the rotator cuff muscles."
    ],
    "tips": [
      "This can also be done from a seated position.",
      "The exercise is a good overall stretch for both arms."
    ],
    "photoFront": "IMG_2625",
    "photoBack": "IMG_2626"
  },
  {
    "id": 8,
    "name": "External Rotation (Doorway)",
    "kind": "stretch",
    "effort": 1,
    "need": "A doorway to stand between.",
    "setup": "With involved arm close to your side, bend your elbow to 90 degrees. Place your palm on the side of door frame with your thumb toward the ceiling. Use the part of the door frame without the hinge.",
    "steps": [
      "Stand in line with frame. Slowly turn your body away from your arm while you hold onto the frame. Stop when you feel the stretch in the front chest/shoulder area.",
      "Count to 3.",
      "Relax slightly.",
      "Repeat 8-10 times.",
      "Can repeat on other side."
    ],
    "benefits": [
      "Stretches the anterior shoulder and chest muscles.",
      "Counteracts tendency to round the shoulders."
    ],
    "tips": [
      "Good stretch to do if you spend a lot of time at a computer, driving, or playing video games."
    ],
    "photoFront": "IMG_2627",
    "photoBack": "IMG_2628"
  },
  {
    "id": 9,
    "name": "Corner Stretch",
    "kind": "stretch",
    "effort": 1,
    "need": "Open corner area in a room where you can stand.",
    "setup": "Stand facing the corner, posture is upright and straight.",
    "steps": [
      "Place your hands on either wall at shoulder height with elbows bent.",
      "Feet are forward and placed shoulder width apart.",
      "Breathe slowly while leaning your upper body forward. Keep your back straight. You should feel a comfortable stretch in the front of your shoulders and across the chest.",
      "Count to 3 slowly.",
      "Relax slightly.",
      "Repeat 8-10 times."
    ],
    "benefits": [
      "Stretches the front shoulder and chest muscles.",
      "Counteracts tendency to round shoulders.",
      "Improves posture."
    ],
    "tips": [
      "To add more variety in this stretch, try positioning the arms slightly lower or higher along the wall. Just remember, keep your back straight!",
      "Position your arms further away from your body if you are not feeling a good stretch."
    ],
    "photoFront": "IMG_2629",
    "photoBack": "IMG_2631"
  },
  {
    "id": 10,
    "name": "Inferior Capsule",
    "kind": "stretch",
    "effort": 2,
    "need": "Chair is optional.",
    "setup": "Sit or stand.",
    "steps": [
      "Raise your involved arm up next to your ear. Bend your elbow behind your head. Rest your hand behind your neck. You can use your uninvolved arm to help get your arm into this position.",
      "Reach over your head with your uninvolved arm and grasp your involved elbow. Gently pull your involved elbow toward your opposite arm as far as it will go comfortably.",
      "You should feel a stretch on the side of your shoulder under your arm pit.",
      "Apply gentle pressure for count of 3.",
      "Relax slightly.",
      "Repeat 8-10 times."
    ],
    "benefits": [
      "Stretches the triceps muscles as well."
    ],
    "tips": [
      "A great stretch to perform before and after physical activity, especially sports.",
      "You can also perform this stretch on your other arm."
    ],
    "photoFront": "IMG_2632",
    "photoBack": "IMG_2633"
  },
  {
    "id": 11,
    "name": "Anterior Capsule",
    "kind": "stretch",
    "effort": 2,
    "need": "Door jamb to stand in between.",
    "setup": "Stand, and place hands on each side of the door jam. Your thumbs should be facing up.",
    "steps": [
      "Grasp each side of the door.",
      "Put feet together, then one foot ahead of the other, into a lunge position.",
      "Keep chin parallel to the ground.",
      "Elbows should be as straight as possible.",
      "Lean your upper body forward.",
      "Keep your back straight.",
      "You should feel a comfortable stretch in front of your arms and across your chest.",
      "Hold for 30 seconds."
    ],
    "benefits": [
      "Stretches the shoulder muscles in the front as well as your chest muscles.",
      "Helps to counteract rounded shoulders.",
      "Good stretch for your biceps as well."
    ],
    "tips": [
      "A good stretch for those who spend a lot of time at a desk, or playing video games."
    ],
    "photoFront": null,
    "photoBack": "IMG_2635"
  },
  {
    "id": 12,
    "name": "Bicep Stretch",
    "kind": "stretch",
    "effort": 2,
    "need": "If standing, you will need a sturdy table. If lying down, use a bed, couch, or the floor. You will also need a soup can, or a 2, 3 or 4 pound weight.",
    "setup": "",
    "steps": [
      "Standing: Stand with your back against a sturdy table. Reach behind you and grasp the edge of tabletop. Your palms should face upward.",
      "Slowly stand taller while slightly leaning forward.",
      "Allow your elbows to straighten.",
      "You should feel a stretch in your biceps.",
      "Count slowly to 3.",
      "Relax slightly.",
      "Repeat 8-10 times.",
      "Lying on back: Lay on your back near the edge of bed or couch. Your involved arm should be near the edge.",
      "Hold onto the soup can or weight.",
      "Reach your involved arm overhead. Your elbow should be as straight as possible and your palm up.",
      "Reach overhead as far as possible. Keep your ribs down and do not allow your back to arch.",
      "Count slowly to 3.",
      "Relax slightly.",
      "Repeat 8-10 times."
    ],
    "benefits": [
      "Your arm will feel more relaxed.",
      "This will help your arm rest more at your side."
    ],
    "tips": [
      "Be very careful not to overstretch with this exercise.",
      "If you are doing this exercise while lying down and you do not experience any pain in the biceps, you can increase the weight you are holding. Do not go over 4 pounds.",
      "Concentrate on straightening your elbow of the involved side.",
      "Try to hold the stretch for 30 seconds to increase challenge."
    ],
    "photoFront": "IMG_2636",
    "photoBack": "IMG_2637"
  },
  {
    "id": 13,
    "name": "Shoulder Flexion",
    "kind": "range",
    "effort": 1,
    "need": "Mat or thick towel to place on the floor to lay on. A stick that is about 3 feet long by 1 inch in diameter. A broomstick also works well.",
    "setup": "Lie on your back using a mat or towel. Hold onto either end of the stick with both palms facing up.",
    "steps": [
      "Lift the stick directly overhead. Lift mostly with your involved side as far as you can. Use your uninvolved side to help if you need it.",
      "Continue to lift until you feel a stretch. Don't go past your ears overhead.",
      "Hold the stretch for a slow count of 3.",
      "Relax to start position.",
      "Repeat 8-10 times."
    ],
    "benefits": [
      "Helps improve shoulder flexibility and range of motion."
    ],
    "tips": [
      "Stop if you feel pain in your arm.",
      "Can turn palms down if too difficult with palms up."
    ],
    "photoFront": "IMG_2638",
    "photoBack": "IMG_2639"
  },
  {
    "id": 14,
    "name": "Abduction & Horizontal Adduction",
    "kind": "range",
    "effort": 1,
    "need": "Mat or thick towel to place on the floor to lay on. A stick that is about 3 feet long by 1 inch in diameter. A broomstick also works well.",
    "setup": "Lie on your back. Hold onto one end of the stick with your right hand, palm turned up. Hold the other end of the stick with your left hand, palm turned up.",
    "steps": [
      "This exercise combines 2 motions.",
      "Push the stick out toward your right side. You will need to move your left arm across your body to help raise your right arm.",
      "Keep your right arm close to the floor and move it over head if you as far as you can.",
      "Hold for slow count of 3.",
      "Return to start.",
      "Repeat 8-10 times.",
      "Now move it toward the other side.",
      "Push the stick out toward your left side. You will need to move your right arm across your body to help raise your left arm.",
      "Hold for slow count of 3.",
      "Return to start.",
      "Repeat 10 times."
    ],
    "benefits": [
      "Helps improve shoulder flexibility and range of motion."
    ],
    "tips": [
      "For extended reach, turn your left hand palm down.",
      "Stop if you feel pain in either arm.",
      "Keep your shoulder blades against the floor."
    ],
    "photoFront": "IMG_2640",
    "photoBack": "IMG_2641"
  },
  {
    "id": 15,
    "name": "Plank on Elbows & Toes",
    "kind": "strength",
    "effort": 3,
    "need": "Mat or thick towel to place on the floor.",
    "setup": "Lie face down on mat or towel. Prop yourself up on your forearms. Your palms should rest flat on the floor, or you can clasp both hands together.",
    "steps": [
      "Make sure your elbows are directly under your shoulders. Raise your upper body. Press into your forearms. Raise your lower body and support on your toes.",
      "Keep your back flat. Your body should be in a straight line from head to toe.",
      "Don't arch your back. Pull your abdominal muscles into your spine to prevent your bottom from sticking up in the air or sagging in the middle.",
      "Breathe normally. Do not hold your breath.",
      "Hold for 15-60 seconds.",
      "Rest to start position.",
      "Repeat up to 3 times."
    ],
    "benefits": [
      "Builds endurance in your abdominals, back, and shoulder muscles.",
      "Builds strength for push-ups."
    ],
    "tips": [
      "If too challenging, try doing this from your knees on the floor instead of your toes.",
      "Stay up as long as you can without feeling pain in your lower back or shoulders.",
      "Increase your time, up to 1 minute."
    ],
    "photoFront": "IMG_2642",
    "photoBack": "IMG_2643"
  },
  {
    "id": 16,
    "name": "Abdominal Curls with Heel Push",
    "kind": "core",
    "effort": 2,
    "need": "Mat or thick towel to lay on the floor.",
    "setup": "Lie on your back with your knees bent, hip distance apart. Place both arms behind and gently cradling your head. Press heels into the floor. Your toes should lift and point toward the ceiling.",
    "steps": [
      "Inhale: prepare for the exercise.",
      "Exhale: pull your abdominal muscles into your spine, bringing your upper body off the floor.",
      "Try not to pull on your neck with your hands. Your hands should lightly support your head.",
      "Lift your upper body forward, toward your knees. Press your heels into the floor while keeping your abdominal muscles pulled in towards your spine. Keep your back against the mat, but do not press down into the floor.",
      "Inhale: lower your upper body slowly. Keep your head slightly off the floor.",
      "Repeat 12-16 times.",
      "Do 1-3 sets of these exercises."
    ],
    "benefits": [
      "By keeping heels pressed against the floor, it encourages more muscles to work than regular sit-ups."
    ],
    "tips": [
      "If you cannot keep your arms behind your head, place a towel or pillow so it is underneath your upper body. Grasp the top corners with each hand. Keep your head relaxed in the towel as you lift the shoulders off the floor using your abdominal muscles.",
      "Don't push your back into the floor. You want to keep your abdominals tightened during the exercise."
    ],
    "photoFront": "IMG_2644",
    "photoBack": "IMG_2645"
  },
  {
    "id": 17,
    "name": "Reverse Crunch",
    "kind": "core",
    "effort": 2,
    "need": "Mat or thick towel to lay on the floor.",
    "setup": "Lie on floor. Place your arms at your sides and hands on the floor with palms down.",
    "steps": [
      "Bring both knees in toward your chest until they are bent 90 degrees. Your knees and feet should be together, or ankles crossed.",
      "Inhale: prepare for the exercise.",
      "Exhale: pull your abdominals into your spine. This will engage your abdominal muscles. Lift your hips off the floor by pushing your legs toward the ceiling.",
      "Inhale: lower your hips slowly.",
      "Exhale: repeat this motion performing 12-16 repetitions.",
      "Do 1-3 sets of these exercises."
    ],
    "benefits": [
      "Good abdominal exercise."
    ],
    "tips": [
      "Avoid swinging your legs when you are raising your hips toward the ceiling.",
      "This is a small, subtle movement, so you only need to lift your hips slightly off the floor.",
      "Press your hands into the floor as you lift your hips. Do not let your head rise up off the floor."
    ],
    "photoFront": "IMG_2646",
    "photoBack": "IMG_2647"
  },
  {
    "id": 18,
    "name": "Vertical Leg Crunch",
    "kind": "core",
    "effort": 3,
    "need": "Mat or thick towel to lay on the floor.",
    "setup": "Lie on floor and extend legs straight up with knees crossed, placing your hands behind your head for support.",
    "steps": [
      "Inhale: prepare for the exercise.",
      "Exhale: pull your abdominal muscles towards your spine. Lift your shoulder blades off the floor. Bring your chest toward your thighs and your thighs towards your chest. Avoid pulling your neck.",
      "Inhale: lower your upper body slightly.",
      "Exhale: repeat 12-16 times.",
      "Do 1-3 sets of these exercises."
    ],
    "benefits": [
      "Targets rectus abdominis and oblique muscles."
    ],
    "tips": [
      "If you cannot keep your arms behind your head, place a towel or pillowcase so it is underneath your upper body. Grasp the top corners with each hand. Keep your head relaxed in the towel as you lift the shoulders off the floor, while using your abdominal muscles."
    ],
    "photoFront": "IMG_2648",
    "photoBack": "IMG_2649"
  },
  {
    "id": 19,
    "name": "Bicycle Exercise",
    "kind": "core",
    "effort": 3,
    "need": "Mat or thick towel to lay on the floor.",
    "setup": "Lie on your back with your knees bent, hip distance apart. Place both arms behind your head. Gently cradle your head.",
    "steps": [
      "Bring both knees toward your chest.",
      "Lift your shoulder blades off the floor. Do not pull your neck.",
      "Inhale: prepare for the exercise.",
      "Exhale: lift your chest toward your knees, pull your abdominals into your spine, at the same time bringing your right elbow toward your left knee. Straighten your right leg.",
      "Inhale: bring your legs and torso back to the center. Keep your upper body off the mat.",
      "Exhale: rotate to the opposite side. Bring your left elbow toward your right knee, while pulling your abdominals into your spine.",
      "Inhale: bring legs and torso back to center.",
      "Exhale: continue alternating sides using a pedaling motion.",
      "Repeat 12-16 repetitions."
    ],
    "benefits": [
      "Targets the rectus abdominis and oblique muscles."
    ],
    "tips": [
      "If this is too difficult you can modify the exercise. Keep your knees bent with your feet on the floor. Work only your upper body.",
      "Try to keep your elbows out to the sides and in line with your ears.",
      "Movements are done slowly."
    ],
    "photoFront": "IMG_2650",
    "photoBack": "IMG_2651"
  },
  {
    "id": 20,
    "name": "Crab Walk",
    "kind": "strength",
    "effort": 3,
    "need": "Enough floor space to move around. Make sure there are no obstacles nearby.",
    "setup": "Start by sitting on the floor. Place your arms behind your back with your fingers facing backward (or forward if it's more comfortable). Your toes should be facing forward. Keep your knees bent and your feet flat on floor. Raise your hips and bottom off the floor.",
    "steps": [
      "Keep your hips raised as high as you can off the floor and \"walk\", using both hands and feet.",
      "Move forward ten steps.",
      "Move back ten steps.",
      "Try to put equal weight into both arms.",
      "Try to keep your palms flat against the floor.",
      "Repeat 10 times."
    ],
    "benefits": [
      "Helps relieve tightness in the shoulders.",
      "Challenges weak muscles, while stretching tight shoulder muscles.",
      "Targets muscles of your shoulders, triceps and upper back.",
      "Improves weight bearing skills."
    ],
    "tips": [
      "If the exercise hurts your wrists, fold or roll up two small hand towels, placing one towel in each hand. This gives your hands a cushion, reducing strain on your wrists. You can also place a towel under your affected hand if you are having a hard time keeping your palm flat on the floor.",
      "Wearing shoes will make this exercise easier.",
      "You can also play floor soccer using a small ball.",
      "If walking on your hands is too hard, try staying in place, while lifting and lowering your hips 10 times.",
      "Keep your elbows as straight as possible."
    ],
    "photoFront": "IMG_2652",
    "photoBack": "IMG_2653"
  },
  {
    "id": 21,
    "name": "Wall Glides",
    "kind": "strength",
    "effort": 2,
    "need": "Enough space to stand against a wall.",
    "setup": "Lean your back against the wall.",
    "steps": [
      "Place the back of your arms and hands against the wall in a goal post position. Your elbows are as high as your shoulders. Palms face forward.",
      "Make sure your head, shoulders and hips are against the wall, feet facing forward. If you are not able to place your arms against the wall, try this on the floor.",
      "Keep your arms and backs of your hands in contact with the wall as best you can.",
      "Lift your arms upward. Bring your hands together as if doing a jumping jack.",
      "You'll be making a semi-circle.",
      "Relax your stomach.",
      "Keep your arms in contact with the wall through the entire movement.",
      "Return to the starting position.",
      "Build to 3 sets of ten repetitions."
    ],
    "benefits": [
      "Gives your shoulder blades a workout if you stand up in good alignment against a wall."
    ],
    "tips": [
      "If it is too difficult for you to lift your arms overhead, do this movement lying on the floor.",
      "Do not hold your breath.",
      "Do not arch your back away from the wall or floor.",
      "You can hold the ends of a towel or pole to help reach both arms overhead if raising them is difficult."
    ],
    "photoFront": "IMG_2654",
    "photoBack": "IMG_2655"
  },
  {
    "id": 22,
    "name": "Spinal Rotation",
    "kind": "stretch",
    "effort": 1,
    "need": "Mat or thick towel to lay on the floor.",
    "setup": "Lie on your side on mat or towel. Bend hips and knees. Arms are together at shoulder height. Palms are together.",
    "steps": [
      "Inhale: reach your top arm toward the ceiling.",
      "Exhale: lower your arm out to side, away from your opposite arm, allowing your upper body to rotate with the front of your chest toward the ceiling.",
      "Try reaching your top shoulder toward the floor.",
      "Inhale: breathe into your back and sides.",
      "Exhale: stay there and relax the shoulders.",
      "Inhale: breathe into your sides and back.",
      "Exhale: pull your belly in towards your spine as you bring your upper body back to the starting position.",
      "Complete 3-4 repetitions on each side."
    ],
    "benefits": [
      "Stretches the front shoulder, chest and back muscles.",
      "Counteracts tendency to round shoulders.",
      "Improves posture."
    ],
    "tips": [
      "You can use a small pillow to support your neck while in this position, or place your bottom arm underneath your head.",
      "Keep your hips stacked evenly, with your legs kept together while your upper body rotates."
    ],
    "photoFront": "IMG_2656",
    "photoBack": "IMG_2657"
  },
  {
    "id": 23,
    "name": "Back Extension",
    "kind": "strength",
    "effort": 2,
    "need": "Mat or thick towel to lay on the floor.",
    "setup": "Lie on your stomach with your forehead on the floor or a pillow.",
    "steps": [
      "Bring your arms to sides with your palms toward your legs.",
      "Keep your legs together with your feet pointed.",
      "Gently press your legs into the floor.",
      "Inhale: prepare for the exercise.",
      "Exhale: lift your upper trunk, head and chest SLIGHTLY off floor. Keep head in line with spine and your abdominals pulled in. Reach your fingers toward your feet.",
      "Pause for 2 seconds.",
      "Inhale: lower your upper body to the floor.",
      "Exhale: repeat lifting upper body and head away from floor. Pause for 2 seconds.",
      "Repeat 5-8 times."
    ],
    "benefits": [
      "Strengthens upper back."
    ],
    "tips": [
      "Maintain abdominal support throughout the exercise. Imagine trying to lift your bellybutton off of an ice cube underneath your stomach.",
      "Only lift the upper back, keep your lower back on the floor.",
      "Keep your head in line with your spine."
    ],
    "photoFront": "IMG_2658",
    "photoBack": "IMG_2659"
  },
  {
    "id": 24,
    "name": "Sitting Floor Twist",
    "kind": "stretch",
    "effort": 1,
    "need": "Floor space and a towel or mat if you want something to sit on.",
    "setup": "Sit on the floor with your legs extended straight in front of you. Bend your left leg and cross it over the right, placing foot flat on the floor just outside (and slightly above) the right knee.",
    "steps": [
      "Bend your right arm, and place your elbow outside your left knee.",
      "Keep your back straight and lean slightly forward with your hips. Think of reaching upwards through the top of your head.",
      "Now twist your upper back to the left, using your back muscles to rotate your spine. Press your right elbow into the outside of left leg.",
      "Turn your head to the left as you twist (look over your shoulder).",
      "Support yourself with your left hand on the floor out to the side and slightly behind you, your fingers facing away from your body.",
      "Be sure to breathe smoothly.",
      "Hold this position for up to 30 seconds.",
      "Press your straight leg down into the floor, with your toes flexed toward your knee.",
      "Repeat on other side."
    ],
    "benefits": [
      "Helps relieve tension in the shoulders and torso."
    ],
    "tips": [
      "If the back of your legs feel tight, try sitting on something like a rolled towel or firm cushion so you can sit up straight."
    ],
    "photoFront": "IMG_2660",
    "photoBack": "IMG_2661"
  }
];

export const EXERCISES: Exercise[] = CARDS.map((c) => ({ ...c, timer: TIMERS[c.id] }));

// General guidance printed on the deck's instruction cards.
export const DECK_GUIDANCE = {
  beforeYouBegin:
    'Make sure you have been cleared by your medical team to perform these exercises. With a brachial plexus palsy, there are recovery periods, and certain movements may not be recommended.',
  stopRule:
    'Do not perform any exercise that causes undue pain, shortness of breath, or dizziness. If you experience any pain during a particular exercise, stop; review the exercise instructions, check your technique, and try again. If there is still pain, stop that particular exercise.',
  howOften:
    'At least 3 times per week. Beginners should allow a day of rest in between sessions. A beginner might start with 2-5 cards per session.',
  breathing:
    'Do not hold your breath. It is best to exhale as you go into the stretch. Take deep full breaths rather than short shallow breaths.',
  core:
    'Engage your core: draw your belly button in toward your spine, about 30% effort, and keep breathing.',
};
