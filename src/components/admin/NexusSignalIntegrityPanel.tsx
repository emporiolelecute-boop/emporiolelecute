import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function NexusSignalIntegrityPanel({
  score, confidence, noise, dilution, contradictions,
}: { score: number; confidence: string; noise: number; dilution: number; contradictions: number; }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Signal Integrity <Badge variant="outline">{confidence}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="flex justify-between mb-1"><span>Integrity</span><span>{score}/100</span></div>
          <Progress value={score} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Noise</span><span>{noise}</span></div>
          <Progress value={noise} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Dilution</span><span>{dilution}</span></div>
          <Progress value={dilution} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Contradictions</span><span>{contradictions}</span></div>
          <Progress value={contradictions} />
        </div>
      </CardContent>
    </Card>
  );
}
