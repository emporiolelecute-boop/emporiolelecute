// Fase 8 — Hints (sugestões) heurísticos de taxonomia. Nunca aplica automaticamente.
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { suggestTaxonomies, SuggestionInput, TaxonomySuggestion } from '@/lib/taxonomySuggestions';

interface Props extends SuggestionInput {
  /** Max de sugestões mostradas. */
  limit?: number;
}

const KIND_LABEL: Record<TaxonomySuggestion['kind'], string> = {
  tag: 'Tag',
  occasion: 'Ocasião',
  segment: 'Segmento',
  category: 'Categoria',
};

const KIND_CLS: Record<TaxonomySuggestion['kind'], string> = {
  tag: 'bg-violet-100 text-violet-700',
  occasion: 'bg-pink-100 text-pink-700',
  segment: 'bg-sky-100 text-sky-700',
  category: 'bg-amber-100 text-amber-700',
};

const TaxonomySuggestionsHints = ({ limit = 12, ...input }: Props) => {
  const suggestions = useMemo(() => suggestTaxonomies(input).slice(0, limit), [input, limit]);

  if (!suggestions.length) return null;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" /> Sugestões de taxonomia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Detectadas pelo conteúdo do produto. Use como guia — nada é aplicado automaticamente.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {suggestions.map((s) => (
            <span
              key={`${s.kind}:${s.slug}`}
              title={`Termos: ${s.matchedTerms.join(', ')} — confiança ${Math.round(s.confidence * 100)}%`}
              className={`text-[11px] px-2 py-0.5 rounded-full ${KIND_CLS[s.kind]}`}
            >
              {KIND_LABEL[s.kind]}: {s.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxonomySuggestionsHints;
