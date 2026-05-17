import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OpAlignmentVerdict, OperationalAlignmentCell } from "@/lib/operationalAlignment";

export default function OperationalAlignmentHeatmap({
  score, verdict, cells, dispersion, dissonance,
}: {
  score: number; verdict: OpAlignmentVerdict; cells: OperationalAlignmentCell[];
  dispersion: number; dissonance: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Operational Alignment <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Dispersion: <span className="font-medium">{dispersion}/100</span></div>
          <div>Dissonance: <span className="font-medium">{dissonance}/100</span></div>
        </div>
        <div className="space-y-1">
          {cells.map((c) => (
            <div key={`${c.source}-${c.target}`} className="flex items-center gap-2">
              <div className="w-48 text-xs text-muted-foreground">{c.source} ↔ {c.target}</div>
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${c.dissonance}%`,
                    background: c.dissonance > 50 ? "hsl(var(--destructive))" : "hsl(var(--primary))",
                  }}
                />
              </div>
              <div className="w-12 text-right text-xs">{c.dissonance}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
