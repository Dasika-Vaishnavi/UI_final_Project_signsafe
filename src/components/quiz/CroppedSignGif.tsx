import { useState } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<Size, string> = {
  sm: "max-w-[180px]",
  md: "max-w-[280px]",
  lg: "max-w-[420px]",
};

type Props = {
  gifUrl: string;
  ariaLabel: string;
  size?: Size;
  showVignette?: boolean;
  fallbackEmoji?: string;
  className?: string;
};

/**
 * Square GIF frame for quiz mode. The quiz pool now only includes text-free
 * GIF sources, so no masking gradients or scaling tricks are needed —
 * the image is shown clean with object-contain.
 */
export function CroppedSignGif({
  gifUrl,
  ariaLabel,
  size = "lg",
  showVignette: _showVignette = false,
  fallbackEmoji = "🤟",
  className,
}: Props) {
  void _showVignette;
  const [error, setError] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full mx-auto aspect-square rounded-2xl overflow-hidden bg-warm-grey shadow-card",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {!error ? (
        <img
          src={gifUrl}
          alt={ariaLabel}
          className="absolute inset-0 w-full h-full object-contain"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
          <span className="text-6xl" aria-hidden>
            {fallbackEmoji}
          </span>
          <span className="text-caption">Visual unavailable</span>
        </div>
      )}
    </div>
  );
}
