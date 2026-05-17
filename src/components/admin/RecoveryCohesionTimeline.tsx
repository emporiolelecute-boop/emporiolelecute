import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContinuityProjectionPoint } from "@/lib/resilienceContinuity";

export default function RecoveryCohesionTimeline({
  points, cohesion,
}: { points: ContinuityProjectionPoint[]; cohesion: number }) {
  const max = Math.max(...points.map((p) => p.projected), 1);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery Cohesion — {cohesion}/100</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 h-32">
          {points.map((p) => (
            <div key={p.horizon} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-xs text-muted-foreground">{p.projected}</div>
              <div className="w-full bg-primary/20 rounded-sm" style={{ height: `${(p.projected / max) * 100}%` }} />
              <div className="text-xs">{p.horizon}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
