import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { collapse: number; entropy: number; fragmentation: number; conflicts: number; blockers: string[] }
export default function GovernanceCollapseRiskCard(p: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Governance Collapse Risk</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-3xl font-bold">{p.collapse}</div>
        <p><span className="text-muted-foreground">Entropy:</span> {p.entropy}</p>
        <p><span className="text-muted-foreground">Fragmentation:</span> {p.fragmentation}</p>
        <p><span className="text-muted-foreground">Conflicts:</span> {p.conflicts}</p>
        {p.blockers.length > 0 && (
          <ul className="pt-2 border-t mt-2">
            {p.blockers.map((b, i) => <li key={i}>• {b}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
