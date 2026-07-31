/**
 * Generates a v4 UUID without relying on `crypto.randomUUID()`, which the spec
 * restricts to secure contexts (HTTPS or `localhost`). Accessing the editor from
 * another device over plain HTTP (e.g. a LAN IP) is an insecure context where
 * `crypto.randomUUID` doesn't exist — calling it throws and crashes the first render.
 * `crypto.getRandomValues` has no such restriction, so we build the UUID from that,
 * with a `Math.random` fallback for the rare environment lacking Web Crypto entirely.
 */
export function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
  }
  // Last-resort fallback: not cryptographically strong, but ids here only need to be unique, not secret.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
