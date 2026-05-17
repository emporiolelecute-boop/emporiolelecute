import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FatigueReport } from "@/lib/operationalFatigue";

export default function OperationalFatiguePanel({ report }: { report: FatigueReport }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Fadiga Operacional</CardTitle>
        <Badge variant={report.classification === "healthy" ? "default" : report.classification === "pressured" ? "secondary" : "destructive"}>
          {report.classification}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-3">{report.composite}</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          {[
            ["Estratégica", report.strategic],
            ["Execução", report.execution],
            ["Semântica", report.semantic],
            ["Autoridade", report.authority],
            ["Cognitiva", report.cognitive],
          ].map(([l, v]) => (
            <div key={l as string} className="rounded-md border p-2">
              <div className="text-xs text-muted-foreground">{l}</div>
              <div className="text-xl font-semibold">{v}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Overload: {report.overload} · Maint. Stress: {report.maintenanceStress}</p>
      </CardContent>
    </Card>
  );
}
