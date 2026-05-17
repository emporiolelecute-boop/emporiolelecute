import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SignalEfficiencyPanel({ efficiency, density, noise }: {
  efficiency: number; density: number; noise: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Signal Efficiency</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{efficiency}</div>
        <Progress value={efficiency} />
        <div className="flex justify-between"><span className="text-muted-foreground">Densidade</span><b>{density}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Ruído</span><b>{noise}</b></div>
      </CardContent>
    </Card>
  );
}
