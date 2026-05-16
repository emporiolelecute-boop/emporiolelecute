import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExistentialThreat } from "@/lib/existentialRiskEngine";

export default function ExistentialRiskCard({ risk, threats }: { risk: number; threats: ExistentialThreat[] }) {
  const tone = risk >= 70 ? "text-red-600" : risk >= 40 ? "text-amber-600" : "text-emerald-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Risco Existencial</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-5xl font-bold ${tone}`}>{risk}</div>
        <div className="space-y-1">
          {threats.length === 0 && <p className="text-xs text-muted-foreground">Sem ameaças críticas.</p>}
          {threats.map((th) => (
            <div key={th.key} className="flex justify-between text-xs">
              <span>{th.note}</span>
              <Badge variant={th.severity === "high" ? "destructive" : "secondary"}>{th.severity}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
