import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HiddenRisk } from "@/lib/hiddenRiskEngine";

interface Props { risks: HiddenRisk[]; cascade: number }
export default function HiddenRiskPanel({ risks, cascade }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Hidden Risks · cascade {cascade}</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {risks.length === 0 && <p className="text-muted-foreground">Nenhum risco oculto detectado.</p>}
        {risks.map((r, i) => (
          <div key={i} className="border rounded p-2">
            <div className="flex items-center justify-between">
              <strong>{r.type}</strong>
              <Badge variant="outline">{r.severity}</Badge>
            </div>
            <p className="text-muted-foreground">{r.description}</p>
            <p className="text-xs">prop {r.propagation} · collapse {r.collapse} · affected: {r.affected.join(", ")}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
