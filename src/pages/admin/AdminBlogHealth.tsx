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
    return { scored, avg, critical, needs, worst: sorted.slice(0, 20) };
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

      <Card>
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
