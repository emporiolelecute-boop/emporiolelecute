import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PerformancePressureGauge({
  renderCost,
  telemetryCost,
  queryPressure,
  bundleRisk,
  hydrationComplexity,
}: {
  renderCost: number;
  telemetryCost: number;
  queryPressure: number;
  bundleRisk: number;
  hydrationComplexity: number;
}) {
  const overall = Math.round(
    (renderCost + telemetryCost + queryPressure + bundleRisk + hydrationComplexity) / 5,
  );
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Performance Pressure</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{overall}</div>
        <Progress value={overall} />
        <Row label="Render cost" value={renderCost} />
        <Row label="Telemetry cost" value={telemetryCost} />
        <Row label="React Query pressure" value={queryPressure} />
        <Row label="Bundle risk" value={bundleRisk} />
        <Row label="Hydration complexity" value={hydrationComplexity} />
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <b>{value}</b>
    </div>
  );
}
