import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  price: number;
  original_price: number | null;
  min_quantity: number;
  pix_discount: number;
  production_days: number;
  weight: number | null;
  category_id: string | null;
  badge: string | null;
  rating: number;
  images: string[];
  features: string[];
  keywords: string[];
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Personalization fields
  personalization_enabled: boolean | null;
  personalization_label: string | null;
  personalization_placeholder: string | null;
  google_product_category: string | null;
  // Relations (populated by joins)
  category?: DbCategory | null;
  occasions?: DbOccasion[];
  tags?: DbTag[];
  segments?: DbSegment[];
}

export interface DbSegment {
  id: string;
  name: string;
  slug: string;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface DbOccasion {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface DbTag {
  id: string;
  name: string;
  slug: string;
  created_at: string | null;
}

// Fetch all products with relations (optimized single query with nested selects)
export function useDbProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          occasions:product_occasions(occasion:occasions(*)),
          tags:product_tags(tag:tags(*)),
          segments:product_segments(segment:segments(id,name,slug))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (products || []).map(product => ({
        ...product,
        occasions: (product.occasions || [])
          .map((po: { occasion: DbOccasion }) => po.occasion)
          .filter(Boolean),
        tags: (product.tags || [])
          .map((pt: { tag: DbTag }) => pt.tag)
          .filter(Boolean),
        segments: (product.segments || [])
          .map((ps: { segment: DbSegment }) => ps.segment)
          .filter(Boolean),
      })) as DbProduct[];
    },
  });
}

// Fetch single product by slug with relations (optimized single query with nested selects)
export function useDbProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          occasions:product_occasions(occasion:occasions(*)),
          tags:product_tags(tag:tags(*)),
          segments:product_segments(segment:segments(id,name,slug))
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!product) return null;

      return {
        ...product,
        occasions: (product.occasions || [])
          .map((po: { occasion: DbOccasion }) => po.occasion)
          .filter(Boolean),
        tags: (product.tags || [])
          .map((pt: { tag: DbTag }) => pt.tag)
          .filter(Boolean),
        segments: (product.segments || [])
          .map((ps: { segment: DbSegment }) => ps.segment)
          .filter(Boolean),
      } as DbProduct;
    },
    enabled: !!slug,
  });
}

// Fetch single product by ID
export function useDbProductById(id: string) {
  return useQuery({
    queryKey: ['product-by-id', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as DbProduct | null;
    },
    enabled: !!id,
  });
}

// Fetch all categories
export function useDbCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as DbCategory[];
    },
  });
}

// Fetch all occasions
export function useDbOccasions() {
  return useQuery({
    queryKey: ['occasions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('occasions')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as DbOccasion[];
    },
  });
}

// Create product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<DbProduct, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Update product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<DbProduct> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Category mutations
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: { name: string; slug: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// Occasion mutations
export function useCreateOccasion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (occasion: { name: string; slug: string }) => {
      const { data, error } = await supabase
        .from('occasions')
        .insert(occasion)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occasions'] });
    },
  });
}

export function useDeleteOccasion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('occasions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occasions'] });
    },
  });
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...category }: { id: string; name?: string; slug?: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// Update occasion
export function useUpdateOccasion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...occasion }: { id: string; name?: string; slug?: string }) => {
      const { data, error } = await supabase
        .from('occasions')
        .update(occasion)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occasions'] });
    },
  });
}
