import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExecutiveNarrative } from "@/lib/executiveNarrativeEngine";

export default function ExecutiveNarrativePanel({ narrative }: { narrative: ExecutiveNarrative }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Narrative</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="font-medium">{narrative.summary}</p>
        {narrative.strengths.length > 0 && (
          <div><p className="text-muted-foreground">Strengths</p>
            <ul>{narrative.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul></div>
        )}
        {narrative.weaknesses.length > 0 && (
          <div><p className="text-muted-foreground">Weaknesses</p>
            <ul>{narrative.weaknesses.map((s, i) => <li key={i}>• {s}</li>)}</ul></div>
        )}
        {narrative.risks.length > 0 && (
          <div><p className="text-muted-foreground">Risks</p>
            <ul>{narrative.risks.map((s, i) => <li key={i}>• {s}</li>)}</ul></div>
        )}
      </CardContent>
    </Card>
  );
}
