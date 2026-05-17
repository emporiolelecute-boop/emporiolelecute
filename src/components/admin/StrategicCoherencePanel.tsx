import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategicCoherencePanel({
  coherence, executive, persistence,
}: { coherence: number; executive: number; persistence: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Strategic Coherence</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <Metric label="Coherence" v={coherence} />
          <Metric label="Executive" v={executive} />
          <Metric label="Persistence" v={persistence} />
        </div>
        <p className="text-muted-foreground">
          Cross-layer strategic alignment composite. Stable above 70/100.
        </p>
      </CardContent>
    </Card>
  );
}

function Metric({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{v}<span className="text-sm text-muted-foreground">/100</span></div>
    </div>
  );
}
