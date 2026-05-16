/**
 * Fase 11.1 — Hook compartilhado de contexto semântico.
 *
 * Busca, com cache agressivo via React Query, os candidatos potenciais
 * para o `linkOrchestrator`:
 *   - theme hubs aprovados+indexáveis (já com scores)
 *   - combinations aprovadas (do registry)
 *   - posts publicados recentes
 *
 * SAFE MODE: nenhum link é renderizado aqui; apenas devolve a lista
 * que será filtrada por `isAllowedDestination` no orchestrator.
 *
 * Performance:
 *   - staleTime 10 min (compartilhado entre páginas)
 *   - hard caps em todas as queries
 *   - sem waterfall (queries são paralelas/independentes)
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const STALE = 10 * 60 * 1000;

export interface SemanticHubItem {
  id: string;
  slug: string;
  name: string;
  title?: string;
  // governance flags (consumidos por linkOrchestrator.isAllowedDestination)
  approved?: boolean;
  is_indexed?: boolean;
  authority_score?: number;
  readiness_score?: number;
  topical_coverage?: number;
  thin_content_risk?: boolean;
  cannibalization_risk?: "none" | "low" | "medium" | "high" | "unknown";
  internal_links_count?: number;
}

export interface SemanticCombinationItem extends SemanticHubItem {
  path: string;
}

export interface SemanticPostItem {
  id: string;
  slug: string;
  title: string;
  name?: string;
}

export interface SemanticContext {
  themes: SemanticHubItem[];
  combinations: SemanticCombinationItem[];
  posts: SemanticPostItem[];
}

export function useSemanticContext(): { data: SemanticContext; isLoading: boolean } {
  const themesQ = useQuery({
    queryKey: ["semantic-ctx", "themes"],
    staleTime: STALE,
    queryFn: async (): Promise<SemanticHubItem[]> => {
      const { data, error } = await supabase
        .from("theme_hubs")
        .select(
          "id, slug, title, is_approved, is_indexed, authority_score, readiness_score, topical_coverage, thin_content_risk, cannibalization_risk, internal_links_count"
        )
        .eq("is_approved", true)
        .eq("is_indexed", true)
        .order("authority_score", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data || []).map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.title,
        title: r.title,
        approved: r.is_approved,
        is_indexed: r.is_indexed,
        authority_score: r.authority_score ?? 0,
        readiness_score: r.readiness_score ?? 0,
        topical_coverage: r.topical_coverage ?? 0,
        thin_content_risk: !!r.thin_content_risk,
        cannibalization_risk: (r.cannibalization_risk as SemanticHubItem["cannibalization_risk"]) || "none",
        internal_links_count: r.internal_links_count ?? 0,
      }));
    },
  });

  const combosQ = useQuery({
    queryKey: ["semantic-ctx", "combinations"],
    staleTime: STALE,
    queryFn: async (): Promise<SemanticCombinationItem[]> => {
      const { data, error } = await supabase
        .from("combination_pages_registry")
        .select(
          "id, path, primary_slug, secondary_slug, discovery_status, is_indexable, quality_score, readiness_score, topical_coverage, thin_content_risk, cannibalization_risk, internal_links_count"
        )
        .eq("discovery_status", "approved")
        .eq("is_indexable", true)
        .order("quality_score", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data || []).map((r) => {
        const label = `${r.primary_slug} · ${r.secondary_slug}`.replace(/-/g, " ");
        return {
          id: r.id,
          slug: r.path,
          path: r.path,
          name: label,
          title: label,
          approved: r.discovery_status === "approved",
          is_indexed: r.is_indexable,
          authority_score: r.quality_score ?? 0,
          readiness_score: r.readiness_score ?? 0,
          topical_coverage: r.topical_coverage ?? 0,
          thin_content_risk: !!r.thin_content_risk,
          cannibalization_risk: (r.cannibalization_risk as SemanticHubItem["cannibalization_risk"]) || "none",
          internal_links_count: r.internal_links_count ?? 0,
        };
      });
    },
  });

  const postsQ = useQuery({
    queryKey: ["semantic-ctx", "posts"],
    staleTime: STALE,
    queryFn: async (): Promise<SemanticPostItem[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from("blog_posts") as any)
        .select("id, slug, title")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return ((data || []) as Array<{ id: string; slug: string; title: string }>).map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        name: p.title,
      }));
    },
  });

  return {
    data: {
      themes: themesQ.data ?? [],
      combinations: combosQ.data ?? [],
      posts: postsQ.data ?? [],
    },
    isLoading: themesQ.isLoading || combosQ.isLoading || postsQ.isLoading,
  };
}
