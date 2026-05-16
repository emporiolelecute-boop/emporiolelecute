import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecoveryCapacityGauge({ capacity, complexity }: { capacity: number; complexity: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Capacidade de Recuperação</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Gauge value={capacity} label="Capacidade" tone="positive" />
          <Gauge value={complexity} label="Complexidade" tone="negative" />
        </div>
      </CardContent>
    </Card>
  );
}

function Gauge({ value, label, tone }: { value: number; label: string; tone: "positive" | "negative" }) {
  const color = tone === "positive" ? (value >= 60 ? "text-emerald-600" : "text-amber-600") : (value >= 60 ? "text-red-600" : "text-emerald-600");
  return (
    <div className="text-center flex-1">
      <div className={`text-4xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
