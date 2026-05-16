import { Card } from "@/components/ui/card";

export default function AdaptiveCapacityGauge({ capacity, pressure }: { capacity: number; pressure: number }) {
  const tone = capacity > 65 ? "text-emerald-600" : capacity > 45 ? "text-amber-600" : "text-red-600";
  return (
    <Card className="p-4">
      <h4 className="font-medium text-sm mb-2">Capacidade Adaptativa</h4>
      <div className={`text-4xl font-bold ${tone}`}>{capacity}</div>
      <p className="text-xs text-muted-foreground">Pressão adaptativa: {pressure}</p>
    </Card>
  );
}
