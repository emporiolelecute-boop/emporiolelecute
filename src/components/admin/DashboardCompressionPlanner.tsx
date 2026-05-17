import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CompressionSuggestion } from "@/lib/dashboardCompression";

export default function DashboardCompressionPlanner({
  suggestions,
}: { suggestions: CompressionSuggestion[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Dashboard Compression Planner</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {suggestions.length === 0 && <div className="text-muted-foreground">No compression suggestions.</div>}
        {suggestions.slice(0, 30).map((s, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-1">
            <div className="truncate">
              <b>{s.id}</b>
              {s.withId && <span className="text-muted-foreground"> ↔ {s.withId}</span>}
              <span className="text-muted-foreground"> — {s.reason}</span>
            </div>
            <Badge variant="outline">{s.recommendation}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
