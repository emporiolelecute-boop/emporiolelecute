import { Card } from "@/components/ui/card";

export default function GovernanceConvergenceGauge({
  convergence, drift, alerts,
}: { convergence: number; drift: number; alerts: string[] }) {
  return (
    <Card className="p-4 space-y-3">
      <p className="text-base font-medium">Governance Convergence</p>
      <div className="flex items-baseline gap-3">
        <div className="text-4xl font-bold">{convergence}</div>
        <span className="text-xs text-muted-foreground">drift: {drift}</span>
      </div>
      {alerts.length > 0 && (
        <ul className="list-disc pl-5 text-xs text-muted-foreground">
          {alerts.slice(0, 5).map((a) => <li key={a}>{a}</li>)}
        </ul>
      )}
    </Card>
  );
}
