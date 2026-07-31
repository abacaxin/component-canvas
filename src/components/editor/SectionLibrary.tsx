import { useMemo, useState } from "react";
import { VARIANTS, RENDERERS, CATEGORY_ORDER, getVariant } from "@/lib/editor/sections";
import type { PropMap, SectionInstance, SectionVariant } from "@/lib/editor/types";
import type { useLibraryPrefs } from "@/hooks/use-library-prefs";
import type { DragState } from "@/hooks/use-canvas-drag";

type LibraryPrefs = ReturnType<typeof useLibraryPrefs>;
type DragStart = Pick<DragState, "start">;
import {
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Layers,
  LibraryBig,
  GripVertical,
  Search,
  Star,
  Sparkles,
  Clock,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  onReorder: (fromId: string, toId: string) => void;
  prefs: LibraryPrefs;
  drag: DragStart;
  overlay?: boolean;
  onClose?: () => void;
}

export function SectionLibrary({
  open,
  onToggle,
  onAdd,
  sections,
  selectedId,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleHidden,
  onMove,
  onReorder,
  prefs,
  drag,
  overlay,
  onClose,
}: Props) {
  const [tab, setTab] = useState<"layers" | "library">("library");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  if (!open) {
    return (
      <div className="w-10 border-r border-border bg-card/40 flex flex-col items-center py-3 gap-2 shrink-0">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onReorder(String(active.id), String(over.id));
  };

  const asideCls = overlay
    ? "absolute inset-y-0 left-0 z-30 w-72 border-r border-border bg-card shadow-2xl flex flex-col"
    : "w-72 shrink-0 border-r border-border bg-card/40 flex flex-col";

  return (
    <>
      {overlay && <div className="absolute inset-0 z-20 bg-black/50" onClick={onClose} />}
      <aside className={asideCls}>
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
          <button
            onClick={overlay ? onClose : onToggle}
            className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-muted-foreground"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {tab === "layers" ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {sections.map((s, i) => (
                    <SortableLayer
                      key={s.id}
                      s={s}
                      index={i}
                      total={sections.length}
                      active={s.id === selectedId}
                      onSelect={() => onSelect(s.id)}
                      onMove={onMove}
                      onToggleHidden={onToggleHidden}
                      onDuplicate={onDuplicate}
                      onRemove={onRemove}
                    />
                  ))}
                  {sections.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-8">
                      Adicione seções da biblioteca
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <LibraryBrowser prefs={prefs} drag={drag} onAdd={onAdd} />
          )}
        </div>
      </aside>
    </>
  );
}

function LibraryBrowser({
  prefs,
  drag,
  onAdd,
}: {
  prefs: LibraryPrefs;
  drag: DragStart;
  onAdd: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const q = query.trim().toLowerCase();

  const toggle = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const groups = useMemo(() => {
    const matches = (v: SectionVariant) =>
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      (v.category ?? "").toLowerCase().includes(q);

    const resolve = (ids: string[]) =>
      ids
        .map((id) => getVariant(id))
        .filter((v): v is SectionVariant => !!v)
        .filter(matches);

    return {
      favorites: resolve(prefs.favorites),
      recents: resolve(prefs.recents),
      categories: CATEGORY_ORDER.map((cat) => ({
        cat,
        items: VARIANTS.filter((v) => v.category === cat && matches(v)),
      })).filter((g) => g.items.length > 0),
    };
  }, [q, prefs.favorites, prefs.recents]);

  const empty =
    groups.favorites.length === 0 && groups.recents.length === 0 && groups.categories.length === 0;

  const renderGroup = (
    key: string,
    label: string,
    items: SectionVariant[],
    Icon?: React.ComponentType<{ className?: string }>,
  ) => {
    const isCollapsed = collapsed.has(key);
    return (
      <div key={key} className="mb-1">
        <button
          onClick={() => toggle(key)}
          className="w-full flex items-center gap-1.5 px-1 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight
            className={`w-3 h-3 transition-transform ${isCollapsed ? "" : "rotate-90"}`}
          />
          {Icon && <Icon className="w-3 h-3" />}
          {label}
          <span className="ml-auto text-muted-foreground/60 normal-case tracking-normal">
            {items.length}
          </span>
        </button>
        {!isCollapsed && (
          <div className="grid grid-cols-1 gap-2 pb-2">
            {items.map((v) => (
              <VariantCard
                key={v.id}
                v={v}
                drag={drag}
                onAdd={onAdd}
                isFavorite={prefs.favorites.includes(v.id)}
                onToggleFavorite={() => prefs.toggleFavorite(v.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-2 -mt-2 px-2 pt-2 pb-2 bg-card/95 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar componentes…"
            className="w-full text-sm bg-input/60 border border-border rounded-lg pl-8 pr-8 py-2 outline-none focus:border-[#950101] focus:ring-2 focus:ring-[#FF0000]/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"
              title="Limpar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {groups.favorites.length > 0 && renderGroup("__fav", "Favoritos", groups.favorites, Star)}
      {groups.recents.length > 0 && renderGroup("__recent", "Recentes", groups.recents, Clock)}
      {groups.categories.map((g) => renderGroup(g.cat, g.cat, g.items))}

      {empty && (
        <div className="text-xs text-muted-foreground text-center py-10">
          Nada encontrado para “{query}”.
        </div>
      )}
    </div>
  );
}

function VariantCard({
  v,
  drag,
  onAdd,
  isFavorite,
  onToggleFavorite,
}: {
  v: SectionVariant;
  drag: DragStart;
  onAdd: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      // Pointer press may become a drag-to-canvas or, if released in place, a plain add.
      onPointerDown={(e) => drag.start(v.id, e)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAdd(v.id);
        }
      }}
      style={{ touchAction: "pan-y" }}
      className="group relative text-left rounded-xl border border-white/5 hover:border-[#950101] bg-black/40 overflow-hidden transition-all cursor-grab active:cursor-grabbing"
    >
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-1.5 left-1.5 z-10 w-6 h-6 rounded-md bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition-colors"
        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Star
          className={`w-3.5 h-3.5 ${isFavorite ? "fill-[#FFCC00] text-[#FFCC00]" : "text-white/60"}`}
        />
      </button>
      {v.premium && (
        <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 rounded-md bg-[#950101]/80 backdrop-blur px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
          <Sparkles className="w-2.5 h-2.5" /> Pro
        </div>
      )}
      <VariantPreview variantId={v.id} defaults={v.defaults} />
      <div className="p-2.5 border-t border-white/5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs font-medium text-foreground truncate">{v.name}</div>
            <div className="text-[10px] text-muted-foreground truncate">{v.description}</div>
          </div>
          <div className="w-6 h-6 rounded-md border border-white/10 group-hover:bg-[#FF0000] group-hover:border-[#FF0000] flex items-center justify-center transition-colors shrink-0">
            <Plus className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

function VariantPreview({ variantId, defaults }: { variantId: string; defaults: PropMap }) {
  const R = RENDERERS[variantId];
  if (!R) return null;
  // Render at 1280px width, scale down to fit ~256px card width.
  const scale = 0.2;
  return (
    <div
      className="relative w-full overflow-hidden bg-black pointer-events-none"
      style={{ height: 120 }}
      aria-hidden
    >
      <div
        style={{
          width: 1280,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <R props={defaults} />
      </div>
    </div>
  );
}

function SortableLayer({
  s,
  index,
  total,
  active,
  onSelect,
  onMove,
  onToggleHidden,
  onDuplicate,
  onRemove,
}: {
  s: SectionInstance;
  index: number;
  total: number;
  active: boolean;
  onSelect: () => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onToggleHidden: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const variant = VARIANTS.find((v) => v.id === s.variantId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: s.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group rounded-lg border transition-all cursor-pointer ${
        active
          ? "border-[#950101] bg-[#3D0000]/30"
          : "border-transparent hover:border-white/10 hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-1.5 p-2">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="w-5 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing shrink-0"
          title="Arrastar"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 min-w-0">
          <div
            className={`text-xs font-medium truncate ${s.hidden ? "text-muted-foreground line-through" : "text-foreground"}`}
          >
            {variant?.name}
          </div>
          <div className="text-[10px] text-muted-foreground truncate">
            {(
              Object.values(s.props).find((v) => typeof v === "string" && v.trim()) as
                string | undefined
            )?.slice(0, 40) ?? ""}
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              onMove(s.id, -1);
            }}
            disabled={index === 0}
          >
            <ChevronUp className="w-3 h-3" />
          </IconBtn>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              onMove(s.id, 1);
            }}
            disabled={index === total - 1}
          >
            <ChevronDown className="w-3 h-3" />
          </IconBtn>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              onToggleHidden(s.id);
            }}
          >
            {s.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </IconBtn>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(s.id);
            }}
          >
            <Copy className="w-3 h-3" />
          </IconBtn>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              onRemove(s.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </IconBtn>
        </div>
      </div>
    </div>
  );
}

// Keep arrayMove import used to avoid tree-shaking removing it (utility re-export).
void arrayMove;

function IconBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}) {
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
