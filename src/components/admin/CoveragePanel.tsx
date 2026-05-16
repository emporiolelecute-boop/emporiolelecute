// Fase 8 — Cobertura de catálogo por taxonomia.
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass } from 'lucide-react';

interface CoverageRow {
  kind: 'categoria' | 'ocasiao' | 'segmento' | 'tag';
  label: string;
  slug: string;
  count: number;
}

const empty = (k: number) => k === 0;
const concentrationLimit = 0.4;

const CoveragePanel = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['coverage-taxonomy'],
    staleTime: 60_000,
    queryFn: async (): Promise<CoverageRow[]> => {
      const [cats, occs, segs, tgs, prodCats, occLinks, segLinks, tagLinks] = await Promise.all([
        supabase.from('categories').select('id, name, slug'),
        supabase.from('occasions').select('id, name, slug'),
        supabase.from('segments').select('id, name, slug'),
        supabase.from('tags').select('id, name, slug'),
        supabase.from('products').select('id, category_id').eq('is_active', true).limit(2000),
        supabase.from('product_occasions').select('occasion_id'),
        supabase.from('product_segments').select('segment_id'),
        supabase.from('product_tags').select('tag_id'),
      ]);

      const countBy = (arr: any[] | null, key: string) => {
        const map = new Map<string, number>();
        for (const r of arr ?? []) {
          const k = r[key];
          if (!k) continue;
          map.set(k, (map.get(k) ?? 0) + 1);
        }
        return map;
      };

      const catCount = countBy(prodCats.data, 'category_id');
      const occCount = countBy(occLinks.data, 'occasion_id');
      const segCount = countBy(segLinks.data, 'segment_id');
      const tagCount = countBy(tagLinks.data, 'tag_id');

      const rows: CoverageRow[] = [
        ...(cats.data ?? []).map((c: any) => ({ kind: 'categoria' as const, label: c.name, slug: c.slug, count: catCount.get(c.id) ?? 0 })),
        ...(occs.data ?? []).map((o: any) => ({ kind: 'ocasiao' as const, label: o.name, slug: o.slug, count: occCount.get(o.id) ?? 0 })),
        ...(segs.data ?? []).map((s: any) => ({ kind: 'segmento' as const, label: s.name, slug: s.slug, count: segCount.get(s.id) ?? 0 })),
        ...(tgs.data ?? []).map((t: any) => ({ kind: 'tag' as const, label: t.name, slug: t.slug, count: tagCount.get(t.id) ?? 0 })),
      ];
      return rows;
    },
  });

  const grouped = useMemo(() => {
    const byKind: Record<CoverageRow['kind'], CoverageRow[]> = {
      categoria: [], ocasiao: [], segmento: [], tag: [],
    };
    for (const r of data ?? []) byKind[r.kind].push(r);
    for (const k of Object.keys(byKind) as CoverageRow['kind'][]) {
      byKind[k].sort((a, b) => b.count - a.count);
    }
    return byKind;
  }, [data]);

  const KIND_LABEL: Record<CoverageRow['kind'], string> = {
    categoria: 'Categorias', ocasiao: 'Ocasiões', segmento: 'Segmentos', tag: 'Tags',
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" /> Cobertura de Catálogo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Carregando…</p>
        ) : (
          (Object.keys(grouped) as CoverageRow['kind'][]).map((kind) => {
            const rows = grouped[kind];
            const total = rows.reduce((s, r) => s + r.count, 0);
            const max = rows[0]?.count ?? 0;
            const concentrated = total > 0 && max / total >= concentrationLimit ? rows[0] : null;
            const emptyOnes = rows.filter((r) => empty(r.count));
            return (
              <div key={kind}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">{KIND_LABEL[kind]}</p>
                  <p className="text-[11px] text-muted-foreground">{rows.length} itens · {total} vínculos</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {rows.slice(0, 24).map((r) => (
                    <span
                      key={`${kind}-${r.slug}`}
                      title={`${r.label}: ${r.count} produto(s)`}
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        r.count === 0
                          ? 'bg-rose-100 text-rose-700'
                          : r.count < 3
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {r.label} · {r.count}
                    </span>
                  ))}
                  {rows.length > 24 && (
                    <span className="text-[11px] text-muted-foreground">+{rows.length - 24}</span>
                  )}
                </div>
                {(concentrated || emptyOnes.length > 0) && (
                  <div className="mt-2 text-[11px] text-muted-foreground space-y-0.5">
                    {concentrated && (
                      <p>⚠️ Concentração alta em “{concentrated.label}” ({Math.round((concentrated.count / total) * 100)}%).</p>
                    )}
                    {emptyOnes.length > 0 && (
                      <p>{emptyOnes.length} sem produtos: oportunidades editoriais.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default CoveragePanel;
