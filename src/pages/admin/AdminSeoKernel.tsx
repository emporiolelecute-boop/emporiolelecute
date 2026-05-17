import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import KernelCoherenceCard from "@/components/admin/KernelCoherenceCard";
import MetricRedundancyMatrix from "@/components/admin/MetricRedundancyMatrix";
import EngineOverlapRadar from "@/components/admin/EngineOverlapRadar";
import ExplainabilityPanel from "@/components/admin/ExplainabilityPanel";
import LineageGraphPanel from "@/components/admin/LineageGraph";
import ConfidenceIntegrityGauge from "@/components/admin/ConfidenceIntegrityGauge";
import TelemetryQualityCard from "@/components/admin/TelemetryQualityCard";
import ObservabilityContractsPanel from "@/components/admin/ObservabilityContractsPanel";
import ArchitecturalEntropyMap from "@/components/admin/ArchitecturalEntropyMap";
import OperationalCompressionGauge from "@/components/admin/OperationalCompressionGauge";

import type { TelemetrySnapshot } from "@/lib/seoTelemetry";
import { buildKernelVerdict, type KernelInputs } from "@/lib/seoKernel";
import {
  buildMetricLineage, calculateLineageIntegrity,
  detectCircularDependencies, detectOrphanMetrics, detectUntraceableMetrics,
} from "@/lib/metricLineage";
import {
  buildEngineDependencyGraph, detectEngineOverlap, detectEngineConflicts,
  detectDuplicateDomains, suggestEngineConsolidation, calculateOrchestrationEfficiency,
  type EngineDescriptor,
} from "@/lib/engineOrchestrator";
import {
  explainMetric, calculateExplainabilityScore, buildConfidenceExplanation, detectOpaqueMetrics,
} from "@/lib/explainabilityEngine";
import {
  validateTelemetryIntegrity, validateLineage, validateConfidenceConsistency,
  detectTelemetryCorruption, detectDiagnosticInconsistency, aggregateObservabilityScore,
} from "@/lib/observabilityContracts";
import {
  detectMetricInflation, calculateNormalizationHealth, type MetricDescriptor,
} from "@/lib/metricNormalization";

const MOCK_T: Partial<TelemetrySnapshot> = {
  operational_score: 68, execution_efficiency: 66, operational_debt_score: 30,
  systemic_synchronization_score: 64, structural_integrity_score: 66,
  governance_score: 68, governance_drift_score: 28,
  survival_confidence_score: 68, collapse_probability_score: 26,
};

// mock engine catalog (representative — additive, no engines were removed)
const MOCK_ENGINES: EngineDescriptor[] = [
  { engine_key: "authorityEngine", domain: "authority", inputs: ["entities"], outputs: ["authority_score", "authority_persistence"], complexity: 55 },
  { engine_key: "authorityForecast", domain: "authority", inputs: ["authority_score"], outputs: ["authority_growth", "authority_persistence"], complexity: 50 },
  { engine_key: "semanticGraph", domain: "semantic", inputs: ["entities"], outputs: ["semantic_connectivity", "semantic_stability"], complexity: 60 },
  { engine_key: "semanticOrchestrator", domain: "semantic", inputs: ["semantic_connectivity"], outputs: ["semantic_stability", "semantic_balance"], complexity: 58 },
  { engine_key: "executionIntelligence", domain: "execution", inputs: ["queue"], outputs: ["execution_efficiency"], complexity: 50 },
  { engine_key: "executionBottlenecks", domain: "execution", inputs: ["queue"], outputs: ["bottleneck_score"], complexity: 45 },
  { engine_key: "resilienceEngine", domain: "resilience", inputs: ["telemetry"], outputs: ["resilience_score"], complexity: 50 },
  { engine_key: "futureResilience", domain: "resilience", inputs: ["telemetry"], outputs: ["resilience_forecast", "resilience_score"], complexity: 55 },
  { engine_key: "consciousnessEngine", domain: "meta", inputs: ["telemetry"], outputs: ["awareness_score"], complexity: 65 },
  { engine_key: "metaIntelligenceEngine", domain: "meta", inputs: ["telemetry"], outputs: ["meta_intelligence_score"], complexity: 70 },
  { engine_key: "civilizationEngine", domain: "civilization", inputs: ["telemetry"], outputs: ["civilization_score"], complexity: 60 },
  { engine_key: "metaGovernance", domain: "governance", inputs: ["telemetry"], outputs: ["governance_score"], complexity: 60 },
];

const MOCK_METRICS: MetricDescriptor[] = [
  { key: "authority_score", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "authority", is_normalized: true },
  { key: "authority_persistence", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "authority", is_normalized: true },
  { key: "authority_growth", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "authority", is_normalized: true },
  { key: "semantic_stability", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "semantic", is_normalized: true },
  { key: "semantic_balance", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "semantic", is_normalized: true },
  { key: "semantic_connectivity", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "semantic", is_normalized: true },
  { key: "execution_efficiency", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "execution", is_normalized: true },
  { key: "bottleneck_score", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "execution", is_normalized: true },
  { key: "resilience_score", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "resilience", is_normalized: true },
  { key: "resilience_forecast", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "resilience", is_normalized: true },
  { key: "awareness_score", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "meta", is_normalized: true },
  { key: "meta_intelligence_score", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "meta", is_normalized: true },
  { key: "civilization_score", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "civilization", is_normalized: true, canonical_metric: true } as any,
  { key: "governance_score", scale_min: 0, scale_max: 100, confidence_weight: 1, redundancy_group: "governance", is_normalized: true, canonical_metric: true } as any,
];

const MOCK_LINEAGE = [
  { metric_key: "authority_score", depends_on: [], derived_from_engines: ["authorityEngine"] },
  { metric_key: "authority_persistence", depends_on: ["authority_score"], derived_from_engines: ["authorityEngine", "authorityForecast"] },
  { metric_key: "authority_growth", depends_on: ["authority_score"], derived_from_engines: ["authorityForecast"] },
  { metric_key: "semantic_stability", depends_on: [], derived_from_engines: ["semanticGraph", "semanticOrchestrator"] },
  { metric_key: "semantic_balance", depends_on: ["semantic_stability"], derived_from_engines: ["semanticOrchestrator"] },
  { metric_key: "semantic_connectivity", depends_on: [], derived_from_engines: ["semanticGraph"] },
  { metric_key: "execution_efficiency", depends_on: [], derived_from_engines: ["executionIntelligence"] },
  { metric_key: "bottleneck_score", depends_on: [], derived_from_engines: ["executionBottlenecks"] },
  { metric_key: "resilience_score", depends_on: [], derived_from_engines: ["resilienceEngine", "futureResilience"] },
  { metric_key: "resilience_forecast", depends_on: ["resilience_score"], derived_from_engines: ["futureResilience"] },
  { metric_key: "awareness_score", depends_on: [], derived_from_engines: ["consciousnessEngine"] },
  { metric_key: "meta_intelligence_score", depends_on: ["awareness_score"], derived_from_engines: ["metaIntelligenceEngine"] },
  { metric_key: "civilization_score", depends_on: ["authority_persistence", "semantic_stability", "resilience_score"], derived_from_engines: ["civilizationEngine"] },
  { metric_key: "governance_score", depends_on: ["authority_persistence", "execution_efficiency"], derived_from_engines: ["metaGovernance"] },
];

export default function AdminSeoKernel() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const data = useMemo(() => {
    const t = MOCK_T as TelemetrySnapshot;
    const engineOverlaps = detectEngineOverlap(MOCK_ENGINES);
    const engineConflicts = detectEngineConflicts(MOCK_ENGINES);
    const duplicates = detectDuplicateDomains(MOCK_ENGINES);
    const consolidation = suggestEngineConsolidation(MOCK_ENGINES);
    const orchestrationEff = calculateOrchestrationEfficiency(MOCK_ENGINES);
    buildEngineDependencyGraph(MOCK_ENGINES);

    const inflation = detectMetricInflation(MOCK_METRICS);
    const normHealth = calculateNormalizationHealth(MOCK_METRICS);
    const redundantCount = Object.values(inflation.perGroup).reduce((a, n) => a + Math.max(0, n - 1), 0);

    const lineage = buildMetricLineage(MOCK_LINEAGE);
    const cycles = detectCircularDependencies(lineage);
    const orphans = detectOrphanMetrics(lineage);
    const untraceable = detectUntraceableMetrics(lineage);
    const lineageIntegrity = calculateLineageIntegrity(lineage);

    const explanations = MOCK_LINEAGE.map((n) =>
      explainMetric(
        n.metric_key,
        70,
        n.depends_on.map((d) => ({ key: d, value: 70, weight: 1 })),
        n.derived_from_engines.length > 0 ? `Derivado de ${n.derived_from_engines.join(", ")}.` : "",
      ),
    );
    const explainability = calculateExplainabilityScore(explanations);
    const conf = buildConfidenceExplanation(explanations);
    const opaque = detectOpaqueMetrics(explanations);

    const kernelInputs: KernelInputs = {
      totalEngines: MOCK_ENGINES.length,
      totalMetrics: MOCK_METRICS.length,
      redundantMetrics: redundantCount,
      overlappingEngines: new Set(engineOverlaps.flatMap((o) => [o.a, o.b])).size,
      deprecatedMetrics: 0,
      opaqueMetrics: opaque.length,
      untraceableMetrics: untraceable.length,
    };
    const kernel = buildKernelVerdict(kernelInputs, t);

    const telemetryContract = validateTelemetryIntegrity(t);
    const lineageContract = validateLineage(lineageIntegrity);
    const confContract = validateConfidenceConsistency(conf.averageConfidence, conf.lowConfidence.length);
    const corruption = detectTelemetryCorruption(t);
    const inconsistencies = detectDiagnosticInconsistency(t);
    const observability = aggregateObservabilityScore([telemetryContract, lineageContract, confContract]);

    const telemetryQuality = Math.round(
      observability * 0.4 +
      lineageIntegrity * 0.3 +
      normHealth * 0.3,
    );

    return {
      t, kernel, kernelInputs, engineOverlaps, engineConflicts, duplicates, consolidation, orchestrationEff,
      inflation, normHealth, redundantCount, lineage, cycles, orphans, untraceable, lineageIntegrity,
      explanations, explainability, conf, opaque,
      telemetryContract, lineageContract, confContract, corruption, inconsistencies, observability, telemetryQuality,
    };
  }, []);

  const {
    kernel, kernelInputs, engineConflicts, duplicates, consolidation,
    inflation, normHealth, redundantCount, lineage, cycles, orphans, untraceable, lineageIntegrity,
    explainability, conf, opaque,
    telemetryContract, lineageContract, confContract, corruption, inconsistencies, observability, telemetryQuality,
  } = data;

  const confidenceIntegrity = conf.averageConfidence;

  const capture = async () => {
    setSaving(true);
    const payload: any = {
      kernel_coherence: kernel.coherence,
      metric_redundancy: kernel.redundancy,
      engine_overlap: kernel.overlap,
      explainability_score: explainability,
      observability_score: observability,
      telemetry_quality: telemetryQuality,
      diagnostic_consistency: Math.max(0, 100 - inconsistencies.length * 20),
      systemic_noise: kernel.entropy,
      operator_load: Math.min(100, kernelInputs.totalEngines * 5 + kernelInputs.totalMetrics * 2),
      maintainability_score: kernel.maintainability,
      tracing_coverage: lineageIntegrity,
      lineage_integrity: lineageIntegrity,
      confidence_integrity: confidenceIntegrity,
      normalization_health: normHealth,
      orchestration_stability: kernel.orchestration,
      architectural_entropy: kernel.entropy,
      operational_compression: kernel.compression,
      notes: kernel.summary,
    };
    const { error } = await (supabase as any).from("seo_kernel_snapshots").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Erro ao salvar snapshot", description: error.message, variant: "destructive" });
    else toast({ title: "Kernel snapshot capturado", description: "Persistido em seo_kernel_snapshots." });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Kernel & Observability</h1>
          <p className="text-sm text-muted-foreground">
            Núcleo operacional — consolidação, lineage e contratos. Safe Mode absoluto.
          </p>
        </div>
        <Button onClick={capture} disabled={saving}>
          {saving ? "Salvando…" : "Capture Kernel Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi label="Coherence" value={kernel.coherence} />
        <Kpi label="Explainability" value={explainability} />
        <Kpi label="Observability" value={observability} />
        <Kpi label="Maintainability" value={kernel.maintainability} />
        <Kpi label="Engine Overlap" value={`${kernel.overlap}%`} />
        <Kpi label="Compression" value={kernel.compression} />
      </div>

      <Tabs defaultValue="core">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="core">Kernel Core</TabsTrigger>
          <TabsTrigger value="metrics">Metric Registry</TabsTrigger>
          <TabsTrigger value="engines">Engine Registry</TabsTrigger>
          <TabsTrigger value="lineage">Metric Lineage</TabsTrigger>
          <TabsTrigger value="explain">Explainability</TabsTrigger>
          <TabsTrigger value="overlap">Engine Overlap</TabsTrigger>
          <TabsTrigger value="normalization">Normalization</TabsTrigger>
          <TabsTrigger value="confidence">Confidence Integrity</TabsTrigger>
          <TabsTrigger value="contracts">Observability Contracts</TabsTrigger>
          <TabsTrigger value="entropy">Architectural Entropy</TabsTrigger>
          <TabsTrigger value="compression">Compression</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="core">
          <div className="grid md:grid-cols-2 gap-4">
            <KernelCoherenceCard report={kernel} />
            <TelemetryQualityCard quality={telemetryQuality} corruption={corruption} inconsistencies={inconsistencies} />
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <Card className="p-4 text-sm space-y-2">
            <p className="font-medium">Metric Registry ({MOCK_METRICS.length})</p>
            <div className="max-h-96 overflow-auto border rounded">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr><th className="text-left p-2">Key</th><th className="text-left p-2">Group</th><th className="text-left p-2">Scale</th><th className="text-left p-2">Canonical</th></tr>
                </thead>
                <tbody>
                  {MOCK_METRICS.map((m: any) => (
                    <tr key={m.key} className="border-t">
                      <td className="p-2 font-mono">{m.key}</td>
                      <td className="p-2">{m.redundancy_group ?? "—"}</td>
                      <td className="p-2">{m.scale_min}-{m.scale_max}</td>
                      <td className="p-2">{m.canonical_metric ? "✓" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engines">
          <Card className="p-4 text-sm space-y-2">
            <p className="font-medium">Engine Registry ({MOCK_ENGINES.length})</p>
            <div className="max-h-96 overflow-auto border rounded">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr><th className="text-left p-2">Engine</th><th className="text-left p-2">Domain</th><th className="text-left p-2">Outputs</th><th className="text-left p-2">Complex.</th></tr>
                </thead>
                <tbody>
                  {MOCK_ENGINES.map((e) => (
                    <tr key={e.engine_key} className="border-t">
                      <td className="p-2 font-mono">{e.engine_key}</td>
                      <td className="p-2">{e.domain}</td>
                      <td className="p-2 text-muted-foreground">{e.outputs.join(", ")}</td>
                      <td className="p-2">{e.complexity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="lineage">
          <LineageGraphPanel
            graph={lineage} integrity={lineageIntegrity}
            cycles={cycles} orphans={orphans} untraceable={untraceable}
          />
        </TabsContent>

        <TabsContent value="explain">
          <ExplainabilityPanel score={explainability} avgConfidence={conf.averageConfidence} opaque={opaque} />
        </TabsContent>

        <TabsContent value="overlap">
          <EngineOverlapRadar
            overlap={kernel.overlap} conflicts={engineConflicts}
            duplicates={duplicates} consolidation={consolidation}
          />
        </TabsContent>

        <TabsContent value="normalization">
          <Card className="p-4 text-sm space-y-2">
            <p className="font-medium">Normalization Health</p>
            <div className="text-4xl font-bold">{normHealth}</div>
            <p className="font-medium pt-2">Grupos inflacionados</p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">
              {inflation.inflated.length === 0 && <li>—</li>}
              {inflation.inflated.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <p className="font-medium pt-2">Redundância total: <b>{redundantCount}</b></p>
          </Card>
        </TabsContent>

        <TabsContent value="confidence">
          <ConfidenceIntegrityGauge
            integrity={confidenceIntegrity}
            avgConfidence={conf.averageConfidence}
            lowConfidenceCount={conf.lowConfidence.length}
          />
        </TabsContent>

        <TabsContent value="contracts">
          <ObservabilityContractsPanel
            contracts={[
              { name: "Telemetry Integrity", result: telemetryContract },
              { name: "Lineage Integrity", result: lineageContract },
              { name: "Confidence Consistency", result: confContract },
            ]}
          />
        </TabsContent>

        <TabsContent value="entropy">
          <ArchitecturalEntropyMap
            entropy={kernel.entropy}
            redundancy={kernel.redundancy}
            overlap={kernel.overlap}
            untraceableRatio={Math.round((untraceable.length / Math.max(1, kernelInputs.totalMetrics)) * 100)}
          />
        </TabsContent>

        <TabsContent value="compression">
          <OperationalCompressionGauge
            compression={kernel.compression}
            system={kernel.compression}
            opportunities={kernel.compression_opportunities}
          />
        </TabsContent>

        <TabsContent value="summary">
          <Card className="p-4 text-sm space-y-3">
            <p className="font-medium">Executive Kernel Summary</p>
            <p>{kernel.summary}</p>
            <p className="font-medium pt-2">Forças</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {kernel.strengths.length === 0 && <li>—</li>}
              {kernel.strengths.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Fraquezas</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {kernel.weaknesses.length === 0 && <li>—</li>}
              {kernel.weaknesses.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Oportunidades de Compressão</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {kernel.compression_opportunities.length === 0 && <li>—</li>}
              {kernel.compression_opportunities.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Riscos de Manutenção</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {kernel.maintenance_risks.length === 0 && <li>—</li>}
              {kernel.maintenance_risks.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Roadmap de Consolidação de Engines</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {consolidation.length === 0 && <li>—</li>}
              {consolidation.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
}
