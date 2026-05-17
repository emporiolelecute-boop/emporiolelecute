import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ConfidenceIntegrityGauge({
  integrity, avgConfidence, lowConfidenceCount,
}: { integrity: number; avgConfidence: number; lowConfidenceCount: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Confidence Integrity</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-4xl font-bold">{integrity}</div>
        <Progress value={integrity} />
        <div className="flex justify-between"><span className="text-muted-foreground">Confiança média</span><b>{avgConfidence}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Métricas com baixa confiança</span><b>{lowConfidenceCount}</b></div>
      </CardContent>
    </Card>
  );
}
