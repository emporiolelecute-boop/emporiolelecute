import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import CognitiveStabilityCard from "@/components/admin/CognitiveStabilityCard";
import DecisionSynthesisMatrix from "@/components/admin/DecisionSynthesisMatrix";
import ReasoningFabricMap from "@/components/admin/ReasoningFabricMap";
import StrategicSignalRadar from "@/components/admin/StrategicSignalRadar";
import SignalCompressionGauge from "@/components/admin/SignalCompressionGauge";
import ReasoningConflictPanel from "@/components/admin/ReasoningConflictPanel";
import CognitiveNoiseHeatmap from "@/components/admin/CognitiveNoiseHeatmap";
import DecisionConfidenceCard from "@/components/admin/DecisionConfidenceCard";
import CognitiveResilienceGauge from "@/components/admin/CognitiveResilienceGauge";
import StrategicConfusionAlert from "@/components/admin/StrategicConfusionAlert";

import {
  buildCognitiveOrchestration,
  calculateStrategicSignalClarity,
  calculateOperationalSignalClarity,
  calculateSemanticSignalClarity,
  calculateAuthoritySignalClarity,
  detectStrategicConfusion,
  detectAuthorityConfusion,
  detectGovernanceConfusion,
  type OrchestrationInputs,
} from "@/lib/cognitiveOrchestrator";
import { buildDecisionSynthesis, type DecisionSynthesisInput } from "@/lib/decisionSynthesis";
import { buildReasoningFabric, type ReasoningEdge } from "@/lib/reasoningFabric";
import {
  compressStrategicSignals, compressOperationalSignals,
  compressSemanticSignals, compressAuthoritySignals,
  calculateCompressionEfficiency, detectCompressionLoss,
  detectSignalOverload, detectSignalRedundancy,
} from "@/lib/signalCompression";
import {
  detectStrategicContradictions, buildConflictResolutionPlan,
  type LayerSignal,
} from "@/lib/conflictResolution";
import {
  calculateCognitiveResilience, estimateCognitiveDecay,
  estimateStrategicSurvival, detectReasoningExhaustion,
  detectCognitiveCollapseRisk,
} from "@/lib/cognitiveResilience";

// Demo inputs — read-only derivations; no side effects.
const ORCH: OrchestrationInputs = {
  strategicCoherence: 72, operationalScore: 70, semanticStability: 68,
  authorityBalance: 71, governanceScore: 74,
  fragmentation: 32, noise: 28, contradictionPressure: 30, conflictDensity: 25,
  observability: 65, consensus: 72, explainability: 64,
  cognitiveLoad: 42, decayRisk: 30,
};

const SYNTH: DecisionSynthesisInput = {
  strategic: { primary: 72, supporting: [70, 68], noise: 28 },
  operational: { primary: 70, supporting: [68, 72], noise: 25 },
  authority: { primary: 71, supporting: [69, 73], noise: 22 },
  semantic: { primary: 68, supporting: [66, 70], noise: 30 },
  governance: { primary: 74, supporting: [72, 76], noise: 20 },
  consensusScore: 72, conflictScore: 28, latencyScore: 35,
};

const EDGES: ReasoningEdge[] = [
  { from: "unifiedIntelligenceBus", to: "decisionSynthesis", weight: 80 },
  { from: "decisionSynthesis", to: "cognitiveOrchestrator", weight: 75 },
  { from: "cognitiveOrchestrator", to: "metaGovernance", weight: 60 },
  { from: "metaGovernance", to: "civilizationEngine", weight: 55 },
  { from: "seoKernel", to: "decisionSynthesis", weight: 70 },
  { from: "explainabilityKernel", to: "cognitiveOrchestrator", weight: 65, opaque: false },
  { from: "anomalyDetection", to: "cognitiveOrchestrator", weight: 30 },
];

const STRAT_LAYERS: LayerSignal[] = [
  { layer: "metaGovernance", value: 72 },
  { layer: "civilizationEngine", value: 68 },
  { layer: "unifiedIntelligenceBus", value: 75 },
  { layer: "seoKernel", value: 70 },
  { layer: "operatingFabric", value: 50 },
];

export default function AdminSeoCognitiveOrchestration() {
  const [saving, setSaving] = useState(false);

  const orchestration = useMemo(() => buildCognitiveOrchestration(ORCH), []);
  const synthesis = useMemo(() => buildDecisionSynthesis(SYNTH), []);
  const fabric = useMemo(() => buildReasoningFabric(EDGES, "unifiedIntelligenceBus"), []);

  const compressed = useMemo(() => {
    const items = [
      compressStrategicSignals({ label: "Estratégico", signals: [72, 70, 68, 74], noise: 28 }),
      compressOperationalSignals({ label: "Operacional", signals: [70, 68, 72, 71], noise: 25 }),
      compressSemanticSignals({ label: "Semântico", signals: [68, 66, 70, 65], noise: 30 }),
      compressAuthoritySignals({ label: "Autoridade", signals: [71, 69, 73, 70], noise: 22 }),
    ];
    return {
      items,
      efficiency: calculateCompressionEfficiency(items),
      loss: detectCompressionLoss(items),
      redundancy: detectSignalRedundancy(items),
      overloads: detectSignalOverload(items),
    };
  }, []);

  const conflicts = useMemo(() => detectStrategicContradictions(STRAT_LAYERS), []);
  const plan = useMemo(() => buildConflictResolutionPlan(conflicts), [conflicts]);

  const clarity = useMemo(() => ({
    strategic: calculateStrategicSignalClarity(ORCH),
    operational: calculateOperationalSignalClarity(ORCH),
    semantic: calculateSemanticSignalClarity(ORCH),
    authority: calculateAuthoritySignalClarity(ORCH),
    governance: ORCH.governanceScore,
  }), []);

  const resilience = useMemo(() => {
    const inputs = {
      stability: orchestration.cognitive_stability_score,
      synthesis: synthesis.synthesis_score,
      reasoning: orchestration.systemic_reasoning_score,
      noise: orchestration.orchestration_noise,
      fragmentation: orchestration.orchestration_fragmentation,
      conflictDensity: ORCH.conflictDensity,
      cognitiveLoad: ORCH.cognitiveLoad,
      observability: ORCH.observability,
      consensus: ORCH.consensus,
    };
    return {
      score: calculateCognitiveResilience(inputs),
      decay: estimateCognitiveDecay(inputs),
      survival: estimateStrategicSurvival(inputs),
      exhaustion: detectReasoningExhaustion(inputs),
      collapse: detectCognitiveCollapseRisk(inputs),
    };
  }, [orchestration, synthesis]);

  const confusion = useMemo(() => ({
    strategic: detectStrategicConfusion(ORCH),
    authority: detectAuthorityConfusion(ORCH),
    governance: detectGovernanceConfusion(ORCH),
    semantic: 100 - clarity.semantic,
  }), [clarity.semantic]);

  const captureSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("seo_cognitive_snapshots").insert([{
        cognitive_stability_score: orchestration.cognitive_stability_score,
        decision_synthesis_score: synthesis.synthesis_score,
        systemic_reasoning_score: orchestration.systemic_reasoning_score,
        strategic_signal_clarity: clarity.strategic,
        operational_signal_clarity: clarity.operational,
        semantic_signal_clarity: clarity.semantic,
        authority_signal_clarity: clarity.authority,
        orchestration_efficiency: orchestration.orchestration_efficiency,
        orchestration_fragmentation: orchestration.orchestration_fragmentation,
        orchestration_noise: orchestration.orchestration_noise,
        orchestration_alignment: orchestration.orchestration_alignment,
        orchestration_entropy: orchestration.orchestration_entropy,
        decision_confidence_score: synthesis.confidence_score,
        decision_traceability_score: fabric.depth_score,
        decision_conflict_score: synthesis.instability_score,
        decision_consistency_score: synthesis.consistency_score,
        decision_latency_score: synthesis.latency_score,
        cognitive_load_score: ORCH.cognitiveLoad,
        strategic_confusion_score: confusion.strategic,
        semantic_confusion_score: confusion.semantic,
        authority_confusion_score: confusion.authority,
        governance_confusion_score: confusion.governance,
        cognitive_resilience_score: resilience.score,
        cognitive_decay_risk: resilience.decay,
        orchestration_scalability_score: clarity.governance,
        strategic_survival_projection: resilience.survival,
        summary: { verdict: orchestration.verdict, drivers: orchestration.drivers } as object,
        blockers: orchestration.drivers as unknown as object,
        recommendations: plan.map((p) => p.action) as unknown as object,
        warnings: conflicts.map((c) => c.description) as unknown as object,
        notes: `verdict=${orchestration.verdict}`,
      }]);
      if (error) throw error;
      toast.success("Snapshot cognitivo capturado.");
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
            <Brain className="h-6 w-6" /> Cognitive Orchestration
          </h1>
          <p className="text-sm text-muted-foreground">
            Camada cognitiva consolidada — read-only, safe mode. Fase 15.3.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Capturando..." : "Capture Cognitive Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpi("Cognitive Stability", orchestration.cognitive_stability_score)}
        {kpi("Decision Synthesis", synthesis.synthesis_score)}
        {kpi("Signal Clarity", Math.round((clarity.strategic + clarity.operational + clarity.semantic + clarity.authority) / 4))}
        {kpi("Decision Confidence", synthesis.confidence_score)}
        {kpi("Cognitive Resilience", resilience.score)}
        {kpi("Noise Score", orchestration.orchestration_noise)}
        {kpi("Collapse Risk", resilience.collapse)}
      </div>

      <Tabs defaultValue="cognitive" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="cognitive">Cognitive Layer</TabsTrigger>
          <TabsTrigger value="synthesis">Decision Synthesis</TabsTrigger>
          <TabsTrigger value="fabric">Reasoning Fabric</TabsTrigger>
          <TabsTrigger value="clarity">Signal Clarity</TabsTrigger>
          <TabsTrigger value="compression">Signal Compression</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          <TabsTrigger value="noise">Noise</TabsTrigger>
          <TabsTrigger value="resilience">Resilience</TabsTrigger>
          <TabsTrigger value="confidence">Decision Confidence</TabsTrigger>
          <TabsTrigger value="decay">Cognitive Decay</TabsTrigger>
          <TabsTrigger value="confusion">Strategic Confusion</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="cognitive" className="grid md:grid-cols-2 gap-4">
          <CognitiveStabilityCard
            score={orchestration.cognitive_stability_score}
            verdict={orchestration.verdict}
            drivers={orchestration.drivers}
          />
          <Card><CardHeader><CardTitle className="text-base">Resumo Orchestration</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Eficiência:</span> {orchestration.orchestration_efficiency}</p>
              <p><span className="text-muted-foreground">Alinhamento:</span> {orchestration.orchestration_alignment}</p>
              <p><span className="text-muted-foreground">Entropia:</span> {orchestration.orchestration_entropy}</p>
              <p><span className="text-muted-foreground">Fragmentação:</span> {orchestration.orchestration_fragmentation}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synthesis">
          <DecisionSynthesisMatrix layers={synthesis.layer_scores} />
        </TabsContent>

        <TabsContent value="fabric">
          <ReasoningFabricMap fabric={fabric} />
        </TabsContent>

        <TabsContent value="clarity">
          <StrategicSignalRadar {...clarity} />
        </TabsContent>

        <TabsContent value="compression">
          <SignalCompressionGauge
            efficiency={compressed.efficiency}
            redundancy={compressed.redundancy}
            loss={compressed.loss}
            overloads={compressed.overloads}
          />
        </TabsContent>

        <TabsContent value="conflicts" className="grid md:grid-cols-2 gap-4">
          <ReasoningConflictPanel conflicts={conflicts} />
          <Card><CardHeader><CardTitle className="text-base">Plano de Resolução</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {plan.length === 0
                ? <p className="text-muted-foreground">Nenhuma ação requerida.</p>
                : <ul className="space-y-1">{plan.map((p, i) => <li key={i}>• {p.action}</li>)}</ul>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="noise">
          <CognitiveNoiseHeatmap
            noise={orchestration.orchestration_noise}
            fragmentation={orchestration.orchestration_fragmentation}
            conflicts={synthesis.instability_score}
            load={ORCH.cognitiveLoad}
          />
        </TabsContent>

        <TabsContent value="resilience">
          <CognitiveResilienceGauge
            resilience={resilience.score}
            decay={resilience.decay}
            survival={resilience.survival}
            exhaustion={resilience.exhaustion}
          />
        </TabsContent>

        <TabsContent value="confidence">
          <DecisionConfidenceCard
            confidence={synthesis.confidence_score}
            consistency={synthesis.consistency_score}
            instability={synthesis.instability_score}
            latency={synthesis.latency_score}
          />
        </TabsContent>

        <TabsContent value="decay">
          <Card><CardHeader><CardTitle className="text-base">Decay Cognitivo</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Risco de decay:</span> <strong>{resilience.decay}</strong></p>
              <p><span className="text-muted-foreground">Exaustão:</span> <strong>{resilience.exhaustion}</strong></p>
              <p><span className="text-muted-foreground">Colapso:</span> <strong>{resilience.collapse}</strong></p>
              <p className="text-muted-foreground mt-2">Sinais lentos de degradação do raciocínio sistêmico.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confusion">
          <StrategicConfusionAlert {...confusion} />
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader><CardTitle className="text-base">Sumário Executivo</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="text-muted-foreground">Verdict:</span> <strong>{orchestration.verdict}</strong></p>
              <p>
                <span className="text-muted-foreground">Stability:</span> {orchestration.cognitive_stability_score}{" · "}
                <span className="text-muted-foreground">Synthesis:</span> {synthesis.synthesis_score}{" · "}
                <span className="text-muted-foreground">Resilience:</span> {resilience.score}
              </p>
              <p>
                <span className="text-muted-foreground">Noise:</span> {orchestration.orchestration_noise}{" · "}
                <span className="text-muted-foreground">Fragmentation:</span> {orchestration.orchestration_fragmentation}{" · "}
                <span className="text-muted-foreground">Collapse:</span> {resilience.collapse}
              </p>
              {orchestration.drivers.length > 0 && (
                <div>
                  <p className="font-medium mt-2">Drivers</p>
                  <ul>{orchestration.drivers.map((d, i) => <li key={i}>• {d}</li>)}</ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
