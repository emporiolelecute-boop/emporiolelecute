import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import SingularityScoreCard from "@/components/admin/SingularityScoreCard";
import SemanticEntropyMap from "@/components/admin/SemanticEntropyMap";
import CollapseProbabilityPanel from "@/components/admin/CollapseProbabilityPanel";
import AdaptiveCapacityGauge from "@/components/admin/AdaptiveCapacityGauge";
import StrategicElasticityMeter from "@/components/admin/StrategicElasticityMeter";
import EvolutionVelocityTimeline from "@/components/admin/EvolutionVelocityTimeline";
import SemanticGravityPanel from "@/components/admin/SemanticGravityPanel";
import StrategicBlackholePanel from "@/components/admin/StrategicBlackholePanel";
import MutationRateCard from "@/components/admin/MutationRateCard";
import AdaptiveRecoveryForecast from "@/components/admin/AdaptiveRecoveryForecast";

import {
  calculateStrategicSingularity, detectSemanticGravityCenters, detectStrategicBlackholes,
  calculateAdaptiveIntelligence, detectEvolutionPlateau, detectSemanticInstability, buildSingularityVerdict,
} from "@/lib/singularityEngine";
import {
  calculateAdaptivePressure, estimateAdaptiveCapacity, detectStrategicRigidity,
  estimateStrategicElasticity, buildAdaptiveStrategy,
} from "@/lib/adaptiveStrategyEngine";
import {
  calculateSemanticEntropy, detectEntropyAcceleration, detectSemanticNoise,
  detectMeaningDilution, detectAuthorityDispersion, buildEntropyMap,
} from "@/lib/semanticEntropyEngine";
import {
  detectCollapseSignals, estimateCollapseProbability, detectCascadeCollapseRisk,
  estimateRecoveryWindow, buildCollapseMitigationPlan,
} from "@/lib/strategicCollapseEngine";
import {
  calculateEvolutionVelocity, calculateSemanticMutationRate, estimateFutureDominance,
  estimateSemanticAging, buildEvolutionForecast,
} from "@/lib/semanticEvolutionEngine";

// Mock hubs/clusters — in real flow these would come from knowledgeGraph/Authority Center.
const MOCK_HUBS = [
  { key: "Lembrancinhas", weight: 40, output: 18, coherence: 70 },
  { key: "Sabonetes Artesanais", weight: 28, output: 14, coherence: 65 },
  { key: "Papelaria", weight: 18, output: 9, coherence: 60 },
  { key: "Ocasiões", weight: 14, output: 6, coherence: 55 },
];

export default function AdminSeoSingularity() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const data = useMemo(() => {
    const hubs = MOCK_HUBS;
    const clusters = hubs.map((h) => ({ key: h.key, weight: h.weight, coherence: h.coherence }));
    const authorityAvg = 62;
    const stability = 64;
    const connectivity = 58;
    const coherence = 66;
    const compounding = 60;

    const singularity = calculateStrategicSingularity({ authorityAvg, connectivity, coherence, compounding, stability, hubs });
    const gravity = detectSemanticGravityCenters(hubs);
    const blackholes = detectStrategicBlackholes(hubs);
    const adaptiveIntelligence = calculateAdaptiveIntelligence({ recoverySpeed: 55, reactionSpeed: 60, evolution: 58, stability });
    const series = [50, 52, 55, 57, 58, 60, 61];
    const plateau = detectEvolutionPlateau(series);
    const instability = detectSemanticInstability({ volatility: 35, drift: 28, entropy: 42 });
    const verdict = buildSingularityVerdict(singularity.score, instability);

    const pressure = calculateAdaptivePressure({ executionLoad: 55, risk: 40, backlog: 35 });
    const capacity = estimateAdaptiveCapacity({ resources: 60, velocity: 58, stability });
    const rigidity = detectStrategicRigidity({ changeRate: 45, dependencies: 50, coupling: 55 });
    const elasticity = estimateStrategicElasticity(rigidity, capacity);
    const strategy = buildAdaptiveStrategy({ executionLoad: 55, pressure, capacity, rigidity, elasticity, recoverySpeed: 55 });

    const entropy = calculateSemanticEntropy({ clusters, noiseSignals: 20, meaningOverlap: 25 });
    const entropyAccel = detectEntropyAcceleration([30, 35, 38, 42, entropy]);
    const noise = detectSemanticNoise(20, 80);
    const dilution = detectMeaningDilution(25, clusters.length);
    const dispersion = detectAuthorityDispersion(hubs.map((h) => h.weight));
    const entropyMap = buildEntropyMap(clusters);

    const collapseInputs = { fragility: 40, pressure, dependency: 55, recovery: capacity, entropy };
    const signals = detectCollapseSignals(collapseInputs);
    const collapseProb = estimateCollapseProbability(collapseInputs);
    const cascade = detectCascadeCollapseRisk(55, gravity.filter((g) => g.critical).length);
    const recoveryDays = estimateRecoveryWindow(collapseProb, capacity);
    const mitigation = buildCollapseMitigationPlan(signals);

    const evolutionVelocity = calculateEvolutionVelocity(series);
    const mutationRate = calculateSemanticMutationRate(8, 60);
    const futureDominance = estimateFutureDominance(authorityAvg, evolutionVelocity, stability);
    const aging = estimateSemanticAging(60, 25);
    const forecast = buildEvolutionForecast({ authority: authorityAvg, velocity: evolutionVelocity, stability });

    return {
      singularity, verdict, instability, gravity, blackholes, adaptiveIntelligence, plateau,
      pressure, capacity, rigidity, elasticity, strategy,
      entropy, entropyAccel, noise, dilution, dispersion, entropyMap,
      signals, collapseProb, cascade, recoveryDays, mitigation,
      evolutionVelocity, mutationRate, futureDominance, aging, forecast, series,
    };
  }, []);

  const captureSnapshot = async () => {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const payload: any = {
      memory_type: "adaptive_snapshot",
      adaptive_score: data.adaptiveIntelligence,
      resilience_score: data.elasticity,
      saturation_score: data.entropy,
      volatility_score: data.instability,
      sustainability_score: data.strategy.capacity,
      semantic_entropy: data.entropy,
      strategic_pressure: data.pressure,
      collapse_risk: data.collapseProb,
      recovery_potential: data.capacity,
      compounding_score: data.singularity.compoundAuthority,
      adaptation_velocity: data.evolutionVelocity,
      semantic_drift: data.dispersion,
      dependency_risk: data.cascade,
      intelligence_snapshot: {
        singularity: data.singularity,
        verdict: data.verdict,
        forecast: data.forecast,
      },
      detected_patterns: data.signals,
      recommendations: data.strategy.executionPlan,
      created_by: u.user?.id ?? null,
    };
    const { error } = await (supabase as any).from("seo_adaptive_memory").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Erro ao salvar snapshot", description: error.message, variant: "destructive" });
    else toast({ title: "Snapshot adaptativo capturado", description: "Persistido em seo_adaptive_memory." });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Singularity</h1>
          <p className="text-sm text-muted-foreground">Camada de inteligência adaptativa — somente diagnóstico. Safe Mode absoluto.</p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          {saving ? "Salvando…" : "Capture Adaptive Snapshot"}
        </Button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Strategic Singularity" value={data.singularity.score} />
        <Kpi label="Adaptive Intelligence" value={data.adaptiveIntelligence} />
        <Kpi label="Semantic Entropy" value={data.entropy} />
        <Kpi label="Collapse Probability" value={data.collapseProb} suffix="%" />
        <Kpi label="Evolution Velocity" value={data.evolutionVelocity} />
        <Kpi label="Semantic Stability" value={100 - data.instability} />
        <Kpi label="Strategic Elasticity" value={data.elasticity} />
        <Kpi label="Recovery Capacity" value={data.capacity} />
        <Kpi label="Future Dominance" value={data.futureDominance} />
        <Kpi label="Mutation Rate" value={data.mutationRate} suffix="%" />
        <Kpi label="Sustainability" value={data.strategy.capacity} />
        <Kpi label="Semantic Gravity" value={data.gravity[0]?.concentration ?? 0} suffix="%" />
      </div>

      <Tabs defaultValue="singularity">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="singularity">Singularity</TabsTrigger>
          <TabsTrigger value="adaptive">Adaptive Intelligence</TabsTrigger>
          <TabsTrigger value="entropy">Semantic Entropy</TabsTrigger>
          <TabsTrigger value="collapse">Collapse Risks</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
          <TabsTrigger value="elasticity">Elasticity</TabsTrigger>
          <TabsTrigger value="mutation">Mutation</TabsTrigger>
          <TabsTrigger value="gravity">Gravity Centers</TabsTrigger>
          <TabsTrigger value="blackholes">Blackholes</TabsTrigger>
          <TabsTrigger value="sustain">Sustainability</TabsTrigger>
          <TabsTrigger value="future">Future Dominance</TabsTrigger>
          <TabsTrigger value="exec">Executive Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="singularity">
          <div className="grid md:grid-cols-2 gap-4">
            <SingularityScoreCard score={data.singularity.score} verdict={data.verdict} />
            <Card className="p-4 space-y-1 text-sm">
              <p>Convergência: <b>{data.singularity.convergence}</b></p>
              <p>Compound Authority: <b>{data.singularity.compoundAuthority}</b></p>
              <p>Coerência Estrutural: <b>{data.singularity.structuralCoherence}</b></p>
              <p>Instabilidade: <b>{data.instability}</b></p>
              <p>Plateau detectado: <b>{data.plateau.plateau ? "sim" : "não"}</b> (tendência {data.plateau.trend})</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="adaptive">
          <div className="grid md:grid-cols-2 gap-4">
            <AdaptiveCapacityGauge capacity={data.capacity} pressure={data.pressure} />
            <AdaptiveRecoveryForecast days={data.strategy.recoveryWindowDays} plan={data.strategy.executionPlan} />
          </div>
        </TabsContent>

        <TabsContent value="entropy">
          <div className="grid md:grid-cols-2 gap-4">
            <SemanticEntropyMap entries={data.entropyMap} />
            <Card className="p-4 space-y-1 text-sm">
              <p>Entropia global: <b>{data.entropy}</b></p>
              <p>Aceleração: <b>{data.entropyAccel}</b></p>
              <p>Ruído semântico: <b>{data.noise}</b></p>
              <p>Diluição de significado: <b>{data.dilution}</b></p>
              <p>Dispersão de autoridade: <b>{data.dispersion}</b></p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collapse">
          <CollapseProbabilityPanel probability={data.collapseProb} signals={data.signals} recoveryDays={data.recoveryDays} />
          <Card className="p-4 mt-4 text-sm space-y-1">
            <p>Cascata: <b>{data.cascade}</b></p>
            <p className="font-medium pt-2">Mitigação sugerida:</p>
            <ul className="list-disc pl-5 text-muted-foreground">{data.mitigation.map((m, i) => <li key={i}>{m}</li>)}</ul>
          </Card>
        </TabsContent>

        <TabsContent value="evolution">
          <EvolutionVelocityTimeline series={data.series} />
          <Card className="p-4 mt-4 text-sm">
            <p>Velocidade: <b>{data.evolutionVelocity}</b></p>
            <p>Envelhecimento semântico: <b>{data.aging}</b></p>
          </Card>
        </TabsContent>

        <TabsContent value="elasticity">
          <StrategicElasticityMeter elasticity={data.elasticity} rigidity={data.rigidity} />
        </TabsContent>

        <TabsContent value="mutation">
          <MutationRateCard rate={data.mutationRate} />
        </TabsContent>

        <TabsContent value="gravity">
          <SemanticGravityPanel centers={data.gravity} />
        </TabsContent>

        <TabsContent value="blackholes">
          <StrategicBlackholePanel holes={data.blackholes} />
        </TabsContent>

        <TabsContent value="sustain">
          <Card className="p-4 text-sm space-y-1">
            <p>Sustentabilidade (capacidade): <b>{data.strategy.capacity}</b></p>
            <p>Pressão estratégica: <b>{data.pressure}</b></p>
            <p>Elasticidade: <b>{data.elasticity}</b></p>
            <p>Rigidez: <b>{data.rigidity}</b></p>
          </Card>
        </TabsContent>

        <TabsContent value="future">
          <Card className="p-4">
            <h4 className="font-medium mb-3">Forecast de Dominância Futura</h4>
            <div className="space-y-2 text-sm">
              {data.forecast.map((f) => (
                <div key={f.horizonDays} className="flex justify-between border-b pb-1">
                  <span>{f.horizonDays}d</span>
                  <span>Autoridade {f.projectedAuthority} · Dominância {f.projectedDominance}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="exec">
          <Card className="p-4 text-sm space-y-2">
            <p className="font-medium">Resumo Executivo</p>
            <p>Veredito de singularidade: <b>{data.verdict}</b> ({data.singularity.score}/100)</p>
            <p>Inteligência adaptativa: <b>{data.adaptiveIntelligence}</b></p>
            <p>Probabilidade de colapso: <b>{data.collapseProb}%</b> · Janela {data.recoveryDays}d</p>
            <p>Dominância futura projetada: <b>{data.futureDominance}</b></p>
            <ul className="list-disc pl-5 text-muted-foreground pt-2">
              {data.strategy.executionPlan.map((p, i) => <li key={i}>{p}</li>)}
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
