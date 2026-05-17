import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { viability: number; recovery: number; collapseProbability: number; integrity: number; falseSignals: string[]; }
export default function SurvivabilityRealityCard({ viability, recovery, collapseProbability, integrity, falseSignals }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Survivability Reality</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{viability}</div>
        <p><span className="text-muted-foreground">Recovery Reality:</span> {recovery}</p>
        <p><span className="text-muted-foreground">Collapse Probability:</span> {collapseProbability}</p>
        <p><span className="text-muted-foreground">Survival Integrity:</span> {integrity}</p>
        {falseSignals.length > 0 && (
          <ul className="mt-2 space-y-0.5">{falseSignals.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
