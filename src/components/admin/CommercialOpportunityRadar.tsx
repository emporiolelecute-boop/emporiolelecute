import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Opportunity { id: string; kind: string; score: number; rationale: string }

export default function CommercialOpportunityRadar({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Commercial Opportunity Radar</CardTitle></CardHeader>
      <CardContent className="text-sm">
        {opportunities.length === 0 ? (
          <p className="text-xs text-muted-foreground">No commercial opportunities flagged.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-auto">
            {opportunities.slice(0, 12).map((o) => (
              <li key={o.id + o.kind} className="flex items-start justify-between gap-2 border-b pb-1 last:border-0">
                <div className="min-w-0">
                  <div className="font-medium truncate">{o.id}</div>
                  <div className="text-xs text-muted-foreground">{o.rationale}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary">{o.kind}</Badge>
                  <span className="text-xs font-bold">{o.score}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
