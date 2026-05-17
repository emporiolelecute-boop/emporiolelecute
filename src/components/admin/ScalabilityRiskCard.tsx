import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ScalabilityRiskCard({ risk, scalability, latency }: {
  risk: number; scalability: number; latency: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Scalability Risk</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{risk}</div>
        <Progress value={risk} />
        <div className="flex justify-between"><span className="text-muted-foreground">Escalabilidade</span><b>{scalability}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Latência estimada</span><b>{latency}</b></div>
      </CardContent>
    </Card>
  );
}
