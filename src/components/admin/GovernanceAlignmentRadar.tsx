import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GovernanceAlignmentMap, GovernanceVerdict } from "@/lib/governanceAlignment";

export default function GovernanceAlignmentRadar({
  score, verdict, map, conflicts, drift, harmony,
}: {
  score: number; verdict: GovernanceVerdict; map: GovernanceAlignmentMap;
  conflicts: number; drift: number; harmony: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Governance Alignment <Badge>{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-semibold">{score}<span className="text-base text-muted-foreground">/100</span></div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>Conflicts: <span className="font-medium">{conflicts}/100</span></div>
          <div>Drift: <span className="font-medium">{drift}/100</span></div>
          <div>Harmony: <span className="font-medium">{harmony}/100</span></div>
          <div>Strongest: <span className="font-medium">{map.strongest}</span></div>
          <div>Weakest: <span className="font-medium">{map.weakest}</span></div>
        </div>
        <div className="space-y-1">
          {map.axes.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <div className="w-40 text-xs text-muted-foreground">{a.name}</div>
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${a.value}%` }} />
              </div>
              <div className="w-12 text-right text-xs">{a.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
