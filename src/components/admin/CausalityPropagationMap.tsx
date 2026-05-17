import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CausalEdge } from "@/lib/systemicCausality";

export default function CausalityPropagationMap({
  edges,
  origin,
}: { edges: CausalEdge[]; origin?: string }) {
  if (!edges.length) {
    return <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Sem causalidade mapeada.</CardContent></Card>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mapa de Causalidade {origin ? `· ${origin}` : ""}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-xs font-mono">
          {edges.slice(0, 30).map((e, i) => (
            <li key={i} className="flex justify-between">
              <span>{e.from} → {e.to}</span>
              <span className="text-muted-foreground">{e.strength ?? "-"}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
