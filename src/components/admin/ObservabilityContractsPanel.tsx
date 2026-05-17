import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContractResult } from "@/lib/observabilityContracts";

export default function ObservabilityContractsPanel({
  contracts,
}: { contracts: Array<{ name: string; result: ContractResult }> }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Observability Contracts</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {contracts.map((c) => (
          <div key={c.name} className="border rounded p-2">
            <div className="flex justify-between items-center">
              <b>{c.name}</b>
              <Badge variant={c.result.passed ? "default" : "destructive"}>
                {c.result.passed ? "PASS" : "FAIL"}
              </Badge>
            </div>
            {c.result.issues.length > 0 && (
              <ul className="list-disc pl-5 text-xs text-muted-foreground mt-1">
                {c.result.issues.slice(0, 5).map((i) => <li key={i}>{i}</li>)}
              </ul>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
