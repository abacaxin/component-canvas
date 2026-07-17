export type FieldType = "text" | "textarea" | "color" | "image" | "url";

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}

export interface SectionVariant {
  id: string;              // unique variant id, e.g. "navbar.modern"
  kind: SectionKind;
  name: string;
  description: string;
  schema: FieldSchema[];
  defaults: Record<string, string>;
}

export type SectionKind =
  | "navbar"
  | "hero"
  | "features"
  | "gallery"
  | "testimonials"
  | "faq"
  | "cta"
  | "footer";

export interface SectionInstance {
  id: string;              // instance id (uuid)
  variantId: string;
  props: Record<string, string>;
  hidden?: boolean;
}

export interface ProjectState {
  name: string;
  sections: SectionInstance[];
}

export type Device = "desktop" | "tablet" | "mobile";
