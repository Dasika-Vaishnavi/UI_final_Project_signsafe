import * as React from "react";
import { cn } from "@/lib/utils";

type SVGProps = React.SVGProps<SVGSVGElement>;

const base = "pointer-events-none select-none";

export function Squiggle({ className, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 60 12" fill="none" aria-hidden className={cn(base, className)} {...p}>
      <path d="M2 6 Q 10 0 18 6 T 34 6 T 50 6 T 60 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
export function Star({ className, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn(base, className)} {...p}>
      <path d="M12 3 L14 10 L21 10 L15.5 14 L17.5 21 L12 17 L6.5 21 L8.5 14 L3 10 L10 10 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
export function Sparkle({ className, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn(base, className)} {...p}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" fill="currentColor" />
    </svg>
  );
}
export function Dot({ className, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className={cn(base, className)} {...p}>
      <circle cx="6" cy="6" r="4" fill="currentColor" />
    </svg>
  );
}
export function CircleScribble({ className, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 60 60" fill="none" aria-hidden className={cn(base, className)} {...p}>
      <path d="M30 6 C 12 6 6 22 6 30 C 6 48 22 54 30 54 C 48 54 54 38 54 30 C 54 14 40 8 30 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
export function ArrowDoodle({ className, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 80 30" fill="none" aria-hidden className={cn(base, className)} {...p}>
      <path d="M4 18 Q 30 -2 60 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 8 L 62 14 L 56 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function WavyUnderline({ className, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 200 12" fill="none" aria-hidden className={cn(base, className)} {...p}>
      <path d="M2 8 Q 25 -2 50 8 T 100 8 T 150 8 T 198 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

type FieldItem = {
  cmp: React.ComponentType<SVGProps>;
  className: string;
  rot?: number;
  delay?: number;
  duration?: number;
};

export function DoodleField({ items, className }: { items: FieldItem[]; className?: string }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {items.map((it, i) => {
        const Cmp = it.cmp;
        return (
          <span
            key={i}
            className={cn("absolute float-doodle", it.className)}
            style={{
              ["--doodle-rot" as never]: `${it.rot ?? 0}deg`,
              animationDelay: `${it.delay ?? i * 0.4}s`,
              animationDuration: `${it.duration ?? 5 + (i % 3)}s`,
            }}
          >
            <Cmp className="w-full h-full" />
          </span>
        );
      })}
    </div>
  );
}
