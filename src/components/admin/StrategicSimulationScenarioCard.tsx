import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StrategicScenario } from "@/lib/strategicScenarioBuilder";

export default function SimulationScenarioCard({ scenario }: { scenario: StrategicScenario }) {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{scenario.label}</h4>
        <Badge variant="secondary">ROI {scenario.estimatedROI}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>Ganhos: <span className="text-foreground font-medium">{scenario.projectedGains}</span></div>
        <div>Perdas: <span className="text-foreground font-medium">{scenario.projectedLosses}</span></div>
        <div>Esforço: <span className="text-foreground font-medium">{scenario.requiredEffort}</span></div>
        <div>Manutenção: <span className="text-foreground font-medium">{scenario.maintenancePressure}</span></div>
        <div>Risco Sem.: <span className="text-foreground font-medium">{scenario.semanticRisks}</span></div>
        <div>Autoridade: <span className="text-foreground font-medium">{scenario.authorityImpact}</span></div>
        <div>Debt: <span className="text-foreground font-medium">{scenario.operationalDebt}</span></div>
        <div>Sustent.: <span className="text-foreground font-medium">{scenario.sustainability}</span></div>
        <div>Resiliência: <span className="text-foreground font-medium">{scenario.resilience}</span></div>
        <div>Confiança: <span className="text-foreground font-medium">{scenario.confidence}</span></div>
      </div>
    </Card>
  );
}
