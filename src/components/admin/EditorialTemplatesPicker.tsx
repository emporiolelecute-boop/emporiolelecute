// Fase 8 — Picker de templates editoriais. Nunca aplica automaticamente sem clique.
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ClipboardCopy } from 'lucide-react';
import { findEditorialTemplates, fillTemplate, EDITORIAL_TEMPLATES } from '@/lib/editorialTemplates';
import { useToast } from '@/hooks/use-toast';

interface Props {
  categorySlug?: string | null;
  occasionSlugs?: string[];
  productName?: string;
  /** Callback opcional: insere o snippet no campo editorial. */
  onInsert?: (text: string) => void;
}

const EditorialTemplatesPicker = ({ categorySlug, occasionSlugs, productName, onInsert }: Props) => {
  const { toast } = useToast();
  const [showAll, setShowAll] = useState(false);

  const groups = useMemo(() => {
    const compat = findEditorialTemplates({ categorySlug, occasionSlugs });
    if (showAll) return EDITORIAL_TEMPLATES;
    return compat.length ? compat : EDITORIAL_TEMPLATES;
  }, [categorySlug, occasionSlugs, showAll]);

  const handleInsert = (body: string) => {
    const filled = fillTemplate(body, {
      produto: productName || '',
      ocasiao: occasionSlugs?.[0]?.replace(/-/g, ' ') || '',
    });
    if (onInsert) {
      onInsert(filled);
      toast({ title: 'Snippet inserido no editorial' });
    } else {
      navigator.clipboard?.writeText(filled);
      toast({ title: 'Snippet copiado' });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Templates editoriais
        </CardTitle>
        <Button type="button" size="sm" variant="outline" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Apenas compatíveis' : 'Ver todos'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Snippets sugeridos como ponto de partida. Edite à mão antes de publicar.
        </p>
        {groups.map((group) => (
          <div key={`${group.scope}-${group.slug}`} className="space-y-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
              {group.scope === 'category' ? 'Categoria' : 'Ocasião'}: {group.label}
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {group.templates.map((t) => (
                <div key={t.key} className="rounded-md border border-border bg-card p-3 flex flex-col gap-2">
                  <p className="text-sm font-medium">{t.label}</p>
                  {t.hint && <p className="text-[11px] text-muted-foreground">{t.hint}</p>}
                  <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-3">{t.body}</p>
                  <div className="flex gap-2 pt-1">
                    <Button type="button" size="sm" variant="default" onClick={() => handleInsert(t.body)}>
                      Inserir
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => {
                      navigator.clipboard?.writeText(t.body);
                      toast({ title: 'Snippet copiado' });
                    }}>
                      <ClipboardCopy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EditorialTemplatesPicker;
