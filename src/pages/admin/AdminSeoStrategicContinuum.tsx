import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Infinity as InfinityIcon, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import StrategicContinuumCard from "@/components/admin/StrategicContinuumCard";
import ContinuityStrengthGauge from "@/components/admin/ContinuityStrengthGauge";
import OperationalPersistencePanel from "@/components/admin/OperationalPersistencePanel";
import SemanticContinuityMap from "@/components/admin/SemanticContinuityMap";
import AuthorityContinuityRadar from "@/components/admin/AuthorityContinuityRadar";
import ResilienceContinuumCard from "@/components/admin/ResilienceContinuumCard";
import EntropyResistancePanel from "@/components/admin/EntropyResistancePanel";
import PersistenceTimeline from "@/components/admin/PersistenceTimeline";
import ContinuityBreakRiskPanel from "@/components/admin/ContinuityBreakRiskPanel";
import StrategicLongevityGauge from "@/components/admin/StrategicLongevityGauge";

import { buildContinuumVerdict, type ContinuumInputs } from "@/lib/strategicContinuum";
import {
  calculateOperationalPersistence, estimateExecutionDurability,
  detectExecutionDecay, estimateOperationalLongevity, estimateMaintenanceSustainability,
  type OperationalPersistenceInputs,
} from "@/lib/operationalPersistence";
import {
  calculateSemanticContinuity, detectSemanticDecay,
  estimateTopicalPersistence, estimateKnowledgeLongevity, detectSemanticFragmentation,
  type SemanticContinuityInputs,
} from "@/lib/semanticContinuity";
import {
  calculateAuthorityContinuity, detectAuthorityDecay,
  estimateAuthorityLongevity, estimateAuthorityPersistence, detectAuthorityInstability,
  type AuthorityContinuityInputs,
} from "@/lib/authorityContinuity";
import {
  calculateResilienceContinuity, estimateRecoveryPersistence,
  detectResilienceWeakening, estimateLongTermRecoveryCapacity, estimateContinuumElasticity,
  type ResilienceContinuumInputs,
} from "@/lib/resilienceContinuum";
import {
  calculateEntropyResistance, detectEntropyAcceleration,
  estimateStructuralPersistence, estimateDecayPressure, estimateSystemicDurability,
  type EntropyResistanceInputs,
} from "@/lib/entropyResistance";

// Read-only demo inputs — no side effects, no public impact.
const CONT: ContinuumInputs = {
  continuity: 74, persistence: 73, longevity: 72, resilience: 74, semantic: 73,
  authority: 72, entropy: 28, decay: 26, fragmentation: 25, instability: 24,
};
const OPP: OperationalPersistenceInputs = {
  durability: 73, reliability: 72, maintenance: 71, longevity: 72, decay: 27, fatigue: 26,
};
const SEM: SemanticContinuityInputs = {
  topical: 73, knowledge: 72, coherence: 74, decay: 26, fragmentation: 25, instability: 24,
};
const AUT: AuthorityContinuityInputs = {
  authority: 73, longevity: 72, persistence: 71, decay: 26, fragmentation: 25, instability: 24,
};
const RES: ResilienceContinuumInputs = {
  resilience: 74, recovery: 72, elasticity: 71, fragility: 27, weakening: 25,
};
const ENT: EntropyResistanceInputs = {
  structure: 73, durability: 72, persistence: 71, entropy: 28, acceleration: 26, pressure: 27,
};

export default function AdminSeoStrategicContinuum() {
  const [saving, setSaving] = useState(false);

  const continuum = useMemo(() => buildContinuumVerdict(CONT), []);
  const operational = useMemo(() => ({
    persistence: calculateOperationalPersistence(OPP),
    durability: estimateExecutionDurability(OPP),
    longevity: estimateOperationalLongevity(OPP),
    maintenance: estimateMaintenanceSustainability(OPP),
    decays: detectExecutionDecay(OPP),
  }), []);
  const semantic = useMemo(() => ({
    continuity: calculateSemanticContinuity(SEM),
    topical: estimateTopicalPersistence(SEM),
    knowledge: estimateKnowledgeLongevity(SEM),
    decays: detectSemanticDecay(SEM),
    fragmentation: detectSemanticFragmentation(SEM),
  }), []);
  const authority = useMemo(() => ({
    continuity: calculateAuthorityContinuity(AUT),
    longevity: estimateAuthorityLongevity(AUT),
    persistence: estimateAuthorityPersistence(AUT),
    decays: detectAuthorityDecay(AUT),
    instabilities: detectAuthorityInstability(AUT),
  }), []);
  const resilience = useMemo(() => ({
    continuity: calculateResilienceContinuity(RES),
    recovery: estimateRecoveryPersistence(RES),
    longTerm: estimateLongTermRecoveryCapacity(RES),
    elasticity: estimateContinuumElasticity(RES),
    weakening: detectResilienceWeakening(RES),
  }), []);
  const entropy = useMemo(() => ({
    resistance: calculateEntropyResistance(ENT),
    structural: estimateStructuralPersistence(ENT),
    pressure: estimateDecayPressure(ENT),
    durability: estimateSystemicDurability(ENT),
    accelerations: detectEntropyAcceleration(ENT),
  }), []);

  const executionContinuity = Math.round((operational.persistence + operational.durability + resilience.continuity) / 3);
  const systemicPersistence = Math.round((continuum.persistence_capacity_score + entropy.resistance + authority.continuity) / 3);
  const breakRisk = Math.round((CONT.entropy + CONT.fragmentation + CONT.decay) / 3);

  const captureSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("seo_continuum_snapshots").insert([{
        strategic_continuum_score: continuum.strategic_continuum_score,
        continuity_strength_score: continuum.continuity_strength_score,
        operational_persistence_score: operational.persistence,
        semantic_continuity_score: semantic.continuity,
        authority_continuity_score: authority.continuity,
        resilience_continuity_score: resilience.continuity,
        execution_continuity_score: executionContinuity,
        strategic_longevity_score: continuum.strategic_longevity_score,
        entropy_resistance_score: entropy.resistance,
        systemic_persistence_score: systemicPersistence,
        continuity_break_risk_score: breakRisk,
        entropy_accumulation_score: CONT.entropy,
        execution_decay_score: OPP.decay,
        semantic_instability_score: SEM.instability,
        authority_fragmentation_score: AUT.fragmentation,
        dominant_continuity_signal: continuum.strengths[0] ?? continuum.persistenceSignals[0] ?? "none",
        dominant_decay_signal: continuum.decaySignals[0] ?? continuum.continuityWarnings[0] ?? "none",
        continuum_verdict: continuum.verdict,
        notes: continuum.summary,
      }]);
      if (error) throw error;
      toast.success("Continuum snapshot capturado.");
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
            <InfinityIcon className="h-6 w-6" /> Strategic Continuum Core
          </h1>
          <p className="text-sm text-muted-foreground">
            Continuidade e persistência estratégica — read-only, safe mode. Fase 15.9.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Capturando..." : "Capture Continuum Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpi("Continuum", continuum.strategic_continuum_score)}
        {kpi("Persistence", continuum.persistence_capacity_score)}
        {kpi("Longevity", continuum.strategic_longevity_score)}
        {kpi("Resilience", resilience.continuity)}
        {kpi("Entropy R.", entropy.resistance)}
        {kpi("Exec. Durab.", operational.durability)}
        {kpi("Verdict", continuum.verdict)}
      </div>

      <Tabs defaultValue="continuum" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="continuum">Strategic Continuum</TabsTrigger>
          <TabsTrigger value="strength">Continuity Strength</TabsTrigger>
          <TabsTrigger value="operational">Operational Persistence</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Continuity</TabsTrigger>
          <TabsTrigger value="authority">Authority Continuity</TabsTrigger>
          <TabsTrigger value="resilience">Resilience Continuum</TabsTrigger>
          <TabsTrigger value="entropy">Entropy Resistance</TabsTrigger>
          <TabsTrigger value="durability">Execution Durability</TabsTrigger>
          <TabsTrigger value="longevity">Strategic Longevity</TabsTrigger>
          <TabsTrigger value="risks">Continuity Risks</TabsTrigger>
          <TabsTrigger value="decay">Decay Signals</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="continuum">
          <StrategicContinuumCard
            score={continuum.strategic_continuum_score}
            verdict={continuum.verdict}
            summary={continuum.summary}
            strengths={continuum.strengths}
          />
        </TabsContent>

        <TabsContent value="strength">
          <ContinuityStrengthGauge
            strength={continuum.continuity_strength_score}
            persistence={continuum.persistence_capacity_score}
            signals={continuum.persistenceSignals}
          />
        </TabsContent>

        <TabsContent value="operational">
          <OperationalPersistencePanel
            persistence={operational.persistence}
            durability={operational.durability}
            longevity={operational.longevity}
            decays={operational.decays}
          />
        </TabsContent>

        <TabsContent value="semantic">
          <SemanticContinuityMap
            continuity={semantic.continuity}
            topical={semantic.topical}
            knowledge={semantic.knowledge}
            fragmentation={semantic.fragmentation}
          />
        </TabsContent>

        <TabsContent value="authority">
          <AuthorityContinuityRadar
            authority={authority.continuity}
            longevity={authority.longevity}
            persistence={authority.persistence}
            instabilities={authority.instabilities}
          />
        </TabsContent>

        <TabsContent value="resilience">
          <ResilienceContinuumCard
            resilience={resilience.continuity}
            recovery={resilience.recovery}
            elasticity={resilience.elasticity}
            weakening={resilience.weakening}
          />
        </TabsContent>

        <TabsContent value="entropy">
          <EntropyResistancePanel
            resistance={entropy.resistance}
            structural={entropy.structural}
            pressure={entropy.pressure}
            accelerations={entropy.accelerations}
          />
        </TabsContent>

        <TabsContent value="durability">
          <Card>
            <CardHeader><CardTitle className="text-base">Execution Durability</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-4xl font-bold">{operational.durability}</div>
              <p><span className="text-muted-foreground">Maintenance Sustainability:</span> {operational.maintenance}</p>
              <p><span className="text-muted-foreground">Operational Longevity:</span> {operational.longevity}</p>
              <p><span className="text-muted-foreground">Systemic Durability:</span> {entropy.durability}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="longevity">
          <StrategicLongevityGauge
            longevity={continuum.strategic_longevity_score}
            persistence={continuum.persistence_capacity_score}
            resistance={entropy.resistance}
          />
        </TabsContent>

        <TabsContent value="risks">
          <ContinuityBreakRiskPanel
            breakRisk={breakRisk}
            entropy={CONT.entropy}
            fragmentation={CONT.fragmentation}
            warnings={continuum.continuityWarnings}
          />
        </TabsContent>

        <TabsContent value="decay">
          <Card>
            <CardHeader><CardTitle className="text-base">Decay Signals</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {continuum.decaySignals.length === 0 && <p className="text-muted-foreground">Sem sinais relevantes.</p>}
              <ul>{continuum.decaySignals.map((d, i) => <li key={`c-${i}`}>• {d}</li>)}</ul>
              <ul>{operational.decays.map((d, i) => <li key={`o-${i}`}>• {d}</li>)}</ul>
              <ul>{semantic.decays.map((d, i) => <li key={`s-${i}`}>• {d}</li>)}</ul>
              <ul>{authority.decays.map((d, i) => <li key={`a-${i}`}>• {d}</li>)}</ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <div className="space-y-4">
            <PersistenceTimeline
              continuity={continuum.continuity_strength_score}
              persistence={continuum.persistence_capacity_score}
              durability={operational.durability}
              longevity={continuum.strategic_longevity_score}
            />
            <Card>
              <CardHeader><CardTitle className="text-base">Sumário Executivo</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><span className="text-muted-foreground">Verdict:</span> <strong>{continuum.verdict}</strong></p>
                <p>{continuum.summary}</p>
                {continuum.recommendations.length > 0 && (
                  <div><p className="font-medium mt-2">Recommendations</p>
                    <ul>{continuum.recommendations.map((r, i) => <li key={i}>• {r}</li>)}</ul></div>
                )}
                {continuum.continuityWarnings.length > 0 && (
                  <div><p className="font-medium mt-2">Continuity Warnings</p>
                    <ul>{continuum.continuityWarnings.map((w, i) => <li key={i}>• {w}</li>)}</ul></div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
