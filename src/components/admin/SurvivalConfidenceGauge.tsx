import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SurvivalConfidenceGauge({ confidence, scenario, longevity }: { confidence: number; scenario: string; longevity: number }) {
  const tone = confidence >= 70 ? "text-emerald-600" : confidence >= 45 ? "text-amber-600" : "text-red-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Survival Confidence</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-5xl font-bold ${tone}`}>{confidence}</div>
        <p className="text-xs text-muted-foreground">Cenário: <b className="capitalize">{scenario}</b></p>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Longevidade Estratégica</span><span>{longevity}</span></div>
          <Progress value={longevity} />
        </div>
      </CardContent>
    </Card>
  );
}
