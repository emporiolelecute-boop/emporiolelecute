import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SystemicShockAlert({
  shocks,
  risk,
}: { shocks: string[]; risk: number }) {
  const severity = risk > 75 ? "destructive" : risk > 50 ? "default" : "secondary";
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Pontos de Choque Sistêmico</CardTitle>
        <Badge variant={severity as "destructive" | "default" | "secondary"}>Risco {risk}</Badge>
      </CardHeader>
      <CardContent>
        {shocks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum ponto de choque identificado.</p>
        ) : (
          <ul className="space-y-1 text-sm font-mono">
            {shocks.map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
