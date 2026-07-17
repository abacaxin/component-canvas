export type FieldType =
  "text" | "textarea" | "color" | "image" | "url" | "toggle" | "select" | "list";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  /** Options for `select` fields. */
  options?: SelectOption[];
  /** For `list` fields: the schema of each item (primitive field types only). */
  itemSchema?: FieldSchema[];
  /** For `list` fields: default values for a freshly added item. */
  itemDefaults?: Record<string, string>;
  /** For `list` fields: singular label of an item, e.g. "Link", "Card". */
  itemLabel?: string;
  /** For `list` fields: bounds on how many items are allowed. */
  min?: number;
  max?: number;
  /** Only show this field when another field has the given value (structural toggles). */
  showWhen?: { key: string; equals: string | boolean };
}

export interface SectionVariant {
  id: string; // unique variant id, e.g. "navbar.modern"
  kind: SectionKind;
  name: string;
  description: string;
  schema: FieldSchema[];
  defaults: PropMap;
}

export type SectionKind =
  "navbar" | "hero" | "features" | "gallery" | "testimonials" | "faq" | "cta" | "footer";

/** A single row inside a `list` field. `_id` is a stable key for React + editing. */
export type ListItem = Record<string, string> & { _id: string };

/** A prop can be a scalar (text/color/url/select), a boolean (toggle), or a list. */
export type PropValue = string | boolean | ListItem[];

export type PropMap = Record<string, PropValue>;

export interface SectionInstance {
  id: string; // instance id (uuid)
  variantId: string;
  props: PropMap;
  hidden?: boolean;
}

export interface Typography {
  headingFont: string; // font family name, e.g. "Inter Tight"
  bodyFont: string;
  headingWeight: number; // 300–900
  bodyWeight: number; // 300–700
  lineHeight: number; // 1.0–2.0
  letterSpacing: number; // em, -0.05–0.1
  baseSize: number; // px, base body size, 14–20
}

export interface ProjectState {
  name: string;
  sections: SectionInstance[];
  typography: Typography;
}

export type Device = "desktop" | "tablet" | "mobile";
