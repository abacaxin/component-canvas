import { Zap, Shield, Rocket } from "lucide-react";
type P = { props: Record<string, string> };

export function FeaturesGrid({ props }: P) {
  const items = [
    { icon: Zap, t: props.f1title, d: props.f1desc },
    { icon: Shield, t: props.f2title, d: props.f2desc },
    { icon: Rocket, t: props.f3title, d: props.f3desc },
  ];
  return (
    <section className="bg-black py-24 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white text-center mb-16">{props.title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-[#950101] transition-all"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg,#3D0000,#950101)" }}
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
  const items = [props.i1, props.i2, props.i3, props.i4].filter(Boolean);
  return (
    <section className="bg-black py-24 border-t border-white/5">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-10">{props.title}</h2>
        <ul className="space-y-4">
          {items.map((t, i) => (
            <li key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="mt-1 w-2 h-2 rounded-full" style={{ background: "#FF0000", boxShadow: "0 0 12px #FF0000" }} />
              <span className="text-white/90">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
