import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SustainabilityGauge({ score }: { score: number }) {
  const tone = score >= 75 ? "text-emerald-600" : score >= 50 ? "text-blue-600" : score >= 30 ? "text-amber-600" : "text-red-600";
  const label = score >= 75 ? "Sustentável" : score >= 50 ? "Aceitável" : score >= 30 ? "Frágil" : "Insustentável";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Sustentabilidade SEO</CardTitle></CardHeader>
      <CardContent>
        <div className={`text-5xl font-bold ${tone}`}>{score}</div>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
        <Progress value={Math.min(100, score)} className="mt-3" />
      </CardContent>
    </Card>
  );
}
