import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface FutureRiskPanelProps {
  decayPressure: number;
  executionPressure: number;
  fragmentation: number;
  clusterDependency: number;
  collapseScore: number;
}

export default function FutureRiskPanel(p: FutureRiskPanelProps) {
  const items = [
    { label: "Decay projetado", value: p.decayPressure },
    { label: "Pressão de execução", value: p.executionPressure },
    { label: "Fragmentação", value: p.fragmentation },
    { label: "Dependência de cluster", value: p.clusterDependency },
    { label: "Risco de colapso", value: p.collapseScore },
  ];
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium">Mapa de Riscos Futuros</h4>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.label} className="flex items-center justify-between">
            <span className="text-sm">{i.label}</span>
            <Badge variant={i.value >= 65 ? "destructive" : i.value >= 40 ? "secondary" : "outline"}>{i.value}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
