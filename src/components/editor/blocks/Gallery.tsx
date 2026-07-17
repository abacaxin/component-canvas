type P = { props: Record<string, string> };

export function GalleryMasonry({ props }: P) {
  const bg = props.bg || "#000000";
  const imgs = [props.img1, props.img2, props.img3, props.img4].filter(Boolean);
  return (
    <section className="py-16 sm:py-24 border-t border-white/5" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white text-center mb-10 sm:mb-12">{props.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {imgs.map((src, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-xl border border-white/10 ${i % 3 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
