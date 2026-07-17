type P = { props: Record<string, string> };

export function CTABanner({ props }: P) {
  return (
    <section className="bg-black py-24 border-t border-white/5">
      <div className="mx-auto max-w-4xl px-6">
        <div
          className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center border border-[#950101]/40"
          style={{ background: "linear-gradient(135deg, #1a0000, #3D0000)" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: "radial-gradient(circle at 50% 100%, #FF0000, transparent 60%)" }}
          />
          <h2 className="relative font-display text-3xl md:text-5xl font-bold text-white">{props.title}</h2>
          <button
            className="relative mt-8 text-white font-medium px-8 py-3 rounded-full"
            style={{ background: "linear-gradient(135deg,#950101,#FF0000)", boxShadow: "0 0 40px -8px #FF0000" }}
          >
            {props.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
