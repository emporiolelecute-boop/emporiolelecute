import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StrategicPulseGauge({ pulse, fatigue, alignment }: { pulse: number; fatigue: number; alignment: number }) {
  const tone = pulse >= 70 ? "text-emerald-600" : pulse >= 50 ? "text-amber-600" : "text-red-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Pulse</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-5xl font-bold ${tone}`}>{pulse}</div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Alinhamento</span><span>{alignment}</span></div>
          <Progress value={alignment} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Fadiga</span><span>{fatigue}</span></div>
          <Progress value={fatigue} />
        </div>
      </CardContent>
    </Card>
  );
}
