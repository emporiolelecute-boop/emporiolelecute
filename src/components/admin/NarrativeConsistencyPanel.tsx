import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { consistency: number; dissonance: number; clarity: number }
export default function NarrativeConsistencyPanel(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Narrative Consistency</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-3xl font-bold">{p.consistency}</div>
        <p><span className="text-muted-foreground">Dissonance:</span> {p.dissonance}</p>
        <p><span className="text-muted-foreground">Leadership Clarity:</span> {p.clarity}</p>
      </CardContent>
    </Card>
  );
}
