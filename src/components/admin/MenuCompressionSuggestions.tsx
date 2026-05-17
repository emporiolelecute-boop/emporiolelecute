import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MenuCompressionSuggestion } from "@/lib/navigationCompression";

export default function MenuCompressionSuggestions({
  suggestions,
}: {
  suggestions: MenuCompressionSuggestion[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Menu Compression Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {suggestions.length === 0 && (
          <div className="text-muted-foreground">Menu structure is already compact.</div>
        )}
        {suggestions.map((s, i) => (
          <div key={i} className="border-b pb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{s.group}</Badge>
              <Badge>{s.action}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.rationale}</div>
            <div className="text-xs mt-1 truncate">{s.items.join(", ")}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
