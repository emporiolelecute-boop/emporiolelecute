import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { unification: number; harmony: number; resilience: number; }
export default function StrategicUnificationGauge({ unification, harmony, resilience }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Unification</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{unification}</div>
        <p><span className="text-muted-foreground">Systemic Harmony:</span> {harmony}</p>
        <p><span className="text-muted-foreground">Unified Resilience:</span> {resilience}</p>
      </CardContent>
    </Card>
  );
}
