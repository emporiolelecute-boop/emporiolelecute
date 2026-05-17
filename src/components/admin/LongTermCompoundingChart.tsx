import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function LongTermCompoundingChart({ compounding, durability, sustainability }: { compounding: number; durability: number; sustainability: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Long-Term Compounding</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-4xl font-bold">{compounding}</div>
        <Progress value={compounding} />
        <div className="flex justify-between"><span className="text-muted-foreground">Durabilidade</span><b>{durability}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Sustentabilidade</span><b>{sustainability}</b></div>
      </CardContent>
    </Card>
  );
}
