import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrustHeatCell } from "@/lib/semanticTrustMatrix";

export default function TrustLeakMap({ heatmap, leakScore }: { heatmap: TrustHeatCell[]; leakScore: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trust Leak Map — leak {leakScore}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {heatmap.map((c) => {
            const leak = 100 - c.trust;
            return (
              <div key={c.domain} className="rounded border p-2">
                <div className="flex justify-between"><span className="capitalize">{c.domain}</span><span className="text-muted-foreground">leak {leak}</span></div>
                <div className="h-1.5 mt-1 bg-muted rounded">
                  <div className="h-full bg-destructive rounded" style={{ width: `${leak}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
