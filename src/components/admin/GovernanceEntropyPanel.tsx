import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EntropyReport } from "@/lib/governanceEntropy";

export default function GovernanceEntropyPanel({ report }: { report: EntropyReport }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Governance Entropy
          <Badge variant="outline">{report.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <p><span className="text-muted-foreground">Total:</span> <strong>{report.entropy}</strong></p>
          <p><span className="text-muted-foreground">Strategic:</span> {report.strategic}</p>
          <p><span className="text-muted-foreground">Operational:</span> {report.operational}</p>
          <p><span className="text-muted-foreground">Semantic:</span> {report.semantic}</p>
        </div>
        {report.acceleration.length > 0 && (
          <div className="pt-2 border-t">
            <p className="font-medium">Acceleration</p>
            <ul>{report.acceleration.map((a, i) => <li key={i}>• {a}</li>)}</ul>
          </div>
        )}
        {report.drift.length > 0 && (
          <div className="pt-2 border-t">
            <p className="font-medium">Drift</p>
            <ul>{report.drift.map((a, i) => <li key={i}>• {a}</li>)}</ul>
          </div>
        )}
        {report.meta_instability.length > 0 && (
          <div className="pt-2 border-t">
            <p className="font-medium">Meta-Instability</p>
            <ul>{report.meta_instability.map((a, i) => <li key={i}>• {a}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
