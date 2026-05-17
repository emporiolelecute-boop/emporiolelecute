import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DebtDistribution } from "@/lib/structuralDebt";

export default function StructuralDebtPanel({
  total,
  distribution,
}: { total: number; distribution: DebtDistribution[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Débito Estrutural</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold">{total}</div>
        <Progress value={Math.min(100, total)} />
        <div className="grid gap-2 text-sm">
          {distribution.map((d) => (
            <div key={d.label}>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="font-mono">{d.value}</span>
              </div>
              <Progress value={d.value} className="h-1 mt-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
