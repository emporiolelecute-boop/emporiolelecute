import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Props { unification: number; harmony: number; alignment: number; resilience: number; }
export default function NexusSynchronizationTimeline({ unification, harmony, alignment, resilience }: Props) {
  const items = [
    { label: "Unification", v: unification },
    { label: "Harmony", v: harmony },
    { label: "Alignment", v: alignment },
    { label: "Resilience", v: resilience },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Nexus Synchronization</CardTitle></CardHeader>
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
