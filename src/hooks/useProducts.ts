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
  elo7_link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Personalization fields
  personalization_enabled: boolean | null;
  personalization_label: string | null;
  personalization_placeholder: string | null;
  // Relations (populated by joins)
  category?: DbCategory | null;
  occasions?: DbOccasion[];
  tags?: DbTag[];
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

// Fetch all products with relations
export function useDbProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // First fetch products with category
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch product_occasions relationships
      const { data: productOccasions } = await supabase
        .from('product_occasions')
        .select('product_id, occasion:occasions(*)');

      // Fetch product_tags relationships
      const { data: productTags } = await supabase
        .from('product_tags')
        .select('product_id, tag:tags(*)');

      // Map occasions and tags to products
      const productsWithRelations = (products || []).map(product => {
        const occasions = (productOccasions || [])
          .filter(po => po.product_id === product.id)
          .map(po => po.occasion)
          .filter(Boolean) as DbOccasion[];

        const tags = (productTags || [])
          .filter(pt => pt.product_id === product.id)
          .map(pt => pt.tag)
          .filter(Boolean) as DbTag[];

        return {
          ...product,
          occasions,
          tags,
        };
      });

      return productsWithRelations as DbProduct[];
    },
  });
}

// Fetch single product by slug with relations
export function useDbProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!product) return null;

      // Fetch occasions for this product
      const { data: productOccasions } = await supabase
        .from('product_occasions')
        .select('occasion:occasions(*)')
        .eq('product_id', product.id);

      // Fetch tags for this product
      const { data: productTags } = await supabase
        .from('product_tags')
        .select('tag:tags(*)')
        .eq('product_id', product.id);

      const occasions = (productOccasions || [])
        .map(po => po.occasion)
        .filter(Boolean) as DbOccasion[];

      const tags = (productTags || [])
        .map(pt => pt.tag)
        .filter(Boolean) as DbTag[];

      return {
        ...product,
        occasions,
        tags,
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
