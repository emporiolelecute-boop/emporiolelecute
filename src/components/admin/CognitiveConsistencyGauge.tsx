import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CognitiveVerdict, ConsistencyMap } from "@/lib/cognitiveConsistency";

export default function CognitiveConsistencyGauge({
  score, verdict, map, drift, decisions,
}: {
  score: number; verdict: CognitiveVerdict; map: ConsistencyMap;
  drift: number; decisions: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Cognitive Consistency <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Drift: <span className="font-medium">{drift}/100</span></div>
          <div>Decision consistency: <span className="font-medium">{decisions}/100</span></div>
          <div>Drift score: <span className="font-medium">{map.drift_score}/100</span></div>
          <div>Confusion: <span className="font-medium">{map.confusion_score}/100</span></div>
        </div>
        <div className="space-y-1">
          {map.axes.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <div className="w-40 text-xs text-muted-foreground">{a.name}</div>
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${a.value}%` }} />
              </div>
              <div className="w-12 text-right text-xs">{a.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
