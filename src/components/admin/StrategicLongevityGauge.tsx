import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { longevity: number; persistence: number; resistance: number; }
export default function StrategicLongevityGauge({ longevity, persistence, resistance }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Longevity</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{longevity}</div>
        <p><span className="text-muted-foreground">Persistence Capacity:</span> {persistence}</p>
        <p><span className="text-muted-foreground">Entropy Resistance:</span> {resistance}</p>
      </CardContent>
    </Card>
  );
}
