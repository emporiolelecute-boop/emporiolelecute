import { Card } from "@/components/ui/card";
import type { HorizonPoint } from "@/lib/futureForecastEngine";

export default function StrategicForecastTimeline({ title, series }: { title: string; series: HorizonPoint[] }) {
  const max = Math.max(1, ...series.map((p) => p.value));
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium">{title}</h4>
      <div className="space-y-2">
        {series.map((p) => (
          <div key={p.horizon} className="flex items-center gap-3 text-xs">
            <span className="w-12 text-muted-foreground">{p.horizon}</span>
            <div className="flex-1 h-2 bg-muted rounded">
              <div className="h-2 bg-primary rounded" style={{ width: `${(p.value / max) * 100}%` }} />
            </div>
            <span className="w-10 text-right font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
