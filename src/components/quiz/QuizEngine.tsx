import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Check, X, RotateCcw, ArrowRight, Flame, Trophy } from "lucide-react";
import { signs as ALL_SIGNS, type Sign } from "@/data/signs";
import { GraduateBadge, HintShrug } from "./QuizIcons";
import {
  Card,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  ProgressBar,
  CategoryPill,
  BackButton,
} from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { useQuizStore } from "@/stores/useQuizStore";
import { useProgressStore } from "@/stores/useProgressStore";

export type QuizQuestion = {
  sign: Sign;
  choices: string[];
  correctIndex: number;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuestions(count: number, pool: Sign[] = ALL_SIGNS): QuizQuestion[] {
  const quizPool = pool.filter((s) => !s.hasTextLabel);
  const picked = shuffle(quizPool).slice(0, count);
  return picked.map((sign) => {
    if (sign.hasTextLabel) throw new Error("text-bearing sign in quiz pool: " + sign.id);
    const distractors = shuffle(quizPool.filter((s) => s.id !== sign.id))
      .slice(0, 3)
      .map((s) => s.name);
    const choices = shuffle([sign.name, ...distractors]);
    return { sign, choices, correctIndex: choices.indexOf(sign.name) };
  });
}

type Props = {
  title: string;
  subtitle: string;
  badge: string;
  questions: QuizQuestion[];
  cropped?: boolean;
  type: "practice" | "main" | "situational";
  exitTo?: string;
};

type Result = { signId: string; correct: boolean; chosen: string; correctName: string };

export function QuizEngine({
  title,
  subtitle,
  badge,
  questions,
  cropped = false,
  type,
  exitTo = "/learn",
}: Props) {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [floater, setFloater] = useState<{ id: number; kind: "plus" | "miss" } | null>(null);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [imgError, setImgError] = useState(false);
  const startQuiz = useQuizStore((s) => s.start);
  const recordAnswer = useQuizStore((s) => s.answer);
  const resetQuiz = useQuizStore((s) => s.reset);
  const recordQuiz = useProgressStore((s) => s.recordQuiz);

  useMemo(() => {
    startQuiz(type, questions.length);
  }, [type, questions.length, startQuiz]);

  const total = questions.length;
  const q = questions[qi];
  const feedback = picked !== null;

  const choose = (i: number) => {
    if (feedback) return;
    setPicked(i);
    const correct = i === q.correctIndex;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setFloater({ id: Date.now(), kind: correct ? "plus" : "miss" });
    recordAnswer(q.choices[i], correct);
    setResults((r) => [
      ...r,
      { signId: q.sign.id, correct, chosen: q.choices[i], correctName: q.sign.name },
    ]);
  };

  const next = () => {
    if (qi < total - 1) {
      setQi((p) => p + 1);
      setPicked(null);
      setImgError(false);
    } else {
      setDone(true);
      if (type === "main") recordQuiz();
    }
  };

  // Keyboard shortcuts: 1-4 to pick, Enter / Space to advance after answer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (!feedback && /^[1-4]$/.test(k)) {
        const idx = parseInt(k, 10) - 1;
        if (q && idx < q.choices.length) {
          e.preventDefault();
          choose(idx);
        }
      } else if (feedback && (k === "Enter" || k === " ")) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, done, q, qi, total]);

  const retake = () => {
    resetQuiz();
    setQi(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setDone(false);
    setResults([]);
    setImgError(false);
    startQuiz(type, total);
    window.dispatchEvent(new CustomEvent("quiz:retake"));
  };

  // ──────────────────────────────────────────────────────────── End screen
  if (done) {
    const pct = Math.round((score / total) * 100);
    const wrong = total - score;
    const passed = pct >= 80;
    const verdict = passed
      ? "Excellent — you're ready!"
      : pct >= 60
        ? "Good — review the misses, then try again."
        : "Keep practicing — every sign matters.";

    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-[720px] mx-auto px-6 py-16">
          <div className="text-center flex flex-col items-center gap-4">
            {passed ? (
              <GraduateBadge className="w-32 h-32 text-green" />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-terracotta/15 text-terracotta">
                <RotateCcw className="w-10 h-10" />
              </div>
            )}
            <CategoryPill>{badge} · Result</CategoryPill>
            <h1 className="font-serif font-bold text-navy text-5xl">
              {score} <span className="text-muted">/ {total}</span>
            </h1>
            <p className="text-navy/70 max-w-[420px]">{verdict}</p>
            <ProgressBar value={pct} className="w-60 mt-2" />

            {/* Summary band */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-[480px] mt-4">
              {[
                { label: "Correct", value: score, color: "text-green" },
                { label: "Wrong", value: wrong, color: "text-terracotta" },
                { label: "Best 🔥", value: bestStreak, color: "text-navy" },
                { label: "Accuracy", value: `${pct}%`, color: "text-terracotta" },
              ].map((m) => (
                <Card key={m.label} className="p-3 flex flex-col items-center gap-0.5">
                  <span className={cn("font-serif font-bold text-2xl leading-none", m.color)}>
                    {m.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted">
                    {m.label}
                  </span>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-12 space-y-3">
            <h2 className="font-serif font-bold text-navy text-lg">Question by question</h2>
            {results.map((r, i) => {
              const sign = questions[i].sign;
              const why = r.correct
                ? sign.proTip
                : `You picked ${r.chosen}. The answer was ${r.correctName}${
                    sign.commonMistakes?.[0] ? ` — ${sign.commonMistakes[0]}` : ""
                  }. ${sign.proTip}`;
              return (
                <Card
                  key={i}
                  className={cn(
                    "p-4 border-l-4",
                    r.correct ? "border-l-green" : "border-l-terracotta",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "w-8 h-8 shrink-0 rounded-full flex items-center justify-center",
                        r.correct ? "bg-green text-white" : "bg-terracotta text-white",
                      )}
                    >
                      {r.correct ? <Check className="w-4 h-4" strokeWidth={3} /> : <X className="w-4 h-4" strokeWidth={3} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-serif font-bold text-navy">
                          Q{i + 1}. {r.correctName}
                        </div>
                        <Link
                          to="/learn/$signId"
                          params={{ signId: sign.id }}
                          className="text-caption text-terracotta hover:underline shrink-0"
                        >
                          Review →
                        </Link>
                      </div>
                      <div className="mt-1 text-[13px] text-navy/80 leading-relaxed">
                        <span className={cn("font-bold", r.correct ? "text-green" : "text-terracotta")}>
                          {r.correct ? "Why right:" : "Why wrong:"}
                        </span>{" "}
                        {why}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <SecondaryButton onClick={() => (window.location.href = exitTo)}>
              Back to Learn
            </SecondaryButton>
            <PrimaryButton onClick={retake}>
              <RotateCcw className="w-4 h-4" /> Retake
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────── Question
  const sign = q.sign;
  const isCorrectPick = picked === q.correctIndex;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-[720px] mx-auto px-6 py-10">
        {/* HUD */}
        <div className="flex items-center justify-between mb-3">
          <CategoryPill>{badge}</CategoryPill>
          <div className="relative flex items-center gap-3 text-caption">
            <span className="font-mono text-muted">
              Q <span className="text-navy font-bold">{qi + 1}</span> / {total}
            </span>
            <span className="font-mono">
              <Trophy className="inline w-3.5 h-3.5 mr-1 text-terracotta" />
              <span className="font-bold text-terracotta">{score}</span>
              <span className="text-muted">/{total}</span>
            </span>
            <span className="font-mono inline-flex items-center gap-1">
              <Flame
                className={cn("w-3.5 h-3.5", streak > 0 ? "text-terracotta" : "text-muted/50")}
              />
              <span className={cn("font-bold", streak > 0 ? "text-terracotta" : "text-muted")}>
                {streak}
              </span>
            </span>
            <AnimatePresence>
              {floater && (
                <motion.span
                  key={floater.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: -14 }}
                  exit={{ opacity: 0, y: -28 }}
                  transition={{ duration: 0.7 }}
                  onAnimationComplete={() => setFloater(null)}
                  className={cn(
                    "absolute -top-2 right-0 font-mono font-bold text-sm pointer-events-none",
                    floater.kind === "plus" ? "text-green" : "text-terracotta",
                  )}
                >
                  {floater.kind === "plus" ? "+1" : "−"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ProgressBar value={((qi + 1) / total) * 100} className="mb-3" />

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-4" aria-label="Question progress">
          {Array.from({ length: total }).map((_, i) => {
            const r = results[i];
            const isCurrent = i === qi && !done;
            return (
              <span
                key={i}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  isCurrent ? "w-6 bg-navy" : "w-2.5",
                  !isCurrent && !r && "bg-warm-grey",
                  !isCurrent && r?.correct && "bg-green",
                  !isCurrent && r && !r.correct && "bg-terracotta",
                )}
              />
            );
          })}
        </div>

        <h1 className="font-serif font-bold text-navy text-3xl mt-6">{title}</h1>
        <p className="text-navy/70 mt-1 text-sm">{subtitle}</p>

        {/* GIF */}
        <div
          className={cn(
            "mt-6 relative bg-warm-grey rounded-2xl overflow-hidden mx-auto shadow-card",
            cropped ? "aspect-square max-w-[420px] w-full" : "aspect-video w-full",
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={sign.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              {!imgError ? (
                <img
                  src={sign.gifUrl}
                  alt="Identify this ASL sign from its motion"
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
                  <span className="text-6xl" aria-hidden>
                    {sign.fallbackEmoji}
                  </span>
                  <span className="text-caption">Visual unavailable</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <h2 className="mt-6 font-serif font-bold text-navy text-lg" id="question-heading">What sign is this?</h2>
        <p className="mt-1 text-caption text-muted">
          Tip: press <kbd className="font-mono px-1.5 py-0.5 rounded bg-warm-grey text-navy">1</kbd>–<kbd className="font-mono px-1.5 py-0.5 rounded bg-warm-grey text-navy">{q.choices.length}</kbd> to choose, <kbd className="font-mono px-1.5 py-0.5 rounded bg-warm-grey text-navy">Enter</kbd> to continue.
        </p>

        <div role="radiogroup" aria-labelledby="question-heading" className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.choices.map((c, i) => {
            const isCorrect = i === q.correctIndex;
            const isPicked = i === picked;
            let state: "idle" | "correct" | "wrong" | "muted" = "idle";
            if (feedback) {
              if (isCorrect) state = "correct";
              else if (isPicked) state = "wrong";
              else state = "muted";
            }
            return (
              <motion.button
                key={i}
                onClick={() => choose(i)}
                disabled={feedback}
                role="radio"
                aria-checked={isPicked}
                aria-label={`Option ${i + 1}: ${c}${feedback ? (isCorrect ? " — correct answer" : isPicked ? " — your wrong answer" : "") : ""}`}
                aria-keyshortcuts={String(i + 1)}
                animate={
                  state === "correct"
                    ? { scale: [1, 1.04, 1] }
                    : state === "wrong"
                      ? { x: [0, -6, 6, -4, 4, 0] }
                      : { scale: 1, x: 0 }
                }
                transition={{ duration: 0.4 }}
                className={cn(
                  "text-left rounded-xl border-2 px-4 py-3.5 text-button transition-colors",
                  state === "idle" &&
                    "border-warm-grey bg-white text-navy hover:border-terracotta hover:-translate-y-0.5",
                  state === "correct" && "border-green bg-green text-white shadow-[0_8px_20px_-8px_rgba(22,163,74,0.6)]",
                  state === "wrong" && "border-terracotta bg-terracotta text-white shadow-[0_8px_20px_-8px_rgba(192,82,62,0.6)]",
                  state === "muted" && "border-warm-grey bg-white text-navy/40",
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold",
                      state === "correct" && "bg-white text-green border-white",
                      state === "wrong" && "bg-white text-terracotta border-white",
                      state === "idle" && "border-navy/30 text-navy/60",
                      state === "muted" && "border-navy/20 text-navy/40",
                    )}
                  >
                    {state === "correct" ? "✓" : state === "wrong" ? "✗" : String.fromCharCode(65 + i)}
                  </span>
                  {c}
                </span>
              </motion.button>
            );
          })}
        </div>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5"
            role="status"
            aria-live="polite"
          >
            <Card
              className={cn(
                "p-4 border-l-4",
                isCorrectPick ? "border-l-green bg-green/5" : "border-l-terracotta bg-terracotta/5",
              )}
            >
              <div className="flex items-start gap-3">
                {isCorrectPick ? (
                  <GraduateBadge className="w-14 h-14 shrink-0 text-green" />
                ) : (
                  <HintShrug className="w-14 h-14 shrink-0 text-terracotta" />
                )}
                <p className="text-sm text-navy flex-1 leading-relaxed">
                  {isCorrectPick ? (
                    <>
                      <strong className="text-green">Correct!</strong> That was{" "}
                      <strong>{sign.name}</strong>. {sign.proTip}
                    </>
                  ) : (
                    <>
                      <strong className="text-terracotta">Hint:</strong> the answer was{" "}
                      <strong>{sign.name}</strong>. {sign.proTip}
                    </>
                  )}
                </p>
              </div>
            </Card>
            <div className="mt-4 flex justify-end">
              <PrimaryButton onClick={next}>
                {qi < total - 1 ? (
                  <>
                    Next question <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>See results →</>
                )}
              </PrimaryButton>
            </div>
          </motion.div>
        )}

        <div className="mt-10 flex justify-center">
          <BackButton to="/learn" label="Exit quiz" />
        </div>
      </div>
    </div>
  );
}
