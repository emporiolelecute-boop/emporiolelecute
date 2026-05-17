import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  exposure: number;
  collapseRisk: number;
  fragmentation: number;
  drift: number;
  breakpoints: string[];
}
export default function SystemicCollapseRadar(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Systemic Collapse Radar</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <p><span className="text-muted-foreground">Exposure:</span> <strong>{p.exposure}</strong></p>
        <p><span className="text-muted-foreground">Collapse Risk:</span> {p.collapseRisk}</p>
        <p><span className="text-muted-foreground">Fragmentation:</span> {p.fragmentation}</p>
        <p><span className="text-muted-foreground">Drift:</span> {p.drift}</p>
        {p.breakpoints.length > 0 && (
          <div className="pt-2 border-t mt-2">
            <p className="font-medium">Breakpoints</p>
            <ul>{p.breakpoints.map((b, i) => <li key={i}>• {b}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
