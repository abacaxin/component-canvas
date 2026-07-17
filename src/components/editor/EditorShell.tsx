import { useMemo, useState, useEffect } from "react";
import { useProject } from "@/lib/editor/store";
import { getVariant, RENDERERS } from "@/lib/editor/sections";
import { SectionLibrary } from "./SectionLibrary";
import { PropertiesPanel } from "./PropertiesPanel";
import { Canvas } from "./Canvas";
import type { Device } from "@/lib/editor/types";
import { Undo2, Redo2, Monitor, Tablet, Smartphone, Rocket, Sparkles } from "lucide-react";

export function EditorShell() {
  const store = useProject();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [libraryOpen, setLibraryOpen] = useState(true);

  const selected = useMemo(
    () => store.project.sections.find((s) => s.id === selectedId) ?? null,
    [store.project.sections, selectedId],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        store.undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault();
        store.redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Top bar */}
      <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4 bg-card/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#3D0000,#950101,#FF0000)", boxShadow: "0 0 20px -4px #FF0000" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold font-display leading-tight">SANGRE</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Website Builder</div>
          </div>
          <div className="mx-3 h-6 w-px bg-border" />
          <input
            value={store.project.name}
            onChange={(e) => store.renameProject(e.target.value)}
            className="bg-transparent text-sm font-medium px-2 py-1 rounded hover:bg-white/5 focus:bg-white/5 outline-none min-w-40"
          />
          <span className="text-xs text-muted-foreground ml-1">· autosave</span>
        </div>

        <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
          <DeviceBtn active={device === "desktop"} onClick={() => setDevice("desktop")} Icon={Monitor} />
          <DeviceBtn active={device === "tablet"} onClick={() => setDevice("tablet")} Icon={Tablet} />
          <DeviceBtn active={device === "mobile"} onClick={() => setDevice("mobile")} Icon={Smartphone} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={store.undo}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Desfazer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={store.redo}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Refazer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            className="ml-2 h-9 px-4 rounded-full text-sm font-medium text-white flex items-center gap-2 transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg,#3D0000,#950101,#FF0000)", boxShadow: "0 0 24px -6px #FF0000" }}
          >
            <Rocket className="w-3.5 h-3.5" />
            Publicar
          </button>
        </div>
      </header>

      {/* Body: three panels */}
      <div className="flex-1 flex overflow-hidden">
        <SectionLibrary
          open={libraryOpen}
          onToggle={() => setLibraryOpen((v) => !v)}
          onAdd={(vid) => store.addSection(vid)}
          sections={store.project.sections}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRemove={store.removeSection}
          onDuplicate={store.duplicateSection}
          onToggleHidden={store.toggleHidden}
          onMove={store.moveSection}
        />

        <Canvas
          device={device}
          sections={store.project.sections}
          selectedId={selectedId}
          onSelect={setSelectedId}
          renderers={RENDERERS}
        />

        <PropertiesPanel
          instance={selected}
          variant={selected ? getVariant(selected.variantId) ?? null : null}
          onChange={(k, v) => selected && store.updateProp(selected.id, k, v)}
        />
      </div>
    </div>
  );
}

function DeviceBtn({
  active,
  onClick,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
