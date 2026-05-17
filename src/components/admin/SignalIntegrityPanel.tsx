import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { clarity: number; trust: number; strength: number; pollution: number; noises: string[]; }
export default function SignalIntegrityPanel({ clarity, trust, strength, pollution, noises }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Signal Integrity</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-4xl font-bold">{clarity}</div>
        <p><span className="text-muted-foreground">Trustworthiness:</span> {trust}</p>
        <p><span className="text-muted-foreground">Decision Signal Strength:</span> {strength}</p>
        <p><span className="text-muted-foreground">Signal Pollution:</span> {pollution}</p>
        {noises.length > 0 && (
          <ul className="mt-2 space-y-0.5">{noises.map((n, i) => <li key={i}>• {n}</li>)}</ul>
        )}
      </CardContent>
    </Card>
  );
}
