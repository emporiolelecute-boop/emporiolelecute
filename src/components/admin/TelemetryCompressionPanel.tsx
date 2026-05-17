import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TelemetryCompressionPanel({ density, efficiency, redundant }: {
  density: number; efficiency: number; redundant: string[];
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Telemetry Compression</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Densidade</span><b>{density}</b></div>
        <Progress value={density} />
        <div className="flex justify-between"><span className="text-muted-foreground">Eficiência de sinal</span><b>{efficiency}</b></div>
        <Progress value={efficiency} />
        {redundant.length > 0 && (
          <div>
            <p className="font-medium text-xs mt-2">Redundantes</p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">
              {redundant.slice(0, 5).map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
