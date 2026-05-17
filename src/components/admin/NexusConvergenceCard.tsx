import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NexusVerdictResult } from "@/lib/nexusConvergence";

export default function NexusConvergenceCard({ verdict }: { verdict: NexusVerdictResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Nexus Convergence
          <Badge>{verdict.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{verdict.score}<span className="text-base text-muted-foreground">/100</span></div>
        <p className="text-muted-foreground">{verdict.convergence_summary}</p>
        {verdict.strengths.length > 0 && (
          <div>
            <div className="font-medium mb-1">Strengths</div>
            <div className="flex flex-wrap gap-1">
              {verdict.strengths.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
        )}
        {verdict.blockers.length > 0 && (
          <div>
            <div className="font-medium mb-1">Blockers</div>
            <div className="flex flex-wrap gap-1">
              {verdict.blockers.map((b) => <Badge key={b} variant="destructive">{b}</Badge>)}
            </div>
          </div>
        )}
        <div>
          <div className="font-medium mb-1">Dominant engines</div>
          <div className="flex flex-wrap gap-1">
            {verdict.dominant_engines.map((d) => <Badge key={d} variant="outline">{d}</Badge>)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
