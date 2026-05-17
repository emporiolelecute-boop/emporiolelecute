import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface RiskAlert { id: string; risk: string; severity: "low" | "medium" | "high"; area: string }

export default function RiskAlertsMatrix({ risks }: { risks: RiskAlert[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Risk Alerts</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {risks.length === 0 && <div className="text-muted-foreground">No active risks.</div>}
        {risks.map((r) => (
          <div key={r.id} className="flex items-center justify-between border-b pb-1">
            <div className="truncate"><span className="text-muted-foreground">{r.area}:</span> {r.risk}</div>
            <Badge variant={r.severity === "high" ? "destructive" : "outline"}>{r.severity}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
