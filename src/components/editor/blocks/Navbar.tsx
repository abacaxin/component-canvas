type P = { props: Record<string, string> };

export function NavbarModern({ props }: P) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/60 border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <div className="font-display font-bold tracking-tight text-white text-lg">{props.brand}</div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a className="hover:text-white transition-colors">{props.link1}</a>
          <a className="hover:text-white transition-colors">{props.link2}</a>
          <a className="hover:text-white transition-colors">{props.link3}</a>
        </nav>
        <button
          className="text-sm font-medium text-white px-4 py-2 rounded-full transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
          style={{ background: "linear-gradient(135deg,#3D0000,#950101,#FF0000)" }}
        >
          {props.ctaText}
        </button>
      </div>
    </header>
  );
}

export function NavbarMinimal({ props }: P) {
  return (
    <header className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <div className="font-display font-semibold text-white">{props.brand}</div>
        <a className="text-sm text-white/70 hover:text-white transition-colors">{props.ctaText}</a>
      </div>
    </header>
  );
}
