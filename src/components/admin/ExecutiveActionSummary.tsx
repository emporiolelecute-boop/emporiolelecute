import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OperationalSummary } from "@/lib/executiveActionEngine";

export default function ExecutiveActionSummary({
  summary, narrative,
}: { summary: OperationalSummary; narrative: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Executive Action Summary</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Stat label="Sustainability" v={summary.sustainability} />
          <Stat label="Harmony" v={summary.harmony} />
          <Stat label="Leverage" v={summary.leverage} />
          <Stat label="Fatigue" v={summary.fatigue} />
          <Stat label="Long-term value" v={summary.long_term_value} />
          <Stat label="Active threads" v={summary.active_threads} raw />
          <Stat label="Waste items" v={summary.waste_count} raw />
        </div>
        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
          {narrative.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
function Stat({ label, v, raw }: { label: string; v: number; raw?: boolean }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}{!raw && <span className="text-xs text-muted-foreground">/100</span>}</div>
    </div>
  );
}
