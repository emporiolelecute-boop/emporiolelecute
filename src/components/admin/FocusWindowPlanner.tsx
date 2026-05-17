import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FocusWindow } from "@/lib/operationalRhythm";

export default function FocusWindowPlanner({ windows }: { windows: FocusWindow[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Focus Windows</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid gap-2 sm:grid-cols-3">
          {windows.map((w) => (
            <div key={w.label} className="border rounded p-3">
              <div className="flex justify-between">
                <span className="font-medium">{w.label}</span>
                <span>{w.focus_score}/100</span>
              </div>
              <div className="h-2 bg-muted rounded mt-2 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${w.focus_score}%` }} />
              </div>
              <ul className="mt-2 text-xs text-muted-foreground list-disc pl-4">
                {w.recommended_themes.map((t) => <li key={t}>{t}</li>)}
                {!w.recommended_themes.length && <li className="italic">No themes assigned.</li>}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
