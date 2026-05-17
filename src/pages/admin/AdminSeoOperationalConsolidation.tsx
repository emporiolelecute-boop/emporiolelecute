import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DashboardCompressionPlanner from "@/components/admin/DashboardCompressionPlanner";
import AdminPerformanceOverview from "@/components/admin/AdminPerformanceOverview";
import OperationalGovernanceSummary from "@/components/admin/OperationalGovernanceSummary";
import {
  buildCompressionSuggestions,
  buildDefaultDashboardCatalog,
  calculateDashboardInflationScore,
  calculateDashboardRedundancyScore,
  calculateTelemetryDensityScore,
  detectEquivalentDashboards,
} from "@/lib/dashboardCompression";
import {
  EXECUTIVE_NAV,
  calculateMenuEntropyScore,
  calculateNavigationCompressionScore,
  detectNavigationSprawl,
  totalNavItems,
  visibleNavItems,
} from "@/lib/executiveNavigation";
import {
  analyzeRouteChunks,
  buildDefaultRouteProfile,
  calculateHydrationPressure,
  calculateLazyGroupingScore,
  calculateSidebarRenderCost,
  detectOverRenderRisk,
} from "@/lib/adminPerformanceCompression";
import {
  buildSimplificationRoadmap,
  calculateAdminCognitiveLoadScore,
  calculateGovernancePressureScore,
  calculateOperationalClarityScore,
  detectAdminSprawl,
  detectEntropyDrift,
  detectExcessiveComplexity,
} from "@/lib/operationalGovernance";

export default function AdminSeoOperationalConsolidation() {
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);

  const dashboards = useMemo(() => buildDefaultDashboardCatalog(), []);
  const routes = useMemo(() => buildDefaultRouteProfile(), []);
  const suggestions = useMemo(() => buildCompressionSuggestions(dashboards), [dashboards]);
  const equivalents = useMemo(() => detectEquivalentDashboards(dashboards), [dashboards]);

  const navTotal = totalNavItems();
  const navVisible = visibleNavItems();
  const navCompression = calculateNavigationCompressionScore();
  const menuEntropy = calculateMenuEntropyScore();
  const navSprawl = detectNavigationSprawl();

  const redundancyScore = calculateDashboardRedundancyScore(dashboards);
  const inflationScore = calculateDashboardInflationScore(dashboards);
  const telemetryDensity = calculateTelemetryDensityScore(dashboards);

  const routeAnalysis = analyzeRouteChunks(routes);
  const sidebarCost = calculateSidebarRenderCost({
    totalItems: navTotal, visibleItems: navVisible, collapsibleGroups: EXECUTIVE_NAV.filter(g => g.collapsible).length,
  });
  const hydration = calculateHydrationPressure(routes);
  const lazyScore = calculateLazyGroupingScore(routes);
  const overRender = detectOverRenderRisk(routes);

  const cognitiveLoad = calculateAdminCognitiveLoadScore({
    dashboardCount: dashboards.length, routeCount: routes.length, kpiCount: dashboards.reduce((s, d) => s + d.kpiCount, 0),
  });
  const pressures = detectExcessiveComplexity({
    dashboardCount: dashboards.length, routeCount: routes.length, kpiCount: dashboards.reduce((s, d) => s + d.kpiCount, 0),
  });
  const pressureScore = calculateGovernancePressureScore({ pressures, maturity: 60 });
  const clarityScore = calculateOperationalClarityScore({
    redundancyScore, cognitiveLoad, pressure: pressureScore,
  });
  const drift = detectEntropyDrift({ newDashboardsLast30d: 4, newRoutesLast30d: 5 });
  const sprawl = detectAdminSprawl(routes.length, dashboards.length);

  const roadmap = useMemo(() => buildSimplificationRoadmap({
    mergeCandidates: equivalents.length,
    thinDashboards: suggestions.filter(s => s.recommendation === "widget").length,
    lowUsageDashboards: suggestions.filter(s => s.recommendation === "advanced").length,
    inflatedKPIs: suggestions.filter(s => s.recommendation === "tab").length,
  }), [equivalents, suggestions]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-start gap-2">
          <div>
            <CardTitle>SEO Operational Consolidation</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Executive consolidation, dashboard compression, navigation analysis. Read-only. SAFE MODE.
            </p>
          </div>
          <Button onClick={() => setRoadmapGenerated(true)} size="sm">
            Generate Simplification Roadmap
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
          <KPI label="Dashboards" value={dashboards.length} raw />
          <KPI label="Routes" value={routes.length} raw />
          <KPI label="Redundancy" value={redundancyScore} />
          <KPI label="Inflation" value={inflationScore} />
          <KPI label="Clarity" value={clarityScore} />
          <KPI label="Cognitive load" value={cognitiveLoad} />
        </CardContent>
      </Card>

      <Tabs defaultValue="executive" className="space-y-3">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="executive">Executive</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="redundancy">Redundancy</TabsTrigger>
          <TabsTrigger value="merge">Merge Planner</TabsTrigger>
          <TabsTrigger value="compression">Compression</TabsTrigger>
          <TabsTrigger value="entropy">Entropy</TabsTrigger>
          <TabsTrigger value="fatigue">Fatigue</TabsTrigger>
          <TabsTrigger value="readability">Readability</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="labs">Labs Visibility</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="executive">
          <Card>
            <CardHeader><CardTitle className="text-base">Executive overview</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <KPI label="Nav compression" value={navCompression} />
              <KPI label="Menu entropy" value={menuEntropy} />
              <KPI label="Sidebar cost" value={sidebarCost} />
              <KPI label="Lazy score" value={lazyScore} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <Card>
            <CardHeader><CardTitle className="text-base">Menu analysis</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Total nav items: <b>{navTotal}</b> · Visible by default: <b>{navVisible}</b></div>
              {EXECUTIVE_NAV.map((g) => (
                <div key={g.id} className="flex items-center justify-between border-b pb-1">
                  <div>{g.label}{g.hiddenByDefault && <span className="text-muted-foreground"> (hidden)</span>}</div>
                  <Badge variant="outline">{g.items.length} items</Badge>
                </div>
              ))}
              {navSprawl.length > 0 && (
                <div className="text-xs text-muted-foreground">Sprawling groups: {navSprawl.join(", ")}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redundancy">
          <Card>
            <CardHeader><CardTitle className="text-base">Redundancy map</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {equivalents.length === 0 && <div className="text-muted-foreground">No redundancy detected.</div>}
              {equivalents.map((e, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-1">
                  <div><b>{e.a}</b> ↔ <b>{e.b}</b></div>
                  <Badge>{e.overlap}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merge">
          <DashboardCompressionPlanner suggestions={suggestions} />
        </TabsContent>

        <TabsContent value="compression">
          <Card>
            <CardHeader><CardTitle className="text-base">Compression scores</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <KPI label="Dashboard redundancy" value={redundancyScore} />
              <KPI label="Dashboard inflation" value={inflationScore} />
              <KPI label="Telemetry density" value={telemetryDensity} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entropy">
          <Card>
            <CardHeader><CardTitle className="text-base">Navigation entropy</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <KPI label="Menu entropy" value={menuEntropy} />
              <KPI label="Compression" value={navCompression} />
              <div className="border rounded p-2">
                <div className="text-xs text-muted-foreground">Drift</div>
                <Badge variant={drift === "high" ? "destructive" : "outline"}>{drift}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fatigue">
          <Card>
            <CardHeader><CardTitle className="text-base">Operational fatigue</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <KPI label="Cognitive load" value={cognitiveLoad} />
              <KPI label="Pressure" value={pressureScore} />
              <KPI label="Clarity" value={clarityScore} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readability">
          <Card>
            <CardHeader><CardTitle className="text-base">Executive readability</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>Nav compression: <b>{navCompression}</b>/100</div>
              <div>Menu entropy: <b>{menuEntropy}</b>/100 (lower is better)</div>
              <div>Sidebar render cost: <b>{sidebarCost}</b>/100</div>
              <div>Labs hidden: <b>{EXECUTIVE_NAV.filter(g => g.hiddenByDefault).reduce((s, g) => s + g.items.length, 0)}</b> items</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap">
          <Card>
            <CardHeader><CardTitle className="text-base">Simplification roadmap</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {!roadmapGenerated && <div className="text-muted-foreground">Click "Generate Simplification Roadmap" above.</div>}
              {roadmapGenerated && roadmap.map((s) => (
                <div key={s.step} className="flex items-center justify-between border-b pb-1">
                  <div><b>#{s.step}</b> {s.action}</div>
                  <Badge variant={s.impact === "high" ? "destructive" : "outline"}>{s.impact}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card>
            <CardHeader><CardTitle className="text-base">Advanced / Labs visibility</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {EXECUTIVE_NAV.filter(g => g.hiddenByDefault).map((g) => (
                <div key={g.id}>
                  <div className="font-medium">{g.label} ({g.items.length} items)</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {g.items.map((i) => <Badge key={i.path} variant="outline">{i.label}</Badge>)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <AdminPerformanceOverview
            routes={routes}
            heavy={routeAnalysis.heavy}
            totalKb={routeAnalysis.totalKb}
            avgKb={routeAnalysis.avgKb}
            sidebarCost={sidebarCost}
            hydrationPressure={hydration}
            lazyScore={lazyScore}
          />
          {overRender.length > 0 && (
            <Card className="mt-3">
              <CardHeader><CardTitle className="text-base">Over-render risk</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-1 text-sm">
                {overRender.map((r) => <Badge key={r.path} variant="outline">{r.path}</Badge>)}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="governance">
          <OperationalGovernanceSummary
            pressures={pressures}
            cognitiveLoad={cognitiveLoad}
            pressureScore={pressureScore}
            clarityScore={clarityScore}
            drift={drift}
            sprawl={sprawl}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KPI({ label, value, raw }: { label: string; value: number; raw?: boolean }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}{!raw && <span className="text-xs text-muted-foreground">/100</span>}</div>
    </div>
  );
}
