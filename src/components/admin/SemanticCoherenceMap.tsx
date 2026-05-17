import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SemanticCoherenceMap, SemanticCoherenceVerdict } from "@/lib/semanticCoherenceEngine";

export default function SemanticCoherenceMap({
  score, verdict, map,
}: { score: number; verdict: SemanticCoherenceVerdict; map: SemanticCoherenceMap }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Semantic Coherence <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Flow: <span className="font-medium">{map.flow_score}/100</span></div>
          <div>Divergence: <span className="font-medium">{map.divergence_score}/100</span></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {map.nodes.map((n) => (
            <div key={n.axis} className="rounded border p-2">
              <div className="text-xs text-muted-foreground">{n.axis}</div>
              <div className="text-lg font-semibold">{n.value}</div>
              <div className="text-xs text-muted-foreground">risk {n.risk}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
