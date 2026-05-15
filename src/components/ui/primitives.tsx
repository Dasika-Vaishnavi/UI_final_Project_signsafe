import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white border border-warm-grey rounded-2xl shadow-card transition-all duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

const baseBtn =
  "inline-flex items-center justify-center gap-2 text-button rounded-xl px-7 h-[58px] min-w-[200px] border-2 transition-all duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] btn-focus disabled:opacity-50 active:translate-y-[1px] select-none";

export const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        baseBtn,
        "bg-gradient-to-b from-terracotta to-terracotta-hover text-white border-terracotta shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  ),
);
PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        baseBtn,
        "bg-white text-terracotta border-terracotta hover:bg-terracotta hover:text-white hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  ),
);
SecondaryButton.displayName = "SecondaryButton";

export const GhostButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 bg-transparent text-navy text-button rounded-xl px-4 py-2.5 transition-colors duration-[200ms] hover:text-terracotta btn-focus",
        className,
      )}
      {...props}
    />
  ),
);
GhostButton.displayName = "GhostButton";

type BackButtonProps = {
  to?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
};

export function BackButton({ to, onClick, label = "Back", className }: BackButtonProps) {
  const inner = (
    <span
      className={cn(
        "group inline-flex items-center gap-2 pl-1 pr-4 py-1.5 rounded-full bg-white border border-warm-grey shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] text-navy hover:text-terracotta btn-focus",
        className,
      )}
    >
      <span className="w-7 h-7 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center group-hover:bg-terracotta group-hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
      </span>
      <span className="text-button">{label}</span>
    </span>
  );
  if (to) {
    return (
      <Link to={to} className="inline-block btn-focus rounded-full">
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className="btn-focus rounded-full">
      {inner}
    </button>
  );
}

export function IconBadge({
  children,
  tone = "terracotta",
  className,
}: {
  children: React.ReactNode;
  tone?: "terracotta" | "green" | "navy" | "gold";
  className?: string;
}) {
  const tones: Record<string, string> = {
    terracotta: "bg-terracotta/12 text-terracotta",
    green: "bg-green/15 text-green",
    navy: "bg-navy/10 text-navy",
    gold: "bg-gold/15 text-gold",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-12 h-12 rounded-2xl",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full bg-warm-grey rounded-full overflow-hidden", className)}>
      <div
        className="h-full bg-gradient-to-r from-terracotta to-gold transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function CategoryPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("text-category text-terracotta", className)}>{children}</span>
  );
}

export function WhenToUseCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cream border-l-[3px] border-terracotta px-4 py-3 rounded-r-md">
      <p className="text-terracotta italic text-sm">📍 {children}</p>
    </div>
  );
}
