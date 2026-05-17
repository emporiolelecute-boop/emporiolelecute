import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CausalNode, CausalEdge } from "@/lib/causalAlignment";

export default function CausalAlignmentGraph({
  nodes, edges, score, verdict,
}: { nodes: CausalNode[]; edges: CausalEdge[]; score: number; verdict: string; }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Causal Alignment <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-2xl font-semibold">{score}<span className="text-sm text-muted-foreground">/100</span></div>
        <div>
          <div className="font-medium mb-1">Nodes</div>
          <div className="flex flex-wrap gap-1">
            {nodes.map((n) => <Badge key={n.id} variant="outline">{n.id}: {n.weight}</Badge>)}
          </div>
        </div>
        <div>
          <div className="font-medium mb-1">Edges</div>
          <ul className="space-y-1">
            {edges.map((e, i) => (
              <li key={i} className="flex justify-between text-xs">
                <span>{e.from} → {e.to}</span>
                <span className="text-muted-foreground">{e.strength}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
