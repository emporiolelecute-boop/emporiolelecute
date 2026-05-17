/**
 * Phase 16.1 — Semantic Trust Matrix (pure, read-only).
 */
export type TrustLevel = "trusted" | "stable" | "uncertain" | "weak" | "compromised";

export interface SemanticTrustInputs {
  semanticConfidence: number;
  authorityMatch: number;
  trustLeak: number;
  citationStrength: number;
  contradictions: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateSemanticTrust(i: SemanticTrustInputs): number {
  return clamp(
    i.semanticConfidence * 0.35 +
    i.authorityMatch * 0.25 +
    i.citationStrength * 0.2 +
    inv(i.trustLeak) * 0.1 +
    inv(i.contradictions) * 0.1
  );
}

export function detectTrustLeaks(i: SemanticTrustInputs): number {
  return clamp(i.trustLeak);
}

export function detectAuthorityMismatch(i: SemanticTrustInputs): number {
  return inv(i.authorityMatch);
}

export function estimateSemanticConfidence(i: SemanticTrustInputs): number {
  return clamp(i.semanticConfidence);
}

export interface TrustHeatCell { domain: string; trust: number; }

export function buildTrustHeatmap(i: SemanticTrustInputs): TrustHeatCell[] {
  const base = calculateSemanticTrust(i);
  return [
    { domain: "categories", trust: clamp(base + 4) },
    { domain: "products", trust: clamp(base - 2) },
    { domain: "themes", trust: clamp(base + 1) },
    { domain: "combinations", trust: clamp(base - 3) },
    { domain: "blog", trust: clamp(base + 6) },
    { domain: "discovery", trust: clamp(base - 5) },
  ];
}

export function buildSemanticTrustMatrix(i: SemanticTrustInputs) {
  return {
    score: calculateSemanticTrust(i),
    confidence: estimateSemanticConfidence(i),
    leak: detectTrustLeaks(i),
    mismatch: detectAuthorityMismatch(i),
    heatmap: buildTrustHeatmap(i),
  };
}

export function classifyTrust(score: number): TrustLevel {
  if (score >= 85) return "trusted";
  if (score >= 70) return "stable";
  if (score >= 55) return "uncertain";
  if (score >= 40) return "weak";
  return "compromised";
}
