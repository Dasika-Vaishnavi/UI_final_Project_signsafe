import { Link } from "@tanstack/react-router";
import { Settings, Flame } from "lucide-react";
import { useProgressStore } from "@/stores/useProgressStore";
import { Sparkle } from "@/components/doodles/Doodles";

export function NavBar() {
  const streak = useProgressStore((s) => s.streak);

  return (
    <nav className="w-full max-w-[1140px] mx-auto px-6 py-5 flex items-center justify-between">
      <Link
        to="/"
        className="group inline-flex items-center gap-2 font-serif font-bold text-navy text-[22px] tracking-tight"
      >
        <Sparkle className="w-4 h-4 text-terracotta group-hover:animate-[wiggle_0.5s_ease-in-out]" />
        SignSafe
      </Link>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 bg-white border border-warm-grey rounded-full px-3.5 py-2 text-[12px] font-semibold text-navy shadow-card">
          <Flame className="w-3.5 h-3.5 text-terracotta flame-flicker" />
          {streak} day streak
        </span>
        <button
          aria-label="Settings"
          className="p-2.5 rounded-full bg-white border border-warm-grey hover:bg-warm-grey transition-all duration-200 hover:rotate-45 btn-focus"
        >
          <Settings className="w-4 h-4 text-navy" />
        </button>
      </div>
    </nav>
  );
}
