import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ConflictHeatmapCell, ConflictVerdict } from "@/lib/operationalConflictEngine";

export default function OperationalConflictHeatmap({
  score, verdict, cells, contradictions, pressure,
}: {
  score: number; verdict: ConflictVerdict; cells: ConflictHeatmapCell[];
  contradictions: number; pressure: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Operational Conflicts <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Contradictions: <span className="font-medium">{contradictions}/100</span></div>
          <div>Pressure conflicts: <span className="font-medium">{pressure}/100</span></div>
        </div>
        <div className="space-y-1">
          {cells.map((c) => (
            <div key={`${c.source}-${c.target}`} className="flex items-center gap-2">
              <div className="w-48 text-xs text-muted-foreground">{c.source} ↔ {c.target}</div>
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${c.conflict}%`,
                    background: c.conflict > 50 ? "hsl(var(--destructive))" : "hsl(var(--primary))",
                  }}
                />
              </div>
              <div className="w-12 text-right text-xs">{c.conflict}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
