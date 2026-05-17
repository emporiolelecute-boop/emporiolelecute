import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OperationalDragHeatmap({ drag, contributors }: {
  drag: number; contributors: Record<string, number>;
}) {
  const tone = (v: number) => v > 70 ? "bg-destructive/20" : v > 45 ? "bg-amber-500/20" : "bg-muted";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Drag</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-3xl font-bold">{drag}</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(contributors).map(([k, v]) => (
            <div key={k} className={`rounded px-2 py-1.5 ${tone(v)} flex justify-between`}>
              <span className="capitalize text-xs">{k}</span><b className="text-xs">{v}</b>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
