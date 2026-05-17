import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SemanticPulseMatrix({ pulse, entropy, connectivity, balance }: { pulse: number; entropy: number; connectivity: number; balance: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Semantic Pulse Matrix</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-4xl font-bold">{pulse}</div>
        {[
          { label: "Conectividade", value: connectivity },
          { label: "Balanço Semântico", value: balance },
          { label: "Entropia", value: entropy },
        ].map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-xs mb-1"><span>{row.label}</span><span>{row.value}</span></div>
            <Progress value={row.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
