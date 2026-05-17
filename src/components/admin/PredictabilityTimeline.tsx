import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PredictabilityClass } from "@/lib/predictiveGovernance";

interface Props {
  predictability: number;
  variance: number;
  drift: number;
  health: number;
  klass: PredictabilityClass;
  vectors: string[];
}
export default function PredictabilityTimeline(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Predictability</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold">{p.predictability}</span>
          <Badge variant="outline">{p.klass}</Badge>
        </div>
        <p><span className="text-muted-foreground">Variance:</span> {p.variance}</p>
        <p><span className="text-muted-foreground">Governance Drift:</span> {p.drift}</p>
        <p><span className="text-muted-foreground">Long-Term Health:</span> {p.health}</p>
        {p.vectors.length > 0 && (
          <ul className="pt-2 border-t mt-2">
            {p.vectors.map((v, i) => <li key={i}>• {v}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
