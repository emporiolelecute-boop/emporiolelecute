import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import GovernanceMatrixCard from "@/components/admin/GovernanceMatrixCard";
import StrategicIntegrityGauge from "@/components/admin/StrategicIntegrityGauge";
import GovernanceMatrixEntropyPanel from "@/components/admin/GovernanceMatrixEntropyPanel";
import ExecutiveCoherenceMap from "@/components/admin/ExecutiveCoherenceMap";
import PredictabilityTimeline from "@/components/admin/PredictabilityTimeline";
import IntegrityBreachPanel from "@/components/admin/IntegrityBreachPanel";
import EvolutionaryStabilityCard from "@/components/admin/EvolutionaryStabilityCard";
import GovernanceResilienceRadar from "@/components/admin/GovernanceResilienceRadar";
import NarrativeConsistencyPanel from "@/components/admin/NarrativeConsistencyPanel";
import GovernanceCollapseRiskCard from "@/components/admin/GovernanceCollapseRiskCard";

import { calculateGovernanceMatrix, type GovernanceMatrixInputs } from "@/lib/governanceMatrix";
import {
  estimateStrategicPredictability, estimateOperationalVariance,
  estimateGovernanceDrift, detectInstabilityVectors, detectNarrativeDissonance,
  estimateLongTermGovernanceHealth, classifyPredictability, type PredictiveInputs,
} from "@/lib/predictiveGovernance";
import {
  calculateStructuralIntegrity, calculateSemanticIntegrity,
  calculateExecutionIntegrity, calculateAuthorityIntegrity,
  detectIntegrityBreaches, estimateIntegrityRecoveryDifficulty,
  type IntegrityInputs,
} from "@/lib/systemicIntegrity";
import {
  estimateEvolutionaryStability, estimateAdaptiveConsistency,
  detectEvolutionaryRegression, detectGovernanceMutationRisk,
  estimateLongTermEvolutionCapacity, type EvolutionInputs,
} from "@/lib/evolutionaryGovernance";
import {
  calculateGovernanceResilience, detectGovernanceWeakZones,
  estimateRecoveryElasticity, estimateCascadeProtection,
  estimateStrategicSurvivalProbability, type ResilienceInputs,
} from "@/lib/governanceResilienceMatrix";
import {
  calculateExecutiveCoherence, calculateNarrativeConsistency,
  detectExecutiveContradictions, detectStrategicNoise,
  estimateLeadershipClarity, type CoherenceInputs,
} from "@/lib/executiveCoherence";

// Read-only demo inputs; no side effects on public SEO.
const GOV: GovernanceMatrixInputs = {
  strategicCoherence: 72, alignment: 70, governance: 74, semanticIntegrity: 70,
  authorityBalance: 71, observability: 66, consensus: 70, predictability: 72,
  evolutionCapacity: 68, fragmentation: 30, conflicts: 25, drift: 30, noise: 28,
  collapseRisk: 35,
};
const PRED: PredictiveInputs = {
  consensus: 70, alignment: 70, governance: 74, noise: 28, drift: 30,
  fragmentation: 30, collapseRisk: 35, narrativeCoherence: 72,
};
const INT: IntegrityInputs = {
  structuralCohesion: 72, semanticIntegrity: 70, authorityBalance: 71,
  executionAlignment: 68, fragmentation: 30, drift: 30, conflicts: 25,
};
const EVO: EvolutionInputs = {
  consistency: 70, resilience: 71, governance: 74, drift: 30,
  fragmentation: 30, decayRate: 28, longevity: 70, scalability: 68,
};
const RES: ResilienceInputs = {
  resilience: 71, governance: 74, consensus: 70, collapseRisk: 35,
  fragmentation: 30, drift: 30, recoverySpeed: 68, cascadeImpact: 32,
};
const COH: CoherenceInputs = {
  strategicCoherence: 72, alignment: 70, consensus: 70, narrativeCoherence: 72,
  noise: 28, conflicts: 25, contradictions: 26,
};

export default function AdminSeoGovernanceMatrix() {
  const [saving, setSaving] = useState(false);

  const matrix = useMemo(() => calculateGovernanceMatrix(GOV), []);
  const predictability = useMemo(() => {
    const score = estimateStrategicPredictability(PRED);
    const variance = estimateOperationalVariance(PRED);
    return {
      score, variance,
      drift: estimateGovernanceDrift(PRED),
      vectors: detectInstabilityVectors(PRED),
      dissonance: detectNarrativeDissonance(PRED),
      health: estimateLongTermGovernanceHealth(PRED),
      klass: classifyPredictability(score, variance),
    };
  }, []);
  const integrity = useMemo(() => {
    const breaches = detectIntegrityBreaches(INT);
    return {
      structural: calculateStructuralIntegrity(INT),
      semantic: calculateSemanticIntegrity(INT),
      execution: calculateExecutionIntegrity(INT),
      authority: calculateAuthorityIntegrity(INT),
      breaches,
      recovery: estimateIntegrityRecoveryDifficulty(breaches),
    };
  }, []);
  const evolution = useMemo(() => ({
    stability: estimateEvolutionaryStability(EVO),
    adaptive: estimateAdaptiveConsistency(EVO),
    regression: detectEvolutionaryRegression(EVO),
    mutation: detectGovernanceMutationRisk(EVO),
    capacity: estimateLongTermEvolutionCapacity(EVO),
  }), []);
  const resilience = useMemo(() => ({
    resilience: calculateGovernanceResilience(RES),
    weakZones: detectGovernanceWeakZones(RES),
    recovery: estimateRecoveryElasticity(RES),
    cascade: estimateCascadeProtection(RES),
    survival: estimateStrategicSurvivalProbability(RES),
  }), []);
  const coherence = useMemo(() => ({
    coherence: calculateExecutiveCoherence(COH),
    narrative: calculateNarrativeConsistency(COH),
    contradictions: detectExecutiveContradictions(COH),
    noise: detectStrategicNoise(COH),
    clarity: estimateLeadershipClarity(COH),
  }), []);

  const captureSnapshot = async () => {
    setSaving(true);
    try {
      const dominant_risk = matrix.governanceRisks[0] ?? matrix.blockers[0] ?? "none";
      const dominant_strength = matrix.strengths[0] ?? "none";
      const { error } = await supabase.from("seo_governance_matrix_snapshots").insert([{
        governance_matrix_score: matrix.governance_matrix_score,
        strategic_integrity_score: matrix.strategic_integrity_score,
        systemic_alignment_score: matrix.systemic_alignment_score,
        operational_predictability_score: predictability.score,
        autonomous_stability_score: matrix.autonomous_stability_score,
        evolutionary_consistency_score: evolution.adaptive,
        governance_entropy_score: matrix.governance_entropy_score,
        strategic_cohesion_score: matrix.strategic_cohesion_score,
        execution_integrity_score: matrix.execution_integrity_score,
        resilience_projection_score: resilience.resilience,
        collapse_exposure_score: GOV.collapseRisk,
        strategic_fragmentation_score: GOV.fragmentation,
        operational_conflict_score: GOV.conflicts,
        semantic_drift_score: GOV.drift,
        executive_noise_score: GOV.noise,
        dominant_risk,
        dominant_strength,
        governance_verdict: matrix.verdict,
        notes: matrix.summary,
      }]);
      if (error) throw error;
      toast.success("Governance snapshot capturado.");
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
            <ShieldCheck className="h-6 w-6" /> Autonomous Governance Matrix
          </h1>
          <p className="text-sm text-muted-foreground">
            Governança estratégica consolidada — read-only, safe mode. Fase 15.6.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Capturando..." : "Capture Governance Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpi("Governance", matrix.governance_matrix_score)}
        {kpi("Integrity", matrix.strategic_integrity_score)}
        {kpi("Predictability", predictability.score)}
        {kpi("Entropy", matrix.governance_entropy_score)}
        {kpi("Coherence", coherence.coherence)}
        {kpi("Resilience", resilience.resilience)}
        {kpi("Survival", resilience.survival)}
      </div>

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="matrix">Governance Matrix</TabsTrigger>
          <TabsTrigger value="integrity">Strategic Integrity</TabsTrigger>
          <TabsTrigger value="predictability">Predictability</TabsTrigger>
          <TabsTrigger value="entropy">Governance Entropy</TabsTrigger>
          <TabsTrigger value="coherence">Executive Coherence</TabsTrigger>
          <TabsTrigger value="systemic">Systemic Integrity</TabsTrigger>
          <TabsTrigger value="evolution">Evolutionary Stability</TabsTrigger>
          <TabsTrigger value="resilience">Resilience Matrix</TabsTrigger>
          <TabsTrigger value="narrative">Narrative Consistency</TabsTrigger>
          <TabsTrigger value="collapse">Collapse Exposure</TabsTrigger>
          <TabsTrigger value="drift">Governance Drift</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <GovernanceMatrixCard
            score={matrix.governance_matrix_score}
            verdict={matrix.verdict}
            summary={matrix.summary}
            strengths={matrix.strengths}
          />
        </TabsContent>

        <TabsContent value="integrity">
          <StrategicIntegrityGauge
            integrity={matrix.strategic_integrity_score}
            structural={integrity.structural}
            semantic={integrity.semantic}
            authority={integrity.authority}
          />
        </TabsContent>

        <TabsContent value="predictability">
          <PredictabilityTimeline
            predictability={predictability.score}
            variance={predictability.variance}
            drift={predictability.drift}
            health={predictability.health}
            klass={predictability.klass}
            vectors={predictability.vectors}
          />
        </TabsContent>

        <TabsContent value="entropy">
          <GovernanceMatrixEntropyPanel
            entropy={matrix.governance_entropy_score}
            signals={matrix.instabilitySignals}
            risks={matrix.governanceRisks}
          />
        </TabsContent>

        <TabsContent value="coherence">
          <ExecutiveCoherenceMap
            coherence={coherence.coherence}
            narrative={coherence.narrative}
            contradictions={coherence.contradictions}
            clarity={coherence.clarity}
            noise={coherence.noise}
          />
        </TabsContent>

        <TabsContent value="systemic">
          <IntegrityBreachPanel
            breaches={integrity.breaches}
            recoveryDifficulty={integrity.recovery}
          />
        </TabsContent>

        <TabsContent value="evolution">
          <EvolutionaryStabilityCard
            stability={evolution.stability}
            adaptive={evolution.adaptive}
            mutationRisk={evolution.mutation}
            capacity={evolution.capacity}
            regression={evolution.regression}
          />
        </TabsContent>

        <TabsContent value="resilience">
          <GovernanceResilienceRadar
            resilience={resilience.resilience}
            recovery={resilience.recovery}
            cascadeProtection={resilience.cascade}
            survival={resilience.survival}
            weakZones={resilience.weakZones}
          />
        </TabsContent>

        <TabsContent value="narrative">
          <NarrativeConsistencyPanel
            consistency={coherence.narrative}
            dissonance={predictability.dissonance}
            clarity={coherence.clarity}
          />
        </TabsContent>

        <TabsContent value="collapse">
          <GovernanceCollapseRiskCard
            collapse={GOV.collapseRisk}
            entropy={matrix.governance_entropy_score}
            fragmentation={GOV.fragmentation}
            conflicts={GOV.conflicts}
            blockers={matrix.blockers}
          />
        </TabsContent>

        <TabsContent value="drift">
          <Card>
            <CardHeader><CardTitle className="text-base">Governance Drift</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-3xl font-bold">{predictability.drift}</div>
              <p><span className="text-muted-foreground">Variance:</span> {predictability.variance}</p>
              <p><span className="text-muted-foreground">Long-Term Health:</span> {predictability.health}</p>
              <p><span className="text-muted-foreground">Mutation Risk:</span> {evolution.mutation}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader><CardTitle className="text-base">Sumário Executivo</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="text-muted-foreground">Verdict:</span> <strong>{matrix.verdict}</strong></p>
              <p>{matrix.summary}</p>
              {matrix.recommendations.length > 0 && (
                <div><p className="font-medium mt-2">Recommendations</p>
                  <ul>{matrix.recommendations.map((r, i) => <li key={i}>• {r}</li>)}</ul></div>
              )}
              {matrix.blockers.length > 0 && (
                <div><p className="font-medium mt-2">Blockers</p>
                  <ul>{matrix.blockers.map((b, i) => <li key={i}>• {b}</li>)}</ul></div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
