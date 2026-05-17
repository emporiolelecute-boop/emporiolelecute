import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Point {
  layer: string;
  drift: number;
  severity: "low" | "medium" | "high" | "critical";
}
interface Props { points: Point[]; velocity: number; acceleration: number; collapse: number }

const sevVariant = (s: Point["severity"]) =>
  s === "critical" ? "destructive" : s === "high" ? "destructive" : s === "medium" ? "secondary" : "outline";

export default function ReasoningDriftTimeline({ points, velocity, acceleration, collapse }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Reasoning Drift Timeline</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div><span className="text-muted-foreground">Velocity:</span> <strong>{velocity}</strong></div>
          <div><span className="text-muted-foreground">Acceleration:</span> <strong>{acceleration}</strong></div>
          <div><span className="text-muted-foreground">Collapse Risk:</span> <strong>{collapse}</strong></div>
        </div>
        <div className="space-y-2">
          {points.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-32 text-sm">{p.layer}</div>
              <div className="flex-1 bg-muted h-2 rounded">
                <div className="h-2 rounded bg-primary" style={{ width: `${p.drift}%` }} />
              </div>
              <div className="w-12 text-right text-sm">{p.drift}</div>
              <Badge variant={sevVariant(p.severity) as never}>{p.severity}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
