/**
 * Phase: Operational Stabilization & Real-World Validation
 * Read-only dashboard. Manual snapshot only. SAFE MODE absolute.
 */
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import OperationalUsageCard from "@/components/admin/OperationalUsageCard";
import VanityComplexityAlert from "@/components/admin/VanityComplexityAlert";
import PerformancePressureGauge from "@/components/admin/PerformancePressureGauge";
import CommercialOpportunityRadar from "@/components/admin/CommercialOpportunityRadar";
import MaintenanceBurdenPanel from "@/components/admin/MaintenanceBurdenPanel";
import DocumentationCoverageCard from "@/components/admin/DocumentationCoverageCard";
import DependencyOpacityHeatmap from "@/components/admin/DependencyOpacityHeatmap";
import HumanOperationsChecklist from "@/components/admin/HumanOperationsChecklist";
import ExecutivePruningMatrix from "@/components/admin/ExecutivePruningMatrix";
import OperationalRealitySummary from "@/components/admin/OperationalRealitySummary";

import {
  detectUnusedDashboards, detectUnusedMetrics, detectUnusedEngines,
  calculateDashboardEngagement, calculateOperationalValue,
  detectVanitySystems, buildOperationalPriorityMap,
} from "@/lib/operationalUsage";
import {
  estimateDashboardRenderCost, estimateTelemetryCost, estimateReactQueryPressure,
  estimateBundleGrowthRisk, estimateHydrationComplexity, detectHeavyAdminRoutes,
  buildPerformanceRecommendations,
} from "@/lib/adminPerformance";
import {
  buildCommercialOpportunityMap, correlateAuthorityVsConversion,
  correlateReviewsVsSalesPotential, correlateThemesVsCommercialIntent,
} from "@/lib/commercialIntelligence";
import {
  buildExecutivePruningReport, calculateComplexityCost, estimateMaintenanceBurden,
  detectLowValueSystems,
} from "@/lib/executivePruning";
import {
  buildDocumentationCoverage, detectDependencyOpacity,
  calculateDocumentationHealth, buildGovernanceChecklist,
} from "@/lib/documentationGovernance";
import {
  buildWeeklyOperationalChecklist, buildMonthlyReviewChecklist,
  buildQuarterlyAuditChecklist, buildExecutiveReviewSummary,
} from "@/lib/humanOperations";

export default function AdminSeoOperationalReality() {
  const [saving, setSaving] = useState(false);

  // --- Mock empty inputs (real data must be supplied manually via future wiring) ---
  const dashboards = useMemo(() => [], []);
  const metrics = useMemo(() => [], []);
  const engines = useMemo(() => [], []);
  const routes = useMemo(() => [], []);
  const queries = useMemo(() => [], []);
  const telemetryFlows = useMemo(() => [], []);
  const systemNodes = useMemo(() => [], []);
  const documentedSystems = useMemo(() => [], []);
  const authority = useMemo(() => [], []);
  const reviews = useMemo(() => [], []);
  const themes = useMemo(() => [], []);

  // --- Derived diagnostics ---
  const operationalValue = useMemo(
    () => calculateOperationalValue(dashboards, metrics, engines),
    [dashboards, metrics, engines],
  );
  const dashboardEngagement = useMemo(
    () => calculateDashboardEngagement(dashboards),
    [dashboards],
  );
  const unusedDashboards = useMemo(() => detectUnusedDashboards(dashboards), [dashboards]);
  const unusedMetrics = useMemo(() => detectUnusedMetrics(metrics), [metrics]);
  const unusedEngines = useMemo(() => detectUnusedEngines(engines), [engines]);
  const vanity = useMemo(() => detectVanitySystems(dashboards, engines), [dashboards, engines]);
  const priorityMap = useMemo(
    () => buildOperationalPriorityMap(dashboards, metrics, engines),
    [dashboards, metrics, engines],
  );

  const renderCost = useMemo(
    () => Math.round(routes.reduce((s, r) => s + estimateDashboardRenderCost(r as any), 0) / Math.max(1, routes.length)),
    [routes],
  );
  const telemetryCost = useMemo(() => estimateTelemetryCost(telemetryFlows), [telemetryFlows]);
  const queryPressure = useMemo(() => estimateReactQueryPressure(queries), [queries]);
  const bundleRisk = useMemo(() => estimateBundleGrowthRisk(routes), [routes]);
  const hydration = useMemo(() => estimateHydrationComplexity(routes), [routes]);
  const heavyRoutes = useMemo(() => detectHeavyAdminRoutes(routes), [routes]);
  const perfRecs = useMemo(
    () => buildPerformanceRecommendations({
      renderCost, telemetryCost, queryPressure, bundleRisk, hydrationComplexity: hydration,
    }),
    [renderCost, telemetryCost, queryPressure, bundleRisk, hydration],
  );
  const performancePressure = Math.round(
    (renderCost + telemetryCost + queryPressure + bundleRisk + hydration) / 5,
  );

  const opportunities = useMemo(
    () => buildCommercialOpportunityMap({ authority, reviews, themes }),
    [authority, reviews, themes],
  );
  const authCorr = useMemo(() => correlateAuthorityVsConversion(authority), [authority]);
  const reviewCorr = useMemo(() => correlateReviewsVsSalesPotential(reviews), [reviews]);
  const themeCorr = useMemo(() => correlateThemesVsCommercialIntent(themes), [themes]);

  const pruning = useMemo(() => buildExecutivePruningReport(systemNodes), [systemNodes]);
  const complexityCost = useMemo(() => calculateComplexityCost(systemNodes), [systemNodes]);
  const maintenanceBurden = useMemo(() => estimateMaintenanceBurden(systemNodes), [systemNodes]);
  const lowValue = useMemo(() => detectLowValueSystems(systemNodes), [systemNodes]);

  const docCoverage = useMemo(() => buildDocumentationCoverage(documentedSystems), [documentedSystems]);
  const docHealth = useMemo(() => calculateDocumentationHealth(documentedSystems), [documentedSystems]);
  const opacity = useMemo(() => detectDependencyOpacity(documentedSystems), [documentedSystems]);
  const govChecklist = useMemo(() => buildGovernanceChecklist(documentedSystems), [documentedSystems]);

  const weekly = useMemo(buildWeeklyOperationalChecklist, []);
  const monthly = useMemo(buildMonthlyReviewChecklist, []);
  const quarterly = useMemo(buildQuarterlyAuditChecklist, []);
  const allChecklists = useMemo(() => [...weekly, ...monthly, ...quarterly], [weekly, monthly, quarterly]);

  // KPIs
  const commercialOpportunity = Math.min(
    100,
    Math.round(opportunities.slice(0, 5).reduce((s, o) => s + o.score, 0) / 5) || 0,
  );
  const sustainability = Math.max(
    0,
    Math.min(100, Math.round((operationalValue + docHealth + (100 - complexityCost)) / 3)),
  );
  const governanceMaturity = Math.round(
    (govChecklist.filter((c) => c.done).length / Math.max(1, govChecklist.length)) * 100,
  );
  const humanOperability = Math.min(100, weekly.length * 10 + monthly.length * 6 + quarterly.length * 4);
  const pruningReadiness = Math.min(100, pruning.candidates.length * 8 + pruning.simplifications.length * 4);
  const signalToNoise = Math.max(0, Math.min(100, 100 - vanity.length * 8 - unusedMetrics.length * 4));

  const handleSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("seo_operational_reality_snapshots" as any)
        .insert({
          operational_value_score: operationalValue,
          dashboard_utilization_score: dashboardEngagement,
          performance_pressure_score: performancePressure,
          maintenance_burden_score: maintenanceBurden,
          documentation_health_score: docHealth,
          commercial_opportunity_score: commercialOpportunity,
          pruning_readiness_score: pruningReadiness,
          complexity_cost_score: complexityCost,
          human_operability_score: humanOperability,
          sustainability_score: sustainability,
          governance_maturity_score: governanceMaturity,
        } as any);
      if (error) throw error;
      toast.success("Operational Reality snapshot captured.");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to capture snapshot.");
    } finally {
      setSaving(false);
    }
  };

  const summary = useMemo(
    () => buildExecutiveReviewSummary({
      cycle: "weekly",
      highlights: [
        `Operational value: ${operationalValue}`,
        `Sustainability: ${sustainability}`,
        `Commercial opportunities: ${opportunities.length}`,
      ],
      risks: [
        ...(vanity.length > 0 ? [`${vanity.length} vanity systems detected`] : []),
        ...(opacity.length > 0 ? [`${opacity.length} opaque dependencies`] : []),
        ...(performancePressure > 60 ? ["Performance pressure elevated"] : []),
      ],
      decisionsRequired: pruning.candidates.length,
    }),
    [operationalValue, sustainability, opportunities.length, vanity.length, opacity.length, performancePressure, pruning.candidates.length],
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">SEO Operational Reality</h1>
          <p className="text-sm text-muted-foreground">
            Read-only diagnostics for sustainability, governance and real-world usage. SAFE MODE.
          </p>
        </div>
        <Button onClick={handleSnapshot} disabled={saving}>
          {saving ? "Capturing…" : "Capture Operational Reality Snapshot"}
        </Button>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi label="Operational value" value={operationalValue} />
        <Kpi label="Dashboard utilization" value={dashboardEngagement} />
        <Kpi label="Performance pressure" value={performancePressure} />
        <Kpi label="Maintenance burden" value={maintenanceBurden} />
        <Kpi label="Documentation health" value={docHealth} />
        <Kpi label="Commercial opportunity" value={commercialOpportunity} />
      </div>

      <Tabs defaultValue="usage">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="usage">Operational Usage</TabsTrigger>
          <TabsTrigger value="real-value">Real Value</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="complexity">Complexity</TabsTrigger>
          <TabsTrigger value="pruning">Pruning</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="human-ops">Human Operations</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="executive">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="grid md:grid-cols-2 gap-4 mt-4">
          <OperationalUsageCard
            operationalValue={operationalValue}
            dashboardEngagement={dashboardEngagement}
            unusedDashboards={unusedDashboards.length}
            unusedMetrics={unusedMetrics.length}
            unusedEngines={unusedEngines.length}
          />
          <VanityComplexityAlert items={vanity} />
        </TabsContent>

        <TabsContent value="real-value" className="grid md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Operational Priority Map</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {priorityMap.length === 0 ? (
                <p className="text-xs text-muted-foreground">No usage data wired yet.</p>
              ) : (
                <ul className="text-xs space-y-1 max-h-72 overflow-auto">
                  {priorityMap.slice(0, 20).map((p) => (
                    <li key={p.kind + p.id} className="flex justify-between border-b pb-1 last:border-0">
                      <span className="truncate"><b>{p.id}</b> <span className="text-muted-foreground">({p.kind})</span></span>
                      <span className="font-bold">{p.valueScore}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <OperationalRealitySummary
            operationalValue={operationalValue}
            sustainability={sustainability}
            governanceMaturity={governanceMaturity}
            humanOperability={humanOperability}
            signalToNoise={signalToNoise}
          />
        </TabsContent>

        <TabsContent value="performance" className="grid md:grid-cols-2 gap-4 mt-4">
          <PerformancePressureGauge
            renderCost={renderCost}
            telemetryCost={telemetryCost}
            queryPressure={queryPressure}
            bundleRisk={bundleRisk}
            hydrationComplexity={hydration}
          />
          <Card>
            <CardHeader><CardTitle className="text-base">Recommendations</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {perfRecs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No performance recommendations.</p>
              ) : (
                <ul className="text-xs space-y-1">
                  {perfRecs.map((r, i) => (
                    <li key={i}><b className="uppercase text-[10px]">{r.severity}</b> · {r.area}: {r.message}</li>
                  ))}
                </ul>
              )}
              {heavyRoutes.length > 0 && (
                <div className="mt-3 text-xs">
                  <div className="font-medium">Heavy routes</div>
                  <ul className="list-disc pl-4 mt-1">
                    {heavyRoutes.slice(0, 8).map((r) => (
                      <li key={r.route}>{r.route} — {r.estimatedJsKb ?? 0}kb</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="grid md:grid-cols-2 gap-4 mt-4">
          <CommercialOpportunityRadar opportunities={opportunities} />
          <Card>
            <CardHeader><CardTitle className="text-base">Commercial Correlations</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <Corr label="Authority ↔ Conversion" r={authCorr.pearson} n={authCorr.sampleSize} />
              <Corr label="Reviews ↔ Sales Potential" r={reviewCorr.pearson} n={reviewCorr.sampleSize} />
              <Corr label="Themes ↔ Commercial Intent" r={themeCorr.pearson} n={themeCorr.sampleSize} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complexity" className="grid md:grid-cols-2 gap-4 mt-4">
          <MaintenanceBurdenPanel
            burdenScore={maintenanceBurden}
            complexityCost={complexityCost}
            lowValueSystems={lowValue.length}
          />
          <Card>
            <CardHeader><CardTitle className="text-base">Complexity Cost</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-3xl font-bold">{complexityCost}</div>
              <Progress value={complexityCost} />
              <p className="text-xs text-muted-foreground">
                Aggregate complexity-vs-dependency pressure across mapped system nodes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pruning" className="grid md:grid-cols-2 gap-4 mt-4">
          <ExecutivePruningMatrix candidates={pruning.candidates} />
          <Card>
            <CardHeader><CardTitle className="text-base">Simplification Candidates</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {pruning.simplifications.length === 0 ? (
                <p className="text-xs text-muted-foreground">No simplification suggestions.</p>
              ) : (
                <ul className="text-xs space-y-1 max-h-64 overflow-auto">
                  {pruning.simplifications.slice(0, 15).map((s) => (
                    <li key={s.id} className="border-b pb-1 last:border-0">
                      <div className="font-medium">{s.id} <span className="text-muted-foreground uppercase text-[10px]">{s.impact}</span></div>
                      <div className="text-muted-foreground">{s.suggestion}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="grid md:grid-cols-2 gap-4 mt-4">
          <DocumentationCoverageCard
            health={docHealth}
            total={docCoverage.total}
            documented={docCoverage.documented}
            partial={docCoverage.partial}
            undocumented={docCoverage.undocumented}
            coveragePct={docCoverage.coveragePct}
          />
          <DependencyOpacityHeatmap entries={opacity} />
        </TabsContent>

        <TabsContent value="governance" className="grid md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Governance Checklist</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <ul className="text-xs space-y-1">
                {govChecklist.map((c) => (
                  <li key={c.id} className="flex justify-between border-b pb-1 last:border-0">
                    <span>{c.label}</span>
                    <b className={c.done ? "text-primary" : "text-muted-foreground"}>{c.done ? "✓" : "—"}</b>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Governance Maturity</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-3xl font-bold">{governanceMaturity}</div>
              <Progress value={governanceMaturity} />
              <p className="text-xs text-muted-foreground">% of governance checklist items satisfied.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="human-ops" className="grid md:grid-cols-1 gap-4 mt-4">
          <HumanOperationsChecklist items={allChecklists} />
        </TabsContent>

        <TabsContent value="sustainability" className="grid md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Sustainability</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-3xl font-bold">{sustainability}</div>
              <Progress value={sustainability} />
              <p className="text-xs text-muted-foreground">
                Composite of operational value, documentation health and inverse complexity cost.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Signal-to-noise</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-3xl font-bold">{signalToNoise}</div>
              <Progress value={signalToNoise} />
              <p className="text-xs text-muted-foreground">Penalised by vanity systems and unused metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="grid md:grid-cols-2 gap-4 mt-4">
          <MaintenanceBurdenPanel
            burdenScore={maintenanceBurden}
            complexityCost={complexityCost}
            lowValueSystems={lowValue.length}
          />
          <Card>
            <CardHeader><CardTitle className="text-base">Pruning Readiness</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-3xl font-bold">{pruningReadiness}</div>
              <Progress value={pruningReadiness} />
              <p className="text-xs text-muted-foreground">
                Higher = more candidates ready for manual review.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executive" className="grid md:grid-cols-2 gap-4 mt-4">
          <OperationalRealitySummary
            operationalValue={operationalValue}
            sustainability={sustainability}
            governanceMaturity={governanceMaturity}
            humanOperability={humanOperability}
            signalToNoise={signalToNoise}
            notes={[...summary.highlights, ...summary.risks]}
          />
          <Card>
            <CardHeader><CardTitle className="text-base">Executive Review ({summary.cycle})</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-xs"><b>{summary.decisionsRequired}</b> decisions required</div>
              {summary.highlights.length > 0 && (
                <div>
                  <div className="text-xs font-medium">Highlights</div>
                  <ul className="text-xs list-disc pl-5 text-muted-foreground">
                    {summary.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              )}
              {summary.risks.length > 0 && (
                <div>
                  <div className="text-xs font-medium">Risks</div>
                  <ul className="text-xs list-disc pl-5 text-muted-foreground">
                    {summary.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
        <Progress value={value} className="h-1 mt-1" />
      </CardContent>
    </Card>
  );
}

function Corr({ label, r, n }: { label: string; r: number; n: number }) {
  return (
    <div className="flex justify-between text-xs border-b pb-1 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span><b>{r.toFixed(3)}</b> <span className="text-muted-foreground">(n={n})</span></span>
    </div>
  );
}
