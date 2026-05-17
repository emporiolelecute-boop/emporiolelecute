import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ExecutiveClarityGauge({ clarity, cognitiveLoad }: {
  clarity: number; cognitiveLoad: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Clarity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{clarity}</div>
        <Progress value={clarity} />
        <div className="flex justify-between"><span className="text-muted-foreground">Carga cognitiva</span><b>{cognitiveLoad}</b></div>
      </CardContent>
    </Card>
  );
}
