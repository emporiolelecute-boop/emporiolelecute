import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function NavigationEntropyPanel({
  entropy,
  fatigue,
  discoverability,
  groups,
}: {
  entropy: number;
  fatigue: number;
  discoverability: number;
  groups: { group: string; items: { label: string }[] }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Navigation Entropy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-xs text-muted-foreground">Entropy</div>
            <div className="text-2xl font-bold">{entropy}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Fatigue</div>
            <div className="text-2xl font-bold">{fatigue}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Discoverability</div>
            <div className="text-2xl font-bold">{discoverability}</div>
          </div>
        </div>
        <Progress value={discoverability} />
        <div className="space-y-1">
          {groups.map((g) => (
            <div key={g.group} className="flex justify-between">
              <span className="text-muted-foreground">{g.group}</span>
              <b>{g.items.length}</b>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
