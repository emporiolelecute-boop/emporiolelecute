import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InvestmentSimulation } from "@/lib/strategicSimulator";

export default function StrategicInvestmentSimulator({ simulations }: { simulations: InvestmentSimulation[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {simulations.map((s) => (
        <Card key={s.name} className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{s.name}</h4>
            <Badge variant="outline">{s.timelineWeeks}w</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Stat label="Impacto" value={s.expectedImpact} />
            <Stat label="Esforço" value={s.estimatedEffort} />
            <Stat label="Sustentab." value={s.sustainabilityDelta} signed />
            <Stat label="Risco" value={s.riskDelta} signed inverted />
          </div>
          <ul className="text-xs list-disc list-inside text-muted-foreground">
            {s.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
          <p className="text-xs text-muted-foreground">Confiança: {s.confidence}%</p>
        </Card>
      ))}
    </div>
  );
}

function Stat({ label, value, signed, inverted }: { label: string; value: number; signed?: boolean; inverted?: boolean }) {
  const positive = inverted ? value < 0 : value >= 0;
  const color = signed ? (positive ? "text-green-600" : "text-red-600") : "text-foreground";
  const prefix = signed && value > 0 ? "+" : "";
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${color}`}>{prefix}{Math.round(value)}</span>
    </div>
  );
}
