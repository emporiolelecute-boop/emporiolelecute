import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContinuityProjectionPoint, ContinuityVerdict } from "@/lib/continuityIntegrity";

export default function ContinuityIntegrityGauge({
  score, verdict, fractures, decay, recovery, projection,
}: {
  score: number; verdict: ContinuityVerdict;
  fractures: number; decay: number; recovery: number;
  projection: ContinuityProjectionPoint[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Continuity Integrity <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>Fractures: <span className="font-medium">{fractures}/100</span></div>
          <div>Decay: <span className="font-medium">{decay}/100</span></div>
          <div>Recovery: <span className="font-medium">{recovery}/100</span></div>
        </div>
        <div className="flex items-end gap-1 h-24">
          {projection.map((p) => (
            <div key={p.step} className="flex-1 bg-primary/70 rounded-t" style={{ height: `${p.expected}%` }} title={`t+${p.step}: ${p.expected}`} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
