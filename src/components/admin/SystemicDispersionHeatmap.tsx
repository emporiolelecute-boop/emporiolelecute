import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DispersionHeatCell } from "@/lib/systemicDispersion";

export default function SystemicDispersionHeatmap({
  score, verdict, cells,
}: { score: number; verdict: string; cells: DispersionHeatCell[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Systemic Dispersion <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-2xl font-semibold">{score}<span className="text-sm text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {cells.map((c) => (
            <div key={c.dimension} className="rounded border p-2 text-xs">
              <div className="font-medium capitalize">{c.dimension}</div>
              <div className="text-muted-foreground">{c.value}</div>
              <div className="h-1.5 mt-1 bg-muted rounded">
                <div className="h-full bg-amber-500 rounded" style={{ width: `${c.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
