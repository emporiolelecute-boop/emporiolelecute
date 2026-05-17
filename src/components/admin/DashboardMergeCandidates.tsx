import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MergeCandidate } from "@/lib/dashboardConsolidation";

export default function DashboardMergeCandidates({
  candidates,
}: {
  candidates: MergeCandidate[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Merge Candidates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {candidates.length === 0 && (
          <div className="text-muted-foreground">No merges suggested.</div>
        )}
        {candidates.slice(0, 25).map((c, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-1">
            <div className="truncate">
              <b>{c.primary}</b>
              <span className="text-muted-foreground"> ← </span>
              {c.secondary}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{c.recommendation}</Badge>
              <Badge>{c.overlap}%</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
