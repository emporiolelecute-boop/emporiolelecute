import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default function CircularReasoningAlert({ risk }: { risk: number }) {
  const level = risk >= 60 ? "critical" : risk >= 35 ? "watch" : "clear";
  const variant: "destructive" | "secondary" | "outline" =
    level === "critical" ? "destructive" : level === "watch" ? "secondary" : "outline";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Circular Reasoning</span>
          <Badge variant={variant}>{level}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="text-3xl font-semibold">{risk}<span className="text-base text-muted-foreground">/100</span></div>
        <p className="text-muted-foreground">
          Detects logical loops where engines reinforce their own conclusions without external validation.
        </p>
      </CardContent>
    </Card>
  );
}
