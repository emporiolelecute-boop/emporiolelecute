import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function GovernanceDriftAlert({ drift, alerts }: { drift: number; alerts: string[] }) {
  const severity = drift >= 60 ? "destructive" : drift >= 40 ? "secondary" : "muted";
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className={`h-5 w-5 ${severity === "destructive" ? "text-destructive" : "text-muted-foreground"}`} />
        <p className="text-base font-medium">Governance Drift</p>
      </div>
      <div className="text-5xl font-bold">{drift}</div>
      {alerts.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sem desvios relevantes.</p>
      ) : (
        <ul className="list-disc pl-5 text-xs text-muted-foreground">
          {alerts.map((s) => <li key={s}>{s}</li>)}
        </ul>
      )}
    </Card>
  );
}
