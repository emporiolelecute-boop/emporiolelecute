import { Card } from "@/components/ui/card";
import type { EntropyReport } from "@/lib/governanceEntropy";
import { Badge } from "@/components/ui/badge";

export default function GovernanceEntropyPanel({ report }: { report: EntropyReport }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium">Governance Entropy</p>
        <Badge variant="outline" className="capitalize">{report.status}</Badge>
      </div>
      <div className="text-5xl font-bold">{report.entropy}</div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div><p className="text-muted-foreground">Estratégica</p><p className="font-bold">{report.strategic}</p></div>
        <div><p className="text-muted-foreground">Operacional</p><p className="font-bold">{report.operational}</p></div>
        <div><p className="text-muted-foreground">Semântica</p><p className="font-bold">{report.semantic}</p></div>
      </div>
      {(report.acceleration.length > 0 || report.meta_instability.length > 0) && (
        <ul className="list-disc pl-5 text-xs text-muted-foreground">
          {report.acceleration.map((s) => <li key={s}>{s}</li>)}
          {report.meta_instability.map((s) => <li key={s}>{s}</li>)}
        </ul>
      )}
    </Card>
  );
}
