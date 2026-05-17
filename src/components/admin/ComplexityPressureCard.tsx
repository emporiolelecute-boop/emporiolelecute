import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComplexityPressureCard({
  artificialComplexity, inflationScore, inflated,
}: { artificialComplexity: number; inflationScore: number; inflated: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Complexity Pressure</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Artificial complexity" v={artificialComplexity} />
          <Stat label="Signal inflation" v={inflationScore} />
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Inflated metrics ({inflated.length})</div>
          {inflated.length ? (
            <ul className="list-disc pl-5 text-muted-foreground">
              {inflated.map((m) => <li key={m}>{m}</li>)}
            </ul>
          ) : <p className="text-muted-foreground">None detected.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}<span className="text-xs text-muted-foreground">/100</span></div>
    </div>
  );
}
