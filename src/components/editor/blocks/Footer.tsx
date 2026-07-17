type P = { props: Record<string, string> };

export function FooterDark({ props }: P) {
  const bg = props.bg || "#000000";
  return (
    <footer className="border-t border-white/10 py-10 sm:py-14" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-display font-bold text-white text-xl">{props.brand}</div>
          <div className="text-white/50 text-sm mt-1">{props.tagline}</div>
        </div>
        <div className="text-white/40 text-xs">{props.copyright}</div>
      </div>
    </footer>
  );
}

export function FooterMinimal({ props }: P) {
  const bg = props.bg || "#000000";
  return (
    <footer className="border-t border-white/5 py-8" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center text-white/40 text-xs">{props.copyright}</div>
    </footer>
  );
}
