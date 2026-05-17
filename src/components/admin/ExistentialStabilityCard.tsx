import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { stability: number; longevity: number; collapseResistance: number; fragilities: string[]; }
export default function ExistentialStabilityCard({ stability, longevity, collapseResistance, fragilities }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Existential Stability</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{stability}</div>
        <p><span className="text-muted-foreground">Strategic Longevity:</span> {longevity}</p>
        <p><span className="text-muted-foreground">Collapse Resistance:</span> {collapseResistance}</p>
        {fragilities.length > 0 && (
          <ul className="mt-2 space-y-0.5">{fragilities.map((f, i) => <li key={i}>• {f}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
