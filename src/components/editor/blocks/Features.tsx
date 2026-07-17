import { Zap, Shield, Rocket } from "lucide-react";
type P = { props: Record<string, string> };

export function FeaturesGrid({ props }: P) {
  const bg = props.bg || "#000000";
  const accent = props.accent || "#FF0000";
  const items = [
    { icon: Zap, t: props.f1title, d: props.f1desc },
    { icon: Shield, t: props.f2title, d: props.f2desc },
    { icon: Rocket, t: props.f3title, d: props.f3desc },
  ];
  return (
    <section className="py-16 sm:py-24 border-t border-white/5" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white text-center mb-10 sm:mb-16">{props.title}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((it, i) => (
            <div
              key={i}
              className="group p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent transition-all"
              style={{ borderColor: undefined }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `linear-gradient(135deg, ${accent}55, ${accent})` }}
              >
                <it.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-semibold text-white text-lg">{it.t}</h3>
              <p className="mt-2 text-white/60 text-sm leading-relaxed">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesList({ props }: P) {
  const bg = props.bg || "#000000";
  const accent = props.accent || "#FF0000";
  const items = [props.i1, props.i2, props.i3, props.i4].filter(Boolean);
  return (
    <section className="py-16 sm:py-24 border-t border-white/5" style={{ background: bg }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 sm:mb-10">{props.title}</h2>
        <ul className="space-y-3 sm:space-y-4">
          {items.map((t, i) => (
            <li key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
              <span className="text-white/90">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
