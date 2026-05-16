import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GravityCenter } from "@/lib/singularityEngine";

export default function SemanticGravityPanel({ centers }: { centers: GravityCenter[] }) {
  return (
    <Card className="p-4">
      <h4 className="font-medium mb-3">Centros de Gravidade Semântica</h4>
      <div className="space-y-2">
        {centers.length === 0 && <p className="text-xs text-muted-foreground">Sem dados.</p>}
        {centers.map((c) => (
          <div key={c.key} className="flex items-center justify-between text-sm">
            <span className="truncate">{c.key}</span>
            <Badge variant={c.critical ? "destructive" : "secondary"}>{c.concentration}%</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
