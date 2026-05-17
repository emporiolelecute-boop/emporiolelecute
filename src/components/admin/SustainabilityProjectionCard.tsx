import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  projection: number;
  longevity: number;
  scalability: number;
  decay: number;
}
export default function SustainabilityProjectionCard(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Sustainability Projection</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-3xl font-bold">{p.projection}</div>
        <p><span className="text-muted-foreground">Longevity:</span> {p.longevity}</p>
        <p><span className="text-muted-foreground">Scalability:</span> {p.scalability}</p>
        <p><span className="text-muted-foreground">Decay:</span> {p.decay}</p>
      </CardContent>
    </Card>
  );
}
