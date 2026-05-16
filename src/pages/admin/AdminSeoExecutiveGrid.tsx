import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import ExecutiveStateCard from "@/components/admin/ExecutiveStateCard";
import StrategicClarityGauge from "@/components/admin/StrategicClarityGauge";
import OperationalHarmonyMatrix from "@/components/admin/OperationalHarmonyMatrix";
import SystemicEntropyPanel from "@/components/admin/SystemicEntropyPanel";
import SemanticDriftRadar from "@/components/admin/SemanticDriftRadar";
import AuthorityInstabilityCard from "@/components/admin/AuthorityInstabilityCard";
import StrategicScatterMap from "@/components/admin/StrategicScatterMap";
import ExecutionDilutionGauge from "@/components/admin/ExecutionDilutionGauge";
import LongTermSustainabilityCard from "@/components/admin/LongTermSustainabilityCard";
import FutureResilienceMatrix from "@/components/admin/FutureResilienceMatrix";

import type { TelemetrySnapshot } from "@/lib/seoTelemetry";
import { buildExecutiveVerdict } from "@/lib/executiveIntelligence";
import { buildEntropyMap } from "@/lib/systemicEntropy";
import { buildCoherenceReport } from "@/lib/strategicCoherence";
import { buildFutureResilience, estimateSemanticLongevity } from "@/lib/futureResilience";

// Mock telemetry baseline — read-only diagnostics only.
const MOCK_TELEMETRY: Partial<TelemetrySnapshot> = {
  system_health_score: 66, sustainability_score: 62, resilience_score: 64,
  strategic_alignment_score: 65, operational_score: 68, execution_efficiency: 64,
  execution_focus_score: 60, execution_noise_score: 30, operational_waste_score: 32,
  strategic_consistency_score: 64, strategic_contradiction_score: 28, volatility_score: 30,
  fragmentation_score: 32, bottleneck_score: 28, sustainability_forecast: 60,
  authority_compounding_score: 58, cluster_longevity_score: 60, long_term_decay_risk: 32,
  momentum_growth_score: 58, cluster_growth_score: 60, authority_growth_projection: 56,
  semantic_aging_score: 38, meaning_dilution_score: 28, semantic_noise_score: 30,
  semantic_stability_score: 64, semantic_balance_score: 60, semantic_entropy_score: 36,
  authority_entropy: 40, authority_dispersion_score: 38, authority_dependency_risk: 42,
  fragile_cluster_count: 2, orphan_cluster_count: 1, fragmentation_pressure_score: 32,
  operational_dissonance_score: 30,
  business_intent_score: 60, strategic_noise_score: 32,
  recovery_capacity_score: 60, recovery_elasticity: 58, adaptive_recovery_score: 60,
  collapse_risk_score: 28, cascade_failure_risk: 26, strategic_resilience_forecast: 62,
  strategic_elasticity_score: 58, adaptive_capacity_score: 60, strategic_rigidity_score: 30,
  maintenance_pressure_score: 36, cluster_failure_probability: 25,
};

export default function AdminSeoExecutiveGrid() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const data = useMemo(() => {
    const t = MOCK_TELEMETRY as TelemetrySnapshot;
    const exec = buildExecutiveVerdict(t);
    const entropy = buildEntropyMap(t);
    const coherence = buildCoherenceReport(t);
    const forecast = buildFutureResilience(t);
    const semanticLongevity = estimateSemanticLongevity(t);
    return { t, exec, entropy, coherence, forecast, semanticLongevity };
  }, []);

  const captureSnapshot = async () => {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const payload: any = {
      operational_state: data.exec.state,
      strategic_alignment: data.t.strategic_alignment_score ?? 0,
      semantic_efficiency: data.t.semantic_efficiency ?? 0,
      execution_clarity: data.exec.clarity,
      authority_resilience: data.forecast.authorityPersistence,
      systemic_entropy: data.entropy.systemic,
      cognitive_pressure: data.t.cognitive_pressure_score ?? 0,
      strategic_noise: data.t.strategic_noise_score ?? 0,
      semantic_decay: data.t.semantic_aging_score ?? 0,
      sustainability_score: data.exec.sustainability,
      adaptability_score: data.t.adaptive_capacity_score ?? 0,
      recovery_readiness: data.forecast.recovery,
      fragmentation_score: data.exec.fragmentation,
      execution_fatigue: data.t.strategic_fatigue_score ?? 0,
      compounding_capacity: data.exec.compounding,
      ecosystem_health: data.exec.ecosystemIntegrity,
      existential_stability: 100 - (data.t.existential_risk_score ?? 0),
      predictive_confidence: data.t.simulation_confidence_avg ?? 0,
      long_term_survival: data.forecast.collapseResistance,
      notes: data.exec.summary,
      created_by: u.user?.id ?? null,
      snapshot: {
        executive: data.exec,
        entropy: data.entropy,
        coherence: data.coherence,
        forecast: data.forecast,
      },
    };
    const { error } = await (supabase as any).from("seo_executive_snapshots").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Erro ao salvar snapshot", description: error.message, variant: "destructive" });
    else toast({ title: "Executive snapshot capturado", description: "Persistido em seo_executive_snapshots." });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Executive Grid</h1>
          <p className="text-sm text-muted-foreground">
            Camada executiva-orquestradora — somente diagnóstico. Safe Mode absoluto.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          {saving ? "Salvando…" : "Capture Executive Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi label="Executive State" value={data.exec.state} />
        <Kpi label="Ecosystem Integrity" value={data.exec.ecosystemIntegrity} />
        <Kpi label="Sustainability" value={data.exec.sustainability} />
        <Kpi label="Resilience Forecast" value={data.forecast.collapseResistance} />
        <Kpi label="Strategic Clarity" value={data.exec.clarity} />
        <Kpi label="Entropy" value={data.entropy.systemic} />
      </div>

      <Tabs defaultValue="state">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="state">Executive State</TabsTrigger>
          <TabsTrigger value="clarity">Strategic Clarity</TabsTrigger>
          <TabsTrigger value="harmony">Operational Harmony</TabsTrigger>
          <TabsTrigger value="entropy">Systemic Entropy</TabsTrigger>
          <TabsTrigger value="drift">Semantic Drift</TabsTrigger>
          <TabsTrigger value="authority">Authority Stability</TabsTrigger>
          <TabsTrigger value="frag">Fragmentation</TabsTrigger>
          <TabsTrigger value="coherence">Execution Coherence</TabsTrigger>
          <TabsTrigger value="sustain">Sustainability</TabsTrigger>
          <TabsTrigger value="resilience">Future Resilience</TabsTrigger>
          <TabsTrigger value="contradict">Contradictions</TabsTrigger>
          <TabsTrigger value="exec">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="state">
          <div className="grid md:grid-cols-2 gap-4">
            <ExecutiveStateCard report={data.exec} />
            <Card className="p-4 text-sm space-y-2">
              <p className="font-medium">Sinais de força</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {data.exec.strengths.length === 0 && <li>Nenhum sinal forte destacado.</li>}
                {data.exec.strengths.map((s) => <li key={s}>{s}</li>)}
              </ul>
              <p className="font-medium pt-2">Bloqueadores</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {data.exec.blockers.length === 0 && <li>Sem bloqueadores críticos.</li>}
                {data.exec.blockers.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clarity">
          <StrategicClarityGauge
            clarity={data.exec.clarity}
            intent={data.coherence.intentConsistency}
            direction={data.coherence.semanticDirection}
          />
        </TabsContent>

        <TabsContent value="harmony">
          <OperationalHarmonyMatrix
            harmony={data.exec.harmony}
            focus={data.coherence.focus}
            alignment={data.coherence.alignment}
            coherence={data.exec.coherence}
          />
        </TabsContent>

        <TabsContent value="entropy">
          <SystemicEntropyPanel map={data.entropy} />
        </TabsContent>

        <TabsContent value="drift">
          <SemanticDriftRadar
            drift={data.exec.drift}
            longevity={data.semanticLongevity}
            aging={data.t.semantic_aging_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="authority">
          <AuthorityInstabilityCard
            instability={data.exec.instability}
            persistence={data.forecast.authorityPersistence}
            dispersion={data.t.authority_dispersion_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="frag">
          <StrategicScatterMap
            scatter={data.coherence.scatter}
            fragmentation={data.exec.fragmentation}
            contradictions={data.coherence.contradictions}
          />
        </TabsContent>

        <TabsContent value="coherence">
          <ExecutionDilutionGauge
            dilution={data.coherence.dilution}
            waste={data.t.operational_waste_score ?? 0}
            noise={data.t.execution_noise_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="sustain">
          <LongTermSustainabilityCard
            sustainability={data.exec.sustainability}
            compounding={data.exec.compounding}
            durability={data.exec.durability}
          />
        </TabsContent>

        <TabsContent value="resilience">
          <FutureResilienceMatrix forecast={data.forecast} />
        </TabsContent>

        <TabsContent value="contradict">
          <Card className="p-4 text-sm space-y-2">
            <p className="font-medium">Contradições detectadas</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.exec.contradictions.length === 0 && data.coherence.contradictions.length === 0 && (
                <li>Sem contradições relevantes.</li>
              )}
              {data.exec.contradictions.map((c) => <li key={`e-${c}`}>{c}</li>)}
              {data.coherence.contradictions.map((c) => <li key={`c-${c}`}>{c}</li>)}
            </ul>
            <p className="font-medium pt-2">Ineficiências</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.exec.inefficiencies.length === 0 && <li>Sem ineficiências relevantes.</li>}
              {data.exec.inefficiencies.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="exec">
          <Card className="p-4 text-sm space-y-2">
            <p className="font-medium">Resumo Executivo</p>
            <p>{data.exec.summary}</p>
            <p>Veredito: <b>{data.exec.verdict}</b> · Ecosystem Integrity: <b>{data.exec.ecosystemIntegrity}</b></p>
            <p className="font-medium pt-2">Prioridades Estratégicas</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.exec.strategic_priorities.length === 0 && <li>Sem prioridades urgentes.</li>}
              {data.exec.strategic_priorities.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <p className="font-medium pt-2">Riscos Sistêmicos</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.exec.systemic_risks.length === 0 && <li>Sem riscos sistêmicos relevantes.</li>}
              {data.exec.systemic_risks.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <p className="font-medium pt-2">Sinais de Resiliência</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {data.exec.resilience_signals.length === 0 && <li>Sem sinais positivos destacados.</li>}
              {data.exec.resilience_signals.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
}
