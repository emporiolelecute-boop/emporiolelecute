import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import CivilizationScoreCard from "@/components/admin/CivilizationScoreCard";
import EcosystemSurvivabilityGauge from "@/components/admin/EcosystemSurvivabilityGauge";
import StrategicLongevityPanel from "@/components/admin/StrategicLongevityPanel";
import SemanticContinuityMatrix from "@/components/admin/SemanticContinuityMatrix";
import AuthorityLegacyRadar from "@/components/admin/AuthorityLegacyRadar";
import EntropyAbsorptionCard from "@/components/admin/EntropyAbsorptionCard";
import CollapseResistanceGauge from "@/components/admin/CollapseResistanceGauge";
import RecoveryPersistencePanel from "@/components/admin/RecoveryPersistencePanel";
import CivilizationIntegrityMap from "@/components/admin/CivilizationIntegrityMap";
import LongTermCompoundingChart from "@/components/admin/LongTermCompoundingChart";

import type { TelemetrySnapshot } from "@/lib/seoTelemetry";
import { buildCivilizationVerdict } from "@/lib/civilizationEngine";
import { buildLegacyReport } from "@/lib/legacyContinuity";
import { buildAbsorptionReport } from "@/lib/entropyAbsorption";
import { buildResilienceReport } from "@/lib/civilizationResilience";

const MOCK: Partial<TelemetrySnapshot> = {
  operational_score: 68, execution_efficiency: 66, execution_continuity_score: 64,
  execution_fatigue_score: 30, bottleneck_score: 28, operational_noise_score: 30,
  strategic_alignment_score: 70, strategic_consistency_score: 68, strategic_fatigue_score: 30,
  strategic_fragmentation_score: 28, contradiction_pressure_score: 28,
  semantic_stability_score: 70, semantic_cohesion_score: 66, semantic_drift_score: 30,
  semantic_entropy_score: 30, semantic_balance_score: 64, semantic_connectivity_score: 60,
  authority_persistence_score: 68, authority_balance_score: 62, authority_instability_score: 30,
  overcentralization_risk: 38, cluster_fragility_score: 36, single_point_failure_score: 30,
  ecosystem_integrity_score: 70, systemic_consistency_score: 68, structural_integrity_score: 66,
  governance_score: 68, governance_entropy_score: 32, governance_drift_score: 28,
  systemic_noise_score: 30, systemic_synchronization_score: 64,
  resilience_continuity_score: 66, long_horizon_survivability_score: 68,
  strategic_longevity_score: 66, long_term_sustainability_score: 64,
  sustainability_continuity_score: 64, compounding_health_score: 62, authority_compounding_score: 60,
  recovery_capacity_score: 64, recovery_continuity_score: 62, recovery_intelligence_score: 60,
  adaptive_capacity_score: 62, adaptability_continuity_score: 60, adaptive_recovery_score: 62,
  existential_stability_score: 64, existential_exposure_score: 30,
  collapse_probability_score: 26, collapse_resistance_score: 64, entropy_resistance_score: 62,
  survival_confidence_score: 66, long_term_viability_score: 64,
  continuity_break_risk_score: 28, civilization_decay_score: 25,
  strategic_memory_strength_score: 64, continuity_depth_score: 62,
};

export default function AdminSeoCivilization() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const data = useMemo(() => {
    const t = MOCK as TelemetrySnapshot;
    const civ = buildCivilizationVerdict(t);
    const legacy = buildLegacyReport(t);
    const absorption = buildAbsorptionReport(t);
    const resilience = buildResilienceReport(t);
    return { t, civ, legacy, absorption, resilience };
  }, []);

  const { t, civ, legacy, absorption, resilience } = data;

  const capture = async () => {
    setSaving(true);
    const payload: any = {
      civilization_score: civ.score,
      ecosystem_survivability: civ.survivability,
      semantic_continuity: civ.semanticContinuity,
      authority_legacy: civ.authorityLegacy,
      strategic_longevity: civ.strategicLongevity,
      operational_durability: civ.operationalDurability,
      systemic_resilience: resilience.resilience,
      semantic_stability: t.semantic_stability_score ?? 0,
      execution_sustainability: legacy.execution,
      governance_stability: t.governance_score ?? 0,
      adaptive_evolution: resilience.evolution,
      entropy_absorption: absorption.absorption,
      collapse_resistance: t.collapse_resistance_score ?? 0,
      recovery_persistence: resilience.recovery,
      strategic_memory_strength: legacy.memory,
      continuity_depth: legacy.continuity,
      semantic_coherence: t.semantic_cohesion_score ?? 0,
      authority_distribution: t.authority_balance_score ?? 0,
      systemic_harmony: t.systemic_synchronization_score ?? 0,
      long_term_compounding: civ.compounding,
      existential_durability: resilience.durability,
      civilization_integrity: civ.integrity,
      notes: civ.summary,
    };
    const { error } = await (supabase as any).from("seo_civilization_snapshots").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Erro ao salvar snapshot", description: error.message, variant: "destructive" });
    else toast({ title: "Civilization snapshot capturado", description: "Persistido em seo_civilization_snapshots." });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Civilization Layer</h1>
          <p className="text-sm text-muted-foreground">
            Camada civilizacional — observabilidade de permanência e legado. Safe Mode absoluto.
          </p>
        </div>
        <Button onClick={capture} disabled={saving}>
          {saving ? "Salvando…" : "Capture Civilization Snapshot"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi label="Civilization" value={civ.score} />
        <Kpi label="Survivability" value={civ.survivability} />
        <Kpi label="Compounding" value={civ.compounding} />
        <Kpi label="Collapse Resist." value={t.collapse_resistance_score ?? 0} />
        <Kpi label="Longevity" value={civ.strategicLongevity} />
        <Kpi label="Integrity" value={civ.integrity} />
      </div>

      <Tabs defaultValue="core">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="core">Civilization Core</TabsTrigger>
          <TabsTrigger value="survivability">Survivability</TabsTrigger>
          <TabsTrigger value="continuity">Semantic Continuity</TabsTrigger>
          <TabsTrigger value="legacy">Authority Legacy</TabsTrigger>
          <TabsTrigger value="longevity">Strategic Longevity</TabsTrigger>
          <TabsTrigger value="durability">Operational Durability</TabsTrigger>
          <TabsTrigger value="entropy">Entropy Absorption</TabsTrigger>
          <TabsTrigger value="collapse">Collapse Resistance</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Persistence</TabsTrigger>
          <TabsTrigger value="evolution">Adaptive Evolution</TabsTrigger>
          <TabsTrigger value="integrity">Civilization Integrity</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="core">
          <div className="grid md:grid-cols-2 gap-4">
            <CivilizationScoreCard report={civ} />
            <Card className="p-4 text-sm space-y-2">
              <p className="font-medium">Vetores de Continuidade</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {civ.continuity_vectors.length === 0 && <li>—</li>}
                {civ.continuity_vectors.map((s) => <li key={s}>{s}</li>)}
              </ul>
              <p className="font-medium pt-2">Vetores de Resiliência</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {civ.resilience_vectors.length === 0 && <li>—</li>}
                {civ.resilience_vectors.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="survivability">
          <div className="grid md:grid-cols-2 gap-4">
            <EcosystemSurvivabilityGauge
              survivability={civ.survivability}
              longTerm={t.long_term_viability_score ?? 0}
              viability={resilience.survival}
            />
            <LongTermCompoundingChart
              compounding={civ.compounding}
              durability={resilience.compounding}
              sustainability={t.long_term_sustainability_score ?? 0}
            />
          </div>
        </TabsContent>

        <TabsContent value="continuity">
          <SemanticContinuityMatrix
            continuity={civ.semanticContinuity}
            stability={t.semantic_stability_score ?? 0}
            cohesion={t.semantic_cohesion_score ?? 0}
            drift={t.semantic_drift_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="legacy">
          <AuthorityLegacyRadar
            legacy={civ.authorityLegacy}
            persistence={t.authority_persistence_score ?? 0}
            balance={t.authority_balance_score ?? 0}
            instability={t.authority_instability_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="longevity">
          <StrategicLongevityPanel
            longevity={civ.strategicLongevity}
            consistency={t.strategic_consistency_score ?? 0}
            horizon={t.long_horizon_survivability_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="durability">
          <Card className="p-4 text-sm space-y-2">
            <p className="font-medium">Operational Durability</p>
            <div className="text-4xl font-bold">{civ.operationalDurability}</div>
            <div className="flex justify-between"><span className="text-muted-foreground">Execução Eficiente</span><b>{t.execution_efficiency ?? 0}</b></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Fadiga</span><b>{t.execution_fatigue_score ?? 0}</b></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Continuidade de Execução</span><b>{legacy.execution}</b></div>
          </Card>
        </TabsContent>

        <TabsContent value="entropy">
          <EntropyAbsorptionCard report={absorption} />
        </TabsContent>

        <TabsContent value="collapse">
          <CollapseResistanceGauge
            resistance={t.collapse_resistance_score ?? 0}
            probability={t.collapse_probability_score ?? 0}
            vectors={absorption.vectors}
          />
        </TabsContent>

        <TabsContent value="recovery">
          <RecoveryPersistencePanel
            persistence={resilience.recovery}
            capacity={t.recovery_capacity_score ?? 0}
            continuity={t.recovery_continuity_score ?? 0}
            intelligence={t.recovery_intelligence_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="evolution">
          <Card className="p-4 text-sm space-y-2">
            <p className="font-medium">Adaptive Evolution</p>
            <div className="text-4xl font-bold">{resilience.evolution}</div>
            <div className="flex justify-between"><span className="text-muted-foreground">Cenário Futuro</span><b>{resilience.scenario}</b></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Sobrevivência Long-Term</span><b>{resilience.survival}</b></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Durabilidade Existencial</span><b>{resilience.durability}</b></div>
          </Card>
        </TabsContent>

        <TabsContent value="integrity">
          <CivilizationIntegrityMap
            integrity={civ.integrity}
            ecosystem={t.ecosystem_integrity_score ?? 0}
            governance={t.governance_score ?? 0}
            structural={t.structural_integrity_score ?? 0}
          />
        </TabsContent>

        <TabsContent value="summary">
          <Card className="p-4 text-sm space-y-3">
            <p className="font-medium">Executive Civilization Summary</p>
            <p>{civ.summary}</p>
            <p className="font-medium pt-2">Forças</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {civ.strengths.length === 0 && <li>—</li>}
              {civ.strengths.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Fraquezas</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {civ.weaknesses.length === 0 && <li>—</li>}
              {civ.weaknesses.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Fragilidades Estratégicas</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {civ.strategic_fragilities.length === 0 && <li>—</li>}
              {civ.strategic_fragilities.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Dependências Existenciais</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {civ.existential_dependencies.length === 0 && <li>—</li>}
              {civ.existential_dependencies.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="font-medium pt-2">Prioridades de Longo Prazo</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {civ.long_term_priorities.length === 0 && <li>—</li>}
              {civ.long_term_priorities.map((s) => <li key={s}>{s}</li>)}
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
