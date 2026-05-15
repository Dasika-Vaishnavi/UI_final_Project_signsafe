# SignSafe

> Emergency ASL signs everyone should know — built for hearing people who want to be ready when it matters most.

![Home hero](docs/screenshots/01-home-hero.png)

SignSafe is a focused, 15-minute web app that teaches 29 essential American Sign Language signs across five categories — Life-Threatening, Medical, Safety, Communication, and Emotional. It is built for everyday hearing people who don't sign but who want to recognize a Deaf person in distress and respond appropriately. The flow is deliberate: **Learn → Practice → Quiz**, with the quiz gated behind practice so users can't bluff their way to a score.

This is a course project for **COMS 4170 (User Interface Design)** at Columbia University, but the design choices were made with a real user in mind: a barista, a nurse, a teacher, a neighbor — someone who isn't a signer but who occupies a space where Deaf people might need them to understand a single critical word.

---

## Table of contents

- [Why this exists](#why-this-exists)
- [The 29 signs](#the-29-signs)
- [User flow](#user-flow)
- [Screens, in order](#screens-in-order)
  - [1. Home](#1-home)
  - [2. Learn — index](#2-learn--index)
  - [3. Learn — sign detail](#3-learn--sign-detail)
  - [4. Quick Reference](#4-quick-reference)
  - [5. Practice round](#5-practice-round)
  - [6. Main Quiz](#6-main-quiz)
  - [7. Quiz results](#7-quiz-results)
- [Design system](#design-system)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Running locally](#running-locally)
- [Deployment](#deployment)
- [Credits](#credits)

---

## Why this exists

Most ASL learning resources are either (a) comprehensive language courses aimed at people who want to become fluent, or (b) shallow TikTok-style content that teaches one sign without context. Neither serves the audience this app targets: hearing people in service-facing roles who will probably never need most of ASL, but who will fail catastrophically if they don't recognize **Help**, **Choking**, **Allergy**, or **Hospital** when it counts.

SignSafe makes a narrow promise: 29 signs, ~15 minutes, real-world emergency framing. Each sign comes with the motion (looped GIF), the steps to produce it, a pro tip about facial expression or posture (because in ASL these aren't decoration — they change meaning), and concrete usage scenarios.

The app is opinionated about one thing in particular: **face and body are part of the sign**. Raised eyebrows turn a statement into a request. A furrowed brow turns "this happened" into "this is wrong." A relaxed exhale turns "Safe" from a description into reassurance. These are the cues that get dropped from every casual ASL tutorial, and they're the ones that matter in emergencies.

---

## The 29 signs

Organized into five categories — each color-coded for fast recognition under stress:

| Category | Count | Examples |
|---|---|---|
| 🆘 **Life-Threatening** | 5 | Help, Emergency, Fire, Shooting, Choking |
| 🩺 **Medical** | 6 | Hurt, Doctor, Hospital, Ambulance, Medicine, Allergy |
| 🛡️ **Safety** | 6 | Danger, Safe, Crime, Stop, … |
| 💬 **Communication** | 6 | … |
| 💛 **Emotional** | 6 | Calm, … |

The order is intentional. Life-Threatening comes first because if someone only learns the first five signs, those are the five that will save a life.

---

## User flow

```
            ┌──────────┐
            │   Home   │  Intro, search, category overview
            └────┬─────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
   ┌─────────┐       ┌─────────┐
   │  Learn  │       │Reference│  Printable cheat-sheet
   └────┬────┘       └─────────┘
        │
        ▼  29 signs, video + steps + pro tip + scenarios
        │
        ▼
   ┌──────────┐
   │ Practice │  3 questions, hints + unlimited retries
   └────┬─────┘
        │
        ▼  (unlocks)
   ┌──────────┐
   │   Quiz   │  5 questions, scored, scenario-based
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │ Results  │  Score + per-question "why right" review
   └──────────┘
```

The quiz is gated behind practice, but the **Quick Reference** and **Progress** pages are always reachable for users who already know the signs and just want a cheat-sheet or to track streaks.

---

## Screens, in order

### 1. Home

The Home screen sets the promise immediately: **Emergency ASL Signs Everyone Should Know**. The hero pairs a serif display font (Georgia) with editorial framing — "Everyone" is the emotional pivot, set in terracotta.

![Home hero](docs/screenshots/01-home-hero.png)

The search bar invites exploration without commitment. Typing `help` brings up a live preview of every sign that matches, with thumbnail, category tag, and one-line description. A user who already knows what they need can jump directly to the sign detail page.

![Home search](docs/screenshots/02-home-search.png)

Below the fold, four stat cards summarize the scope of the app — 30 signs, 3 practice questions, 5 quiz questions, ~15 minutes. The CTA pairs **Start Learning** (recommended) with **Jump to Quiz** (gated until practice is complete), and the page explains the three-step flow with concrete expectations for each step.

![Home CTAs and how it works](docs/screenshots/03-home-cta.png)

### 2. Learn — index

The Learn index is the catalog. Signs are grouped by category, with a recommended sequence ("they build on each other") and clear progress tracking ("0 / 29 signs learned"). Filter chips let users focus on one category at a time; the "RECOMMENDED NEXT" tag points to whichever sign the user should tackle next based on their progress.

![Learn grid showing all categories](docs/screenshots/05-learn-grid.png)

Selecting a category filter narrows the grid and surfaces the entry point ("Start with Help →"). Random Sign and Jump to Quiz appear at the bottom for users who want to test themselves without committing to the linear path.

![Learn filtered to Life-Threatening category](docs/screenshots/06-learn-category-filter.png)

### 3. Learn — sign detail

Each sign gets its own detail page. The layout is consistent across all 29:

- **Looping GIF** on the left with playback controls (0.5×, 1×, 1.5×, zoom, captions)
- **Numbered steps** on the right explaining the production of the sign
- **Pro tip** about facial expression or non-manual markers — the part everyone else leaves out
- **Three tabs** at the bottom: Examples (real scenarios), Common Mistakes, Real Scenario

![Help sign detail page](docs/screenshots/04-learn-detail-help.png)

The pro tips are deliberately specific. For Help: *"Raised eyebrows and a slight forward lean turn this from a statement into a request — your face is the ask."* For Crime: *"Pair this with a serious furrow and downward eyes — it conveys 'this is wrong' as much as 'this happened'."* These are the kinds of details that make the difference between recognizing a sign in a video and recognizing it from across a counter.

![Crime sign detail page](docs/screenshots/07-learn-detail-crime.png)

### 4. Quick Reference

The Reference page is a single-scroll cheat-sheet of every sign, organized by category with thumbnails and one-line descriptions. It includes a **Print** button so users can keep a paper copy at a workplace.

![Quick Reference page](docs/screenshots/08-reference.png)

### 5. Practice round

Practice is low-stakes: three questions, unlimited retries, hints available. The framing — *"No pressure — you can retry as many times as you want"* — is deliberately soft, because the goal is to surface mistakes the user makes *before* they're being scored.

![Practice question 1 — what is this person signing?](docs/screenshots/09-practice-q1.png)

Each question shows a GIF of someone signing and four labeled options. Keyboard shortcuts (1-4 to choose, H for hint, S to skip) are shown inline. Distractors are intentionally chosen to be plausibly confusable — for example, the "Stop" sign and "Crime" sign both involve V-handshapes near the face, and the app makes you actually look at the difference.

![Practice question 2 with four options](docs/screenshots/10-practice-q2-options.png)

If a user clicks **Need a hint?**, the app reveals the category and a short clue about hand-shape or motion — *"CATEGORY: REFUSAL — FINGERS SNAP TOGETHER LIKE A BEAK"* — without giving away the answer outright. This rewards the user for the cognitive work of mapping the hint back to a sign.

![Hint reveal showing category and motion clue](docs/screenshots/11-practice-hint.png)

When practice is complete, the user sees their stats (time, attempts, accuracy) and the app auto-advances to the main quiz with a 2-second cancel window. This nudges progress without trapping the user.

![Practice complete screen with stats](docs/screenshots/12-practice-complete.png)

### 6. Main Quiz

The Main Quiz is five questions, scored, scenario-based. The header now shows progress (Q 1/5), score (1/5), and a streak counter — feedback gets denser because the stakes are higher.

After each answer, the app gives an immediate **why right / why wrong** explanation, and crucially, the explanation isn't about hand-shape — it's about *the cue the user should have used*. For Shooting: *"Lean your body slightly forward and lower your stance — your posture should communicate 'incoming threat' even before they read your hand."* This is the app reinforcing what the pro tips taught earlier.

![Quiz question with correct feedback](docs/screenshots/13-quiz-correct.png)

### 7. Quiz results

The results page is more than a score. It includes a question-by-question breakdown with the *reasoning* for each correct answer — so even a 5/5 user walks away having internalized the cues, not just the labels.

![Quiz results showing 5/5 with per-question review](docs/screenshots/14-quiz-results.png)

The Best streak and Accuracy stats feed into the Progress page (not shown), where users can track their history over multiple sessions.

---

## Design system

SignSafe avoids generic AI-startup aesthetics deliberately. The look is editorial — like a print magazine about emergency preparedness, not a Duolingo clone.

**Type**
- Display: Georgia (serif) — for headings, sign names, hero text
- Body: Carlito (sans) — open-source Calibri metric-compatible alternative
- Pairing: serif for emotion, sans for action

**Color**
- Background: cream `#FAF7F2` — warm, paper-like, low fatigue
- Foreground: navy `#1E293B` — readable without being harsh
- Primary: terracotta `#C0523E` — earthy, urgent without being alarming red
- Accents: green (success), red (life-threatening), gold (warning), blue (medical), warm-grey (neutral surfaces)

**Motion**
- Float, wiggle, bob, pop-in, flame-flicker — small ambient animations on doodle marks and decorative elements
- All motion respects `prefers-reduced-motion: reduce` and snaps to 0.01ms when users opt out

**Components**
- shadcn/ui (New York style) with Radix primitives under the hood
- Custom utilities for `text-page-title`, `text-sign-name`, `text-button`, `text-step`, `text-category` — typographic scale defined as utilities, not one-off classes

---

## Tech stack

| Layer | Choice |
|---|---|
| **Framework** | TanStack Start (React 19 + Vite + SSR) |
| **Routing** | TanStack Router (file-based, type-safe) |
| **Styling** | Tailwind CSS v4 + `tw-animate-css` |
| **Components** | shadcn/ui (Radix primitives) |
| **State** | Zustand for client state, TanStack Query for async |
| **Forms** | react-hook-form + zod validation |
| **Type system** | TypeScript 5.8, strict mode |
| **Build target** | Cloudflare Workers (via `@cloudflare/vite-plugin`) |
| **Package manager** | bun |
| **Dev environment** | Lovable + `@lovable.dev/vite-tanstack-config` |
| **Animation** | framer-motion, canvas-confetti for celebrations |
| **Charts** | recharts (used in Progress page) |

---

## Project structure

```
.
├── src/
│   ├── routes/                   # File-based routes — TanStack Router auto-generates routeTree.gen.ts
│   │   ├── __root.tsx
│   │   ├── index.tsx             # /         (Home)
│   │   ├── learn/
│   │   │   ├── index.tsx         # /learn    (Learn index)
│   │   │   └── $signId.tsx       # /learn/:signId   (Sign detail)
│   │   ├── practice.tsx          # /practice
│   │   ├── quiz.tsx              # /quiz
│   │   ├── progress.tsx          # /progress
│   │   └── reference.tsx         # /reference
│   ├── components/               # shadcn/ui + app-specific components
│   ├── lib/                      # utils, helpers
│   ├── hooks/
│   ├── data/                     # the 29 signs, scenarios, quiz questions
│   ├── router.tsx                # router setup + default error boundary
│   └── styles.css                # design tokens + Tailwind config
├── docs/
│   └── screenshots/              # README screenshots
├── components.json               # shadcn/ui config (style: new-york, baseColor: slate)
├── tailwind.config.*             # design tokens live in styles.css via @theme
├── vite.config.ts                # uses @lovable.dev/vite-tanstack-config preset
├── wrangler.jsonc                # Cloudflare Workers deploy config
├── tsconfig.json
├── eslint.config.js
└── package.json
```

---

## Running locally

Prereqs: Node 20+ and bun (or npm/pnpm).

```bash
# install
bun install

# dev server (Vite, with HMR)
bun run dev

# build for production
bun run build

# preview production build
bun run preview

# lint and format
bun run lint
bun run format
```

The app runs on `http://localhost:8081` by default (port assigned by the Lovable sandbox config — adjust in `vite.config.ts` if needed).

---

## Deployment

Production target is Cloudflare Workers via Wrangler. The Vite Cloudflare plugin is enabled in build mode only (via `@lovable.dev/vite-tanstack-config`), so local dev runs as a normal Vite server.

```bash
# build, then deploy
bun run build
wrangler deploy
```

---

## Credits

**Built by:** Sri Bhuvana Vaishnavi Dasika (UNI: sd3971)
**Course:** COMS 4170 — User Interface Design, Columbia University
**Instructor:** Prof. Lydia Chilton
**Sign video sources:** Compiled from public ASL educational resources; credit to original signers and instructors

**Acknowledgments:** This project owes its framing to every Deaf person who has had a hearing person fail to understand them in an emergency. The app exists to make that fail-state a little less common.

---

## License

This project is currently a course submission and not licensed for redistribution. Sign videos are used under fair-use for educational purposes; if you are a rights-holder and want a video removed or credited differently, please open an issue.
