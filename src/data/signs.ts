export type SignCategory =
  | "LIFE-THREATENING"
  | "MEDICAL"
  | "SAFETY"
  | "COMMUNICATION"
  | "EMOTIONAL";

export type Sign = {
  id: string;
  name: string;
  emoji: string;
  category: SignCategory;
  order: number;
  gifUrl: string;
  fallbackEmoji: string;
  difficulty: 1 | 2 | 3;
  steps: [string, string, string];
  whenToUse: string;
  examples: string[];
  commonMistakes: string[];
  proTip: string;
  realScenario: string;
  relatedSigns: string[];
  funFact?: string;
  cropPercentBottom?: number;
  /** True if the GIF has a burned-in English caption (e.g. Sign-With-Robert
   *  series, lifeprint titles). Such GIFs are excluded from the quiz pool so
   *  users can't read the answer off the screen. */
  hasTextLabel?: boolean;
};

export const CATEGORY_COLORS: Record<SignCategory, string> = {
  "LIFE-THREATENING": "#C0523E",
  MEDICAL: "#3B82F6",
  SAFETY: "#D4943A",
  COMMUNICATION: "#1E293B",
  EMOTIONAL: "#16A34A",
};

export const CATEGORY_EMOJI: Record<SignCategory, string> = {
  "LIFE-THREATENING": "🆘",
  MEDICAL: "🩺",
  SAFETY: "🛡️",
  COMMUNICATION: "💬",
  EMOTIONAL: "💛",
};

export const TOTAL_SIGNS = 29;

const _signs: Sign[] = [
  // ───────────── LIFE-THREATENING ─────────────
  {
    id: "help",
    name: "Help",
    emoji: "🆘",
    category: "LIFE-THREATENING",
    order: 1,
    difficulty: 1,
    gifUrl: "https://media.giphy.com/media/l0MYQo0iDSTlnRifK/giphy.gif",
    hasTextLabel: true,
    fallbackEmoji: "🆘",
    steps: [
      "Make a fist with your dominant hand, thumb pointing up (A-hand)",
      "Place the fist on top of your flat, open non-dominant palm",
      "Lift both hands together upward about 2 inches in one fluid motion",
    ],
    whenToUse: "When someone needs immediate assistance.",
    examples: [
      "Your Deaf neighbor signs HELP after slipping on icy steps.",
      "A Deaf hiker waves at you and signs HELP — they're lost.",
      "You witness someone sign HELP urgently in a crowded store.",
    ],
    commonMistakes: [
      "Don't lift only the top fist — both hands must rise together as one unit.",
      "Don't keep the bottom palm vertical; it must stay flat and horizontal.",
      "Don't lift too high — about 2 inches is enough; bigger isn't clearer.",
    ],
    proTip: "Raised eyebrows and a slight forward lean turn this from a statement into a request — your face is the ask.",
    realScenario:
      "An older Deaf neighbor stumbles in their driveway and can't get up. You sign HELP firmly while making eye contact, then point to your phone. The lift motion communicates urgency without any sound.",
    relatedSigns: ["emergency", "doctor", "police"],
    funFact: "HELP is one of the first signs taught to hearing parents of Deaf babies — usually before age one.",
  },
  {
    id: "emergency",
    name: "Emergency",
    emoji: "🚨",
    category: "LIFE-THREATENING",
    order: 2,
    difficulty: 2,
    gifUrl: "https://media.giphy.com/media/l0MYP5UxgzuZBUJKU/giphy.gif",
    hasTextLabel: true,
    fallbackEmoji: "🚨",
    steps: [
      "Form an E-handshape (fingertips curled tightly to thumb)",
      "Hold the E up at shoulder height, palm facing forward",
      "Shake the E quickly side-to-side in short, sharp movements",
    ],
    whenToUse: "When the situation is critical and urgent.",
    examples: [
      "You alert a coworker that someone is having a seizure.",
      "You tell a neighbor there's a gas leak in the building.",
      "You warn a parent that their child has wandered off.",
    ],
    commonMistakes: [
      "Don't use a wide swinging motion — emergency is a tight, fast shake.",
      "Don't drop the hand low; it lives at shoulder height for visibility.",
      "Don't smile — your face must look alarmed for it to register.",
    ],
    proTip: "The faster and tighter the shake, the more urgent it reads. Pair with wide eyes and a tight mouth.",
    realScenario:
      "You're at a community pool when a child slips under the water. You spin to a Deaf lifeguard and shake the E-hand sharply at shoulder height — they sprint past you before you can finish the second motion.",
    relatedSigns: ["help", "fire", "ambulance"],
  },
  {
    id: "fire",
    name: "Fire",
    emoji: "🔥",
    category: "LIFE-THREATENING",
    order: 3,
    difficulty: 1,
    gifUrl: "https://media.giphy.com/media/l0MYAc558z4I6rL7a/giphy.gif",
    hasTextLabel: true,
    fallbackEmoji: "🔥",
    steps: [
      "Hold both hands in front of your chest, palms facing you, fingers spread",
      "Wiggle all ten fingers loosely, like flickering flames",
      "Move both hands upward from waist to chest in a rising wave",
    ],
    whenToUse: "When you see flames or smell smoke.",
    examples: [
      "You warn a friend their kitchen pan has caught alight.",
      "You alert a coworker about smoke from the breakroom.",
      "You signal people in a building during an alarm.",
    ],
    commonMistakes: [
      "Don't keep fingers stiff — loose, independent wiggling reads as flames.",
      "Don't move hands sideways; the motion must rise upward.",
      "Don't use only one hand — that looks like 'sparkle' or 'magic'.",
    ],
    proTip: "Let your fingers truly flutter — think jellyfish, not jazz hands. Add an alarmed expression for urgency.",
    realScenario:
      "You're cooking dinner with a Deaf friend who's facing the stove. The pan suddenly ignites. You sign FIRE quickly — the upward wiggling fingers immediately register as flames. Your friend turns and sees the threat.",
    relatedSigns: ["emergency", "danger", "help"],
    funFact: "This sign predates modern firefighting and traces back to early 19th-century French Sign Language.",
  },
  {
    id: "shooting",
    name: "Shooting",
    emoji: "🎯",
    category: "LIFE-THREATENING",
    order: 4,
    difficulty: 3,
    gifUrl: "https://media.giphy.com/media/HOsVOeRRBjnSKfoqXP/giphy.gif",
    fallbackEmoji: "🎯",
    steps: [
      "Form an L-shape with your dominant hand, index pointed forward",
      "Hold the L at chest height, away from your body",
      "Flick the thumb down repeatedly in fast succession to indicate firing",
    ],
    whenToUse: "When alerting to active shooting in progress.",
    examples: [
      "You hear gunfire and warn a Deaf colleague to take cover.",
      "You explain to a Deaf witness what just happened outside.",
      "You alert security staff that shots are being fired upstairs.",
    ],
    commonMistakes: [
      "Don't flick the thumb only once — repetition is what distinguishes SHOOTING from GUN.",
      "Don't loosen the L; the index must stay locked forward through every flick.",
      "Don't pair this with a calm face — wide eyes and tight jaw are essential.",
    ],
    proTip: "Lean your body slightly forward and lower your stance — your posture should communicate 'incoming threat' even before they read your hand.",
    realScenario:
      "You're sheltering in a stockroom and a Deaf coworker arrives confused. You sign SHOOTING with sharp repeated thumb flicks, then sign HIDE. They drop down beside you without needing to ask why.",
    relatedSigns: ["emergency", "hide"],
  },
  {
    id: "choking",
    name: "Choking",
    emoji: "😵",
    category: "LIFE-THREATENING",
    order: 5,
    difficulty: 2,
    gifUrl: "https://media.giphy.com/media/l4q8iEeAeU7nTGIq4/giphy.gif",
    hasTextLabel: true,
    fallbackEmoji: "😵",
    steps: [
      "Form a curved C-shape or claw with your dominant hand",
      "Bring the hand up to grip the front of your own throat",
      "Squeeze and shake slightly, with eyes wide and mouth open",
    ],
    whenToUse: "When someone cannot breathe or is choking on food or an object.",
    examples: [
      "A Deaf diner at the next table grips their throat — you sign CHOKING.",
      "You alert restaurant staff that someone needs the Heimlich.",
      "You ask a child if they're choking before patting their back.",
    ],
    commonMistakes: [
      "Don't grip too lightly — the visible squeeze conveys breath being cut off.",
      "Don't drop your jaw; the open mouth is part of the sign's reading.",
      "Don't pair with a smile or shrug — facial alarm is mandatory here.",
    ],
    proTip: "Mirror the universal choking sign by gripping your own throat — that physical resemblance carries meaning across hearing and Deaf people instantly.",
    realScenario:
      "Mid-meal, a Deaf relative across the table goes silent and grabs their neck. You stand, sign CHOKING to alert the room, and move behind them for the Heimlich — others are already calling for help.",
    relatedSigns: ["help", "emergency", "doctor"],
  },

  // ───────────── MEDICAL ─────────────
  {
    id: "hurt",
    name: "Hurt",
    emoji: "🤕",
    category: "MEDICAL",
    order: 6,
    difficulty: 1,
    gifUrl: "https://www.lifeprint.com/asl101/gifs-animated/hurt.gif",
    hasTextLabel: true,
    fallbackEmoji: "🤕",
    steps: [
      "Extend both index fingers, curling other fingers into soft fists",
      "Point the two index fingers toward each other near the point of pain",
      "Twist both wrists in opposite directions in a short, tight motion",
    ],
    whenToUse: "When someone is in physical pain.",
    examples: [
      "You tell a nurse where your headache is located.",
      "You ask a child where their stomach hurts.",
      "You show a friend that you twisted your ankle on the trail.",
    ],
    commonMistakes: [
      "Don't sign HURT in neutral space — locate it near the actual body part.",
      "Don't twist slowly; tight, quick twists communicate sharper pain.",
      "Don't use a flat palm — it must be two pointed index fingers facing each other.",
    ],
    proTip: "Wince as you sign. A scrunched face plus tight twists communicates intensity without any words.",
    realScenario:
      "You take a bad fall on a run and meet a Deaf paramedic at urgent care. You point to your knee, sign HURT with a wince, and twist tightly — they immediately understand both the location and severity.",
    relatedSigns: ["doctor", "pain", "sick"],
  },
  {
    id: "doctor",
    name: "Doctor",
    emoji: "🩺",
    category: "MEDICAL",
    order: 7,
    difficulty: 1,
    gifUrl: "https://www.lifeprint.com/asl101/gifs-animated/doctor.gif",
    hasTextLabel: true,
    fallbackEmoji: "🩺",
    steps: [
      "Form a D-handshape (index up, others curled to thumb)",
      "Hold your non-dominant hand palm-up in front of you",
      "Tap the D on the inside of your non-dominant wrist twice",
    ],
    whenToUse: "When medical help is needed.",
    examples: [
      "You ask a receptionist if a doctor is available right now.",
      "You tell a Deaf friend you're heading to the clinic.",
      "You confirm with a stranger that they want medical attention.",
    ],
    commonMistakes: [
      "Don't tap the back of the wrist — it must be the inside, where you'd take a pulse.",
      "Don't use an M or N shape; the index must be clearly extended for D.",
      "Don't single-tap — two clean taps prevent confusion with 'date' or 'medicine'.",
    ],
    proTip: "Keep your face calm and clinical — DOCTOR is informational, not an alarm. Add concern only if the situation calls for it.",
    realScenario:
      "Your Deaf grandmother says she feels dizzy at a family dinner. You catch her eye, sign DOCTOR with two clean wrist-taps, and raise your eyebrows — she nods, and you grab the keys.",
    relatedSigns: ["hurt", "hospital", "medicine"],
    funFact: "The wrist tap mimics how doctors historically checked pulse — a 19th-century gesture preserved in modern ASL.",
  },
  {
    id: "hospital",
    name: "Hospital",
    emoji: "🏥",
    category: "MEDICAL",
    order: 8,
    difficulty: 2,
    gifUrl: "https://media.giphy.com/media/1z9O4jIesLYp5ZI5BL/giphy.gif",
    fallbackEmoji: "🏥",
    steps: [
      "Form an H-handshape (index and middle finger extended together)",
      "Place the H against the upper part of your non-dominant arm",
      "Draw a small cross or plus sign on the arm with the H",
    ],
    whenToUse: "When directing someone to a medical facility.",
    examples: [
      "You tell a rideshare driver to head to the nearest hospital.",
      "You explain to a Deaf relative which hospital admitted their friend.",
      "You point a lost visitor toward the hospital across the street.",
    ],
    commonMistakes: [
      "Don't draw a vague line — the cross shape must be visible and deliberate.",
      "Don't sign it on your own forearm; place it on the upper arm near the bicep.",
      "Don't use a flat hand — the H two-finger shape carries the meaning.",
    ],
    proTip: "Keep your expression neutral and steady — HOSPITAL is a destination, not an alarm. Save urgency for EMERGENCY or HELP.",
    realScenario:
      "You're driving a Deaf friend who suddenly feels chest pain. You point ahead, sign HOSPITAL on your upper arm, and they nod — you skip the small talk and head straight to the ER.",
    relatedSigns: ["doctor", "ambulance", "sick"],
  },
  {
    id: "ambulance",
    name: "Ambulance",
    emoji: "🚑",
    category: "MEDICAL",
    order: 9,
    difficulty: 2,
    gifUrl: "https://www.lifeprint.com/asl101/gifs/a/ambulance.gif",
    hasTextLabel: true,
    fallbackEmoji: "🚑",
    steps: [
      "Make a fist with your dominant hand, thumb extended upward",
      "Raise the fist above your head",
      "Rotate it in a circular motion, mimicking a spinning siren light",
    ],
    whenToUse: "When emergency medical transport is needed.",
    examples: [
      "You confirm to a panicked bystander that an ambulance is coming.",
      "You ask a Deaf friend if they want you to call an ambulance.",
      "You direct paramedics where to bring the gurney.",
    ],
    commonMistakes: [
      "Don't keep the rotation small — it should feel like a real siren spinning above your head.",
      "Don't drop the hand to chest level; height makes the siren shape readable.",
      "Don't tuck the thumb — its extension is what shapes the 'light'.",
    ],
    proTip: "Match the rotation tempo to urgency — slower for 'they're on the way', faster for 'we need one NOW'.",
    realScenario:
      "Your Deaf coworker collapses at a meeting. You crouch beside them, sign AMBULANCE while spinning your fist overhead, and point at someone with a phone. The room understands instantly and 911 is dialed.",
    relatedSigns: ["emergency", "hospital", "doctor"],
  },
  {
    id: "medicine",
    name: "Medicine",
    emoji: "💊",
    category: "MEDICAL",
    order: 10,
    difficulty: 2,
    gifUrl: "https://www.lifeprint.com/asl101/gifs/m/medicine.gif",
    hasTextLabel: true,
    fallbackEmoji: "💊",
    steps: [
      "Hold your non-dominant hand flat, palm facing up",
      "Press the middle finger of your dominant hand into the center of that palm",
      "Twist the wrist back and forth while keeping contact",
    ],
    whenToUse: "When asking about or referring to medication.",
    examples: [
      "You ask a Deaf patient if they've taken their medicine today.",
      "You tell a paramedic which prescription your friend takes.",
      "You confirm with a pharmacist what dose to pick up.",
    ],
    commonMistakes: [
      "Don't use the index finger — the middle finger contact is what defines this sign.",
      "Don't lose contact between the hands during the twist.",
      "Don't twist with your whole arm; the motion lives at the wrist.",
    ],
    proTip: "Keep your expression mild and practical — MEDICINE often appears in calm Q&A about routine, not crisis.",
    realScenario:
      "A Deaf relative arrives at your house feeling shaky. You sign MEDICINE with a questioning brow — they nod, and you hand them their pill bottle from the counter.",
    relatedSigns: ["doctor", "sick", "allergy"],
  },
  {
    id: "allergy",
    name: "Allergy",
    emoji: "🤧",
    category: "MEDICAL",
    order: 11,
    difficulty: 3,
    gifUrl: "https://media.giphy.com/media/mtvED96gqWnT4Uggvc/giphy.gif",
    fallbackEmoji: "🤧",
    steps: [
      "Touch your index finger to the side of your nose",
      "Then point both index fingers at each other in front of your chest",
      "Pull the two index fingers apart sharply in opposite directions",
    ],
    whenToUse: "When someone is having an allergic reaction.",
    examples: [
      "You warn a chef that a Deaf guest has a peanut allergy.",
      "You ask a parent if their child is allergic to penicillin.",
      "You explain why you can't share their dessert.",
    ],
    commonMistakes: [
      "Don't skip the nose touch — the two-part sequence is essential.",
      "Don't pull the fingers apart slowly; the snap-apart is what shows reaction.",
      "Don't mix up the order — nose first, then the apart-pull, always.",
    ],
    proTip: "Add a small concerned expression on the second motion — ALLERGY can be informational or urgent depending on your face.",
    realScenario:
      "At a potluck, a Deaf friend's lips begin to swell. You sign ALLERGY to the host while pointing at the shrimp dish — they immediately grab the EpiPen from your friend's bag.",
    relatedSigns: ["medicine", "doctor", "emergency"],
    funFact: "The two-part 'nose + opposite' construction reflects how ASL often builds compound meanings from simpler roots.",
  },

  // ───────────── SAFETY ─────────────
  {
    id: "danger",
    name: "Danger",
    emoji: "⚠️",
    category: "SAFETY",
    order: 12,
    difficulty: 2,
    gifUrl: "https://media.giphy.com/media/l0MYKwdlkgYr5vJXa/giphy.gif",
    hasTextLabel: true,
    fallbackEmoji: "⚠️",
    steps: [
      "Hold your non-dominant fist in front of you, back of hand facing up",
      "Form an A-handshape with your dominant hand, thumb extended",
      "Flick the thumb upward against the back of the non-dominant fist twice",
    ],
    whenToUse: "When warning of immediate threat.",
    examples: [
      "You point out a downed power line near the sidewalk.",
      "You warn a Deaf hiker about an unstable cliff edge.",
      "You tell a child not to touch a hot grill.",
    ],
    commonMistakes: [
      "Don't strike too softly — the flick must be firm and visually decisive.",
      "Don't let the bottom fist drift; it stays still as the anchor.",
      "Don't smile — pair this with a furrowed brow to look serious.",
    ],
    proTip: "Lean shoulders slightly back and tighten your jaw — your whole body says 'be careful' before your hands finish.",
    realScenario:
      "You're walking with a Deaf coworker through a construction zone when you spot exposed rebar at ankle height. You sign DANGER and point — the firm thumb flicks read instantly as serious threat.",
    relatedSigns: ["fire", "emergency", "careful"],
  },
  {
    id: "police",
    name: "Police",
    emoji: "🚔",
    category: "SAFETY",
    order: 13,
    difficulty: 1,
    gifUrl: "https://www.lifeprint.com/asl101/gifs-animated/police.gif",
    hasTextLabel: true,
    fallbackEmoji: "🚔",
    steps: [
      "Form a C-handshape with your dominant hand (curved like holding a small cup)",
      "Place the C against the upper-left side of your chest, like resting a badge",
      "Tap the C against your chest twice in the same spot",
    ],
    whenToUse: "When law enforcement is needed.",
    examples: [
      "You tell a stranger you're calling the police about a robbery.",
      "You confirm to a Deaf witness that officers are on the way.",
      "You ask a neighbor if they saw the patrol car earlier.",
    ],
    commonMistakes: [
      "Don't tap the center of your chest — the badge sits high and to one side.",
      "Don't use an open palm; the curved C-shape carries the meaning.",
      "Don't tap loudly — POLICE is a calm, official gesture, not an alarm.",
    ],
    proTip: "Keep your face neutral and steady. POLICE is factual — adding alarm shifts the meaning toward fear.",
    realScenario:
      "You witness a hit-and-run with a Deaf friend on the corner. You sign POLICE clearly against your chest while pointing at your phone — they immediately start writing down the license plate.",
    relatedSigns: ["help", "emergency", "crime"],
  },
  {
    id: "hide",
    name: "Hide",
    emoji: "🫥",
    category: "SAFETY",
    order: 14,
    difficulty: 2,
    gifUrl: "https://www.lifeprint.com/asl101/gifs/h/hide.gif",
    hasTextLabel: true,
    fallbackEmoji: "🫥",
    steps: [
      "Form an A-handshape (fist with thumb up) and hold it at your chin",
      "Cup your non-dominant hand, palm down, in front of your chest",
      "Move the A-hand down and tuck it under the cupped hand",
    ],
    whenToUse: "When someone needs to take cover or remain unseen.",
    examples: [
      "You tell a Deaf coworker to take cover behind a desk.",
      "You signal a child to stay hidden during a drill.",
      "You direct shoppers to hide behind a counter during a threat.",
    ],
    commonMistakes: [
      "Don't skip the chin start — the path from chin to under-hand is the sign.",
      "Don't lift the cupped hand to meet the A; the A goes down to it.",
      "Don't make the motion floaty — keep it deliberate and quick.",
    ],
    proTip: "Pair HIDE with a 'shh' face — pressed lips and intense eye contact reinforce the urgency to stay silent.",
    realScenario:
      "You hear a loud crash in the lobby. You catch a Deaf coworker's attention, sign HIDE while ducking behind a desk, and they drop next to you without question.",
    relatedSigns: ["danger", "shooting", "safe"],
  },
  {
    id: "run",
    name: "Run",
    emoji: "🏃",
    category: "SAFETY",
    order: 15,
    difficulty: 2,
    gifUrl: "https://www.lifeprint.com/asl101/gifs-animated/run.gif",
    hasTextLabel: true,
    fallbackEmoji: "🏃",
    steps: [
      "Form L-shapes with both hands, index fingers extended and thumbs up",
      "Hook the index of your non-dominant hand under the thumb of your dominant hand",
      "Push both hands forward rapidly while wiggling the thumbs",
    ],
    whenToUse: "When you need someone to flee immediately.",
    examples: [
      "You signal a Deaf neighbor to run from a burning building.",
      "You tell a friend to run from an aggressive dog approaching.",
      "You urge a coworker to evacuate during a gas leak.",
    ],
    commonMistakes: [
      "Don't skip the thumb wiggle — that's what gives the sign its forward motion.",
      "Don't hook the wrong way; the non-dominant index hooks under the dominant thumb.",
      "Don't sign slowly — speed of the push mirrors urgency.",
    ],
    proTip: "Lean your body forward as you sign — your posture reinforces 'go now' before they finish reading your hands.",
    realScenario:
      "A small fire breaks out in a hallway. You sign RUN to a Deaf colleague while gesturing toward the exit — they're already moving before your hands stop.",
    relatedSigns: ["danger", "hide", "emergency"],
  },
  {
    id: "careful",
    name: "Careful",
    emoji: "🧐",
    category: "SAFETY",
    order: 16,
    difficulty: 2,
    gifUrl: "https://www.lifeprint.com/asl101/gifs-animated/careful.gif",
    hasTextLabel: true,
    fallbackEmoji: "🧐",
    steps: [
      "Form K-handshapes with both hands (index up, middle finger extended forward)",
      "Stack the dominant K on top of the non-dominant K at chest height",
      "Tap them together twice in a controlled motion",
    ],
    whenToUse: "When alerting someone to proceed with caution.",
    examples: [
      "You tell a Deaf cyclist to be careful on the slick bike path.",
      "You warn a child climbing playground equipment to slow down.",
      "You remind a coworker to handle a fragile package gently.",
    ],
    commonMistakes: [
      "Don't use V-shapes — middle finger must rest forward, not angled out.",
      "Don't tap roughly; CAREFUL is a measured, mindful sign.",
      "Don't mix up which K stacks on top — dominant always rides above.",
    ],
    proTip: "Soften your eyes and offer a small concerned tilt of the head — CAREFUL is an invitation to think, not a command.",
    realScenario:
      "You're hiking with a Deaf friend on wet rocks. You make eye contact, stack your Ks, and tap CAREFUL twice — they slow their pace and pick more deliberate footing without a word.",
    relatedSigns: ["danger", "stop", "wait"],
  },
  {
    id: "crime",
    name: "Crime",
    emoji: "🚨",
    category: "SAFETY",
    order: 17,
    difficulty: 3,
    gifUrl: "https://media.giphy.com/media/6SgPz7Pbh6KxwOuMiV/giphy.gif",
    fallbackEmoji: "🚨",
    steps: [
      "Hold your non-dominant hand flat, palm up",
      "Form a V-handshape with your dominant hand, fingers slightly bent",
      "Drag the bent V across the non-dominant palm in a hooking motion",
    ],
    whenToUse: "When reporting illegal activity in progress.",
    examples: [
      "You report to a Deaf friend that you witnessed a theft.",
      "You explain to staff that you saw a crime near the entrance.",
      "You alert police that there's a crime happening down the block.",
    ],
    commonMistakes: [
      "Don't use straight fingers — the V must be slightly bent into a hook.",
      "Don't flick the V quickly; CRIME is a deliberate dragging motion.",
      "Don't drop the palm — the non-dominant hand stays flat as the surface.",
    ],
    proTip: "Pair this with a serious furrow and downward eyes — it conveys 'this is wrong' as much as 'this happened'.",
    realScenario:
      "You see someone snatch a purse outside a cafe and run. You turn to a Deaf barista, sign CRIME with a sharp drag, and point in the direction of escape — they immediately call 911.",
    relatedSigns: ["police", "danger", "help"],
  },

  // ───────────── COMMUNICATION ─────────────
  {
    id: "stop",
    name: "Stop",
    emoji: "✋",
    category: "COMMUNICATION",
    order: 18,
    difficulty: 1,
    gifUrl: "https://media.tenor.com/JLioBgpxF5oAAAAM/stop-sign-language.gif",
    fallbackEmoji: "✋",
    steps: [
      "Hold your non-dominant hand flat, palm up, in front of your chest",
      "Hold your dominant hand flat, edge facing down, fingers together",
      "Chop the dominant hand down sharply onto the non-dominant palm once",
    ],
    whenToUse: "When something must end immediately.",
    examples: [
      "You tell a kid to stop running toward the street.",
      "You ask a coworker to pause a presentation mid-slide.",
      "You stop a friend before they sip a drink that's gone bad.",
    ],
    commonMistakes: [
      "Don't chop softly — it should be a single decisive movement, not a tap.",
      "Don't curl fingers; both hands stay completely flat.",
      "Don't repeat the chop — once, with conviction, is the sign.",
    ],
    proTip: "Make eye contact a half-second before you sign. The chop says 'stop'; the eye contact says 'right now'.",
    realScenario:
      "Your Deaf nephew is about to grab a hot pan handle. You snap your hand into his sightline and chop down once — he freezes mid-reach, hand suspended above the stove.",
    relatedSigns: ["wait", "no", "careful"],
  },
  {
    id: "water",
    name: "Water",
    emoji: "💧",
    category: "COMMUNICATION",
    order: 19,
    difficulty: 1,
    gifUrl: "https://media.giphy.com/media/26DOtNnaZuvgS5wTS/giphy.gif",
    hasTextLabel: true,
    fallbackEmoji: "💧",
    steps: [
      "Form a W-handshape (index, middle, and ring fingers extended)",
      "Bring the W up to your chin, index finger lightly touching",
      "Tap the W against your chin twice in a quick, light motion",
    ],
    whenToUse: "When someone needs hydration or you ask about water.",
    examples: [
      "You offer water to a Deaf runner after a race.",
      "You ask a server for a glass during a meal.",
      "You check on someone who looks overheated at a parade.",
    ],
    commonMistakes: [
      "Don't use a 3 or B handshape — it must be a clear W.",
      "Don't tap your lips; the contact point is the chin.",
      "Don't tap only once — two soft taps prevent confusion with 'wine' or 'wonderful'.",
    ],
    proTip: "Keep taps soft and friendly — WATER is rarely an emergency word, so a gentle face suits it.",
    realScenario:
      "A Deaf hiker on the trail looks pale and unsteady. You step into their line of sight, sign WATER with two light chin-taps, and hold up your bottle — they nod gratefully and reach for it.",
    relatedSigns: ["help", "hurt", "okay"],
  },
  {
    id: "yes",
    name: "Yes",
    emoji: "✅",
    category: "COMMUNICATION",
    order: 20,
    difficulty: 1,
    gifUrl: "https://www.lifeprint.com/asl101/gifs/y/yes.gif",
    hasTextLabel: true,
    fallbackEmoji: "✅",
    steps: [
      "Form an S-handshape (closed fist) with your dominant hand",
      "Hold the fist at chest height, palm facing forward",
      "Nod the fist up and down at the wrist, mimicking a head nod",
    ],
    whenToUse: "When confirming or agreeing.",
    examples: [
      "You confirm to a Deaf cashier that you want a bag.",
      "You agree with a friend's plan over coffee.",
      "You answer 'yes' when asked if you're okay.",
    ],
    commonMistakes: [
      "Don't move the whole arm — the nod lives at the wrist only.",
      "Don't open the fist; YES is a tight closed S throughout.",
      "Don't nod too slowly — a quick double-bob reads cleaner than one slow drop.",
    ],
    proTip: "Add a small head nod to match — facial agreement reinforces the sign and makes it feel warm rather than clipped.",
    realScenario:
      "A Deaf colleague asks if you can stay late to help with a project. You nod your S-hand twice with a smile — agreement registered without breaking your typing rhythm.",
    relatedSigns: ["no", "okay", "understand"],
  },
  {
    id: "no",
    name: "No",
    emoji: "❌",
    category: "COMMUNICATION",
    order: 21,
    difficulty: 1,
    gifUrl: "https://media.giphy.com/media/29HWHVK9wLOPZVBe8E/giphy.gif",
    fallbackEmoji: "❌",
    steps: [
      "Extend your index and middle fingers and your thumb",
      "Bring the three fingertips together quickly, like a beak closing",
      "Snap them together once decisively at chest height",
    ],
    whenToUse: "When refusing or denying.",
    examples: [
      "You decline a Deaf server's offer of dessert.",
      "You answer 'no' when asked if you're hurt.",
      "You refuse a stranger asking if they can borrow your phone.",
    ],
    commonMistakes: [
      "Don't use four fingers — only the index, middle, and thumb meet.",
      "Don't snap multiple times; one quick beak-close is the sign.",
      "Don't lose the snap — soft contact reads as 'maybe' instead of 'no'.",
    ],
    proTip: "Match it with a tight headshake or pursed lips — the face seals the refusal.",
    realScenario:
      "A pushy salesperson approaches a Deaf relative. You step in, snap a clean NO, and shake your head — they back off without further negotiation.",
    relatedSigns: ["yes", "stop", "wait"],
  },
  {
    id: "wait",
    name: "Wait",
    emoji: "⏳",
    category: "COMMUNICATION",
    order: 22,
    difficulty: 2,
    gifUrl: "https://www.lifeprint.com/asl101/gifs/w/wait.gif",
    hasTextLabel: true,
    fallbackEmoji: "⏳",
    steps: [
      "Hold both hands open at chest height, palms facing up, fingers spread",
      "Position the hands slightly off-center, dominant hand a bit further forward",
      "Wiggle all the fingers while keeping the hands in place",
    ],
    whenToUse: "When you need someone to pause and stay where they are.",
    examples: [
      "You ask a Deaf shopper to wait while you check stock.",
      "You tell a child to wait at the curb before crossing.",
      "You signal a Deaf friend across a crowded room to wait there.",
    ],
    commonMistakes: [
      "Don't move the hands forward — they stay rooted while the fingers wiggle.",
      "Don't wiggle just one hand; both hands flutter together.",
      "Don't tense the fingers — the wiggle is loose and patient-looking.",
    ],
    proTip: "Soft eyes and a small, patient smile keep WAIT from feeling like a brush-off — context matters here.",
    realScenario:
      "A Deaf customer arrives just as you're handling another order. You catch their eye, wiggle WAIT with a friendly smile, and they settle in without frustration.",
    relatedSigns: ["stop", "careful", "yes"],
  },
  {
    id: "understand",
    name: "Understand",
    emoji: "💡",
    category: "COMMUNICATION",
    order: 23,
    difficulty: 2,
    gifUrl: "https://www.lifeprint.com/asl101/gifs/u/understand.gif",
    hasTextLabel: true,
    fallbackEmoji: "💡",
    steps: [
      "Make a fist with your dominant hand, index finger curled tight",
      "Hold the fist near the side of your forehead",
      "Flick the index finger straight up suddenly, like a lightbulb turning on",
    ],
    whenToUse: "When confirming you comprehend or asking if someone does.",
    examples: [
      "You tell a Deaf instructor you understand the directions.",
      "You ask a relative if they understand the new prescription.",
      "You confirm to a coworker that you grasp the change in plan.",
    ],
    commonMistakes: [
      "Don't flick the finger slowly — the snap is what creates the 'aha' meaning.",
      "Don't sign it away from the head; proximity to the temple is essential.",
      "Don't keep the fist clenched after the flick — the index ends extended.",
    ],
    proTip: "A small head nod and brightened eyes on the flick sell the sign — it's the 'lightbulb moment' made visible.",
    realScenario:
      "A Deaf manager finishes explaining a complex procedure. You flick UNDERSTAND beside your forehead with a confident nod — they smile and move on without quizzing you.",
    relatedSigns: ["yes", "okay", "no"],
    funFact: "The lightbulb-style finger flick literally pre-dates the phrase 'lightbulb moment' in English — the metaphor goes the other way.",
  },

  // ───────────── EMOTIONAL ─────────────
  {
    id: "scared",
    name: "Scared",
    emoji: "😨",
    category: "EMOTIONAL",
    order: 24,
    difficulty: 2,
    gifUrl: "https://media.giphy.com/media/pQ1tFAp4ntgHNDCs7q/giphy.gif",
    hasTextLabel: true,
    fallbackEmoji: "😨",
    steps: [
      "Start with both hands as closed fists, held at the sides of your chest",
      "In a single quick motion, open both fists toward your chest, fingers spread",
      "Pair the burst with a startled face — wide eyes, slight gasp",
    ],
    whenToUse: "When expressing fear or asking if someone is afraid.",
    examples: [
      "You ask a child if a thunderstorm is frightening them.",
      "You tell a friend you were scared after a near-miss in traffic.",
      "You comfort someone who looks shaken after bad news.",
    ],
    commonMistakes: [
      "Don't open the hands slowly — the burst must be sudden, like a startle.",
      "Don't smile; the face is essential and must show fear.",
      "Don't open hands away from the body — they snap inward, toward the chest.",
    ],
    proTip: "The face is 70% of this sign — without wide eyes and a small inhaled gasp, the motion alone reads as 'surprise'.",
    realScenario:
      "Your Deaf cousin clings to your sleeve during a power outage. You crouch to their eye level, sign SCARED gently with a soft expression — naming the feeling helps them calm down before you find the flashlight.",
    relatedSigns: ["hurt", "help", "safe"],
  },
  {
    id: "pain",
    name: "Pain",
    emoji: "😣",
    category: "EMOTIONAL",
    order: 25,
    difficulty: 2,
    gifUrl: "https://www.lifeprint.com/asl101/gifs/p/pain.gif",
    hasTextLabel: true,
    fallbackEmoji: "😣",
    steps: [
      "Extend both index fingers, curling other fingers into soft fists",
      "Bring the index fingers near the location of the pain on the body",
      "Twist the wrists in opposite directions sharply, like HURT but more intense",
    ],
    whenToUse: "When indicating where pain is located on the body.",
    examples: [
      "You tell an EMT exactly where the chest pain centers.",
      "You point out lower-back pain to a physical therapist.",
      "You describe sudden joint pain to a Deaf parent.",
    ],
    commonMistakes: [
      "Don't sign in neutral space — PAIN gains meaning from being placed on the body.",
      "Don't soften the twist; sharper means stronger pain.",
      "Don't pair with a calm face — wincing reinforces the message.",
    ],
    proTip: "Add a small grimace and breathe in through your teeth — your face translates pain intensity better than any number scale.",
    realScenario:
      "After a long shift, your Deaf coworker rubs their lower back. You sign PAIN at your own lower back with a wince, asking if that's where it hurts — they nod gratefully that you noticed.",
    relatedSigns: ["hurt", "doctor", "sick"],
  },
  {
    id: "sick",
    name: "Sick",
    emoji: "🤒",
    category: "EMOTIONAL",
    order: 26,
    difficulty: 2,
    gifUrl: "https://www.lifeprint.com/asl101/gifs/s/sick.gif",
    hasTextLabel: true,
    fallbackEmoji: "🤒",
    steps: [
      "Bend the middle finger of each hand inward (other fingers extended)",
      "Touch the middle finger of one hand to your forehead",
      "Touch the middle finger of the other hand to your stomach at the same time",
    ],
    whenToUse: "When someone is unwell or ill.",
    examples: [
      "You tell a Deaf supervisor you're going home sick.",
      "You ask a relative if their child is feeling sick today.",
      "You explain to a server that the meal made you sick.",
    ],
    commonMistakes: [
      "Don't use both index fingers — the bent middle finger is the key.",
      "Don't touch only one location; forehead AND stomach contact must happen together.",
      "Don't smile through it — a slightly weary expression matches the meaning.",
    ],
    proTip: "Let your shoulders drop slightly as you sign — your body posture sells 'unwell' before your hands finish.",
    realScenario:
      "You wake up groggy and signal your Deaf housemate from the doorway. You sign SICK with a tired face — they nod, hand you tea, and leave you to rest without further explanation needed.",
    relatedSigns: ["hurt", "doctor", "medicine"],
  },
  {
    id: "safe",
    name: "Safe",
    emoji: "🛡️",
    category: "EMOTIONAL",
    order: 27,
    difficulty: 2,
    gifUrl: "https://media.giphy.com/media/34a6rMN7RlM0ZqQZMn/giphy.gif",
    fallbackEmoji: "🛡️",
    steps: [
      "Cross both wrists in front of your chest with closed fists",
      "Hold the cross briefly with knuckles facing outward",
      "Sharply uncross the fists outward to either side, like releasing a binding",
    ],
    whenToUse: "When reassuring someone the danger has passed.",
    examples: [
      "You tell a Deaf child that the storm is over and they're safe.",
      "You confirm to evacuees that the building is now safe to re-enter.",
      "You reassure a friend that they're safe after a scare.",
    ],
    commonMistakes: [
      "Don't open the fists during the uncross — they stay closed throughout.",
      "Don't uncross gently; the sharp release is what conveys 'no longer bound by danger'.",
      "Don't sign with an alarmed face — calm, reassuring expression is essential.",
    ],
    proTip: "Soften your face and exhale visibly as you uncross — the relief in your expression makes the reassurance land.",
    realScenario:
      "After a tornado siren clears, you find your Deaf grandmother in the basement. You sign SAFE with a slow, calming expression — her shoulders drop and she finally takes a full breath.",
    relatedSigns: ["careful", "okay", "calm"],
  },
  {
    id: "okay",
    name: "Okay",
    emoji: "👌",
    category: "EMOTIONAL",
    order: 28,
    difficulty: 1,
    gifUrl: "https://media.giphy.com/media/26FL6SiwlHGO6zyms/giphy.gif",
    hasTextLabel: true,
    fallbackEmoji: "👌",
    steps: [
      "Form an O-handshape with your dominant hand (fingers and thumb meeting in a circle)",
      "Pause briefly so the O is clearly readable",
      "Transition to a K-handshape (index up, middle finger forward, thumb between)",
    ],
    whenToUse: "When checking in or confirming someone is alright.",
    examples: [
      "You ask a Deaf friend after a fall whether they're okay.",
      "You signal across a parking lot that you arrived safely.",
      "You answer a parent's worried glance with a quick OK.",
    ],
    commonMistakes: [
      "Don't blur the two letters — pause briefly between O and K.",
      "Don't reverse the order; OKAY is always O first, then K.",
      "Don't twist the K; the index points up, middle points forward.",
    ],
    proTip: "Soft eyebrows and a small nod turn OKAY from neutral acknowledgment into genuine reassurance.",
    realScenario:
      "Your Deaf friend stumbles getting off a bus. From across the curb you sign OKAY with raised eyebrows — they sign back YES, and the moment is handled.",
    relatedSigns: ["yes", "safe", "understand"],
  },
  {
    id: "calm",
    name: "Calm",
    emoji: "😌",
    category: "EMOTIONAL",
    order: 29,
    difficulty: 3,
    gifUrl: "https://media.giphy.com/media/VhNXmzUQPrsaQHrzzX/giphy.gif",
    hasTextLabel: true,
    fallbackEmoji: "😌",
    steps: [
      "Hold both hands open in 5-shape, palms facing down, near your face",
      "Lower the hands smoothly toward your waist",
      "Keep the motion slow, settling, like pressing down a calm surface",
    ],
    whenToUse: "When asking someone to slow down emotionally or reassuring them.",
    examples: [
      "You help a Deaf child settle after a loud noise.",
      "You ask an upset friend to calm down before continuing.",
      "You signal everyone in a room to lower their energy.",
    ],
    commonMistakes: [
      "Don't lower the hands quickly — speed undermines the meaning.",
      "Don't curl the fingers; open palms communicate 'settle'.",
      "Don't pair with a tense face; soft eyes and a slow exhale sell the sign.",
    ],
    proTip: "Slow your own breathing as you sign — the rhythm of your body becomes part of the reassurance.",
    realScenario:
      "A Deaf relative is panicking after a near miss in traffic. You make eye contact, slowly press CALM downward with both hands, and exhale audibly — their shoulders follow yours down.",
    relatedSigns: ["safe", "okay", "wait"],
    funFact: "CALM is one of the few signs where the meaning lives mostly in the speed and rhythm — performing it fast accidentally creates the opposite effect.",
  },
];

export const signs: Sign[] = [..._signs].sort((a, b) => a.order - b.order);
export const SIGNS = signs;

export const signsByCategory: Record<SignCategory, Sign[]> = {
  "LIFE-THREATENING": signs.filter((s) => s.category === "LIFE-THREATENING"),
  MEDICAL: signs.filter((s) => s.category === "MEDICAL"),
  SAFETY: signs.filter((s) => s.category === "SAFETY"),
  COMMUNICATION: signs.filter((s) => s.category === "COMMUNICATION"),
  EMOTIONAL: signs.filter((s) => s.category === "EMOTIONAL"),
};

export const getSignById = (id: string): Sign | undefined =>
  signs.find((s) => s.id === id);

export const getSignByOrder = (order: number): Sign | undefined =>
  signs.find((s) => s.order === order);

export const getNextSign = (currentId: string): Sign | undefined => {
  const c = getSignById(currentId);
  return c ? getSignByOrder(c.order + 1) : undefined;
};

export const getPreviousSign = (currentId: string): Sign | undefined => {
  const c = getSignById(currentId);
  return c ? getSignByOrder(c.order - 1) : undefined;
};

export const getRelatedSigns = (sign: Sign): Sign[] =>
  sign.relatedSigns.map((id) => getSignById(id)).filter(Boolean) as Sign[];

export const getSignIndex = (id: string): number =>
  signs.findIndex((s) => s.id === id);

export const CATEGORIES: SignCategory[] = [
  "LIFE-THREATENING",
  "MEDICAL",
  "SAFETY",
  "COMMUNICATION",
  "EMOTIONAL",
];
