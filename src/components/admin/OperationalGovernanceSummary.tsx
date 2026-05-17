import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ComplexityPressure } from "@/lib/operationalGovernance";

export default function OperationalGovernanceSummary({
  pressures,
  cognitiveLoad,
  pressureScore,
  clarityScore,
  drift,
  sprawl,
}: {
  pressures: ComplexityPressure[];
  cognitiveLoad: number;
  pressureScore: number;
  clarityScore: number;
  drift: "low" | "medium" | "high";
  sprawl: string[];
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Governance Summary</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Stat label="Cognitive load" v={cognitiveLoad} />
          <Stat label="Pressure" v={pressureScore} />
          <Stat label="Clarity" v={clarityScore} />
          <div className="border rounded p-2">
            <div className="text-xs text-muted-foreground">Entropy drift</div>
            <Badge variant={drift === "high" ? "destructive" : "outline"}>{drift}</Badge>
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Complexity pressures:</div>
          <div className="flex flex-wrap gap-1">
            {pressures.length === 0 && <span className="text-muted-foreground">None.</span>}
            {pressures.map((p, i) => (
              <Badge key={i} variant={p.level === "high" ? "destructive" : "outline"}>
                {p.area}: {p.detail}
              </Badge>
            ))}
          </div>
        </div>
        {sprawl.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Sprawl signals:</div>
            <ul className="list-disc list-inside text-muted-foreground">
              {sprawl.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}<span className="text-xs text-muted-foreground">/100</span></div>
    </div>
  );
}
