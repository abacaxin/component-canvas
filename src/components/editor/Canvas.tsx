import type { ComponentType, CSSProperties } from "react";
import type { Device, PropMap, SectionInstance, Typography } from "@/lib/editor/types";
import { typographyVars } from "@/lib/editor/typography";

interface Props {
  device: Device;
  sections: SectionInstance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  renderers: Record<string, ComponentType<{ props: PropMap }>>;
  typography: Typography;
}

const WIDTHS: Record<Device, number> = { desktop: 1280, tablet: 820, mobile: 390 };

export function Canvas({ device, sections, selectedId, onSelect, renderers, typography }: Props) {
  const width = WIDTHS[device];
  const siteStyle: CSSProperties = {
    ...typographyVars(typography),
    fontFamily: "var(--site-body-font)",
    fontWeight: "var(--site-body-weight, 400)",
    lineHeight: "var(--site-line-height, 1.5)",
    letterSpacing: "var(--site-letter-spacing, 0)",
    fontSize: "var(--site-base-size, 16px)",
  };
  return (
    <main className="flex-1 min-w-0 overflow-auto scrollbar-thin bg-[#050505]">
      <div className="min-h-full flex justify-center p-4 sm:p-8">
        <div
          className="transition-all duration-500 ease-out"
          style={{
            width,
            maxWidth: "100%",
            boxShadow: "0 30px 80px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
            borderRadius: device === "desktop" ? 16 : 24,
            overflow: "hidden",
            background: "#000",
            ...siteStyle,
          }}
        >
          {sections.length === 0 && (
            <div className="p-24 text-center text-white/40 text-sm">
              Arraste ou adicione seções da biblioteca para começar.
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
                  active
                    ? "ring-2 ring-[#FF0000] ring-inset"
                    : "hover:ring-1 hover:ring-white/20 hover:ring-inset"
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
