import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OperationalSimplicityGauge({ score, overload, fatigue }: {
  score: number; overload: number; fatigue: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Simplicity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{score}</div>
        <Progress value={score} />
        <div className="flex justify-between"><span className="text-muted-foreground">Sobrecarga</span><b>{overload}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Dashboard fatigue</span><b>{fatigue}</b></div>
      </CardContent>
    </Card>
  );
}
