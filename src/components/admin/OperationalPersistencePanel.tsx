import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { persistence: number; durability: number; longevity: number; decays: string[]; }
export default function OperationalPersistencePanel({ persistence, durability, longevity, decays }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Operational Persistence</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{persistence}</div>
        <p><span className="text-muted-foreground">Durability:</span> {durability}</p>
        <p><span className="text-muted-foreground">Longevity:</span> {longevity}</p>
        {decays.length > 0 && (
          <ul className="mt-2">{decays.map((d, i) => <li key={i}>• {d}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
