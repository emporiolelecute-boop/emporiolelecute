import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { authenticity: number; credibility: number; selfDeception: number; }
export default function StrategicAuthenticityPanel({ authenticity, credibility, selfDeception }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Authenticity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{authenticity}</div>
        <p><span className="text-muted-foreground">Execution Credibility:</span> {credibility}</p>
        <p><span className="text-muted-foreground">Self-Deception Pressure:</span> {selfDeception}</p>
      </CardContent>
    </Card>
  );
}
