import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookMarked } from "lucide-react";

interface Playbook { id: string; name: string; cadence: "weekly" | "monthly" | "quarterly"; steps: string[] }
interface Props { playbooks: Playbook[] }

export function OperationalPlaybookPanel({ playbooks }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-primary" /> Operational Playbooks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {playbooks.map((p) => (
          <div key={p.id} className="border-l-2 border-primary/30 pl-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{p.name}</span>
              <Badge variant="secondary" className="text-[10px]">{p.cadence}</Badge>
            </div>
            <ul className="mt-1 text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
              {p.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
