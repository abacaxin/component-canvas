type P = { props: Record<string, string> };

export function FAQAccordion({ props }: P) {
  const items = [
    { q: props.q1, a: props.a1 },
    { q: props.q2, a: props.a2 },
    { q: props.q3, a: props.a3 },
  ];
  return (
    <section className="bg-black py-24 border-t border-white/5">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white text-center mb-12">{props.title}</h2>
        <div className="space-y-3">
          {items.map((it, i) => (
            <details key={i} className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 open:border-[#950101]">
              <summary className="cursor-pointer list-none flex items-center justify-between text-white font-medium">
                {it.q}
                <span className="text-[#FF0000] transition-transform group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-white/60 text-sm leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
