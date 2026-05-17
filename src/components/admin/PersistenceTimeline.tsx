import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { persistence: number; durability: number; longevity: number; continuity: number; }
export default function PersistenceTimeline({ persistence, durability, longevity, continuity }: Props) {
  const items = [
    { label: "Continuity", v: continuity },
    { label: "Persistence", v: persistence },
    { label: "Durability", v: durability },
    { label: "Longevity", v: longevity },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Persistence Timeline</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {items.map((it) => (
          <div key={it.label} className="text-sm">
            <div className="flex justify-between"><span>{it.label}</span><span className="font-medium">{it.v}</span></div>
            <div className="h-2 rounded bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${it.v}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
