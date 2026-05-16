import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminBlogPosts } from "@/hooks/useAdminBlogPosts";
import { evaluateBlogPost } from "@/lib/blogSeo";

const AdminBlogHealth = () => {
  const { data: posts = [], isLoading } = useAdminBlogPosts();

  const stats = useMemo(() => {
    const scored = posts.map((p) => ({ post: p, seo: evaluateBlogPost(p) }));
    const avg =
      scored.length > 0
        ? Math.round(scored.reduce((s, x) => s + x.seo.score, 0) / scored.length)
        : 0;
    const critical = scored.filter((x) => x.seo.classification === "critical").length;
    const needs = scored.filter((x) => x.seo.classification === "needs-work").length;
    const sorted = [...scored].sort((a, b) => a.seo.score - b.seo.score);

    // Fase 11 — Blog consolidation signals
    const hasLinks = (p: any) => {
      const rel = [
        ...(p.related_categories || []),
        ...(p.related_occasions || []),
        ...(p.related_segments || []),
        ...(p.related_themes || []),
        ...(p.related_products || []),
        ...(p.related_tags || []),
      ];
      return rel.length > 0;
    };
    const orphans = posts.filter((p: any) => !hasLinks(p));
    const noInternalLinks = posts.filter((p: any) => {
      const c = String(p.content || "");
      return !/<a\s+[^>]*href=/.test(c);
    });
    const noThematic = posts.filter((p: any) =>
      (p.related_themes || []).length === 0 && (p.related_segments || []).length === 0,
    );
    const noCta = posts.filter((p: any) => {
      const c = String(p.content || "").toLowerCase();
      return !/(whatsapp|orçamento|orcamento|compre|peça|encomende|conheça)/i.test(c);
    });
    const noStrongTax = posts.filter((p: any) =>
      (p.related_categories || []).length === 0 && (p.related_occasions || []).length === 0,
    );
    const noRelatedProducts = posts.filter((p: any) => (p.related_products || []).length === 0);

    // Blog Authority Score 0..100
    const totalPosts = posts.length || 1;
    const withLinks = posts.length - orphans.length;
    const withCta = totalPosts - noCta.length;
    const withTax = totalPosts - noStrongTax.length;
    const withProducts = totalPosts - noRelatedProducts.length;
    const authorityScore = Math.round(
      (withLinks / totalPosts) * 30 +
      (withCta / totalPosts) * 20 +
      (withTax / totalPosts) * 25 +
      (withProducts / totalPosts) * 15 +
      Math.min(10, avg / 10)
    );

    return {
      scored, avg, critical, needs,
      worst: sorted.slice(0, 20),
      orphans, noInternalLinks, noThematic, noCta, noStrongTax, noRelatedProducts,
      authorityScore,
    };
  }, [posts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Saúde do Blog</h1>
        <p className="text-sm text-muted-foreground">
          Auditoria SEO/editorial dos posts publicados e rascunhos.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{posts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Score médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.avg}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Precisam atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{stats.needs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{stats.critical}</p>
          </CardContent>
        </Card>
      </div>

      {/* Fase 11 — Blog consolidation */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            Blog Authority Score
            <Badge
              variant={stats.authorityScore >= 70 ? "default" : stats.authorityScore >= 50 ? "secondary" : "destructive"}
            >
              {stats.authorityScore}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              { label: "Posts órfãos (sem relações)", value: stats.orphans.length },
              { label: "Sem links internos", value: stats.noInternalLinks.length },
              { label: "Sem conexão temática", value: stats.noThematic.length },
              { label: "Sem CTA", value: stats.noCta.length },
              { label: "Sem relação com taxonomias fortes", value: stats.noStrongTax.length },
              { label: "Sem produtos relacionados", value: stats.noRelatedProducts.length },
            ].map((b) => (
              <div key={b.label} className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">{b.label}</p>
                <p className={`text-2xl font-bold ${b.value > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {b.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

        <CardHeader>
          <CardTitle>Posts com menor score</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
          {!isLoading && stats.worst.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum post cadastrado ainda.</p>
          )}
          <div className="space-y-3">
            {stats.worst.map(({ post, seo }) => (
              <Link
                key={post.id}
                to="/admin/blog"
                className="block p-3 rounded-lg border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.slug}</p>
                  </div>
                  <Badge
                    variant={
                      seo.classification === "critical"
                        ? "destructive"
                        : seo.classification === "needs-work"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {seo.score}
                  </Badge>
                </div>
                {seo.issues.length > 0 && (
                  <ul className="text-xs text-muted-foreground mt-2 space-y-0.5">
                    {seo.issues.slice(0, 4).map((i) => (
                      <li key={i}>• {i}</li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogHealth;
