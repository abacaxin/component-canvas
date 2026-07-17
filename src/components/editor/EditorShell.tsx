import { useMemo, useState, useEffect } from "react";
import { useProject } from "@/lib/editor/store";
import { getVariant, RENDERERS } from "@/lib/editor/sections";
import { downloadHTML } from "@/lib/editor/export";
import { SectionLibrary } from "./SectionLibrary";
import { PropertiesPanel } from "./PropertiesPanel";
import { Canvas } from "./Canvas";
import type { Device } from "@/lib/editor/types";
import { Undo2, Redo2, Monitor, Tablet, Smartphone, Rocket, Sparkles, Download, Menu, Settings2 } from "lucide-react";

export function EditorShell() {
  const store = useProject();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [isNarrow, setIsNarrow] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [propsOpen, setPropsOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => {
      setIsNarrow(mq.matches);
      if (mq.matches) {
        setLibraryOpen(false);
        setPropsOpen(false);
      } else {
        setLibraryOpen(true);
        setPropsOpen(true);
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const selected = useMemo(
    () => store.project.sections.find((s) => s.id === selectedId) ?? null,
    [store.project.sections, selectedId],
  );

  // Auto-open properties on narrow when a section is selected
  useEffect(() => {
    if (isNarrow && selected) setPropsOpen(true);
  }, [selected, isNarrow]);

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
      <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-2 sm:px-4 gap-2 bg-card/60 backdrop-blur-xl">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {isNarrow && (
            <button
              onClick={() => setLibraryOpen((v) => !v)}
              className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center shrink-0"
              title="Biblioteca / camadas"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#3D0000,#950101,#FF0000)", boxShadow: "0 0 20px -4px #FF0000" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block min-w-0">
            <div className="text-sm font-semibold font-display leading-tight">SANGRE</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Website Builder</div>
          </div>
          <div className="hidden sm:block mx-2 h-6 w-px bg-border" />
          <input
            value={store.project.name}
            onChange={(e) => store.renameProject(e.target.value)}
            className="bg-transparent text-sm font-medium px-2 py-1 rounded hover:bg-white/5 focus:bg-white/5 outline-none min-w-0 w-24 sm:w-40"
          />
        </div>

        <div className="flex items-center gap-1 bg-secondary rounded-full p-1 shrink-0">
          <DeviceBtn active={device === "desktop"} onClick={() => setDevice("desktop")} Icon={Monitor} />
          <DeviceBtn active={device === "tablet"} onClick={() => setDevice("tablet")} Icon={Tablet} />
          <DeviceBtn active={device === "mobile"} onClick={() => setDevice("mobile")} Icon={Smartphone} />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={store.undo}
            className="hidden sm:flex w-8 h-8 rounded-lg hover:bg-white/5 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Desfazer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={store.redo}
            className="hidden sm:flex w-8 h-8 rounded-lg hover:bg-white/5 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Refazer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => downloadHTML(store.project)}
            className="h-9 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-medium border border-white/10 hover:border-white/30 hover:bg-white/5 text-white flex items-center gap-2 transition-all"
            title="Exportar HTML"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button
            className="h-9 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-medium text-white flex items-center gap-2 transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg,#3D0000,#950101,#FF0000)", boxShadow: "0 0 24px -6px #FF0000" }}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publicar</span>
          </button>
          {isNarrow && (
            <button
              onClick={() => setPropsOpen((v) => !v)}
              className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center"
              title="Propriedades"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {(!isNarrow || libraryOpen) && (
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
            onReorder={store.reorderSections}
            overlay={isNarrow}
            onClose={() => setLibraryOpen(false)}
          />
        )}

        <Canvas
          device={device}
          sections={store.project.sections}
          selectedId={selectedId}
          onSelect={setSelectedId}
          renderers={RENDERERS}
        />

        {(!isNarrow || propsOpen) && (
          <PropertiesPanel
            instance={selected}
            variant={selected ? getVariant(selected.variantId) ?? null : null}
            onChange={(k, v) => selected && store.updateProp(selected.id, k, v)}
            open={propsOpen}
            onToggle={() => setPropsOpen((v) => !v)}
            overlay={isNarrow}
            onClose={() => setPropsOpen(false)}
          />
        )}
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
