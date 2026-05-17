import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { identity: number; persistence: number; coherence: number; }
export default function StrategicIdentityPanel({ identity, persistence, coherence }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Identity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{identity}</div>
        <p><span className="text-muted-foreground">Identity Persistence:</span> {persistence}</p>
        <p><span className="text-muted-foreground">Narrative Coherence:</span> {coherence}</p>
      </CardContent>
    </Card>
  );
}
