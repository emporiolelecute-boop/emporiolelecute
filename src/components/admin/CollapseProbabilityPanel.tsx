import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CollapseSignal } from "@/lib/strategicCollapseEngine";

export default function CollapseProbabilityPanel({
  probability, signals, recoveryDays,
}: { probability: number; signals: CollapseSignal[]; recoveryDays: number }) {
  return (
    <Card className="p-4 space-y-3">
      <h4 className="font-medium">Probabilidade de Colapso Estratégico</h4>
      <div className="flex items-center justify-between text-sm"><span>Probabilidade</span><span className="font-semibold">{probability}%</span></div>
      <Progress value={probability} />
      <p className="text-xs text-muted-foreground">Janela estimada de recuperação: {recoveryDays} dias</p>
      <div className="space-y-1 pt-2 border-t">
        {signals.length === 0 && <p className="text-xs text-muted-foreground">Sem sinais críticos.</p>}
        {signals.map((s, i) => (
          <p key={i} className="text-xs"><span className="font-medium">[{s.severity}]</span> {s.note}</p>
        ))}
      </div>
    </Card>
  );
}
