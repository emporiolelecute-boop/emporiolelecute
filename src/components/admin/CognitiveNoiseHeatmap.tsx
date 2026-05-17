import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CognitiveNoiseHeatmap({
  noise, fragmentation, conflicts, load,
}: { noise: number; fragmentation: number; conflicts: number; load: number }) {
  const cell = (label: string, value: number) => {
    const bg = value >= 60 ? "bg-red-500/15" : value >= 40 ? "bg-amber-500/15" : "bg-emerald-500/10";
    return (
      <div key={label} className={`rounded p-3 ${bg}`}>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    );
  };
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Mapa de Calor de Ruído Cognitivo</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {cell("Ruído", noise)}
          {cell("Fragmentação", fragmentation)}
          {cell("Conflitos", conflicts)}
          {cell("Carga Cognitiva", load)}
        </div>
      </CardContent>
    </Card>
  );
}
