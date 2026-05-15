import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Flame,
  BookOpen,
  ClipboardList,
  Target,
  Trophy,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  Card,
  CategoryPill,
  BackButton,
  PrimaryButton,
  GhostButton,
  IconBadge,
  ProgressBar,
} from "@/components/ui/primitives";
import { ArrowDoodle } from "@/components/doodles/Doodles";
import { useProgressStore } from "@/stores/useProgressStore";
import { TOTAL_SIGNS } from "@/data/signs";
import { cn } from "@/lib/utils";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function fmtDuration(ms: number) {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

const ACHIEVEMENTS = [
  { id: "first-view", label: "Started Learning", earned: (s: ReturnType<typeof useProgressStore.getState>) => s.signsViewed.length > 0 },
  { id: "first-quiz", label: "First Quiz Taken", earned: (s: ReturnType<typeof useProgressStore.getState>) => s.quizAttempts > 0 },
  { id: "first-practice", label: "First Practice Run", earned: (s: ReturnType<typeof useProgressStore.getState>) => s.practiceRuns.length > 0 },
  { id: "quiz-unlocked", label: "Quiz Unlocked", earned: (s: ReturnType<typeof useProgressStore.getState>) => s.practiceUnlockedQuiz },
  { id: "streak-7", label: "7-Day Streak", earned: (s: ReturnType<typeof useProgressStore.getState>) => s.streak >= 7 },
  { id: "all-signs", label: "All Signs Learned", earned: (s: ReturnType<typeof useProgressStore.getState>) => s.signsLearned.length >= TOTAL_SIGNS },
];

function ProgressPage() {
  const state = useProgressStore();
  const learnedCount = state.signsLearned.length;
  const learnedPct = (learnedCount / TOTAL_SIGNS) * 100;
  const bestAccuracy = state.practiceRuns.length
    ? Math.round(
        Math.max(
          ...state.practiceRuns.map((r) => (r.correctFirstTry / Math.max(1, r.total)) * 100),
        ),
      )
    : 0;

  const hasActivity =
    state.signsViewed.length > 0 ||
    state.practiceRuns.length > 0 ||
    state.quizAttempts > 0;

  const reset = () => {
    if (!window.confirm("Clear all progress? This can't be undone.")) return;
    useProgressStore.persist.clearStorage();
    window.location.reload();
  };

  return (
    <PageWrapper>
      <div className="pt-8 flex items-center justify-between gap-4">
        <BackButton to="/" label="Home" />
        {hasActivity && (
          <GhostButton onClick={reset}>
            <RotateCcw className="w-4 h-4" /> Reset progress
          </GhostButton>
        )}
      </div>

      <div className="pt-8 flex flex-col items-center text-center gap-4 max-w-[760px] mx-auto">
        <CategoryPill>Progress</CategoryPill>
        <h1 className="font-serif font-bold text-navy text-[clamp(2.5rem,5vw,3.5rem)] leading-tight">
          My Progress
        </h1>
        <p className="text-navy/70 text-[17px] max-w-[520px]">
          Your streaks, practice runs, and milestones — all in one place.
        </p>
      </div>

      {!hasActivity ? (
        <Card className="relative mt-12 p-10 max-w-[640px] mx-auto text-center flex flex-col items-center gap-5 overflow-hidden">
          <ArrowDoodle className="absolute top-6 right-8 w-20 h-8 text-terracotta/50 rotate-12" />
          <span className="text-5xl" aria-hidden>🌱</span>
          <h2 className="font-serif font-bold text-navy text-2xl">
            Nothing here yet
          </h2>
          <p className="text-navy/70 text-[15px] max-w-[420px]">
            Open a sign or run a practice round to start tracking your progress.
          </p>
          <Link to="/learn">
            <PrimaryButton>
              Start Learning <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
          </Link>
        </Card>
      ) : (
        <>
          {/* Stat row */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <IconBadge tone="terracotta">
                  <BookOpen className="w-5 h-5" />
                </IconBadge>
                <span className="text-[12px] uppercase tracking-wider text-muted font-bold">
                  Signs
                </span>
              </div>
              <div className="font-serif font-bold text-navy text-4xl leading-none">
                {learnedCount}
                <span className="text-muted text-2xl"> / {TOTAL_SIGNS}</span>
              </div>
              <ProgressBar value={learnedPct} />
            </Card>

            <Card className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <IconBadge tone="gold">
                  <Flame className="w-5 h-5" />
                </IconBadge>
                <span className="text-[12px] uppercase tracking-wider text-muted font-bold">
                  Streak
                </span>
              </div>
              <div className="font-serif font-bold text-navy text-4xl leading-none">
                {state.streak}
                <span className="text-muted text-xl"> days</span>
              </div>
              <p className="text-[12px] text-navy/60">
                {state.lastActivity
                  ? `Last active ${fmtDate(state.lastActivity)}`
                  : "Come back tomorrow!"}
              </p>
            </Card>

            <Card className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <IconBadge tone="navy">
                  <ClipboardList className="w-5 h-5" />
                </IconBadge>
                <span className="text-[12px] uppercase tracking-wider text-muted font-bold">
                  Quizzes
                </span>
              </div>
              <div className="font-serif font-bold text-navy text-4xl leading-none">
                {state.quizAttempts}
              </div>
              <p className="text-[12px] text-navy/60">
                {state.practiceUnlockedQuiz ? "Main quiz unlocked" : "Practice to unlock"}
              </p>
            </Card>

            <Card className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <IconBadge tone="green">
                  <Target className="w-5 h-5" />
                </IconBadge>
                <span className="text-[12px] uppercase tracking-wider text-muted font-bold">
                  Best Practice
                </span>
              </div>
              <div className="font-serif font-bold text-navy text-4xl leading-none">
                {bestAccuracy}%
              </div>
              <p className="text-[12px] text-navy/60">
                Across {state.practiceRuns.length} run
                {state.practiceRuns.length === 1 ? "" : "s"}
              </p>
            </Card>
          </div>

          {/* Practice history */}
          <section className="mt-12">
            <h2 className="font-serif font-bold text-navy text-2xl mb-4">
              Practice history
            </h2>
            {state.practiceRuns.length === 0 ? (
              <Card className="p-6 text-center text-navy/60 text-[14px]">
                No practice runs yet.{" "}
                <Link to="/practice" className="text-terracotta font-bold underline">
                  Start one →
                </Link>
              </Card>
            ) : (
              <div className="space-y-2">
                {[...state.practiceRuns]
                  .reverse()
                  .slice(0, 10)
                  .map((r, i) => {
                    const acc = Math.round((r.correctFirstTry / Math.max(1, r.total)) * 100);
                    const passed = acc >= 67;
                    return (
                      <Card
                        key={i}
                        className={cn(
                          "p-4 flex items-center gap-4 border-l-4",
                          passed ? "border-l-green" : "border-l-terracotta",
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-navy text-[14px]">
                            {fmtDate(r.completedAt)}
                          </div>
                          <div className="text-[12px] text-navy/60">
                            {r.correctFirstTry}/{r.total} first-try · {r.attempts} clicks · {fmtDuration(r.durationMs)}
                          </div>
                        </div>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[12px] font-bold",
                            passed ? "bg-green/15 text-green" : "bg-terracotta/15 text-terracotta",
                          )}
                        >
                          {acc}%
                        </span>
                      </Card>
                    );
                  })}
              </div>
            )}
          </section>

          {/* Achievements */}
          <section className="mt-12">
            <h2 className="font-serif font-bold text-navy text-2xl mb-4 inline-flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" /> Achievements
            </h2>
            <div className="flex flex-wrap gap-2">
              {ACHIEVEMENTS.map((a) => {
                const earned = a.earned(state);
                return (
                  <span
                    key={a.id}
                    className={cn(
                      "px-4 py-2 rounded-full text-[13px] font-bold border transition-colors",
                      earned
                        ? "bg-green/15 text-green border-green/30"
                        : "bg-warm-grey text-navy/40 border-warm-grey",
                    )}
                  >
                    {earned ? "✓ " : "○ "}
                    {a.label}
                  </span>
                );
              })}
            </div>
          </section>
        </>
      )}
    </PageWrapper>
  );
}

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress — SignSafe" },
      {
        name: "description",
        content:
          "Track signs learned, practice accuracy, streaks, and achievements as you build emergency ASL fluency.",
      },
    ],
  }),
  component: ProgressPage,
});
