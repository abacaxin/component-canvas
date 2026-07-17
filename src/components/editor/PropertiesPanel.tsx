import { useState } from "react";
import type {
  FieldSchema,
  PropValue,
  SectionInstance,
  SectionVariant,
  Typography,
} from "@/lib/editor/types";
import { str, bool, list } from "@/lib/editor/props";
import { TypographyPanel } from "./TypographyPanel";
import {
  Settings2,
  PanelRightClose,
  PanelRight,
  Type,
  Layers2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Props {
  instance: SectionInstance | null;
  variant: SectionVariant | null;
  typography: Typography;
  onChange: (key: string, value: PropValue) => void;
  onListAdd: (key: string) => void;
  onListRemove: (key: string, itemId: string) => void;
  onListChange: (key: string, itemId: string, field: string, value: string) => void;
  onListMove: (key: string, itemId: string, dir: -1 | 1) => void;
  onTypographyChange: (patch: Partial<Typography>) => void;
  open: boolean;
  onToggle: () => void;
  overlay?: boolean;
  onClose?: () => void;
}

export function PropertiesPanel(props: Props) {
  const { instance, variant, typography, open, onToggle, overlay, onClose, onTypographyChange } =
    props;
  const [tab, setTab] = useState<"section" | "type">("section");

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
        <div className="h-11 shrink-0 px-2 border-b border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-secondary rounded-full text-xs">
            <button
              onClick={() => setTab("section")}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${tab === "section" ? "bg-background text-foreground" : "text-muted-foreground"}`}
            >
              <Layers2 className="w-3 h-3" /> Seção
            </button>
            <button
              onClick={() => setTab("type")}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${tab === "type" ? "bg-background text-foreground" : "text-muted-foreground"}`}
            >
              <Type className="w-3 h-3" /> Tipografia
            </button>
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
          {tab === "type" ? (
            <TypographyPanel typography={typography} onChange={onTypographyChange} />
          ) : !instance || !variant ? (
            <div className="p-6 text-xs text-muted-foreground text-center flex flex-col items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Clique numa seção do preview para editar seus campos.
            </div>
          ) : (
            <SectionFields
              instance={instance}
              variant={variant}
              onChange={props.onChange}
              onListAdd={props.onListAdd}
              onListRemove={props.onListRemove}
              onListChange={props.onListChange}
              onListMove={props.onListMove}
            />
          )}
        </div>
      </aside>
    </>
  );
}

function SectionFields({
  instance,
  variant,
  onChange,
  onListAdd,
  onListRemove,
  onListChange,
  onListMove,
}: {
  instance: SectionInstance;
  variant: SectionVariant;
  onChange: Props["onChange"];
  onListAdd: Props["onListAdd"];
  onListRemove: Props["onListRemove"];
  onListChange: Props["onListChange"];
  onListMove: Props["onListMove"];
}) {
  const visible = (f: FieldSchema) => {
    if (!f.showWhen) return true;
    return instance.props[f.showWhen.key] === f.showWhen.equals;
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {variant.kind}
        </div>
        <div className="text-sm font-semibold mt-0.5">{variant.name}</div>
        <div className="text-xs text-muted-foreground mt-1">{variant.description}</div>
      </div>
      <div className="h-px bg-border" />
      {variant.schema
        .filter(visible)
        .map((f) =>
          f.type === "list" ? (
            <ListField
              key={f.key}
              field={f}
              items={list(instance.props, f.key)}
              onAdd={() => onListAdd(f.key)}
              onRemove={(itemId) => onListRemove(f.key, itemId)}
              onChange={(itemId, field, value) => onListChange(f.key, itemId, field, value)}
              onMove={(itemId, dir) => onListMove(f.key, itemId, dir)}
            />
          ) : (
            <ScalarField key={f.key} field={f} instance={instance} onChange={onChange} />
          ),
        )}
    </div>
  );
}

function ScalarField({
  field: f,
  instance,
  onChange,
}: {
  field: FieldSchema;
  instance: SectionInstance;
  onChange: (key: string, value: PropValue) => void;
}) {
  if (f.type === "toggle") {
    const checked = bool(instance.props, f.key);
    return (
      <button
        onClick={() => onChange(f.key, !checked)}
        className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-input/40 px-3 py-2.5 hover:border-white/20 transition-all"
      >
        <span className="text-xs font-medium text-foreground text-left">{f.label}</span>
        <span
          className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-[#FF0000]" : "bg-white/15"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : ""}`}
          />
        </span>
      </button>
    );
  }

  const val = str(instance.props, f.key);
  return (
    <div>
      <label className="text-[11px] text-muted-foreground font-medium mb-1.5 block">
        {f.label}
      </label>
      <FieldInput field={f} value={val} onChange={(v) => onChange(f.key, v)} />
      {f.type === "image" && val && (
        <div className="mt-2 rounded-lg overflow-hidden border border-border aspect-video bg-black">
          <img src={val} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

/** Renders the raw control for a primitive field. Reused by scalar fields and list items. */
function FieldInput({
  field: f,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: string;
  onChange: (v: string) => void;
}) {
  const base =
    "w-full text-sm bg-input/60 border border-border rounded-lg px-3 py-2 outline-none focus:border-[#950101] focus:ring-2 focus:ring-[#FF0000]/20 transition-all";
  if (f.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={`${base} resize-none`}
      />
    );
  }
  if (f.type === "select") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={base}>
        {(f.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }
  if (f.type === "color") {
    return (
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-9 rounded-lg bg-transparent border border-border cursor-pointer shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} font-mono`}
        />
      </div>
    );
  }
  return (
    <input
      type={f.type === "url" ? "url" : "text"}
      value={value}
      placeholder={f.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={base}
    />
  );
}

function ListField({
  field: f,
  items,
  onAdd,
  onRemove,
  onChange,
  onMove,
}: {
  field: FieldSchema;
  items: Array<Record<string, string> & { _id: string }>;
  onAdd: () => void;
  onRemove: (itemId: string) => void;
  onChange: (itemId: string, field: string, value: string) => void;
  onMove: (itemId: string, dir: -1 | 1) => void;
}) {
  const itemSchema = f.itemSchema ?? [];
  const canAdd = f.max === undefined || items.length < f.max;
  const canRemove = items.length > (f.min ?? 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] text-muted-foreground font-medium">{f.label}</label>
        <span className="text-[10px] text-muted-foreground/70">
          {items.length}
          {f.max ? `/${f.max}` : ""}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={item._id}
            className="rounded-lg border border-white/10 bg-black/30 p-2.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                {f.itemLabel ?? "Item"} {i + 1}
              </span>
              <div className="flex items-center gap-0.5">
                <MiniBtn
                  onClick={() => onMove(item._id, -1)}
                  disabled={i === 0}
                  title="Mover para cima"
                >
                  <ChevronUp className="w-3 h-3" />
                </MiniBtn>
                <MiniBtn
                  onClick={() => onMove(item._id, 1)}
                  disabled={i === items.length - 1}
                  title="Mover para baixo"
                >
                  <ChevronDown className="w-3 h-3" />
                </MiniBtn>
                <MiniBtn onClick={() => onRemove(item._id)} disabled={!canRemove} title="Remover">
                  <Trash2 className="w-3 h-3" />
                </MiniBtn>
              </div>
            </div>
            {itemSchema.map((sf) => (
              <div key={sf.key}>
                {itemSchema.length > 1 && (
                  <label className="text-[10px] text-muted-foreground/80 mb-1 block">
                    {sf.label}
                  </label>
                )}
                <FieldInput
                  field={sf}
                  value={item[sf.key] ?? ""}
                  onChange={(v) => onChange(item._id, sf.key, v)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        disabled={!canAdd}
        className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 hover:border-[#950101] hover:bg-white/[0.03] text-xs text-muted-foreground hover:text-foreground py-2 transition-all disabled:opacity-30 disabled:pointer-events-none"
      >
        <Plus className="w-3.5 h-3.5" /> Adicionar {f.itemLabel?.toLowerCase() ?? "item"}
      </button>
    </div>
  );
}

function MiniBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-6 h-6 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center transition-colors"
    >
      {children}
    </button>
  );
}
