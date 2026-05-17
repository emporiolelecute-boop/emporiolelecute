/**
 * Fase 15 — Explainability Engine.
 * Builds human-readable explanations for metrics, verdicts and decisions.
 */
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export interface MetricExplanation {
  key: string;
  value: number;
  description: string;
  contributors: Array<{ key: string; value: number; weight: number }>;
  confidence: number;
}

export function explainMetric(
  key: string,
  value: number,
  contributors: Array<{ key: string; value: number; weight: number }>,
  description = "",
): MetricExplanation {
  const totalWeight = contributors.reduce((a, c) => a + c.weight, 0) || 1;
  const weighted = contributors.reduce((a, c) => a + c.value * (c.weight / totalWeight), 0);
  const drift = Math.abs(weighted - value);
  const confidence = clamp(100 - drift);
  return { key, value, description, contributors, confidence };
}

export function explainVerdict(verdict: string, score: number, drivers: string[]): string {
  const head = `Veredito ${verdict} com score ${score}.`;
  if (drivers.length === 0) return head;
  return `${head} Drivers: ${drivers.slice(0, 5).join("; ")}.`;
}

export function explainEngineDecision(engine: string, output: number, reasons: string[]): string {
  return `${engine} produziu ${output}. Razões: ${reasons.slice(0, 5).join("; ") || "—"}.`;
}

export function buildConfidenceExplanation(explanations: MetricExplanation[]): {
  averageConfidence: number;
  lowConfidence: string[];
} {
  if (explanations.length === 0) return { averageConfidence: 0, lowConfidence: [] };
  const avg = clamp(explanations.reduce((a, e) => a + e.confidence, 0) / explanations.length);
  const low = explanations.filter((e) => e.confidence < 60).map((e) => e.key);
  return { averageConfidence: avg, lowConfidence: low };
}

export function calculateExplainabilityScore(explanations: MetricExplanation[]): number {
  if (explanations.length === 0) return 0;
  const conf = buildConfidenceExplanation(explanations).averageConfidence;
  const documented = explanations.filter((e) => e.description.length > 0).length / explanations.length;
  return clamp(conf * 0.6 + documented * 100 * 0.4);
}

export function detectOpaqueMetrics(explanations: MetricExplanation[]): string[] {
  const out: string[] = [];
  for (const e of explanations) {
    if (e.contributors.length === 0 || e.description.length === 0) out.push(e.key);
  }
  return out;
}
