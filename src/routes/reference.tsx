import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer, Search, X } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  Card,
  CategoryPill,
  BackButton,
  SecondaryButton,
} from "@/components/ui/primitives";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_EMOJI,
  signsByCategory,
  type Sign,
} from "@/data/signs";

function SignTile({ sign }: { sign: Sign }) {
  return (
    <Link to="/learn/$signId" params={{ signId: sign.id }} className="group">
      <Card className="p-3 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-terracotta/40 h-full">
        <div className="w-16 h-16 rounded-lg bg-warm-grey overflow-hidden shrink-0 flex items-center justify-center">
          <img
            src={sign.gifUrl}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
              if (t.parentElement) t.parentElement.innerHTML = `<span class='text-3xl'>${sign.fallbackEmoji}</span>`;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif font-bold text-navy text-[15px] leading-tight group-hover:text-terracotta transition-colors">
            {sign.emoji} {sign.name}
          </div>
          <div className="text-[12px] text-navy/65 leading-snug line-clamp-2 mt-0.5">
            {sign.whenToUse}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ReferencePage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return null;
    const map: Record<string, Sign[]> = {};
    for (const c of CATEGORIES) {
      const matches = signsByCategory[c].filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.whenToUse.toLowerCase().includes(q) ||
          s.examples.some((ex) => ex.toLowerCase().includes(q)),
      );
      if (matches.length) map[c] = matches;
    }
    return map;
  }, [q]);

  const totalMatches = filtered
    ? Object.values(filtered).reduce((n, arr) => n + arr.length, 0)
    : 0;

  return (
    <PageWrapper>
      <style>{`@media print {
        nav, .no-print { display: none !important; }
        body, .min-h-screen { background: white !important; }
        section { page-break-inside: avoid; }
      }`}</style>
      <div className="pt-8 flex items-center justify-between gap-4 no-print">
        <BackButton to="/" label="Home" />
        <SecondaryButton onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Print
        </SecondaryButton>
      </div>
      <div className="pt-8 flex flex-col items-center text-center gap-4 max-w-[760px] mx-auto">
        <CategoryPill>Reference</CategoryPill>
        <h1 className="font-serif font-bold text-navy text-[clamp(2.5rem,5vw,3.5rem)] leading-tight">
          Quick Reference
        </h1>
        <p className="text-navy/70 text-[17px] max-w-[560px]">
          Every sign at a glance. Tap to revisit, or print for an offline cheat-sheet.
        </p>
      </div>

      {/* Search */}
      <div className="mt-8 max-w-[520px] mx-auto no-print">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search signs (e.g. help, hospital, fire)…"
            className="w-full pl-11 pr-10 py-3 rounded-full border-2 border-warm-grey bg-white text-[15px] text-navy placeholder:text-navy/40 focus:border-terracotta focus:outline-none"
            aria-label="Search signs"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-navy/50 hover:text-terracotta"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {q && (
          <p className="mt-2 text-[12px] text-center text-navy/60">
            {totalMatches} match{totalMatches === 1 ? "" : "es"} for "{query}"
          </p>
        )}
      </div>

      <div className="mt-12 space-y-10">
        {CATEGORIES.map((c) => {
          const list = filtered ? filtered[c] : signsByCategory[c];
          if (!list || list.length === 0) return null;
          return (
            <section key={c}>
              <div
                className="flex items-center gap-3 pb-3 border-b-2"
                style={{ borderColor: CATEGORY_COLORS[c] }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[c] }}
                />
                <h2 className="font-serif font-bold text-navy text-2xl">
                  {CATEGORY_EMOJI[c]} {c}
                </h2>
                <span className="text-[13px] text-muted">
                  ({list.length} sign{list.length === 1 ? "" : "s"})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
                {list.map((s) => (
                  <SignTile key={s.id} sign={s} />
                ))}
              </div>
            </section>
          );
        })}
        {filtered && totalMatches === 0 && (
          <Card className="p-8 text-center">
            <p className="text-navy/70">No signs match "{query}".</p>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Quick Reference — SignSafe" },
      {
        name: "description",
        content:
          "Printable quick-reference card of all 30 emergency ASL signs across five categories.",
      },
    ],
  }),
  component: ReferencePage,
});
