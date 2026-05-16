import { Badge } from "@/components/ui/badge";

export function CommercialRiskBadge({ exposure, diversity }: { exposure: number; diversity: number }) {
  const risk = exposure > 65 ? "high" : exposure > 40 ? "medium" : "low";
  const variant = risk === "high" ? "destructive" : risk === "medium" ? "secondary" : "default";
  return (
    <Badge variant={variant as any}>
      Exposição {exposure}% · Diversidade {diversity}%
    </Badge>
  );
}
