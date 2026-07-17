type P = { props: Record<string, string> };

export function CTABanner({ props }: P) {
  const bg = props.bg || "#000000";
  const accent = props.accent || "#FF0000";
  return (
    <section className="py-16 sm:py-24 border-t border-white/5" style={{ background: bg }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-16 text-center border"
          style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}44)`, borderColor: `${accent}55` }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: `radial-gradient(circle at 50% 100%, ${accent}, transparent 60%)` }}
          />
          <h2 className="relative font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white">{props.title}</h2>
          <button
            className="relative mt-6 sm:mt-8 text-white font-medium px-8 py-3 rounded-full"
            style={{ background: `linear-gradient(135deg, ${accent}66, ${accent})`, boxShadow: `0 0 40px -8px ${accent}` }}
          >
            {props.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
