import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CognitiveVerdict } from "@/lib/cognitiveOrchestrator";

const tone: Record<CognitiveVerdict, string> = {
  TRANSCENDENT: "bg-emerald-500/15 text-emerald-700",
  SYNCHRONIZED: "bg-emerald-500/10 text-emerald-700",
  STABLE: "bg-muted text-foreground",
  NOISY: "bg-amber-500/15 text-amber-700",
  FRAGMENTED: "bg-orange-500/15 text-orange-700",
  COLLAPSING: "bg-red-500/15 text-red-700",
};

export default function CognitiveStabilityCard({
  score, verdict, drivers,
}: { score: number; verdict: CognitiveVerdict; drivers: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Estabilidade Cognitiva</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-5xl font-bold">{score}</div>
        <Badge className={tone[verdict]} variant="outline">{verdict}</Badge>
        {drivers.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {drivers.map((d, i) => <li key={i}>• {d}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
