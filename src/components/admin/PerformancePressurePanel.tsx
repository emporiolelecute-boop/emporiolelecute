import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PerformancePressurePanel({ pressure, scalabilityRisk, hotspots }: {
  pressure: Record<string, number>; scalabilityRisk: number; hotspots: string[];
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Performance Pressure</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Risco de escala</span>
          <b>{scalabilityRisk}</b>
        </div>
        <Progress value={scalabilityRisk} />
        <div className="space-y-1">
          {Object.entries(pressure).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-muted-foreground capitalize">{k}</span><b>{v}</b>
            </div>
          ))}
        </div>
        {hotspots.length > 0 && (
          <div>
            <p className="font-medium text-xs mb-1">Hotspots</p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">
              {hotspots.slice(0, 4).map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
