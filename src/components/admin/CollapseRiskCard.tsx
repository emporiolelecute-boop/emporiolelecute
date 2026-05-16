import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CollapseRiskCard({ risk, recoveryWeeks }: { risk: number; recoveryWeeks: number }) {
  const tone = risk >= 70 ? "text-red-600" : risk >= 45 ? "text-amber-600" : "text-emerald-600";
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Risco de Colapso Operacional</CardTitle></CardHeader>
      <CardContent>
        <div className={`text-5xl font-bold ${tone}`}>{risk}</div>
        <p className="text-sm text-muted-foreground mt-2">Janela estimada de recuperação: <span className="font-medium text-foreground">{recoveryWeeks} semanas</span></p>
      </CardContent>
    </Card>
  );
}
