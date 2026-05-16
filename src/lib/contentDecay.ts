/**
 * Fase 12 — Content Decay Engine.
 * Avalia o quanto uma entidade está envelhecendo sem evolução semântica/editorial.
 */

export type DecayStatus = "Fresh" | "Stable" | "Aging" | "Decaying" | "Critical";

export interface DecayInput {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;
  lastEditedAt?: string | null;   // ISO
  lastSnapshotAt?: string | null; // ISO
  authority?: number;             // 0..100
  authorityTrend?: number;        // delta últimas 4 semanas
  linksTrend?: number;
  reviewsTrend?: number;
  hasRecentBlog?: boolean;
  editorialLength?: number;
}

export interface DecayResult extends Omit<DecayInput, "lastEditedAt" | "lastSnapshotAt"> {
  ageDays: number;
  status: DecayStatus;
  score: number; // 0..100 (maior = mais decaído)
  reasons: string[];
}

function daysSince(iso?: string | null): number {
  if (!iso) return 999;
  const d = new Date(iso).getTime();
  if (isNaN(d)) return 999;
  return Math.max(0, Math.round((Date.now() - d) / 86400000));
}

export function evaluateContentDecay(input: DecayInput): DecayResult {
  const ageDays = daysSince(input.lastEditedAt);
  const reasons: string[] = [];
  let score = 0;

  if (ageDays > 365)      { score += 35; reasons.push(`Sem edição há ${ageDays} dias`); }
  else if (ageDays > 180) { score += 20; reasons.push(`Conteúdo com mais de 6 meses`); }
  else if (ageDays > 90)  { score += 10; }

  if ((input.authorityTrend ?? 0) < 0)  { score += 15; reasons.push("Autoridade em queda"); }
  if ((input.linksTrend ?? 0) < 0)      { score += 10; reasons.push("Perdendo links internos"); }
  if ((input.reviewsTrend ?? 0) < 0)    { score += 5;  reasons.push("Reviews diminuindo"); }
  if (!input.hasRecentBlog)             { score += 10; reasons.push("Sem blog post recente conectado"); }
  if ((input.editorialLength ?? 0) < 300) { score += 15; reasons.push("Editorial curto"); }
  if ((input.authority ?? 0) < 35)      { score += 10; reasons.push("Autoridade baixa"); }

  score = Math.min(100, score);
  const status: DecayStatus =
    score >= 80 ? "Critical" :
    score >= 60 ? "Decaying" :
    score >= 40 ? "Aging" :
    score >= 20 ? "Stable" : "Fresh";

  return { ...input, ageDays, status, score, reasons };
}

export function buildDecayBuckets(results: DecayResult[]) {
  return {
    critical: results.filter((r) => r.status === "Critical"),
    decaying: results.filter((r) => r.status === "Decaying"),
    aging:    results.filter((r) => r.status === "Aging"),
    stable:   results.filter((r) => r.status === "Stable"),
    fresh:    results.filter((r) => r.status === "Fresh"),
  };
}

export function contentDecayScore(results: DecayResult[]): number {
  if (!results.length) return 0;
  return Math.round(results.reduce((a, r) => a + r.score, 0) / results.length);
}
