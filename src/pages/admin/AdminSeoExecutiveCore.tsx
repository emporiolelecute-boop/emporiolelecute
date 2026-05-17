import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import ExecutiveCoreScoreCard from "@/components/admin/ExecutiveCoreScoreCard";
import StrategicAlignmentMatrix from "@/components/admin/StrategicAlignmentMatrix";
import HiddenRiskPanel from "@/components/admin/HiddenRiskPanel";
import SystemicCollapseRadar from "@/components/admin/SystemicCollapseRadar";
import ExecutionAlignmentGauge from "@/components/admin/ExecutionAlignmentGauge";
import StrategicContinuityTimeline from "@/components/admin/StrategicContinuityTimeline";
import ExecutiveNarrativePanel from "@/components/admin/ExecutiveNarrativePanel";
import SustainabilityProjectionCard from "@/components/admin/SustainabilityProjectionCard";
import StrategicResilienceMap from "@/components/admin/StrategicResilienceMap";
import ExecutivePriorityMatrix from "@/components/admin/ExecutivePriorityMatrix";

import { buildExecutiveSynthesisCore, type ExecutiveInputs } from "@/lib/executiveSynthesisCore";
import { buildSystemicStrategyLayer, type StrategyLayerInputs } from "@/lib/systemicStrategyLayer";
import { detectHiddenRisks, estimateCascadeExposure, type HiddenRiskInputs } from "@/lib/hiddenRiskEngine";
import {
  calculateExecutionAlignment, estimateExecutionReliability,
  estimateExecutionPressure, estimateExecutionCollapse, type ExecutionInputs,
} from "@/lib/executionAlignment";
import {
  calculateStrategicContinuity, calculateLongTermViability,
  calculateStrategicLongevity, estimateStrategicDecay,
  estimateSustainabilityProjection, detectContinuityBreakpoints,
  type ContinuityInputs,
} from "@/lib/strategicContinuity";
import { buildExecutiveNarrative } from "@/lib/executiveNarrativeEngine";

// Read-only demo inputs; no side effects on public SEO.
const EXEC: ExecutiveInputs = {
  strategicCoherence: 72, strategicAlignment: 70, executionAlignment: 66,
  governanceScore: 74, semanticIntegrity: 70, authorityBalance: 71,
  metaReasoning: 70, cognitiveStability: 72, observability: 66,
  explainability: 64, decisionConfidence: 76, consensus: 70,
  contradictionPressure: 30, conflictDensity: 25, hallucinationRisk: 28,
  driftScore: 32, collapseRisk: 35, fragmentation: 30,
  longevity: 70, scalability: 68, resilience: 71, forecastReliability: 70,
};
const STRAT: StrategyLayerInputs = {
  coherence: 72, alignment: 70, governance: 74, semanticIntegrity: 70,
  authorityBalance: 71, observability: 66, fragmentation: 30, noise: 28,
  drift: 32, conflicts: 25,
};
const RISK: HiddenRiskInputs = {
  fragmentation: 30, hallucination: 28, drift: 32, collapseRisk: 35,
  semanticInstability: 32, governanceGap: 28, authorityDispersion: 30,
  hiddenDependency: 38, clusterDependency: 42, conflicts: 25,
};
const EXEC_ALIGN: ExecutionInputs = {
  strategicAlignment: 70, operationalAlignment: 66, fragmentation: 30,
  drift: 32, noise: 28, consensus: 70, governance: 74, pressure: 40,
};
const CONT: ContinuityInputs = {
  coherence: 72, resilience: 71, governance: 74, longevity: 70,
  scalability: 68, collapseRisk: 35, decayRate: 30, fragmentation: 30,
};

export default function AdminSeoExecutiveCore() {
  const [saving, setSaving] = useState(false);

  const synthesis = useMemo(() => buildExecutiveSynthesisCore(EXEC), []);
  const strategy = useMemo(() => buildSystemicStrategyLayer(STRAT), []);
  const risks = useMemo(() => detectHiddenRisks(RISK), []);
  const cascade = useMemo(() => estimateCascadeExposure(risks), [risks]);

  const execAlign = useMemo(() => ({
    alignment: calculateExecutionAlignment(EXEC_ALIGN),
    reliability: estimateExecutionReliability(EXEC_ALIGN),
    pressure: estimateExecutionPressure(EXEC_ALIGN),
    collapse: estimateExecutionCollapse(EXEC_ALIGN),
  }), []);

  const continuity = useMemo(() => ({
    continuity: calculateStrategicContinuity(CONT),
    viability: calculateLongTermViability(CONT),
    longevity: calculateStrategicLongevity(CONT),
    decay: estimateStrategicDecay(CONT),
    sustainability: estimateSustainabilityProjection(CONT),
    breakpoints: detectContinuityBreakpoints(CONT),
  }), []);

  const narrative = useMemo(() => buildExecutiveNarrative(synthesis, risks), [synthesis, risks]);

  const captureSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("seo_executive_core_snapshots").insert([{
        executive_core_score: synthesis.executive_core_score,
        systemic_strategy_score: synthesis.systemic_strategy_score,
        strategic_alignment_score: synthesis.strategic_alignment_score,
        execution_alignment_score: synthesis.execution_alignment_score,
        operational_sustainability_score: synthesis.operational_sustainability_score,
        strategic_resilience_score: synthesis.strategic_resilience_score,
        systemic_stability_score: EXEC.cognitiveStability,
        orchestration_integrity_score: EXEC.observability,
        intelligence_integrity_score: EXEC.metaReasoning,
        governance_integrity_score: EXEC.governanceScore,
        semantic_integrity_score: EXEC.semanticIntegrity,
        authority_integrity_score: EXEC.authorityBalance,
        hidden_risk_score: cascade,
        collapse_exposure_score: synthesis.collapse_exposure_score,
        strategic_fragility_score: EXEC.fragmentation,
        execution_fragility_score: execAlign.collapse,
        governance_fragility_score: 100 - EXEC.governanceScore,
        semantic_fragility_score: 100 - EXEC.semanticIntegrity,
        long_term_viability_score: continuity.viability,
        strategic_continuity_score: continuity.continuity,
        scalability_viability_score: CONT.scalability,
        sustainability_projection_score: continuity.sustainability,
        future_collapse_probability: execAlign.collapse,
        strategic_signal_quality: strategy.integrity,
        systemic_confidence_score: EXEC.decisionConfidence,
        decision_reliability_score: EXEC.decisionConfidence,
        coherence_depth_score: strategy.continuity,
        explainability_depth_score: EXEC.explainability,
        executive_summary: { verdict: synthesis.verdict, summary: narrative.summary },
        executive_priorities: narrative.priorities,
        executive_risks: narrative.risks,
        executive_recommendations: narrative.actions,
        notes: `verdict=${synthesis.verdict}`,
      }]);
      if (error) throw error;
      toast.success("Executive Core snapshot capturado.");
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
            <Crown className="h-6 w-6" /> Executive Core
          </h1>
          <p className="text-sm text-muted-foreground">
            Núcleo executivo consolidado — read-only, safe mode. Fase 15.5.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Capturando..." : "Capture Executive Core Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpi("Executive Core", synthesis.executive_core_score)}
        {kpi("Strategic Alignment", synthesis.strategic_alignment_score)}
        {kpi("Sustainability", synthesis.operational_sustainability_score)}
        {kpi("Hidden Risk", cascade)}
        {kpi("Collapse Exposure", synthesis.collapse_exposure_score)}
        {kpi("Continuity", continuity.continuity)}
        {kpi("Long-Term Viability", continuity.viability)}
      </div>

      <Tabs defaultValue="core" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="core">Executive Core</TabsTrigger>
          <TabsTrigger value="strategy">Strategy Layer</TabsTrigger>
          <TabsTrigger value="alignment">Strategic Alignment</TabsTrigger>
          <TabsTrigger value="execution">Execution Alignment</TabsTrigger>
          <TabsTrigger value="hidden">Hidden Risks</TabsTrigger>
          <TabsTrigger value="collapse">Collapse Exposure</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="continuity">Continuity</TabsTrigger>
          <TabsTrigger value="resilience">Resilience</TabsTrigger>
          <TabsTrigger value="narrative">Narrative</TabsTrigger>
          <TabsTrigger value="viability">Long-Term Viability</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="grid md:grid-cols-2 gap-4">
          <ExecutiveCoreScoreCard
            score={synthesis.executive_core_score}
            verdict={synthesis.verdict}
            drivers={synthesis.drivers}
          />
          <Card><CardHeader><CardTitle className="text-base">Core Breakdown</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Systemic Strategy:</span> {synthesis.systemic_strategy_score}</p>
              <p><span className="text-muted-foreground">Resilience:</span> {synthesis.strategic_resilience_score}</p>
              <p><span className="text-muted-foreground">Sustainability:</span> {synthesis.operational_sustainability_score}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy">
          <Card>
            <CardHeader><CardTitle className="text-base">Systemic Strategy Layer</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-3xl font-bold">{strategy.strategy_score}</div>
              <p><span className="text-muted-foreground">Continuity:</span> {strategy.continuity}</p>
              <p><span className="text-muted-foreground">Integrity:</span> {strategy.integrity}</p>
              <p><span className="text-muted-foreground">Propagation:</span> {strategy.propagation}</p>
              <p><span className="text-muted-foreground">Compression:</span> {strategy.compression}</p>
              <p className="pt-2 text-muted-foreground">{strategy.narrative}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alignment">
          <StrategicAlignmentMatrix
            strategic={synthesis.strategic_alignment_score}
            execution={synthesis.execution_alignment_score}
            governance={EXEC.governanceScore}
            semantic={EXEC.semanticIntegrity}
            authority={EXEC.authorityBalance}
            misalignments={synthesis.misalignments}
          />
        </TabsContent>

        <TabsContent value="execution">
          <ExecutionAlignmentGauge
            alignment={execAlign.alignment}
            reliability={execAlign.reliability}
            pressure={execAlign.pressure}
            collapse={execAlign.collapse}
          />
        </TabsContent>

        <TabsContent value="hidden">
          <HiddenRiskPanel risks={risks} cascade={cascade} />
        </TabsContent>

        <TabsContent value="collapse">
          <SystemicCollapseRadar
            exposure={synthesis.collapse_exposure_score}
            collapseRisk={EXEC.collapseRisk}
            fragmentation={EXEC.fragmentation}
            drift={EXEC.driftScore}
            breakpoints={synthesis.breakpoints}
          />
        </TabsContent>

        <TabsContent value="sustainability">
          <SustainabilityProjectionCard
            projection={continuity.sustainability}
            longevity={continuity.longevity}
            scalability={CONT.scalability}
            decay={continuity.decay}
          />
        </TabsContent>

        <TabsContent value="continuity">
          <StrategicContinuityTimeline
            continuity={continuity.continuity}
            longevity={continuity.longevity}
            viability={continuity.viability}
            decay={continuity.decay}
            breakpoints={continuity.breakpoints}
          />
        </TabsContent>

        <TabsContent value="resilience">
          <StrategicResilienceMap
            resilience={synthesis.strategic_resilience_score}
            forecast={EXEC.forecastReliability}
            cognitiveStability={EXEC.cognitiveStability}
            fragmentation={EXEC.fragmentation}
          />
        </TabsContent>

        <TabsContent value="narrative" className="grid md:grid-cols-2 gap-4">
          <ExecutiveNarrativePanel narrative={narrative} />
          <ExecutivePriorityMatrix priorities={narrative.priorities} actions={narrative.actions} />
        </TabsContent>

        <TabsContent value="viability">
          <Card>
            <CardHeader><CardTitle className="text-base">Long-Term Viability</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-3xl font-bold">{continuity.viability}</div>
              <p><span className="text-muted-foreground">Longevity:</span> {continuity.longevity}</p>
              <p><span className="text-muted-foreground">Scalability:</span> {CONT.scalability}</p>
              <p><span className="text-muted-foreground">Sustainability Projection:</span> {continuity.sustainability}</p>
              <p><span className="text-muted-foreground">Decay:</span> {continuity.decay}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader><CardTitle className="text-base">Sumário Executivo</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="text-muted-foreground">Verdict:</span> <strong>{synthesis.verdict}</strong></p>
              <p>{narrative.summary}</p>
              {narrative.priorities.length > 0 && (
                <div><p className="font-medium mt-2">Priorities</p>
                  <ul>{narrative.priorities.map((p, i) => <li key={i}>• {p}</li>)}</ul></div>
              )}
              {narrative.actions.length > 0 && (
                <div><p className="font-medium mt-2">Actions</p>
                  <ul>{narrative.actions.map((a, i) => <li key={i}>• {a}</li>)}</ul></div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
