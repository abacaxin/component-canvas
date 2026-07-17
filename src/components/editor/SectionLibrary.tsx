import { useState } from "react";
import { VARIANTS } from "@/lib/editor/sections";
import type { SectionInstance } from "@/lib/editor/types";
import { Plus, Copy, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, PanelLeftClose, PanelLeft, Layers, LibraryBig } from "lucide-react";

interface Props {
  open: boolean;
  onToggle: () => void;
  onAdd: (variantId: string) => void;
  sections: SectionInstance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

export function SectionLibrary({
  open, onToggle, onAdd, sections, selectedId, onSelect, onRemove, onDuplicate, onToggleHidden, onMove,
}: Props) {
  const [tab, setTab] = useState<"layers" | "library">("layers");

  if (!open) {
    return (
      <div className="w-10 border-r border-border bg-card/40 flex flex-col items-center py-3 gap-2">
        <button onClick={onToggle} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground">
          <PanelLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-card/40 flex flex-col">
      <div className="h-11 shrink-0 px-2 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-1 p-0.5 bg-secondary rounded-full text-xs">
          <button
            onClick={() => setTab("layers")}
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${tab === "layers" ? "bg-background text-foreground" : "text-muted-foreground"}`}
          >
            <Layers className="w-3 h-3" /> Camadas
          </button>
          <button
            onClick={() => setTab("library")}
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${tab === "library" ? "bg-background text-foreground" : "text-muted-foreground"}`}
          >
            <LibraryBig className="w-3 h-3" /> Biblioteca
          </button>
        </div>
        <button onClick={onToggle} className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-muted-foreground">
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {tab === "layers" ? (
          <div className="space-y-1">
            {sections.map((s, i) => {
              const variant = VARIANTS.find((v) => v.id === s.variantId);
              const active = s.id === selectedId;
              return (
                <div
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  className={`group rounded-lg border transition-all cursor-pointer ${
                    active
                      ? "border-[#950101] bg-[#3D0000]/30"
                      : "border-transparent hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 p-2.5">
                    <div
                      className="w-1 h-8 rounded-full shrink-0"
                      style={{ background: active ? "linear-gradient(180deg,#950101,#FF0000)" : "transparent" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium truncate ${s.hidden ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {variant?.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {String(Object.values(s.props)[0] ?? "").slice(0, 40)}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                      <IconBtn onClick={(e) => { e.stopPropagation(); onMove(s.id, -1); }} disabled={i === 0}><ChevronUp className="w-3 h-3" /></IconBtn>
                      <IconBtn onClick={(e) => { e.stopPropagation(); onMove(s.id, 1); }} disabled={i === sections.length - 1}><ChevronDown className="w-3 h-3" /></IconBtn>
                      <IconBtn onClick={(e) => { e.stopPropagation(); onToggleHidden(s.id); }}>
                        {s.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </IconBtn>
                      <IconBtn onClick={(e) => { e.stopPropagation(); onDuplicate(s.id); }}><Copy className="w-3 h-3" /></IconBtn>
                      <IconBtn onClick={(e) => { e.stopPropagation(); onRemove(s.id); }}><Trash2 className="w-3 h-3" /></IconBtn>
                    </div>
                  </div>
                </div>
              );
            })}
            {sections.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-8">Adicione seções da biblioteca</div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                onClick={() => onAdd(v.id)}
                className="group text-left p-3 rounded-lg border border-white/5 hover:border-[#950101] hover:bg-[#3D0000]/20 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-foreground">{v.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{v.description}</div>
                  </div>
                  <div className="w-6 h-6 rounded-md border border-white/10 group-hover:bg-[#FF0000] group-hover:border-[#FF0000] flex items-center justify-center transition-colors shrink-0">
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
                <div className="mt-2 text-[9px] uppercase tracking-widest text-muted-foreground/70">{v.kind}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function IconBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-6 h-6 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
    >
      {children}
    </button>
  );
}
