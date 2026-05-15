import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PracticeAttempt = {
  completedAt: string;
  durationMs: number;
  attempts: number; // total option clicks across the run
  correctFirstTry: number;
  total: number;
};

type ProgressState = {
  signsViewed: string[];
  signsLearned: string[];
  quizAttempts: number;
  streak: number;
  lastActivity: string | null;
  achievements: string[];
  practiceRuns: PracticeAttempt[];
  practiceUnlockedQuiz: boolean;
  markViewed: (id: string) => void;
  markLearned: (id: string) => void;
  recordQuiz: () => void;
  recordPractice: (a: PracticeAttempt) => void;
  unlockQuiz: () => void;
};

function bumpStreak(prev: { streak: number; lastActivity: string | null }) {
  const today = new Date();
  const todayKey = today.toDateString();
  if (!prev.lastActivity) return { streak: 1, lastActivity: today.toISOString() };
  const last = new Date(prev.lastActivity);
  const lastKey = last.toDateString();
  if (lastKey === todayKey) return { streak: Math.max(1, prev.streak), lastActivity: today.toISOString() };
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isConsecutive = lastKey === yesterday.toDateString();
  return {
    streak: isConsecutive ? prev.streak + 1 : 1,
    lastActivity: today.toISOString(),
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      signsViewed: [],
      signsLearned: [],
      quizAttempts: 0,
      streak: 0,
      lastActivity: null,
      achievements: [],
      practiceRuns: [],
      practiceUnlockedQuiz: false,
      unlockQuiz: () => set({ practiceUnlockedQuiz: true }),
      markViewed: (id) =>
        set((s) => ({
          signsViewed: s.signsViewed.includes(id) ? s.signsViewed : [...s.signsViewed, id],
          ...bumpStreak(s),
        })),
      markLearned: (id) =>
        set((s) => ({
          signsLearned: s.signsLearned.includes(id) ? s.signsLearned : [...s.signsLearned, id],
          ...bumpStreak(s),
        })),
      recordQuiz: () =>
        set((s) => ({
          quizAttempts: s.quizAttempts + 1,
          ...bumpStreak(s),
        })),
      recordPractice: (a) =>
        set((s) => ({
          practiceRuns: [...s.practiceRuns, a].slice(-20),
          ...bumpStreak(s),
          practiceUnlockedQuiz:
            s.practiceUnlockedQuiz || a.correctFirstTry / Math.max(1, a.total) >= 2 / 3,
        })),
    }),
    { name: "signsafe-progress" },
  ),
);

