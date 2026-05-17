import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { clarity: number; transparency: number; legibility: number; noise: number; fog: number; }
export default function SystemicClarityMap({ clarity, transparency, legibility, noise, fog }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Systemic Clarity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{clarity}</div>
        <p><span className="text-muted-foreground">Operational Transparency:</span> {transparency}</p>
        <p><span className="text-muted-foreground">Decision Legibility:</span> {legibility}</p>
        <p><span className="text-muted-foreground">Strategic Noise:</span> {noise}</p>
        <p><span className="text-muted-foreground">Semantic Fog:</span> {fog}</p>
      </CardContent>
    </Card>
  );
}
