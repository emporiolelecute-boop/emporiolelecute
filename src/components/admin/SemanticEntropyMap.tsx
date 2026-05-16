import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EntropyMapEntry } from "@/lib/semanticEntropyEngine";

export default function SemanticEntropyMap({ entries }: { entries: EntropyMapEntry[] }) {
  return (
    <Card className="p-4">
      <h4 className="font-medium mb-3">Mapa de Entropia Semântica</h4>
      <div className="space-y-2">
        {entries.length === 0 && <p className="text-xs text-muted-foreground">Sem dados.</p>}
        {entries.map((e) => (
          <div key={e.key} className="flex items-center justify-between text-sm">
            <span className="truncate">{e.key}</span>
            <Badge variant={e.risk === "high" ? "destructive" : e.risk === "medium" ? "secondary" : "outline"}>
              {e.entropy} · {e.risk}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
