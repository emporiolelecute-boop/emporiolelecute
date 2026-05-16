import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResilienceReport, ResilienceClass } from "@/lib/resilienceEngine";

const tone: Record<ResilienceClass, string> = {
  resilient: "bg-emerald-600 text-white",
  stable: "bg-blue-500 text-white",
  fragile: "bg-amber-500 text-white",
  collapsing: "bg-red-600 text-white",
};

export default function ResilienceMatrix({ report }: { report: ResilienceReport }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Resiliência Sistêmica</CardTitle>
        <Badge className={tone[report.classification]}>{report.classification}</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Cell label="Sistema" v={report.systemResilience} />
          <Cell label="Cluster" v={report.clusterResilience} />
          <Cell label="Elasticidade" v={report.recoveryElasticity} />
          <Cell label="Cascade risk" v={report.cascadeFailureRisk} invert />
        </div>
        {report.fragileDependencies.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-1">Dependências frágeis</div>
            <ul className="text-sm space-y-1">
              {report.fragileDependencies.map((d, i) => <li key={i}>• {d}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function Cell({ label, v, invert }: { label: string; v: number; invert?: boolean }) {
  const good = invert ? v < 40 : v >= 60;
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold ${good ? "text-emerald-600" : ""}`}>{v}</div>
    </div>
  );
}
