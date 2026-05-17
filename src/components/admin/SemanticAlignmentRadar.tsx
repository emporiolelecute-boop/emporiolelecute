import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { alignment: number; coherence: number; knowledge: number; drifts: string[]; }
export default function SemanticAlignmentRadar({ alignment, coherence, knowledge, drifts }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Semantic Alignment</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{alignment}</div>
        <p><span className="text-muted-foreground">Coherence:</span> {coherence}</p>
        <p><span className="text-muted-foreground">Knowledge Integrity:</span> {knowledge}</p>
        {drifts.length > 0 && (
          <ul className="mt-2">{drifts.map((d, i) => <li key={i}>• {d}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
