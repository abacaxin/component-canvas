import type { CSSProperties } from "react";

export { str, bool, list } from "@/lib/editor/props";
export { SiteLink } from "./_link";
export { SmartImage } from "./_image";

/** Inline style that makes a heading follow the project's typography settings. */
export const headingStyle: CSSProperties = {
  fontFamily: "var(--site-heading-font)",
  fontWeight: "var(--site-heading-weight, 700)",
};

/**
 * Applies the section's user-chosen text color at a given opacity (100 = full
 * strength, lower = a muted/secondary tone — mirrors the old fixed `text-white/60`
 * etc. utility classes, but driven by the editable `textColor` prop instead of a
 * hardcoded white).
 */
export function textTone(color: string, opacityPct = 100): string {
  return opacityPct >= 100 ? color : `color-mix(in oklab, ${color} ${opacityPct}%, transparent)`;
}

/**
 * CSS custom properties for the common opacity tiers of a section's text color,
 * meant to be spread onto the section's root `style`. Consumed via Tailwind
 * arbitrary-value utilities, e.g. `text-[color:var(--tc-70)]`, so hover/group-hover
 * variants keep working (a plain inline `style={{color}}` can't respond to `:hover`).
 */
export function textVars(color: string): CSSProperties {
  return {
    "--tc": color,
    "--tc-90": textTone(color, 90),
    "--tc-80": textTone(color, 80),
    "--tc-70": textTone(color, 70),
    "--tc-60": textTone(color, 60),
    "--tc-50": textTone(color, 50),
    "--tc-40": textTone(color, 40),
  } as CSSProperties;
}
