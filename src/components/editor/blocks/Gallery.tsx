import type { PropMap } from "@/lib/editor/types";
import { str, list, headingStyle } from "./_shared";

type P = { props: PropMap };

export function GalleryMasonry({ props }: P) {
  const bg = str(props, "bg", "#000000");
  const images = list(props, "images");
  return (
    <section className="py-16 sm:py-24 border-t border-white/5" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-center mb-10 sm:mb-12"
          style={headingStyle}
        >
          {str(props, "title")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div
              key={img._id}
              className={`overflow-hidden rounded-xl border border-white/10 ${i % 3 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
            >
              <img
                src={img.src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
