import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import NervousSystemCard from "@/components/admin/NervousSystemCard";
import StrategicPulseGauge from "@/components/admin/StrategicPulseGauge";
import SemanticPulseMatrix from "@/components/admin/SemanticPulseMatrix";
import OperationalFatiguePanel from "@/components/admin/OperationalFatiguePanel";
import ClusterDependencyRadar from "@/components/admin/ClusterDependencyRadar";
import CollapseProbabilityCard from "@/components/admin/CollapseProbabilityCard";
import SurvivalConfidenceGauge from "@/components/admin/SurvivalConfidenceGauge";
import StructuralIntegrityMap from "@/components/admin/StructuralIntegrityMap";
import BurnoutZonesPanel from "@/components/admin/BurnoutZonesPanel";
import LongTermViabilityCard from "@/components/admin/LongTermViabilityCard";

import type { TelemetrySnapshot } from "@/lib/seoTelemetry";
import { buildNervousSystemVerdict } from "@/lib/strategicNervousSystem";
import { buildClusterDependencyReport } from "@/lib/clusterDependencyEngine";
import { buildFatigueReport } from "@/lib/operationalFatigue";
import { buildSurvivalReport } from "@/lib/survivalIntelligence";

const MOCK: Partial<TelemetrySnapshot> = {
  operational_score: 66, execution_efficiency: 62, execution_capacity_score: 64,
  operational_debt_score: 30, execution_noise_score: 30, bottleneck_score: 28,
  maintenance_pressure_score: 34, strategic_alignment_score: 65, strategic_consistency_score: 62,
  execution_focus_score: 60, strategic_fatigue_score: 36, strategic_contradiction_score: 28,
  strategic_noise_score: 30, semantic_stability_score: 64, semantic_balance_score: 60,
  semantic_connectivity_score: 60, semantic_entropy_score: 36, semantic_fatigue_score: 34,
  topic_exhaustion_score: 30, cluster_dependency_score: 48, overcentralization_risk: 42,
  authority_dependency_risk: 44, authority_dispersion_score: 38, authority_entropy: 40,
  authority_instability_score: 32, fragile_cluster_count: 2, cluster_failure_probability: 28,
  cluster_resilience_score: 60, cascade_failure_risk: 26, cascade_collapse_risk: 24,
  cognitive_fatigue_score: 30, cognitive_pressure_score: 28, fragmentation_pressure_score: 30,
  fragmentation_score: 32, ecosystem_integrity_score: 64, resilience_score: 62,
  recovery_capacity_score: 60, recovery_elasticity: 58, adaptive_recovery_score: 60,
  adaptive_capacity_score: 60, strategic_elasticity_score: 58, evolution_velocity_score: 56,
  collapse_risk_score: 28, collapse_probability_score: 26, sustainability_score: 62,
  sustainability_forecast: 60, long_term_sustainability_score: 60, authority_compounding_score: 58,
  cluster_longevity_score: 60, systemic_entropy_score: 34, recovery_difficulty_avg: 38,
  maintenance_explosion_risk: 30,
};

export default function AdminSeoNervousSystem() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const data = useMemo(() => {
    const t = MOCK as TelemetrySnapshot;
    const nervous = buildNervousSystemVerdict(t);
    const cluster = buildClusterDependencyReport(t);
    const fatigue = buildFatigueReport(t);
    const survival = buildSurvivalReport(t);
    return { t, nervous, cluster, fatigue, survival };
  }, []);

  const captureSnapshot = async () => {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const payload: any = {
      nervous_system_score: data.nervous.score,
      systemic_stability: data.nervous.structuralIntegrity,
      operational_survival: data.survival.operationalSurvival,
      strategic_fatigue: data.fatigue.strategic,
      semantic_pressure: data.fatigue.semantic,
      cognitive_efficiency: 100 - data.fatigue.cognitive,
      authority_dependence: data.cluster.authorityConcentration,
      cluster_fragility: data.cluster.fragility,
      execution_stability: 100 - data.fatigue.execution,
      entropy_resistance: data.survival.resilienceAgainstEntropy,
      semantic_resilience: data.t.semantic_resilience_score ?? 0,
      strategic_resilience: data.t.strategic_resilience_score ?? 0,
      operational_resilience: data.t.resilience_score ?? 0,
      recovery_intelligence: data.nervous.recoveryIntelligence,
      adaptive_capacity: data.nervous.adaptiveCapacity,
      ecosystem_synchronization: data.nervous.synchronization,
      semantic_saturation: data.t.saturation_score ?? 0,
      existential_exposure: data.t.existential_risk_score ?? 0,
      collapse_probability: data.survival.collapseProbability,
      sustainability_projection: data.t.sustainability_forecast ?? 0,
      long_term_viability: data.nervous.longTermViability,
      notes: data.nervous.summary,
      created_by: u.user?.id ?? null,
      snapshot: {
        nervous: data.nervous,
        cluster: data.cluster,
        fatigue: data.fatigue,
        survival: data.survival,
      },
    };
    const { error } = await (supabase as any).from("seo_nervous_system_snapshots").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Erro ao salvar snapshot", description: error.message, variant: "destructive" });
    else toast({ title: "Nervous System snapshot capturado", description: "Persistido em seo_nervous_system_snapshots." });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Strategic Nervous System</h1>
          <p className="text-sm text-muted-foreground">
            Camada superior de inteligência operacional — diagnóstico read-only. Safe Mode absoluto.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          {saving ? "Salvando…" : "Capture Nervous System Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi label="Nervous System" value={data.nervous.score} />
        <Kpi label="Survival Confidence" value={data.survival.survivalConfidence} />
        <Kpi label="Structural Integrity" value={data.nervous.structuralIntegrity} />
        <Kpi label="Adaptive Capacity" value={data.nervous.adaptiveCapacity} />
        <Kpi label="Strategic Fatigue" value={data.fatigue.strategic} />
        <Kpi label="Collapse Probability" value={data.survival.collapseProbability} />
      </div>

      <Tabs defaultValue="nervous">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="nervous">Nervous System</TabsTrigger>
          <TabsTrigger value="strategic">Strategic Pulse</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Pulse</TabsTrigger>
          <TabsTrigger value="operational">Operational Pulse</TabsTrigger>
          <TabsTrigger value="cluster">Cluster Dependency</TabsTrigger>
          <TabsTrigger value="integrity">Structural Integrity</TabsTrigger>
          <TabsTrigger value="fatigue">Operational Fatigue</TabsTrigger>
          <TabsTrigger value="burnout">Burnout Zones</TabsTrigger>
          <TabsTrigger value="survival">Survival Intelligence</TabsTrigger>
          <TabsTrigger value="collapse">Collapse Probability</TabsTrigger>
          <TabsTrigger value="viability">Long-Term Viability</TabsTrigger>
          <TabsTrigger value="summary">Executive Survival</TabsTrigger>
        </TabsList>

        <TabsContent value="nervous">
          <div className="grid md:grid-cols-2 gap-4">
            <NervousSystemCard report={data.nervous} />
            <Card className="p-4 text-sm space-y-2">
              <p className="font-medium">Fatores de Resiliência</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {data.nervous.resilience_factors.length === 0 && <li>Nenhum destaque.</li>}
                {data.nervous.resilience_factors.map((s) => <li key={s}>{s}</li>)}
              </ul>
              <p className="font-medium pt-2">Alertas Sistêmicos</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {data.nervous.systemic_alerts.length === 0 && <li>Sem alertas relevantes.</li>}
                {data.nervous.systemic_alerts.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategic">
          <StrategicPulseGauge
            pulse={data.nervous.pulses.strategic}
            fatigue={data.fatigue.strategic}
            alignment={data.t.strategic_alignment_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="semantic">
          <SemanticPulseMatrix
            pulse={data.nervous.pulses.semantic}
            entropy={data.t.semantic_entropy_score ?? 0}
            connectivity={data.t.semantic_connectivity_score ?? 0}
            balance={data.t.semantic_balance_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="operational">
          <Card className="p-4 space-y-3">
            <p className="text-base font-medium">Operational Pulse</p>
            <div className="text-5xl font-bold">{data.nervous.pulses.operational}</div>
            <p className="text-sm text-muted-foreground">
              Sincronização sistêmica: <b>{data.nervous.synchronization}</b> · Recovery Intelligence: <b>{data.nervous.recoveryIntelligence}</b>
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="cluster">
          <ClusterDependencyRadar report={data.cluster} />
        </TabsContent>

        <TabsContent value="integrity">
          <StructuralIntegrityMap
            integrity={data.nervous.structuralIntegrity}
            resilience={data.t.resilience_score ?? 0}
            fragmentation={data.t.fragmentation_score ?? 0}
            ecosystem={data.t.ecosystem_integrity_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="fatigue">
          <OperationalFatiguePanel report={data.fatigue} />
        </TabsContent>

        <TabsContent value="burnout">
          <BurnoutZonesPanel zones={data.fatigue.burnoutZones} />
        </TabsContent>

        <TabsContent value="survival">
          <SurvivalConfidenceGauge
            confidence={data.survival.survivalConfidence}
            scenario={data.survival.scenario}
            longevity={data.survival.strategicLongevity}
          />
        </TabsContent>

        <TabsContent value="collapse">
          <div className="grid md:grid-cols-2 gap-4">
            <CollapseProbabilityCard probability={data.survival.collapseProbability} />
            <Card className="p-4 text-sm space-y-2">
              <p className="font-medium">Janelas de Recuperação</p>
              <ul className="space-y-1">
                {data.survival.recoveryWindows.map((w) => (
                  <li key={w.horizonDays} className="flex justify-between">
                    <span>{w.horizonDays}d</span>
                    <b>{w.viability}</b>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="viability">
          <LongTermViabilityCard
            viability={data.nervous.longTermViability}
            sustainability={data.t.sustainability_score ?? 0}
            compounding={data.t.authority_compounding_score ?? 0}
            longevity={data.survival.strategicLongevity}
          />
        </TabsContent>

        <TabsContent value="summary">
          <Card className="p-4 text-sm space-y-3">
            <p className="font-medium">Executive Survival Summary</p>
            <p>{data.nervous.summary}</p>
            <p>Cenário: <b className="capitalize">{data.survival.scenario}</b> · Confidence: <b>{data.survival.survivalConfidence}</b></p>

            <p className="font-medium pt-2">Forças</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.nervous.strengths.length === 0 && <li>—</li>}
              {data.nervous.strengths.map((s) => <li key={s}>{s}</li>)}
            </ul>

            <p className="font-medium pt-2">Fraquezas</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.nervous.weaknesses.length === 0 && <li>—</li>}
              {data.nervous.weaknesses.map((s) => <li key={s}>{s}</li>)}
            </ul>

            <p className="font-medium pt-2">Contradições</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.nervous.contradictions.length === 0 && <li>—</li>}
              {data.nervous.contradictions.map((s) => <li key={s}>{s}</li>)}
            </ul>

            <p className="font-medium pt-2">Dependências</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.nervous.dependencies.length === 0 && <li>—</li>}
              {data.nervous.dependencies.map((s) => <li key={s}>{s}</li>)}
            </ul>

            <p className="font-medium pt-2">Sinais de Sobrevivência</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.nervous.survival_signals.length === 0 && <li>—</li>}
              {data.nervous.survival_signals.map((s) => <li key={s}>{s}</li>)}
            </ul>

            <p className="font-medium pt-2">Prioridades de Intervenção</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.nervous.intervention_priorities.length === 0 && <li>Sem ações urgentes.</li>}
              {data.nervous.intervention_priorities.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
}
