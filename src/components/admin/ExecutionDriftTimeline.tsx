import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DriftPoint { date: string; drift: number; focus: number; momentum: number; }

export default function ExecutionDriftTimeline({ points }: { points: DriftPoint[] }) {
  if (!points.length) return <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Sem dados de drift.</CardContent></Card>;
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Drift de Execução</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {points.slice(-10).map((p) => (
          <div key={p.date} className="grid grid-cols-4 gap-2 text-xs items-center">
            <div className="text-muted-foreground">{new Date(p.date).toLocaleDateString("pt-BR")}</div>
            <Bar v={p.drift} label="Drift" color="bg-red-500" />
            <Bar v={p.focus} label="Foco" color="bg-emerald-500" />
            <Bar v={p.momentum} label="Mom" color="bg-blue-500" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
function Bar({ v, label, color }: { v: number; label: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-muted-foreground"><span>{label}</span><span>{v}</span></div>
      <div className="h-1.5 rounded bg-muted overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${Math.min(100, v)}%` }} /></div>
    </div>
  );
}
