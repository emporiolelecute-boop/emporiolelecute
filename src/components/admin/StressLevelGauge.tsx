import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StressResult, StressLevel } from "@/lib/stressTesting";

const COLORS: Record<StressLevel, string> = {
  stable: "bg-green-500",
  pressured: "bg-yellow-500",
  fragile: "bg-orange-500",
  unstable: "bg-red-500",
  critical: "bg-red-700",
};

export default function StressLevelGauge({ result }: { result: StressResult }) {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{result.scenario}</h4>
        <Badge className={`${COLORS[result.level]} text-white capitalize`}>{result.level}</Badge>
      </div>
      <div className="h-2 bg-muted rounded overflow-hidden">
        <div className={`h-full ${COLORS[result.level]}`} style={{ width: `${result.impactScore}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <span>Impacto: {result.impactScore}</span>
        <span>Resiliência −{result.resilienceLoss}</span>
        <span>Recuperação: {result.recoveryWeeks}w</span>
      </div>
      <ul className="text-xs list-disc list-inside text-muted-foreground">
        {result.notes.map((n) => <li key={n}>{n}</li>)}
      </ul>
    </Card>
  );
}
