import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { SimulationProjection } from "@/lib/seoDigitalTwin";

export default function GrowthProjectionPanel({ projection }: { projection: SimulationProjection }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h4 className="font-medium text-sm">Projeção de Crescimento</h4>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Stat label="Velocidade" value={Math.round(projection.growthVelocity)} />
        <Stat label="ROI" value={Math.round(projection.roi)} />
        <Stat label="Autoridade" value={Math.round(projection.authority)} />
        <Stat label="Cobertura" value={Math.round(projection.semanticCoverage)} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Sustentabilidade</p>
        <div className="h-2 bg-muted rounded overflow-hidden mt-1">
          <div className="h-full bg-primary" style={{ width: `${projection.sustainability}%` }} />
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
