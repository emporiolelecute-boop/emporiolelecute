import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RhythmPoint } from "@/lib/operationalRhythm";

export default function OperationalRhythmTimeline({
  points, harmony, instability, chaos,
}: {
  points: RhythmPoint[];
  harmony: number; instability: number; chaos: number;
}) {
  return (
    <Card>
      <CardHeader><CardTitle>Operational Rhythm</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Harmony" v={harmony} />
          <Stat label="Instability" v={instability} />
          <Stat label="Chaos" v={chaos} />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {points.map((p) => (
            <div key={p.label} className="border rounded p-2">
              <div className="text-xs text-muted-foreground">{p.label}</div>
              <div className="text-xs">load {p.load}</div>
              <div className="h-1.5 bg-muted rounded mt-1 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${p.load}%` }} />
              </div>
              <div className="text-xs mt-2">recovery {p.recovery}</div>
              <div className="h-1.5 bg-muted rounded mt-1 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${p.recovery}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}<span className="text-xs text-muted-foreground">/100</span></div>
    </div>
  );
}
