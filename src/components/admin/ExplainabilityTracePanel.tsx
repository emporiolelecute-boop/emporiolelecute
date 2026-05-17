import { Card } from "@/components/ui/card";

export default function ExplainabilityTracePanel({
  traces,
}: { traces: string[] }) {
  return (
    <Card className="p-4 space-y-3">
      <p className="text-base font-medium">Explainability Trace</p>
      {traces.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sem traços disponíveis.</p>
      ) : (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {traces.slice(0, 12).map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      )}
    </Card>
  );
}
