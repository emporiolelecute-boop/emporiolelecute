import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default function StabilityBreakAlert({ breaks }: { breaks: string[] }) {
  const level = breaks.length >= 3 ? "critical" : breaks.length >= 1 ? "watch" : "clear";
  const variant: "destructive" | "secondary" | "outline" =
    level === "critical" ? "destructive" : level === "watch" ? "secondary" : "outline";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Stability Breaks</span>
          <Badge variant={variant}>{level}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {breaks.length === 0 ? (
          <p className="text-muted-foreground">No structural breaks detected.</p>
        ) : (
          <ul className="space-y-1">
            {breaks.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <Badge variant="destructive">{b}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
