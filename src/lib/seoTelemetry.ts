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
  // Fase 11.1 — métricas de linking
  total_contextual_links: number;
  avg_links_per_page: number;
  overlinked_pages: number;
  orphan_entities: number;
  authority_flow_score: number;
  semantic_connectivity_score: number;
  // Fase 11.2 — métricas editoriais
  editorial_maturity_avg: number;
  thematic_depth_avg: number;
  semantic_coverage_avg: number;
  faq_coverage: number;          // % com FAQ
  review_coverage: number;       // % com reviews
  internal_link_quality: number; // 0..100
  orphan_cluster_count: number;
  content_gap_count: number;
  // Fase 12 — knowledge graph + memória
  knowledge_health_score: number;
  authority_distribution_score: number;
  semantic_loop_count: number;
  regression_risk_score: number;
  content_decay_score: number;
  cluster_growth_score: number;
  orphan_recovery_rate: number;
  // Fase 13 — decision/intent/forecast
  semantic_roi_avg: number;
  authority_growth_projection: number;
  execution_efficiency: number;
  quick_win_score: number;
  business_intent_score: number;
  fragile_cluster_count: number;
  authority_dependency_risk: number;
  under_monetized_score: number;
  // Fase 13.1 — autonomy layer
  semantic_stability_score: number;
  saturation_score: number;
  cluster_dependency_score: number;
  authority_entropy: number;
  commercial_diversity_score: number;
  strategic_consistency_score: number;
  volatility_score: number;
  recovery_difficulty_avg: number;
  semantic_balance_score: number;
  overcentralization_risk: number;
  topic_exhaustion_score: number;
  momentum_growth_score: number;
  // Fase 13.2 — operating system
  operational_score: number;
  execution_capacity_score: number;
  editorial_velocity_score: number;
  semantic_velocity_score: number;
  authority_velocity_score: number;
  operational_debt_score: number;
  fragmentation_score: number;
  risk_pressure_score: number;
  bottleneck_score: number;
  recovery_capacity_score: number;
  maintenance_pressure_score: number;
  execution_efficiency_score: number;
  cluster_resilience_score: number;
  semantic_resilience_score: number;
  // Fase 13.3 — control tower
  system_health_score: number;
  sustainability_score: number;
  // execution_efficiency reused from Fase 13
  semantic_efficiency: number;
  authority_efficiency: number;
  operational_waste_score: number;
  execution_focus_score: number;
  execution_noise_score: number;
  strategic_alignment_score: number;
  semantic_fatigue_score: number;
  maintenance_explosion_risk: number;
  collapse_risk_score: number;
  resilience_score: number;
  cascade_failure_risk: number;
  recovery_elasticity: number;
  strategic_fatigue_score: number;
  // Fase 14 — simulation / digital twin
  simulation_readiness_score: number;
  future_stability_score: number;
  digital_twin_accuracy: number;
  strategic_resilience_forecast: number;
  long_term_decay_risk: number;
  cluster_failure_probability: number;
  operational_stress_score: number;
  projected_growth_score: number;
  projected_roi_score: number;
  sustainability_forecast: number;
  authority_compounding_score: number;
  recovery_projection_score: number;
}

export interface AutonomyTelemetryInput {
  semanticStability?: number;
  saturation?: number;
  clusterDependency?: number;
  authorityEntropy?: number;
  commercialDiversity?: number;
  strategicConsistency?: number;
  volatility?: number;
  recoveryDifficulty?: number;
  semanticBalance?: number;
  overcentralizationRisk?: number;
  topicExhaustion?: number;
  momentumGrowth?: number;
}

export interface KnowledgeTelemetryInput {
  knowledgeHealth?: number;
  authorityDistribution?: number;
  semanticLoops?: number;
  regressionRisk?: number;
  contentDecay?: number;
  clusterGrowth?: number;
  orphanRecoveryRate?: number;
}

export interface DecisionTelemetryInput {
  semanticROIAvg?: number;
  authorityGrowthProjection?: number;
  executionEfficiency?: number;
  quickWinScore?: number;
  businessIntentScore?: number;
  fragileClusterCount?: number;
  authorityDependencyRisk?: number;
  underMonetizedScore?: number;
}

function avg(vals: number[]): number {
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export interface LinkingTelemetryInput {
  /** total de links contextuais renderizados (somatório por página). */
  totalLinks?: number;
  /** páginas com overlinking detectado. */
  overlinkedPages?: number;
  /** entidades indexáveis sem links internos suficientes. */
  orphanEntities?: number;
}

export interface EditorialTelemetryInput {
  maturities?: number[];        // editorial maturity scores
  thematicDepths?: number[];    // theme maturity scores
  semanticCoverages?: number[]; // topical coverage scores
  faqCount?: number;            // entidades com FAQ
  reviewCount?: number;         // entidades com reviews
  orphanClusters?: number;
  contentGaps?: number;
}

export function computeTelemetry(
  items: IndexableEntity[],
  linking?: LinkingTelemetryInput,
  editorial?: EditorialTelemetryInput,
  knowledge?: KnowledgeTelemetryInput,
  decision?: DecisionTelemetryInput,
  autonomy?: AutonomyTelemetryInput,
): TelemetrySnapshot {
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
  const linkCounts: number[] = [];

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
    if (typeof e.internal_links_count === "number") linkCounts.push(e.internal_links_count);
  }

  const total = items.length;
  const total_contextual_links = linking?.totalLinks ?? linkCounts.reduce((a, b) => a + b, 0);
  const avg_links_per_page = total > 0 ? Math.round((total_contextual_links / total) * 10) / 10 : 0;
  const orphan_entities = linking?.orphanEntities ?? orphan;
  const overlinked_pages = linking?.overlinkedPages ?? 0;

  // Authority flow: média de autoridade ponderada pela presença de links.
  const flow = total > 0
    ? Math.round(
        (avg(authorities) * 0.6) +
        (Math.min(100, avg_links_per_page * 10) * 0.4)
      )
    : 0;

  // Conectividade semântica: % de entidades com pelo menos 3 links internos.
  const connected = items.filter((e) => (e.internal_links_count ?? 0) >= 3).length;
  const semantic_connectivity_score = total > 0 ? Math.round((connected / total) * 100) : 0;

  return {
    total,
    indexable,
    blocked,
    thinContent,
    cannibalized,
    sitemapCandidates,
    orphan,
    averageAuthority: avg(authorities),
    averageReadiness: avg(readinesses),
    verdicts,
    total_contextual_links,
    avg_links_per_page,
    overlinked_pages,
    orphan_entities,
    authority_flow_score: flow,
    semantic_connectivity_score,
    editorial_maturity_avg: avg(editorial?.maturities ?? []),
    thematic_depth_avg: avg(editorial?.thematicDepths ?? []),
    semantic_coverage_avg: avg(editorial?.semanticCoverages ?? readinesses.length ? readinesses : []),
    faq_coverage: total > 0 ? Math.round(((editorial?.faqCount ?? 0) / total) * 100) : 0,
    review_coverage: total > 0 ? Math.round(((editorial?.reviewCount ?? 0) / total) * 100) : 0,
    internal_link_quality: Math.min(100, Math.round(avg_links_per_page * 12)),
    orphan_cluster_count: editorial?.orphanClusters ?? 0,
    content_gap_count: editorial?.contentGaps ?? 0,
    knowledge_health_score:       knowledge?.knowledgeHealth ?? 0,
    authority_distribution_score: knowledge?.authorityDistribution ?? 0,
    semantic_loop_count:          knowledge?.semanticLoops ?? 0,
    regression_risk_score:        knowledge?.regressionRisk ?? 0,
    content_decay_score:          knowledge?.contentDecay ?? 0,
    cluster_growth_score:         knowledge?.clusterGrowth ?? 0,
    orphan_recovery_rate:         knowledge?.orphanRecoveryRate ?? 0,
    semantic_roi_avg:             decision?.semanticROIAvg ?? 0,
    authority_growth_projection:  decision?.authorityGrowthProjection ?? 0,
    execution_efficiency:         decision?.executionEfficiency ?? 0,
    quick_win_score:              decision?.quickWinScore ?? 0,
    business_intent_score:        decision?.businessIntentScore ?? 0,
    fragile_cluster_count:        decision?.fragileClusterCount ?? 0,
    authority_dependency_risk:    decision?.authorityDependencyRisk ?? 0,
    under_monetized_score:        decision?.underMonetizedScore ?? 0,
    semantic_stability_score:     autonomy?.semanticStability ?? 0,
    saturation_score:             autonomy?.saturation ?? 0,
    cluster_dependency_score:     autonomy?.clusterDependency ?? 0,
    authority_entropy:            autonomy?.authorityEntropy ?? 0,
    commercial_diversity_score:   autonomy?.commercialDiversity ?? 0,
    strategic_consistency_score:  autonomy?.strategicConsistency ?? 0,
    volatility_score:             autonomy?.volatility ?? 0,
    recovery_difficulty_avg:      autonomy?.recoveryDifficulty ?? 0,
    semantic_balance_score:       autonomy?.semanticBalance ?? 0,
    overcentralization_risk:      autonomy?.overcentralizationRisk ?? 0,
    topic_exhaustion_score:       autonomy?.topicExhaustion ?? 0,
    momentum_growth_score:        autonomy?.momentumGrowth ?? 0,
    operational_score: 0,
    execution_capacity_score: 0,
    editorial_velocity_score: 0,
    semantic_velocity_score: 0,
    authority_velocity_score: 0,
    operational_debt_score: 0,
    fragmentation_score: 0,
    risk_pressure_score: 0,
    bottleneck_score: 0,
    recovery_capacity_score: 0,
    maintenance_pressure_score: 0,
    execution_efficiency_score: 0,
    cluster_resilience_score: 0,
    semantic_resilience_score: 0,
    system_health_score: 0,
    sustainability_score: 0,
    semantic_efficiency: 0,
    authority_efficiency: 0,
    operational_waste_score: 0,
    execution_focus_score: 0,
    execution_noise_score: 0,
    strategic_alignment_score: 0,
    semantic_fatigue_score: 0,
    maintenance_explosion_risk: 0,
    collapse_risk_score: 0,
    resilience_score: 0,
    cascade_failure_risk: 0,
    recovery_elasticity: 0,
    strategic_fatigue_score: 0,
    simulation_readiness_score: 0,
    future_stability_score: 0,
    digital_twin_accuracy: 0,
    strategic_resilience_forecast: 0,
    long_term_decay_risk: 0,
    cluster_failure_probability: 0,
    operational_stress_score: 0,
    projected_growth_score: 0,
    projected_roi_score: 0,
    sustainability_forecast: 0,
    authority_compounding_score: 0,
    recovery_projection_score: 0,
  };
}
