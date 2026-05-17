import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DailySummaryMetrics {
  health: number; focus: number; momentum: number; alerts: number; actions: number;
}

export default function ExecutiveDailySummary({ m }: { m: DailySummaryMetrics }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Daily Summary</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
        <Stat label="Health" v={m.health} />
        <Stat label="Focus" v={m.focus} />
        <Stat label="Momentum" v={m.momentum} />
        <Stat label="Alerts" v={m.alerts} raw />
        <Stat label="Actions" v={m.actions} raw />
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
