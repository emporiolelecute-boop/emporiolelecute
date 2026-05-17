import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { fragmentation: number; divergence: number; instability: number; signals: string[]; }
export default function FragmentationRiskPanel({ fragmentation, divergence, instability, signals }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Fragmentation Risks</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{fragmentation}</div>
        <p><span className="text-muted-foreground">Semantic Divergence:</span> {divergence}</p>
        <p><span className="text-muted-foreground">Strategic Instability:</span> {instability}</p>
        {signals.length > 0 && (
          <ul className="mt-2">{signals.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
