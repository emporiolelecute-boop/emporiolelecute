import { Badge } from "@/components/ui/badge";

export default function SimulationConfidenceBadge({ confidence }: { confidence: number }) {
  const level = confidence > 75 ? "alta" : confidence > 50 ? "média" : "baixa";
  const color = confidence > 75 ? "bg-green-500" : confidence > 50 ? "bg-yellow-500" : "bg-red-500";
  return <Badge className={`${color} text-white`}>Confiança {level} ({Math.round(confidence)}%)</Badge>;
}
