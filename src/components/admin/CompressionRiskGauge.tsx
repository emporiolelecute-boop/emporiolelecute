import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CompressionRiskGauge({
  execution,
  semantic,
  authority,
}: { execution: number; semantic: number; authority: number }) {
  const rows = [
    { label: "Execução", value: execution },
    { label: "Semântica", value: semantic },
    { label: "Autoridade", value: authority },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Compressão Operacional</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-mono">{r.value}</span>
            </div>
            <Progress value={r.value} className="h-2 mt-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
