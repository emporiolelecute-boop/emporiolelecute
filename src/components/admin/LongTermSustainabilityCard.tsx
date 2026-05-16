import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LongTermSustainabilityCard({
  sustainability, compounding, durability,
}: { sustainability: number; compounding: number; durability: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Long-Term Sustainability</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{sustainability}</div>
        <p className="text-xs text-muted-foreground">Sustentabilidade projetada</p>
        <div className="flex justify-between"><span className="text-muted-foreground">Compounding</span><b>{compounding}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Durabilidade</span><b>{durability}</b></div>
      </CardContent>
    </Card>
  );
}
