import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  resilience: number;
  forecast: number;
  cognitiveStability: number;
  fragmentation: number;
}
export default function StrategicResilienceMap(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Resilience Map</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-3xl font-bold">{p.resilience}</div>
        <p><span className="text-muted-foreground">Forecast Reliability:</span> {p.forecast}</p>
        <p><span className="text-muted-foreground">Cognitive Stability:</span> {p.cognitiveStability}</p>
        <p><span className="text-muted-foreground">Fragmentation:</span> {p.fragmentation}</p>
      </CardContent>
    </Card>
  );
}
