import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { BookOpen, Target, ClipboardList, Clock, ArrowRight, BookMarked, LineChart } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  Card,
  PrimaryButton,
  SecondaryButton,
  CategoryPill,
  IconBadge,
} from "@/components/ui/primitives";
import {
  DoodleField,
  Squiggle,
  Star,
  Sparkle,
  CircleScribble,
  ArrowDoodle,
  Dot,
  WavyUnderline,
} from "@/components/doodles/Doodles";
import { signs as ALL_SIGNS } from "@/data/signs";
import { useProgressStore } from "@/stores/useProgressStore";
import { EmergencySearch } from "@/components/search/EmergencySearch";

import learningBuddies from "@/assets/illustrations/learning-buddies.png";
import teacherBlackboard from "@/assets/illustrations/teacher-blackboard.png";

function CountUp({ to, duration = 900 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return setN(to);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, reduced]);
  return <>{n}</>;
}

const STATS = [
  { icon: BookOpen, value: 30, label: "Signs", tone: "terracotta" as const },
  { icon: Target, value: 3, label: "Practice", tone: "green" as const },
  { icon: ClipboardList, value: 5, label: "Quiz", tone: "gold" as const },
  { icon: Clock, value: 15, label: "~Min", tone: "navy" as const },
];

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Home() {
  const sotd = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86_400_000);
    return ALL_SIGNS[dayIndex % ALL_SIGNS.length];
  }, []);
  const quizUnlocked = useProgressStore((s) => s.practiceUnlockedQuiz);

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative pt-12 sm:pt-20">
        <DoodleField
          items={[
            { cmp: Star, className: "w-6 h-6 text-gold/70 top-4 left-[6%]", rot: -10 },
            { cmp: Sparkle, className: "w-5 h-5 text-terracotta/60 top-12 right-[8%]", rot: 12, delay: 0.6 },
            { cmp: CircleScribble, className: "w-16 h-16 text-terracotta/30 top-40 left-[3%]", rot: -8, delay: 1.2 },
            { cmp: Squiggle, className: "w-20 h-3 text-navy/30 top-32 right-[4%]", rot: 8, delay: 0.3 },
            { cmp: Dot, className: "w-2 h-2 text-terracotta/60 top-72 left-[14%]", delay: 0.8 },
            { cmp: Star, className: "w-4 h-4 text-green/60 top-64 right-[12%]", rot: 22, delay: 1.5 },
          ]}
        />

        <div className="relative flex flex-col items-center text-center max-w-[1080px] mx-auto">
          <motion.div custom={0} initial="hidden" animate="show" variants={fade}>
            <CategoryPill className="px-3 py-1 rounded-full bg-terracotta/10">
              ✦ Emergency Preparedness
            </CategoryPill>
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fade}
            className="mt-8 font-serif font-bold text-navy leading-[1.02] tracking-tight max-w-[960px] text-[clamp(3rem,7.5vw,5.5rem)]"
          >
            Emergency ASL Signs{" "}
            <span className="relative inline-block text-terracotta">
              Everyone
              <WavyUnderline className="absolute -bottom-2 left-0 w-full h-3 text-terracotta/70" />
            </span>{" "}
            Should Know
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fade}
            className="mt-8 text-[22px] text-navy/75 max-w-[720px] leading-[1.55]"
          >
            30 essential signs across five categories — built for everyday people
            who want to be ready when it matters most.
          </motion.p>

          {/* Emergency search */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fade}
            className="mt-12 w-full"
          >
            <EmergencySearch />
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fade}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-[960px]"
          >
            {STATS.map(({ icon: Icon, value, label, tone }) => (
              <Card
                key={label}
                className="group p-8 flex flex-col items-center gap-3 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <IconBadge tone={tone} className="group-hover:rotate-6 transition-transform">
                  <Icon className="w-6 h-6" />
                </IconBadge>
                <div className="font-serif font-bold text-[64px] text-terracotta leading-none">
                  <CountUp to={value} />
                </div>
                <div className="text-[13px] uppercase tracking-[0.14em] text-muted font-bold">
                  {label}
                </div>
              </Card>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fade}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto relative"
          >
            <ArrowDoodle className="hidden md:block absolute -left-24 top-1/2 -translate-y-1/2 w-20 h-8 text-terracotta/60" />
            <div className="relative pulse-ring rounded-xl w-full sm:w-auto">
              <Link to="/learn" className="block">
                <PrimaryButton className="w-full sm:w-auto text-base">
                  Start Learning
                  <ArrowRight className="w-5 h-5 bob-x" />
                </PrimaryButton>
              </Link>
            </div>
            <Link to="/quiz" className="w-full sm:w-auto">
              <SecondaryButton className="w-full sm:w-auto text-base">
                Jump to Quiz
              </SecondaryButton>
            </Link>
          </motion.div>
          {!quizUnlocked && (
            <p className="mt-3 text-[12px] text-navy/60">
              Tip: practice first to unlock the quiz
            </p>
          )}

          {/* Tertiary action cards */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="show"
            variants={fade}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[860px]"
          >
            {[
              { to: "/reference", icon: BookMarked, tone: "terracotta" as const, label: "Quick Reference", sub: "Printable cheat-sheet" },
              { to: "/practice", icon: Target, tone: "green" as const, label: "Practice", sub: "Warm up with retries" },
              { to: "/progress", icon: LineChart, tone: "gold" as const, label: "My Progress", sub: "Streaks & history" },
            ].map(({ to, icon: Icon, tone, label, sub }) => (
              <Link key={to} to={to} className="group">
                <Card className="p-5 flex items-center gap-4 text-left hover:-translate-y-1 hover:shadow-card-hover hover:border-terracotta/40">
                  <IconBadge tone={tone} className="shrink-0 group-hover:rotate-6 transition-transform">
                    <Icon className="w-6 h-6" />
                  </IconBadge>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-bold text-navy text-lg leading-tight group-hover:text-terracotta transition-colors">
                      {label}
                    </div>
                    <div className="text-[13px] text-navy/60">{sub}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-terracotta opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Card>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-24">
        <div className="text-center mb-8">
          <CategoryPill>How it works</CategoryPill>
          <h2 className="font-serif font-bold text-navy text-4xl mt-3">
            Three steps. About 15 minutes.
          </h2>
        </div>
        <ol className="grid sm:grid-cols-3 gap-4 max-w-[960px] mx-auto">
          {[
            { n: 1, icon: BookOpen, tone: "terracotta" as const, title: "Learn", body: "Watch each sign with steps, when-to-use tips, and common mistakes." },
            { n: 2, icon: Target, tone: "green" as const, title: "Practice", body: "Identify signs from motion alone. Hints and unlimited retries." },
            { n: 3, icon: ClipboardList, tone: "gold" as const, title: "Quiz", body: "5 questions. Score 80%+ to prove you're emergency-ready." },
          ].map(({ n, icon: Icon, tone, title, body }) => (
            <Card key={n} className="p-6 flex flex-col gap-3 relative">
              <span className="absolute top-4 right-5 font-serif font-bold text-5xl text-terracotta/15 leading-none">
                {n}
              </span>
              <IconBadge tone={tone}>
                <Icon className="w-6 h-6" />
              </IconBadge>
              <h3 className="font-serif font-bold text-navy text-2xl">{title}</h3>
              <p className="text-[15px] text-navy/70 leading-relaxed">{body}</p>
            </Card>
          ))}
        </ol>
      </section>

      {/* Sign of the Day */}
      <section className="relative mt-28">
        <Card className="relative overflow-hidden max-w-[760px] mx-auto group hover:-translate-y-0.5 hover:shadow-card-hover">
          <Sparkle className="absolute top-4 right-4 w-4 h-4 text-gold/70 float-doodle" />
          <Link
            to="/learn/$signId"
            params={{ signId: sotd.id }}
            className="grid sm:grid-cols-[auto_1fr] items-center gap-4 sm:gap-6 p-6 sm:p-8"
          >
            <img
              src={teacherBlackboard}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="w-32 sm:w-44 mx-auto sm:mx-0 select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-[0.16em] text-terracotta font-bold">
                ✦ Sign of the Day
              </span>
              <h3 className="font-serif font-bold text-navy text-4xl">
                {sotd.name}
              </h3>
              <p className="text-[16px] text-navy/70 max-w-md">{sotd.whenToUse}</p>
              <span className="text-[14px] text-terracotta font-bold inline-flex items-center gap-1.5 group-hover:gap-3 transition-all justify-center sm:justify-start">
                Learn this sign <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </Card>
      </section>

      {/* Why it matters */}
      <section className="mt-28">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-center">
          <img
            src={learningBuddies}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="w-48 lg:w-full max-w-[260px] mx-auto select-none pointer-events-none float-doodle"
          />
          <div>
            <h2 className="font-serif font-bold text-navy text-5xl mb-6 text-center lg:text-left">
              Why this matters
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { emoji: "🤝", title: "Communicate in emergencies", body: "Bridge the gap when seconds count and words won't reach." },
                { emoji: "🌍", title: "Help Deaf community members", body: "Show up with respect and a few essential signs ready." },
                { emoji: "❤️", title: "Build inclusive habits", body: "Small fluency creates safer, kinder public spaces." },
              ].map((c) => (
                <Card key={c.title} className="p-6 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-card-hover">
                  <span className="text-3xl" aria-hidden>{c.emoji}</span>
                  <h3 className="font-serif font-bold text-navy text-xl leading-snug">{c.title}</h3>
                  <p className="text-[15px] text-navy/70 leading-relaxed">{c.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
