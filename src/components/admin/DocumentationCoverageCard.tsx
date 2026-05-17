import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DocumentationCoverageCard({
  health,
  total,
  documented,
  partial,
  undocumented,
  coveragePct,
}: {
  health: number;
  total: number;
  documented: number;
  partial: number;
  undocumented: number;
  coveragePct: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Documentation Coverage</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{health}</div>
        <Progress value={health} />
        <div className="grid grid-cols-2 gap-x-3 text-xs">
          <span className="text-muted-foreground">Systems</span><b className="text-right">{total}</b>
          <span className="text-muted-foreground">Coverage</span><b className="text-right">{coveragePct}%</b>
          <span className="text-muted-foreground">Documented</span><b className="text-right">{documented}</b>
          <span className="text-muted-foreground">Partial</span><b className="text-right">{partial}</b>
          <span className="text-muted-foreground">Undocumented</span><b className="text-right">{undocumented}</b>
        </div>
      </CardContent>
    </Card>
  );
}
