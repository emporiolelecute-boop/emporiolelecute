import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function CollapseProbabilityCard({ probability }: { probability: number }) {
  const level = probability > 70 ? "critical" : probability > 45 ? "high" : probability > 20 ? "moderate" : "low";
  const colorMap: Record<string, string> = {
    critical: "text-red-600 border-red-600",
    high: "text-orange-600 border-orange-600",
    moderate: "text-yellow-600 border-yellow-600",
    low: "text-green-600 border-green-600",
  };
  return (
    <Card className={`p-4 border-l-4 ${colorMap[level]}`}>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <h4 className="font-medium text-sm">Probabilidade de Colapso</h4>
      </div>
      <div className="text-3xl font-bold">{probability}%</div>
      <p className="text-xs text-muted-foreground capitalize">Nível: {level}</p>
    </Card>
  );
}
