import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function SingularityScoreCard({ score, verdict }: { score: number; verdict: string }) {
  const tone = score >= 78 ? "text-emerald-600" : score >= 60 ? "text-blue-600" : score >= 45 ? "text-amber-600" : "text-red-600";
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4" />
        <h4 className="font-medium text-sm">Strategic Singularity</h4>
      </div>
      <div className={`text-4xl font-bold ${tone}`}>{score}</div>
      <p className="text-xs text-muted-foreground mt-1">Veredito: {verdict}</p>
    </Card>
  );
}
