import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CoreMetricsCanon } from "@/lib/coreMetricsCanon";

export default function CoreMetricsCanonCard({ canon }: { canon: CoreMetricsCanon }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Metrics Canon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-baseline gap-3">
          <div className="text-3xl font-semibold">{canon.canon_score}<span className="text-base text-muted-foreground">/100</span></div>
          <p className="text-muted-foreground">Canon health — share of CORE vs REDUNDANT metrics.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(canon.byClass).map(([k, v]) => (
            <div key={k} className="border rounded p-2">
              <div className="text-xs text-muted-foreground">{k}</div>
              <div className="text-lg font-semibold">{v}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Semantic domain coverage</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(canon.byDomain).map(([d, c]) => (
              <Badge key={d} variant="secondary">{d}: {c}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
