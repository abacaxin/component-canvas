type P = { props: Record<string, string> };

export function HeroGradient({ props }: P) {
  const bg = props.bg || "#000000";
  const accent = props.accent || "#FF0000";
  return (
    <section className="relative overflow-hidden" style={{ background: bg }}>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent} 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, ${accent}55 0%, transparent 60%)`,
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-32 text-center">
        {props.eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
            {props.eyebrow}
          </div>
        )}
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
          {props.title}
        </h1>
        <p className="mt-5 sm:mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto">{props.subtitle}</p>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            className="w-full sm:w-auto text-white font-medium px-6 py-3 rounded-full transition-transform hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${accent}66, ${accent})`, boxShadow: `0 0 40px -8px ${accent}` }}
          >
            {props.cta}
          </button>
          {props.ctaSecondary && (
            <button className="w-full sm:w-auto text-white/80 hover:text-white font-medium px-6 py-3 rounded-full border border-white/10 hover:border-white/30 transition-all">
              {props.ctaSecondary}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export function HeroSplit({ props }: P) {
  const bg = props.bg || "#000000";
  const accent = props.accent || "#FF0000";
  return (
    <section className="py-16 sm:py-24" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight">{props.title}</h1>
          <p className="mt-4 sm:mt-5 text-white/60 text-base sm:text-lg">{props.subtitle}</p>
          <button
            className="mt-6 sm:mt-8 text-white font-medium px-6 py-3 rounded-full"
            style={{ background: `linear-gradient(135deg, ${accent}66, ${accent})` }}
          >
            {props.cta}
          </button>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/10">
          <img src={props.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6))" }} />
        </div>
      </div>
    </section>
  );
}
