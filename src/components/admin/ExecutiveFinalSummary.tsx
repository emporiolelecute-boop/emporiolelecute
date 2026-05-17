import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExecutiveFinalSummary({ confidence, narrative, roadmap }: {
  confidence: number; narrative: string; roadmap: string[];
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Final Summary</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">{confidence}</span>
          <span className="text-xs text-muted-foreground">Finalization confidence</span>
        </div>
        <p className="text-muted-foreground">{narrative}</p>
        {roadmap.length > 0 && (
          <div>
            <p className="font-medium mb-1">Roadmap de simplificação</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              {roadmap.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
