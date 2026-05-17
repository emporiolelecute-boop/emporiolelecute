import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExecutionFocusMap({ actions, focusAreas }: { actions: string[]; focusAreas: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Execution Focus</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="font-medium mb-1">Ações principais</p>
          {actions.length ? (
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              {actions.map((a) => <li key={a}>{a}</li>)}
            </ul>
          ) : <p className="text-muted-foreground">Nenhuma ação alta-alavancagem.</p>}
        </div>
        <div>
          <p className="font-medium mb-1">Focar atenção em</p>
          {focusAreas.length ? (
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              {focusAreas.map((a) => <li key={a}>{a}</li>)}
            </ul>
          ) : <p className="text-muted-foreground">Sem áreas críticas.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
