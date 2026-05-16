/**
 * Fase 13 — Business Intent Engine.
 * Classifica entidades por potencial comercial. Apenas heurístico.
 */

export type BusinessIntent =
  | "transactional" | "commercial" | "informational" | "navigational" | "hybrid";

export interface BusinessIntentInput {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  productCount?: number;
  reviewsCount?: number;
  editorialSize?: number;
  ctaStrength?: number;        // 0..100
  conversionContext?: number;  // 0..100
  hasKits?: boolean;
  authorityScore?: number;
  isOccasion?: boolean;
  isSegment?: boolean;
  isBlog?: boolean;
  isHub?: boolean;
}

export interface BusinessIntentResult {
  entityType: string;
  entityId: string;
  intent: BusinessIntent;
  commercialPriority: number; // 0..100
  signals: string[];
}

export function calculateBusinessIntent(i: BusinessIntentInput): BusinessIntentResult {
  const signals: string[] = [];
  const p = i.productCount ?? 0;
  const r = i.reviewsCount ?? 0;
  const ed = i.editorialSize ?? 0;
  const cta = i.ctaStrength ?? 0;

  let intent: BusinessIntent = "informational";
  if (i.isBlog && ed > 600) { intent = "informational"; signals.push("editorial profundo"); }
  if (p >= 6 && cta >= 40) { intent = "commercial"; signals.push(">=6 produtos + CTA"); }
  if (p >= 12 && (i.hasKits || r >= 5)) { intent = "transactional"; signals.push(">=12 produtos com reviews/kits"); }
  if (i.isHub && ed > 800 && p >= 4) { intent = "hybrid"; signals.push("hub editorial + produtos"); }
  if (i.isSegment && p >= 8) { intent = "commercial"; signals.push("segmento com catálogo"); }

  const commercialPriority = Math.min(100, Math.round(
    (p * 3) + (r * 4) + (cta * 0.4) + ((i.conversionContext ?? 0) * 0.3) +
    ((i.authorityScore ?? 0) * 0.2) + (i.hasKits ? 10 : 0)
  ));

  return { entityType: i.entityType, entityId: i.entityId, intent, commercialPriority, signals };
}

export function calculateCommercialPriority(items: BusinessIntentInput[]): BusinessIntentResult[] {
  return items.map(calculateBusinessIntent).sort((a, b) => b.commercialPriority - a.commercialPriority);
}

export function detectUnderMonetizedClusters(items: BusinessIntentInput[]): BusinessIntentResult[] {
  return items
    .map(calculateBusinessIntent)
    .filter((x) => x.intent === "informational" && (items.find((i) => i.entityId === x.entityId)?.authorityScore ?? 0) >= 60)
    .sort((a, b) => b.commercialPriority - a.commercialPriority);
}
