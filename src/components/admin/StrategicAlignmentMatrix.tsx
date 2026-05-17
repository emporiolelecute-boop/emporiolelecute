import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  strategic: number;
  execution: number;
  governance: number;
  semantic: number;
  authority: number;
  misalignments: string[];
}
export default function StrategicAlignmentMatrix(p: Props) {
  const rows = [
    ["Strategic", p.strategic],
    ["Execution", p.execution],
    ["Governance", p.governance],
    ["Semantic", p.semantic],
    ["Authority", p.authority],
  ] as const;
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Alignment Matrix</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {rows.map(([l, v]) => (
          <div key={l} className="flex justify-between">
            <span className="text-muted-foreground">{l}</span><strong>{v}</strong>
          </div>
        ))}
        {p.misalignments.length > 0 && (
          <div className="pt-2 border-t mt-2">
            <p className="font-medium">Misalignments</p>
            <ul>{p.misalignments.map((m, i) => <li key={i}>• {m}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
