// Fase 10.1 — Painel administrativo do Discovery Engine.
// Apenas leitura/governança. NÃO publica páginas.

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  useDiscoveryRows,
  useRunDiscovery,
  useUpdateDiscoveryStatus,
  type DiscoveryRow,
} from "@/hooks/useDiscoveryEngine";

type Filter = "all" | "candidate" | "approved" | "ignored" | "thin";

const classBadge = (s: number) => {
  if (s >= 85) return <Badge>Excelente</Badge>;
  if (s >= 70) return <Badge variant="secondary">Forte</Badge>;
  if (s >= 55) return <Badge variant="outline">Regular</Badge>;
  return <Badge variant="destructive">Fraca</Badge>;
};

const statusBadge = (s: string) => {
  if (s === "approved") return <Badge>Aprovada</Badge>;
  if (s === "ignored") return <Badge variant="outline">Ignorada</Badge>;
  return <Badge variant="secondary">Candidata</Badge>;
};

const AdminDiscovery = () => {
  const { data: rows = [], isLoading } = useDiscoveryRows();
  const run = useRunDiscovery();
  const setStatus = useUpdateDiscoveryStatus();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "thin") return rows.filter((r) => r.thin_content_risk);
    if (filter === "all") return rows;
    return rows.filter((r) => r.discovery_status === filter);
  }, [rows, filter]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      excellent: rows.filter((r) => r.quality_score >= 85).length,
      strong: rows.filter((r) => r.quality_score >= 70 && r.quality_score < 85).length,
      thin: rows.filter((r) => r.thin_content_risk).length,
      approved: rows.filter((r) => r.discovery_status === "approved").length,
    };
  }, [rows]);

  const clusters = useMemo(() => {
    const map = new Map<string, DiscoveryRow[]>();
    for (const r of rows) {
      const key = r.secondary_slug || "outros";
      const arr = map.get(key) || []; arr.push(r); map.set(key, arr);
    }
    return Array.from(map.entries())
      .map(([k, list]) => ({ key: k, count: list.length, top: list[0] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [rows]);

  const handleRun = async () => {
    try {
      const res = await run.mutateAsync();
      toast.success(`Discovery executado: ${res.opportunities} oportunidades`);
    } catch (e: any) {
      toast.error(e?.message || "Falha ao executar discovery");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Discovery Engine</h1>
          <p className="text-sm text-muted-foreground">
            Análise interna de oportunidades SEO. Nenhuma página pública é criada nesta fase.
          </p>
        </div>
        <Button onClick={handleRun} disabled={run.isPending}>
          {run.isPending ? "Analisando..." : "Executar análise"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total },
          { label: "Excelentes", value: stats.excellent },
          { label: "Fortes", value: stats.strong },
          { label: "Risco fraco", value: stats.thin },
          { label: "Aprovadas", value: stats.approved },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clusters mais fortes</CardTitle>
        </CardHeader>
        <CardContent>
          {clusters.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum cluster detectado ainda.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {clusters.map((c) => (
                <Badge key={c.key} variant="secondary" className="text-sm">
                  {c.key} · {c.count}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Oportunidades</CardTitle>
          <div className="flex gap-2">
            {(["all", "candidate", "approved", "ignored", "thin"] as Filter[]).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "Todas" : f === "thin" ? "Risco fraco" : f}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma oportunidade encontrada. Clique em “Executar análise”.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slug</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Qualidade</TableHead>
                    <TableHead>Confiança</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead>Risco</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const previewUrl = r.primary_type === "segment" && r.secondary_type === "occasion"
                      ? `/segmento/${r.primary_slug}/ocasiao/${r.secondary_slug}?admin_preview=1`
                      : null;
                    const reasonsList: string[] = Array.isArray(r.discovery_payload?.warnings)
                      ? r.discovery_payload.warnings
                      : [];
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">
                          {r.canonical_path || r.path}
                        </TableCell>
                        <TableCell className="text-xs">{r.discovery_type || "—"}</TableCell>
                        <TableCell>{r.products_count}</TableCell>
                        <TableCell>{r.quality_score}</TableCell>
                        <TableCell>{r.confidence_score}</TableCell>
                        <TableCell>{classBadge(r.quality_score)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {r.is_indexable
                              ? <Badge>indexável</Badge>
                              : <Badge variant="outline">noindex</Badge>}
                            {r.thin_content_risk && <Badge variant="destructive">thin content</Badge>}
                            {reasonsList.length > 0 && (
                              <span className="text-[10px] text-muted-foreground line-clamp-2 max-w-[180px]">
                                {reasonsList.slice(0, 2).join(" · ")}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{statusBadge(r.discovery_status)}</TableCell>
                        <TableCell className="text-right space-x-1">
                          {previewUrl && (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={previewUrl} target="_blank" rel="noopener noreferrer">Preview</a>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={setStatus.isPending}
                            onClick={() => setStatus.mutate({ id: r.id, status: "approved" })}
                          >
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={setStatus.isPending}
                            onClick={() => setStatus.mutate({ id: r.id, status: "ignored" })}
                          >
                            Ignorar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Governança</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Aprovar/Ignorar marca apenas o status interno — nada é publicado.</p>
          <p>• Oportunidades com risco de thin content nunca devem ser indexadas sem revisão editorial.</p>
          <p>• Tag-based opportunities têm risco extra de canibalização com taxonomias mais fortes.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDiscovery;
