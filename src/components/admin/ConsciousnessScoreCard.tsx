import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ConsciousnessVerdict } from "@/lib/consciousnessEngine";

const tone: Record<ConsciousnessVerdict, string> = {
  HyperAware: "bg-emerald-500/15 text-emerald-700",
  Conscious: "bg-emerald-500/10 text-emerald-700",
  Adaptive: "bg-sky-500/15 text-sky-700",
  Stable: "bg-muted text-foreground",
  Fragmented: "bg-amber-500/15 text-amber-700",
  Disoriented: "bg-orange-500/15 text-orange-700",
  Critical: "bg-red-500/15 text-red-700",
};

export default function ConsciousnessScoreCard({ score, verdict }: { score: number; verdict: ConsciousnessVerdict }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Consciência Sistêmica</CardTitle></CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{score}</div>
        <Badge className={`mt-3 ${tone[verdict]}`} variant="outline">{verdict}</Badge>
      </CardContent>
    </Card>
  );
}
