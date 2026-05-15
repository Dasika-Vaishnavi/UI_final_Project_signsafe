import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, Volume2, VolumeX, Lightbulb, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { signs as ALL_SIGNS, type Sign } from "@/data/signs";
import { CroppedSignGif } from "@/components/quiz/CroppedSignGif";
import {
  Card,
  PrimaryButton,
  GhostButton,
  CategoryPill,
  BackButton,
} from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/useProgressStore";
import { cn } from "@/lib/utils";

const HINTS: Record<string, string> = {
  stop: "Category: command — a sharp downward chop.",
  no: "Category: refusal — fingers snap together like a beak.",
  safe: "Category: reassurance — wrists uncross outward.",
  shooting: "Category: life-threatening — index points forward, thumb flicks.",
  hospital: "Category: medical destination — drawn on the upper arm.",
  allergy: "Category: medical reaction — starts at the nose.",
  crime: "Category: safety — a hooked drag across the palm.",
  calm: "Category: emotional state — both palms press downward slowly.",
};

type QQ = { sign: Sign; choices: Sign[]; correctIndex: number; hint: string };

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function buildPracticeQuestions(restrictToIds?: string[]): QQ[] {
  // Quiz pool excludes any GIF with a burned-in English caption.
  const safePool = ALL_SIGNS.filter((s) => !s.hasTextLabel);
  let targets: Sign[];
  if (restrictToIds && restrictToIds.length > 0) {
    targets = restrictToIds
      .map((id) => safePool.find((s) => s.id === id))
      .filter(Boolean) as Sign[];
  } else {
    const preferredIds = ["stop", "no", "safe"];
    const preferred = preferredIds
      .map((id) => safePool.find((s) => s.id === id))
      .filter(Boolean) as Sign[];
    const filler = pickRandom(
      safePool.filter((s) => !preferredIds.includes(s.id)),
      Math.max(0, 3 - preferred.length),
    );
    targets = [...preferred, ...filler].slice(0, 3);
  }

  return targets.map((sign) => {
    if (sign.hasTextLabel) throw new Error("text-bearing sign in practice: " + sign.id);
    const distractors = pickRandom(
      safePool.filter((s) => s.id !== sign.id),
      3,
    );
    const choices = [sign, ...distractors].sort(() => Math.random() - 0.5);
    return {
      sign,
      choices,
      correctIndex: choices.findIndex((c) => c.id === sign.id),
      hint: HINTS[sign.id] ?? "Pay attention to the handshape and direction.",
    };
  });
}

function reshuffleQuestion(q: QQ): QQ {
  const choices = [...q.choices].sort(() => Math.random() - 0.5);
  return { ...q, choices, correctIndex: choices.findIndex((c) => c.id === q.sign.id) };
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

// Lightweight Web Audio chime
function playChime(success: boolean, muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    if (success) {
      o.frequency.setValueAtTime(660, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.18);
    } else {
      o.frequency.setValueAtTime(280, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
    }
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.start();
    o.stop(ctx.currentTime + 0.45);
  } catch {
    /* ignore */
  }
}

function ProgressDots({ current, statuses }: { current: number; statuses: ("done" | "wrong" | "todo" | "current")[] }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Question ${current + 1} of ${statuses.length}`}>
      {statuses.map((st, i) => (
        <span
          key={i}
          className={cn(
            "h-2.5 rounded-full transition-all",
            st === "done" && "bg-green w-6",
            st === "wrong" && "bg-terracotta w-6",
            st === "current" && "bg-terracotta w-8 shadow-[0_0_0_3px_rgba(192,82,62,0.15)]",
            st === "todo" && "bg-warm-grey w-2.5",
          )}
        >
          {st === "done" && (
            <Check className="w-2.5 h-2.5 text-white mx-auto" strokeWidth={4} />
          )}
        </span>
      ))}
    </div>
  );
}

function PracticeScreen() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const recordPractice = useProgressStore((s) => s.recordPractice);
  const unlockQuiz = useProgressStore((s) => s.unlockQuiz);

  const [questions, setQuestions] = useState<QQ[]>([]);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState(false);
  const [showHintBtn, setShowHintBtn] = useState(false);
  const [endless, setEndless] = useState(false);
  const [attemptNum, setAttemptNum] = useState(1);
  const [autoCountdown, setAutoCountdown] = useState<number | null>(null);

  // Stats
  const startedAtRef = useRef<number>(Date.now());
  const totalAttemptsRef = useRef(0);
  const firstTryWrongRef = useRef<Set<number>>(new Set());
  const correctSetRef = useRef<Set<number>>(new Set());
  const missedIdsRef = useRef<Set<string>>(new Set());
  const [elapsed, setElapsed] = useState(0);

  const total = questions.length;
  const q = questions[qi];

  // Build questions on the client to avoid SSR/CSR mismatch from Math.random
  useEffect(() => {
    if (questions.length === 0) {
      setQuestions(buildPracticeQuestions());
      startedAtRef.current = Date.now();
    }
  }, [questions.length]);

  // Timer
  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setElapsed(Date.now() - startedAtRef.current), 1000);
    return () => clearInterval(id);
  }, [done]);

  // Auto-advance from the done screen into the Main Quiz.
  useEffect(() => {
    if (autoCountdown === null) return;
    if (autoCountdown <= 0) {
      navigate({ to: "/quiz" });
      return;
    }
    const id = window.setTimeout(() => setAutoCountdown((n) => (n === null ? null : n - 1)), 1000);
    return () => clearTimeout(id);
  }, [autoCountdown, navigate]);

  // Reveal hint button after 5s on each question
  useEffect(() => {
    setShowHintBtn(false);
    setShowHint(false);
    setRevealAnswer(false);
    setPicked(null);
    setAttemptNum(1);
    const id = window.setTimeout(() => setShowHintBtn(true), 5000);
    return () => clearTimeout(id);
  }, [qi]);

  const finishRun = useCallback(() => {
    setDone(true);
    const durationMs = Date.now() - startedAtRef.current;
    const correctFirstTry = correctSetRef.current.size - firstTryWrongRef.current.size;
    recordPractice({
      completedAt: new Date().toISOString(),
      durationMs,
      attempts: totalAttemptsRef.current,
      correctFirstTry,
      total,
    });
    // Always unlock the main quiz once a Practice run is completed.
    unlockQuiz();
    setAutoCountdown(4);
  }, [total, recordPractice, unlockQuiz]);

  const advance = useCallback(() => {
    if (qi < total - 1) {
      setQi((p) => p + 1);
    } else if (endless) {
      // Loop forever — fresh batch, fresh stats window for the new round.
      setQuestions(buildPracticeQuestions());
      setQi(0);
    } else {
      finishRun();
    }
  }, [qi, total, endless, finishRun]);

  const choose = (i: number) => {
    if (picked !== null) return;
    totalAttemptsRef.current += 1;
    setPicked(i);
    const correct = i === q.correctIndex;
    if (correct) {
      correctSetRef.current.add(qi);
      playChime(true, muted);
      if (!reduce) {
        confetti({
          particleCount: 40,
          spread: 55,
          startVelocity: 28,
          origin: { y: 0.55 },
          colors: ["#16A34A", "#C0523E", "#D4943A", "#1E293B"],
          disableForReducedMotion: true,
        });
      }
      window.setTimeout(advance, 1500);
    } else {
      firstTryWrongRef.current.add(qi);
      missedIdsRef.current.add(q.sign.id);
      playChime(false, muted);
    }
  };

  const tryAgain = () => {
    setQuestions((qs) => qs.map((qq, idx) => (idx === qi ? reshuffleQuestion(qq) : qq)));
    setPicked(null);
    setRevealAnswer(false);
    setAttemptNum((n) => n + 1);
  };

  const resetRun = useCallback((newQs: QQ[]) => {
    startedAtRef.current = Date.now();
    totalAttemptsRef.current = 0;
    firstTryWrongRef.current = new Set();
    correctSetRef.current = new Set();
    missedIdsRef.current = new Set();
    setElapsed(0);
    setQuestions(newQs);
    setQi(0);
    setPicked(null);
    setRevealAnswer(false);
    setShowHint(false);
    setAttemptNum(1);
    setDone(false);
    setAutoCountdown(null);
  }, []);

  const practiceAgain = () => resetRun(buildPracticeQuestions());
  const drillMisses = () => {
    const ids = Array.from(missedIdsRef.current);
    if (ids.length === 0) return;
    resetRun(buildPracticeQuestions(ids));
  };

  const skipQuestion = useCallback(() => {
    if (picked !== null || !q) return;
    firstTryWrongRef.current.add(qi);
    missedIdsRef.current.add(q.sign.id);
    advance();
  }, [picked, q, qi, advance]);

  // Keyboard shortcuts: 1-4 pick option, R retry on wrong, S skip, H hint
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done || !q) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      const wrong = picked !== null && picked !== q.correctIndex;
      if (/^[1-4]$/.test(k)) {
        const idx = parseInt(k, 10) - 1;
        if (idx < q.choices.length && picked === null) {
          e.preventDefault();
          choose(idx);
        }
      } else if (k.toLowerCase() === "r" && wrong) {
        e.preventDefault();
        tryAgain();
      } else if (k.toLowerCase() === "s" && picked === null) {
        e.preventDefault();
        skipQuestion();
      } else if (k.toLowerCase() === "h" && picked === null) {
        e.preventDefault();
        setShowHint(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, picked, done, skipQuestion]);

  // ─── Done screen ───────────────────────────────────────────────
  if (done) {
    const durationMs = Date.now() - startedAtRef.current;
    const correctFirstTry = correctSetRef.current.size - firstTryWrongRef.current.size;
    const accuracy = Math.round((correctFirstTry / total) * 100);

    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-[640px] mx-auto px-6 py-16">
          <div className="flex flex-col items-center text-center gap-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full bg-green/15 text-green flex items-center justify-center"
            >
              <Check className="w-12 h-12" strokeWidth={3} />
            </motion.div>
            <CategoryPill>Practice complete</CategoryPill>
            <h1 className="text-page-title text-navy">Nice — moving you to the Main Quiz</h1>
            <p className="text-navy/70 max-w-[420px]">
              You're ready. The real quiz has 5 questions and includes
              scenario-based challenges.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <div className="text-caption text-muted">Time</div>
              <div className="font-serif font-bold text-navy text-xl mt-1">
                {formatTime(durationMs)}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-caption text-muted">Attempts</div>
              <div className="font-serif font-bold text-navy text-xl mt-1">
                {totalAttemptsRef.current}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-caption text-muted">Accuracy</div>
              <div
                className={cn(
                  "font-serif font-bold text-xl mt-1",
                  accuracy === 100 ? "text-green" : "text-terracotta",
                )}
              >
                {accuracy}%
              </div>
            </Card>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link to="/learn">
              <GhostButton>Review Signs</GhostButton>
            </Link>
            <GhostButton onClick={practiceAgain}>
              <RotateCcw className="w-4 h-4" /> Practice Again
            </GhostButton>
            {missedIdsRef.current.size > 0 && (
              <GhostButton onClick={drillMisses}>
                <RotateCcw className="w-4 h-4" /> Drill My Misses ({missedIdsRef.current.size})
              </GhostButton>
            )}
            <PrimaryButton onClick={() => navigate({ to: "/quiz" })}>
              <Trophy className="w-4 h-4" /> Take the Real Quiz
              <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
          </div>
          {autoCountdown !== null && autoCountdown > 0 && (
            <div
              className="mt-6 text-center"
              role="status"
              aria-live="polite"
            >
              <p className="text-navy font-medium">
                Starting the Main Quiz in {autoCountdown}…
              </p>
              <button
                onClick={() => setAutoCountdown(null)}
                className="mt-2 text-caption text-terracotta underline underline-offset-2 hover:opacity-80"
              >
                Cancel — stay on this screen
              </button>
            </div>
          )}
          {accuracy < 67 && (
            <p className="mt-4 text-center text-caption text-muted">
              Tip: hit 67%+ first-try accuracy to keep your streak strong.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Loading state during SSR / initial client paint (avoids hydration mismatch)
  if (questions.length === 0 || !q) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-navy/60 text-sm" role="status" aria-live="polite">
          Loading practice…
        </div>
      </div>
    );
  }

  // ─── Question screen ───────────────────────────────────────────
  const statuses = questions.map((_, i) => {
    if (i === qi) return "current" as const;
    if (correctSetRef.current.has(i)) return "done" as const;
    if (i < qi) return "wrong" as const;
    return "todo" as const;
  });

  const isWrong = picked !== null && picked !== q.correctIndex;
  const wrongSign = isWrong ? q.choices[picked!] : null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <div className="max-w-[720px] mx-auto px-6 pt-6 flex items-center justify-between">
        <BackButton to="/learn" label="Back to Learn" />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-caption text-navy/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={endless}
              onChange={(e) => setEndless(e.target.checked)}
              className="accent-terracotta"
            />
            Loop forever
          </label>
          <span
            className="font-mono text-caption text-muted tabular-nums"
            aria-label="Elapsed time"
          >
            {formatTime(elapsed)}
          </span>
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            className="text-navy/60 hover:text-terracotta transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="max-w-[640px] mx-auto px-6 pt-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/15 text-green text-category">
            Practice Round
          </span>
          <p className="text-navy/70 text-sm">
            No pressure — you can retry as many times as you want.
          </p>
          <ProgressDots current={qi} statuses={statuses} />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={qi}
            initial={reduce ? false : { x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? undefined : { x: -60, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="mt-8 p-6 md:p-8 flex flex-col items-center">
              <div className="mb-4 self-stretch flex items-center justify-between">
                <span className="text-caption text-muted">
                  Question {qi + 1} of {total}
                </span>
                {attemptNum > 1 && (
                  <span className="text-caption font-mono text-terracotta">
                    Attempt {attemptNum}
                  </span>
                )}
              </div>

              <CroppedSignGif
                gifUrl={q.sign.gifUrl}
                ariaLabel={`Sign demonstration. ${q.sign.steps.join(". ")}`}
                size="lg"
                fallbackEmoji={q.sign.fallbackEmoji}
              />

              <h1 className="font-serif font-bold text-navy text-2xl mt-6 text-center">
                What is this person signing?
              </h1>

              {/* Hint */}
              <div className="mt-3 min-h-[36px] flex flex-col items-center">
                {showHintBtn && !showHint && picked === null && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-caption text-terracotta inline-flex items-center gap-1.5 hover:underline"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> Need a hint?
                  </button>
                )}
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-caption text-navy/70 italic"
                  >
                    💡 {q.hint}
                  </motion.p>
                )}
              </div>

              {/* Options */}
              <p className="mt-4 text-caption text-muted self-start">
                Tip: press <kbd className="font-mono px-1.5 py-0.5 rounded bg-warm-grey text-navy">1</kbd>–<kbd className="font-mono px-1.5 py-0.5 rounded bg-warm-grey text-navy">{q.choices.length}</kbd> to choose · <kbd className="font-mono px-1.5 py-0.5 rounded bg-warm-grey text-navy">H</kbd> hint · <kbd className="font-mono px-1.5 py-0.5 rounded bg-warm-grey text-navy">S</kbd> skip
              </p>
              <div role="radiogroup" aria-label="Answer choices" className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {q.choices.map((choice, i) => {
                  const isCorrect = i === q.correctIndex;
                  const isPicked = i === picked;
                  const showWrongOnThis = picked !== null && isPicked && !isCorrect;
                  const showCorrectOnThis = picked !== null && isCorrect;
                  const dim = picked !== null && !isPicked && !isCorrect;
                  const pulseCorrect = (isWrong || revealAnswer) && isCorrect;

                  return (
                    <motion.button
                      key={choice.id + i}
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                      role="radio"
                      aria-checked={isPicked}
                      aria-keyshortcuts={String(i + 1)}
                      aria-label={`Option ${i + 1}: ${choice.name}`}
                      animate={pulseCorrect ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={pulseCorrect ? { repeat: Infinity, duration: 1.4 } : { duration: 0.2 }}
                      className={cn(
                        "group relative bg-white rounded-xl p-5 text-left flex items-center gap-3 border-2 transition-all",
                        "hover:-translate-y-0.5 hover:shadow-card-hover",
                        "border-warm-grey",
                        showCorrectOnThis && "!border-green bg-green/5",
                        showWrongOnThis && "!border-terracotta bg-terracotta/5",
                        pulseCorrect && "!border-green bg-green/5",
                        dim && "opacity-30 hover:translate-y-0 hover:shadow-card",
                        picked !== null && "cursor-default",
                      )}
                    >
                      <span className="text-3xl leading-none shrink-0" aria-hidden>
                        {choice.emoji}
                      </span>
                      <span className="font-serif font-bold text-navy text-lg flex-1">
                        {choice.name}
                      </span>
                      {showCorrectOnThis || pulseCorrect ? (
                        <span className="w-6 h-6 rounded-full bg-green text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </span>
                      ) : showWrongOnThis ? (
                        <span className="w-6 h-6 rounded-full bg-terracotta text-white flex items-center justify-center shrink-0">
                          <X className="w-3.5 h-3.5" strokeWidth={3} />
                        </span>
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              <div className="mt-5 w-full min-h-[60px]" role="status" aria-live="polite">
                {picked !== null && picked === q.correctIndex && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green/10 border-l-4 border-green rounded-r-md px-4 py-3 text-sm text-navy"
                  >
                    <strong className="text-green">✓ Correct!</strong>{" "}
                    <strong>{q.sign.name}</strong> — {q.sign.whenToUse}
                  </motion.div>
                )}
                {isWrong && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-terracotta/10 border-l-4 border-terracotta rounded-r-md px-4 py-3 text-sm text-navy flex flex-col gap-3"
                  >
                    <span>
                      Not quite — that's <strong>{wrongSign?.name}</strong>. Want to try again?
                    </span>
                    <div className="flex gap-3 flex-wrap">
                      <PrimaryButton onClick={tryAgain} className="!py-2 !px-4 text-sm">
                        <RotateCcw className="w-3.5 h-3.5" /> Try Again
                      </PrimaryButton>
                      {!revealAnswer ? (
                        <button
                          onClick={() => setRevealAnswer(true)}
                          className="text-caption text-navy/70 hover:text-terracotta underline self-center"
                        >
                          Show me the answer
                        </button>
                      ) : (
                        <button
                          onClick={advance}
                          className="text-caption text-navy/70 hover:text-terracotta underline self-center"
                        >
                          Move on →
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Skip */}
        <div className="mt-6 text-center">
          <button
            onClick={skipQuestion}
            disabled={picked !== null}
            className="text-caption text-muted hover:text-terracotta disabled:opacity-40"
          >
            Skip question →
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice ASL Signs — SignSafe" },
      {
        name: "description",
        content:
          "Warm up with a 3-question practice round. Identify ASL signs from cropped GIFs with hints and unlimited retries.",
      },
    ],
  }),
  component: PracticeScreen,
});
