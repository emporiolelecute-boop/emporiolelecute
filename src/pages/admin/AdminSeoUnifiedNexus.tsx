import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hexagon, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import UnifiedNexusCard from "@/components/admin/UnifiedNexusCard";
import StrategicUnificationGauge from "@/components/admin/StrategicUnificationGauge";
import SystemicHarmonyMatrix from "@/components/admin/SystemicHarmonyMatrix";
import SemanticAlignmentRadar from "@/components/admin/SemanticAlignmentRadar";
import OperationalHarmonyPanel from "@/components/admin/OperationalHarmonyPanel";
import StrategicTruthCard from "@/components/admin/StrategicTruthCard";
import ResilienceUnificationMap from "@/components/admin/ResilienceUnificationMap";
import FragmentationRiskPanel from "@/components/admin/FragmentationRiskPanel";
import NexusSynchronizationTimeline from "@/components/admin/NexusSynchronizationTimeline";
import ExecutiveEntropyGauge from "@/components/admin/ExecutiveEntropyGauge";

import { buildNexusVerdict, type NexusInputs } from "@/lib/unifiedStrategicNexus";
import {
  calculateSystemicHarmony as calcSysHarmony, estimateCrossLayerAlignment,
  detectLayerDissonance, detectStrategicAsymmetry, estimateOperationalSynchronization,
  type SystemicHarmonyInputs,
} from "@/lib/systemicHarmony";
import {
  calculateSemanticAlignment, detectSemanticDrift, estimateSemanticCoherence,
  detectSemanticFragmentation, estimateKnowledgeIntegrity,
  type SemanticAlignmentInputs,
} from "@/lib/semanticAlignment";
import {
  calculateOperationalHarmony, estimateExecutionSynchronization,
  detectOperationalConflict, estimateOperationalFlow, detectExecutionNoise,
  type OperationalHarmonyInputs,
} from "@/lib/operationalHarmony";
import {
  calculateStrategicTruth, estimateNarrativeIntegrity, detectStrategicFalseSignals,
  estimateRealityAlignment, detectStrategicContradictions,
  type StrategicTruthInputs,
} from "@/lib/strategicTruthAlignment";
import {
  calculateUnifiedResilience, estimateSystemicRecoveryCapacity,
  detectCascadeWeakness, estimateResilienceSynchronization, estimateContinuityResilience,
  type ResilienceUnificationInputs,
} from "@/lib/resilienceUnification";

// Read-only demo inputs — no side effects, no public impact.
const NEX: NexusInputs = {
  governance: 74, consciousness: 73, reality: 72, continuity: 73, executive: 74,
  fabric: 72, resilience: 73, semantic: 72,
  fragmentation: 26, instability: 25, divergence: 24, entropy: 27,
};
const SH: SystemicHarmonyInputs = {
  alignment: 73, synchronization: 72, coherence: 74, dissonance: 26, asymmetry: 25,
};
const SA: SemanticAlignmentInputs = {
  alignment: 73, coherence: 74, knowledge: 72, drift: 26, fragmentation: 25,
};
const OH: OperationalHarmonyInputs = {
  flow: 73, synchronization: 72, reliability: 74, conflict: 26, noise: 25,
};
const ST: StrategicTruthInputs = {
  truth: 74, narrative: 73, reality: 72, falseSignals: 25, contradictions: 24,
};
const RU: ResilienceUnificationInputs = {
  resilience: 74, recovery: 72, synchronization: 73, cascadeWeakness: 26, fragility: 25,
};

export default function AdminSeoUnifiedNexus() {
  const [saving, setSaving] = useState(false);

  const nexus = useMemo(() => buildNexusVerdict(NEX), []);
  const harmony = useMemo(() => ({
    score: calcSysHarmony(SH),
    alignment: estimateCrossLayerAlignment(SH),
    synchronization: estimateOperationalSynchronization(SH),
    dissonances: detectLayerDissonance(SH),
    asymmetries: detectStrategicAsymmetry(SH),
  }), []);
  const semantic = useMemo(() => ({
    alignment: calculateSemanticAlignment(SA),
    coherence: estimateSemanticCoherence(SA),
    knowledge: estimateKnowledgeIntegrity(SA),
    drifts: detectSemanticDrift(SA),
    fragmentation: detectSemanticFragmentation(SA),
  }), []);
  const operational = useMemo(() => ({
    harmony: calculateOperationalHarmony(OH),
    synchronization: estimateExecutionSynchronization(OH),
    flow: estimateOperationalFlow(OH),
    conflicts: detectOperationalConflict(OH),
    noises: detectExecutionNoise(OH),
  }), []);
  const truth = useMemo(() => ({
    score: calculateStrategicTruth(ST),
    narrative: estimateNarrativeIntegrity(ST),
    reality: estimateRealityAlignment(ST),
    falseSignals: detectStrategicFalseSignals(ST),
    contradictions: detectStrategicContradictions(ST),
  }), []);
  const resilience = useMemo(() => ({
    unified: calculateUnifiedResilience(RU),
    recovery: estimateSystemicRecoveryCapacity(RU),
    synchronization: estimateResilienceSynchronization(RU),
    continuity: estimateContinuityResilience(RU),
    cascades: detectCascadeWeakness(RU),
  }), []);

  const governanceStability = Math.round((NEX.governance + NEX.consciousness + nexus.systemic_harmony_score) / 3);
  const continuityAlignment = Math.round((NEX.continuity + nexus.strategic_unification_score + harmony.alignment) / 3);
  const executiveClarity = Math.round((NEX.executive + truth.narrative + nexus.unified_nexus_score) / 3);
  const executiveEntropy = Math.round((NEX.entropy + NEX.instability + NEX.fragmentation) / 3);
  const operationalDisruption = Math.round((OH.conflict + OH.noise + NEX.fragmentation) / 3);

  const captureSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("seo_unified_nexus_snapshots").insert([{
        unified_nexus_score: nexus.unified_nexus_score,
        strategic_unification_score: nexus.strategic_unification_score,
        systemic_coherence_score: harmony.alignment,
        operational_harmony_score: operational.harmony,
        semantic_alignment_score: semantic.alignment,
        governance_stability_score: governanceStability,
        resilience_unification_score: resilience.unified,
        continuity_alignment_score: continuityAlignment,
        executive_clarity_score: executiveClarity,
        strategic_truth_score: truth.score,
        systemic_fragmentation_score: NEX.fragmentation,
        strategic_instability_score: NEX.instability,
        semantic_divergence_score: NEX.divergence,
        operational_disruption_score: operationalDisruption,
        executive_entropy_score: executiveEntropy,
        dominant_systemic_signal: nexus.strengths[0] ?? "none",
        dominant_systemic_risk: nexus.fragmentationSignals[0] ?? nexus.instabilityVectors[0] ?? "none",
        nexus_verdict: nexus.verdict,
        notes: nexus.summary,
      }]);
      if (error) throw error;
      toast.success("Nexus snapshot capturado.");
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
            <Hexagon className="h-6 w-6" /> SEO Unified Strategic Nexus
          </h1>
          <p className="text-sm text-muted-foreground">
            Síntese mestre da estratégia SEO — read-only, safe mode. Fase 16.0.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Capturando..." : "Capture Nexus Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpi("Nexus", nexus.unified_nexus_score)}
        {kpi("Unification", nexus.strategic_unification_score)}
        {kpi("Harmony", nexus.systemic_harmony_score)}
        {kpi("Semantic", semantic.alignment)}
        {kpi("Op. Harmony", operational.harmony)}
        {kpi("Resilience", resilience.unified)}
        {kpi("Verdict", nexus.verdict)}
      </div>

      <Tabs defaultValue="nexus" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="nexus">Unified Nexus</TabsTrigger>
          <TabsTrigger value="unification">Strategic Unification</TabsTrigger>
          <TabsTrigger value="harmony">Systemic Harmony</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Alignment</TabsTrigger>
          <TabsTrigger value="operational">Operational Harmony</TabsTrigger>
          <TabsTrigger value="truth">Strategic Truth</TabsTrigger>
          <TabsTrigger value="governance">Governance Stability</TabsTrigger>
          <TabsTrigger value="resilience">Resilience Unification</TabsTrigger>
          <TabsTrigger value="continuity">Continuity Alignment</TabsTrigger>
          <TabsTrigger value="fragmentation">Fragmentation Risks</TabsTrigger>
          <TabsTrigger value="entropy">Executive Entropy</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="nexus">
          <UnifiedNexusCard
            score={nexus.unified_nexus_score}
            verdict={nexus.verdict}
            summary={nexus.summary}
            strengths={nexus.strengths}
          />
        </TabsContent>

        <TabsContent value="unification">
          <StrategicUnificationGauge
            unification={nexus.strategic_unification_score}
            harmony={nexus.systemic_harmony_score}
            resilience={nexus.unified_resilience_score}
          />
        </TabsContent>

        <TabsContent value="harmony">
          <SystemicHarmonyMatrix
            harmony={harmony.score}
            alignment={harmony.alignment}
            synchronization={harmony.synchronization}
            dissonances={[...harmony.dissonances, ...harmony.asymmetries]}
          />
        </TabsContent>

        <TabsContent value="semantic">
          <SemanticAlignmentRadar
            alignment={semantic.alignment}
            coherence={semantic.coherence}
            knowledge={semantic.knowledge}
            drifts={[...semantic.drifts, ...semantic.fragmentation]}
          />
        </TabsContent>

        <TabsContent value="operational">
          <OperationalHarmonyPanel
            harmony={operational.harmony}
            synchronization={operational.synchronization}
            flow={operational.flow}
            conflicts={[...operational.conflicts, ...operational.noises]}
          />
        </TabsContent>

        <TabsContent value="truth">
          <StrategicTruthCard
            truth={truth.score}
            narrative={truth.narrative}
            reality={truth.reality}
            contradictions={[...truth.contradictions, ...truth.falseSignals]}
          />
        </TabsContent>

        <TabsContent value="governance">
          <Card>
            <CardHeader><CardTitle className="text-base">Governance Stability</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-4xl font-bold">{governanceStability}</div>
              <p><span className="text-muted-foreground">Governance Layer:</span> {NEX.governance}</p>
              <p><span className="text-muted-foreground">Consciousness Layer:</span> {NEX.consciousness}</p>
              <p><span className="text-muted-foreground">Systemic Harmony:</span> {nexus.systemic_harmony_score}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resilience">
          <ResilienceUnificationMap
            resilience={resilience.unified}
            recovery={resilience.recovery}
            synchronization={resilience.synchronization}
            cascades={resilience.cascades}
          />
        </TabsContent>

        <TabsContent value="continuity">
          <Card>
            <CardHeader><CardTitle className="text-base">Continuity Alignment</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-4xl font-bold">{continuityAlignment}</div>
              <p><span className="text-muted-foreground">Continuity Layer:</span> {NEX.continuity}</p>
              <p><span className="text-muted-foreground">Continuity Resilience:</span> {resilience.continuity}</p>
              <p><span className="text-muted-foreground">Strategic Unification:</span> {nexus.strategic_unification_score}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fragmentation">
          <FragmentationRiskPanel
            fragmentation={NEX.fragmentation}
            divergence={NEX.divergence}
            instability={NEX.instability}
            signals={[...nexus.fragmentationSignals, ...nexus.instabilityVectors]}
          />
        </TabsContent>

        <TabsContent value="entropy">
          <ExecutiveEntropyGauge
            entropy={executiveEntropy}
            disruption={operationalDisruption}
            instability={NEX.instability}
            warnings={nexus.executiveWarnings}
          />
        </TabsContent>

        <TabsContent value="summary">
          <div className="space-y-4">
            <NexusSynchronizationTimeline
              unification={nexus.strategic_unification_score}
              harmony={nexus.systemic_harmony_score}
              alignment={harmony.alignment}
              resilience={resilience.unified}
            />
            <Card>
              <CardHeader><CardTitle className="text-base">Sumário Executivo</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><span className="text-muted-foreground">Verdict:</span> <strong>{nexus.verdict}</strong></p>
                <p>{nexus.summary}</p>
                {nexus.recommendations.length > 0 && (
                  <div><p className="font-medium mt-2">Recommendations</p>
                    <ul>{nexus.recommendations.map((r, i) => <li key={i}>• {r}</li>)}</ul></div>
                )}
                {nexus.executiveWarnings.length > 0 && (
                  <div><p className="font-medium mt-2">Executive Warnings</p>
                    <ul>{nexus.executiveWarnings.map((w, i) => <li key={i}>• {w}</li>)}</ul></div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
