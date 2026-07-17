import type { ListItem, PropMap } from "./types";

/** Read a scalar string prop, tolerating missing/other-typed values. */
export function str(props: PropMap, key: string, fallback = ""): string {
  const v = props[key];
  return typeof v === "string" ? v : fallback;
}

/** Read a boolean (toggle) prop. */
export function bool(props: PropMap, key: string, fallback = false): boolean {
  const v = props[key];
  return typeof v === "boolean" ? v : fallback;
}

/** Read a list prop as an array of items. */
export function list(props: PropMap, key: string): ListItem[] {
  const v = props[key];
  return Array.isArray(v) ? v : [];
}
