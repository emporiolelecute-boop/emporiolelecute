import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { survivability: number; longevity: number; resistance: number; evolutionary: number; }
export default function EvolutionarySurvivabilityGauge({ survivability, longevity, resistance, evolutionary }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Evolutionary Survivability</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{survivability}</div>
        <p><span className="text-muted-foreground">Strategic Longevity:</span> {longevity}</p>
        <p><span className="text-muted-foreground">Collapse Resistance:</span> {resistance}</p>
        <p><span className="text-muted-foreground">Evolutionary Capacity:</span> {evolutionary}</p>
      </CardContent>
    </Card>
  );
}
