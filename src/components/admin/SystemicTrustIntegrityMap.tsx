import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrustIntegrityMap, TrustVerdict } from "@/lib/systemicTrustIntegrity";

export default function SystemicTrustIntegrityMap({
  score, verdict, map, disruptions, continuity, collapse,
}: {
  score: number; verdict: TrustVerdict; map: TrustIntegrityMap;
  disruptions: string[]; continuity: number; collapse: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Systemic Trust Integrity <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Continuity: <span className="font-medium">{continuity}/100</span></div>
          <div>Collapse risk: <span className="font-medium">{collapse}/100</span></div>
          <div>Strongest: <span className="font-medium">{map.strongest}</span></div>
          <div>Weakest: <span className="font-medium">{map.weakest}</span></div>
        </div>
        <div className="space-y-1">
          {map.nodes.map((n) => (
            <div key={n.layer} className="flex items-center gap-2">
              <div className="w-40 text-xs text-muted-foreground">{n.layer}</div>
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${n.trust}%` }} />
              </div>
              <div className="w-12 text-right text-xs">{n.trust}</div>
            </div>
          ))}
        </div>
        {disruptions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {disruptions.map((d) => <Badge key={d} variant="destructive">{d}</Badge>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
