import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExecutiveNarrativeCard({ lines }: { lines: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Narrativa Executiva</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {lines.map((l, i) => <li key={i} className="leading-snug">{l}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
