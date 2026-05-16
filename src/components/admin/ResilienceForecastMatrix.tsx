import { Card } from "@/components/ui/card";
import type { ForecastPoint } from "@/lib/futureForecast";

export default function ResilienceForecastMatrix({ points }: { points: ForecastPoint[] }) {
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium text-sm">Matriz de Resiliência Futura</h4>
      <div className="grid grid-cols-4 gap-2">
        {points.map((p) => {
          const score = Math.round(p.projectedResilience);
          const tone = score > 70 ? "bg-green-500/20 border-green-500" : score > 45 ? "bg-yellow-500/20 border-yellow-500" : "bg-red-500/20 border-red-500";
          return (
            <div key={p.horizonDays} className={`border rounded p-2 text-center ${tone}`}>
              <p className="text-xs text-muted-foreground">{p.horizonDays}d</p>
              <p className="text-xl font-bold">{score}</p>
              <p className="text-[10px] text-muted-foreground">conf {Math.round(p.confidence)}%</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
