import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface Gap { area: string; severity: "low" | "medium" | "high"; description: string }
interface Props { maturity: number; gaps: Gap[] }

export function OperationalGovernanceMatrix({ maturity, gaps }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Governance Maturity
        </CardTitle>
        <span className="text-2xl font-bold tabular-nums">{maturity}</span>
      </CardHeader>
      <CardContent className="space-y-2">
        {gaps.length === 0 && (
          <p className="text-xs text-muted-foreground">No governance gaps detected.</p>
        )}
        {gaps.map((g, i) => (
          <div key={i} className="flex items-center justify-between text-xs border-b border-border/40 pb-1">
            <div>
              <div className="font-medium">{g.area}</div>
              <div className="text-muted-foreground">{g.description}</div>
            </div>
            <Badge variant={g.severity === "high" ? "destructive" : "secondary"}>{g.severity}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
