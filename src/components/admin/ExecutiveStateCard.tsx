import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExecutiveReport, ExecutiveVerdict } from "@/lib/executiveIntelligence";

const tone: Record<ExecutiveVerdict, string> = {
  TRANSCENDENT: "bg-emerald-600 text-white",
  ELITE: "bg-emerald-500 text-white",
  STRONG: "bg-green-500 text-white",
  STABLE: "bg-blue-500 text-white",
  FRAGILE: "bg-amber-500 text-white",
  COLLAPSING: "bg-red-600 text-white",
};

export default function ExecutiveStateCard({ report }: { report: ExecutiveReport }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Executive State</CardTitle>
        <Badge className={tone[report.verdict]}>{report.verdict}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{report.state}</div>
        <p className="text-xs text-muted-foreground mt-1">{report.summary}</p>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <Cell label="Harmonia" v={report.harmony} />
          <Cell label="Clareza" v={report.clarity} />
          <Cell label="Coerência" v={report.coherence} />
          <Cell label="Sustent." v={report.sustainability} />
          <Cell label="Resiliência" v={report.resilience} />
          <Cell label="Durabilidade" v={report.durability} />
        </div>
      </CardContent>
    </Card>
  );
}

function Cell({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
