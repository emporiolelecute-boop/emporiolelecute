import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChecklistItem { id: string; label: string; cadence: "weekly" | "monthly" | "quarterly" }

export default function HumanOperationsChecklist({ items }: { items: ChecklistItem[] }) {
  const groups: Record<string, ChecklistItem[]> = { weekly: [], monthly: [], quarterly: [] };
  for (const it of items) groups[it.cadence].push(it);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Human Operations Checklist</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        {(["weekly", "monthly", "quarterly"] as const).map((c) => (
          <div key={c}>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="capitalize">{c}</Badge>
              <span className="text-xs text-muted-foreground">{groups[c].length} items</span>
            </div>
            <ul className="text-xs list-disc pl-5 space-y-0.5">
              {groups[c].map((i) => <li key={i.id}>{i.label}</li>)}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
