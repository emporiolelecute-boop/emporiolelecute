import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategicPriorityPanel({ items }: { items: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Strategic Priorities</CardTitle></CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem prioridades destacadas.</p>
        ) : (
          <ol className="list-decimal pl-5 text-sm space-y-1">
            {items.map((i) => <li key={i}>{i}</li>)}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
