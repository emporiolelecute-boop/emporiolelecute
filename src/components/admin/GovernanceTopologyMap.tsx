import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GovernanceTopologyMap({ topology }: { topology: Record<string, string[]> }) {
  const layers = Object.entries(topology);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Governance Topology</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {layers.length === 0 ? (
          <p className="text-muted-foreground">Sem mapeamento.</p>
        ) : layers.map(([layer, items]) => (
          <div key={layer}>
            <p className="font-medium capitalize">{layer} <span className="text-xs text-muted-foreground">({items.length})</span></p>
            <p className="text-xs text-muted-foreground truncate">{items.slice(0, 4).join(", ")}{items.length > 4 ? "…" : ""}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
