export function SkipLink({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-navy focus:text-white focus:font-bold focus:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] focus:outline-none focus:ring-4 focus:ring-terracotta"
    >
      Skip to main content
    </a>
  );
}
