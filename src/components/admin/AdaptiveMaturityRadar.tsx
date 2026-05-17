import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { maturity: number; evolutionary: number; longTerm: number; fatigue: number; regressions: string[]; }
export default function AdaptiveMaturityRadar({ maturity, evolutionary, longTerm, fatigue, regressions }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Adaptive Maturity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{maturity}</div>
        <p><span className="text-muted-foreground">Evolutionary Capacity:</span> {evolutionary}</p>
        <p><span className="text-muted-foreground">Long-Term Adaptability:</span> {longTerm}</p>
        <p><span className="text-muted-foreground">Adaptation Fatigue:</span> {fatigue}</p>
        {regressions.length > 0 && (
          <ul className="mt-2 space-y-0.5">{regressions.map((r, i) => <li key={i}>• {r}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
