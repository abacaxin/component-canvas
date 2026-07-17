type P = { props: Record<string, string> };

export function NavbarModern({ props }: P) {
  const bg = props.bg || "#000000";
  const accent = props.accent || "#FF0000";
  return (
    <header
      className="sticky top-0 z-10 backdrop-blur-xl border-b border-white/5"
      style={{ background: `color-mix(in oklab, ${bg} 70%, transparent)` }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="font-display font-bold tracking-tight text-white text-lg truncate">{props.brand}</div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a className="hover:text-white transition-colors">{props.link1}</a>
          <a className="hover:text-white transition-colors">{props.link2}</a>
          <a className="hover:text-white transition-colors">{props.link3}</a>
        </nav>
        <button
          className="shrink-0 text-sm font-medium text-white px-4 py-2 rounded-full transition-all"
          style={{ background: `linear-gradient(135deg, ${accent}88, ${accent})` }}
        >
          {props.ctaText}
        </button>
      </div>
    </header>
  );
}

export function NavbarMinimal({ props }: P) {
  const bg = props.bg || "#000000";
  return (
    <header className="border-b border-white/5" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="font-display font-semibold text-white truncate">{props.brand}</div>
        <a className="text-sm text-white/70 hover:text-white transition-colors shrink-0">{props.ctaText}</a>
      </div>
    </header>
  );
}
