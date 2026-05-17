import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OverlapPair } from "@/lib/coreMetricsCanon";

export default function MetricOverlapMatrix({ overlaps }: { overlaps: OverlapPair[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Metric Overlap Matrix</CardTitle></CardHeader>
      <CardContent className="text-sm">
        {!overlaps.length && <p className="text-muted-foreground">No significant overlaps detected.</p>}
        <ul className="space-y-1 max-h-[420px] overflow-y-auto">
          {overlaps.map((p, i) => (
            <li key={i} className="border rounded p-2">
              <div className="flex justify-between">
                <span className="font-medium">{p.a} ↔ {p.b}</span>
                <span>{p.overlap}%</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {p.shared.map((d) => <Badge key={d} variant="outline">{d}</Badge>)}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
