import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AwarenessCollapseAlert({ risk }: { risk: number }) {
  const level = risk >= 75 ? "Crítico" : risk >= 50 ? "Atenção" : risk >= 25 ? "Vigilância" : "Estável";
  const variant = risk >= 75 ? "destructive" : risk >= 50 ? "secondary" : "outline";
  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Colapso de Awareness</h4>
        <Badge variant={variant as any}>{level}</Badge>
      </div>
      <div className="text-4xl font-bold">{risk}%</div>
      <p className="text-xs text-muted-foreground">
        Combinação de risco de colapso, falha em cascata e baixa consciência sistêmica.
      </p>
    </Card>
  );
}
