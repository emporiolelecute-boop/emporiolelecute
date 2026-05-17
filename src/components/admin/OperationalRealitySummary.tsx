import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OperationalRealitySummary({
  operationalValue,
  sustainability,
  governanceMaturity,
  humanOperability,
  signalToNoise,
  notes,
}: {
  operationalValue: number;
  sustainability: number;
  governanceMaturity: number;
  humanOperability: number;
  signalToNoise: number;
  notes?: string[];
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Reality Summary</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <Row label="Operational value" value={operationalValue} />
        <Row label="Sustainability" value={sustainability} />
        <Row label="Governance maturity" value={governanceMaturity} />
        <Row label="Human operability" value={humanOperability} />
        <Row label="Signal-to-noise" value={signalToNoise} />
        {notes && notes.length > 0 && (
          <div className="pt-2 border-t mt-2">
            <div className="text-xs font-medium mb-1">Notes</div>
            <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-0.5">
              {notes.slice(0, 6).map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><b>{value}</b></div>
      <Progress value={value} className="h-1" />
    </div>
  );
}
