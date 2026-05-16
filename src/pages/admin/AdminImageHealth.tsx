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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Saúde de Imagens</h1>
        <p className="text-sm text-muted-foreground">
          SEO de imagens: filenames, duplicações e cobertura.
        </p>
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
