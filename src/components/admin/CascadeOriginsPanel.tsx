import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CascadeOriginsPanel({ origins }: { origins: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Origens de Cascata</CardTitle></CardHeader>
      <CardContent>
        {origins.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma origem em cascata detectada.</p>
        ) : (
          <ul className="space-y-1 text-sm font-mono">
            {origins.map((o, i) => <li key={i}>• {o}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
