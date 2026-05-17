/**
 * Final Phase — SEO Executive Home.
 * Consolidated, compressed executive surface (12 compact blocks).
 * Read-only. Manual snapshot only.
 */
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import ExecutiveOverviewCard from "@/components/admin/ExecutiveOverviewCard";
import StrategicPriorityPanel from "@/components/admin/StrategicPriorityPanel";
import CriticalRiskBoard from "@/components/admin/CriticalRiskBoard";
import ExecutionFocusMap from "@/components/admin/ExecutionFocusMap";
import TelemetryCompressionGauge from "@/components/admin/TelemetryCompressionGauge";
import MaintainabilityScoreCard from "@/components/admin/MaintainabilityScoreCard";
import OperationalSimplicityGauge from "@/components/admin/OperationalSimplicityGauge";
import PerformancePressurePanel from "@/components/admin/PerformancePressurePanel";
import GovernanceTopologyMap from "@/components/admin/GovernanceTopologyMap";
import ExecutiveFinalSummary from "@/components/admin/ExecutiveFinalSummary";

import { calculateMaintainabilityScore } from "@/lib/systemHardening";
import { detectTelemetryObesity, estimateTelemetryMaintenanceCost } from "@/lib/telemetryPruning";
import {
  buildExecutiveOverview, buildTopStrategicPriorities, buildTopCriticalRisks,
  buildTopExecutionActions, buildSuppressionHighlights, buildExecutiveFocusAreas,
  compressOperationalNarrative,
} from "@/lib/executiveUxCompression";
import {
  estimateTelemetryLoad, estimateSnapshotGrowth,
  buildPerformancePressureMap, estimateFutureScalabilityRisk,
} from "@/lib/performanceStabilization";
import {
  detectOperationalOverload, detectDashboardFatigue, detectExcessiveAbstraction,
  detectDecisionFragmentation, calculateOperationalSimplicity, buildSimplificationRoadmap,
} from "@/lib/operationalSimplification";
import { buildSystemTopology } from "@/lib/systemDocumentation";

export default function AdminSeoExecutiveHome() {
  const [saving, setSaving] = useState(false);

  const view = useMemo(() => {
    // Approximations from current architectural state — read-only diagnostic.
    const maintainability = calculateMaintainabilityScore({
      cycles: 0, leaks: 2, drift: 35, bloat: 25, unused: 1, dead: 3,
    });
    const obesity = detectTelemetryObesity(180, 90);
    const telemetryCost = estimateTelemetryMaintenanceCost([]);
    const overload = detectOperationalOverload({ dashboards: 36, metrics: 180, engines: 32 });
    const fatigue = detectDashboardFatigue(36, 14);
    const abstraction = detectExcessiveAbstraction(8, 4);
    const fragmentation = detectDecisionFragmentation(14, 8);
    const simplicity = calculateOperationalSimplicity({ overload, fatigue, abstraction, fragmentation });
    const telemetryLoad = estimateTelemetryLoad(180, 5);
    const snapshotGrowth = estimateSnapshotGrowth(120, 30);
    const pressureMap = buildPerformancePressureMap({
      heavySelectors: 1, expensiveAggs: 1, telemetryLoad, snapshotGrowth,
    });
    const scalabilityRisk = estimateFutureScalabilityRisk(pressureMap);
    const telemetryEfficiency = Math.max(0, 100 - Math.round((obesity + telemetryCost) / 2));
    const runtimeStability = 78;
    const governanceIntegrity = 82;
    const documentationCompleteness = 70;
    const observabilityEfficiency = telemetryEfficiency;
    const executiveClarity = Math.round((simplicity + telemetryEfficiency + maintainability) / 3);

    const overview = buildExecutiveOverview([
      maintainability, simplicity, telemetryEfficiency, runtimeStability,
      governanceIntegrity, executiveClarity,
    ]);
    const priorities = buildTopStrategicPriorities([
      { name: "Consolidar dashboards", weight: fatigue },
      { name: "Reduzir métricas redundantes", weight: obesity },
      { name: "Estabilizar performance", weight: scalabilityRisk },
      { name: "Centralizar decisões executivas", weight: fragmentation },
      { name: "Completar documentação", weight: 100 - documentationCompleteness },
    ]);
    const risks = buildTopCriticalRisks([
      { name: "Inflação de telemetria", severity: obesity },
      { name: "Fragmentação decisória", severity: fragmentation },
      { name: "Excesso de abstração meta", severity: abstraction },
      { name: "Sobrecarga operacional", severity: overload },
      { name: "Pressão de performance", severity: scalabilityRisk },
    ]);
    const actions = buildTopExecutionActions([
      { name: "Unificar dashboards SEO", leverage: 90 },
      { name: "Marcar métricas como PRUNABLE", leverage: 78 },
      { name: "Documentar engines core", leverage: 70 },
      { name: "Reduzir camadas meta", leverage: 65 },
      { name: "Definir canon de scores executivos", leverage: 60 },
    ]);
    const suppressions = buildSuppressionHighlights([
      { name: "Métricas duplicadas entre fabrics", cost: 70 },
      { name: "Dashboards filosóficos sobrepostos", cost: 65 },
      { name: "Snapshots manuais raramente usados", cost: 40 },
    ]);
    const focusAreas = buildExecutiveFocusAreas({
      simplicity, telemetryEfficiency, maintainability,
      runtimeStability, governanceIntegrity, executiveClarity,
    });
    const narrative = compressOperationalNarrative(overview, priorities, risks);
    const roadmap = buildSimplificationRoadmap({ overload, fatigue, abstraction, fragmentation });
    const topology = buildSystemTopology([
      { name: "Indexation", layer: "core", purpose: "" },
      { name: "Authority", layer: "core", purpose: "" },
      { name: "Discovery", layer: "core", purpose: "" },
      { name: "Knowledge Graph", layer: "intelligence", purpose: "" },
      { name: "Forecasting", layer: "intelligence", purpose: "" },
      { name: "Governance Matrix", layer: "governance", purpose: "" },
      { name: "Execution Orchestrator", layer: "execution", purpose: "" },
      { name: "Consolidation", layer: "executive", purpose: "" },
    ]);

    return {
      overview, priorities, risks, actions, suppressions, focusAreas, narrative,
      maintainability, simplicity, telemetryEfficiency, runtimeStability,
      governanceIntegrity, documentationCompleteness, observabilityEfficiency,
      executiveClarity, scalabilityRisk, overload, fatigue, abstraction, fragmentation,
      obesity, pressureMap, roadmap, topology,
      finalizationConfidence: Math.round(
        (overview.headlineScore + executiveClarity + simplicity + maintainability) / 4,
      ),
    };
  }, []);

  const handleSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("seo_system_finalization_snapshots")
        .insert({
          maintainability_score: view.maintainability,
          operational_simplicity_score: view.simplicity,
          telemetry_efficiency_score: view.telemetryEfficiency,
          executive_clarity_score: view.executiveClarity,
          runtime_stability_score: view.runtimeStability,
          governance_integrity_score: view.governanceIntegrity,
          documentation_completeness_score: view.documentationCompleteness,
          scalability_risk_score: view.scalabilityRisk,
          operational_overload_score: view.overload,
          observability_efficiency_score: view.observabilityEfficiency,
          performance_pressure_score: view.scalabilityRisk,
          finalization_confidence_score: view.finalizationConfidence,
          notes: view.narrative,
        });
      if (error) throw error;
      toast.success("Snapshot final capturado.");
    } catch (e: any) {
      toast.error("Falha ao capturar snapshot", { description: e?.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">SEO Executive Home</h1>
          <p className="text-sm text-muted-foreground">
            Camada final consolidada — clareza executiva, sem expansão conceitual.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">SAFE MODE</Badge>
          <Button onClick={handleSnapshot} disabled={saving} size="sm">
            {saving ? "Capturando…" : "Capture Final Snapshot"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* 1 */}
        <ExecutiveOverviewCard
          status={view.overview.systemStatus}
          score={view.overview.headlineScore}
          narrative={view.narrative}
        />
        {/* 2 */}
        <StrategicPriorityPanel items={view.priorities} />
        {/* 3 */}
        <CriticalRiskBoard risks={view.risks} />
        {/* 4 */}
        <ExecutionFocusMap actions={view.actions} focusAreas={view.focusAreas} />
        {/* 5 — Focus Areas (already in 4); use a compact health card */}
        <Card>
          <CardHeader><CardTitle className="text-base">Operational Health</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="text-3xl font-bold">{view.runtimeStability}</div>
            <Progress value={view.runtimeStability} />
            <div className="flex justify-between"><span className="text-muted-foreground">Governance integrity</span><b>{view.governanceIntegrity}</b></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Documentation</span><b>{view.documentationCompleteness}</b></div>
          </CardContent>
        </Card>
        {/* 6 */}
        <OperationalSimplicityGauge score={view.simplicity} overload={view.overload} fatigue={view.fatigue} />
        {/* 7 */}
        <Card>
          <CardHeader><CardTitle className="text-base">Execution Sustainability</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="text-3xl font-bold">{view.executiveClarity}</div>
            <Progress value={view.executiveClarity} />
            <div className="flex justify-between"><span className="text-muted-foreground">Fragmentação decisória</span><b>{view.fragmentation}</b></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Abstração excessiva</span><b>{view.abstraction}</b></div>
          </CardContent>
        </Card>
        {/* 8 */}
        <Card>
          <CardHeader><CardTitle className="text-base">Compound Growth</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="text-muted-foreground">Alavancagem composta vem de:</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Unificação de dashboards</li>
              <li>Métricas core estáveis</li>
              <li>Documentação viva</li>
            </ul>
          </CardContent>
        </Card>
        {/* 9 */}
        <Card>
          <CardHeader><CardTitle className="text-base">Waste & Suppressions</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {view.suppressions.length === 0 ? (
              <p className="text-muted-foreground">Sem desperdícios destacados.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {view.suppressions.map((s) => <li key={s}>{s}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>
        {/* 10 */}
        <GovernanceTopologyMap topology={view.topology} />
        {/* 11 */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recovery Capacity</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="text-3xl font-bold">{Math.max(40, 100 - view.scalabilityRisk)}</div>
            <Progress value={Math.max(40, 100 - view.scalabilityRisk)} />
            <p className="text-muted-foreground text-xs">
              Capacidade estimada de recuperação após eventos sistêmicos.
            </p>
          </CardContent>
        </Card>
        {/* 12 */}
        <ExecutiveFinalSummary
          confidence={view.finalizationConfidence}
          narrative={view.narrative}
          roadmap={view.roadmap}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MaintainabilityScoreCard
          score={view.maintainability} cycles={0} leaks={2} unused={1}
        />
        <TelemetryCompressionGauge
          efficiency={view.telemetryEfficiency} obesity={view.obesity} prunable={6}
        />
        <PerformancePressurePanel
          pressure={view.pressureMap}
          scalabilityRisk={view.scalabilityRisk}
          hotspots={[]}
        />
      </div>
    </div>
  );
}
