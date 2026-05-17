import { Card } from "@/components/ui/card";

interface Props { cohesion: number; balance: number; connectivity: number; drift: number; }

export default function SemanticCohesionRadar({ cohesion, balance, connectivity, drift }: Props) {
  const rows = [
    { label: "Coesão", value: cohesion },
    { label: "Balance", value: balance },
    { label: "Conectividade", value: connectivity },
    { label: "Drift (inverso)", value: 100 - drift },
  ];
  return (
    <Card className="p-4 space-y-3">
      <p className="text-base font-medium">Semantic Cohesion</p>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs"><span>{r.label}</span><b>{r.value}</b></div>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${r.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
