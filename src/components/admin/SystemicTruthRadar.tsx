import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { truth: number; coherence: number; contradictions: string[]; falsehoods: string[]; }
export default function SystemicTruthRadar({ truth, coherence, contradictions, falsehoods }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Systemic Truth</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{truth}</div>
        <p><span className="text-muted-foreground">Strategic Coherence:</span> {coherence}</p>
        {contradictions.length > 0 && (
          <div className="mt-2"><p className="font-medium">Contradictions</p>
            <ul>{contradictions.map((c, i) => <li key={i}>• {c}</li>)}</ul>
          </div>
        )}
        {falsehoods.length > 0 && (
          <div className="mt-2"><p className="font-medium">Narrative Falsehoods</p>
            <ul>{falsehoods.map((f, i) => <li key={i}>• {f}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
