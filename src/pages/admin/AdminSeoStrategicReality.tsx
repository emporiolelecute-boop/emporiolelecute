import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import StrategicRealityCard from "@/components/admin/StrategicRealityCard";
import OperationalTruthGauge from "@/components/admin/OperationalTruthGauge";
import SemanticGroundingMatrix from "@/components/admin/SemanticGroundingMatrix";
import SignalIntegrityPanel from "@/components/admin/SignalIntegrityPanel";
import RealityDistortionMap from "@/components/admin/RealityDistortionMap";
import SurvivabilityRealityCard from "@/components/admin/SurvivabilityRealityCard";
import StrategicAuthenticityPanel from "@/components/admin/StrategicAuthenticityPanel";
import SystemicTruthRadar from "@/components/admin/SystemicTruthRadar";
import IllusionRiskPanel from "@/components/admin/IllusionRiskPanel";
import RealityConsistencyTimeline from "@/components/admin/RealityConsistencyTimeline";

import { buildRealityVerdict, type RealityInputs } from "@/lib/strategicReality";
import {
  calculateOperationalTruth, estimateExecutionHonesty,
  detectOperationalFiction, detectArtificialMomentum,
  estimateExecutionReliability, estimateOperationalTransparency,
  type OperationalTruthInputs,
} from "@/lib/operationalTruth";
import {
  calculateSemanticGrounding, detectSemanticHallucination,
  detectAuthorityInflation, estimateSemanticReality, estimateKnowledgeGrounding,
  type SemanticGroundingInputs,
} from "@/lib/semanticGrounding";
import {
  calculateLongTermViability, estimateCollapseProbability,
  estimateRecoveryReality, detectFalseResilience, estimateSurvivalIntegrity,
  type SurvivabilityInputs,
} from "@/lib/survivabilityRealism";
import {
  calculateSignalClarity, detectSignalPollution, detectStrategicNoise,
  estimateDecisionSignalStrength, estimateSignalTrustworthiness,
  type SignalInputs,
} from "@/lib/signalIntegrity";
import {
  calculateSystemicTruth, calculateStrategicCoherence,
  detectNarrativeFalsehoods, detectSystemicContradictions,
  estimateRealityConsistency, type SystemicTruthInputs,
} from "@/lib/systemicTruth";

// Read-only demo inputs — no side effects, no public impact.
const REAL: RealityInputs = {
  truthAlignment: 73, authenticity: 74, grounding: 72, credibility: 71,
  coherence: 72, consistency: 73, illusion: 28, selfDeception: 26,
  distortion: 27, fiction: 25,
};
const OPT: OperationalTruthInputs = {
  honesty: 73, reliability: 72, transparency: 71, reproducibility: 70,
  artificialMomentum: 28, fiction: 25, noise: 27,
};
const SEM: SemanticGroundingInputs = {
  grounding: 72, knowledge: 70, hallucination: 26,
  authorityInflation: 28, evidence: 71, consistency: 72,
};
const SUR: SurvivabilityInputs = {
  viability: 71, resilience: 72, recovery: 70,
  fragility: 28, collapseRisk: 30, falseResilience: 26, survivalGap: 24,
};
const SIG: SignalInputs = {
  clarity: 72, trust: 71, fidelity: 70, noise: 27, pollution: 26, bias: 24,
};
const SYS: SystemicTruthInputs = {
  truth: 73, coherence: 72, consistency: 73,
  contradictions: 25, falsehoods: 24, narrativeDrift: 26,
};

export default function AdminSeoStrategicReality() {
  const [saving, setSaving] = useState(false);

  const reality = useMemo(() => buildRealityVerdict(REAL), []);
  const operational = useMemo(() => ({
    truth: calculateOperationalTruth(OPT),
    honesty: estimateExecutionHonesty(OPT),
    reliability: estimateExecutionReliability(OPT),
    transparency: estimateOperationalTransparency(OPT),
    fictions: detectOperationalFiction(OPT),
    artificialMomentum: detectArtificialMomentum(OPT),
  }), []);
  const semantic = useMemo(() => ({
    grounding: calculateSemanticGrounding(SEM),
    knowledge: estimateKnowledgeGrounding(SEM),
    hallucination: detectSemanticHallucination(SEM),
    inflations: detectAuthorityInflation(SEM),
    semanticReality: estimateSemanticReality(SEM),
  }), []);
  const survivability = useMemo(() => ({
    viability: calculateLongTermViability(SUR),
    collapseProbability: estimateCollapseProbability(SUR),
    recovery: estimateRecoveryReality(SUR),
    falseSignals: detectFalseResilience(SUR),
    integrity: estimateSurvivalIntegrity(SUR),
  }), []);
  const signal = useMemo(() => ({
    clarity: calculateSignalClarity(SIG),
    pollution: detectSignalPollution(SIG),
    noises: detectStrategicNoise(SIG),
    strength: estimateDecisionSignalStrength(SIG),
    trust: estimateSignalTrustworthiness(SIG),
  }), []);
  const systemic = useMemo(() => ({
    truth: calculateSystemicTruth(SYS),
    coherence: calculateStrategicCoherence(SYS),
    falsehoods: detectNarrativeFalsehoods(SYS),
    contradictions: detectSystemicContradictions(SYS),
    consistency: estimateRealityConsistency(SYS),
  }), []);

  const sustainabilityRealism = Math.round((survivability.viability + survivability.recovery + operational.reliability) / 3);
  const resilienceRealism = Math.round((survivability.integrity + signal.trust + systemic.consistency) / 3);
  const executionCredibility = Math.round((operational.honesty + operational.reliability + reality.strategic_authenticity_score) / 3);

  const captureSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("seo_strategic_reality_snapshots").insert([{
        strategic_reality_score: reality.strategic_reality_score,
        operational_truth_score: operational.truth,
        semantic_grounding_score: semantic.grounding,
        execution_credibility_score: executionCredibility,
        sustainability_realism_score: sustainabilityRealism,
        resilience_realism_score: resilienceRealism,
        systemic_truth_score: systemic.truth,
        long_term_viability_score: survivability.viability,
        strategic_authenticity_score: reality.strategic_authenticity_score,
        signal_clarity_score: signal.clarity,
        illusion_risk_score: REAL.illusion,
        strategic_self_deception_score: REAL.selfDeception,
        semantic_distortion_score: REAL.distortion,
        operational_fiction_score: OPT.fiction,
        survivability_gap_score: SUR.survivalGap,
        dominant_truth: reality.strengths[0] ?? "none",
        dominant_distortion: reality.distortions[0] ?? reality.illusionSignals[0] ?? "none",
        reality_verdict: reality.verdict,
        notes: reality.summary,
      }]);
      if (error) throw error;
      toast.success("Reality snapshot capturado.");
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
            <Compass className="h-6 w-6" /> Strategic Reality Engine
          </h1>
          <p className="text-sm text-muted-foreground">
            Diagnóstico de realismo estratégico — read-only, safe mode. Fase 15.8.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Capturando..." : "Capture Reality Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpi("Reality", reality.strategic_reality_score)}
        {kpi("Op. Truth", operational.truth)}
        {kpi("Grounding", semantic.grounding)}
        {kpi("Authenticity", reality.strategic_authenticity_score)}
        {kpi("Survivability", survivability.viability)}
        {kpi("Signal", signal.clarity)}
        {kpi("Verdict", reality.verdict)}
      </div>

      <Tabs defaultValue="reality" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="reality">Strategic Reality</TabsTrigger>
          <TabsTrigger value="operational">Operational Truth</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Grounding</TabsTrigger>
          <TabsTrigger value="credibility">Execution Credibility</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability Realism</TabsTrigger>
          <TabsTrigger value="signal">Signal Integrity</TabsTrigger>
          <TabsTrigger value="survivability">Survivability Reality</TabsTrigger>
          <TabsTrigger value="authenticity">Strategic Authenticity</TabsTrigger>
          <TabsTrigger value="systemic">Systemic Truth</TabsTrigger>
          <TabsTrigger value="distortions">Distortions</TabsTrigger>
          <TabsTrigger value="illusions">Illusion Risks</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="reality">
          <StrategicRealityCard
            score={reality.strategic_reality_score}
            verdict={reality.verdict}
            summary={reality.summary}
            strengths={reality.strengths}
          />
        </TabsContent>

        <TabsContent value="operational">
          <OperationalTruthGauge
            truth={operational.truth}
            honesty={operational.honesty}
            reliability={operational.reliability}
            transparency={operational.transparency}
            fictions={operational.fictions}
          />
        </TabsContent>

        <TabsContent value="semantic">
          <SemanticGroundingMatrix
            grounding={semantic.grounding}
            knowledge={semantic.knowledge}
            hallucination={semantic.hallucination}
            inflations={semantic.inflations}
          />
        </TabsContent>

        <TabsContent value="credibility">
          <Card>
            <CardHeader><CardTitle className="text-base">Execution Credibility</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-4xl font-bold">{executionCredibility}</div>
              <p><span className="text-muted-foreground">Operational Honesty:</span> {operational.honesty}</p>
              <p><span className="text-muted-foreground">Reliability:</span> {operational.reliability}</p>
              <p><span className="text-muted-foreground">Authenticity:</span> {reality.strategic_authenticity_score}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability">
          <Card>
            <CardHeader><CardTitle className="text-base">Sustainability Realism</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-4xl font-bold">{sustainabilityRealism}</div>
              <p><span className="text-muted-foreground">Viability:</span> {survivability.viability}</p>
              <p><span className="text-muted-foreground">Recovery Reality:</span> {survivability.recovery}</p>
              <p><span className="text-muted-foreground">Resilience Realism:</span> {resilienceRealism}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signal">
          <SignalIntegrityPanel
            clarity={signal.clarity}
            trust={signal.trust}
            strength={signal.strength}
            pollution={signal.pollution}
            noises={signal.noises}
          />
        </TabsContent>

        <TabsContent value="survivability">
          <SurvivabilityRealityCard
            viability={survivability.viability}
            recovery={survivability.recovery}
            collapseProbability={survivability.collapseProbability}
            integrity={survivability.integrity}
            falseSignals={survivability.falseSignals}
          />
        </TabsContent>

        <TabsContent value="authenticity">
          <StrategicAuthenticityPanel
            authenticity={reality.strategic_authenticity_score}
            credibility={executionCredibility}
            selfDeception={REAL.selfDeception}
          />
        </TabsContent>

        <TabsContent value="systemic">
          <SystemicTruthRadar
            truth={systemic.truth}
            coherence={systemic.coherence}
            contradictions={systemic.contradictions}
            falsehoods={systemic.falsehoods}
          />
        </TabsContent>

        <TabsContent value="distortions">
          <RealityDistortionMap
            distortions={reality.distortions}
            warnings={reality.operationalWarnings}
          />
        </TabsContent>

        <TabsContent value="illusions">
          <IllusionRiskPanel
            illusionRisk={REAL.illusion}
            selfDeception={REAL.selfDeception}
            artificialMomentum={operational.artificialMomentum}
            signals={reality.illusionSignals}
          />
        </TabsContent>

        <TabsContent value="summary">
          <div className="space-y-4">
            <RealityConsistencyTimeline
              consistency={systemic.consistency}
              truth={systemic.truth}
              coherence={systemic.coherence}
              distortion={REAL.distortion}
            />
            <Card>
              <CardHeader><CardTitle className="text-base">Sumário Executivo</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><span className="text-muted-foreground">Verdict:</span> <strong>{reality.verdict}</strong></p>
                <p>{reality.summary}</p>
                {reality.recommendations.length > 0 && (
                  <div><p className="font-medium mt-2">Recommendations</p>
                    <ul>{reality.recommendations.map((r, i) => <li key={i}>• {r}</li>)}</ul></div>
                )}
                {reality.distortions.length > 0 && (
                  <div><p className="font-medium mt-2">Distortions</p>
                    <ul>{reality.distortions.map((d, i) => <li key={i}>• {d}</li>)}</ul></div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
