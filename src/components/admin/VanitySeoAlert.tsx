import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function VanitySeoAlert({ vanity, lowLeverage }: { vanity: string[]; lowLeverage: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" /> Vanity SEO Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <Section title={`Vanity metrics (${vanity.length})`} items={vanity} empty="None detected." />
        <Section title={`Low-leverage work (${lowLeverage.length})`} items={lowLeverage} empty="None detected." />
      </CardContent>
    </Card>
  );
}
function Section({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div>
      <div className="font-medium mb-1">{title}</div>
      {items.length ? (
        <ul className="list-disc pl-5 space-y-0.5 text-muted-foreground">
          {items.map((m) => <li key={m}>{m}</li>)}
        </ul>
      ) : <p className="text-muted-foreground">{empty}</p>}
    </div>
  );
}
