import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreferencesState = {
  reducedMotion: boolean;
  soundEnabled: boolean;
  autoplayGifs: boolean;
  captionsOn: boolean;
  fontSize: "sm" | "md" | "lg";
  set: <K extends keyof Omit<PreferencesState, "set">>(key: K, value: PreferencesState[K]) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      reducedMotion: false,
      soundEnabled: true,
      autoplayGifs: true,
      captionsOn: true,
      fontSize: "md",
      set: (key, value) => set({ [key]: value } as Partial<PreferencesState>),
    }),
    { name: "signsafe-preferences" },
  ),
);
