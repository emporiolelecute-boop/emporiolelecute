import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ControlTowerReport, ControlTowerVerdict } from "@/lib/seoControlTower";

const tone: Record<ControlTowerVerdict, string> = {
  Autonomous: "bg-emerald-600 text-white",
  Optimized: "bg-emerald-500 text-white",
  Stable: "bg-blue-500 text-white",
  Stressed: "bg-amber-500 text-white",
  Degrading: "bg-orange-600 text-white",
  Critical: "bg-red-600 text-white",
};

export default function SystemHealthCard({ report }: { report: ControlTowerReport }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">System Health</CardTitle>
        <Badge className={tone[report.verdict]}>{report.verdict}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{report.score}</div>
        <p className="text-xs text-muted-foreground mt-1">Saúde sistêmica consolidada (0–100)</p>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <Cell label="Exec" v={report.executionEfficiency} />
          <Cell label="Sem" v={report.semanticEfficiency} />
          <Cell label="Auth" v={report.authorityEfficiency} />
          <Cell label="Align" v={report.strategicAlignment} />
          <Cell label="Foco" v={report.focusScore} />
          <Cell label="Ruído" v={report.executionNoise} invert />
        </div>
      </CardContent>
    </Card>
  );
}
function Cell({ label, v, invert }: { label: string; v: number; invert?: boolean }) {
  const good = invert ? v < 40 : v >= 60;
  return (
    <div className="flex items-center justify-between rounded-md border px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={good ? "text-emerald-600 font-medium" : "font-medium"}>{v}</span>
    </div>
  );
}
