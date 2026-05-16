import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OperationalReport, OperationalVerdict } from "@/lib/seoOperatingSystem";

const tone: Record<OperationalVerdict, string> = {
  Elite: "bg-emerald-500 text-white",
  Strong: "bg-green-500 text-white",
  Stable: "bg-blue-500 text-white",
  Fragile: "bg-amber-500 text-white",
  Critical: "bg-red-600 text-white",
};

export default function OperationalScoreCard({ report }: { report: OperationalReport }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">SEO Operating Score</CardTitle>
        <Badge className={tone[report.verdict]}>{report.verdict}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{report.score}</div>
        <p className="text-xs text-muted-foreground mt-1">Score consolidado operacional (0–100)</p>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <Metric label="Execução" value={report.executionCapacity} />
          <Metric label="Editorial" value={report.editorialVelocity} />
          <Metric label="Semântica" value={report.semanticVelocity} />
          <Metric label="Autoridade" value={report.authorityVelocity} />
          <Metric label="Recuperação" value={report.recoveryCapacity} />
          <Metric label="Risco" value={report.riskPressure} invert />
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const good = invert ? value < 40 : value >= 60;
  return (
    <div className="flex items-center justify-between rounded-md border px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={good ? "text-emerald-600 font-medium" : "text-foreground font-medium"}>{value}</span>
    </div>
  );
}
