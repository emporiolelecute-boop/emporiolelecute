import { Card } from "@/components/ui/card";
import type { StrategicScenario } from "@/lib/strategicScenarioBuilder";

export default function ScenarioComparisonPanel({ scenarios }: { scenarios: StrategicScenario[] }) {
  const cols: Array<{ key: keyof StrategicScenario; label: string }> = [
    { key: "projectedGains", label: "Ganhos" },
    { key: "projectedLosses", label: "Perdas" },
    { key: "requiredEffort", label: "Esforço" },
    { key: "estimatedROI", label: "ROI" },
    { key: "sustainability", label: "Sust." },
    { key: "resilience", label: "Resil." },
    { key: "confidence", label: "Conf." },
  ];
  return (
    <Card className="p-4 overflow-x-auto">
      <h4 className="font-medium mb-3">Comparação de Cenários</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-2 pr-3">Cenário</th>
            {cols.map((c) => <th key={c.key} className="py-2 px-2 text-right">{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s) => (
            <tr key={s.name} className="border-t">
              <td className="py-2 pr-3 font-medium">{s.label}</td>
              {cols.map((c) => (
                <td key={c.key} className="py-2 px-2 text-right">{s[c.key] as number}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
