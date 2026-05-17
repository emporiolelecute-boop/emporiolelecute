import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { illusionRisk: number; selfDeception: number; artificialMomentum: number; signals: string[]; }
export default function IllusionRiskPanel({ illusionRisk, selfDeception, artificialMomentum, signals }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Illusion Risks</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{illusionRisk}</div>
        <p><span className="text-muted-foreground">Strategic Self-Deception:</span> {selfDeception}</p>
        <p><span className="text-muted-foreground">Artificial Momentum:</span> {artificialMomentum}</p>
        {signals.length > 0 && (
          <ul className="mt-2 space-y-0.5">{signals.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
