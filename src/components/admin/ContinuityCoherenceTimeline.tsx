import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContinuityCoherencePoint, ContinuityCoherenceVerdict } from "@/lib/continuityCoherence";

export default function ContinuityCoherenceTimeline({
  score, verdict, points, dissonance, inconsistency,
}: {
  score: number; verdict: ContinuityCoherenceVerdict;
  points: ContinuityCoherencePoint[]; dissonance: number; inconsistency: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Continuity Coherence <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Dissonance: <span className="font-medium">{dissonance}/100</span></div>
          <div>Temporal inconsistency: <span className="font-medium">{inconsistency}/100</span></div>
        </div>
        <div className="flex items-end gap-1 h-24">
          {points.map((p) => (
            <div key={p.step} className="flex-1 bg-primary/70 rounded-t" style={{ height: `${p.expected}%` }} title={`t+${p.step}: ${p.expected}`} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
