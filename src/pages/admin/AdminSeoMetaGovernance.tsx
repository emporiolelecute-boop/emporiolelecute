import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import GovernanceScoreCard from "@/components/admin/GovernanceScoreCard";
import SystemicConsistencyMatrix from "@/components/admin/SystemicConsistencyMatrix";
import StrategicGovernabilityGauge from "@/components/admin/StrategicGovernabilityGauge";
import OperationalPredictabilityCard from "@/components/admin/OperationalPredictabilityCard";
import GovernanceEntropyPanel from "@/components/admin/GovernanceEntropyPanel";
import SemanticCohesionRadar from "@/components/admin/SemanticCohesionRadar";
import AuthorityBalanceGauge from "@/components/admin/AuthorityBalanceGauge";
import ContinuityBreakMap from "@/components/admin/ContinuityBreakMap";
import SystemicTrustPanel from "@/components/admin/SystemicTrustPanel";
import GovernanceDriftAlert from "@/components/admin/GovernanceDriftAlert";

import type { TelemetrySnapshot } from "@/lib/seoTelemetry";
import { buildGovernanceVerdict } from "@/lib/metaGovernance";
import { buildContinuityReport } from "@/lib/continuityEngine";
import { buildTrustReport } from "@/lib/systemicTrust";
import { buildEntropyReport } from "@/lib/governanceEntropy";

const MOCK: Partial<TelemetrySnapshot> = {
  operational_score: 66, execution_efficiency: 64, execution_capacity_score: 62,
  operational_debt_score: 30, execution_noise_score: 30, bottleneck_score: 28,
  strategic_alignment_score: 68, strategic_consistency_score: 62, execution_focus_score: 60,
  strategic_fatigue_score: 34, strategic_contradiction_score: 30, strategic_noise_score: 28,
  semantic_stability_score: 66, semantic_balance_score: 62, semantic_connectivity_score: 60,
  semantic_entropy_score: 34, semantic_fatigue_score: 32, semantic_drift_score: 36,
  semantic_hallucination_score: 22, false_growth_signal_score: 22,
  authority_dispersion_score: 40, authority_entropy: 38, authority_instability_score: 32,
  authority_persistence_score: 60, overcentralization_risk: 42, authority_dependency_risk: 44,
  cluster_dependency_score: 48, single_point_failure_score: 30,
  ecosystem_integrity_score: 64, systemic_synchronization_score: 60, systemic_noise_score: 32,
  systemic_entropy_score: 34, systemic_instability_score: 28,
  strategic_entropy_score: 32, strategic_scatter_score: 30, execution_entropy_score: 30,
  execution_dilution_score: 28, execution_coherence_score: 64,
  fragmentation_score: 30, fragmentation_risk_score: 30,
  resilience_score: 62, recovery_capacity_score: 60, recovery_elasticity: 58,
  adaptive_capacity_score: 60, adaptive_recovery_score: 60, strategic_longevity_score: 60,
  sustainability_score: 62, long_term_sustainability_score: 60, cluster_longevity_score: 60,
  collapse_probability_score: 26, existential_risk_score: 28, existential_exposure_score: 26,
  execution_fatigue_score: 32, burnout_risk_score: 30, maintenance_explosion_risk: 28,
};

export default function AdminSeoMetaGovernance() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const data = useMemo(() => {
    const t = MOCK as TelemetrySnapshot;
    const gov = buildGovernanceVerdict(t);
    const cont = buildContinuityReport(t);
    const trust = buildTrustReport(t);
    const entropy = buildEntropyReport(t);
    return { t, gov, cont, trust, entropy };
  }, []);

  const captureSnapshot = async () => {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const { gov, cont, trust, entropy, t } = data;
    const payload: any = {
      governance_score: gov.score,
      systemic_consistency: gov.consistency,
      strategic_governability: gov.governability,
      operational_predictability: gov.predictability,
      semantic_cohesion: gov.cohesion,
      authority_balance: gov.authorityBalance,
      ecosystem_integrity: gov.ecosystemIntegrity,
      resilience_continuity: gov.continuity,
      contradiction_pressure: gov.contradictionPressure,
      strategic_fragmentation: gov.fragmentation,
      operational_noise: gov.operationalNoise,
      semantic_instability: gov.semanticInstability,
      authority_distortion: gov.authorityDistortion,
      sustainability_continuity: t.sustainability_score ?? 0,
      adaptability_continuity: t.adaptive_capacity_score ?? 0,
      recovery_continuity: cont.recovery,
      execution_continuity: cont.execution,
      long_horizon_survivability: gov.longHorizon,
      systemic_trustworthiness: trust.trust,
      existential_stability: gov.existentialStability,
      notes: gov.summary,
      created_by: u.user?.id ?? null,
      snapshot: { gov, cont, trust, entropy },
    };
    const { error } = await (supabase as any).from("seo_meta_governance_snapshots").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Erro ao salvar snapshot", description: error.message, variant: "destructive" });
    else toast({ title: "Governance snapshot capturado", description: "Persistido em seo_meta_governance_snapshots." });
  };

  const { gov, cont, trust, entropy, t } = data;
  const driftScore = Math.round((entropy.strategic * 0.5 + (t.semantic_drift_score ?? 0) * 0.5));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Meta Governance Core</h1>
          <p className="text-sm text-muted-foreground">
            Camada máxima de governança estratégica — supervisão read-only. Safe Mode absoluto.
          </p>
        </div>
        <Button onClick={captureSnapshot} disabled={saving}>
          {saving ? "Salvando…" : "Capture Governance Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi label="Governance" value={gov.score} />
        <Kpi label="Consistency" value={gov.consistency} />
        <Kpi label="Trustworthiness" value={trust.trust} />
        <Kpi label="Continuity" value={cont.durability} />
        <Kpi label="Entropy" value={entropy.entropy} />
        <Kpi label="Existential Stab." value={gov.existentialStability} />
      </div>

      <Tabs defaultValue="core">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="core">Governance Core</TabsTrigger>
          <TabsTrigger value="consistency">Systemic Consistency</TabsTrigger>
          <TabsTrigger value="governability">Strategic Governability</TabsTrigger>
          <TabsTrigger value="predictability">Operational Predictability</TabsTrigger>
          <TabsTrigger value="cohesion">Semantic Cohesion</TabsTrigger>
          <TabsTrigger value="authority">Authority Balance</TabsTrigger>
          <TabsTrigger value="continuity">Continuity</TabsTrigger>
          <TabsTrigger value="entropy">Governance Entropy</TabsTrigger>
          <TabsTrigger value="trust">Systemic Trust</TabsTrigger>
          <TabsTrigger value="drift">Governance Drift</TabsTrigger>
          <TabsTrigger value="contradictions">Contradictions</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="core">
          <div className="grid md:grid-cols-2 gap-4">
            <GovernanceScoreCard report={gov} />
            <Card className="p-4 text-sm space-y-2">
              <p className="font-medium">Vetores de Resiliência</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {gov.resilience_vectors.length === 0 && <li>—</li>}
                {gov.resilience_vectors.map((s) => <li key={s}>{s}</li>)}
              </ul>
              <p className="font-medium pt-2">Dependências Estratégicas</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {gov.strategic_dependencies.length === 0 && <li>Sem dependências críticas.</li>}
                {gov.strategic_dependencies.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consistency">
          <SystemicConsistencyMatrix
            consistency={gov.consistency}
            operational={t.operational_score ?? 0}
            strategic={t.strategic_alignment_score ?? 0}
            semantic={t.semantic_stability_score ?? 0}
            authority={gov.authorityBalance}
          />
        </TabsContent>

        <TabsContent value="governability">
          <StrategicGovernabilityGauge
            governability={gov.governability}
            alignment={t.strategic_alignment_score ?? 0}
            focus={t.execution_focus_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="predictability">
          <OperationalPredictabilityCard
            predictability={gov.predictability}
            efficiency={t.execution_efficiency ?? 0}
            noise={t.execution_noise_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="cohesion">
          <SemanticCohesionRadar
            cohesion={gov.cohesion}
            balance={t.semantic_balance_score ?? 0}
            connectivity={t.semantic_connectivity_score ?? 0}
            drift={t.semantic_drift_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="authority">
          <AuthorityBalanceGauge
            balance={gov.authorityBalance}
            instability={t.authority_instability_score ?? 0}
            overcentralization={t.overcentralization_risk ?? 0}
          />
        </TabsContent>

        <TabsContent value="continuity">
          <ContinuityBreakMap report={cont} />
        </TabsContent>

        <TabsContent value="entropy">
          <GovernanceEntropyPanel report={entropy} />
        </TabsContent>

        <TabsContent value="trust">
          <SystemicTrustPanel report={trust} />
        </TabsContent>

        <TabsContent value="drift">
          <GovernanceDriftAlert drift={driftScore} alerts={[...entropy.drift, ...entropy.meta_instability]} />
        </TabsContent>

        <TabsContent value="contradictions">
          <Card className="p-4 text-sm space-y-3">
            <p className="font-medium">Contradições Estratégicas</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {gov.contradictions.length === 0 && <li>Sem contradições relevantes.</li>}
              {gov.contradictions.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Conflitos Sistêmicos</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {gov.systemic_conflicts.length === 0 && <li>—</li>}
              {gov.systemic_conflicts.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Alertas de Governança</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {gov.governance_alerts.length === 0 && <li>—</li>}
              {gov.governance_alerts.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card className="p-4 text-sm space-y-3">
            <p className="font-medium">Executive Governance Summary</p>
            <p>{gov.summary}</p>
            <p className="font-medium pt-2">Forças</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {gov.strengths.length === 0 && <li>—</li>}
              {gov.strengths.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Fraquezas</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {gov.weaknesses.length === 0 && <li>—</li>}
              {gov.weaknesses.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Riscos de Continuidade</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {gov.continuity_risks.length === 0 && <li>—</li>}
              {gov.continuity_risks.map((s) => <li key={s}>{s}</li>)}
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
