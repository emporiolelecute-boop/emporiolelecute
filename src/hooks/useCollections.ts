import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  position: number;
  is_active: boolean;
  show_on_home: boolean;
  home_position: number;
  meta_title: string | null;
  meta_description: string | null;
  product_count?: number;
}

export interface CollectionWithProducts extends Collection {
  products: Array<{
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
    position: number;
  }>;
}

export function useCollections(opts: { onlyActive?: boolean; onlyHome?: boolean } = {}) {
  const { onlyActive = true, onlyHome = false } = opts;
  return useQuery({
    queryKey: ['collections', { onlyActive, onlyHome }],
    queryFn: async (): Promise<Collection[]> => {
      let q = supabase
        .from('collections')
        .select('*, collection_products(product_id)');
      if (onlyActive) q = q.eq('is_active', true);
      if (onlyHome) q = q.eq('show_on_home', true);
      const { data, error } = await q.order('position', { ascending: true });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data || []).map((r: any) => ({
        ...r,
        product_count: Array.isArray(r.collection_products) ? r.collection_products.length : 0,
      })) as Collection[];
    },
  });
}

export function useCollectionBySlug(slug: string) {
  return useQuery({
    queryKey: ['collection', slug],
    enabled: !!slug,
    queryFn: async (): Promise<CollectionWithProducts | null> => {
      const { data: col, error } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      if (!col) return null;

      const { data: rows, error: e2 } = await supabase
        .from('collection_products')
        .select('position, product:products(id, slug, name, description, price, original_price, images, badge, rating, min_quantity, production_days, featured_weight, personalization_enabled, is_active)')
        .eq('collection_id', col.id)
        .order('position', { ascending: true });
      if (e2) throw e2;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const products = ((rows as any[]) || [])
        .map((r) => (r.product ? { ...r.product, position: r.position } : null))
        .filter((p): p is NonNullable<typeof p> => !!p && p.is_active);

      return { ...col, products } as CollectionWithProducts;
    },
  });
}
