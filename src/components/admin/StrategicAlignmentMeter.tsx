import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StrategicAlignmentMeter({ alignment, focus, drift }: { alignment: number; focus: number; drift: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Alinhamento Estratégico</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Row label="Alinhamento" v={alignment} />
        <Row label="Foco" v={focus} />
        <Row label="Drift" v={drift} invert />
      </CardContent>
    </Card>
  );
}
function Row({ label, v, invert }: { label: string; v: number; invert?: boolean }) {
  const good = invert ? v < 40 : v >= 60;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span>{label}</span><span className={good ? "text-emerald-600 font-medium" : "font-medium"}>{v}</span></div>
      <Progress value={Math.min(100, v)} />
    </div>
  );
}
