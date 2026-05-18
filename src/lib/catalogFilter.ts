import type { DbProduct } from "@/hooks/useProducts";
import { getProductionSpeed, type ProductionSpeed } from "@/lib/productMeta";
import type { CatalogFilterValues } from "@/components/CatalogFilters";

export interface ProductForFilter {
  id: string;
  price: number;
  is_active?: boolean;
  personalization_enabled?: boolean | null;
  production_days?: number | null;
  production_speed?: ProductionSpeed | null;
  featured_weight?: number | null;
  created_at?: string;
  category?: { slug: string } | null;
  occasions?: { slug: string }[];
  tags?: { slug: string }[];
  segments?: { slug: string }[];
}

export function applyCatalogFilters<T extends ProductForFilter>(items: T[], f: CatalogFilterValues): T[] {
  return items.filter((p) => {
    if (f.onlyActive && p.is_active === false) return false;
    if (f.priceMin != null && p.price < f.priceMin) return false;
    if (f.priceMax != null && p.price > f.priceMax) return false;
    if (f.personalizable === true && !p.personalization_enabled) return false;
    if (f.personalizable === false && p.personalization_enabled) return false;
    if (f.speeds.length > 0) {
      const sp = getProductionSpeed({ production_days: p.production_days, production_speed: p.production_speed });
      if (!sp || !f.speeds.includes(sp)) return false;
    }
    if (f.categorySlugs.length > 0) {
      if (!p.category?.slug || !f.categorySlugs.includes(p.category.slug)) return false;
    }
    if (f.occasionSlugs.length > 0) {
      const slugs = (p.occasions || []).map((x) => x.slug);
      if (!f.occasionSlugs.some((s) => slugs.includes(s))) return false;
    }
    if (f.tagSlugs.length > 0) {
      const slugs = (p.tags || []).map((x) => x.slug);
      if (!f.tagSlugs.some((s) => slugs.includes(s))) return false;
    }
    if (f.segmentSlugs.length > 0) {
      const slugs = (p.segments || []).map((x) => x.slug);
      if (!f.segmentSlugs.some((s) => slugs.includes(s))) return false;
    }
    return true;
  });
}

/** Editorial sort: featured_weight desc → rating desc → created_at desc */
export function sortByFeatured<T extends ProductForFilter & { rating?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const fw = (b.featured_weight ?? 0) - (a.featured_weight ?? 0);
    if (fw !== 0) return fw;
    const r = (b.rating ?? 0) - (a.rating ?? 0);
    if (r !== 0) return r;
    if (a.created_at && b.created_at) return a.created_at < b.created_at ? 1 : -1;
    return 0;
  });
}

export function priceBoundsFrom(items: Array<{ price: number }>): { min: number; max: number } {
  if (!items.length) return { min: 0, max: 500 };
  let lo = Infinity, hi = -Infinity;
  for (const p of items) {
    if (p.price < lo) lo = p.price;
    if (p.price > hi) hi = p.price;
  }
  if (!isFinite(lo)) lo = 0;
  if (!isFinite(hi)) hi = lo + 100;
  return { min: Math.floor(lo), max: Math.ceil(hi) };
}

export type _DbProductCompat = DbProduct;
