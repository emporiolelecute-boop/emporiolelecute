import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategicClarityGauge({ clarity, intent, direction }: { clarity: number; intent: number; direction: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Clarity</CardTitle></CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{clarity}</div>
        <p className="text-xs text-muted-foreground">Clareza estratégica (0–100)</p>
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Consistência de intenção</span><b>{intent}</b></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Direção semântica</span><b>{direction}</b></div>
        </div>
      </CardContent>
    </Card>
  );
}
