import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GovernanceReport } from "@/lib/metaGovernance";

const colorFor = (v: string): "default" | "secondary" | "destructive" => {
  switch (v) {
    case "SOVEREIGN": return "default";
    case "ASCENDANT": return "default";
    case "CONTROLLED": return "secondary";
    case "UNSTABLE": return "secondary";
    case "FRACTURED": return "destructive";
    case "COLLAPSING": return "destructive";
    default: return "secondary";
  }
};

export default function GovernanceScoreCard({ report }: { report: GovernanceReport }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium">Governance Score</p>
        <Badge variant={colorFor(report.verdict) as any}>{report.verdict}</Badge>
      </div>
      <div className="text-5xl font-bold">{report.score}</div>
      <p className="text-sm text-muted-foreground">{report.summary}</p>
      <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
        <div><p className="text-muted-foreground">Governabilidade</p><p className="font-bold">{report.governability}</p></div>
        <div><p className="text-muted-foreground">Previsibilidade</p><p className="font-bold">{report.predictability}</p></div>
        <div><p className="text-muted-foreground">Consistência</p><p className="font-bold">{report.consistency}</p></div>
        <div><p className="text-muted-foreground">Continuidade</p><p className="font-bold">{report.continuity}</p></div>
        <div><p className="text-muted-foreground">Confiabilidade</p><p className="font-bold">{report.trustworthiness}</p></div>
        <div><p className="text-muted-foreground">Long Horizon</p><p className="font-bold">{report.longHorizon}</p></div>
      </div>
    </Card>
  );
}
