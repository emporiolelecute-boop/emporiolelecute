import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SystemAuditReport } from "@/lib/systemAudit";

export default function ExecutiveAuditSummary({
  report,
}: {
  report: SystemAuditReport;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Executive Audit Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-muted-foreground">Dashboards</div>
            <div className="text-2xl font-bold">{report.totalDashboards}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Routes</div>
            <div className="text-2xl font-bold">{report.totalRoutes}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Complexity</div>
            <div className="text-2xl font-bold">{report.complexityScore}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Usability</div>
            <div className="text-2xl font-bold">
              {report.executiveUsabilityScore}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Debt</div>
            <div className="text-2xl font-bold">{report.architecturalDebt}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Fragmentation</div>
            <div className="text-2xl font-bold">{report.fragmentationScore}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {report.competingNomenclature.slice(0, 8).map((c) => (
            <Badge key={c.keyword} variant="outline">
              {c.keyword} ×{c.ids.length}
            </Badge>
          ))}
        </div>
        <div className="text-xs text-muted-foreground pt-2">
          Generated {new Date(report.generatedAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
