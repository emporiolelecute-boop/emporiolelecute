/**
 * Fase 10.4 — Authority Center.
 *
 * Visão consolidada de:
 *  - hubs fortes / fracos
 *  - taxonomias dominantes
 *  - thin content / canibalização
 *  - oportunidades de autoridade
 *  - readiness para indexação
 *
 * SAFE MODE: ações manuais apenas. Nada vai para sitemap automaticamente.
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { useAuthorityRefresh } from "@/hooks/useAuthorityRefresh";
import { toast } from "sonner";
import { calculateIndexReadiness } from "@/lib/authorityEngine";

interface ThemeRow {
  id: string;
  slug: string;
  title: string;
  authority_score: number;
  topical_coverage: number;
  readiness_score: number;
  thin_content_risk: boolean;
  cannibalization_risk: string;
  internal_links_count: number;
  is_approved: boolean;
  is_indexed: boolean;
  last_authority_refresh: string | null;
}

interface CombinationRow {
  id: string;
  path: string;
  primary_type: string;
  primary_slug: string;
  secondary_slug: string;
  products_count: number;
  quality_score: number;
  topical_coverage: number;
  readiness_score: number;
  thin_content_risk: boolean;
  cannibalization_risk: string;
  internal_links_count: number;
  discovery_status: string;
  last_authority_refresh: string | null;
}

function StatusBadge({ score }: { score: number }) {
  if (score >= 85) return <Badge className="bg-emerald-600">Pronta</Badge>;
  if (score >= 70) return <Badge className="bg-amber-500">Quase</Badge>;
  if (score >= 55) return <Badge variant="secondary">A melhorar</Badge>;
  return <Badge variant="destructive">Bloqueada</Badge>;
}

export default function AdminAuthority() {
  const refresh = useAuthorityRefresh();

  const themesQ = useQuery({
    queryKey: ["authority-center", "themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_hubs")
        .select(
          "id, slug, title, authority_score, topical_coverage, readiness_score, thin_content_risk, cannibalization_risk, internal_links_count, is_approved, is_indexed, last_authority_refresh"
        )
        .order("authority_score", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as ThemeRow[];
    },
  });

  const combosQ = useQuery({
    queryKey: ["authority-center", "combinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("combination_pages_registry")
        .select(
          "id, path, primary_type, primary_slug, secondary_slug, products_count, quality_score, topical_coverage, readiness_score, thin_content_risk, cannibalization_risk, internal_links_count, discovery_status, last_authority_refresh"
        )
        .order("quality_score", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as CombinationRow[];
    },
  });

  const stats = useMemo(() => {
    const t = themesQ.data ?? [];
    const c = combosQ.data ?? [];
    return {
      themesStrong: t.filter((x) => x.authority_score >= 85).length,
      themesWeak: t.filter((x) => x.authority_score < 55).length,
      themesThin: t.filter((x) => x.thin_content_risk).length,
      themesCannibal: t.filter((x) => x.cannibalization_risk === "high").length,
      themesReady: t.filter((x) => x.readiness_score >= 85).length,
      combosStrong: c.filter((x) => x.quality_score >= 85).length,
      combosThin: c.filter((x) => x.thin_content_risk).length,
      combosCannibal: c.filter((x) => x.cannibalization_risk === "high").length,
      combosReady: c.filter((x) => x.readiness_score >= 85).length,
    };
  }, [themesQ.data, combosQ.data]);

  const handleRefresh = async (target: "themes" | "combinations" | "all") => {
    try {
      const res = await refresh.mutateAsync(target);
      toast.success(
        `Authority recalculado: ${res.themesUpdated} temas, ${res.combinationsUpdated} combinações`
      );
    } catch (err: any) {
      toast.error(err?.message ?? "Falha ao recalcular");
    }
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Authority Center | Admin</title></Helmet>

      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="h-6 w-6" /> Authority Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Autoridade temática, prontidão para indexação e governança SEO. Tudo manual — nada
            entra no sitemap automaticamente.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRefresh("themes")}
            disabled={refresh.isPending}
          >
            {refresh.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Recalcular temas</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRefresh("combinations")}
            disabled={refresh.isPending}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Recalcular combinações
          </Button>
          <Button size="sm" onClick={() => handleRefresh("all")} disabled={refresh.isPending}>
            <RefreshCw className="h-4 w-4 mr-2" /> Recalcular tudo
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Temas fortes" value={stats.themesStrong} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Temas prontos" value={stats.themesReady} />
        <StatCard label="Thin content" value={stats.themesThin + stats.combosThin} warn />
        <StatCard label="Canibalização" value={stats.themesCannibal + stats.combosCannibal} warn />
        <StatCard label="Combinações prontas" value={stats.combosReady} />
      </div>

      <Tabs defaultValue="themes" className="w-full">
        <TabsList>
          <TabsTrigger value="themes">Temas</TabsTrigger>
          <TabsTrigger value="combinations">Combinações</TabsTrigger>
          <TabsTrigger value="gaps">Coverage Gaps</TabsTrigger>
        </TabsList>

        <TabsContent value="themes">
          <Card>
            <CardHeader><CardTitle>Hubs temáticos</CardTitle></CardHeader>
            <CardContent>
              {themesQ.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">Hub</th>
                        <th>Authority</th>
                        <th>Coverage</th>
                        <th>Links</th>
                        <th>Readiness</th>
                        <th>Status</th>
                        <th>Risco</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(themesQ.data ?? []).map((t) => (
                        <tr key={t.id} className="border-b last:border-0">
                          <td className="py-2 font-medium">
                            <a href={`/tema/${t.slug}?admin_preview=1`} target="_blank" rel="noreferrer" className="hover:underline">
                              {t.title}
                            </a>
                          </td>
                          <td>{t.authority_score}</td>
                          <td>{t.topical_coverage}</td>
                          <td>{t.internal_links_count}</td>
                          <td>{t.readiness_score}</td>
                          <td><StatusBadge score={t.readiness_score} /></td>
                          <td className="space-x-1">
                            {t.thin_content_risk && <Badge variant="destructive">thin</Badge>}
                            {t.cannibalization_risk === "high" && <Badge variant="destructive">canibal</Badge>}
                            {!t.is_approved && <Badge variant="outline">não aprovado</Badge>}
                          </td>
                        </tr>
                      ))}
                      {!themesQ.data?.length && (
                        <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">Nenhum hub cadastrado.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="combinations">
          <Card>
            <CardHeader><CardTitle>Combinações</CardTitle></CardHeader>
            <CardContent>
              {combosQ.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">Path</th>
                        <th>Produtos</th>
                        <th>Authority</th>
                        <th>Coverage</th>
                        <th>Readiness</th>
                        <th>Status</th>
                        <th>Risco</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(combosQ.data ?? []).map((c) => (
                        <tr key={c.id} className="border-b last:border-0">
                          <td className="py-2 font-mono text-xs">
                            <a href={`${c.path}?admin_preview=1`} target="_blank" rel="noreferrer" className="hover:underline">
                              {c.path}
                            </a>
                          </td>
                          <td>{c.products_count}</td>
                          <td>{c.quality_score}</td>
                          <td>{c.topical_coverage}</td>
                          <td>{c.readiness_score}</td>
                          <td><StatusBadge score={c.readiness_score} /></td>
                          <td className="space-x-1">
                            {c.thin_content_risk && <Badge variant="destructive">thin</Badge>}
                            {c.cannibalization_risk === "high" && <Badge variant="destructive">canibal</Badge>}
                            <Badge variant="outline">{c.discovery_status}</Badge>
                          </td>
                        </tr>
                      ))}
                      {!combosQ.data?.length && (
                        <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">Nenhuma combinação detectada.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Coverage gaps & oportunidades
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p className="text-muted-foreground">
                Hubs e combinações com authority alto mas readiness baixo geralmente precisam
                apenas de mais links internos ou conteúdo editorial.
              </p>
              <ul className="space-y-2">
                {(themesQ.data ?? [])
                  .filter((t) => t.authority_score >= 70 && t.readiness_score < 70)
                  .slice(0, 12)
                  .map((t) => {
                    const r = calculateIndexReadiness({
                      authority: t.authority_score,
                      topicalCoverage: t.topical_coverage,
                      internalLinksCount: t.internal_links_count,
                      reviewsCount: 0,
                      diversity: 2,
                      thinContentRisk: t.thin_content_risk,
                      cannibalization: (t.cannibalization_risk as any) || "unknown",
                    });
                    return (
                      <li key={t.id} className="flex justify-between border-b pb-2">
                        <span>{t.title}</span>
                        <span className="text-muted-foreground">
                          {r.reasons.slice(0, 2).join(" · ") || "—"}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, icon, warn }: { label: string; value: number; icon?: React.ReactNode; warn?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
          {icon}
        </div>
        <div className={`text-2xl font-semibold ${warn && value > 0 ? "text-destructive" : ""}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
