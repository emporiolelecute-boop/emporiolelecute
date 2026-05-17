import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SustainableCadence } from "@/lib/strategicPacing";

export default function StrategicPacingGauge({ cadence }: { cadence: SustainableCadence }) {
  return (
    <Card>
      <CardHeader><CardTitle>Strategic Pacing</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="text-3xl font-semibold">{cadence.pace}<span className="text-base text-muted-foreground">/100 pace</span></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Stat label="Fatigue" v={cadence.fatigue} />
          <Stat label="Breathing room" v={cadence.breathing_room} />
          <Stat label="Focus threads" v={cadence.recommended_focus_threads} raw />
          <Stat label="Recovery blocks" v={cadence.recommended_recovery_blocks} raw />
        </div>
        <p className="text-muted-foreground">Cadence label: <strong>{cadence.cadence_label}</strong></p>
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
