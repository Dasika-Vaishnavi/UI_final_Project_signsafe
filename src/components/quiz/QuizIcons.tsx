import type { SVGProps } from "react";

export function GraduateBadge({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {/* Glow ring */}
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.10" />
      <circle cx="32" cy="32" r="22" fill="currentColor" opacity="0.18" />
      {/* Cap board */}
      <path
        d="M6 26 L32 16 L58 26 L32 36 Z"
        fill="currentColor"
      />
      {/* Cap underside */}
      <path
        d="M18 31 L18 40 C18 43 24 46 32 46 C40 46 46 43 46 40 L46 31 L32 36 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Tassel */}
      <path
        d="M54 28 L54 40"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="54" cy="42.5" r="2.5" fill="currentColor" />
      {/* Sparkles */}
      <path d="M12 14 L13.5 17 L16.5 18.5 L13.5 20 L12 23 L10.5 20 L7.5 18.5 L10.5 17 Z" fill="currentColor" opacity="0.7" />
      <path d="M52 10 L53 12 L55 13 L53 14 L52 16 L51 14 L49 13 L51 12 Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function HintShrug({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.10" />
      <circle cx="32" cy="32" r="22" fill="currentColor" opacity="0.18" />
      {/* Question mark */}
      <path
        d="M24 25 C24 19 28 16 32 16 C37 16 41 19 41 24 C41 28 38 30 35 31.5 C33 32.5 32.5 33.5 32.5 36"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32.5" cy="44" r="2.8" fill="currentColor" />
    </svg>
  );
}
