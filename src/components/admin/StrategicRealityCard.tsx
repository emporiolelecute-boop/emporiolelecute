import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RealityVerdict } from "@/lib/strategicReality";

interface Props { score: number; verdict: RealityVerdict; summary: string; strengths: string[]; }
export default function StrategicRealityCard({ score, verdict, summary, strengths }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Reality</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <div className="text-4xl font-bold">{score}</div>
        <Badge variant="outline">{verdict}</Badge>
        <p className="text-sm text-muted-foreground">{summary}</p>
        {strengths.length > 0 && (
          <ul className="text-sm space-y-0.5 mt-2">
            {strengths.map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
