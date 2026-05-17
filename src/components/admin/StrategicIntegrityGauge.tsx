import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { integrity: number; structural: number; semantic: number; authority: number }
export default function StrategicIntegrityGauge(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Integrity</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-3xl font-bold">{p.integrity}</div>
        <p><span className="text-muted-foreground">Structural:</span> {p.structural}</p>
        <p><span className="text-muted-foreground">Semantic:</span> {p.semantic}</p>
        <p><span className="text-muted-foreground">Authority:</span> {p.authority}</p>
      </CardContent>
    </Card>
  );
}
