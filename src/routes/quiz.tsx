import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trophy, ArrowRight, Target } from "lucide-react";
import { QuizEngine, buildQuestions } from "@/components/quiz/QuizEngine";
import { useProgressStore } from "@/stores/useProgressStore";
import {
  Card,
  PrimaryButton,
  GhostButton,
  CategoryPill,
  IconBadge,
  BackButton,
} from "@/components/ui/primitives";
import { DoodleField, Star, Sparkle, CircleScribble, Squiggle } from "@/components/doodles/Doodles";

function QuizScreen() {
  const navigate = useNavigate();
  const unlocked = useProgressStore((s) => s.practiceUnlockedQuiz);
  const unlockQuiz = useProgressStore((s) => s.unlockQuiz);
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => buildQuestions(5), [seed]);

  useEffect(() => {
    const onRetake = () => setSeed((s) => s + 1);
    window.addEventListener("quiz:retake", onRetake);
    return () => window.removeEventListener("quiz:retake", onRetake);
  }, []);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="relative max-w-[680px] mx-auto px-6 py-20">
          <DoodleField
            items={[
              { cmp: Star, className: "w-5 h-5 text-gold/70 top-8 left-4", rot: -10 },
              { cmp: Sparkle, className: "w-4 h-4 text-terracotta/70 top-16 right-8", rot: 12 },
              { cmp: CircleScribble, className: "w-14 h-14 text-terracotta/25 bottom-12 left-2", rot: 12 },
              { cmp: Squiggle, className: "w-16 h-3 text-navy/30 bottom-20 right-4", rot: -6 },
            ]}
          />
          <Card className="relative p-10 flex flex-col items-center text-center gap-5">
            <IconBadge tone="terracotta" className="w-20 h-20 rounded-full pop-in">
              <Target className="w-10 h-10" />
            </IconBadge>
            <CategoryPill>Warm up first</CategoryPill>
            <h1 className="font-serif font-bold text-navy text-4xl leading-tight">
              Try Practice Mode before the real quiz
            </h1>
            <p className="text-navy/70 max-w-[460px] text-[15px] leading-relaxed">
              Practice gives you unlimited retries, hints, and a "drill my misses"
              loop. Score 67% first-try and the main quiz unlocks automatically.
            </p>
            <div className="mt-2 flex flex-wrap gap-3 justify-center">
              <PrimaryButton onClick={() => navigate({ to: "/practice" })}>
                <Trophy className="w-4 h-4" /> Start Practice
                <ArrowRight className="w-4 h-4" />
              </PrimaryButton>
              <GhostButton
                onClick={() => {
                  unlockQuiz();
                  setSeed((s) => s + 1);
                }}
              >
                Skip warm-up
              </GhostButton>
            </div>
            <BackButton to="/learn" label="Back to Learn" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <QuizEngine
      type="main"
      badge="Main Quiz"
      title="What sign is being shown?"
      subtitle="5 signs. Identify each one from the motion alone."
      questions={questions}
      cropped={true}
    />
  );
}

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "ASL Emergency Signs Quiz — SignSafe" },
      {
        name: "description",
        content:
          "Test your recall of 29 emergency ASL signs. Identify each sign from motion alone.",
      },
    ],
  }),
  component: QuizScreen,
});
