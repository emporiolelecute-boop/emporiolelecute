import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { coherence: number; narrative: number; contradictions: number; clarity: number; noise: number }
export default function ExecutiveCoherenceMap(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Coherence</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-3xl font-bold">{p.coherence}</div>
        <p><span className="text-muted-foreground">Narrative:</span> {p.narrative}</p>
        <p><span className="text-muted-foreground">Leadership Clarity:</span> {p.clarity}</p>
        <p><span className="text-muted-foreground">Contradictions:</span> {p.contradictions}</p>
        <p><span className="text-muted-foreground">Strategic Noise:</span> {p.noise}</p>
      </CardContent>
    </Card>
  );
}
