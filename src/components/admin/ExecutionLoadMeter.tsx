import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ExecutionLoadMeter({ load, capacity }: { load: number; capacity: number }) {
  const ratio = Math.min(100, Math.round((load / Math.max(1, capacity)) * 100));
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Carga vs Capacidade</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Carga atual</span><span>{load}</span></div>
          <Progress value={Math.min(100, load)} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Capacidade</span><span>{capacity}</span></div>
          <Progress value={Math.min(100, capacity)} />
        </div>
        <div className="text-sm text-muted-foreground">
          Utilização: <span className={ratio > 90 ? "text-red-600 font-medium" : "text-foreground font-medium"}>{ratio}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
