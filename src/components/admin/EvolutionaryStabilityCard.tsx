import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { stability: number; adaptive: number; mutationRisk: number; capacity: number; regression: boolean }
export default function EvolutionaryStabilityCard(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Evolutionary Stability</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-3xl font-bold">{p.stability}</div>
        <p><span className="text-muted-foreground">Adaptive Consistency:</span> {p.adaptive}</p>
        <p><span className="text-muted-foreground">Mutation Risk:</span> {p.mutationRisk}</p>
        <p><span className="text-muted-foreground">Long-Term Capacity:</span> {p.capacity}</p>
        <p><span className="text-muted-foreground">Regression Detected:</span> {p.regression ? "yes" : "no"}</p>
      </CardContent>
    </Card>
  );
}
