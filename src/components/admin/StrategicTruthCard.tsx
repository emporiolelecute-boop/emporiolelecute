import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { truth: number; narrative: number; reality: number; contradictions: string[]; }
export default function StrategicTruthCard({ truth, narrative, reality, contradictions }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Truth</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{truth}</div>
        <p><span className="text-muted-foreground">Narrative Integrity:</span> {narrative}</p>
        <p><span className="text-muted-foreground">Reality Alignment:</span> {reality}</p>
        {contradictions.length > 0 && (
          <ul className="mt-2">{contradictions.map((c, i) => <li key={i}>• {c}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
