import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface VelocityPoint {
  date: string;
  editorial: number;
  semantic: number;
  authority: number;
}

export default function VelocityTimeline({ points }: { points: VelocityPoint[] }) {
  if (!points.length) {
    return <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Sem snapshots para mostrar velocity.</CardContent></Card>;
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Velocity Timeline</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {points.slice(-10).map((p) => (
            <div key={p.date} className="grid grid-cols-4 gap-2 text-xs items-center">
              <div className="text-muted-foreground">{new Date(p.date).toLocaleDateString("pt-BR")}</div>
              <Bar value={p.editorial} label="Edit" color="bg-blue-500" />
              <Bar value={p.semantic} label="Sem" color="bg-purple-500" />
              <Bar value={p.authority} label="Auth" color="bg-emerald-500" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Bar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-muted-foreground"><span>{label}</span><span>{value}</span></div>
      <div className="h-1.5 rounded bg-muted overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}
