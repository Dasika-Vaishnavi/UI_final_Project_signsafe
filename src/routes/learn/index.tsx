import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trophy } from "lucide-react";
import {
  Card,
  CategoryPill,
  GhostButton,
  ProgressBar,
  BackButton,
} from "@/components/ui/primitives";
import {
  signs,
  signsByCategory,
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_EMOJI,
  TOTAL_SIGNS,
  type Sign,
  type SignCategory,
} from "@/data/signs";
import { useProgressStore } from "@/stores/useProgressStore";
import { cn } from "@/lib/utils";

type Filter = "ALL" | SignCategory;

const FILTERS: { key: Filter; label: string; emoji?: string }[] = [
  { key: "ALL", label: "All 29" },
  { key: "LIFE-THREATENING", label: "Life-Threatening (5)", emoji: "🆘" },
  { key: "MEDICAL", label: "Medical (6)", emoji: "🩺" },
  { key: "SAFETY", label: "Safety (6)", emoji: "🛡️" },
  { key: "COMMUNICATION", label: "Communication (6)", emoji: "💬" },
  { key: "EMOTIONAL", label: "Emotional (6)", emoji: "💛" },
];

function DifficultyDots({ d }: { d: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            i <= d ? "bg-terracotta" : "bg-warm-grey",
          )}
        />
      ))}
    </div>
  );
}

function SignCard({
  sign,
  isLearned,
  isCurrent,
  isRecommended,
  isFirstEver,
}: {
  sign: Sign;
  isLearned: boolean;
  isCurrent: boolean;
  isRecommended: boolean;
  isFirstEver: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to="/learn/$signId"
      params={{ signId: sign.id }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block relative group"
    >
      <Card
        className={cn(
          "overflow-hidden flex flex-col aspect-square hover:-translate-y-0.5 hover:shadow-card-hover relative",
          isCurrent && "border-terracotta border-2",
        )}
      >
        {isFirstEver && (
          <motion.span
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute top-2 left-2 z-10 bg-white text-terracotta text-caption px-2 py-0.5 rounded-full shadow-card border border-terracotta/30"
          >
            Start Here
          </motion.span>
        )}
        {isRecommended && !isFirstEver && (
          <span className="absolute top-2 left-2 z-10 text-caption text-terracotta bg-cream/90 px-2 py-0.5 rounded-full">
            Recommended Next
          </span>
        )}
        {isLearned && (
          <span
            aria-label="Learned"
            className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-green text-white flex items-center justify-center"
          >
            <Check className="w-3 h-3" strokeWidth={3} />
          </span>
        )}

        {/* GIF area */}
        <div className="flex-1 bg-warm-grey flex items-center justify-center overflow-hidden relative">
          <img
            src={sign.gifUrl}
            alt={`${sign.name} sign demonstration`}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover transition-all duration-300",
              !hovered && "grayscale-[20%]",
            )}
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
              if (t.parentElement) {
                t.parentElement.innerHTML = `<span class="text-5xl">${sign.fallbackEmoji}</span>`;
              }
            }}
          />
        </div>

        {/* Bottom strip */}
        <div className="h-14 bg-white border-t border-warm-grey px-3 flex items-center gap-2 relative">
          <span className="text-lg leading-none" aria-hidden>
            {sign.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-serif font-bold text-navy text-[14px] leading-tight truncate">
              {sign.name}
            </div>
            <DifficultyDots d={sign.difficulty} />
          </div>
          <span className="text-caption text-muted">#{sign.order}</span>
          <span
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ backgroundColor: CATEGORY_COLORS[sign.category] }}
          />
        </div>
      </Card>
    </Link>
  );
}

function CategorySection({
  category,
  cardsFor,
}: {
  category: SignCategory;
  cardsFor: (s: Sign) => React.ReactNode;
}) {
  const list = signsByCategory[category];
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 pb-2 border-b border-warm-grey">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: CATEGORY_COLORS[category] }}
        />
        <h2 className="font-serif font-bold text-navy text-[14px]">
          {CATEGORY_EMOJI[category]} {category}
        </h2>
        <span className="text-[11px] text-muted">({list.length} signs)</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
        {list.map(cardsFor)}
      </div>
    </section>
  );
}

function LearnOverview() {
  const navigate = useNavigate();
  const learned = useProgressStore((s) => s.signsLearned);
  const viewed = useProgressStore((s) => s.signsViewed);
  const lastViewed = viewed[viewed.length - 1];
  const [filter, setFilter] = useState<Filter>("ALL");

  const learnedCount = learned.length;
  const pct = (learnedCount / TOTAL_SIGNS) * 100;
  const allDone = learnedCount === TOTAL_SIGNS;

  const recommendedNext = useMemo(() => {
    return signs.find((s) => !learned.includes(s.id) && !viewed.includes(s.id));
  }, [learned, viewed]);

  const isFirstEver = viewed.length === 0;

  const renderCard = (s: Sign) => (
    <SignCard
      key={s.id}
      sign={s}
      isLearned={learned.includes(s.id)}
      isCurrent={s.id === lastViewed && !learned.includes(s.id)}
      isRecommended={recommendedNext?.id === s.id && !isFirstEver}
      isFirstEver={isFirstEver && s.order === 1}
    />
  );

  const goRandom = () => {
    const pool = signs.filter((s) => !learned.includes(s.id));
    const pick = (pool.length > 0 ? pool : signs)[Math.floor(Math.random() * (pool.length || signs.length))];
    navigate({ to: "/learn/$signId", params: { signId: pick.id } });
  };

  const quizDest = learnedCount >= 20 ? "/quiz" : "/practice";

  return (
    <div className="min-h-screen bg-cream">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-warm-grey">
        <div className="h-1 w-full bg-terracotta" />
        <div className="max-w-[1140px] mx-auto px-6 h-[68px] flex items-center justify-between gap-4">
          <BackButton to="/" label="Home" />
          <span className="text-caption text-navy/70 hidden sm:inline">
            30 Emergency Signs
          </span>
          <span className="text-caption text-navy/70">📚 Learn</span>
        </div>
        <ProgressBar value={pct} className="rounded-none" />
      </div>

      <main id="main" className="max-w-[1140px] mx-auto px-6 pb-24">
        {/* Title block */}
        <div className="flex flex-col items-center text-center pt-12 gap-4 max-w-[720px] mx-auto">
          <CategoryPill>Learning Path</CategoryPill>
          <h1 className="text-page-title text-navy">Choose a sign to learn</h1>
          <p className="text-sm text-navy/70">
            Thirty essential signs across five categories. We recommend going in
            order — they build on each other.
          </p>
        </div>

        {/* Filter row */}
        <div className="mt-8 -mx-6 px-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-button transition-all duration-200",
                    active
                      ? "bg-terracotta text-white shadow-card"
                      : "bg-warm-grey text-navy hover:-translate-y-0.5",
                  )}
                >
                  {f.emoji && <span aria-hidden>{f.emoji}</span>}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] text-muted">
              <span className="font-bold text-terracotta">{learnedCount}</span> /{" "}
              {TOTAL_SIGNS} signs learned
            </p>
            <ProgressBar value={pct} className="w-60" />
          </div>
          {allDone && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green/10 text-green rounded-full text-[12px] font-bold">
              <Trophy className="w-4 h-4" /> All 30 learned!
              <Link to="/quiz" className="underline ml-1">
                Take master quiz →
              </Link>
            </div>
          )}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            {filter === "ALL" ? (
              CATEGORIES.map((c) => (
                <CategorySection key={c} category={c} cardsFor={renderCard} />
              ))
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {signsByCategory[filter].map(renderCard)}
              </div>
            )}
            {filter !== "ALL" &&
              !signsByCategory[filter].some((s) => learned.includes(s.id)) && (
                <p className="mt-6 text-center text-[12px] text-muted">
                  Start with{" "}
                  <Link
                    to="/learn/$signId"
                    params={{ signId: signsByCategory[filter][0].id }}
                    className="text-terracotta font-bold underline"
                  >
                    {signsByCategory[filter][0].name} →
                  </Link>
                </p>
              )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-[12px] text-muted">
            {learnedCount} of {TOTAL_SIGNS} signs learned
          </p>
          <div className="flex gap-2">
            <GhostButton onClick={goRandom}>Random Sign →</GhostButton>
            <Link to={quizDest}>
              <GhostButton>Jump to Quiz →</GhostButton>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Learn 30 Emergency ASL Signs — SignSafe" },
      {
        name: "description",
        content:
          "Browse 30 essential emergency ASL signs across five categories. Tap any card to begin learning.",
      },
      { property: "og:title", content: "Learn 30 Emergency ASL Signs" },
      {
        property: "og:description",
        content: "30 essential emergency ASL signs across five categories.",
      },
    ],
  }),
  component: LearnOverview,
});
