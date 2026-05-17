import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TelemetryCompressionGauge({ efficiency, obesity, prunable }: {
  efficiency: number; obesity: number; prunable: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Telemetry Efficiency</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{efficiency}</div>
        <Progress value={efficiency} />
        <div className="flex justify-between"><span className="text-muted-foreground">Obesidade</span><b>{obesity}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Métricas podáveis</span><b>{prunable}</b></div>
      </CardContent>
    </Card>
  );
}
