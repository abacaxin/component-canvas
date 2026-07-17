import type { SectionInstance, SectionVariant } from "@/lib/editor/types";
import { Settings2, PanelRightClose, PanelRight } from "lucide-react";

interface Props {
  instance: SectionInstance | null;
  variant: SectionVariant | null;
  onChange: (key: string, value: string) => void;
  open: boolean;
  onToggle: () => void;
  overlay?: boolean;
  onClose?: () => void;
}

export function PropertiesPanel({ instance, variant, onChange, open, onToggle, overlay, onClose }: Props) {
  if (!open) {
    return (
      <div className="w-10 border-l border-border bg-card/40 flex flex-col items-center py-3 gap-2 shrink-0">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground"
          title="Abrir propriedades"
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    );
  }
  const asideCls = overlay
    ? "absolute inset-y-0 right-0 z-30 w-80 max-w-[92vw] border-l border-border bg-card shadow-2xl flex flex-col"
    : "w-80 shrink-0 border-l border-border bg-card/40 flex flex-col";
  return (
    <>
      {overlay && <div className="absolute inset-0 z-20 bg-black/50" onClick={onClose} />}
      <aside className={asideCls}>
      <div className="h-11 shrink-0 px-4 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
          <div className="text-xs font-medium">Propriedades</div>
        </div>
        <button
          onClick={overlay ? onClose : onToggle}
          className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-muted-foreground"
          title="Fechar"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {!instance || !variant ? (
          <div className="p-6 text-xs text-muted-foreground text-center">
            Clique numa seção do preview para editar seus campos.
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{variant.kind}</div>
              <div className="text-sm font-semibold font-display mt-0.5">{variant.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{variant.description}</div>
            </div>
            <div className="h-px bg-border" />
            {variant.schema.map((f) => {
              const val = instance.props[f.key] ?? "";
              return (
                <div key={f.key}>
                  <label className="text-[11px] text-muted-foreground font-medium mb-1.5 block">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={val}
                      onChange={(e) => onChange(f.key, e.target.value)}
                      rows={3}
                      className="w-full text-sm bg-input/60 border border-border rounded-lg px-3 py-2 outline-none focus:border-[#950101] focus:ring-2 focus:ring-[#FF0000]/20 transition-all resize-none"
                    />
                  ) : f.type === "color" ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={val || "#000000"}
                        onChange={(e) => onChange(f.key, e.target.value)}
                        className="w-10 h-9 rounded-lg bg-transparent border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => onChange(f.key, e.target.value)}
                        className="flex-1 text-sm bg-input/60 border border-border rounded-lg px-3 py-2 outline-none focus:border-[#950101] transition-all font-mono"
                      />
                    </div>
                  ) : (
                    <input
                      type={f.type === "url" ? "url" : "text"}
                      value={val}
                      onChange={(e) => onChange(f.key, e.target.value)}
                      className="w-full text-sm bg-input/60 border border-border rounded-lg px-3 py-2 outline-none focus:border-[#950101] focus:ring-2 focus:ring-[#FF0000]/20 transition-all"
                    />
                  )}
                  {f.type === "image" && val && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border aspect-video bg-black">
                      <img src={val} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
