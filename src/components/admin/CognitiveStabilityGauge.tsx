import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { stability: number; consistency: number; resilience: number; focus: number; instabilities: string[]; }
export default function CognitiveStabilityGauge({ stability, consistency, resilience, focus, instabilities }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Cognitive Stability</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{stability}</div>
        <p><span className="text-muted-foreground">Decision Consistency:</span> {consistency}</p>
        <p><span className="text-muted-foreground">Resilience:</span> {resilience}</p>
        <p><span className="text-muted-foreground">Focus:</span> {focus}</p>
        {instabilities.length > 0 && (
          <ul className="mt-2 space-y-0.5">{instabilities.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
