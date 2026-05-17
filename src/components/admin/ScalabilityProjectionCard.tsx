import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ScalabilityProjectionCard({
  score,
  limit,
  fragility,
  maintenance,
}: { score: number; limit: number; fragility: number; maintenance: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Projeção de Escalabilidade</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold">{score}</div>
        <Progress value={score} />
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div><div className="text-muted-foreground">Limite</div><div className="font-mono text-sm">{limit}</div></div>
          <div><div className="text-muted-foreground">Fragilidade</div><div className="font-mono text-sm">{fragility}</div></div>
          <div><div className="text-muted-foreground">Manutenção</div><div className="font-mono text-sm">{maintenance}</div></div>
        </div>
      </CardContent>
    </Card>
  );
}
