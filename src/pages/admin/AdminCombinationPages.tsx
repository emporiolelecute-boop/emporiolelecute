import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { scoreCombinationPage } from "@/lib/combinationPageSeo";

interface ComboRow {
  id: string;
  path: string;
  primary_type: string;
  primary_slug: string;
  secondary_type: string;
  secondary_slug: string;
  product_count: number;
  has_editorial: boolean;
  has_custom_meta: boolean;
  has_faq: boolean;
  seo_score: number;
  is_indexable: boolean;
  editorial_content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  faqs: any[];
  last_evaluated_at: string | null;
}

const AdminCombinationPages = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["combination_pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("combination_pages_registry")
        .select("*")
        .order("seo_score", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []) as unknown as ComboRow[];
    },
  });

  const toggleIndex = useMutation({
    mutationFn: async (row: ComboRow) => {
      const { error } = await supabase
        .from("combination_pages_registry")
        .update({ is_indexable: !row.is_indexable })
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["combination_pages"] });
      toast.success("Atualizado");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => !q || r.path.toLowerCase().includes(q));
  }, [rows, search]);

  const stats = useMemo(() => {
    const indexable = rows.filter((r) => r.is_indexable).length;
    const borderline = rows.filter((r) => {
      const s = scoreCombinationPage({
        productCount: r.product_count,
        editorialChars: (r.editorial_content || "").length,
        hasUniqueMeta: r.has_custom_meta,
        faqCount: Array.isArray(r.faqs) ? r.faqs.length : 0,
        internalLinks: 0,
      });
      return s.classification === "borderline";
    }).length;
    return { total: rows.length, indexable, borderline };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Páginas Combinatórias</h1>
        <p className="text-sm text-muted-foreground">
          Governança de URLs combinatórias (ex: <code>/segmento/X/ocasiao/Y</code>) — indexação
          controlada por score.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Indexáveis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{stats.indexable}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Borderline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{stats.borderline}</p>
          </CardContent>
        </Card>
      </div>

      <Input
        placeholder="Buscar por caminho..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Classificação</TableHead>
              <TableHead>Indexável</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma página combinatória registrada. Cadastros virão de detecção automática
                  ou registro manual em fases futuras.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((r) => {
              const s = scoreCombinationPage({
                productCount: r.product_count,
                editorialChars: (r.editorial_content || "").length,
                hasUniqueMeta: r.has_custom_meta,
                faqCount: Array.isArray(r.faqs) ? r.faqs.length : 0,
                internalLinks: 0,
              });
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.path}</TableCell>
                  <TableCell>{r.product_count}</TableCell>
                  <TableCell>
                    <Badge>{s.score}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.classification === "indexable"
                          ? "default"
                          : s.classification === "borderline"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {s.classification}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={r.is_indexable}
                      onCheckedChange={() => toggleIndex.mutate(r)}
                      disabled={s.classification === "noindex"}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Regra: combinações só podem ser marcadas como indexáveis se atingirem score mínimo e os
        critérios obrigatórios (6+ produtos, editorial, FAQ).
      </p>
    </div>
  );
};

export default AdminCombinationPages;
