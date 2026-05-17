import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { priorities: string[]; actions: string[] }
export default function ExecutivePriorityMatrix({ priorities, actions }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Executive Priorities & Actions</CardTitle></CardHeader>
      <CardContent className="text-sm grid md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Priorities</p>
          <ul>{priorities.map((p, i) => <li key={i}>• {p}</li>)}</ul>
        </div>
        <div>
          <p className="font-medium">Actions</p>
          <ul>{actions.map((a, i) => <li key={i}>• {a}</li>)}</ul>
        </div>
      </CardContent>
    </Card>
  );
}
