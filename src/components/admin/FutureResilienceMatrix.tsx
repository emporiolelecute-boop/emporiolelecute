import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResilienceForecast, ResilienceScenario } from "@/lib/futureResilience";

const tone: Record<ResilienceScenario, string> = {
  dominant: "bg-emerald-600 text-white",
  resilient: "bg-emerald-500 text-white",
  vulnerable: "bg-amber-500 text-white",
  fragile: "bg-orange-600 text-white",
  collapsing: "bg-red-600 text-white",
};

export default function FutureResilienceMatrix({ forecast }: { forecast: ResilienceForecast }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Future Resilience</CardTitle>
        <Badge className={tone[forecast.scenario]}>{forecast.scenario}</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Row label="Recuperação" v={forecast.recovery} />
          <Row label="Resist. Colapso" v={forecast.collapseResistance} />
          <Row label="Longev. Semântica" v={forecast.semanticLongevity} />
          <Row label="Durabilidade Op." v={forecast.operationalDurability} />
          <Row label="Elasticidade" v={forecast.strategicElasticity} />
          <Row label="Persist. Autoridade" v={forecast.authorityPersistence} />
          <Row label="Sobrev. Clusters" v={forecast.clusterSurvival} />
        </div>
      </CardContent>
    </Card>
  );
}
function Row({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
