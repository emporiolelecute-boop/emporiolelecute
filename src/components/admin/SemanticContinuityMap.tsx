import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { continuity: number; topical: number; knowledge: number; fragmentation: string[]; }
export default function SemanticContinuityMap({ continuity, topical, knowledge, fragmentation }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Semantic Continuity</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{continuity}</div>
        <p><span className="text-muted-foreground">Topical Persistence:</span> {topical}</p>
        <p><span className="text-muted-foreground">Knowledge Longevity:</span> {knowledge}</p>
        {fragmentation.length > 0 && (
          <ul className="mt-2">{fragmentation.map((f, i) => <li key={i}>• {f}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
