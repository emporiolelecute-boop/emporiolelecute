// Fase 8 — Governança de tags. Detecta tags fracas/duplicadas — apenas sugere.
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, AlertTriangle } from 'lucide-react';

interface TagRow {
  id: string;
  name: string;
  slug: string;
  count: number;
}

const GENERIC_TAGS = new Set([
  'lembrancinha', 'lembrancinhas', 'casamento', 'sabonete', 'sabonetes', 'maternidade', 'cha', 'festa', 'presente',
]);

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  // Jaccard de bigrams — suficiente como heurística de duplicidade.
  const bigrams = (s: string) => {
    const out = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
    return out;
  };
  const A = bigrams(a), B = bigrams(b);
  let inter = 0;
  A.forEach((g) => { if (B.has(g)) inter++; });
  return inter / (A.size + B.size - inter || 1);
}

const TagGovernancePanel = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['tag-governance'],
    staleTime: 60_000,
    queryFn: async (): Promise<TagRow[]> => {
      const [{ data: tgs }, { data: links }] = await Promise.all([
        supabase.from('tags').select('id, name, slug'),
        supabase.from('product_tags').select('tag_id'),
      ]);
      const map = new Map<string, number>();
      for (const r of links ?? []) map.set(r.tag_id, (map.get(r.tag_id) ?? 0) + 1);
      return (tgs ?? []).map((t: any) => ({ id: t.id, name: t.name, slug: t.slug, count: map.get(t.id) ?? 0 }));
    },
  });

  const buckets = useMemo(() => {
    const unused: TagRow[] = [];
    const single: TagRow[] = [];
    const generic: TagRow[] = [];
    const duplicates: Array<{ a: TagRow; b: TagRow; sim: number }> = [];
    const rows = data ?? [];
    for (const r of rows) {
      if (r.count === 0) unused.push(r);
      else if (r.count === 1) single.push(r);
      if (GENERIC_TAGS.has(r.slug)) generic.push(r);
    }
    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        const s = similarity(rows[i].slug, rows[j].slug);
        if (s >= 0.7) duplicates.push({ a: rows[i], b: rows[j], sim: s });
      }
    }
    duplicates.sort((x, y) => y.sim - x.sim);
    return { unused, single, generic, duplicates: duplicates.slice(0, 20) };
  }, [data]);

  const Section = ({ title, items, render }: { title: string; items: any[]; render: (i: any, idx: number) => React.ReactNode }) => (
    <div>
      <p className="text-sm font-semibold mb-1.5">{title} <span className="text-muted-foreground font-normal">({items.length})</span></p>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nada a sinalizar.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">{items.map(render)}</div>
      )}
    </div>
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" /> Governança de Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Carregando…</p>
        ) : (
          <>
            <div className="flex items-start gap-2 rounded-md border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Sugestões — nada é executado automaticamente. Use a página{' '}
                <Link to="/admin/tags" className="underline">/admin/tags</Link> para revisar.
              </span>
            </div>

            <Section
              title="Sem uso"
              items={buckets.unused}
              render={(t: TagRow) => (
                <span key={t.id} className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">{t.name}</span>
              )}
            />
            <Section
              title="Apenas 1 produto"
              items={buckets.single}
              render={(t: TagRow) => (
                <span key={t.id} className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{t.name}</span>
              )}
            />
            <Section
              title="Tags genéricas (revisar)"
              items={buckets.generic}
              render={(t: TagRow) => (
                <span key={t.id} className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">{t.name}</span>
              )}
            />
            <Section
              title="Possíveis duplicatas"
              items={buckets.duplicates}
              render={(d, idx) => (
                <span key={idx} className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                  {d.a.name} ↔ {d.b.name} ({Math.round(d.sim * 100)}%)
                </span>
              )}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TagGovernancePanel;
