import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { entropy: number; signals: string[]; risks: string[] }
export default function GovernanceMatrixEntropyPanel({ entropy, signals, risks }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Governance Entropy</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="text-3xl font-bold">{entropy}</div>
        {signals.length > 0 && (
          <div><p className="text-muted-foreground">Instability Signals</p>
            <ul>{signals.map((s, i) => <li key={i}>• {s}</li>)}</ul></div>
        )}
        {risks.length > 0 && (
          <div><p className="text-muted-foreground">Governance Risks</p>
            <ul>{risks.map((s, i) => <li key={i}>• {s}</li>)}</ul></div>
        )}
      </CardContent>
    </Card>
  );
}
