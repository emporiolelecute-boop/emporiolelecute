import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { grounding: number; knowledge: number; hallucination: number; inflations: string[]; }
export default function SemanticGroundingMatrix({ grounding, knowledge, hallucination, inflations }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Semantic Grounding</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{grounding}</div>
        <p><span className="text-muted-foreground">Knowledge Grounding:</span> {knowledge}</p>
        <p><span className="text-muted-foreground">Hallucination Risk:</span> {hallucination}</p>
        {inflations.length > 0 && (
          <ul className="mt-2 space-y-0.5">{inflations.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
