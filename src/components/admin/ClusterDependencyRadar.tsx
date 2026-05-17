import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ClusterDependencyReport } from "@/lib/clusterDependencyEngine";

export default function ClusterDependencyRadar({ report }: { report: ClusterDependencyReport }) {
  const rows: [string, number][] = [
    ["Dependência", report.dependency],
    ["Sobre-dependência", report.overdependence],
    ["Concentração de Autoridade", report.authorityConcentration],
    ["Fragilidade", report.fragility],
    ["Single Point Failures", report.singlePointFailures],
    ["Cascade Impact", report.cascadeImpact],
    ["Complex. de Recuperação", report.recoveryComplexity],
  ];
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Cluster Dependency Radar</CardTitle>
        <Badge variant={report.classification === "distributed" ? "default" : report.classification === "critical" ? "destructive" : "secondary"}>
          {report.classification}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map(([l, v]) => (
          <div key={l}>
            <div className="flex justify-between text-xs mb-1"><span>{l}</span><span>{v}</span></div>
            <Progress value={v} />
          </div>
        ))}
        {report.warnings.length > 0 && (
          <ul className="list-disc pl-5 text-xs text-muted-foreground pt-2">
            {report.warnings.map((w) => <li key={w}>{w}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
