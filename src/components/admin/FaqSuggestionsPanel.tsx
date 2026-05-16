/**
 * Fase 11.2 — FAQ Suggestions Panel (assistido).
 *
 * Apenas sugere. Nada é salvo automaticamente.
 */
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { buildFaqSuggestions, type BriefEntityInput } from "@/lib/editorialBriefs";
import { useToast } from "@/hooks/use-toast";

interface Props {
  entity: BriefEntityInput;
  onPick?: (question: string) => void;
}

export default function FaqSuggestionsPanel({ entity, onPick }: Props) {
  const { toast } = useToast();
  const suggestions = useMemo(() => buildFaqSuggestions(entity), [entity]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Pergunta copiada para área de transferência." });
  };

  return (
    <Card className="p-4 space-y-3">
      <div>
        <h3 className="font-semibold text-sm">FAQs sugeridas (assistido)</h3>
        <p className="text-xs text-muted-foreground">
          Até 8 sugestões. Revise, edite e adicione manualmente.
        </p>
      </div>
      <ul className="space-y-2">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-2 border rounded-md p-3">
            <Badge variant={s.impact === "high" ? "default" : "secondary"} className="shrink-0">
              {s.impact}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{s.question}</p>
              <p className="text-xs text-muted-foreground">{s.rationale}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => copy(s.question)} title="Copiar">
                <Copy className="h-3.5 w-3.5" />
              </Button>
              {onPick && (
                <Button variant="outline" size="sm" onClick={() => onPick(s.question)}>
                  Usar
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
