import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FabricObservability } from "@/lib/fabricObservability";

export default function FabricObservabilityMatrix({ obs }: { obs: FabricObservability }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Observabilidade do Tecido</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="flex justify-between"><span className="text-muted-foreground">Cobertura</span><span className="font-mono">{obs.coverage}</span></div>
          <Progress value={obs.coverage} className="h-2 mt-1" />
        </div>
        <div>
          <div className="flex justify-between"><span className="text-muted-foreground">Profundidade</span><span className="font-mono">{obs.depth}</span></div>
          <Progress value={obs.depth} className="h-2 mt-1" />
        </div>
        {obs.gaps.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-1">Gaps</p>
            <ul className="text-xs space-y-0.5">{obs.gaps.map((g, i) => <li key={i}>• {g}</li>)}</ul>
          </div>
        )}
        {obs.blindspots.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-1">Blindspots</p>
            <ul className="text-xs space-y-0.5">{obs.blindspots.map((g, i) => <li key={i}>• {g}</li>)}</ul>
          </div>
        )}
        {obs.hiddenDependencies.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-1">Dependências ocultas</p>
            <ul className="text-xs space-y-0.5">{obs.hiddenDependencies.map((g, i) => <li key={i}>• {g}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
