import { Card } from "@/components/ui/card";

export default function MutationRateCard({ rate }: { rate: number }) {
  return (
    <Card className="p-4">
      <h4 className="font-medium text-sm mb-2">Taxa de Mutação Semântica</h4>
      <div className="text-4xl font-bold">{rate}%</div>
      <p className="text-xs text-muted-foreground">Mudanças semânticas relativas ao total.</p>
    </Card>
  );
}
