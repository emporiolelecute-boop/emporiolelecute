import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PruningCandidate { id: string; kind: string; reason: string; confidence: number }

export default function ExecutivePruningMatrix({ candidates }: { candidates: PruningCandidate[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Pruning Matrix</CardTitle></CardHeader>
      <CardContent className="text-sm">
        {candidates.length === 0 ? (
          <p className="text-xs text-muted-foreground">No pruning candidates identified.</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="text-muted-foreground">
              <tr><th className="text-left font-normal">System</th><th className="text-left font-normal">Kind</th><th className="text-right font-normal">Confidence</th></tr>
            </thead>
            <tbody>
              {candidates.slice(0, 15).map((c) => (
                <tr key={c.id + c.kind} className="border-t">
                  <td className="py-1"><div className="font-medium truncate">{c.id}</div><div className="text-muted-foreground">{c.reason}</div></td>
                  <td><Badge variant="secondary">{c.kind}</Badge></td>
                  <td className="text-right font-bold">{c.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
