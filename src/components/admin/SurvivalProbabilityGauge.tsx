import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SurvivalProbabilityGauge({
  survival, recovery, identity,
}: { survival: number; recovery: number; identity: number }) {
  const tone = survival >= 70 ? "text-emerald-600" : survival >= 40 ? "text-amber-600" : "text-red-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Probabilidade de Sobrevivência</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-5xl font-bold ${tone}`}>{survival}</div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Prob. Recuperação</span><span>{recovery}</span></div>
          <Progress value={recovery} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Identidade Semântica</span><span>{identity}</span></div>
          <Progress value={identity} />
        </div>
      </CardContent>
    </Card>
  );
}
