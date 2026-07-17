import type { ComponentType } from "react";
import type { Device, SectionInstance } from "@/lib/editor/types";

interface Props {
  device: Device;
  sections: SectionInstance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  renderers: Record<string, ComponentType<{ props: Record<string, string> }>>;
}

const WIDTHS: Record<Device, number> = { desktop: 1280, tablet: 820, mobile: 390 };

export function Canvas({ device, sections, selectedId, onSelect, renderers }: Props) {
  const width = WIDTHS[device];
  return (
    <main className="flex-1 min-w-0 overflow-auto scrollbar-thin bg-[#050505]">
      <div className="min-h-full flex justify-center p-8">
        <div
          className="transition-all duration-500 ease-out"
          style={{
            width,
            maxWidth: "100%",
            boxShadow: "0 30px 80px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
            borderRadius: device === "desktop" ? 16 : 24,
            overflow: "hidden",
            background: "#000",
          }}
        >
          {sections.length === 0 && (
            <div className="p-24 text-center text-white/40 text-sm">
              OMG a real landpage
            </div>
          )}
          {sections.map((s) => {
            if (s.hidden) return null;
            const R = renderers[s.variantId];
            if (!R) return null;
            const active = s.id === selectedId;
            return (
              <div
                key={s.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(s.id);
                }}
                className={`relative cursor-pointer transition-all ${
                  active ? "ring-2 ring-[#FF0000] ring-inset" : "hover:ring-1 hover:ring-white/20 hover:ring-inset"
                }`}
              >
                <R props={s.props} />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
