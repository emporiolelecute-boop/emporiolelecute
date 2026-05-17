import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RouteChunk } from "@/lib/adminPerformanceCompression";

export default function AdminPerformanceOverview({
  routes,
  heavy,
  totalKb,
  avgKb,
  sidebarCost,
  hydrationPressure,
  lazyScore,
}: {
  routes: RouteChunk[];
  heavy: RouteChunk[];
  totalKb: number;
  avgKb: number;
  sidebarCost: number;
  hydrationPressure: number;
  lazyScore: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Admin Performance Overview</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <Stat label="Routes" v={routes.length} raw />
          <Stat label="Total KB" v={totalKb} raw />
          <Stat label="Avg KB" v={avgKb} raw />
          <Stat label="Sidebar cost" v={sidebarCost} />
          <Stat label="Hydration" v={hydrationPressure} />
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Lazy grouping score: <b>{lazyScore}</b>/100</div>
          <div className="text-xs text-muted-foreground mb-1">Heavy routes ({heavy.length}):</div>
          <div className="flex flex-wrap gap-1">
            {heavy.slice(0, 12).map((r) => (
              <Badge key={r.path} variant="outline">{r.path} · {r.estimatedKb}KB</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
function Stat({ label, v, raw }: { label: string; v: number; raw?: boolean }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}{!raw && <span className="text-xs text-muted-foreground">/100</span>}</div>
    </div>
  );
}
