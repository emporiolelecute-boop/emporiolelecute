import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExecutiveHealthCard from "@/components/admin/ExecutiveHealthCard";
import PriorityActionsPanel from "@/components/admin/PriorityActionsPanel";
import OperationalAlertsFeed from "@/components/admin/OperationalAlertsFeed";
import QuickWinsBoard from "@/components/admin/QuickWinsBoard";
import GrowthMomentumCard from "@/components/admin/GrowthMomentumCard";
import AuthorityStatusPanel from "@/components/admin/AuthorityStatusPanel";
import ContentExecutionQueue from "@/components/admin/ContentExecutionQueue";
import ExecutiveFocusGauge from "@/components/admin/ExecutiveFocusGauge";
import RiskAlertsMatrix, { type RiskAlert } from "@/components/admin/RiskAlertsMatrix";
import ExecutiveDailySummary from "@/components/admin/ExecutiveDailySummary";
import {
  calculateExecutiveFocusScore,
  calculateExecutiveHealthScore,
  calculateGrowthMomentum,
  rankPriorityActions,
  synthesizeAlerts,
  buildDailyExecutionQueue,
  type PriorityAction,
  type OperationalAlert,
  type QuickWin,
  type ContentExecutionItem,
} from "@/lib/executiveMode";

export default function AdminExecutiveMode() {
  const actions: PriorityAction[] = useMemo(() => rankPriorityActions([
    { id: "1", title: "Address content gaps on top 5 categories", impact: "high", effort: "medium", category: "Content" },
    { id: "2", title: "Refresh thin product descriptions", impact: "high", effort: "low", category: "Products" },
    { id: "3", title: "Resolve broken internal links", impact: "medium", effort: "low", category: "Technical" },
    { id: "4", title: "Republish high-momentum blog posts", impact: "medium", effort: "medium", category: "Blog" },
    { id: "5", title: "Review redirect chain on /loja", impact: "low", effort: "low", category: "Technical" },
  ]), []);

  const alerts: OperationalAlert[] = useMemo(() => synthesizeAlerts([
    { id: "a1", severity: "warn", message: "5 orphan pages detected", area: "Content" },
    { id: "a2", severity: "critical", message: "2 critical SEO regressions", area: "Technical" },
    { id: "a3", severity: "info", message: "Sitemap regenerated", area: "Sitemap" },
  ]), []);

  const wins: QuickWin[] = useMemo(() => [
    { id: "q1", title: "Add FAQ to top 10 products", estimatedImpact: 18 },
    { id: "q2", title: "Improve meta descriptions on 12 pages", estimatedImpact: 12 },
    { id: "q3", title: "Add alt text to 30 images", estimatedImpact: 9 },
  ], []);

  const queue: ContentExecutionItem[] = useMemo(() => buildDailyExecutionQueue([
    { id: "c1", title: "Publish 'Lembrancinhas para Chá de Bebê'", type: "blog", status: "ready" },
    { id: "c2", title: "Review category 'Casamento'", type: "taxonomy", status: "review" },
    { id: "c3", title: "Draft new product collection page", type: "page", status: "draft" },
  ]), []);

  const risks: RiskAlert[] = useMemo(() => [
    { id: "r1", risk: "Authority concentration on 3 hubs", severity: "medium", area: "Authority" },
    { id: "r2", risk: "Crawl budget pressure", severity: "low", area: "Technical" },
  ], []);

  const health = calculateExecutiveHealthScore({ authority: 72, content: 68, technical: 82, velocity: 60 });
  const focus = calculateExecutiveFocusScore(alerts, actions);
  const momentum = calculateGrowthMomentum({ weeklyGrowth: 12, monthlyGrowth: 28, velocity: 55 });

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Executive Mode</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Compact daily operations view. Progressive disclosure. Read-only.
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ExecutiveHealthCard score={health} />
        <ExecutiveFocusGauge score={focus} />
        <GrowthMomentumCard score={momentum} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <PriorityActionsPanel actions={actions} />
        <OperationalAlertsFeed alerts={alerts} />
        <QuickWinsBoard wins={wins} />
        <ContentExecutionQueue items={queue} />
        <AuthorityStatusPanel score={72} />
        <RiskAlertsMatrix risks={risks} />
      </div>

      <ExecutiveDailySummary m={{ health, focus, momentum, alerts: alerts.length, actions: actions.length }} />
    </div>
  );
}
