import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecoveryPersistencePanel({ persistence, capacity, continuity, intelligence }: { persistence: number; capacity: number; continuity: number; intelligence: number }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Recovery Persistence</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{persistence}</div>
        <div className="flex justify-between"><span className="text-muted-foreground">Capacidade</span><b>{capacity}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Continuidade</span><b>{continuity}</b></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Inteligência</span><b>{intelligence}</b></div>
      </CardContent>
    </Card>
  );
}
