import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AbsorptionReport } from "@/lib/entropyAbsorption";

export default function EntropyAbsorptionCard({ report }: { report: AbsorptionReport }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Entropy Absorption <Badge variant="outline">{report.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{report.absorption}</div>
        <div className="flex justify-between"><span className="text-muted-foreground">Semântica</span><b>{report.semantic}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Estratégica</span><b>{report.strategic}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Operacional</span><b>{report.operational}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Capacidade</span><b>{report.capacity}</b></div>
        {report.acceleration.length > 0 && (
          <div className="pt-2">
            <p className="font-medium text-xs">Aceleração</p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground">
              {report.acceleration.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
