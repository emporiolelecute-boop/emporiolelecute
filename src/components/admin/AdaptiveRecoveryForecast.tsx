import { Card } from "@/components/ui/card";

export default function AdaptiveRecoveryForecast({ days, plan }: { days: number; plan: string[] }) {
  return (
    <Card className="p-4 space-y-2">
      <h4 className="font-medium">Recuperação Adaptativa Projetada</h4>
      <p className="text-3xl font-bold">{days}d</p>
      <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
        {plan.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </Card>
  );
}
