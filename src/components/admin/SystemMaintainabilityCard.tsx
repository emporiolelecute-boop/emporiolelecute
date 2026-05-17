import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SystemMaintainabilityCard({ score, deadLayers, unusedSignals }: {
  score: number; deadLayers: number; unusedSignals: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">System Maintainability</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{score}</div>
        <Progress value={score} />
        <div className="flex justify-between"><span className="text-muted-foreground">Camadas inativas</span><b>{deadLayers}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Sinais não usados</span><b>{unusedSignals}</b></div>
      </CardContent>
    </Card>
  );
}
