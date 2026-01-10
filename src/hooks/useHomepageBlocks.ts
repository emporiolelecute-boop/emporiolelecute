import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface HomepageBlock {
  id: string;
  block_key: string;
  block_type: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  link_text: string | null;
  position: number;
  is_visible: boolean;
  content: Json;
  created_at: string;
  updated_at: string;
}

// Fetch all homepage blocks
export function useHomepageBlocks(blockType?: string) {
  return useQuery({
    queryKey: ['homepage_blocks', blockType],
    queryFn: async () => {
      let query = supabase
        .from('homepage_blocks')
        .select('*')
        .order('position', { ascending: true });

      if (blockType) {
        query = query.eq('block_type', blockType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HomepageBlock[];
    },
  });
}

// Fetch single block by key
export function useHomepageBlock(blockKey: string) {
  return useQuery({
    queryKey: ['homepage_block', blockKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_blocks')
        .select('*')
        .eq('block_key', blockKey)
        .maybeSingle();

      if (error) throw error;
      return data as HomepageBlock | null;
    },
    enabled: !!blockKey,
  });
}

// Admin fetch (all blocks regardless of visibility)
export function useAdminHomepageBlocks(blockType?: string) {
  return useQuery({
    queryKey: ['admin_homepage_blocks', blockType],
    queryFn: async () => {
      let query = supabase
        .from('homepage_blocks')
        .select('*')
        .order('position', { ascending: true });

      if (blockType) {
        query = query.eq('block_type', blockType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HomepageBlock[];
    },
  });
}

// Update block
export function useUpdateHomepageBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HomepageBlock> & { id: string }) => {
      const { data, error } = await supabase
        .from('homepage_blocks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage_blocks'] });
      queryClient.invalidateQueries({ queryKey: ['admin_homepage_blocks'] });
      queryClient.invalidateQueries({ queryKey: ['homepage_block'] });
    },
  });
}

// Create block
export function useCreateHomepageBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (block: Omit<HomepageBlock, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('homepage_blocks')
        .insert([block])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage_blocks'] });
      queryClient.invalidateQueries({ queryKey: ['admin_homepage_blocks'] });
    },
  });
}

// Delete block
export function useDeleteHomepageBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('homepage_blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage_blocks'] });
      queryClient.invalidateQueries({ queryKey: ['admin_homepage_blocks'] });
    },
  });
}