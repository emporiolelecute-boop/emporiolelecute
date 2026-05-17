import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CognitiveResilienceGauge({
  resilience, decay, survival, exhaustion,
}: { resilience: number; decay: number; survival: number; exhaustion: number }) {
  const tone = resilience >= 70 ? "text-emerald-600" : resilience >= 50 ? "text-amber-600" : "text-red-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Resiliência Cognitiva</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-5xl font-bold ${tone}`}>{resilience}</div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Sobrevivência Estratégica</span><span>{survival}</span></div>
          <Progress value={survival} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Risco de Decay</span><span>{decay}</span></div>
          <Progress value={decay} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Exaustão de Raciocínio</span><span>{exhaustion}</span></div>
          <Progress value={exhaustion} />
        </div>
      </CardContent>
    </Card>
  );
}
