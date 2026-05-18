import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type KitBundleType = "suggested" | "curated" | "premium";

export interface Kit {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  bundle_type: KitBundleType;
  estimated_savings: number | null;
  position: number;
  is_active: boolean;
  show_on_home: boolean;
  home_position: number;
  meta_title: string | null;
  meta_description: string | null;
  product_count?: number;
}

export interface KitProductItem {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  images: string[];
  badge: string | null;
  rating: number;
  min_quantity: number;
  production_days: number | null;
  featured_weight?: number | null;
  personalization_enabled?: boolean | null;
  /** Quantidade sugerida no kit. */
  kit_quantity: number;
  /** Ordem manual dentro do kit. */
  position: number;
}

export interface KitWithProducts extends Kit {
  products: KitProductItem[];
}

const PRODUCT_FIELDS =
  "id, slug, name, description, price, original_price, images, badge, rating, min_quantity, production_days, featured_weight, personalization_enabled, is_active";

export function useKits(opts: { onlyActive?: boolean; onlyHome?: boolean } = {}) {
  const { onlyActive = true, onlyHome = false } = opts;
  return useQuery({
    queryKey: ["kits", { onlyActive, onlyHome }],
    queryFn: async (): Promise<Kit[]> => {
      let q = (supabase as any)
        .from("kits")
        .select("*, kit_products(product_id)");
      if (onlyActive) q = q.eq("is_active", true);
      if (onlyHome) q = q.eq("show_on_home", true);
      const { data, error } = await q.order("position", { ascending: true });
      if (error) throw error;
      return (data || []).map((r: any) => ({
        ...r,
        product_count: Array.isArray(r.kit_products) ? r.kit_products.length : 0,
      })) as Kit[];
    },
  });
}

export function useKitBySlug(slug: string) {
  return useQuery({
    queryKey: ["kit", slug],
    enabled: !!slug,
    queryFn: async (): Promise<KitWithProducts | null> => {
      const { data: kit, error } = await (supabase as any)
        .from("kits")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      if (!kit) return null;

      const { data: rows, error: e2 } = await (supabase as any)
        .from("kit_products")
        .select(`quantity, position, product:products(${PRODUCT_FIELDS})`)
        .eq("kit_id", kit.id)
        .order("position", { ascending: true });
      if (e2) throw e2;

      const products: KitProductItem[] = ((rows as any[]) || [])
        .map((r) =>
          r.product && r.product.is_active
            ? { ...r.product, kit_quantity: r.quantity ?? 1, position: r.position ?? 0 }
            : null
        )
        .filter((p): p is KitProductItem => !!p);

      return { ...(kit as Kit), products };
    },
    staleTime: 60_000,
  });
}

/** Lista kits ativos que contêm um determinado produto. */
export function useKitsContainingProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ["kits-of-product", productId],
    enabled: !!productId,
    queryFn: async (): Promise<Kit[]> => {
      const { data, error } = await (supabase as any)
        .from("kit_products")
        .select("kit:kits!inner(*)")
        .eq("product_id", productId)
        .eq("kit.is_active", true);
      if (error) throw error;
      const seen = new Set<string>();
      const kits: Kit[] = [];
      for (const r of (data as any[]) || []) {
        const k = r.kit as Kit | null;
        if (k && !seen.has(k.id)) {
          seen.add(k.id);
          kits.push({ ...k, product_count: 0 });
        }
      }
      return kits.sort((a, b) => a.position - b.position);
    },
    staleTime: 60_000,
  });
}
