import { Badge } from "@/components/ui/badge";
import type { StabilityResult } from "@/lib/semanticStability";

export function SemanticStabilityBadge({ result }: { result: StabilityResult }) {
  const variant =
    result.risk === "low" ? "default" :
    result.risk === "medium" ? "secondary" :
    "destructive";
  return (
    <Badge variant={variant as any}>
      Estabilidade {result.score}/100 · {result.risk}
    </Badge>
  );
}
