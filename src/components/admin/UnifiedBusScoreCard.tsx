import { Card } from "@/components/ui/card";
import { Orbit } from "lucide-react";

export default function UnifiedBusScoreCard({
  score, verdict, reasons,
}: { score: number; verdict: string; reasons: string[] }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Orbit className="h-5 w-5 text-primary" />
        <p className="text-base font-medium">Unified Bus Score</p>
      </div>
      <div className="text-5xl font-bold">{score}</div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{verdict}</p>
      {reasons.length > 0 && (
        <ul className="list-disc pl-5 text-xs text-muted-foreground">
          {reasons.slice(0, 4).map((r) => <li key={r}>{r}</li>)}
        </ul>
      )}
    </Card>
  );
}
