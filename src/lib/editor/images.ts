export interface ImageValue {
  src: string;
  /** Focal point as percentages (0–100), used for object-position when cropping. */
  fx: number;
  fy: number;
}

function clampPct(n: number, fallback: number): number {
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : fallback;
}

/**
 * Image field values are stored as the plain URL, optionally suffixed with a focal
 * point: `https://…/x.jpg|30,70`. Plain URLs (no `|`) default to a centered focal
 * point, so old data stays valid.
 */
export function parseImage(value: string): ImageValue {
  if (!value) return { src: "", fx: 50, fy: 50 };
  const i = value.lastIndexOf("|");
  if (i < 0) return { src: value, fx: 50, fy: 50 };
  const focal = value.slice(i + 1);
  const m = /^(\d{1,3})\s*,\s*(\d{1,3})$/.exec(focal);
  if (!m) return { src: value, fx: 50, fy: 50 }; // a literal pipe in the URL, not a focal point
  return { src: value.slice(0, i), fx: clampPct(Number(m[1]), 50), fy: clampPct(Number(m[2]), 50) };
}

export function encodeImage(v: ImageValue): string {
  const fx = Math.round(clampPct(v.fx, 50));
  const fy = Math.round(clampPct(v.fy, 50));
  // Keep the value as a clean URL when the focal point is centered (the default).
  return fx === 50 && fy === 50 ? v.src : `${v.src}|${fx},${fy}`;
}

export function objectPosition(v: ImageValue): string {
  return `${v.fx}% ${v.fy}%`;
}
