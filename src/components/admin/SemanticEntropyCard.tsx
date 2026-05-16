import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function SemanticEntropyCard({ entropy, balance }: { entropy: number; balance: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Entropia Semântica</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1"><span>Entropia</span><span>{entropy}</span></div>
          <Progress value={entropy} />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span>Balanço</span><span>{balance}</span></div>
          <Progress value={balance} />
        </div>
        <p className="text-xs text-muted-foreground">
          Quanto maior, mais distribuída é a autoridade entre clusters.
        </p>
      </CardContent>
    </Card>
  );
}
