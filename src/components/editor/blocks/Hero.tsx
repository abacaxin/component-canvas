type P = { props: Record<string, string> };

export function HeroGradient({ props }: P) {
  return (
    <section className="relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #950101 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, #3D0000 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6 py-32 text-center">
        {props.eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse" />
            {props.eyebrow}
          </div>
        )}
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
          {props.title}
        </h1>
        <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">{props.subtitle}</p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            className="text-white font-medium px-6 py-3 rounded-full transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg,#3D0000,#950101,#FF0000)", boxShadow: "0 0 40px -8px #FF0000" }}
          >
            {props.cta}
          </button>
          {props.ctaSecondary && (
            <button className="text-white/80 hover:text-white font-medium px-6 py-3 rounded-full border border-white/10 hover:border-white/30 transition-all">
              {props.ctaSecondary}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export function HeroSplit({ props }: P) {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight">{props.title}</h1>
          <p className="mt-5 text-white/60 text-lg">{props.subtitle}</p>
          <button
            className="mt-8 text-white font-medium px-6 py-3 rounded-full"
            style={{ background: "linear-gradient(135deg,#3D0000,#950101,#FF0000)" }}
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
