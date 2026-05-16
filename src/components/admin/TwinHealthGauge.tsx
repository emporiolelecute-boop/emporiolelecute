import { Card } from "@/components/ui/card";

export default function TwinHealthGauge({ score }: { score: number }) {
  const level =
    score >= 80 ? { label: "Excelente", tone: "text-emerald-600" } :
    score >= 60 ? { label: "Saudável", tone: "text-primary" } :
    score >= 40 ? { label: "Atenção", tone: "text-amber-600" } :
                  { label: "Crítico", tone: "text-destructive" };
  return (
    <Card className="p-4 space-y-2">
      <h4 className="text-sm text-muted-foreground">Twin Health</h4>
      <div className={`text-4xl font-semibold ${level.tone}`}>{score}</div>
      <div className="text-xs text-muted-foreground">{level.label}</div>
      <div className="h-2 bg-muted rounded">
        <div className="h-2 bg-primary rounded" style={{ width: `${score}%` }} />
      </div>
    </Card>
  );
}
