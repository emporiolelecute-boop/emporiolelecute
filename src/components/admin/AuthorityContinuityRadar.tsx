import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { authority: number; longevity: number; persistence: number; instabilities: string[]; }
export default function AuthorityContinuityRadar({ authority, longevity, persistence, instabilities }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Authority Continuity</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="text-4xl font-bold">{authority}</div>
        <p><span className="text-muted-foreground">Longevity:</span> {longevity}</p>
        <p><span className="text-muted-foreground">Persistence:</span> {persistence}</p>
        {instabilities.length > 0 && (
          <ul className="mt-2">{instabilities.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
