// Fase 7.1 — Admin de avaliações de produto
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminReview {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  source: string;
  source_url: string | null;
  external_review_id: string | null;
  is_verified: boolean;
  is_featured: boolean;
  is_visible: boolean;
  review_date: string | null;
  created_at: string;
  updated_at: string;
  images: string[];
  position: number;
}

export interface AdminReviewListParams {
  productId?: string;
  source?: string;
  rating?: number;
  featuredOnly?: boolean;
  hiddenOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export function useAdminReviews(params: AdminReviewListParams = {}) {
  const { productId, source, rating, featuredOnly, hiddenOnly, page = 0, pageSize = 25 } = params;
  return useQuery({
    queryKey: ['admin-reviews', params],
    staleTime: 30_000,
    queryFn: async () => {
      let q = supabase
        .from('product_reviews')
        .select('*, products!inner(id, name, slug)', { count: 'exact' })
        .order('is_featured', { ascending: false })
        .order('review_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (productId) q = q.eq('product_id', productId);
      if (source) q = q.eq('source', source);
      if (rating) q = q.eq('rating', rating);
      if (featuredOnly) q = q.eq('is_featured', true);
      if (hiddenOnly) q = q.eq('is_visible', false);

      const from = page * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await q.range(from, to);
      if (error) throw error;
      return { rows: (data ?? []) as any[], count: count ?? 0 };
    },
  });
}

export function useUpsertReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<AdminReview>) => {
      const { id, ...rest } = payload;
      if (id) {
        const { data, error } = await supabase
          .from('product_reviews')
          .update(rest as any)
          .eq('id', id)
          .select()
          .maybeSingle();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from('product_reviews')
        .insert(rest as any)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-reviews'] });
      qc.invalidateQueries({ queryKey: ['product-reviews'] });
      qc.invalidateQueries({ queryKey: ['product-review-stats'] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('product_reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-reviews'] });
      qc.invalidateQueries({ queryKey: ['product-reviews'] });
      qc.invalidateQueries({ queryKey: ['product-review-stats'] });
    },
  });
}
