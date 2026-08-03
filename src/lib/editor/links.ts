import type { LinkTarget, Page, ProjectState } from "./types";

/** DOM id given to each section wrapper so section links can scroll to it. */
export function sectionAnchorId(sectionId: string): string {
  return `sec-${sectionId}`;
}

/** Parse the serialized string prop into a structured target. */
export function decodeLink(value: string | undefined): LinkTarget {
  if (!value) return { kind: "none" };
  const i = value.indexOf(":");
  if (i < 0) return { kind: "none" };
  const kind = value.slice(0, i);
  const rest = value.slice(i + 1);
  if (kind === "url") return { kind: "url", url: rest };
  if (kind === "page") return { kind: "page", pageId: rest };
  if (kind === "section") return { kind: "section", sectionId: rest };
  return { kind: "none" };
}

export function encodeLink(t: LinkTarget): string {
  switch (t.kind) {
    // Keep the "url:" prefix even while the URL is still empty (right after picking
    // "URL externa" in the editor), otherwise this collapses to "" → decodeLink reads
    // it back as {kind:"none"} → the picker silently reverts and the input disappears.
    case "url":
      return `url:${t.url ?? ""}`;
    case "page":
      return t.pageId ? `page:${t.pageId}` : "";
    case "section":
      return t.sectionId ? `section:${t.sectionId}` : "";
    default:
      return "";
  }
}

export function findPageOfSection(pages: Page[], sectionId: string): Page | undefined {
  return pages.find((p) => p.sections.some((s) => s.id === sectionId));
}

/** A ready-to-use href string for a target, relative to the page being rendered. */
export function resolveHref(project: ProjectState, currentPageId: string, t: LinkTarget): string {
  switch (t.kind) {
    case "url":
      return t.url || "#";
    case "page": {
      const page = project.pages.find((p) => p.id === t.pageId);
      return page ? `${page.slug}.html` : "#";
    }
    case "section": {
      const page = findPageOfSection(project.pages, t.sectionId);
      if (!page) return "#";
      const anchor = `#${sectionAnchorId(t.sectionId)}`;
      // Same page → pure anchor; cross-page → page file + anchor.
      return page.id === currentPageId ? anchor : `${page.slug}.html${anchor}`;
    }
    default:
      return "";
  }
}

/** Human-readable label for a target, used in the properties panel. */
export function describeLink(project: ProjectState, t: LinkTarget): string {
  switch (t.kind) {
    case "url":
      return t.url || "URL externa";
    case "page":
      return project.pages.find((p) => p.id === t.pageId)?.name ?? "Página removida";
    case "section": {
      const page = findPageOfSection(project.pages, t.sectionId);
      return page ? `Seção em ${page.name}` : "Seção removida";
    }
    default:
      return "Sem link";
  }
}

/** Options offered in the link picker (all pages + all sections across pages). */
export interface LinkOptions {
  pages: { id: string; name: string }[];
  sections: { id: string; label: string }[];
}
