/**
 * Fase 10.5 — Indexation Governance.
 *
 * Camada FINAL de decisão "esta página pode/deve ser indexada?".
 * Não muda nada por si só: produz veredictos consumidos pelo sitemap,
 * pelo Authority Center e pelos badges admin.
 *
 * SAFE MODE: padrões duros — qualquer dúvida resulta em bloqueio.
 */

export type CannibalRisk = "none" | "low" | "medium" | "high" | "unknown";

export type SeoVerdict = "EXCELLENT" | "STRONG" | "MEDIUM" | "WEAK" | "BLOCKED";

export interface IndexableEntity {
  // identidade
  id?: string;
  slug?: string;
  // flags de curadoria
  approved?: boolean;
  is_indexed?: boolean;
  // scores
  authority_score?: number;
  readiness_score?: number;
  topical_coverage?: number;
  // governança
  thin_content_risk?: boolean;
  cannibalization_risk?: CannibalRisk;
  authority_manipulation?: boolean;
  // sinais
  internal_links_count?: number;
  products_count?: number;
  editorial_length?: number;
  faq_count?: number;
}

export interface GovernanceResult {
  allowed: boolean;
  reasons: string[];
}

const n = (v: number | undefined | null): number => (typeof v === "number" ? v : 0);

/**
 * canBeIndexed — pode receber meta robots index,follow?
 */
export function canBeIndexed(e: IndexableEntity): GovernanceResult {
  const reasons: string[] = [];
  if (!e.approved) reasons.push("Não aprovado pela curadoria");
  if (e.is_indexed === false) reasons.push("is_indexed=false");
  if (n(e.readiness_score) < 75) reasons.push(`readiness ${n(e.readiness_score)} < 75`);
  if (n(e.topical_coverage) < 60) reasons.push(`topical_coverage ${n(e.topical_coverage)} < 60`);
  if (e.thin_content_risk) reasons.push("thin content");
  if (e.cannibalization_risk === "high") reasons.push("canibalização alta");
  if (e.authority_manipulation) reasons.push("authority manipulation");
  if (n(e.internal_links_count) < 3) reasons.push(`internal_links ${n(e.internal_links_count)} < 3`);
  return { allowed: reasons.length === 0, reasons };
}

/**
 * canEnterSitemap — gate ULTRA rígido para sitemap.
 * Só páginas verdadeiramente premium passam.
 */
export function canEnterSitemap(e: IndexableEntity): GovernanceResult {
  const base = canBeIndexed(e);
  const reasons = [...base.reasons];
  if (n(e.authority_score) < 80) reasons.push(`authority ${n(e.authority_score)} < 80`);
  if (n(e.products_count) < 8) reasons.push(`produtos ${n(e.products_count)} < 8`);
  if (n(e.editorial_length) < 500) reasons.push(`editorial ${n(e.editorial_length)} < 500 chars`);
  if (n(e.faq_count) < 2) reasons.push(`faqs ${n(e.faq_count)} < 2`);
  return { allowed: reasons.length === 0, reasons };
}

/**
 * Classificação editorial agregada.
 */
export function buildSeoVerdict(e: IndexableEntity): SeoVerdict {
  if (e.thin_content_risk || e.cannibalization_risk === "high" || e.authority_manipulation) {
    return "BLOCKED";
  }
  const r = n(e.readiness_score);
  const a = n(e.authority_score);
  if (r >= 90 && a >= 85) return "EXCELLENT";
  if (r >= 75 && a >= 75) return "STRONG";
  if (r >= 60) return "MEDIUM";
  if (r >= 40) return "WEAK";
  return "BLOCKED";
}

export function verdictLabel(v: SeoVerdict): string {
  switch (v) {
    case "EXCELLENT": return "Excelente";
    case "STRONG":    return "Forte";
    case "MEDIUM":    return "Médio";
    case "WEAK":      return "Fraco";
    case "BLOCKED":   return "Bloqueado";
  }
}
