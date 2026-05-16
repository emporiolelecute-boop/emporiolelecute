import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SimulationProjection } from "@/lib/seoDigitalTwin";

export default function SimulationScenarioCard({ projection }: { projection: SimulationProjection }) {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold capitalize">{projection.scenario}</h3>
        <Badge variant="outline">{projection.estimatedWeeks} semanas</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Metric label="Autoridade" value={projection.authority} />
        <Metric label="Cobertura" value={projection.semanticCoverage} />
        <Metric label="Resiliência" value={projection.resilience} />
        <Metric label="ROI" value={projection.roi} />
        <Metric label="Saturação" value={projection.saturation} />
        <Metric label="Risco de colapso" value={projection.collapseRisk} />
      </div>
      {projection.risks.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p className="font-medium">Riscos:</p>
          <ul className="list-disc list-inside">
            {projection.risks.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      )}
      <p className="text-xs text-muted-foreground italic">{projection.notes}</p>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between border-b border-border/40 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{Math.round(value)}</span>
    </div>
  );
}
