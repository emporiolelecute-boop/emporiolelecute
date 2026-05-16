import { Card } from "@/components/ui/card";

export interface ProjectionMatrixRow {
  label: string;
  current: number;
  projected: number;
}

export default function ProjectionMatrix({ title, rows }: { title: string; rows: ProjectionMatrixRow[] }) {
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium">{title}</h4>
      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground">
        <div>Métrica</div>
        <div className="text-right">Atual</div>
        <div className="text-right">Projetado</div>
      </div>
      {rows.map((r) => {
        const delta = r.projected - r.current;
        const tone = delta > 0 ? "text-emerald-600" : delta < 0 ? "text-destructive" : "text-muted-foreground";
        return (
          <div key={r.label} className="grid grid-cols-3 gap-2 text-sm">
            <div>{r.label}</div>
            <div className="text-right">{r.current}</div>
            <div className={`text-right font-medium ${tone}`}>{r.projected} ({delta >= 0 ? "+" : ""}{delta})</div>
          </div>
        );
      })}
    </Card>
  );
}
