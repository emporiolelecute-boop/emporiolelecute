import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function LongTermViabilityCard({
  viability, sustainability, compounding, longevity,
}: { viability: number; sustainability: number; compounding: number; longevity: number }) {
  const tone = viability >= 70 ? "text-emerald-600" : viability >= 45 ? "text-amber-600" : "text-red-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Long-Term Viability</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-5xl font-bold ${tone}`}>{viability}</div>
        {[
          ["Sustentabilidade", sustainability],
          ["Compounding", compounding],
          ["Longevidade Estratégica", longevity],
        ].map(([l, v]) => (
          <div key={l as string}>
            <div className="flex justify-between text-xs mb-1"><span>{l}</span><span>{v}</span></div>
            <Progress value={v as number} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
