import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrustReport } from "@/lib/systemicTrust";

export default function SystemicTrustPanel({ report }: { report: TrustReport }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium">Systemic Trust</p>
        <Badge variant="outline" className="capitalize">{report.status}</Badge>
      </div>
      <div className="text-5xl font-bold">{report.trust}</div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div><p className="text-muted-foreground">Sinal</p><p className="font-bold">{report.signalReliability}</p></div>
        <div><p className="text-muted-foreground">Estratégico</p><p className="font-bold">{report.strategicReliability}</p></div>
        <div><p className="text-muted-foreground">Operacional</p><p className="font-bold">{report.operationalReliability}</p></div>
      </div>
      {(report.erosion.length > 0 || report.hallucinations.length > 0 || report.noise.length > 0) && (
        <ul className="list-disc pl-5 text-xs text-muted-foreground">
          {report.erosion.map((s) => <li key={s}>{s}</li>)}
          {report.noise.map((s) => <li key={s}>{s}</li>)}
          {report.hallucinations.map((s) => <li key={s}>{s}</li>)}
        </ul>
      )}
    </Card>
  );
}
