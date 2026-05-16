/**
 * Fase 10.5 — SEO Telemetry.
 *
 * Agregadores síncronos a partir de listas já carregadas.
 * Não executa queries — recebe os datasets do Authority Center.
 */

import { canBeIndexed, canEnterSitemap, buildSeoVerdict, type IndexableEntity, type SeoVerdict } from "./indexationGovernance";

export interface TelemetrySnapshot {
  total: number;
  indexable: number;
  blocked: number;
  thinContent: number;
  cannibalized: number;
  sitemapCandidates: number;
  orphan: number;
  averageAuthority: number;
  averageReadiness: number;
  verdicts: Record<SeoVerdict, number>;
}

function avg(vals: number[]): number {
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function computeTelemetry(items: IndexableEntity[]): TelemetrySnapshot {
  const verdicts: TelemetrySnapshot["verdicts"] = {
    EXCELLENT: 0, STRONG: 0, MEDIUM: 0, WEAK: 0, BLOCKED: 0,
  };
  let indexable = 0;
  let blocked = 0;
  let thinContent = 0;
  let cannibalized = 0;
  let sitemapCandidates = 0;
  let orphan = 0;
  const authorities: number[] = [];
  const readinesses: number[] = [];

  for (const e of items) {
    const v = buildSeoVerdict(e);
    verdicts[v]++;
    if (canBeIndexed(e).allowed) indexable++; else blocked++;
    if (e.thin_content_risk) thinContent++;
    if (e.cannibalization_risk === "high") cannibalized++;
    if (canEnterSitemap(e).allowed) sitemapCandidates++;
    if ((e.internal_links_count ?? 0) === 0) orphan++;
    if (typeof e.authority_score === "number") authorities.push(e.authority_score);
    if (typeof e.readiness_score === "number") readinesses.push(e.readiness_score);
  }

  return {
    total: items.length,
    indexable,
    blocked,
    thinContent,
    cannibalized,
    sitemapCandidates,
    orphan,
    averageAuthority: avg(authorities),
    averageReadiness: avg(readinesses),
    verdicts,
  };
}
