/**
 * Fase 13 — Impact Simulator.
 * Simulações lineares heurísticas. Não altera dados reais.
 */

export interface SimulationInput {
  currentAuthority: number;
  currentCoverage: number;
  currentReadiness: number;
  currentMaturity?: number;
  currentLinks?: number;
  currentFaqs?: number;
  currentReviews?: number;
  editorialSize?: number;
}

export interface SimulationResult {
  scenario: string;
  currentScore: number;
  projectedScore: number;
  projectedAuthority: number;
  projectedCoverage: number;
  projectedReadiness: number;
  estimatedImpact: number;
  confidence: number;
}

function clamp(v: number) { return Math.max(0, Math.min(100, Math.round(v))); }

function build(scenario: string, i: SimulationInput, gainAuthority: number, gainCoverage: number, gainReadiness: number, confidence: number): SimulationResult {
  const projectedAuthority = clamp(i.currentAuthority + gainAuthority);
  const projectedCoverage  = clamp(i.currentCoverage  + gainCoverage);
  const projectedReadiness = clamp(i.currentReadiness + gainReadiness);
  const currentScore = Math.round((i.currentAuthority + i.currentCoverage + i.currentReadiness) / 3);
  const projectedScore = Math.round((projectedAuthority + projectedCoverage + projectedReadiness) / 3);
  return {
    scenario, currentScore, projectedScore,
    projectedAuthority, projectedCoverage, projectedReadiness,
    estimatedImpact: projectedScore - currentScore, confidence,
  };
}

export function simulateEditorialExpansion(i: SimulationInput, addedChars = 600): SimulationResult {
  const factor = Math.min(1, addedChars / 1200);
  return build("editorial_expansion", i, 6 * factor, 10 * factor, 8 * factor, 75);
}

export function simulateInternalLinks(i: SimulationInput, addedLinks = 5): SimulationResult {
  const factor = Math.min(1, addedLinks / 10);
  return build("internal_links", i, 8 * factor, 4 * factor, 6 * factor, 80);
}

export function simulateFaqCoverage(i: SimulationInput, addedFaqs = 3): SimulationResult {
  const factor = Math.min(1, addedFaqs / 6);
  return build("faq_coverage", i, 4 * factor, 8 * factor, 10 * factor, 70);
}

export function simulateReviewGrowth(i: SimulationInput, addedReviews = 5): SimulationResult {
  const factor = Math.min(1, addedReviews / 10);
  return build("review_growth", i, 5 * factor, 2 * factor, 6 * factor, 65);
}

export function simulateHubStrengthening(i: SimulationInput): SimulationResult {
  return build("hub_strengthening", i, 12, 14, 10, 60);
}
