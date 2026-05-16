/**
 * Fase 11.2 — Internal Link Planner (assistido).
 *
 * Mostra sugestões, links faltando, excesso e órfãos.
 * Não insere links automaticamente.
 */
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, EyeOff } from "lucide-react";
import { buildInternalLinkPlan, type BriefEntityInput } from "@/lib/editorialBriefs";
import { useToast } from "@/hooks/use-toast";

interface Props {
  entity: BriefEntityInput;
  currentLinks?: number;
  recommendedMax?: number;
  orphanHubs?: string[];
}

export default function InternalLinkPlanner({
  entity,
  currentLinks = 0,
  recommendedMax = 8,
  orphanHubs = [],
}: Props) {
  const { toast } = useToast();
  const suggested = useMemo(() => buildInternalLinkPlan(entity), [entity]);
  const [ignored, setIgnored] = useState<Set<string>>(new Set());

  const overlinking = currentLinks > recommendedMax;
  const missing = Math.max(0, 3 - currentLinks);

  const copy = (anchor: string, slug: string) => {
    const md = `[${anchor}](/${slug})`;
    navigator.clipboard.writeText(md);
    toast({ title: "Copiado", description: "Link em Markdown copiado." });
  };

  const visible = suggested.filter((s) => !ignored.has(s.targetSlug));

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm">Planejador de links internos (assistido)</h3>
          <p className="text-xs text-muted-foreground">
            {currentLinks} links atuais · recomendado até {recommendedMax}
          </p>
        </div>
        <div className="flex gap-1">
          {overlinking && <Badge variant="destructive">Overlinking</Badge>}
          {missing > 0 && <Badge variant="outline">Faltam {missing}</Badge>}
        </div>
      </div>

      <ul className="space-y-2">
        {visible.length === 0 && (
          <li className="text-xs text-muted-foreground italic">
            Sem novas sugestões — entidade já bem conectada.
          </li>
        )}
        {visible.map((s, i) => (
          <li key={i} className="flex items-center gap-2 border rounded-md p-2">
            <Badge variant="secondary" className="shrink-0">{s.targetType}</Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{s.anchor}</p>
              <p className="text-xs text-muted-foreground truncate">{s.reason}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => copy(s.anchor, s.targetSlug)} title="Copiar">
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" asChild title="Abrir preview">
              <a href={`/${s.targetSlug}`} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIgnored((prev) => new Set(prev).add(s.targetSlug))}
              title="Ignorar"
            >
              <EyeOff className="h-3.5 w-3.5" />
            </Button>
          </li>
        ))}
      </ul>

      {orphanHubs.length > 0 && (
        <div className="text-xs">
          <p className="font-medium mb-1">Hubs órfãos detectados:</p>
          <div className="flex flex-wrap gap-1">
            {orphanHubs.slice(0, 8).map((h) => (
              <Badge key={h} variant="outline">{h}</Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
