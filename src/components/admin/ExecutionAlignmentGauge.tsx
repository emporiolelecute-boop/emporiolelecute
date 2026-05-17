import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  alignment: number;
  reliability: number;
  pressure: number;
  collapse: number;
}
export default function ExecutionAlignmentGauge(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Execution Alignment</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-3xl font-bold">{p.alignment}</div>
        <p><span className="text-muted-foreground">Reliability:</span> {p.reliability}</p>
        <p><span className="text-muted-foreground">Pressure:</span> {p.pressure}</p>
        <p><span className="text-muted-foreground">Collapse:</span> {p.collapse}</p>
      </CardContent>
    </Card>
  );
}
