import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExecutiveVerdict } from "@/lib/executiveSynthesisCore";

interface Props {
  score: number;
  verdict: ExecutiveVerdict;
  drivers: string[];
}
export default function ExecutiveCoreScoreCard({ score, verdict, drivers }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Core Score</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <div className="text-4xl font-bold">{score}</div>
        <Badge variant="outline">{verdict}</Badge>
        {drivers.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-0.5 mt-2">
            {drivers.map((d, i) => <li key={i}>• {d}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
