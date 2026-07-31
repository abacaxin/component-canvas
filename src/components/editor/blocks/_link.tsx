import {
  createContext,
  useContext,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";

export interface ResolvedLink {
  href: string;
  /** Optional click handler (used by in-editor Preview mode to intercept navigation). */
  navigate?: (e: MouseEvent) => void;
}

/**
 * Resolves an encoded link string (see links.ts) into an href + optional handler.
 * Returns null to render an inert control — the default in the edit canvas, where
 * clicks should select the section instead of navigating.
 */
export type LinkResolver = (encoded: string) => ResolvedLink | null;

const LinkContext = createContext<LinkResolver>(() => null);
export const LinkProvider = LinkContext.Provider;
export function useLinkResolver(): LinkResolver {
  return useContext(LinkContext);
}

/**
 * Renders a button/link that navigates when the surrounding context resolves its
 * target, and is otherwise an inert <button> (edit mode). Keeps the same visual
 * styling in all three modes: edit, preview, and exported HTML.
 */
export function SiteLink({
  link,
  className,
  style,
  children,
}: {
  link?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const resolve = useLinkResolver();
  const resolved = link ? resolve(link) : null;

  if (!resolved) {
    return (
      <button type="button" className={className} style={style}>
        {children}
      </button>
    );
  }
  return (
    <a href={resolved.href} onClick={resolved.navigate} className={className} style={style}>
      {children}
    </a>
  );
}
