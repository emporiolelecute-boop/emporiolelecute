import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, EyeOff, ImageOff, FileQuestion, Link2Off } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDbCategories, useDbOccasions } from '@/hooks/useProducts';
import { useSegments } from '@/hooks/useSegments';
import { useTags } from '@/hooks/useTags';
import { evaluateSeo, hasAnyIssue, TAXONOMY_LABELS, TaxonomyEntity, TaxonomyKind } from '@/lib/taxonomy';

type CountMap = Record<string, number>;

const AdminTaxonomiesHealth = () => {
  const cats = useDbCategories();
  const occs = useDbOccasions();
  const segs = useSegments();
  const tagsQ = useTags();

  const [productCounts, setProductCounts] = useState<{
    categoria: CountMap; ocasiao: CountMap; segmento: CountMap; tag: CountMap;
  }>({ categoria: {}, ocasiao: {}, segmento: {}, tag: {} });

  useEffect(() => {
    (async () => {
      const [pc, po, ps, pt] = await Promise.all([
        supabase.from('products').select('category_id').eq('is_active', true),
        supabase.from('product_occasions').select('occasion_id'),
        supabase.from('product_segments').select('segment_id'),
        supabase.from('product_tags').select('tag_id'),
      ]);
      const reduce = <T extends string>(rows: { [k in T]: string | null }[] | null, key: T): CountMap => {
        const m: CountMap = {};
        (rows ?? []).forEach((r) => {
          const k = r[key];
          if (k) m[k] = (m[k] ?? 0) + 1;
        });
        return m;
      };
      setProductCounts({
        categoria: reduce(pc.data as { category_id: string | null }[] | null, 'category_id'),
        ocasiao:   reduce(po.data as { occasion_id: string | null }[] | null, 'occasion_id'),
        segmento:  reduce(ps.data as { segment_id: string | null }[] | null, 'segment_id'),
        tag:       reduce(pt.data as { tag_id: string | null }[] | null, 'tag_id'),
      });
    })();
  }, []);

  const summary = useMemo(() => {
    const build = (kind: TaxonomyKind, items: TaxonomyEntity[], hasSeo: boolean) => {
      const counts = productCounts[kind];
      let noSeo = 0, noImage = 0, noDesc = 0, notIndexed = 0, orphans = 0;
      items.forEach((i) => {
        if (hasSeo) {
          const e = evaluateSeo(i);
          if (hasAnyIssue(e)) noSeo++;
          if (e.noImage) noImage++;
          if (e.noDescription) noDesc++;
          if (e.notIndexed) notIndexed++;
        }
        if ((counts[i.id] ?? 0) === 0) orphans++;
      });
      return { total: items.length, noSeo, noImage, noDesc, notIndexed, orphans };
    };
    return {
      categoria: build('categoria', (cats.data ?? []) as TaxonomyEntity[], true),
      ocasiao:   build('ocasiao',   (occs.data ?? []) as TaxonomyEntity[], true),
      segmento:  build('segmento',  (segs.data ?? []) as TaxonomyEntity[], true),
      tag:       build('tag',       (tagsQ.data ?? []) as TaxonomyEntity[], false),
    };
  }, [cats.data, occs.data, segs.data, tagsQ.data, productCounts]);

  const allKinds: TaxonomyKind[] = ['categoria', 'ocasiao', 'segmento', 'tag'];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Healthcheck de Taxonomias</h1>
          <p className="text-muted-foreground mt-1">Auditoria operacional rápida do estado SEO e vínculos.</p>
        </div>
        <Link to="/admin/taxonomias">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allKinds.map((k) => {
          const s = summary[k];
          return (
            <Card key={k}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{TAXONOMY_LABELS[k].plural}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-display">{s.total}</p>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {k !== 'tag' && s.noSeo > 0 && (
                    <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300 gap-1">
                      <AlertTriangle className="w-3 h-3" /> SEO: {s.noSeo}
                    </Badge>
                  )}
                  {k !== 'tag' && s.noImage > 0 && (
                    <Badge variant="outline" className="gap-1"><ImageOff className="w-3 h-3" /> sem img: {s.noImage}</Badge>
                  )}
                  {k !== 'tag' && s.noDesc > 0 && (
                    <Badge variant="outline" className="gap-1"><FileQuestion className="w-3 h-3" /> sem desc: {s.noDesc}</Badge>
                  )}
                  {k !== 'tag' && s.notIndexed > 0 && (
                    <Badge variant="outline" className="gap-1"><EyeOff className="w-3 h-3" /> noindex: {s.notIndexed}</Badge>
                  )}
                  {s.orphans > 0 && (
                    <Badge variant="outline" className="gap-1"><Link2Off className="w-3 h-3" /> órfãos: {s.orphans}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {allKinds.map((k) => {
        const items = (
          k === 'categoria' ? cats.data : k === 'ocasiao' ? occs.data : k === 'segmento' ? segs.data : tagsQ.data
        ) as TaxonomyEntity[] | undefined;
        const counts = productCounts[k];
        const problems = (items ?? []).filter((i) => {
          const orphan = (counts[i.id] ?? 0) === 0;
          if (k === 'tag') return orphan;
          return hasAnyIssue(evaluateSeo(i)) || orphan;
        });
        if (problems.length === 0) return null;
        return (
          <Card key={k}>
            <CardHeader>
              <CardTitle className="text-base">
                {TAXONOMY_LABELS[k].plural} — itens com pendências ({problems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {problems.map((i) => {
                  const orphan = (counts[i.id] ?? 0) === 0;
                  const seo = k !== 'tag' ? evaluateSeo(i) : null;
                  return (
                    <li key={i.id} className="py-2 flex flex-wrap items-center gap-2">
                      <span className="font-medium">{i.name}</span>
                      <span className="text-xs text-muted-foreground">{TAXONOMY_LABELS[k].urlPrefix}{i.slug}</span>
                      <span className="text-xs text-muted-foreground">· {counts[i.id] ?? 0} produto(s)</span>
                      {orphan && <Badge variant="outline" className="text-xs">órfão</Badge>}
                      {seo?.notIndexed && <Badge variant="outline" className="text-xs">noindex</Badge>}
                      {seo?.noMetaTitle && <Badge variant="outline" className="text-xs">sem meta_title</Badge>}
                      {seo?.noMetaDescription && <Badge variant="outline" className="text-xs">sem meta_description</Badge>}
                      {seo?.noImage && <Badge variant="outline" className="text-xs">sem imagem</Badge>}
                      {seo?.noDescription && <Badge variant="outline" className="text-xs">sem descrição</Badge>}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminTaxonomiesHealth;
