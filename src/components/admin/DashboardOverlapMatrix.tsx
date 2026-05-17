import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RedundancyHit } from "@/lib/systemAudit";

export default function DashboardOverlapMatrix({
  hits,
}: {
  hits: RedundancyHit[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dashboard Overlap Matrix</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {hits.length === 0 && (
          <div className="text-muted-foreground">No significant overlap detected.</div>
        )}
        {hits.slice(0, 20).map((h, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-1">
            <div className="truncate">
              <span className="font-medium">{h.a}</span>
              <span className="text-muted-foreground"> ↔ </span>
              <span className="font-medium">{h.b}</span>
            </div>
            <Badge variant={h.overlap >= 70 ? "destructive" : "secondary"}>
              {h.overlap}%
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
