import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { consistency: number; truth: number; coherence: number; distortion: number; }
export default function RealityConsistencyTimeline({ consistency, truth, coherence, distortion }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Reality Consistency</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{consistency}</div>
        <p><span className="text-muted-foreground">Systemic Truth:</span> {truth}</p>
        <p><span className="text-muted-foreground">Strategic Coherence:</span> {coherence}</p>
        <p><span className="text-muted-foreground">Semantic Distortion:</span> {distortion}</p>
      </CardContent>
    </Card>
  );
}
