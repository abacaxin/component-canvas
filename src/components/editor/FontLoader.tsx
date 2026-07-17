import { useEffect } from "react";
import type { Typography } from "@/lib/editor/types";
import { activeFonts, googleFontsHref } from "@/lib/editor/typography";

const LINK_ID = "sangre-google-fonts";

/**
 * Keeps a single <link> in <head> pointing at the Google Fonts stylesheet for
 * the project's active heading + body families, so the live preview matches
 * what the exported site will look like.
 */
export function FontLoader({ typography }: { typography: Typography }) {
  const href = googleFontsHref(activeFonts(typography));

  useEffect(() => {
    if (typeof document === "undefined") return;
    let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
    if (!href) {
      link?.remove();
      return;
    }
    if (!link) {
      link = document.createElement("link");
      link.id = LINK_ID;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }, [href]);

  return null;
}
