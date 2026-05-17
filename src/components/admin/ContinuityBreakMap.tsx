import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContinuityReport } from "@/lib/continuityEngine";

export default function ContinuityBreakMap({ report }: { report: ContinuityReport }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium">Continuity Map</p>
        <Badge variant="outline" className="capitalize">{report.status}</Badge>
      </div>
      <div className="text-5xl font-bold">{report.durability}</div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        <div><p className="text-muted-foreground">Execução</p><p className="font-bold">{report.execution}</p></div>
        <div><p className="text-muted-foreground">Semântica</p><p className="font-bold">{report.semantic}</p></div>
        <div><p className="text-muted-foreground">Autoridade</p><p className="font-bold">{report.authority}</p></div>
        <div><p className="text-muted-foreground">Estratégica</p><p className="font-bold">{report.strategic}</p></div>
        <div><p className="text-muted-foreground">Recuperação</p><p className="font-bold">{report.recovery}</p></div>
      </div>
      {report.breaks.length > 0 && (
        <>
          <p className="text-xs font-medium pt-2">Rupturas de Continuidade</p>
          <ul className="list-disc pl-5 text-xs text-muted-foreground">
            {report.breaks.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </>
      )}
      {report.disruptions.length > 0 && (
        <>
          <p className="text-xs font-medium pt-2">Disrupções Futuras</p>
          <ul className="list-disc pl-5 text-xs text-muted-foreground">
            {report.disruptions.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </>
      )}
    </Card>
  );
}
