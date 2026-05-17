import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SemanticIntegrityMap, SemanticVerdict } from "@/lib/semanticIntegrity";

export default function SemanticIntegrityMatrix({
  score, verdict, map,
}: { score: number; verdict: SemanticVerdict; map: SemanticIntegrityMap }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Semantic Integrity <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Conflict score: <span className="font-medium">{map.conflict_score}/100</span></div>
          <div>Corruption score: <span className="font-medium">{map.corruption_score}/100</span></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {map.cells.map((c) => (
            <div key={c.axis} className="rounded border p-2">
              <div className="text-xs text-muted-foreground">{c.axis}</div>
              <div className="text-lg font-semibold">{c.value}</div>
              <div className="text-xs text-muted-foreground">risk {c.risk}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
