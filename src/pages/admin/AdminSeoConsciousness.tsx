import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import ConsciousnessScoreCard from "@/components/admin/ConsciousnessScoreCard";
import MetaIntelligencePanel from "@/components/admin/MetaIntelligencePanel";
import SystemicCoherenceMap from "@/components/admin/SystemicCoherenceMap";
import CognitiveLoadGauge from "@/components/admin/CognitiveLoadGauge";
import ExistentialRiskCard from "@/components/admin/ExistentialRiskCard";
import StrategicBlindspotsPanel from "@/components/admin/StrategicBlindspotsPanel";
import SemanticConfusionMatrix from "@/components/admin/SemanticConfusionMatrix";
import OperationalDissonancePanel from "@/components/admin/OperationalDissonancePanel";
import SurvivalProbabilityGauge from "@/components/admin/SurvivalProbabilityGauge";
import AwarenessCollapseAlert from "@/components/admin/AwarenessCollapseAlert";

import type { TelemetrySnapshot } from "@/lib/seoTelemetry";
import {
  calculateSystemConsciousness, calculateSemanticAwareness, calculateOperationalAwareness,
  calculateStrategicAwareness, detectCognitiveFatigue, detectSemanticConfusion,
  detectAwarenessCollapse, buildConsciousnessVerdict,
} from "@/lib/consciousnessEngine";
import { buildMetaIntelligenceMap } from "@/lib/metaIntelligenceEngine";
import { buildCoherenceMap } from "@/lib/systemicCoherenceEngine";
import {
  calculateCognitiveLoad, detectOperationalFatigue, detectSemanticOverload,
  detectStrategicExhaustion, estimateRecoveryCapacity, calculateMentalPressureMap, buildFatigueForecast,
} from "@/lib/cognitiveLoadEngine";
import {
  detectExistentialThreats, estimateExistentialRisk, detectSemanticIdentityLoss,
  estimateRecoveryProbability, calculateSystemSurvivalScore, buildExistentialMitigationPlan,
} from "@/lib/existentialRiskEngine";

// Mock telemetry slice for read-only diagnostics. Real flow would inject from Authority Center.
const MOCK_TELEMETRY: Partial<TelemetrySnapshot> = {
  system_health_score: 64, sustainability_score: 60, resilience_score: 62, collapse_risk_score: 32,
  semantic_fatigue_score: 38, strategic_alignment_score: 65, semantic_connectivity_score: 58,
  semantic_stability_score: 64, knowledge_health_score: 60, semantic_entropy_score: 42,
  operational_score: 66, execution_efficiency: 62, recovery_capacity_score: 58, operational_debt_score: 36,
  execution_focus_score: 60, adaptive_intelligence_score: 60, strategic_fatigue_score: 34,
  maintenance_pressure_score: 40, bottleneck_score: 28, semantic_noise_score: 30, meaning_dilution_score: 25,
  fragmentation_score: 30, cascade_failure_risk: 28, cascade_collapse_risk: 25,
  strategic_singularity_score: 58, strategic_consistency_score: 62, volatility_score: 32,
  risk_pressure_score: 38, momentum_growth_score: 60, orphan_entities: 4, content_gap_count: 6,
  fragile_cluster_count: 2, under_monetized_score: 45, strategic_blackhole_score: 30,
  saturation_score: 35, topic_exhaustion_score: 30, adaptive_capacity_score: 60,
  authority_dependency_risk: 45, long_term_decay_risk: 32, maintenance_explosion_risk: 38,
  semantic_aging_score: 40, cluster_failure_probability: 25, execution_efficiency_score: 60,
  execution_noise_score: 28, operational_waste_score: 30, semantic_balance_score: 62,
  orphan_cluster_count: 1, authority_growth_projection: 55,
};

export default function AdminSeoConsciousness() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const data = useMemo(() => {
    const t = MOCK_TELEMETRY as TelemetrySnapshot;
    const consciousness = calculateSystemConsciousness(t);
    const semanticAware = calculateSemanticAwareness(t);
    const operationalAware = calculateOperationalAwareness(t);
    const strategicAware = calculateStrategicAwareness(t);
    const fatigue = detectCognitiveFatigue(t);
    const confusion = detectSemanticConfusion(t);
    const collapse = detectAwarenessCollapse(t);
    const verdict = buildConsciousnessVerdict(t);
    const meta = buildMetaIntelligenceMap(t);
    const coherence = buildCoherenceMap(t);
    const load = calculateCognitiveLoad(t);
    const opFatigue = detectOperationalFatigue(t);
    const overload = detectSemanticOverload(t);
    const exhaustion = detectStrategicExhaustion(t);
    const recovery = estimateRecoveryCapacity(t);
    const pressureMap = calculateMentalPressureMap(t);
    const fatigueForecast = buildFatigueForecast(t);
    const threats = detectExistentialThreats(t);
    const risk = estimateExistentialRisk(t);
    const identityLoss = detectSemanticIdentityLoss(t);
    const recoveryProb = estimateRecoveryProbability(t);
    const survival = calculateSystemSurvivalScore(t);
    const mitigation = buildExistentialMitigationPlan(t);
    return {
      t, consciousness, semanticAware, operationalAware, strategicAware,
      fatigue, confusion, collapse, verdict, meta, coherence,
      load, opFatigue, overload, exhaustion, recovery, pressureMap, fatigueForecast,
      threats, risk, identityLoss, recoveryProb, survival, mitigation,
    };
  }, []);

  const captureSnapshot = async () => {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const payload: any = {
      consciousness_type: "executive_snapshot",
      entity_scope: "global",
      awareness_score: data.consciousness,
      systemic_coherence: data.coherence.coherence,
      semantic_consciousness: data.semanticAware,
      operational_consciousness: data.operationalAware,
      adaptive_consciousness: data.t.adaptive_intelligence_score ?? 0,
      cognitive_load: data.load,
      cognitive_fatigue: data.fatigue,
      semantic_alignment: 100 - data.coherence.misalignment,
      strategic_clarity: data.meta.perception,
      systemic_instability: data.t.volatility_score ?? 0,
      semantic_confusion: data.confusion,
      evolutionary_coherence: data.coherence.evolutionary,
      strategic_awareness: data.strategicAware,
      intelligence_density: data.meta.meta,
      entropy_pressure: data.t.semantic_entropy_score ?? 0,
      collapse_awareness: data.collapse,
      resilience_awareness: data.recovery,
      meta_intelligence_score: data.meta.meta,
      consciousness_snapshot: {
        verdict: data.verdict,
        meta: data.meta,
        coherence: data.coherence,
      },
      detected_signals: [
        ...data.meta.blindspots.map((b) => ({ kind: "blindspot", ...b })),
        ...data.coherence.contradictions.map((c) => ({ kind: "contradiction", ...c })),
        ...data.threats.map((th) => ({ kind: "threat", ...th })),
      ],
      executive_summary: {
        survival: data.survival,
        existential_risk: data.risk,
        recovery_probability: data.recoveryProb,
        mitigation: data.mitigation,
      },
      created_by: u.user?.id ?? null,
    };
    const { error } = await (supabase as any).from("seo_consciousness_memory").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Erro ao salvar snapshot", description: error.message, variant: "destructive" });
    else toast({ title: "Snapshot de consciência capturado", description: "Persistido em seo_consciousness_memory." });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Consciousness</h1>
          <p className="text-sm text-muted-foreground">
            Camada de meta-inteligência — somente diagnóstico. Safe Mode absoluto.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          {saving ? "Salvando…" : "Capture Consciousness Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="System Consciousness" value={data.consciousness} />
        <Kpi label="Meta Intelligence" value={data.meta.meta} />
        <Kpi label="Systemic Coherence" value={data.coherence.coherence} />
        <Kpi label="Strategic Awareness" value={data.strategicAware} />
        <Kpi label="Cognitive Fatigue" value={data.fatigue} />
        <Kpi label="Semantic Stability" value={100 - data.confusion} />
        <Kpi label="Existential Risk" value={data.risk} suffix="%" />
        <Kpi label="Survival Probability" value={data.survival} suffix="%" />
        <Kpi label="Strategic Clarity" value={data.meta.perception} />
        <Kpi label="Intelligence Density" value={data.meta.meta} />
        <Kpi label="Awareness Stability" value={100 - data.collapse} />
        <Kpi label="Semantic Identity" value={100 - data.identityLoss} />
      </div>

      <Tabs defaultValue="consciousness">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="consciousness">Consciousness</TabsTrigger>
          <TabsTrigger value="meta">Meta Intelligence</TabsTrigger>
          <TabsTrigger value="coherence">Systemic Coherence</TabsTrigger>
          <TabsTrigger value="load">Cognitive Load</TabsTrigger>
          <TabsTrigger value="risk">Existential Risks</TabsTrigger>
          <TabsTrigger value="blindspots">Strategic Blindspots</TabsTrigger>
          <TabsTrigger value="confusion">Semantic Confusion</TabsTrigger>
          <TabsTrigger value="dissonance">Dissonance</TabsTrigger>
          <TabsTrigger value="fatigue">Fatigue</TabsTrigger>
          <TabsTrigger value="survival">Survival</TabsTrigger>
          <TabsTrigger value="collapse">Awareness Collapse</TabsTrigger>
          <TabsTrigger value="exec">Executive Consciousness</TabsTrigger>
        </TabsList>

        <TabsContent value="consciousness">
          <div className="grid md:grid-cols-2 gap-4">
            <ConsciousnessScoreCard score={data.consciousness} verdict={data.verdict} />
            <Card className="p-4 space-y-1 text-sm">
              <p>Consciência Semântica: <b>{data.semanticAware}</b></p>
              <p>Consciência Operacional: <b>{data.operationalAware}</b></p>
              <p>Consciência Estratégica: <b>{data.strategicAware}</b></p>
              <p>Veredito: <b>{data.verdict}</b></p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meta">
          <MetaIntelligencePanel map={data.meta} />
        </TabsContent>

        <TabsContent value="coherence">
          <SystemicCoherenceMap map={data.coherence} />
        </TabsContent>

        <TabsContent value="load">
          <div className="grid md:grid-cols-2 gap-4">
            <CognitiveLoadGauge load={data.load} fatigue={data.fatigue} recovery={data.recovery} />
            <Card className="p-4 space-y-2">
              <h4 className="font-medium">Mapa de Pressão Mental</h4>
              {data.pressureMap.map((p) => (
                <div key={p.key} className="flex justify-between text-sm">
                  <span>{p.key}</span><span className="font-medium">{p.pressure}</span>
                </div>
              ))}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk">
          <div className="grid md:grid-cols-2 gap-4">
            <ExistentialRiskCard risk={data.risk} threats={data.threats} />
            <Card className="p-4 space-y-2 text-sm">
              <h4 className="font-medium">Plano de Mitigação</h4>
              {data.mitigation.length === 0 && <p className="text-xs text-muted-foreground">Sem ações críticas pendentes.</p>}
              <ul className="list-disc pl-5">
                {data.mitigation.map((m, i) => (
                  <li key={i}><b>[{m.priority}]</b> {m.action} <span className="text-muted-foreground">— {m.rationale}</span></li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blindspots">
          <StrategicBlindspotsPanel blindspots={data.meta.blindspots} />
        </TabsContent>

        <TabsContent value="confusion">
          <SemanticConfusionMatrix
            confusion={data.confusion}
            noise={data.meta.noise}
            hallucination={data.meta.hallucination}
            entropy={data.t.semantic_entropy_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="dissonance">
          <OperationalDissonancePanel
            dissonance={data.coherence.dissonance}
            fragmentation={data.coherence.fragmentation}
            misalignment={data.coherence.misalignment}
          />
        </TabsContent>

        <TabsContent value="fatigue">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 space-y-2 text-sm">
              <h4 className="font-medium">Fadiga & Exaustão</h4>
              <p>Fadiga Cognitiva: <b>{data.fatigue}</b></p>
              <p>Fadiga Operacional: <b>{data.opFatigue}</b></p>
              <p>Sobrecarga Semântica: <b>{data.overload}</b></p>
              <p>Exaustão Estratégica: <b>{data.exhaustion}</b></p>
            </Card>
            <Card className="p-4 space-y-2 text-sm">
              <h4 className="font-medium">Forecast de Fadiga</h4>
              {data.fatigueForecast.map((f) => (
                <div key={f.horizonDays} className="flex justify-between">
                  <span>{f.horizonDays}d</span>
                  <span className="font-medium">{f.projectedFatigue}</span>
                </div>
              ))}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="survival">
          <SurvivalProbabilityGauge
            survival={data.survival}
            recovery={data.recoveryProb}
            identity={100 - data.identityLoss}
          />
        </TabsContent>

        <TabsContent value="collapse">
          <AwarenessCollapseAlert risk={data.collapse} />
        </TabsContent>

        <TabsContent value="exec">
          <Card className="p-4 text-sm space-y-2">
            <p className="font-medium">Resumo Executivo de Consciência</p>
            <p>Veredito: <b>{data.verdict}</b> · Consciência <b>{data.consciousness}</b>/100</p>
            <p>Meta-Inteligência: <b>{data.meta.meta}</b> · Coerência: <b>{data.coherence.coherence}</b></p>
            <p>Risco Existencial: <b>{data.risk}%</b> · Sobrevivência: <b>{data.survival}%</b></p>
            <p>Colapso de Awareness: <b>{data.collapse}%</b></p>
            <ul className="list-disc pl-5 text-muted-foreground pt-2">
              {data.mitigation.map((m, i) => <li key={i}>[{m.priority}] {m.action}</li>)}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <Card className="p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}{suffix}</p>
    </Card>
  );
}
