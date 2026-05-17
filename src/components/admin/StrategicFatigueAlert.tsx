import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function StrategicFatigueAlert({
  fatigue, breathingRoom, overextended, activeThreads,
}: { fatigue: number; breathingRoom: number; overextended: boolean; activeThreads: number }) {
  const level = fatigue >= 70 ? "Critical" : fatigue >= 45 ? "Elevated" : "Stable";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className={`h-4 w-4 ${fatigue >= 70 ? "text-destructive" : fatigue >= 45 ? "text-amber-500" : "text-emerald-500"}`} />
          Strategic Fatigue — {level}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Fatigue" v={fatigue} />
          <Stat label="Breathing room" v={breathingRoom} />
          <Stat label="Active threads" v={activeThreads} raw />
        </div>
        {overextended && (
          <p className="text-amber-600">Overextension detected — active threads exceed sustainable capacity.</p>
        )}
      </CardContent>
    </Card>
  );
}
function Stat({ label, v, raw }: { label: string; v: number; raw?: boolean }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}{!raw && <span className="text-xs text-muted-foreground">/100</span>}</div>
    </div>
  );
}
