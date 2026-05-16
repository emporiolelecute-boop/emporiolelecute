import { Badge } from "@/components/ui/badge";
import { buildSeoVerdict, verdictLabel, type IndexableEntity, type SeoVerdict } from "@/lib/indexationGovernance";

interface Props {
  entity: IndexableEntity;
  className?: string;
}

const COLOR: Record<SeoVerdict, string> = {
  EXCELLENT: "bg-emerald-600 text-white hover:bg-emerald-600",
  STRONG:    "bg-green-500 text-white hover:bg-green-500",
  MEDIUM:    "bg-amber-500 text-white hover:bg-amber-500",
  WEAK:      "bg-orange-500 text-white hover:bg-orange-500",
  BLOCKED:   "bg-destructive text-destructive-foreground hover:bg-destructive",
};

export function SeoReadinessBadge({ entity, className }: Props) {
  const v = buildSeoVerdict(entity);
  return (
    <Badge className={`${COLOR[v]} ${className ?? ""}`} title={`SEO: ${verdictLabel(v)}`}>
      {verdictLabel(v)}
    </Badge>
  );
}

export default SeoReadinessBadge;
