/**
 * Fase 13.3 — Operational Waste Detection.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type WasteSeverity = "minimal" | "controlled" | "elevated" | "severe";

export interface WasteItem {
  area: "execution" | "low_impact" | "duplicate" | "semantic" | "authority" | "editorial";
  title: string;
  description: string;
  severity: WasteSeverity;
  cost: number;
}

const v = (x?: number) => (typeof x === "number" ? x : 0);
const sev = (n: number): WasteSeverity =>
  n >= 75 ? "severe" : n >= 50 ? "elevated" : n >= 25 ? "controlled" : "minimal";

export function detectWastedExecution(t: TelemetrySnapshot): WasteItem[] {
  const out: WasteItem[] = [];
  if (v(t.execution_efficiency) < 50) {
    const cost = 100 - v(t.execution_efficiency);
    out.push({ area: "execution", title: "Execução pouco eficiente", description: "ROI baixo por unidade de esforço.", severity: sev(cost), cost });
  }
  return out;
}

export function detectLowImpactActions(t: TelemetrySnapshot): WasteItem[] {
  const out: WasteItem[] = [];
  if (v(t.semantic_roi_avg) < 40 && v(t.editorial_maturity_avg) >= 50) {
    const cost = 100 - v(t.semantic_roi_avg);
    out.push({ area: "low_impact", title: "Ações de baixo impacto", description: "Conteúdo maduro mas com ROI semântico abaixo da média.", severity: sev(cost), cost });
  }
  return out;
}

export function detectDuplicateEfforts(t: TelemetrySnapshot): WasteItem[] {
  const out: WasteItem[] = [];
  if (v(t.cannibalized) > 0) {
    const cost = Math.min(100, v(t.cannibalized) * 10);
    out.push({ area: "duplicate", title: "Canibalização ativa", description: `${t.cannibalized} entidades competem entre si.`, severity: sev(cost), cost });
  }
  return out;
}

export function detectSemanticWaste(t: TelemetrySnapshot): WasteItem[] {
  const out: WasteItem[] = [];
  if (v(t.overlinked_pages) > 0) {
    const cost = Math.min(100, v(t.overlinked_pages) * 6);
    out.push({ area: "semantic", title: "Overlinking", description: `${t.overlinked_pages} páginas saturadas de links.`, severity: sev(cost), cost });
  }
  if (v(t.semantic_loop_count) > 0) {
    const cost = Math.min(100, v(t.semantic_loop_count) * 8);
    out.push({ area: "semantic", title: "Loops semânticos", description: `${t.semantic_loop_count} loops detectados no grafo.`, severity: sev(cost), cost });
  }
  return out;
}

export function detectAuthorityWaste(t: TelemetrySnapshot): WasteItem[] {
  const out: WasteItem[] = [];
  if (v(t.authority_dependency_risk) > 50) {
    const cost = v(t.authority_dependency_risk);
    out.push({ area: "authority", title: "Hubs concentrados", description: "Autoridade depende de poucas entidades.", severity: sev(cost), cost });
  }
  return out;
}

export function detectEditorialWaste(t: TelemetrySnapshot): WasteItem[] {
  const out: WasteItem[] = [];
  if (v(t.thinContent) > 0) {
    const cost = Math.min(100, v(t.thinContent) * 5);
    out.push({ area: "editorial", title: "Thin content", description: `${t.thinContent} entidades rasas.`, severity: sev(cost), cost });
  }
  return out;
}

export function buildWasteMap(t: TelemetrySnapshot): WasteItem[] {
  return [
    ...detectWastedExecution(t),
    ...detectLowImpactActions(t),
    ...detectDuplicateEfforts(t),
    ...detectSemanticWaste(t),
    ...detectAuthorityWaste(t),
    ...detectEditorialWaste(t),
  ].sort((a, b) => b.cost - a.cost);
}
