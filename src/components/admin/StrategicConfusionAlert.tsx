import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function StrategicConfusionAlert({
  strategic, authority, governance, semantic,
}: { strategic: number; authority: number; governance: number; semantic: number }) {
  const items = [
    { label: "Estratégica", value: strategic },
    { label: "Autoridade", value: authority },
    { label: "Governança", value: governance },
    { label: "Semântica", value: semantic },
  ];
  const triggered = items.filter((x) => x.value >= 55);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" /> Alertas de Confusão
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {triggered.length === 0 ? (
          <p className="text-muted-foreground">Sem confusão sistêmica significativa.</p>
        ) : (
          <ul className="space-y-1">
            {triggered.map((t) => (
              <li key={t.label} className="flex justify-between">
                <span>{t.label}</span>
                <span className={t.value >= 70 ? "text-red-700 font-medium" : "text-amber-700"}>{t.value}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
