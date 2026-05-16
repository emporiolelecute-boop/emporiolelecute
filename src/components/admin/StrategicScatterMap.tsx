import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategicScatterMap({ scatter, fragmentation, contradictions }: { scatter: number; fragmentation: number; contradictions: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Scatter</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex justify-between"><span className="text-muted-foreground">Scatter estratégico</span><b>{scatter}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Fragmentação</span><b>{fragmentation}</b></div>
        {contradictions.length > 0 && (
          <div>
            <p className="font-medium mt-2 mb-1">Contradições</p>
            <ul className="list-disc pl-5 text-muted-foreground">{contradictions.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
