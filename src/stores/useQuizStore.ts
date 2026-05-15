import { create } from "zustand";

type QuizType = "practice" | "main" | "situational";

type QuizState = {
  currentQuestion: number;
  answers: (string | null)[];
  score: number;
  type: QuizType | null;
  startedAt: number | null;
  start: (type: QuizType, total: number) => void;
  answer: (value: string, isCorrect: boolean) => void;
  reset: () => void;
};

export const useQuizStore = create<QuizState>((set) => ({
  currentQuestion: 0,
  answers: [],
  score: 0,
  type: null,
  startedAt: null,
  start: (type, total) =>
    set({
      type,
      currentQuestion: 0,
      answers: Array(total).fill(null),
      score: 0,
      startedAt: Date.now(),
    }),
  answer: (value, isCorrect) =>
    set((s) => {
      const answers = [...s.answers];
      answers[s.currentQuestion] = value;
      return {
        answers,
        score: isCorrect ? s.score + 1 : s.score,
        currentQuestion: s.currentQuestion + 1,
      };
    }),
  reset: () =>
    set({ currentQuestion: 0, answers: [], score: 0, type: null, startedAt: null }),
}));
