import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DecisionConfidenceCard({
  confidence, consistency, instability, latency,
}: { confidence: number; consistency: number; instability: number; latency: number }) {
  const tone = confidence >= 70 ? "text-emerald-600" : confidence >= 50 ? "text-amber-600" : "text-red-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Confiança Decisória</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-5xl font-bold ${tone}`}>{confidence}</div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Consistência</span><span>{consistency}</span></div>
          <Progress value={consistency} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Instabilidade</span><span>{instability}</span></div>
          <Progress value={instability} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Latência</span><span>{latency}</span></div>
          <Progress value={latency} />
        </div>
      </CardContent>
    </Card>
  );
}
