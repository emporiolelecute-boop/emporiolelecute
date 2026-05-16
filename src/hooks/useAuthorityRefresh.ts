/**
 * Fase 10.4 — useAuthorityRefresh
 *
 * Recalcula sob demanda (botão admin) os scores de autoridade de:
 *  - theme_hubs
 *  - combination_pages_registry
 *
 * SEM cron, SEM job externo, SEM auto-indexação. Apenas persistência
 * para alimentar dashboards e o readiness score.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  calculateThemeAuthority,
  calculateCombinationAuthority,
  calculateIndexReadiness,
  detectCannibalization,
  type AuthoritySignals,
} from "@/lib/authorityEngine";

type RefreshTarget = "themes" | "combinations" | "all";

interface RefreshResult {
  themesUpdated: number;
  combinationsUpdated: number;
}

async function fetchProductsCount(): Promise<number> {
  const { count } = await supabase
    .from("products")
    .select("id", { head: true, count: "exact" })
    .eq("is_active", true);
  return count ?? 0;
}

async function refreshThemes(): Promise<number> {
  const { data: hubs, error } = await supabase
    .from("theme_hubs")
    .select(
      "id, slug, tag_id, editorial_content, hero_image_url, related_occasions, related_segments, related_posts, related_themes"
    );
  if (error) throw error;
  if (!hubs?.length) return 0;

  let updated = 0;
  for (const h of hubs as any[]) {
    let productsCount = 0;
    if (h.tag_id) {
      const { count } = await supabase
        .from("product_tags")
        .select("product_id", { head: true, count: "exact" })
        .eq("tag_id", h.tag_id);
      productsCount = count ?? 0;
    }

    const occasionsCount = (h.related_occasions ?? []).length;
    const segmentsCount  = (h.related_segments ?? []).length;
    const blogPostsCount = (h.related_posts ?? []).length;
    const relatedContentCount = (h.related_themes ?? []).length;

    const signals: AuthoritySignals = {
      productsCount,
      occasionsCount,
      segmentsCount,
      categoriesCount: 0,
      tagsCount: h.tag_id ? 1 : 0,
      reviewsCount: 0,
      hasEditorial: Boolean(h.editorial_content?.length),
      goodImagesCount: h.hero_image_url ? 1 : 0,
      visualDiversity: Math.min(1, productsCount / 20),
      blogPostsCount,
      relatedContentCount,
      internalLinksCount: occasionsCount + segmentsCount + blogPostsCount,
    };

    const a = calculateThemeAuthority(signals);
    const cannibal = detectCannibalization({
      slug: h.slug,
      competingSlugs: [],
    });
    const readiness = calculateIndexReadiness({
      authority: a.authority,
      topicalCoverage: a.topicalCoverage,
      internalLinksCount: signals.internalLinksCount,
      reviewsCount: signals.reviewsCount,
      diversity: occasionsCount + segmentsCount,
      thinContentRisk: a.thinContentRisk,
      cannibalization: cannibal,
    });

    const { error: upErr } = await supabase
      .from("theme_hubs")
      .update({
        authority_score: a.authority,
        topical_coverage: a.topicalCoverage,
        thin_content_risk: a.thinContentRisk,
        cannibalization_risk: cannibal,
        readiness_score: readiness.score,
        internal_links_count: signals.internalLinksCount,
        last_authority_refresh: new Date().toISOString(),
        last_evaluated_at: new Date().toISOString(),
      } as any)
      .eq("id", h.id);
    if (!upErr) updated++;
  }
  return updated;
}

async function refreshCombinations(): Promise<number> {
  const { data: rows, error } = await supabase
    .from("combination_pages_registry")
    .select(
      "id, path, primary_type, primary_slug, secondary_slug, products_count, has_editorial, has_faq, meta_title, meta_description"
    );
  if (error) throw error;
  if (!rows?.length) return 0;

  let updated = 0;
  for (const r of rows as any[]) {
    const productsCount = r.products_count ?? 0;
    const signals: AuthoritySignals = {
      productsCount,
      occasionsCount: 1,
      segmentsCount: r.primary_type === "segment" ? 1 : 0,
      categoriesCount: r.primary_type === "category" ? 1 : 0,
      tagsCount: r.primary_type === "tag" ? 1 : 0,
      reviewsCount: 0,
      hasEditorial: Boolean(r.has_editorial),
      goodImagesCount: productsCount >= 6 ? 3 : 1,
      visualDiversity: Math.min(1, productsCount / 16),
      blogPostsCount: 0,
      relatedContentCount: 0,
      internalLinksCount: 2,
    };
    const a = calculateCombinationAuthority(signals);
    const cannibal = detectCannibalization({
      slug: `${r.primary_slug}-${r.secondary_slug}`,
      competingSlugs: [r.primary_slug, r.secondary_slug],
    });
    const readiness = calculateIndexReadiness({
      authority: a.authority,
      topicalCoverage: a.topicalCoverage,
      internalLinksCount: signals.internalLinksCount,
      reviewsCount: signals.reviewsCount,
      diversity: 2,
      thinContentRisk: a.thinContentRisk,
      cannibalization: cannibal,
    });

    const { error: upErr } = await supabase
      .from("combination_pages_registry")
      .update({
        quality_score: a.authority,
        confidence_score: a.topicalCoverage,
        thin_content_risk: a.thinContentRisk,
        cannibalization_risk: cannibal,
        readiness_score: readiness.score,
        topical_coverage: a.topicalCoverage,
        internal_links_count: signals.internalLinksCount,
        last_authority_refresh: new Date().toISOString(),
        last_evaluated_at: new Date().toISOString(),
      } as any)
      .eq("id", r.id);
    if (!upErr) updated++;
  }
  return updated;
}

export function useAuthorityRefresh() {
  const qc = useQueryClient();
  return useMutation<RefreshResult, Error, RefreshTarget | void>({
    mutationFn: async (target) => {
      const t = target ?? "all";
      // pré-fetch usado para escalar diversidade (não bloqueante).
      await fetchProductsCount().catch(() => 0);
      const themesUpdated = t === "combinations" ? 0 : await refreshThemes();
      const combinationsUpdated = t === "themes" ? 0 : await refreshCombinations();
      return { themesUpdated, combinationsUpdated };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["theme-hubs"] });
      qc.invalidateQueries({ queryKey: ["combination-pages"] });
      qc.invalidateQueries({ queryKey: ["authority-center"] });
    },
  });
}
