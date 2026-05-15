import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { signs as ALL_SIGNS, CATEGORY_EMOJI, type Sign } from "@/data/signs";
import { CroppedSignGif } from "@/components/quiz/CroppedSignGif";
import { cn } from "@/lib/utils";

const MAX_RESULTS = 5;

function scoreSign(s: Sign, q: string): number {
  const name = s.name.toLowerCase();
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (s.category.toLowerCase().includes(q)) return 40;
  if (s.whenToUse.toLowerCase().includes(q)) return 20;
  if (s.examples.some((e) => e.toLowerCase().includes(q))) return 10;
  return 0;
}

export function EmergencySearch() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Sign[];
    return ALL_SIGNS
      .map((s) => ({ s, score: scoreSign(s, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.s.order - b.s.order)
      .map((x) => x.s);
  }, [query]);

  const visible = results.slice(0, MAX_RESULTS);
  const hasOverflow = results.length > MAX_RESULTS;

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (visible.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % visible.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i - 1 + visible.length) % visible.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = visible[active];
      if (target) navigate({ to: "/learn/$signId", params: { signId: target.id } });
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative w-full max-w-[640px] mx-auto">
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-full bg-white border-2 transition-all",
          "border-navy/10 shadow-card",
          "focus-within:border-terracotta focus-within:shadow-[0_0_0_6px_rgba(192,82,62,0.12)]",
        )}
      >
        <Search className="ml-5 w-5 h-5 text-terracotta shrink-0" aria-hidden />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder='Search emergency signs… try "help", "stop", "allergy"'
          className="flex-1 bg-transparent py-4 pr-2 text-navy placeholder:text-navy/40 text-[16px] outline-none"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && visible[active] ? `${listboxId}-opt-${visible[active].id}` : undefined
          }
          aria-label="Search emergency signs"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="mr-4 p-1.5 rounded-full text-navy/50 hover:text-terracotta hover:bg-cream transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-2xl bg-white border border-navy/10 shadow-card-hover overflow-hidden"
            role="listbox"
            id={listboxId}
          >
            {visible.length === 0 ? (
              <div className="p-6 text-center text-navy/60 text-sm">
                No signs match <span className="font-medium text-navy">"{query}"</span>.
                Try <span className="font-medium text-terracotta">help</span>,{" "}
                <span className="font-medium text-terracotta">stop</span>, or{" "}
                <span className="font-medium text-terracotta">allergy</span>.
              </div>
            ) : (
              <ul className="py-2">
                {visible.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <motion.li
                      key={s.id}
                      initial={reduce ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduce ? 0 : i * 0.025, duration: 0.15 }}
                      role="option"
                      aria-selected={isActive}
                      id={`${listboxId}-opt-${s.id}`}
                    >
                      <Link
                        to="/learn/$signId"
                        params={{ signId: s.id }}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex items-center gap-4 px-4 py-3 transition-colors text-left",
                          isActive ? "bg-cream" : "hover:bg-cream",
                        )}
                      >
                        <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden">
                          <CroppedSignGif
                            gifUrl={s.gifUrl}
                            ariaLabel={`${s.name} sign preview`}
                            size="sm"
                            fallbackEmoji={s.fallbackEmoji}
                            className="!max-w-none w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-navy text-lg leading-tight truncate">
                              {s.name}
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.12em] font-bold text-terracotta whitespace-nowrap">
                              {CATEGORY_EMOJI[s.category]} {s.category}
                            </span>
                          </div>
                          <p className="text-[13px] text-navy/60 truncate">{s.whenToUse}</p>
                        </div>
                        <ArrowRight
                          className={cn(
                            "w-4 h-4 text-terracotta shrink-0 transition-transform",
                            isActive ? "translate-x-1" : "group-hover:translate-x-1",
                          )}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            )}

            {hasOverflow && (
              <Link
                to="/reference"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 border-t border-navy/10 text-center text-[13px] font-bold text-terracotta hover:bg-cream transition-colors"
              >
                View all {results.length} matches in Reference →
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
