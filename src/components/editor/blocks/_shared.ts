import type { CSSProperties } from "react";

export { str, bool, list } from "@/lib/editor/props";
export { SiteLink } from "./_link";
export { SmartImage } from "./_image";

/** Inline style that makes a heading follow the project's typography settings. */
export const headingStyle: CSSProperties = {
  fontFamily: "var(--site-heading-font)",
  fontWeight: "var(--site-heading-weight, 700)",
};
