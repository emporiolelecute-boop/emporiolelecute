import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import UnifiedBusScoreCard from "@/components/admin/UnifiedBusScoreCard";
import EngineConsensusMatrix from "@/components/admin/EngineConsensusMatrix";
import ObservabilityCoverageMap from "@/components/admin/ObservabilityCoverageMap";
import AnomalyDetectionPanel from "@/components/admin/AnomalyDetectionPanel";
import GovernanceConvergenceGauge from "@/components/admin/GovernanceConvergenceGauge";
import MetricVarianceHeatmap from "@/components/admin/MetricVarianceHeatmap";
import ExplainabilityTracePanel from "@/components/admin/ExplainabilityTracePanel";
import StrategicAlignmentRadar from "@/components/admin/StrategicAlignmentRadar";
import CrossEngineConflictPanel from "@/components/admin/CrossEngineConflictPanel";
import SystemIntegrityCard from "@/components/admin/SystemIntegrityCard";

import type { TelemetrySnapshot } from "@/lib/seoTelemetry";
import { buildUnifiedIntelligenceBus, detectMetricVariance } from "@/lib/unifiedIntelligenceBus";
import {
  calculateConsensus, detectEngineDivergence, detectTelemetryNoise,
  buildConsensusMatrix, type EngineSignal,
} from "@/lib/engineConsensus";
import {
  buildObservabilityMatrix, calculateBlindspotRisk, detectUnobservedAreas,
  detectTelemetryFragmentation, detectMonitoringWeakness, buildHealthHeatmap,
  type ObservabilityCell,
} from "@/lib/observabilityMatrix";
import {
  detectAnomalies, classifyAnomalyRisk,
} from "@/lib/anomalyDetection";
import { buildGovernanceMap } from "@/lib/governanceConvergence";
import {
  explainAuthorityCalculation, explainEntropyCalculation, explainRiskCalculation,
} from "@/lib/explainabilityKernel";

const MOCK_T: Partial<TelemetrySnapshot> = {
  operational_score: 68, execution_efficiency: 66, operational_debt_score: 28,
  meta_intelligence_score: 70, strategic_awareness_score: 68,
  kernel_coherence_score: 72, explainability_score: 65,
  governance_score: 72, governance_drift_score: 26,
  strategic_governability_score: 70, systemic_consistency_score: 68,
  semantic_stability_score: 72, semantic_cohesion_score: 70,
  semantic_continuity_score: 68, semantic_drift_score: 24,
  authority_distribution_score: 70, authority_persistence_score: 72,
  authority_balance_score: 68, authority_entropy: 30,
  resilience_score: 70, collapse_resistance_score: 68,
  resilience_forecast_score: 66, recovery_continuity_score: 65,
  continuity_depth_score: 68, execution_continuity_score: 70,
  long_horizon_survivability_score: 65, sustainability_continuity_score: 67,
  systemic_noise_score: 22, strategic_noise_score: 25,
  operational_noise_score: 24, false_growth_signal_score: 18,
  lineage_integrity_score: 75, tracing_coverage_score: 70,
  confidence_integrity_score: 72, strategic_alignment_score: 70,
};

const MOCK_SIGNALS: EngineSignal[] = [
  { engine_key: "authorityEngine", domain: "authority", metric: "authority_score", value: 70 },
  { engine_key: "authorityForecast", domain: "authority", metric: "authority_score", value: 66 },
  { engine_key: "semanticGraph", domain: "semantic", metric: "semantic_stability", value: 72 },
  { engine_key: "semanticOrchestrator", domain: "semantic", metric: "semantic_stability", value: 64 },
  { engine_key: "metaGovernance", domain: "governance", metric: "governance_score", value: 72 },
  { engine_key: "governanceConvergence", domain: "governance", metric: "governance_score", value: 68 },
  { engine_key: "resilienceEngine", domain: "resilience", metric: "resilience_score", value: 70 },
  { engine_key: "futureResilience", domain: "resilience", metric: "resilience_score", value: 60 },
];

const MOCK_OBS: ObservabilityCell[] = [
  { domain: "authority", metric: "authority_score", covered: true, confidence: 80 },
  { domain: "authority", metric: "authority_persistence", covered: true, confidence: 75 },
  { domain: "semantic", metric: "semantic_stability", covered: true, confidence: 78 },
  { domain: "semantic", metric: "semantic_drift", covered: true, confidence: 65 },
  { domain: "governance", metric: "governance_score", covered: true, confidence: 80 },
  { domain: "governance", metric: "governance_drift", covered: true, confidence: 70 },
  { domain: "resilience", metric: "resilience_score", covered: true, confidence: 72 },
  { domain: "continuity", metric: "long_horizon", covered: false, confidence: 0 },
  { domain: "explainability", metric: "lineage_integrity", covered: true, confidence: 75 },
  { domain: "execution", metric: "bottleneck_score", covered: true, confidence: 60 },
];

export default function AdminSeoUnifiedIntelligence() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const bus = useMemo(() => buildUnifiedIntelligenceBus(MOCK_T), []);
  const consensus = useMemo(() => calculateConsensus(MOCK_SIGNALS), []);
  const divergences = useMemo(() => detectEngineDivergence(MOCK_SIGNALS), []);
  const noise = useMemo(() => detectTelemetryNoise(MOCK_SIGNALS), []);
  const matrix = useMemo(() => buildConsensusMatrix(MOCK_SIGNALS), []);
  const obs = useMemo(() => buildObservabilityMatrix(MOCK_OBS), []);
  const blindspots = useMemo(() => detectUnobservedAreas(obs), [obs]);
  const heatmap = useMemo(() => buildHealthHeatmap(MOCK_OBS), []);
  const blindspotRisk = useMemo(() => calculateBlindspotRisk(obs), [obs]);
  const fragmentation = useMemo(() => detectTelemetryFragmentation(MOCK_OBS), []);
  const monitoringWeak = useMemo(() => detectMonitoringWeakness(obs), [obs]);
  const anomalies = useMemo(
    () => detectAnomalies(MOCK_T, {
      authority_score: [70, 68, 66, 50],
      governance_score: [72, 71, 70, 68],
    }),
    [],
  );
  const anomalyRisk = useMemo(() => classifyAnomalyRisk(anomalies), [anomalies]);
  const variance = useMemo(
    () =>
      detectMetricVariance({
        authority_score: [70, 66, 64],
        semantic_stability: [72, 64, 60],
        governance_score: [72, 68, 66],
        resilience_score: [70, 60, 58],
      }),
    [],
  );
  const govMap = useMemo(() => buildGovernanceMap(MOCK_T), []);
  const conflicts = useMemo(() => [...divergences, ...noise], [divergences, noise]);
  const traces = useMemo(
    () => [
      explainAuthorityCalculation(bus.scores.kernel_score, ["meta_intelligence", "explainability"]),
      explainEntropyCalculation(bus.scores.entropy_score, ["noise", "drift"]),
      explainRiskCalculation(bus.scores.anomaly_score, ["systemic_noise"]),
    ],
    [bus],
  );

  const handleCapture = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.from("seo_unified_bus_snapshots").insert({
        operational_signature: bus.signatures.operational,
        intelligence_signature: bus.signatures.intelligence,
        governance_signature: bus.signatures.governance,
        semantic_signature: bus.signatures.semantic,
        authority_signature: bus.signatures.authority,
        resilience_signature: bus.signatures.resilience,
        continuity_signature: bus.signatures.continuity,
        anomaly_signature: bus.signatures.anomaly,
        explainability_signature: bus.signatures.explainability,
        kernel_score: bus.scores.kernel_score,
        coherence_score: bus.scores.coherence_score,
        resilience_score: bus.scores.resilience_score,
        entropy_score: bus.scores.entropy_score,
        observability_score: bus.scores.observability_score,
        anomaly_score: bus.scores.anomaly_score,
        governance_score: bus.scores.governance_score,
        system_consistency_score: bus.scores.system_consistency_score,
        future_viability_score: bus.scores.future_viability_score,
        notes: `verdict=${bus.verdict}; consensus=${consensus}`,
      });
      if (error) throw error;
      toast({ title: "Snapshot capturado", description: "Unified bus snapshot salvo." });
    } catch (e) {
      toast({
        title: "Erro ao salvar snapshot",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">SEO Unified Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Camada unificada de inteligência operacional — SAFE MODE absoluto, read-only.
          </p>
        </div>
        <Button onClick={handleCapture} disabled={saving}>
          {saving ? "Salvando…" : "Capture Unified Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        <Card className="p-3"><p className="text-xs text-muted-foreground">Unified Bus</p><p className="text-2xl font-bold">{bus.scores.kernel_score}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Consensus</p><p className="text-2xl font-bold">{consensus}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Governance</p><p className="text-2xl font-bold">{bus.scores.governance_score}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Observability</p><p className="text-2xl font-bold">{bus.scores.observability_score}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Anomaly Risk</p><p className="text-2xl font-bold">{anomalyRisk}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Integrity</p><p className="text-2xl font-bold">{bus.scores.system_consistency_score}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Future Viability</p><p className="text-2xl font-bold">{bus.scores.future_viability_score}</p></Card>
      </div>

      <Tabs defaultValue="bus">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="bus">Unified Bus</TabsTrigger>
          <TabsTrigger value="consensus">Consensus</TabsTrigger>
          <TabsTrigger value="observability">Observability</TabsTrigger>
          <TabsTrigger value="explainability">Explainability</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="alignment">Alignment</TabsTrigger>
          <TabsTrigger value="variance">Variance</TabsTrigger>
          <TabsTrigger value="blindspots">Blindspots</TabsTrigger>
          <TabsTrigger value="integrity">Integrity</TabsTrigger>
          <TabsTrigger value="executive">Executive</TabsTrigger>
        </TabsList>

        <TabsContent value="bus" className="mt-4">
          <UnifiedBusScoreCard score={bus.scores.kernel_score} verdict={bus.verdict} reasons={bus.reasons} />
        </TabsContent>
        <TabsContent value="consensus" className="mt-4">
          <EngineConsensusMatrix cells={matrix} />
        </TabsContent>
        <TabsContent value="observability" className="mt-4">
          <ObservabilityCoverageMap coverage={obs.coverage_pct} blindspots={blindspots} heatmap={heatmap} />
        </TabsContent>
        <TabsContent value="explainability" className="mt-4">
          <ExplainabilityTracePanel traces={traces} />
        </TabsContent>
        <TabsContent value="governance" className="mt-4">
          <GovernanceConvergenceGauge convergence={govMap.convergence} drift={govMap.drift} alerts={govMap.alerts} />
        </TabsContent>
        <TabsContent value="conflicts" className="mt-4">
          <CrossEngineConflictPanel conflicts={conflicts} />
        </TabsContent>
        <TabsContent value="anomalies" className="mt-4">
          <AnomalyDetectionPanel anomalies={anomalies} riskScore={anomalyRisk} />
        </TabsContent>
        <TabsContent value="alignment" className="mt-4">
          <StrategicAlignmentRadar
            alignment={bus.scores.alignment_score}
            consensus={bus.scores.consensus_score}
            coherence={bus.scores.coherence_score}
          />
        </TabsContent>
        <TabsContent value="variance" className="mt-4">
          <MetricVarianceHeatmap variances={variance} />
        </TabsContent>
        <TabsContent value="blindspots" className="mt-4">
          <Card className="p-4 space-y-2">
            <p className="text-base font-medium">Blindspots</p>
            <p className="text-xs text-muted-foreground">Risco de blindspot: {blindspotRisk}</p>
            <p className="text-xs text-muted-foreground">Fragmentação: {fragmentation}</p>
            <p className="text-xs text-muted-foreground">Fraqueza de monitoramento: {monitoringWeak}</p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">
              {blindspots.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </Card>
        </TabsContent>
        <TabsContent value="integrity" className="mt-4">
          <SystemIntegrityCard
            integrity={bus.scores.system_consistency_score}
            viability={bus.scores.future_viability_score}
            entropy={bus.scores.entropy_score}
          />
        </TabsContent>
        <TabsContent value="executive" className="mt-4">
          <Card className="p-4 space-y-2">
            <p className="text-base font-medium">Executive Summary</p>
            <p className="text-xs text-muted-foreground">
              Verdict: <span className="font-mono">{bus.verdict}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Fingerprints — operational: {bus.fingerprints.operational}; strategic: {bus.fingerprints.strategic}; evolution: {bus.fingerprints.evolution}.
            </p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">
              {bus.reasons.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
