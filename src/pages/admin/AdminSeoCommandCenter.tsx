/**
 * Fase 11.2 — SEO Command Center.
 *
 * Dashboard executivo. Cruza authority + editorial + gaps + linking
 * para mostrar KPIs, top opportunities, riscos e fila de execução.
 *
 * SAFE MODE: somente leitura.
 */
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, BarChart3, AlertTriangle, Map, ListChecks, Network } from "lucide-react";

import { buildExecutionBuckets, calculateEditorialMaturity, type EditorialTargetInput } from "@/lib/editorialPriorities";
import { buildGapBuckets, detectGaps, type GapEntityInput } from "@/lib/contentGapEngine";
import { buildSemanticExecutionPlan } from "@/lib/semanticOrchestrator";
import { computeTelemetry, type EditorialTelemetryInput } from "@/lib/seoTelemetry";
import type { IndexableEntity } from "@/lib/indexationGovernance";
import { evaluateAuthority } from "@/lib/authorityEngine";

function Kpi({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      </CardContent>
    </Card>
  );
}

export default function AdminSeoCommandCenter() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "seo-command", "v1"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [cats, occs, segs, themes, products, prodOcc, prodSeg, reviews, blog] = await Promise.all([
        supabase.from("categories").select("id, slug, name, description_seo, faqs, image_url"),
        supabase.from("occasions").select("id, slug, name, description_seo, faqs, image_url"),
        supabase.from("segments").select("id, slug, name, description_seo, faqs, image_url"),
        supabase.from("theme_hubs" as any).select("*"),
        supabase.from("products").select("id, category_id, slug, name, badge, long_description, editorial_content, images").eq("is_active", true),
        supabase.from("product_occasions").select("occasion_id, product_id"),
        supabase.from("product_segments").select("segment_id, product_id"),
        supabase.from("product_reviews").select("product_id").eq("is_visible", true),
        supabase.from("blog_posts").select("id, related_categories, related_occasions, related_segments, related_themes").eq("is_published", true),
      ]);
      return {
        cats: cats.data || [],
        occs: occs.data || [],
        segs: segs.data || [],
        themes: (themes.data || []) as any[],
        products: products.data || [],
        prodOcc: prodOcc.data || [],
        prodSeg: prodSeg.data || [],
        reviews: reviews.data || [],
        blog: blog.data || [],
      };
    },
  });

  const computed = useMemo(() => {
    if (!data) return null;
    const reviewByProduct = new Map<string, number>();
    data.reviews.forEach((r: any) => reviewByProduct.set(r.product_id, (reviewByProduct.get(r.product_id) || 0) + 1));

    const byCat = new Map<string, string[]>();
    data.products.forEach((p: any) => {
      if (!p.category_id) return;
      const a = byCat.get(p.category_id) || []; a.push(p.id); byCat.set(p.category_id, a);
    });
    const byOcc = new Map<string, string[]>();
    data.prodOcc.forEach((r: any) => { const a = byOcc.get(r.occasion_id) || []; a.push(r.product_id); byOcc.set(r.occasion_id, a); });
    const bySeg = new Map<string, string[]>();
    data.prodSeg.forEach((r: any) => { const a = bySeg.get(r.segment_id) || []; a.push(r.product_id); bySeg.set(r.segment_id, a); });

    const blogFor = (kind: "category" | "occasion" | "segment" | "theme", id: string) =>
      data.blog.filter((p: any) => {
        const arr =
          kind === "category" ? p.related_categories :
          kind === "occasion" ? p.related_occasions :
          kind === "segment"  ? p.related_segments :
          p.related_themes;
        return Array.isArray(arr) && arr.includes(id);
      }).length;

    const reviewsFor = (ids: string[]) => ids.reduce((acc, pid) => acc + (reviewByProduct.get(pid) || 0), 0);

    const editorialInputs: EditorialTargetInput[] = [];
    const gapInputs: GapEntityInput[] = [];
    const indexEntities: IndexableEntity[] = [];
    const maturities: number[] = [];
    const themeMaturities: number[] = [];
    const semanticCoverages: number[] = [];
    let faqCount = 0;
    let reviewCount = 0;

    const pushTax = (
      type: "category" | "occasion" | "segment",
      rows: any[],
      idMap: Map<string, string[]>,
    ) => {
      rows.forEach((r) => {
        const productIds = idMap.get(r.id) || [];
        const faqs = Array.isArray(r.faqs) ? r.faqs : [];
        const editorialLength = (r.description_seo || "").length;
        const reviewsC = reviewsFor(productIds);
        const blogC = blogFor(type, r.id);
        const auth = evaluateAuthority({
          productsCount: productIds.length,
          occasionsCount: type === "occasion" ? 1 : 0,
          segmentsCount: type === "segment" ? 1 : 0,
          categoriesCount: type === "category" ? 1 : 0,
          tagsCount: 0,
          reviewsCount: reviewsC,
          hasEditorial: editorialLength >= 300,
          goodImagesCount: 0,
          visualDiversity: 0.3,
          blogPostsCount: blogC,
          relatedContentCount: 0,
          internalLinksCount: faqs.length + 2,
        });
        editorialInputs.push({
          type,
          slug: r.slug,
          name: r.name,
          editorialLength,
          hasFaq: faqs.length > 0,
          hasMeta: true,
          hasHeroImage: !!r.image_url,
          signals: {
            productsCount: productIds.length, occasionsCount: type === "occasion" ? 1 : 0,
            segmentsCount: type === "segment" ? 1 : 0, categoriesCount: type === "category" ? 1 : 0,
            tagsCount: 0, reviewsCount: reviewsC, hasEditorial: editorialLength >= 300,
            goodImagesCount: 0, visualDiversity: 0.3, blogPostsCount: blogC,
            relatedContentCount: 0, internalLinksCount: faqs.length + 2,
          },
        });
        gapInputs.push({
          entityType: type, slug: r.slug, name: r.name,
          authority: auth.authority, productsCount: productIds.length,
          blogPostsCount: blogC, faqCount: faqs.length,
          internalLinksCount: faqs.length, reviewsCount: reviewsC,
          editorialLength, hasEditorial: editorialLength >= 300, approved: true,
        });
        const mat = calculateEditorialMaturity({
          authority: auth.authority, topicalCoverage: auth.topicalCoverage,
          productsCount: productIds.length, reviewsCount: reviewsC,
          internalLinksCount: faqs.length, editorialLength, faqCount: faqs.length,
          blogPostsCount: blogC, taxonomyDiversity: 1,
        });
        maturities.push(mat.score);
        semanticCoverages.push(auth.topicalCoverage);
        if (faqs.length > 0) faqCount++;
        if (reviewsC > 0) reviewCount++;
        indexEntities.push({
          slug: r.slug, approved: true,
          authority_score: auth.authority, readiness_score: Math.round(auth.authority * 0.6 + auth.topicalCoverage * 0.4),
          topical_coverage: auth.topicalCoverage, thin_content_risk: auth.thinContentRisk,
          internal_links_count: faqs.length, products_count: productIds.length,
          editorial_length: editorialLength, faq_count: faqs.length,
        });
      });
    };

    pushTax("category", data.cats, byCat);
    pushTax("occasion", data.occs, byOcc);
    pushTax("segment", data.segs, bySeg);

    data.themes.forEach((t: any) => {
      const faqs = Array.isArray(t.faqs) ? t.faqs : [];
      const editorialLength = (t.editorial_content || "").length;
      themeMaturities.push(Math.round((t.authority_score || 0) * 0.7 + (editorialLength / 12)));
      if (faqs.length > 0) faqCount++;
      indexEntities.push({
        slug: t.slug, approved: !!t.is_approved,
        is_indexed: !!t.is_indexed,
        authority_score: t.authority_score || 0,
        readiness_score: t.readiness_score || 0,
        topical_coverage: t.topical_coverage || 0,
        thin_content_risk: !!t.thin_content_risk,
        cannibalization_risk: t.cannibalization_risk || "unknown",
        internal_links_count: 0,
        products_count: 0,
        editorial_length: editorialLength,
        faq_count: faqs.length,
      });
    });

    const buckets = buildExecutionBuckets(editorialInputs);
    const gaps = detectGaps(gapInputs);
    const gapBuckets = buildGapBuckets(gapInputs);

    const editorialTelemetry: EditorialTelemetryInput = {
      maturities, thematicDepths: themeMaturities, semanticCoverages,
      faqCount, reviewCount,
      orphanClusters: gapBuckets.noHubs.length,
      contentGaps: gaps.length,
    };
    const telemetry = computeTelemetry(indexEntities, undefined, editorialTelemetry);

    const plan = buildSemanticExecutionPlan({
      editorialTargets: buckets.priorityMax.concat(buckets.highPotential),
      gaps: gaps.slice(0, 30),
    });

    return { telemetry, plan, gaps, buckets, gapBuckets };
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> SEO Command Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Visão executiva. Autoridade, maturidade, gaps, linking e fila de execução semântica.
        </p>
      </div>

      {isLoading || !computed ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Carregando telemetria…</CardContent></Card>
      ) : (
        <>
          {/* A. Executive KPIs */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="Authority média" value={computed.telemetry.averageAuthority} />
            <Kpi label="Readiness média" value={computed.telemetry.averageReadiness} />
            <Kpi label="Maturity editorial" value={computed.telemetry.editorial_maturity_avg} />
            <Kpi label="Cobertura semântica" value={computed.telemetry.semantic_coverage_avg} />
            <Kpi label="Indexáveis" value={computed.telemetry.indexable} hint={`de ${computed.telemetry.total}`} />
            <Kpi label="Bloqueadas" value={computed.telemetry.blocked} />
            <Kpi label="Sitemap eligíveis" value={computed.telemetry.sitemapCandidates} />
            <Kpi label="Gaps detectados" value={computed.telemetry.content_gap_count} />
          </section>

          <Tabs defaultValue="opportunities" className="space-y-4">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="opportunities"><ListChecks className="h-3.5 w-3.5 mr-1" />Top opportunities</TabsTrigger>
              <TabsTrigger value="risks"><AlertTriangle className="h-3.5 w-3.5 mr-1" />Top risks</TabsTrigger>
              <TabsTrigger value="thin">Thin content</TabsTrigger>
              <TabsTrigger value="connectivity"><Network className="h-3.5 w-3.5 mr-1" />Conectividade</TabsTrigger>
              <TabsTrigger value="queue">Fila execução</TabsTrigger>
              <TabsTrigger value="orphans"><Map className="h-3.5 w-3.5 mr-1" />Órfãos</TabsTrigger>
              <TabsTrigger value="coverage">Cobertura</TabsTrigger>
            </TabsList>

            <TabsContent value="opportunities" className="space-y-2">
              {computed.gaps.slice(0, 12).map((g) => (
                <div key={g.slug + g.entityType} className="flex items-center justify-between gap-2 border rounded-md p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.entityType} · /{g.slug}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline">{g.opportunityScore}</Badge>
                    <Badge variant={g.severity === "critical" ? "destructive" : "secondary"}>{g.severity}</Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="risks" className="space-y-2">
              {computed.gapBuckets.thinClusters.slice(0, 12).map((g) => (
                <div key={g.slug + g.entityType} className="flex items-center justify-between gap-2 border rounded-md p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.entityType} · /{g.slug}</p>
                  </div>
                  <Badge variant="destructive">{g.severity}</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="thin">
              <Card><CardContent className="p-4 space-y-2">
                {computed.buckets.thinContent.slice(0, 20).map((t) => (
                  <div key={t.slug + t.type} className="flex justify-between items-center text-sm">
                    <span className="truncate">{t.name}</span>
                    <Badge variant="outline">{t.authority}</Badge>
                  </div>
                ))}
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="connectivity">
              <Card><CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Semantic connectivity</span>
                    <span className="font-semibold">{computed.telemetry.semantic_connectivity_score}%</span>
                  </div>
                  <Progress value={computed.telemetry.semantic_connectivity_score} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Authority flow</span>
                    <span className="font-semibold">{computed.telemetry.authority_flow_score}</span>
                  </div>
                  <Progress value={computed.telemetry.authority_flow_score} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Internal link quality</span>
                    <span className="font-semibold">{computed.telemetry.internal_link_quality}</span>
                  </div>
                  <Progress value={computed.telemetry.internal_link_quality} />
                </div>
                <div className="text-xs text-muted-foreground">
                  Média {computed.telemetry.avg_links_per_page} links/página · {computed.telemetry.orphan} órfãs
                </div>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="queue" className="space-y-2">
              {computed.plan.map((p, i) => (
                <div key={i} className="border rounded-md p-3">
                  <div className="flex justify-between gap-2 items-start">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.entityName}</p>
                      <p className="text-xs text-muted-foreground">{p.entityType} · /{p.entitySlug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">prio {p.priority}</Badge>
                      <Badge variant="secondary">impacto {p.impactScore}</Badge>
                    </div>
                  </div>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-0.5">
                    {p.actions.slice(0, 3).map((a, j) => <li key={j}>• {a}</li>)}
                  </ul>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="orphans" className="space-y-2">
              {computed.gapBuckets.noHubs.slice(0, 12).map((g) => (
                <div key={g.slug + g.entityType} className="flex items-center justify-between gap-2 border rounded-md p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.entityType} · /{g.slug}</p>
                  </div>
                  <Badge variant="outline">sem hub</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="coverage">
              <Card><CardContent className="p-4 space-y-3 text-sm">
                <div className="flex justify-between"><span>FAQ coverage</span><span>{computed.telemetry.faq_coverage}%</span></div>
                <Progress value={computed.telemetry.faq_coverage} />
                <div className="flex justify-between"><span>Review coverage</span><span>{computed.telemetry.review_coverage}%</span></div>
                <Progress value={computed.telemetry.review_coverage} />
                <div className="flex justify-between"><span>Thematic depth</span><span>{computed.telemetry.thematic_depth_avg}</span></div>
                <Progress value={computed.telemetry.thematic_depth_avg} />
              </CardContent></Card>
            </TabsContent>
          </Tabs>

          <Card className="border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-600" /> SAFE MODE ativo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Esta tela é leitura. Nada aqui altera sitemap, robots, canonicals ou indexação.
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
