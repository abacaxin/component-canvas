import type { ComponentType, CSSProperties } from "react";
import type { Device, PropMap, SectionInstance, Typography } from "@/lib/editor/types";
import { typographyVars } from "@/lib/editor/typography";
import { sectionAnchorId } from "@/lib/editor/links";
import { LinkProvider, type LinkResolver } from "./blocks/_link";
import { DeviceFrame } from "./DeviceFrame";

interface Props {
  device: Device;
  sections: SectionInstance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  renderers: Record<string, ComponentType<{ props: PropMap }>>;
  typography: Typography;
  previewMode: boolean;
  resolveLink: LinkResolver;
  /** Index where a dragged component would be inserted, or null when not dragging over the canvas. */
  dropIndex: number | null;
  /** True while a library component is being dragged (disables iframe interaction). */
  dragging: boolean;
}

const WIDTHS: Record<Device, number> = { desktop: 1280, tablet: 820, mobile: 390 };

function DropIndicator() {
  return (
    <div className="my-1.5 h-1 rounded-full bg-[#FF0000] shadow-[0_0_16px_2px_#FF0000] animate-pulse" />
  );
}

export function Canvas({
  device,
  sections,
  selectedId,
  onSelect,
  renderers,
  typography,
  previewMode,
  resolveLink,
  dropIndex,
  dragging,
}: Props) {
  const width = WIDTHS[device];
  const visible = sections.filter((s) => !s.hidden && renderers[s.variantId]);
  const siteStyle: CSSProperties = {
    ...typographyVars(typography),
    fontFamily: "var(--site-body-font)",
    fontWeight: "var(--site-body-weight, 400)",
    lineHeight: "var(--site-line-height, 1.5)",
    letterSpacing: "var(--site-letter-spacing, 0)",
    fontSize: "var(--site-base-size, 16px)",
    background: "#000",
    minHeight: "100vh",
  };

  const content = (
    <LinkProvider value={resolveLink}>
      <div style={siteStyle}>
        {visible.length === 0 && (
          <div
            className={`m-6 rounded-2xl border-2 border-dashed p-20 text-center text-sm transition-colors ${
              dragging && dropIndex === 0
                ? "border-[#FF0000] text-white/70 bg-[#3D0000]/20"
                : "border-white/10 text-white/40"
            }`}
          >
            Arraste ou adicione seções da biblioteca para começar.
          </div>
        )}
        {visible.map((s, i) => {
          const R = renderers[s.variantId]!;
          const active = !previewMode && s.id === selectedId;
          return (
            <div key={s.id}>
              {dragging && dropIndex === i && <DropIndicator />}
              <div
                id={sectionAnchorId(s.id)}
                onClick={
                  previewMode
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        onSelect(s.id);
                      }
                }
                className={`relative transition-all ${
                  previewMode
                    ? ""
                    : `cursor-pointer ${
                        active
                          ? "ring-2 ring-[#FF0000] ring-inset"
                          : "hover:ring-1 hover:ring-white/20 hover:ring-inset"
                      }`
                }`}
              >
                <R props={s.props} />
              </div>
            </div>
          );
        })}
        {dragging && dropIndex === visible.length && visible.length > 0 && <DropIndicator />}
      </div>
    </LinkProvider>
  );

  return (
    <main className="flex-1 min-w-0 overflow-auto scrollbar-thin bg-[#050505]">
      <div className="min-h-full flex justify-center p-4 sm:p-8">
        <div
          className="transition-all duration-300 ease-out shrink-0"
          style={{
            boxShadow: "0 30px 80px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
            borderRadius: device === "desktop" ? 16 : 24,
            overflow: "hidden",
            background: "#000",
          }}
        >
          <DeviceFrame width={width} interactive={!dragging}>
            {content}
          </DeviceFrame>
        </div>
      </div>
    </main>
  );
}
