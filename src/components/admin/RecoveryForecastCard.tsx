import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface RecoveryForecast {
  scenario: "optimistic" | "stable" | "fragile" | "collapsing";
  difficulty: number;       // 0..100
  estimated_days: number;
  notes?: string;
}

const variantMap: Record<RecoveryForecast["scenario"], "default" | "secondary" | "destructive"> = {
  optimistic: "default",
  stable: "default",
  fragile: "secondary",
  collapsing: "destructive",
};

export function RecoveryForecastCard({ forecast }: { forecast: RecoveryForecast }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Previsão de Recuperação
          <Badge variant={variantMap[forecast.scenario]}>{forecast.scenario}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Dificuldade: <span className="font-mono">{forecast.difficulty}/100</span></p>
        <p>Tempo estimado: <span className="font-mono">{forecast.estimated_days} dias</span></p>
        {forecast.notes && <p className="text-muted-foreground text-xs">{forecast.notes}</p>}
      </CardContent>
    </Card>
  );
}
