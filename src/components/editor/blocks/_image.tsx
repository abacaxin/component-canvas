import type { CSSProperties } from "react";
import { parseImage, objectPosition } from "@/lib/editor/images";

/**
 * Renders an image that fills its container, cropped with object-fit: cover and
 * positioned by the stored focal point — so the subject stays in frame at any layout
 * or aspect ratio without the user adjusting dimensions. Lazy-loaded by default.
 */
export function SmartImage({
  value,
  className,
  alt = "",
  style,
}: {
  value: string;
  className?: string;
  alt?: string;
  style?: CSSProperties;
}) {
  const img = parseImage(value);
  if (!img.src) return null;
  return (
    <img
      src={img.src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: objectPosition(img),
        ...style,
      }}
    />
  );
}
