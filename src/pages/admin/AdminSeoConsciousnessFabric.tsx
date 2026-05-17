import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import StrategicConsciousnessCard from "@/components/admin/StrategicConsciousnessCard";
import CognitiveStabilityGauge from "@/components/admin/CognitiveStabilityGauge";
import ExecutiveAwarenessPanel from "@/components/admin/ExecutiveAwarenessPanel";
import AdaptiveMaturityRadar from "@/components/admin/AdaptiveMaturityRadar";
import SystemicClarityMap from "@/components/admin/SystemicClarityMap";
import LongitudinalConsistencyTimeline from "@/components/admin/LongitudinalConsistencyTimeline";
import StrategicIdentityPanel from "@/components/admin/StrategicIdentityPanel";
import ExistentialStabilityCard from "@/components/admin/ExistentialStabilityCard";
import ConsciousnessBlindspotsPanel from "@/components/admin/ConsciousnessBlindspotsPanel";
import EvolutionarySurvivabilityGauge from "@/components/admin/EvolutionarySurvivabilityGauge";

import { buildConsciousnessVerdict, type ConsciousnessInputs } from "@/lib/strategicConsciousness";
import {
  calculateCognitiveStability, calculateDecisionConsistency,
  detectReasoningInstability, detectStrategicConflicts,
  estimateCognitiveResilience, estimateStrategicFocus,
  type CognitiveStabilityInputs,
} from "@/lib/cognitiveStability";
import {
  calculateAdaptiveMaturity, estimateEvolutionaryCapacity,
  detectAdaptationFatigue, detectAdaptiveRegression,
  estimateLongTermAdaptability, type AdaptiveInputs,
} from "@/lib/adaptiveAwareness";
import {
  calculateSystemicClarity, calculateOperationalTransparency,
  detectStrategicNoise, detectSemanticFog, estimateDecisionLegibility,
  type ClarityInputs,
} from "@/lib/systemicClarity";
import {
  calculateLongitudinalConsistency, detectStrategicDeviation,
  detectNarrativeMutation, estimateContinuityStrength,
  estimateIdentityPersistence, type LongitudinalInputs,
} from "@/lib/longitudinalConsistency";
import {
  calculateExistentialStability, detectStructuralFragility,
  estimateStrategicLongevity, estimateCollapseResistance,
  estimateEvolutionarySurvivability, type ExistentialInputs,
} from "@/lib/existentialContinuity";

// Read-only demo inputs — no side effects, no public impact.
const CONS: ConsciousnessInputs = {
  awareness: 74, clarity: 72, coherence: 73, identity: 75, adaptability: 70,
  perception: 72, consistency: 73, fragmentation: 28, confusion: 26,
  dissonance: 27, instability: 30, regression: 25,
};
const COG: CognitiveStabilityInputs = {
  reasoning: 73, consistency: 72, resilience: 71, focus: 70,
  fragmentation: 28, confusion: 26, conflicts: 25, noise: 27,
};
const ADP: AdaptiveInputs = {
  adaptability: 70, resilience: 71, evolution: 68, consistency: 72,
  fatigue: 30, regression: 25, rigidity: 28,
};
const CLR: ClarityInputs = {
  clarity: 72, transparency: 70, legibility: 71,
  semanticFog: 28, noise: 27, ambiguity: 26,
};
const LON: LongitudinalInputs = {
  consistency: 73, identity: 75, continuity: 72, narrativeStability: 71,
  drift: 28, mutation: 26,
};
const EXT: ExistentialInputs = {
  stability: 72, resilience: 71, longevity: 70, identity: 75,
  fragility: 28, collapseRisk: 30, decay: 26,
};

export default function AdminSeoConsciousnessFabric() {
  const [saving, setSaving] = useState(false);

  const consciousness = useMemo(() => buildConsciousnessVerdict(CONS), []);
  const cognitive = useMemo(() => ({
    stability: calculateCognitiveStability(COG),
    consistency: calculateDecisionConsistency(COG),
    instabilities: detectReasoningInstability(COG),
    conflicts: detectStrategicConflicts(COG),
    resilience: estimateCognitiveResilience(COG),
    focus: estimateStrategicFocus(COG),
  }), []);
  const adaptive = useMemo(() => ({
    maturity: calculateAdaptiveMaturity(ADP),
    evolutionary: estimateEvolutionaryCapacity(ADP),
    fatigue: detectAdaptationFatigue(ADP),
    regressions: detectAdaptiveRegression(ADP),
    longTerm: estimateLongTermAdaptability(ADP),
  }), []);
  const clarity = useMemo(() => ({
    clarity: calculateSystemicClarity(CLR),
    transparency: calculateOperationalTransparency(CLR),
    legibility: estimateDecisionLegibility(CLR),
    noise: detectStrategicNoise(CLR),
    fog: detectSemanticFog(CLR),
  }), []);
  const longitudinal = useMemo(() => ({
    consistency: calculateLongitudinalConsistency(LON),
    deviation: detectStrategicDeviation(LON),
    mutations: detectNarrativeMutation(LON),
    continuity: estimateContinuityStrength(LON),
    persistence: estimateIdentityPersistence(LON),
  }), []);
  const existential = useMemo(() => ({
    stability: calculateExistentialStability(EXT),
    fragilities: detectStructuralFragility(EXT),
    longevity: estimateStrategicLongevity(EXT),
    resistance: estimateCollapseResistance(EXT),
    survivability: estimateEvolutionarySurvivability(EXT),
  }), []);

  const operationalCoherence = Math.round((cognitive.stability + clarity.clarity + adaptive.maturity) / 3);

  const captureSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("seo_consciousness_fabric_snapshots").insert([{
        strategic_consciousness_score: consciousness.strategic_consciousness_score,
        cognitive_stability_score: cognitive.stability,
        executive_awareness_score: consciousness.executive_awareness_score,
        adaptive_maturity_score: adaptive.maturity,
        systemic_clarity_score: clarity.clarity,
        operational_coherence_score: operationalCoherence,
        longitudinal_consistency_score: longitudinal.consistency,
        strategic_identity_score: consciousness.strategic_identity_score,
        existential_stability_score: existential.stability,
        evolutionary_awareness_score: adaptive.evolutionary,
        cognitive_fragmentation_score: COG.fragmentation,
        strategic_confusion_score: COG.confusion,
        executive_dissonance_score: CONS.dissonance,
        systemic_instability_score: CONS.instability,
        adaptive_regression_score: ADP.regression,
        dominant_pattern: consciousness.strengths[0] ?? "none",
        dominant_instability: consciousness.instabilitySignals[0] ?? existential.fragilities[0] ?? "none",
        consciousness_verdict: consciousness.verdict,
        notes: consciousness.summary,
      }]);
      if (error) throw error;
      toast.success("Consciousness snapshot capturado.");
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
            <Eye className="h-6 w-6" /> Strategic Consciousness Fabric
          </h1>
          <p className="text-sm text-muted-foreground">
            Camada de consciência estratégica — read-only, safe mode. Fase 15.7.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Capturando..." : "Capture Consciousness Fabric Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpi("Consciousness", consciousness.strategic_consciousness_score)}
        {kpi("Awareness", consciousness.executive_awareness_score)}
        {kpi("Adaptive", adaptive.maturity)}
        {kpi("Coherence", operationalCoherence)}
        {kpi("Survivability", existential.survivability)}
        {kpi("Identity", consciousness.strategic_identity_score)}
        {kpi("Verdict", consciousness.verdict)}
      </div>

      <Tabs defaultValue="consciousness" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="consciousness">Strategic Consciousness</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive Stability</TabsTrigger>
          <TabsTrigger value="awareness">Executive Awareness</TabsTrigger>
          <TabsTrigger value="adaptive">Adaptive Maturity</TabsTrigger>
          <TabsTrigger value="clarity">Systemic Clarity</TabsTrigger>
          <TabsTrigger value="coherence">Operational Coherence</TabsTrigger>
          <TabsTrigger value="longitudinal">Longitudinal Consistency</TabsTrigger>
          <TabsTrigger value="identity">Strategic Identity</TabsTrigger>
          <TabsTrigger value="existential">Existential Stability</TabsTrigger>
          <TabsTrigger value="blindspots">Blindspots</TabsTrigger>
          <TabsTrigger value="survivability">Evolutionary Survivability</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="consciousness">
          <StrategicConsciousnessCard
            score={consciousness.strategic_consciousness_score}
            verdict={consciousness.verdict}
            summary={consciousness.summary}
            strengths={consciousness.strengths}
          />
        </TabsContent>

        <TabsContent value="cognitive">
          <CognitiveStabilityGauge
            stability={cognitive.stability}
            consistency={cognitive.consistency}
            resilience={cognitive.resilience}
            focus={cognitive.focus}
            instabilities={[...cognitive.instabilities, ...cognitive.conflicts]}
          />
        </TabsContent>

        <TabsContent value="awareness">
          <ExecutiveAwarenessPanel
            awareness={consciousness.executive_awareness_score}
            perception={consciousness.perception_score}
            warnings={consciousness.executiveWarnings}
          />
        </TabsContent>

        <TabsContent value="adaptive">
          <AdaptiveMaturityRadar
            maturity={adaptive.maturity}
            evolutionary={adaptive.evolutionary}
            longTerm={adaptive.longTerm}
            fatigue={adaptive.fatigue}
            regressions={adaptive.regressions}
          />
        </TabsContent>

        <TabsContent value="clarity">
          <SystemicClarityMap
            clarity={clarity.clarity}
            transparency={clarity.transparency}
            legibility={clarity.legibility}
            noise={clarity.noise}
            fog={clarity.fog}
          />
        </TabsContent>

        <TabsContent value="coherence">
          <Card>
            <CardHeader><CardTitle className="text-base">Operational Coherence</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-4xl font-bold">{operationalCoherence}</div>
              <p><span className="text-muted-foreground">Cognitive Stability:</span> {cognitive.stability}</p>
              <p><span className="text-muted-foreground">Systemic Clarity:</span> {clarity.clarity}</p>
              <p><span className="text-muted-foreground">Adaptive Maturity:</span> {adaptive.maturity}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="longitudinal">
          <LongitudinalConsistencyTimeline
            consistency={longitudinal.consistency}
            continuity={longitudinal.continuity}
            persistence={longitudinal.persistence}
            deviation={longitudinal.deviation}
            mutations={longitudinal.mutations}
          />
        </TabsContent>

        <TabsContent value="identity">
          <StrategicIdentityPanel
            identity={consciousness.strategic_identity_score}
            persistence={longitudinal.persistence}
            coherence={longitudinal.consistency}
          />
        </TabsContent>

        <TabsContent value="existential">
          <ExistentialStabilityCard
            stability={existential.stability}
            longevity={existential.longevity}
            collapseResistance={existential.resistance}
            fragilities={existential.fragilities}
          />
        </TabsContent>

        <TabsContent value="blindspots">
          <ConsciousnessBlindspotsPanel
            blindspots={consciousness.blindspots}
            warnings={consciousness.executiveWarnings}
          />
        </TabsContent>

        <TabsContent value="survivability">
          <EvolutionarySurvivabilityGauge
            survivability={existential.survivability}
            longevity={existential.longevity}
            resistance={existential.resistance}
            evolutionary={adaptive.evolutionary}
          />
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader><CardTitle className="text-base">Sumário Executivo</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="text-muted-foreground">Verdict:</span> <strong>{consciousness.verdict}</strong></p>
              <p>{consciousness.summary}</p>
              {consciousness.recommendations.length > 0 && (
                <div><p className="font-medium mt-2">Recommendations</p>
                  <ul>{consciousness.recommendations.map((r, i) => <li key={i}>• {r}</li>)}</ul></div>
              )}
              {consciousness.blindspots.length > 0 && (
                <div><p className="font-medium mt-2">Blindspots</p>
                  <ul>{consciousness.blindspots.map((b, i) => <li key={i}>• {b}</li>)}</ul></div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
