import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReasoningFabric } from "@/lib/reasoningFabric";

export default function ReasoningFabricMap({ fabric }: { fabric: ReasoningFabric }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Mapa do Tecido de Raciocínio</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-muted-foreground">Profundidade:</span> <strong>{fabric.depth_score}</strong></div>
          <div><span className="text-muted-foreground">Complexidade:</span> <strong>{fabric.complexity_score}</strong></div>
          <div><span className="text-muted-foreground">Loops:</span> <strong>{fabric.loops.length}</strong></div>
          <div><span className="text-muted-foreground">Opacos:</span> <strong>{fabric.opaque_count}</strong></div>
        </div>
        {fabric.paths.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sem caminhos detectados.</p>
        ) : (
          <ul className="space-y-1 text-xs">
            {fabric.paths.slice(0, 8).map((p, i) => (
              <li key={i} className="font-mono">
                {p.nodes.join(" → ")} <span className="text-muted-foreground">(w={p.averageWeight})</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
