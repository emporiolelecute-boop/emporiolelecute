import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FabricVerdictResult } from "@/lib/stabilityFabric";

export default function StabilityFabricCard({ verdict }: { verdict: FabricVerdictResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Stability Fabric <Badge>{verdict.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{verdict.score}<span className="text-base text-muted-foreground">/100</span></div>
        <p className="text-muted-foreground">{verdict.integrity_summary}</p>
        <p className="text-muted-foreground">{verdict.persistence_summary}</p>
        {verdict.strengths.length > 0 && (
          <div>
            <div className="font-medium mb-1">Strengths</div>
            <div className="flex flex-wrap gap-1">
              {verdict.strengths.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
        )}
        {verdict.fracture_points.length > 0 && (
          <div>
            <div className="font-medium mb-1">Fracture points</div>
            <div className="flex flex-wrap gap-1">
              {verdict.fracture_points.map((b) => <Badge key={b} variant="destructive">{b}</Badge>)}
            </div>
          </div>
        )}
        <div>
          <div className="font-medium mb-1">Resilient clusters</div>
          <div className="flex flex-wrap gap-1">
            {verdict.resilient_clusters.map((d) => <Badge key={d} variant="outline">{d}</Badge>)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
