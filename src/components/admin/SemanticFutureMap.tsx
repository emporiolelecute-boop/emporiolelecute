import { Card } from "@/components/ui/card";

export interface SemanticFutureMapProps {
  coverage: number;
  connectivity: number;
  clusterGrowth: number;
  longevity: number;
}

export default function SemanticFutureMap(p: SemanticFutureMapProps) {
  const cells = [
    { label: "Cobertura", value: p.coverage },
    { label: "Conectividade", value: p.connectivity },
    { label: "Crescimento", value: p.clusterGrowth },
    { label: "Longevidade", value: p.longevity },
  ];
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium">Mapa Semântico Futuro</h4>
      <div className="grid grid-cols-2 gap-3">
        {cells.map((c) => (
          <div key={c.label} className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">{c.label}</div>
            <div className="text-2xl font-semibold">{c.value}</div>
            <div className="h-1.5 bg-muted rounded mt-2">
              <div className="h-1.5 bg-primary rounded" style={{ width: `${c.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
