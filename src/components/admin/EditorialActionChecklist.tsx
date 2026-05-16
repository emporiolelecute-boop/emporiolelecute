/**
 * Fase 11 — Editorial Action Checklist.
 * Componente puramente orientativo (SAFE MODE).
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Circle } from "lucide-react";
import {
  buildChecklistFromTarget,
  checklistProgress,
  type EditorialTarget,
} from "@/lib/editorialPriorities";

interface Props {
  target: EditorialTarget;
  className?: string;
}

const impactColor: Record<"high" | "medium" | "low", string> = {
  high: "text-rose-600",
  medium: "text-amber-600",
  low: "text-muted-foreground",
};

export default function EditorialActionChecklist({ target, className = "" }: Props) {
  const items = buildChecklistFromTarget(target);
  const progress = checklistProgress(items);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-medium">Checklist editorial</CardTitle>
          <Badge variant={progress.pct >= 75 ? "default" : progress.pct >= 40 ? "secondary" : "outline"}>
            {progress.done}/{progress.total} · {progress.pct}%
          </Badge>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {items.map((it) => (
          <div
            key={it.key}
            className="flex items-start gap-2 text-sm py-1.5 border-b border-border/40 last:border-0"
          >
            {it.done ? (
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
            )}
            <span className={`flex-1 ${it.done ? "line-through text-muted-foreground" : ""}`}>
              {it.label}
            </span>
            <span className={`text-xs uppercase tracking-wide ${impactColor[it.impact]}`}>
              {it.impact}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
