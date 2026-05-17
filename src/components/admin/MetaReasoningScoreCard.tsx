import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  score: number;
  verdict: string;
  drivers: string[];
}

export default function MetaReasoningScoreCard({ score, verdict, drivers }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Meta Reasoning</span>
          <Badge variant="outline">{verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-4xl font-bold">{score}</div>
        <p className="text-xs text-muted-foreground">
          Qualidade do raciocínio sistêmico consolidado.
        </p>
        {drivers.length > 0 && (
          <ul className="text-sm space-y-1 pt-2">
            {drivers.map((d, i) => <li key={i}>• {d}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
