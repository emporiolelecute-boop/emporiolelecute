import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { consistency: number; continuity: number; persistence: number; deviation: number; mutations: string[]; }
export default function LongitudinalConsistencyTimeline({ consistency, continuity, persistence, deviation, mutations }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Longitudinal Consistency</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{consistency}</div>
        <p><span className="text-muted-foreground">Continuity Strength:</span> {continuity}</p>
        <p><span className="text-muted-foreground">Identity Persistence:</span> {persistence}</p>
        <p><span className="text-muted-foreground">Strategic Deviation:</span> {deviation}</p>
        {mutations.length > 0 && (
          <ul className="mt-2 space-y-0.5">{mutations.map((m, i) => <li key={i}>• {m}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
