import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CoherenceVerdictResult } from "@/lib/strategicCoherenceMatrix";

export default function CoherenceMatrixCard({ verdict }: { verdict: CoherenceVerdictResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Strategic Coherence Matrix <Badge>{verdict.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{verdict.score}<span className="text-base text-muted-foreground">/100</span></div>
        <p className="text-muted-foreground">{verdict.coherence_summary}</p>
        <p className="text-muted-foreground">{verdict.alignment_summary}</p>
        {verdict.strengths.length > 0 && (
          <div>
            <div className="font-medium mb-1">Strengths</div>
            <div className="flex flex-wrap gap-1">
              {verdict.strengths.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
        )}
        {verdict.divergence_points.length > 0 && (
          <div>
            <div className="font-medium mb-1">Divergence points</div>
            <div className="flex flex-wrap gap-1">
              {verdict.divergence_points.map((s) => <Badge key={s} variant="destructive">{s}</Badge>)}
            </div>
          </div>
        )}
        <div>
          <div className="font-medium mb-1">Aligned clusters</div>
          <div className="flex flex-wrap gap-1">
            {verdict.aligned_clusters.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
          </div>
        </div>
        {verdict.unstable_domains.length > 0 && (
          <div>
            <div className="font-medium mb-1">Unstable domains</div>
            <div className="flex flex-wrap gap-1">
              {verdict.unstable_domains.map((s) => <Badge key={s} variant="destructive">{s}</Badge>)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
