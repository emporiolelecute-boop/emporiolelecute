import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCog, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import MetaReasoningScoreCard from "@/components/admin/MetaReasoningScoreCard";
import StrategicSelfAwarenessPanel from "@/components/admin/StrategicSelfAwarenessPanel";
import CoherenceMatrixHeatmap from "@/components/admin/CoherenceMatrixHeatmap";
import ReasoningDriftTimeline from "@/components/admin/ReasoningDriftTimeline";
import ReliabilityIntegrityCard from "@/components/admin/ReliabilityIntegrityCard";
import ContradictionRiskPanel from "@/components/admin/ContradictionRiskPanel";
import StrategicHallucinationAlert from "@/components/admin/StrategicHallucinationAlert";
import SystemicReflectionRadar from "@/components/admin/SystemicReflectionRadar";
import SelfConflictMatrix from "@/components/admin/SelfConflictMatrix";
import LongevityProjectionGauge from "@/components/admin/LongevityProjectionGauge";

import { buildMetaReasoning, type MetaReasoningInputs } from "@/lib/metaReasoningEngine";
import { buildCoherenceMatrix, type CoherenceInputs } from "@/lib/coherenceMatrix";
import {
  detectReasoningDrift, detectStrategicDrift, detectSemanticDrift,
  detectOperationalDrift, detectGovernanceDrift,
  calculateDriftVelocity, estimateDriftAcceleration, estimateCollapseProbability,
  buildDriftTimeline,
} from "@/lib/reasoningDrift";
import {
  calculateSelfAwareness, calculateStrategicReflectionDepth,
  calculateStrategicHumility, detectOverconfidencePatterns,
  detectFalseConfidence, detectSelfConflict, detectBlindStrategicZones,
  type SelfAwarenessInputs,
} from "@/lib/strategicSelfAwareness";
import {
  calculateSystemReliability, calculateReasoningReliability,
  calculateDecisionReliability, calculateForecastReliability,
  detectReliabilityCollapse, detectInconsistentReasoning,
  type ReliabilityInputs,
} from "@/lib/reliabilityEngine";
import {
  detectStrategicContradictions, detectSemanticContradictions,
  detectAuthorityContradictions, detectGovernanceContradictions,
  calculateContradictionDepth, estimateContradictionImpact,
  type LayerValue,
} from "@/lib/systemicContradictions";

// Demo inputs — read-only derivations; no side effects.
const META: MetaReasoningInputs = {
  cognitiveStability: 72, decisionSynthesis: 70, reasoningIntegrity: 68,
  orchestrationAlignment: 71, consensus: 70, explainability: 64, observability: 66,
  noise: 28, fragmentation: 30, contradictionPressure: 30, conflictDensity: 25,
  cognitiveLoad: 40, decayRisk: 28, authorityBalance: 71, semanticStability: 68,
  governanceScore: 74, strategicCoherence: 72,
};
const COH: CoherenceInputs = {
  strategic: 72, operational: 70, semantic: 68, authority: 71, governance: 74,
  consensus: 70, contradictionPressure: 30, conflictDensity: 25,
};
const SAW: SelfAwarenessInputs = {
  observability: 66, explainability: 64, consensus: 70, decisionConfidence: 78,
  contradictionPressure: 30, conflictDensity: 25, blindspots: 35, monitoringGaps: 28,
};
const REL: ReliabilityInputs = {
  consensus: 70, observability: 66, explainability: 64, decisionSynthesis: 70,
  reasoningIntegrity: 68, semanticStability: 68, conflictDensity: 25,
  contradictionPressure: 30, decayRisk: 28,
};
const LAYERS: LayerValue[] = [
  { layer: "metaGovernance", value: 72 },
  { layer: "civilizationEngine", value: 68 },
  { layer: "unifiedIntelligenceBus", value: 75 },
  { layer: "seoKernel", value: 70 },
  { layer: "operatingFabric", value: 55 },
  { layer: "cognitiveOrchestrator", value: 71 },
];

export default function AdminSeoMetaReasoning() {
  const [saving, setSaving] = useState(false);

  const meta = useMemo(() => buildMetaReasoning(META), []);
  const matrix = useMemo(() => buildCoherenceMatrix(COH), []);

  const drift = useMemo(() => {
    const reasoning = detectReasoningDrift({ baseline: 70, current: 62, noise: META.noise });
    const strategic = detectStrategicDrift({ baseline: 72, current: 66 });
    const semantic = detectSemanticDrift({ baseline: 68, current: 60 });
    const operational = detectOperationalDrift({ baseline: 70, current: 67 });
    const governance = detectGovernanceDrift({ baseline: 74, current: 71 });
    const samples = [70, 68, 66, 64, 62];
    return {
      readings: { reasoning, strategic, semantic, operational, governance },
      velocity: calculateDriftVelocity(samples),
      acceleration: estimateDriftAcceleration(samples),
      collapse: estimateCollapseProbability(reasoning.drift_score, meta.reasoning_instability_score),
      timeline: buildDriftTimeline([
        { layer: "reasoning", reading: reasoning },
        { layer: "strategic", reading: strategic },
        { layer: "semantic", reading: semantic },
        { layer: "operational", reading: operational },
        { layer: "governance", reading: governance },
      ]),
    };
  }, [meta.reasoning_instability_score]);

  const awareness = useMemo(() => ({
    score: calculateSelfAwareness(SAW),
    reflection: calculateStrategicReflectionDepth(SAW),
    humility: calculateStrategicHumility(SAW),
    overconfidence: detectOverconfidencePatterns(SAW),
    falseConfidence: detectFalseConfidence(SAW),
    selfConflict: detectSelfConflict(SAW),
    blindZones: detectBlindStrategicZones(SAW),
  }), []);

  const reliability = useMemo(() => ({
    system: calculateSystemReliability(REL),
    reasoning: calculateReasoningReliability(REL),
    decision: calculateDecisionReliability(REL),
    forecast: calculateForecastReliability(REL),
    collapse: detectReliabilityCollapse(REL),
    inconsistency: detectInconsistentReasoning(REL),
  }), []);

  const contradictions = useMemo(() => {
    const all = [
      ...detectStrategicContradictions(LAYERS),
      ...detectSemanticContradictions(LAYERS),
      ...detectAuthorityContradictions(LAYERS),
      ...detectGovernanceContradictions(LAYERS),
    ];
    return {
      list: all,
      depth: calculateContradictionDepth(all),
      impact: estimateContradictionImpact(all),
    };
  }, []);

  const longevity = useMemo(() => {
    const viability = Math.round((reliability.system + matrix.cross_layer_coherence + meta.meta_reasoning_score) / 3);
    const longev = Math.round((viability + (100 - drift.collapse)) / 2);
    const survival = Math.round((meta.meta_reasoning_score + reliability.forecast) / 2);
    return { viability, longev, survival };
  }, [reliability, matrix, meta, drift]);

  const captureSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("seo_meta_reasoning_snapshots").insert([{
        meta_reasoning_score: meta.meta_reasoning_score,
        strategic_self_awareness_score: awareness.score,
        systemic_reflection_score: meta.systemic_reflection_score,
        cognitive_integrity_score: meta.cognitive_integrity_score,
        reasoning_stability_score: 100 - meta.reasoning_instability_score,
        cross_layer_coherence: matrix.cross_layer_coherence,
        strategic_coherence: matrix.strategic_coherence,
        operational_coherence: matrix.operational_coherence,
        semantic_coherence: matrix.semantic_coherence,
        authority_coherence: matrix.authority_coherence,
        governance_coherence: matrix.governance_coherence,
        reasoning_reliability_score: reliability.reasoning,
        decision_reliability_score: reliability.decision,
        strategic_confidence_score: meta.decision_reliability_score,
        forecast_reliability_score: reliability.forecast,
        traceability_integrity_score: SAW.observability,
        reasoning_drift_score: drift.readings.reasoning.drift_score,
        strategic_drift_score: drift.readings.strategic.drift_score,
        semantic_drift_score: drift.readings.semantic.drift_score,
        operational_drift_score: drift.readings.operational.drift_score,
        governance_drift_score: drift.readings.governance.drift_score,
        cognitive_stability_score: META.cognitiveStability,
        orchestration_stability_score: META.orchestrationAlignment,
        consensus_stability_score: META.consensus,
        observability_stability_score: META.observability,
        contradiction_risk_score: meta.contradiction_risk_score,
        self_conflict_score: awareness.selfConflict,
        strategic_hallucination_risk: meta.strategic_hallucination_risk,
        coherence_collapse_risk: matrix.collapse_risk,
        long_term_reasoning_viability: longevity.viability,
        strategic_survival_confidence: longevity.survival,
        systemic_longevity_score: longevity.longev,
        executive_summary: { verdict: meta.verdict, drivers: meta.drivers },
        warnings: meta.drivers,
        blockers: matrix.breakpoints,
        recommendations: awareness.blindZones,
        notes: `verdict=${meta.verdict}`,
      }]);
      if (error) throw error;
      toast.success("Snapshot meta-reasoning capturado.");
    } catch (e) {
      toast.error(`Falha: ${e instanceof Error ? e.message : "erro"}`);
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
            <BrainCog className="h-6 w-6" /> Meta-Reasoning Grid
          </h1>
          <p className="text-sm text-muted-foreground">
            Strategic self-awareness e auditoria cognitiva — read-only, safe mode. Fase 15.4.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Capturando..." : "Capture Meta Reasoning Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpi("Meta Reasoning", meta.meta_reasoning_score)}
        {kpi("Self-Awareness", awareness.score)}
        {kpi("Reliability", reliability.system)}
        {kpi("Coherence", matrix.cross_layer_coherence)}
        {kpi("Drift Risk", drift.readings.reasoning.drift_score)}
        {kpi("Contradiction Risk", meta.contradiction_risk_score)}
        {kpi("Longevity", longevity.longev)}
      </div>

      <Tabs defaultValue="meta" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="meta">Meta Reasoning</TabsTrigger>
          <TabsTrigger value="awareness">Self Awareness</TabsTrigger>
          <TabsTrigger value="coherence">Coherence</TabsTrigger>
          <TabsTrigger value="reliability">Reliability</TabsTrigger>
          <TabsTrigger value="drift">Drift</TabsTrigger>
          <TabsTrigger value="contradictions">Contradictions</TabsTrigger>
          <TabsTrigger value="reflection">Reflection</TabsTrigger>
          <TabsTrigger value="hallucination">Hallucination Risk</TabsTrigger>
          <TabsTrigger value="stability">Stability</TabsTrigger>
          <TabsTrigger value="longevity">Longevity</TabsTrigger>
          <TabsTrigger value="survival">Strategic Survival</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="meta" className="grid md:grid-cols-2 gap-4">
          <MetaReasoningScoreCard
            score={meta.meta_reasoning_score}
            verdict={meta.verdict}
            drivers={meta.drivers}
          />
          <Card><CardHeader><CardTitle className="text-base">Integrity</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Cognitive Integrity:</span> {meta.cognitive_integrity_score}</p>
              <p><span className="text-muted-foreground">Reasoning Weakness:</span> {meta.reasoning_weakness_score}</p>
              <p><span className="text-muted-foreground">Reasoning Instability:</span> {meta.reasoning_instability_score}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awareness">
          <StrategicSelfAwarenessPanel
            awareness={awareness.score}
            reflectionDepth={awareness.reflection}
            humility={awareness.humility}
            overconfidence={awareness.overconfidence}
            blindZones={awareness.blindZones}
          />
        </TabsContent>

        <TabsContent value="coherence">
          <CoherenceMatrixHeatmap
            cross={matrix.cross_layer_coherence}
            strategic={matrix.strategic_coherence}
            operational={matrix.operational_coherence}
            semantic={matrix.semantic_coherence}
            authority={matrix.authority_coherence}
            governance={matrix.governance_coherence}
            breakpoints={matrix.breakpoints}
          />
        </TabsContent>

        <TabsContent value="reliability">
          <ReliabilityIntegrityCard
            system={reliability.system}
            reasoning={reliability.reasoning}
            decision={reliability.decision}
            forecast={reliability.forecast}
            inconsistency={reliability.inconsistency}
            collapse={reliability.collapse}
          />
        </TabsContent>

        <TabsContent value="drift">
          <ReasoningDriftTimeline
            points={drift.timeline}
            velocity={drift.velocity}
            acceleration={drift.acceleration}
            collapse={drift.collapse}
          />
        </TabsContent>

        <TabsContent value="contradictions">
          <ContradictionRiskPanel
            contradictions={contradictions.list}
            depth={contradictions.depth}
            impact={contradictions.impact}
          />
        </TabsContent>

        <TabsContent value="reflection">
          <SystemicReflectionRadar
            observability={META.observability}
            explainability={META.explainability}
            reflection={meta.systemic_reflection_score}
            integrity={meta.cognitive_integrity_score}
            consensus={META.consensus}
          />
        </TabsContent>

        <TabsContent value="hallucination">
          <StrategicHallucinationAlert
            risk={meta.strategic_hallucination_risk}
            falseConfidence={awareness.falseConfidence}
            drivers={meta.drivers}
          />
        </TabsContent>

        <TabsContent value="stability" className="grid md:grid-cols-2 gap-4">
          <SelfConflictMatrix
            selfConflict={awareness.selfConflict}
            contradiction={meta.contradiction_risk_score}
            overconfidence={awareness.overconfidence}
            falseConfidence={awareness.falseConfidence}
          />
          <Card><CardHeader><CardTitle className="text-base">Stability Layers</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Cognitive Stability:</span> {META.cognitiveStability}</p>
              <p><span className="text-muted-foreground">Orchestration Alignment:</span> {META.orchestrationAlignment}</p>
              <p><span className="text-muted-foreground">Consensus:</span> {META.consensus}</p>
              <p><span className="text-muted-foreground">Observability:</span> {META.observability}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="longevity">
          <LongevityProjectionGauge
            longevity={longevity.longev}
            viability={longevity.viability}
            survival={longevity.survival}
          />
        </TabsContent>

        <TabsContent value="survival">
          <Card>
            <CardHeader><CardTitle className="text-base">Strategic Survival</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Survival Confidence:</span> <strong>{longevity.survival}</strong></p>
              <p><span className="text-muted-foreground">Forecast Reliability:</span> <strong>{reliability.forecast}</strong></p>
              <p><span className="text-muted-foreground">Collapse Probability:</span> <strong>{drift.collapse}</strong></p>
              <p className="text-muted-foreground mt-2">
                Estimativa de sobrevivência cognitiva e estratégica sob condições adversas.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader><CardTitle className="text-base">Sumário Executivo</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="text-muted-foreground">Verdict:</span> <strong>{meta.verdict}</strong></p>
              <p>
                <span className="text-muted-foreground">Meta:</span> {meta.meta_reasoning_score}{" · "}
                <span className="text-muted-foreground">Awareness:</span> {awareness.score}{" · "}
                <span className="text-muted-foreground">Reliability:</span> {reliability.system}{" · "}
                <span className="text-muted-foreground">Coherence:</span> {matrix.cross_layer_coherence}
              </p>
              <p>
                <span className="text-muted-foreground">Drift:</span> {drift.readings.reasoning.drift_score}{" · "}
                <span className="text-muted-foreground">Contradiction:</span> {meta.contradiction_risk_score}{" · "}
                <span className="text-muted-foreground">Hallucination:</span> {meta.strategic_hallucination_risk}
              </p>
              {meta.drivers.length > 0 && (
                <div>
                  <p className="font-medium mt-2">Drivers</p>
                  <ul>{meta.drivers.map((d, i) => <li key={i}>• {d}</li>)}</ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
