import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyzeImageHealth, type ProductLite } from "@/lib/imageHealth";

const AdminImageHealth = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products", "images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, images")
        .eq("is_active", true)
        .limit(1000);
      if (error) throw error;
      return (data || []) as ProductLite[];
    },
  });

  const summary = useMemo(() => analyzeImageHealth(products), [products]);

  // Fase 11 — execution layer: listas críticas + score consolidado.
  const exec = useMemo(() => {
    const critical: typeof summary.issues = [];
    const lowDiversity: { id: string; name: string; count: number }[] = [];
    const noVisualContext: { id: string; name: string }[] = [];
    const tooSmall: { id: string; name: string }[] = [];
    const noCoherentAlt: typeof summary.issues = [];

    for (const p of products) {
      const imgs = p.images || [];
      if (imgs.length === 0) {
        critical.push({
          productId: p.id, productSlug: p.slug, productName: p.name,
          imageUrl: "", issues: ["Sem imagens"],
        });
        noVisualContext.push({ id: p.id, name: p.name });
        continue;
      }
      if (imgs.length < 2) {
        lowDiversity.push({ id: p.id, name: p.name, count: imgs.length });
      }
      if (imgs.length === 1) tooSmall.push({ id: p.id, name: p.name });
    }
    for (const it of summary.issues) {
      if (it.issues.some((i) => i.includes("Filename"))) noCoherentAlt.push(it);
    }

    // Image Authority Score 0..100
    const totalProducts = products.length || 1;
    const withImages = products.filter((p) => (p.images?.length ?? 0) > 0).length;
    const diverse = products.filter((p) => (p.images?.length ?? 0) >= 3).length;
    const balanced = products.filter((p) => (p.images?.length ?? 0) >= 2).length;
    const semantic = totalProducts > 0
      ? 1 - (summary.smallFilename / Math.max(1, summary.total))
      : 0;
    const score = Math.round(
      (withImages / totalProducts) * 35 +
      (balanced / totalProducts) * 20 +
      (diverse / totalProducts) * 20 +
      semantic * 15 +
      (1 - summary.duplicates / Math.max(1, summary.total)) * 10
    );

    return { critical, lowDiversity, noVisualContext, tooSmall, noCoherentAlt, score };
  }, [products, summary]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Saúde de Imagens</h1>
          <p className="text-sm text-muted-foreground">
            SEO de imagens: filenames, duplicações e cobertura (SAFE MODE — não gera nem altera imagens).
          </p>
        </div>
        <Card className="min-w-[220px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">
              Image Authority Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${exec.score >= 70 ? "text-emerald-600" : exec.score >= 50 ? "text-amber-600" : "text-rose-600"}`}>
              {exec.score}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              resolução · diversidade · proporção · contexto · consistência
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Imagens totais", value: summary.total },
          { label: "Sem imagens", value: summary.withoutImages, danger: true },
          { label: "Filename pobre", value: summary.smallFilename },
          { label: "Duplicadas", value: summary.duplicates },
          { label: "Alt fraco (proxy)", value: summary.withoutAlt },
        ].map((m) => (
          <Card key={m.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">{m.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${m.danger ? "text-destructive" : ""}`}>
                {m.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Imagens críticas", items: exec.critical.map((c) => c.productName), tone: "destructive" as const },
          { title: "Baixa diversidade", items: exec.lowDiversity.map((c) => `${c.name} (${c.count})`), tone: "secondary" as const },
          { title: "Sem contexto visual", items: exec.noVisualContext.map((c) => c.name), tone: "destructive" as const },
          { title: "Imagem muito pequena", items: exec.tooSmall.map((c) => c.name), tone: "secondary" as const },
          { title: "Sem alt coerente", items: exec.noCoherentAlt.map((c) => c.productName), tone: "secondary" as const },
        ].map((bucket) => (
          <Card key={bucket.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                {bucket.title}
                <Badge variant={bucket.tone}>{bucket.items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-40 overflow-y-auto text-xs text-muted-foreground space-y-0.5">
                {bucket.items.slice(0, 50).map((n, i) => (
                  <div key={`${bucket.title}-${i}`} className="truncate">• {n}</div>
                ))}
                {bucket.items.length === 0 && <p>—</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problemas detectados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          )}
          {!isLoading && summary.issues.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum problema crítico encontrado ✨</p>
          )}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {summary.issues.slice(0, 200).map((it, idx) => (
              <div
                key={`${it.productId}-${idx}`}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{it.productName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {it.imageUrl || "(sem imagens)"}
                  </p>
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {it.issues.map((i) => (
                    <Badge key={i} variant="destructive" className="text-xs">
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminImageHealth;
