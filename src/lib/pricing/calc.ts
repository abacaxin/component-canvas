import type { ProjectState } from "@/lib/editor/types";
import { getVariant } from "@/lib/editor/sections";
import { BASE_PLAN, FEATURES } from "./catalog";

export interface UsageSnapshot {
  pages: number;
  premiumComponents: number;
}

/** Reads real usage straight off the project — this is what makes usage-based lines automatic. */
export function computeUsage(project: ProjectState): UsageSnapshot {
  let premiumComponents = 0;
  for (const page of project.pages) {
    for (const s of page.sections) {
      if (getVariant(s.variantId)?.premium) premiumComponents++;
    }
  }
  return { pages: project.pages.length, premiumComponents };
}

export interface PriceLine {
  key: string;
  label: string;
  detail: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

export interface PriceBreakdown {
  planCents: number;
  lines: PriceLine[];
  totalCents: number;
}

/**
 * Pure price calculation: plan base + usage-derived lines (extra pages, premium
 * components — read straight from the project, never chosen by hand) + any manually
 * toggled add-ons. Shared shape front/back so a future server recompute (never trust
 * a client-sent total when actually charging) matches this exactly.
 */
export function calculatePrice(
  project: ProjectState,
  addons: Record<string, boolean>,
): PriceBreakdown {
  const usage = computeUsage(project);
  const usageQty: Record<string, number> = {
    pagina_extra: usage.pages,
    componente_premium: usage.premiumComponents,
  };

  const lines: PriceLine[] = [];
  for (const f of FEATURES) {
    if (f.kind === "usage") {
      const total = usageQty[f.key] ?? 0;
      const included = f.includedInBase ?? 0;
      const extra = Math.max(0, total - included);
      if (extra > 0) {
        lines.push({
          key: f.key,
          label: f.label,
          detail: `${extra} ${f.unit ?? ""}${extra > 1 ? "s" : ""} além do incluído`,
          quantity: extra,
          unitPriceCents: f.unitPriceCents,
          totalCents: extra * f.unitPriceCents,
        });
      }
    } else if (addons[f.key]) {
      lines.push({
        key: f.key,
        label: f.label,
        detail: "Ativado",
        quantity: 1,
        unitPriceCents: f.unitPriceCents,
        totalCents: f.unitPriceCents,
      });
    }
  }

  const totalCents = BASE_PLAN.priceCents + lines.reduce((sum, l) => sum + l.totalCents, 0);
  return { planCents: BASE_PLAN.priceCents, lines, totalCents };
}
