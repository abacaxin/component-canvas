import type { PropMap } from "@/lib/editor/types";
import { str, bool, list, headingStyle } from "./_shared";

type P = { props: PropMap };

export function NavbarModern({ props }: P) {
  const bg = str(props, "bg", "#000000");
  const accent = str(props, "accent", "#FF0000");
  const links = list(props, "links");
  return (
    <header
      className="sticky top-0 z-10 backdrop-blur-xl border-b border-white/5"
      style={{ background: `color-mix(in oklab, ${bg} 70%, transparent)` }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="font-bold tracking-tight text-white text-lg truncate" style={headingStyle}>
          {str(props, "brand")}
        </div>
        {links.length > 0 && (
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            {links.map((l) => (
              <a key={l._id} className="hover:text-white transition-colors cursor-pointer">
                {l.label}
              </a>
            ))}
          </nav>
        )}
        {bool(props, "showCta", true) && (
          <button
            className="shrink-0 text-sm font-medium text-white px-4 py-2 rounded-full transition-all"
            style={{ background: `linear-gradient(135deg, ${accent}88, ${accent})` }}
          >
            {str(props, "ctaText")}
          </button>
        )}
      </div>
    </header>
  );
}

export function NavbarMinimal({ props }: P) {
  const bg = str(props, "bg", "#000000");
  return (
    <header className="border-b border-white/5" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="font-semibold text-white truncate" style={headingStyle}>
          {str(props, "brand")}
        </div>
        <a className="text-sm text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer">
          {str(props, "ctaText")}
        </a>
      </div>
    </header>
  );
}
