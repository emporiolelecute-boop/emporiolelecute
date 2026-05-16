import { Card } from "@/components/ui/card";

export default function EvolutionVelocityTimeline({ series }: { series: number[] }) {
  const max = Math.max(1, ...series.map((v) => Math.abs(v)));
  return (
    <Card className="p-4">
      <h4 className="font-medium text-sm mb-3">Velocidade de Evolução</h4>
      <div className="flex items-end gap-1 h-24">
        {series.length === 0 && <p className="text-xs text-muted-foreground">Sem série.</p>}
        {series.map((v, i) => (
          <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${(Math.abs(v) / max) * 100}%` }} />
        ))}
      </div>
    </Card>
  );
}
