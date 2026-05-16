import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OperationalDebtCard({ debt, breakdown }: { debt: number; breakdown: { label: string; value: number }[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Débito Operacional</CardTitle></CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{debt}</div>
        <Progress value={Math.min(100, debt)} className="my-3" />
        <div className="grid gap-1 text-sm">
          {breakdown.map((b) => (
            <div key={b.label} className="flex justify-between">
              <span className="text-muted-foreground">{b.label}</span>
              <span className="font-mono">{b.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
