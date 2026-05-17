import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  reasoning: number;
  decision: number;
  forecast: number;
  system: number;
  inconsistency: number;
  collapse: number;
}

export default function ReliabilityIntegrityCard(p: Props) {
  const row = (l: string, v: number) => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{l}</span><span className="font-medium">{v}</span>
    </div>
  );
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Reliability Integrity</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {row("System Reliability", p.system)}
        {row("Reasoning Reliability", p.reasoning)}
        {row("Decision Reliability", p.decision)}
        {row("Forecast Reliability", p.forecast)}
        {row("Inconsistency", p.inconsistency)}
        {row("Reliability Collapse Risk", p.collapse)}
      </CardContent>
    </Card>
  );
}
