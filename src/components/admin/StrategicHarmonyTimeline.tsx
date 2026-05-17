import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface HarmonyPoint { label: string; value: number }

export default function StrategicHarmonyTimeline({
  points, harmony,
}: { points: HarmonyPoint[]; harmony: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Strategic Harmony</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{harmony}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="flex items-end gap-1 h-24">
          {points.map((p) => (
            <div key={p.label} className="flex-1 bg-primary/60 rounded-t" style={{ height: `${p.value}%` }} title={`${p.label}: ${p.value}`} />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-1 text-[10px] text-muted-foreground">
          {points.map((p) => <div key={p.label} className="text-center truncate">{p.label}</div>)}
        </div>
      </CardContent>
    </Card>
  );
}
