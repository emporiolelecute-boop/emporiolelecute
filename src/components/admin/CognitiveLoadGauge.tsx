import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CognitiveLoadGauge({ load, fatigue, recovery }: { load: number; fatigue: number; recovery: number }) {
  const tone = load >= 70 ? "text-red-600" : load >= 50 ? "text-amber-600" : "text-emerald-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Carga Cognitiva</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-5xl font-bold ${tone}`}>{load}</div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Fadiga Cognitiva</span><span>{fatigue}</span></div>
          <Progress value={fatigue} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Capacidade de Recuperação</span><span>{recovery}</span></div>
          <Progress value={recovery} />
        </div>
      </CardContent>
    </Card>
  );
}
