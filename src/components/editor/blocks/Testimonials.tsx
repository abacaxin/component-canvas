type P = { props: Record<string, string> };

export function TestimonialsCards({ props }: P) {
  const items = [
    { q: props.q1, a: props.a1 },
    { q: props.q2, a: props.a2 },
    { q: props.q3, a: props.a3 },
  ];
  return (
    <section className="bg-black py-24 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white text-center mb-16">{props.title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <figure key={i} className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <blockquote className="text-white/90 text-lg leading-relaxed">&ldquo;{it.q}&rdquo;</blockquote>
              <figcaption className="mt-6 text-sm text-white/50">{it.a}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
