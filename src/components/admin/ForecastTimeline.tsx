import { Card } from "@/components/ui/card";
import type { ForecastPoint } from "@/lib/futureForecast";

export default function ForecastTimeline({ points, metricKey, label }: {
  points: ForecastPoint[];
  metricKey: keyof ForecastPoint;
  label: string;
}) {
  const values = points.map((p) => Number(p[metricKey]) || 0);
  const max = Math.max(100, ...values);
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium text-sm">{label}</h4>
      <div className="flex items-end gap-3 h-32">
        {points.map((p, i) => {
          const v = Number(p[metricKey]) || 0;
          const h = (v / max) * 100;
          return (
            <div key={p.horizonDays} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{Math.round(v)}</span>
              <div className="w-full bg-primary/80 rounded-t" style={{ height: `${h}%`, minHeight: 4 }} />
              <span className="text-[10px] text-muted-foreground">{p.horizonDays}d</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
