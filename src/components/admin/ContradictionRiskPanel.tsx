import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Item { layer_a: string; layer_b: string; divergence: number; severity: string; description: string }
interface Props { contradictions: Item[]; depth: number; impact: number }

export default function ContradictionRiskPanel({ contradictions, depth, impact }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Contradiction Risk</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-4 text-sm">
          <div><span className="text-muted-foreground">Depth:</span> <strong>{depth}</strong></div>
          <div><span className="text-muted-foreground">Impact:</span> <strong>{impact}</strong></div>
          <div><span className="text-muted-foreground">Count:</span> <strong>{contradictions.length}</strong></div>
        </div>
        {contradictions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma contradição relevante.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {contradictions.slice(0, 8).map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                <Badge variant="outline">{c.severity}</Badge>
                <span>{c.description}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
