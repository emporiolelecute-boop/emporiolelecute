import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import OperatingFabricScoreCard from "@/components/admin/OperatingFabricScoreCard";
import StructuralDebtPanel from "@/components/admin/StructuralDebtPanel";
import CausalityPropagationMap from "@/components/admin/CausalityPropagationMap";
import ScalabilityProjectionCard from "@/components/admin/ScalabilityProjectionCard";
import CompressionRiskGauge from "@/components/admin/CompressionRiskGauge";
import DependencyFragilityRadar, { type DependencyRow } from "@/components/admin/DependencyFragilityRadar";
import CascadeOriginsPanel from "@/components/admin/CascadeOriginsPanel";
import ExecutiveNarrativeCard from "@/components/admin/ExecutiveNarrativeCard";
import FabricObservabilityMatrix from "@/components/admin/FabricObservabilityMatrix";
import SystemicShockAlert from "@/components/admin/SystemicShockAlert";

import { buildStrategicOperatingFabric, type FabricInputs } from "@/lib/strategicOperatingFabric";
import { calculateStructuralDebt, buildDebtDistribution } from "@/lib/structuralDebt";
import {
  buildSystemicCausalityGraph,
  calculatePropagationDepth,
  calculatePropagationRisk,
  detectCascadeOrigins,
  detectSystemicShockPoints,
  type CausalEdge,
} from "@/lib/systemicCausality";
import {
  calculateScalabilityScore,
  estimateScalingLimit,
  estimateScalingFragility,
  estimateMaintenanceExplosion,
  detectScalingBottlenecks,
} from "@/lib/scalabilityEngine";
import { buildExecutiveCausalitySummary } from "@/lib/executiveCausality";
import { buildFabricObservability, type ObservabilityLayer } from "@/lib/fabricObservability";

// Demonstração — dados estáticos derivados; nenhum side effect público.
const FABRIC_INPUTS: FabricInputs = {
  cohesion: 72, semanticIntegrity: 70, authorityIntegrity: 68, governanceIntegrity: 74,
  resilience: 71, fragmentationRisk: 38, dependencyRisk: 42, executionPressure: 45,
  operationalDebt: 40, scalingRisk: 35, systemicComplexity: 55, explainability: 65,
  observability: 60, consensus: 70, anomalyPressure: 30, strategicNoise: 28, entropy: 35,
  scalabilityProjection: 68, futureStability: 70, sustainability: 72, continuity: 73,
  collapseProbability: 18,
};

const DEBT_INPUTS = {
  redundantEngines: 4, overengineeredFlows: 3, duplicateMetrics: 6,
  authorityWasteScore: 35, telemetryInflation: 40, governanceComplexity: 45,
};

const SCALABILITY_INPUTS = {
  currentVolume: 1200, systemComplexity: 55, operationalDebt: 40,
  resilience: 71, authorityHeadroom: 60, semanticHeadroom: 58, executionHeadroom: 55,
};

const CAUSAL_EDGES: CausalEdge[] = [
  { from: "authorityEngine", to: "discoveryEngine", strength: 70 },
  { from: "discoveryEngine", to: "linkingEngine", strength: 60 },
  { from: "linkingEngine", to: "semanticGraph", strength: 55 },
  { from: "governanceEntropy", to: "metaGovernance", strength: 65 },
  { from: "metaGovernance", to: "civilizationEngine", strength: 50 },
  { from: "civilizationEngine", to: "futureForecast", strength: 45 },
  { from: "unifiedIntelligenceBus", to: "seoKernel", strength: 80 },
  { from: "seoKernel", to: "observabilityContracts", strength: 65 },
];

const DEPENDENCIES: DependencyRow[] = [
  { source: "seoKernel", target: "observabilityContracts", fragility: 62, critical: true },
  { source: "metaGovernance", target: "governanceEntropy", fragility: 48 },
  { source: "unifiedIntelligenceBus", target: "engineConsensus", fragility: 71, critical: true },
  { source: "discoveryEngine", target: "linkingEngine", fragility: 38 },
];

const OBS_LAYERS: ObservabilityLayer[] = [
  { layer: "Authority", metrics: 12, monitored: 9 },
  { layer: "Semantic", metrics: 14, monitored: 8 },
  { layer: "Governance", metrics: 10, monitored: 7 },
  { layer: "Causality", metrics: 8, monitored: 3 },
  { layer: "Resilience", metrics: 9, monitored: 6 },
];

export default function AdminSeoOperatingFabric() {
  const [saving, setSaving] = useState(false);

  const fabric = useMemo(() => buildStrategicOperatingFabric(FABRIC_INPUTS), []);
  const debtTotal = useMemo(() => calculateStructuralDebt(DEBT_INPUTS), []);
  const debtDist = useMemo(() => buildDebtDistribution(DEBT_INPUTS), []);
  const scalability = useMemo(() => calculateScalabilityScore(SCALABILITY_INPUTS), []);
  const scalingLimit = useMemo(() => estimateScalingLimit(SCALABILITY_INPUTS), []);
  const scalingFragility = useMemo(() => estimateScalingFragility(SCALABILITY_INPUTS), []);
  const maintenance = useMemo(() => estimateMaintenanceExplosion(SCALABILITY_INPUTS), []);
  const bottlenecks = useMemo(() => detectScalingBottlenecks(SCALABILITY_INPUTS), []);

  const causalGraph = useMemo(() => buildSystemicCausalityGraph(CAUSAL_EDGES), []);
  const cascadeOrigins = useMemo(() => detectCascadeOrigins(causalGraph), [causalGraph]);
  const shockPoints = useMemo(() => detectSystemicShockPoints(causalGraph), [causalGraph]);
  const propagationDepth = useMemo(
    () => calculatePropagationDepth(causalGraph, "unifiedIntelligenceBus"),
    [causalGraph],
  );
  const propagationRisk = useMemo(
    () => calculatePropagationRisk(causalGraph, "unifiedIntelligenceBus", 60),
    [causalGraph],
  );

  const obs = useMemo(() => buildFabricObservability(OBS_LAYERS, CAUSAL_EDGES), []);

  const executive = useMemo(
    () =>
      buildExecutiveCausalitySummary({
        fabricScore: fabric.operating_fabric_score,
        cohesion: fabric.strategic_cohesion_score,
        integrity: fabric.structural_integrity_score,
        scalability,
        debt: debtTotal,
        collapseProbability: FABRIC_INPUTS.collapseProbability ?? 0,
      }),
    [fabric, scalability, debtTotal],
  );

  const captureSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("seo_operating_fabric_snapshots").insert({
        operating_fabric_score: fabric.operating_fabric_score,
        strategic_cohesion_score: fabric.strategic_cohesion_score,
        semantic_integrity_score: FABRIC_INPUTS.semanticIntegrity,
        authority_integrity_score: FABRIC_INPUTS.authorityIntegrity,
        governance_integrity_score: FABRIC_INPUTS.governanceIntegrity,
        resilience_integrity_score: fabric.fabric_resilience_score,
        fragmentation_risk: FABRIC_INPUTS.fragmentationRisk,
        dependency_risk: FABRIC_INPUTS.dependencyRisk,
        execution_pressure: FABRIC_INPUTS.executionPressure,
        operational_debt: FABRIC_INPUTS.operationalDebt,
        scaling_risk: FABRIC_INPUTS.scalingRisk,
        systemic_complexity: FABRIC_INPUTS.systemicComplexity,
        explainability_score: FABRIC_INPUTS.explainability,
        observability_score: FABRIC_INPUTS.observability,
        consensus_score: FABRIC_INPUTS.consensus,
        anomaly_pressure: FABRIC_INPUTS.anomalyPressure,
        strategic_noise: FABRIC_INPUTS.strategicNoise,
        entropy_score: FABRIC_INPUTS.entropy,
        scalability_projection: scalability,
        future_stability_score: FABRIC_INPUTS.futureStability,
        sustainability_projection: FABRIC_INPUTS.sustainability,
        continuity_projection: FABRIC_INPUTS.continuity,
        collapse_probability: FABRIC_INPUTS.collapseProbability,
        executive_summary: executive as unknown as Record<string, unknown>,
        strengths: fabric.bottleneckChains.length === 0 ? ["Sem gargalos detectados"] : [],
        blockers: fabric.weaknesses,
        recommendations: [
          ...fabric.architecturalDebt,
          ...fabric.scalingRisks,
          ...bottlenecks,
        ],
        notes: `verdict=${fabric.verdict}`,
      });
      if (error) throw error;
      toast.success("Snapshot do Operating Fabric capturado.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "erro desconhecido";
      toast.error(`Falha ao capturar snapshot: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const kpi = (label: string, value: number | string) => (
    <Card><CardContent className="py-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent></Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Network className="h-6 w-6" /> Strategic Operating Fabric
          </h1>
          <p className="text-sm text-muted-foreground">
            Camada consolidada — read-only, safe mode. Fase 15.2.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Capturando..." : "Capture Fabric Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpi("Operating Fabric", fabric.operating_fabric_score)}
        {kpi("Strategic Cohesion", fabric.strategic_cohesion_score)}
        {kpi("Structural Integrity", fabric.structural_integrity_score)}
        {kpi("Scalability", scalability)}
        {kpi("Debt", debtTotal)}
        {kpi("Shock Risk", propagationRisk)}
        {kpi("Collapse Prob.", FABRIC_INPUTS.collapseProbability ?? 0)}
      </div>

      <Tabs defaultValue="fabric" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="fabric">Operating Fabric</TabsTrigger>
          <TabsTrigger value="integrity">Structural Integrity</TabsTrigger>
          <TabsTrigger value="causality">Causality</TabsTrigger>
          <TabsTrigger value="scalability">Scalability</TabsTrigger>
          <TabsTrigger value="debt">Structural Debt</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="compression">Compression</TabsTrigger>
          <TabsTrigger value="cascade">Cascade Risks</TabsTrigger>
          <TabsTrigger value="observability">Observability</TabsTrigger>
          <TabsTrigger value="shock">Shock Points</TabsTrigger>
          <TabsTrigger value="narrative">Executive Narrative</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="fabric" className="grid md:grid-cols-2 gap-4">
          <OperatingFabricScoreCard score={fabric.operating_fabric_score} verdict={fabric.verdict} />
          <Card><CardHeader><CardTitle className="text-base">Pontos Fortes/Fracos</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {fabric.weaknesses.length === 0
                ? <p className="text-muted-foreground">Sem fraquezas estruturais relevantes.</p>
                : <ul className="space-y-1">{fabric.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}</ul>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrity" className="grid md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Integridade Estrutural</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{fabric.structural_integrity_score}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Composto por semântica, autoridade, governança e resiliência.
              </p>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Resiliência do Tecido</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{fabric.fabric_resilience_score}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="causality" className="grid md:grid-cols-2 gap-4">
          <CausalityPropagationMap edges={CAUSAL_EDGES} origin="unifiedIntelligenceBus" />
          <Card><CardHeader><CardTitle className="text-base">Propagação</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Profundidade</span><span className="font-mono">{propagationDepth}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Risco</span><span className="font-mono">{propagationRisk}</span></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scalability" className="grid md:grid-cols-2 gap-4">
          <ScalabilityProjectionCard
            score={scalability} limit={scalingLimit}
            fragility={scalingFragility} maintenance={maintenance}
          />
          <Card><CardHeader><CardTitle className="text-base">Gargalos de Escala</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {bottlenecks.length === 0
                ? <p className="text-muted-foreground">Sem gargalos críticos.</p>
                : <ul className="space-y-1">{bottlenecks.map((b, i) => <li key={i}>• {b}</li>)}</ul>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debt">
          <StructuralDebtPanel total={debtTotal} distribution={debtDist} />
        </TabsContent>

        <TabsContent value="dependencies">
          <DependencyFragilityRadar items={DEPENDENCIES} />
        </TabsContent>

        <TabsContent value="compression">
          <CompressionRiskGauge
            execution={fabric.execution_compression}
            semantic={fabric.semantic_compression}
            authority={fabric.authority_compression}
          />
        </TabsContent>

        <TabsContent value="cascade">
          <CascadeOriginsPanel origins={cascadeOrigins} />
        </TabsContent>

        <TabsContent value="observability">
          <FabricObservabilityMatrix obs={obs} />
        </TabsContent>

        <TabsContent value="shock">
          <SystemicShockAlert shocks={shockPoints} risk={propagationRisk} />
        </TabsContent>

        <TabsContent value="narrative">
          <ExecutiveNarrativeCard lines={executive.narrative} />
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader><CardTitle className="text-base">Sumário Executivo</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="text-muted-foreground">Verdict:</span> <strong>{fabric.verdict}</strong></p>
              <p><span className="text-muted-foreground">Fabric:</span> {fabric.operating_fabric_score} · <span className="text-muted-foreground">Cohesion:</span> {fabric.strategic_cohesion_score} · <span className="text-muted-foreground">Integrity:</span> {fabric.structural_integrity_score}</p>
              <p><span className="text-muted-foreground">Scalability:</span> {scalability} · <span className="text-muted-foreground">Debt:</span> {debtTotal} · <span className="text-muted-foreground">Collapse:</span> {FABRIC_INPUTS.collapseProbability}</p>
              {fabric.architecturalDebt.length > 0 && (
                <div>
                  <p className="font-medium mt-2">Recomendações</p>
                  <ul className="space-y-0.5">{fabric.architecturalDebt.map((r, i) => <li key={i}>• {r}</li>)}</ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
