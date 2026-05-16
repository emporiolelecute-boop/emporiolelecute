/**
 * Fase 13 — Content Value Map.
 * Classifica conteúdo por valor real entregue.
 */

export type ContentValueClass =
  | "elite_hub" | "high_value" | "supporting" | "underused" | "low_return" | "ignored_cluster";

export interface ContentValueInput {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;
  authority?: number;
  links?: number;
  coverage?: number;
  editorialSize?: number;
  reviews?: number;
  faqs?: number;
  orphan?: boolean;
  thinContent?: boolean;
}

export interface ContentValueEntry {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;
  valueScore: number;
  band: ContentValueClass;
  reasons: string[];
}

export function buildContentValueMap(items: ContentValueInput[]): ContentValueEntry[] {
  return items.map((i) => {
    const auth = i.authority ?? 0;
    const lk = i.links ?? 0;
    const ed = i.editorialSize ?? 0;
    const cov = i.coverage ?? 0;
    const rv = i.reviews ?? 0;
    const reasons: string[] = [];

    let score = Math.round(auth * 0.4 + cov * 0.25 + Math.min(100, lk * 8) * 0.2 + Math.min(100, ed / 10) * 0.1 + Math.min(100, rv * 8) * 0.05);
    if (i.orphan) { score -= 20; reasons.push("órfã"); }
    if (i.thinContent) { score -= 15; reasons.push("thin content"); }
    score = Math.max(0, Math.min(100, score));

    let band: ContentValueClass = "supporting";
    if (auth >= 80 && cov >= 70 && lk >= 5) band = "elite_hub";
    else if (score >= 65) band = "high_value";
    else if (auth >= 55 && lk <= 2) { band = "underused"; reasons.push("autoridade sem conexão"); }
    else if (score <= 25) band = i.orphan ? "ignored_cluster" : "low_return";

    return {
      entityType: i.entityType, entityId: i.entityId,
      entitySlug: i.entitySlug, entityName: i.entityName,
      valueScore: score, band, reasons,
    };
  }).sort((a, b) => b.valueScore - a.valueScore);
}
