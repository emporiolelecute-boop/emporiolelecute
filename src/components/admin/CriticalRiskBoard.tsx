import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function CriticalRiskBoard({ risks }: { risks: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Critical Risks</CardTitle></CardHeader>
      <CardContent>
        {risks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem riscos críticos detectados.</p>
        ) : (
          <ul className="text-sm space-y-1 list-disc pl-5">
            {risks.map((r) => <li key={r} className="text-destructive">{r}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
