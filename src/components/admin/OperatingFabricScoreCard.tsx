import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { FabricVerdict } from "@/lib/strategicOperatingFabric";

const tone: Record<FabricVerdict, string> = {
  ASCENDED: "bg-emerald-600 text-white",
  OPTIMIZED: "bg-emerald-500 text-white",
  STABLE: "bg-blue-500 text-white",
  STRESSED: "bg-amber-500 text-black",
  FRACTURED: "bg-orange-600 text-white",
  COLLAPSING: "bg-red-600 text-white",
};

export default function OperatingFabricScoreCard({
  score,
  verdict,
}: { score: number; verdict: FabricVerdict }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Operating Fabric</CardTitle>
        <Badge className={tone[verdict]}>{verdict}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{score}</div>
        <Progress value={score} className="mt-3" />
      </CardContent>
    </Card>
  );
}
