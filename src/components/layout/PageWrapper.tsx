import { AccentStrip } from "./AccentStrip";
import { NavBar } from "./NavBar";

export function PageWrapper({
  children,
  maxWidth = "max-w-[1140px]",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-navy text-white px-3 py-2 rounded-md text-sm z-50"
      >
        Skip to main content
      </a>
      <AccentStrip />
      <NavBar />
      <main id="main" className={`w-full ${maxWidth} mx-auto px-6 sm:px-8 pb-24`}>
        {children}
      </main>
    </div>
  );
}
