type P = { props: Record<string, string> };

export function FAQAccordion({ props }: P) {
  const bg = props.bg || "#000000";
  const accent = props.accent || "#FF0000";
  const items = [
    { q: props.q1, a: props.a1 },
    { q: props.q2, a: props.a2 },
    { q: props.q3, a: props.a3 },
  ];
  return (
    <section className="py-16 sm:py-24 border-t border-white/5" style={{ background: bg }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white text-center mb-10 sm:mb-12">{props.title}</h2>
        <div className="space-y-3">
          {items.map((it, i) => (
            <details key={i} className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-white font-medium">
                <span className="min-w-0">{it.q}</span>
                <span className="text-xl leading-none shrink-0 transition-transform group-open:rotate-45" style={{ color: accent }}>+</span>
              </summary>
              <p className="mt-3 text-white/60 text-sm leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
