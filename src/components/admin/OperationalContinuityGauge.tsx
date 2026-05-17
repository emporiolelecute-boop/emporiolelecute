import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { ContinuityForecastPoint } from "@/lib/operationalContinuity";

export default function OperationalContinuityGauge({
  score, verdict, recovery, persistence, decay, forecast,
}: {
  score: number; verdict: string; recovery: number; persistence: number; decay: number;
  forecast: ContinuityForecastPoint[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Operational Continuity <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div>
          <div className="flex justify-between mb-1"><span>Recovery</span><span>{recovery}</span></div>
          <Progress value={recovery} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Persistence</span><span>{persistence}</span></div>
          <Progress value={persistence} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Decay</span><span>{decay}</span></div>
          <Progress value={decay} />
        </div>
        <div>
          <div className="font-medium mb-1">Forecast</div>
          <ul className="grid grid-cols-4 gap-2 text-xs">
            {forecast.map((f) => (
              <li key={f.horizon} className="rounded border p-2 text-center">
                <div className="text-muted-foreground">{f.horizon}</div>
                <div className="font-semibold">{f.projected}</div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
