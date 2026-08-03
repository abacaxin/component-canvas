/**
 * Pricing catalog — plan + add-on features. Kept as code (same pattern as
 * lib/editor/sections.ts and typography.ts) so pricing previews work with zero
 * backend, in both local-only and cloud modes. When B2 (Stripe) lands, mirror
 * these into DB tables / Stripe Products for server-side price verification —
 * never trust a client-computed total when actually charging.
 */

export type FeatureKind = "usage" | "toggle";

export interface FeatureDef {
  key: string;
  label: string;
  description: string;
  kind: FeatureKind;
  unitPriceCents: number;
  /** "usage" features only: how many are included in the base plan before charging kicks in. */
  includedInBase?: number;
  /** "usage" features only: singular unit label, e.g. "página", "componente". */
  unit?: string;
}

export interface PlanDef {
  key: string;
  name: string;
  priceCents: number;
  limits: { pages: number; sections: number };
  description: string;
}

export const BASE_PLAN: PlanDef = {
  key: "base",
  name: "Plano Base",
  priceCents: 2900,
  limits: { pages: 1, sections: 5 },
  description: "1 página, 5 seções, domínio interno.",
};

/**
 * "usage" features are billed automatically from what's actually in the project
 * (no manual toggle) — see lib/pricing/calc.ts. "toggle" features are opt-in add-ons
 * the user turns on explicitly.
 */
export const FEATURES: FeatureDef[] = [
  {
    key: "pagina_extra",
    label: "Página extra",
    description: "Cada página além da incluída no plano base.",
    kind: "usage",
    unitPriceCents: 900,
    includedInBase: BASE_PLAN.limits.pages,
    unit: "página",
  },
  {
    key: "componente_premium",
    label: "Componente premium",
    description: "Cada componente premium usado no site.",
    kind: "usage",
    unitPriceCents: 1500,
    includedInBase: 0,
    unit: "componente",
  },
  {
    key: "dominio_custom",
    label: "Domínio personalizado",
    description: "Conecte seu próprio domínio com SSL automático.",
    kind: "toggle",
    unitPriceCents: 1900,
  },
  {
    key: "export_codigo",
    label: "Exportação de código",
    description: "Exporte o HTML/código-fonte do site.",
    kind: "toggle",
    unitPriceCents: 2900,
  },
  {
    key: "ia",
    label: "Recursos de IA",
    description: "Geração de textos e sugestões com inteligência artificial.",
    kind: "toggle",
    unitPriceCents: 3900,
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Painel de estatísticas de visitas do site.",
    kind: "toggle",
    unitPriceCents: 1500,
  },
];

export function getFeature(key: string): FeatureDef | undefined {
  return FEATURES.find((f) => f.key === key);
}

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
