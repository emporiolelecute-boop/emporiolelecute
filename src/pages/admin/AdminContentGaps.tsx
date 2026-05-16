/**
 * Fase 11.2 — Content Gap Center.
 *
 * Detecta lacunas editoriais a partir de sinais já existentes.
 * SAFE MODE: apenas listagem orientativa.
 */
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertCircle } from "lucide-react";
import {
  buildGapBuckets,
  type GapEntityInput,
  type GapResult,
} from "@/lib/contentGapEngine";

function severityVariant(s: GapResult["severity"]) {
  if (s === "critical") return "destructive" as const;
  if (s === "high") return "default" as const;
  if (s === "medium") return "secondary" as const;
  return "outline" as const;
}

function GapCard({ g }: { g: GapResult }) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium truncate">{g.name}</p>
          <p className="text-xs text-muted-foreground">{g.entityType} · /{g.slug}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={severityVariant(g.severity)}>{g.severity}</Badge>
          <span className="text-xs text-muted-foreground">impacto {g.estimatedImpact}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {g.missingAssets.map((m, i) => (
          <Badge key={i} variant="outline" className="text-xs">{m.asset}</Badge>
        ))}
      </div>
      <ul className="text-xs text-muted-foreground space-y-0.5">
        {g.suggestedActions.slice(0, 4).map((a, i) => (
          <li key={i}>• {a}</li>
        ))}
      </ul>
      <div className="text-xs">
        <span className="font-medium">Opportunity score:</span> {g.opportunityScore}
      </div>
    </div>
  );
}

function Section({ items }: { items: GapResult[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground italic p-4">Nenhuma lacuna detectada nesta categoria.</p>;
  }
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((g) => <GapCard key={`${g.entityType}-${g.slug}`} g={g} />)}
    </div>
  );
}

export default function AdminContentGaps() {
  const { data: inputs = [], isLoading } = useQuery({
    queryKey: ["admin", "content-gaps", "inputs"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<GapEntityInput[]> => {
      const [cats, occs, segs, themes, products, prodOcc, prodSeg, reviews, blog] = await Promise.all([
        supabase.from("categories").select("id, slug, name, description_seo, faqs, image_url"),
        supabase.from("occasions").select("id, slug, name, description_seo, faqs, image_url"),
        supabase.from("segments").select("id, slug, name, description_seo, faqs, image_url"),
        supabase.from("theme_hubs" as any).select("id, slug, title, editorial_content, faqs, is_approved, authority_score"),
        supabase.from("products").select("id, category_id, slug, name, badge, long_description, editorial_content").eq("is_active", true),
        supabase.from("product_occasions").select("occasion_id, product_id"),
        supabase.from("product_segments").select("segment_id, product_id"),
        supabase.from("product_reviews").select("product_id").eq("is_visible", true),
        supabase.from("blog_posts").select("id, related_categories, related_occasions, related_segments, related_themes").eq("is_published", true),
      ]);

      const productsList = products.data || [];
      const blogs = blog.data || [];
      const reviewByProduct = new Map<string, number>();
      (reviews.data || []).forEach((r: any) => {
        reviewByProduct.set(r.product_id, (reviewByProduct.get(r.product_id) || 0) + 1);
      });

      const byCat = new Map<string, string[]>();
      productsList.forEach((p: any) => {
        if (!p.category_id) return;
        const arr = byCat.get(p.category_id) || [];
        arr.push(p.id);
        byCat.set(p.category_id, arr);
      });
      const byOcc = new Map<string, string[]>();
      (prodOcc.data || []).forEach((r: any) => {
        const arr = byOcc.get(r.occasion_id) || [];
        arr.push(r.product_id);
        byOcc.set(r.occasion_id, arr);
      });
      const bySeg = new Map<string, string[]>();
      (prodSeg.data || []).forEach((r: any) => {
        const arr = bySeg.get(r.segment_id) || [];
        arr.push(r.product_id);
        bySeg.set(r.segment_id, arr);
      });

      const blogFor = (kind: "category" | "occasion" | "segment" | "theme", id: string) =>
        blogs.filter((p: any) => {
          const arr =
            kind === "category" ? p.related_categories :
            kind === "occasion" ? p.related_occasions :
            kind === "segment"  ? p.related_segments :
            p.related_themes;
          return Array.isArray(arr) && arr.includes(id);
        }).length;

      const reviewsFor = (productIds: string[]) =>
        productIds.reduce((acc, pid) => acc + (reviewByProduct.get(pid) || 0), 0);

      const out: GapEntityInput[] = [];

      const pushTax = (
        entityType: GapEntityInput["entityType"],
        rows: any[],
        idMap: Map<string, string[]>,
      ) => {
        rows.forEach((r) => {
          const productIds = idMap.get(r.id) || [];
          const faqs = Array.isArray(r.faqs) ? r.faqs : [];
          out.push({
            entityType,
            slug: r.slug,
            name: r.name,
            productsCount: productIds.length,
            editorialLength: (r.description_seo || "").length,
            faqCount: faqs.length,
            blogPostsCount: blogFor(entityType as any, r.id),
            reviewsCount: reviewsFor(productIds),
            internalLinksCount: faqs.length,
            hasEditorial: (r.description_seo || "").length >= 300,
            approved: true,
          });
        });
      };
      pushTax("category", cats.data || [], byCat);
      pushTax("occasion", occs.data || [], byOcc);
      pushTax("segment", segs.data || [], bySeg);

      (themes.data || []).forEach((t: any) => {
        const faqs = Array.isArray(t.faqs) ? t.faqs : [];
        out.push({
          entityType: "theme",
          slug: t.slug,
          name: t.title || t.slug,
          authority: t.authority_score || 0,
          productsCount: 0,
          editorialLength: (t.editorial_content || "").length,
          faqCount: faqs.length,
          blogPostsCount: blogFor("theme", t.id),
          hasHub: true,
          approved: !!t.is_approved,
        });
      });

      // produtos premium (badge): só os que parecem fortes
      productsList
        .filter((p: any) => p.badge)
        .slice(0, 200)
        .forEach((p: any) => {
          out.push({
            entityType: "product",
            slug: p.slug,
            name: p.name,
            productsCount: 1,
            editorialLength: ((p.editorial_content || "") + (p.long_description || "")).length,
            reviewsCount: reviewByProduct.get(p.id) || 0,
            isPremium: true,
          });
        });

      return out;
    },
  });

  const buckets = useMemo(() => buildGapBuckets(inputs), [inputs]);
  const totalGaps = inputs.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> Content Gap Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Lacunas editoriais detectadas. Tudo orientativo — nada é publicado automaticamente.
          </p>
        </div>
        <Badge variant="outline">{totalGaps} entidades analisadas</Badge>
      </div>

      {isLoading ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Carregando análises…</CardContent></Card>
      ) : (
        <Tabs defaultValue="highest" className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="highest">Maior impacto ({buckets.highestImpact.length})</TabsTrigger>
            <TabsTrigger value="content">Sem conteúdo ({buckets.noContent.length})</TabsTrigger>
            <TabsTrigger value="faqs">Sem FAQs ({buckets.noFaqs.length})</TabsTrigger>
            <TabsTrigger value="links">Sem links ({buckets.noLinks.length})</TabsTrigger>
            <TabsTrigger value="reviews">Sem reviews ({buckets.noReviews.length})</TabsTrigger>
            <TabsTrigger value="blog">Sem blog ({buckets.noBlog.length})</TabsTrigger>
            <TabsTrigger value="hubs">Sem hubs ({buckets.noHubs.length})</TabsTrigger>
            <TabsTrigger value="thin">Thin clusters ({buckets.thinClusters.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="highest"><Section items={buckets.highestImpact} /></TabsContent>
          <TabsContent value="content"><Section items={buckets.noContent} /></TabsContent>
          <TabsContent value="faqs"><Section items={buckets.noFaqs} /></TabsContent>
          <TabsContent value="links"><Section items={buckets.noLinks} /></TabsContent>
          <TabsContent value="reviews"><Section items={buckets.noReviews} /></TabsContent>
          <TabsContent value="blog"><Section items={buckets.noBlog} /></TabsContent>
          <TabsContent value="hubs"><Section items={buckets.noHubs} /></TabsContent>
          <TabsContent value="thin"><Section items={buckets.thinClusters} /></TabsContent>
        </Tabs>
      )}

      <Card className="border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" /> SAFE MODE
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Nenhuma sugestão deste painel altera URL pública, sitemap, robots, canonicals ou indexação.
          Toda execução continua manual e revisável.
        </CardContent>
      </Card>
    </div>
  );
}
