import type { PropMap } from "@/lib/editor/types";
import { str, list, headingStyle, SiteLink } from "./_shared";

type P = { props: PropMap };

export function FooterDark({ props }: P) {
  const bg = str(props, "bg", "#000000");
  const links = list(props, "links");
  return (
    <footer className="border-t border-white/10 py-10 sm:py-14" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-bold text-white text-xl" style={headingStyle}>
            {str(props, "brand")}
          </div>
          <div className="text-white/50 text-sm mt-1">{str(props, "tagline")}</div>
        </div>
        {links.length > 0 && (
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
            {links.map((l) => (
              <SiteLink
                key={l._id}
                link={l.link}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {l.label}
              </SiteLink>
            ))}
          </nav>
        )}
        <div className="text-white/40 text-xs">{str(props, "copyright")}</div>
      </div>
    </footer>
  );
}

export function FooterMinimal({ props }: P) {
  const bg = str(props, "bg", "#000000");
  return (
    <footer className="border-t border-white/5 py-8" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center text-white/40 text-xs">
        {str(props, "copyright")}
      </div>
    </footer>
  );
}
