import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IntegrityVerdictResult } from "@/lib/strategicIntegrityGrid";

export default function IntegrityGridCard({ verdict }: { verdict: IntegrityVerdictResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Strategic Integrity Grid <Badge>{verdict.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{verdict.score}<span className="text-base text-muted-foreground">/100</span></div>
        <p className="text-muted-foreground">{verdict.integrity_summary}</p>
        <p className="text-muted-foreground">{verdict.coherence_summary}</p>
        {verdict.strengths.length > 0 && (
          <div>
            <div className="font-medium mb-1">Strengths</div>
            <div className="flex flex-wrap gap-1">
              {verdict.strengths.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
        )}
        {verdict.instability_points.length > 0 && (
          <div>
            <div className="font-medium mb-1">Instability points</div>
            <div className="flex flex-wrap gap-1">
              {verdict.instability_points.map((s) => <Badge key={s} variant="destructive">{s}</Badge>)}
            </div>
          </div>
        )}
        <div>
          <div className="font-medium mb-1">Resilient domains</div>
          <div className="flex flex-wrap gap-1">
            {verdict.resilient_domains.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
          </div>
        </div>
        {verdict.fragmented_layers.length > 0 && (
          <div>
            <div className="font-medium mb-1">Fragmented layers</div>
            <div className="flex flex-wrap gap-1">
              {verdict.fragmented_layers.map((s) => <Badge key={s} variant="destructive">{s}</Badge>)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
