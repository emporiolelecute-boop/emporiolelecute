/**
 * Final Phase — Hardening, Governance & Commercial Reality.
 * Read-only dashboard. Manual snapshot only. SAFE MODE absolute.
 */
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { PerformanceHardeningCard } from "@/components/admin/PerformanceHardeningCard";
import { CachePressurePanel } from "@/components/admin/CachePressurePanel";
import { CommercialCorrelationRadar } from "@/components/admin/CommercialCorrelationRadar";
import { OperationalGovernanceMatrix } from "@/components/admin/OperationalGovernanceMatrix";
import { DocumentationReliabilityGauge } from "@/components/admin/DocumentationReliabilityGauge";
import { MaintenanceLiabilityCard } from "@/components/admin/MaintenanceLiabilityCard";
import { ComplexityWithoutValueAlert } from "@/components/admin/ComplexityWithoutValueAlert";
import { SustainableComplexityGauge } from "@/components/admin/SustainableComplexityGauge";
import { OperationalPlaybookPanel } from "@/components/admin/OperationalPlaybookPanel";
import { FinalGovernanceSummary } from "@/components/admin/FinalGovernanceSummary";

import {
  detectHeavyRoutes, detectOversizedDashboards, estimateHydrationPressure,
  estimateBundleFragmentation, detectQueryOverfetching, detectTelemetryOvercomputation,
  buildPerformanceHardeningPlan, calculatePerformancePressure,
} from "@/lib/performanceHardening";
import {
  detectDuplicateQueries, detectCachePressure, estimateReactQueryLoad,
  detectInefficientInvalidations, buildCacheOptimizationMap, buildQueryGovernanceReport,
  calculateCacheHealth,
} from "@/lib/queryGovernance";
import {
  correlateThemesVsRevenuePotential, correlateAuthorityVsCommercialIntent,
  correlateReviewsVsConversionTrust, correlateTaxonomyDepthVsSalesOpportunity,
  detectCommerciallyUnderleveragedEntities, buildCommercialPriorityMatrix,
  calculateCommercialLeverage,
} from "@/lib/commercialCorrelation";
import {
  buildOperationalPlaybooks, buildWeeklyOpsCycle, buildMonthlyGovernanceCycle,
  buildQuarterlyAuditCycle, detectGovernanceGaps, calculateGovernanceMaturity,
} from "@/lib/operationalGovernance";
import {
  detectCriticalDocumentationGaps, calculateDocumentationReliability,
  buildDocumentationPriorities,
} from "@/lib/documentationHardening";
import {
  detectComplexityWithoutValue, estimateMaintenanceLiability, detectOperationalBloat,
  buildSimplificationBacklog, calculateSustainableComplexity,
} from "@/lib/simplificationGovernance";

export default function AdminSeoFinalGovernance() {
  const [saving, setSaving] = useState(false);

  // Empty inputs — real wiring is intentionally manual / additive.
  const routes = useMemo(() => [], []);
  const dashboards = useMemo(() => [], []);
  const queries = useMemo(() => [], []);
  const invalidations = useMemo(() => [], []);
  const themesRev = useMemo(() => [], []);
  const authIntent = useMemo(() => [], []);
  const reviewsTrust = useMemo(() => [], []);
  const taxoDepth = useMemo(() => [], []);
  const commEntities = useMemo(() => [], []);
  const modules = useMemo(() => [], []);
  const components = useMemo(() => [], []);

  // Performance
  const heavyRoutes = useMemo(() => detectHeavyRoutes(routes), [routes]);
  const oversized = useMemo(() => detectOversizedDashboards(dashboards), [dashboards]);
  const hydration = useMemo(() => estimateHydrationPressure(0, 0), []);
  const fragmentation = useMemo(() => estimateBundleFragmentation(0, 0), []);
  const overfetch = useMemo(() => detectQueryOverfetching(queries), [queries]);
  const overcomp = useMemo(() => detectTelemetryOvercomputation(0), []);
  const perfPlan = useMemo(
    () => buildPerformanceHardeningPlan({
      heavyRoutes: heavyRoutes.length, oversizedDashboards: oversized.length,
      hydration, fragmentation, overfetching: overfetch.length, overcomputation: overcomp,
    }),
    [heavyRoutes.length, oversized.length, hydration, fragmentation, overfetch.length, overcomp],
  );
  const performancePressure = useMemo(
    () => calculatePerformancePressure({ hydration, fragmentation, overcomputation: overcomp }),
    [hydration, fragmentation, overcomp],
  );

  // Cache & queries
  const duplicates = useMemo(() => detectDuplicateQueries(queries), [queries]);
  const cachePressure = useMemo(() => detectCachePressure(queries), [queries]);
  const rqLoad = useMemo(() => estimateReactQueryLoad(queries), [queries]);
  const inefficient = useMemo(() => detectInefficientInvalidations(invalidations), [invalidations]);
  const cacheMap = useMemo(() => buildCacheOptimizationMap(queries), [queries]);
  const queryReport = useMemo(
    () => buildQueryGovernanceReport({
      duplicates: duplicates.length, pressure: cachePressure, load: rqLoad, inefficient: inefficient.length,
    }),
    [duplicates.length, cachePressure, rqLoad, inefficient.length],
  );
  const cacheHealth = useMemo(
    () => calculateCacheHealth({ pressure: cachePressure, load: rqLoad }),
    [cachePressure, rqLoad],
  );

  // Commercial
  const themeCorr = useMemo(() => correlateThemesVsRevenuePotential(themesRev), [themesRev]);
  const authCorr = useMemo(() => correlateAuthorityVsCommercialIntent(authIntent), [authIntent]);
  const reviewCorr = useMemo(() => correlateReviewsVsConversionTrust(reviewsTrust), [reviewsTrust]);
  const taxoCorr = useMemo(() => correlateTaxonomyDepthVsSalesOpportunity(taxoDepth), [taxoDepth]);
  const underleveraged = useMemo(() => detectCommerciallyUnderleveragedEntities(commEntities), [commEntities]);
  const priorityMatrix = useMemo(
    () => buildCommercialPriorityMatrix({ underleveraged, authorityCorr: authCorr, themeCorr }),
    [underleveraged, authCorr, themeCorr],
  );
  const commercialLeverage = useMemo(
    () => calculateCommercialLeverage({
      underleveragedCount: underleveraged.length,
      authorityPearson: authCorr.pearson,
      themePearson: themeCorr.pearson,
    }),
    [underleveraged.length, authCorr.pearson, themeCorr.pearson],
  );

  // Governance
  const playbooks = useMemo(buildOperationalPlaybooks, []);
  const weekly = useMemo(buildWeeklyOpsCycle, []);
  const monthly = useMemo(buildMonthlyGovernanceCycle, []);
  const quarterly = useMemo(buildQuarterlyAuditCycle, []);
  const gaps = useMemo(
    () => detectGovernanceGaps({
      hasWeeklyOps: true, hasMonthlyAudit: true, hasQuarterlyReview: true,
      hasDocumentationOwner: false, hasSnapshotCadence: true,
    }),
    [],
  );
  const governance = useMemo(
    () => calculateGovernanceMaturity({ playbooks: playbooks.length, gaps, snapshotsLast90d: 0 }),
    [playbooks.length, gaps],
  );

  // Documentation
  const docGaps = useMemo(() => detectCriticalDocumentationGaps(modules), [modules]);
  const docReliability = useMemo(() => calculateDocumentationReliability(modules), [modules]);
  const docPriorities = useMemo(
    () => buildDocumentationPriorities({ gaps: docGaps, reliability: docReliability }),
    [docGaps, docReliability],
  );

  // Simplification
  const cwoValue = useMemo(() => detectComplexityWithoutValue(components), [components]);
  const liability = useMemo(() => estimateMaintenanceLiability(components), [components]);
  const bloat = useMemo(
    () => detectOperationalBloat({ dashboards: dashboards.length, engines: 0, libs: 0 }),
    [dashboards.length],
  );
  const backlog = useMemo(
    () => buildSimplificationBacklog({ complexityWithoutValue: cwoValue }),
    [cwoValue],
  );
  const sustainable = useMemo(
    () => calculateSustainableComplexity({ bloat, liability, backlogSize: backlog.length }),
    [bloat, liability, backlog.length],
  );
  const operationalSustainability = Math.round((governance + sustainable + (100 - liability)) / 3);

  const handleSnapshot = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("seo_final_governance_snapshots" as any)
        .insert({
          governance_maturity_score: governance,
          sustainable_complexity_score: sustainable,
          maintenance_liability_score: liability,
          documentation_reliability_score: docReliability,
          commercial_leverage_score: commercialLeverage,
          performance_pressure_score: performancePressure,
          cache_pressure_score: cachePressure,
          operational_bloat_score: bloat,
          simplification_backlog_score: backlog.length,
          operational_sustainability_score: operationalSustainability,
        } as any);
      if (error) throw error;
      toast.success("Final Governance snapshot captured.");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to capture snapshot.");
    } finally {
      setSaving(false);
    }
  };

  const Kpi = ({ label, value }: { label: string; value: number }) => (
    <div className="rounded-md border border-border/60 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">SEO Final Governance</h1>
          <p className="text-sm text-muted-foreground">
            Hardening, governance, performance and commercial reality. Read-only. SAFE MODE.
          </p>
        </div>
        <Button onClick={handleSnapshot} disabled={saving}>
          {saving ? "Capturing…" : "Capture Governance Snapshot"}
        </Button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi label="Governance Maturity" value={governance} />
        <Kpi label="Sustainable Complexity" value={sustainable} />
        <Kpi label="Maintenance Liability" value={liability} />
        <Kpi label="Documentation Reliability" value={docReliability} />
        <Kpi label="Commercial Leverage" value={commercialLeverage} />
        <Kpi label="Performance Pressure" value={performancePressure} />
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="cache">Cache & Queries</TabsTrigger>
          <TabsTrigger value="commercial">Commercial Correlation</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="complexity">Complexity</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="simplification">Simplification</TabsTrigger>
          <TabsTrigger value="executive">Executive Final Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-4">
          <PerformanceHardeningCard pressure={performancePressure} plan={perfPlan} />
        </TabsContent>

        <TabsContent value="cache" className="mt-4 space-y-4">
          <CachePressurePanel pressure={cachePressure} load={rqLoad} report={queryReport} />
          <Card>
            <CardHeader><CardTitle className="text-sm">Cache Health</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Composite cache health score: <span className="font-bold text-foreground">{cacheHealth}</span>.
              Optimization suggestions: {Object.keys(cacheMap).length}.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="mt-4 space-y-4">
          <CommercialCorrelationRadar
            leverage={commercialLeverage}
            items={[
              { label: "Themes vs Revenue Potential", pearson: themeCorr.pearson, sampleSize: themeCorr.sampleSize },
              { label: "Authority vs Commercial Intent", pearson: authCorr.pearson, sampleSize: authCorr.sampleSize },
              { label: "Reviews vs Conversion Trust", pearson: reviewCorr.pearson, sampleSize: reviewCorr.sampleSize },
              { label: "Taxonomy Depth vs Sales Opp.", pearson: taxoCorr.pearson, sampleSize: taxoCorr.sampleSize },
            ]}
          />
          <Card>
            <CardHeader><CardTitle className="text-sm">Commercial Priority Matrix</CardTitle></CardHeader>
            <CardContent className="text-xs">
              {priorityMatrix.length === 0
                ? <p className="text-muted-foreground">No underleveraged entities detected.</p>
                : <ul className="space-y-1">{priorityMatrix.slice(0, 20).map((p) => (
                    <li key={p.id} className="flex justify-between border-b border-border/40 pb-1">
                      <span className="truncate">{p.id}</span>
                      <span className="tabular-nums font-bold">{p.score}</span>
                    </li>
                  ))}</ul>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="mt-4">
          <OperationalGovernanceMatrix maturity={governance} gaps={gaps} />
        </TabsContent>

        <TabsContent value="documentation" className="mt-4">
          <DocumentationReliabilityGauge reliability={docReliability} priorities={docPriorities} />
        </TabsContent>

        <TabsContent value="complexity" className="mt-4">
          <ComplexityWithoutValueAlert items={cwoValue} />
        </TabsContent>

        <TabsContent value="sustainability" className="mt-4">
          <SustainableComplexityGauge sustainable={sustainable} bloat={bloat} backlog={backlog.length} />
        </TabsContent>

        <TabsContent value="operations" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Operational Cycles</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="font-medium mb-1">Weekly</div>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">{weekly.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div>
                <div className="font-medium mb-1">Monthly</div>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">{monthly.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div>
                <div className="font-medium mb-1">Quarterly</div>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">{quarterly.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playbooks" className="mt-4">
          <OperationalPlaybookPanel playbooks={playbooks} />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <MaintenanceLiabilityCard liability={liability} topItems={cwoValue.slice(0, 5)} />
        </TabsContent>

        <TabsContent value="simplification" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Simplification Backlog ({backlog.length})</CardTitle></CardHeader>
            <CardContent className="text-xs">
              {backlog.length === 0
                ? <p className="text-muted-foreground">Backlog clear.</p>
                : <ul className="space-y-1">{backlog.map((b) => (
                    <li key={b.id} className="flex justify-between border-b border-border/40 pb-1">
                      <span className="truncate">{b.name}</span>
                      <span className="text-muted-foreground">{b.reason} · <b>{b.priority}</b></span>
                    </li>
                  ))}</ul>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executive" className="mt-4">
          <FinalGovernanceSummary
            governance={governance}
            sustainable={sustainable}
            liability={liability}
            documentation={docReliability}
            commercial={commercialLeverage}
            performance={performancePressure}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
