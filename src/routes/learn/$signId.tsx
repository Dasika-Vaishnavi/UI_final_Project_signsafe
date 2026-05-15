import { useEffect, useRef, useState, useCallback } from "react";
import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  RotateCw,
  ZoomIn,
  Volume2,
  X,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  Card,
  GhostButton,
  PrimaryButton,
  SecondaryButton,
  ProgressBar,
} from "@/components/ui/primitives";
import {
  signs,
  getSignById,
  getNextSign,
  getPreviousSign,
  getRelatedSigns,
  signsByCategory,
  CATEGORY_COLORS,
  CATEGORY_EMOJI,
  TOTAL_SIGNS,
} from "@/data/signs";
import { useProgressStore } from "@/stores/useProgressStore";
import { cn } from "@/lib/utils";
import { GifPlayer } from "@/components/learn/GifPlayer";

type Tab = "examples" | "mistakes" | "scenario";

function DifficultyDots({ d }: { d: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "w-2 h-2 rounded-full",
            i <= d ? "bg-terracotta" : "bg-warm-grey",
          )}
        />
      ))}
    </div>
  );
}

function SignPage() {
  const { signId } = Route.useParams();
  const navigate = useNavigate();
  const sign = getSignById(signId);
  if (!sign) throw notFound();

  const prev = getPreviousSign(sign.id);
  const next = getNextSign(sign.id);
  const isLast = !next;

  const learned = useProgressStore((s) => s.signsLearned);
  const isLearned = learned.includes(sign.id);
  const markLearned = useProgressStore((s) => s.markLearned);
  const markViewed = useProgressStore((s) => s.markViewed);

  const [tab, setTab] = useState<Tab>("examples");
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5>(1);
  const [zoom, setZoom] = useState(false);
  const [gifKey, setGifKey] = useState(0);
  const [gifError, setGifError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markViewed(sign.id);
    setGifError(false);
    setImgError(false);
    setGifKey((k) => k + 1);
    setPlaying(true);
    setTab("examples");
    if (liveRef.current) {
      liveRef.current.textContent = `Sign ${sign.order} of ${TOTAL_SIGNS}: ${sign.name}, ${sign.category}.`;
    }
  }, [sign.id, sign.order, sign.name, sign.category, markViewed]);

  const toggleLearned = useCallback(() => {
    if (isLearned) return;
    markLearned(sign.id);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.3 },
      colors: ["#C0523E", "#16A34A", "#D4943A"],
    });

    // Category completion check
    const newLearned = [...learned, sign.id];
    const catList = signsByCategory[sign.category];
    const catComplete = catList.every((s) => newLearned.includes(s.id));
    if (catComplete) {
      toast(`🎉 ${sign.category} complete! 6 / 6 signs learned`, {
        style: {
          background: "var(--cream)",
          color: "var(--navy)",
          borderLeft: `3px solid ${CATEGORY_COLORS[sign.category]}`,
        },
        duration: 4000,
      });
    }
    if (newLearned.length === TOTAL_SIGNS) {
      setTimeout(() => setShowCelebration(true), 700);
    }
  }, [isLearned, markLearned, sign.id, sign.category, learned]);

  const goNext = useCallback(() => {
    if (next) navigate({ to: "/learn/$signId", params: { signId: next.id } });
    else navigate({ to: "/practice" });
  }, [next, navigate]);
  const goPrev = useCallback(() => {
    if (prev) navigate({ to: "/learn/$signId", params: { signId: prev.id } });
  }, [prev, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key.toLowerCase() === "m") toggleLearned();
      else if (e.key === "1") setTab("examples");
      else if (e.key === "2") setTab("mistakes");
      else if (e.key === "3") setTab("scenario");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, toggleLearned]);

  const readSteps = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(sign.steps.join(". "));
    window.speechSynthesis.speak(u);
  };

  const progress = (sign.order / TOTAL_SIGNS) * 100;
  const categoryColor = CATEGORY_COLORS[sign.category];
  const isMilestone = sign.order % 6 === 0 && !isLast;

  return (
    <div className="min-h-screen bg-cream">
      <div ref={liveRef} aria-live="polite" className="sr-only" />

      {/* GROUP 1: NAV */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur">
        <div className="h-1 w-full bg-terracotta" />
        <div className="max-w-[880px] mx-auto px-6 h-14 flex items-center justify-between border-b border-warm-grey">
          <span className="text-caption text-navy/70">
            📚 Learn · Sign {sign.order} of {TOTAL_SIGNS}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-caption text-muted">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            {CATEGORY_EMOJI[sign.category]} {sign.category}
          </span>
          <Link to="/learn">
            <SecondaryButton className="py-2 px-4 text-[11px]">
              <ArrowLeft className="w-3 h-3" /> Back to All
            </SecondaryButton>
          </Link>
        </div>
        <ProgressBar value={progress} className="rounded-none" />
      </div>

      <main id="main" className="max-w-[880px] mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={sign.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* GROUP 2: IDENTITY */}
            <div className="mt-8 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[32px] leading-none" aria-hidden>
                    {sign.emoji}
                  </span>
                  <h1 className="text-sign-name text-navy">{sign.name}</h1>
                  <DifficultyDots d={sign.difficulty} />
                </div>
                <div className="text-category text-terracotta mt-2">
                  {sign.category}
                </div>
              </div>
              <button
                onClick={toggleLearned}
                aria-label={isLearned ? "Marked as learned" : "Mark as learned"}
                aria-pressed={isLearned}
                className={cn(
                  "shrink-0 w-9 h-9 rounded-full border-2 inline-flex items-center justify-center transition-colors",
                  isLearned
                    ? "bg-green border-green text-white"
                    : "border-terracotta text-terracotta hover:bg-terracotta hover:text-white",
                )}
              >
                <Check className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>

            {/* GROUP 3: MEDIA + INSTRUCTION */}
            <Card className="mt-6 p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* LEFT */}
                <div className="md:w-[45%] flex flex-col gap-3">
                  <div className="relative aspect-video bg-warm-grey rounded-xl overflow-hidden flex items-center justify-center max-w-[380px] w-full">
                    {!gifError ? (
                      <GifPlayer
                        src={sign.gifUrl}
                        alt={`Demonstration: ${sign.steps.join(". ")}`}
                        playing={playing}
                        speed={speed}
                        replayKey={gifKey}
                        className="w-full h-full object-cover transition-all"
                        pausedClassName="grayscale"
                        onError={() => setGifError(true)}
                      />
                    ) : !imgError ? (
                      <img
                        src={sign.gifUrl}
                        alt={`Demonstration: ${sign.steps.join(". ")}`}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[80px] leading-none" aria-hidden>
                          {sign.fallbackEmoji}
                        </span>
                        <span className="text-caption text-muted">Visual unavailable</span>
                      </div>
                    )}
                  </div>

                  {captionsOn && (
                    <div className="bg-navy text-white px-3 py-2 rounded-md text-sm leading-relaxed">
                      {sign.steps[0]}
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {!gifError && (
                      <>
                        <button
                          onClick={() => setPlaying((p) => !p)}
                          aria-label={playing ? "Pause" : "Play"}
                          className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center hover:bg-terracotta-hover"
                        >
                          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            setGifKey((k) => k + 1);
                            setPlaying(true);
                          }}
                          aria-label="Replay"
                          className="w-8 h-8 rounded-full bg-warm-grey text-navy flex items-center justify-center hover:bg-[#E5DED6]"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <div className="inline-flex bg-warm-grey rounded-full p-0.5 text-[11px] font-bold">
                          {([0.5, 1, 1.5] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => setSpeed(s)}
                              className={cn(
                                "px-2.5 py-1 rounded-full transition-colors",
                                speed === s ? "bg-terracotta text-white" : "text-navy hover:text-terracotta",
                              )}
                            >
                              {s}×
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    <button
                      onClick={() => setZoom(true)}
                      className="inline-flex items-center gap-1 text-[11px] text-navy hover:text-terracotta px-2 py-1"
                    >
                      <ZoomIn className="w-3.5 h-3.5" /> Zoom
                    </button>
                    <button
                      onClick={() => setCaptionsOn((c) => !c)}
                      aria-pressed={captionsOn}
                      className={cn(
                        "text-[11px] font-bold px-2 py-1 rounded",
                        captionsOn ? "text-terracotta" : "text-navy/70 hover:text-terracotta",
                      )}
                    >
                      CC
                    </button>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="md:w-[55%]">
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-navy/70">How to Sign</span>
                    <button
                      onClick={readSteps}
                      aria-label="Read steps aloud"
                      className="inline-flex items-center gap-1 text-[11px] text-navy/70 hover:text-terracotta"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Read aloud
                    </button>
                  </div>
                  <ol className="mt-4 flex flex-col gap-3">
                    {sign.steps.map((step, i) => (
                      <motion.li
                        key={`${sign.id}-${i}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                        className="flex items-start gap-3"
                      >
                        <span className="shrink-0 w-7 h-7 rounded-full bg-terracotta text-white inline-flex items-center justify-center font-bold text-[14px]">
                          {i + 1}
                        </span>
                        <p className="text-step text-navy pt-1">{step}</p>
                      </motion.li>
                    ))}
                  </ol>

                  <div className="mt-6 bg-cream border-l-[3px] border-terracotta px-4 py-3 rounded-r-md">
                    <div className="text-caption text-terracotta mb-1">Pro Tip</div>
                    <p className="text-[11px] italic text-terracotta leading-relaxed">
                      💡 {sign.proTip}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* GROUP 4: CONTEXT + ACTION */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="bg-cream border-l-[3px] border-terracotta px-4 py-3 rounded-r-md">
                <p className="text-[12px] italic text-terracotta">📍 {sign.whenToUse}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <SecondaryButton
                  className="md:w-[30%]"
                  disabled={!prev}
                  onClick={goPrev}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </SecondaryButton>
                <PrimaryButton className="md:w-[70%]" type="button" onClick={goNext}>
                  {isLast ? "🎉 Start Practice Quiz" : "Next Sign"}{" "}
                  <ArrowRight className="w-3.5 h-3.5" />
                </PrimaryButton>
              </div>

              {isMilestone && (
                <p className="text-center text-[11px] text-terracotta uppercase tracking-wider">
                  🏁 You've completed {sign.category} — keep going!
                </p>
              )}
            </div>

            {/* EXTRAS */}
            <section className="mt-16">
              <div className="flex items-center gap-1 border-b border-warm-grey">
                {(
                  [
                    ["examples", "Examples"],
                    ["mistakes", "Common Mistakes"],
                    ["scenario", "Real Scenario"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={cn(
                      "px-3 py-2 text-caption transition-colors -mb-px border-b-2",
                      tab === key
                        ? "text-navy border-terracotta"
                        : "text-muted border-transparent hover:text-navy",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <Card className="mt-4 p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {tab === "examples" && (
                      <ul className="flex flex-col gap-2">
                        {sign.examples.map((ex, i) => (
                          <li key={i} className="text-[13px] text-navy flex gap-2">
                            <span className="text-terracotta">•</span>
                            {ex}
                          </li>
                        ))}
                      </ul>
                    )}
                    {tab === "mistakes" && (
                      <ul className="flex flex-col gap-3">
                        {sign.commonMistakes.map((m, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-[13px] text-navy"
                          >
                            <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-red/10 text-red inline-flex items-center justify-center">
                              <X className="w-3 h-3" strokeWidth={3} />
                            </span>
                            {m}
                          </li>
                        ))}
                      </ul>
                    )}
                    {tab === "scenario" && (
                      <div>
                        <p className="text-[14px] italic text-navy/90 leading-relaxed">
                          "{sign.realScenario}"
                        </p>
                        <p className="text-caption text-muted mt-3">
                          — Real-world example
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Card>
            </section>

            {sign.funFact && (
              <Card className="mt-6 bg-warm-grey p-4 border-0">
                <div className="text-caption text-muted mb-1">💡 Did You Know</div>
                <p className="text-[11px] text-navy leading-relaxed">{sign.funFact}</p>
              </Card>
            )}

            <section className="mt-10">
              <div className="text-caption text-navy/70 mb-3">Related Signs</div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getRelatedSigns(sign).map((r) => (
                  <Link
                    key={r.id}
                    to="/learn/$signId"
                    params={{ signId: r.id }}
                    className="shrink-0 inline-flex items-center gap-2 border border-terracotta text-navy px-3 py-2 rounded-full hover:bg-terracotta hover:text-white transition-colors text-[12px] font-bold"
                  >
                    <span>{r.emoji}</span> {r.name}
                  </Link>
                ))}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ZOOM MODAL */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cream/95 flex items-center justify-center p-6"
            onClick={() => setZoom(false)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={sign.gifUrl}
              alt={`${sign.name} zoomed demonstration`}
              className="max-w-full max-h-[80vh] rounded-xl shadow-card-hover"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setZoom(false)}
              aria-label="Close"
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white text-navy flex items-center justify-center shadow-card"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CELEBRATION MODAL */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-cream rounded-2xl p-8 max-w-[480px] w-full text-center shadow-card-hover"
            >
              <div className="text-[64px] leading-none mb-4">🎉</div>
              <h2 className="text-sign-name text-navy">
                You've learned all 30 signs!
              </h2>
              <p className="text-sm text-navy/70 mt-2">
                Time to test what you've learned. The practice quiz will warm you up
                before the main assessment.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white rounded-xl p-3">
                  <div className="font-serif font-bold text-terracotta text-xl">{TOTAL_SIGNS}</div>
                  <div className="text-caption text-muted">Mastered</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="font-serif font-bold text-terracotta text-xl">5</div>
                  <div className="text-caption text-muted">Categories</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="font-serif font-bold text-terracotta text-xl">{signs.length}</div>
                  <div className="text-caption text-muted">Signs Done</div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link to="/practice" className="flex-1">
                  <PrimaryButton className="w-full">
                    🎯 Start Practice Quiz <ArrowRight className="w-3.5 h-3.5" />
                  </PrimaryButton>
                </Link>
                <GhostButton className="flex-1" onClick={() => setShowCelebration(false)}>
                  Review Signs
                </GhostButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Route = createFileRoute("/learn/$signId")({
  head: ({ params }) => {
    const sign = getSignById(params.signId);
    const title = sign ? `${sign.name} — ASL Sign` : "Sign — SignSafe";
    const desc = sign
      ? `Learn the ASL sign for "${sign.name}". ${sign.whenToUse}`
      : "Learn an emergency ASL sign.";
    return {
      meta: [
        { title: `${title} | SignSafe` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(sign
          ? [
              { property: "og:image", content: sign.gifUrl },
              { name: "twitter:image", content: sign.gifUrl },
            ]
          : []),
      ],
    };
  },
  component: SignPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-page-title text-navy">Sign not found</h1>
        <Link to="/learn" className="inline-block mt-4">
          <PrimaryButton>Back to Learn</PrimaryButton>
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-page-title text-navy">Something went wrong</h1>
        <p className="text-muted mt-2">{error.message}</p>
        <Link to="/learn" className="inline-block mt-4">
          <PrimaryButton>Back to Learn</PrimaryButton>
        </Link>
      </div>
    </div>
  ),
});
