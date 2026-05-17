import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TimelinePoint } from "@/lib/temporalCoherence";

export default function TemporalCoherenceTimeline({ points, verdict }: { points: TimelinePoint[]; verdict: string }) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Temporal Coherence — {verdict}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 h-32">
          {points.map((p) => (
            <div key={p.label} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-xs text-muted-foreground">{p.value}</div>
              <div className="w-full bg-primary/20 rounded-sm" style={{ height: `${(p.value / max) * 100}%` }} />
              <div className="text-xs">{p.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
