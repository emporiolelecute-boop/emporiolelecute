import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { QuickWin } from "@/lib/executiveMode";

export default function QuickWinsBoard({ wins }: { wins: QuickWin[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Quick Wins</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {wins.length === 0 && <div className="text-muted-foreground">No quick wins available.</div>}
        {wins.slice(0, 8).map((w) => (
          <div key={w.id} className="flex items-center justify-between border-b pb-1">
            <div className="truncate">{w.title}</div>
            <Badge>+{w.estimatedImpact}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
