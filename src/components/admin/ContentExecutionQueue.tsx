import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContentExecutionItem } from "@/lib/executiveMode";

export default function ContentExecutionQueue({ items }: { items: ContentExecutionItem[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Content Execution Queue</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {items.length === 0 && <div className="text-muted-foreground">Queue empty.</div>}
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between border-b pb-1">
            <div className="truncate">{i.title}</div>
            <div className="flex gap-1">
              <Badge variant="outline">{i.type}</Badge>
              <Badge>{i.status}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
