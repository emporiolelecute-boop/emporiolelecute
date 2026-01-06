import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_canonical: string | null;
  seo_noindex: boolean;
  seo_nofollow: boolean;
  status: 'draft' | 'published';
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}

export interface PageVersion {
  id: string;
  page_id: string;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  version_number: number;
  created_at: string;
  created_by: string | null;
}

export const usePages = () => {
  return useQuery({
    queryKey: ['pages'],
    queryFn: async (): Promise<Page[]> => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('title');

      if (error) throw error;
      return (data || []) as Page[];
    },
  });
};

export const usePage = (slug: string) => {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: async (): Promise<Page | null> => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data as Page | null;
    },
    enabled: !!slug,
  });
};

export const usePageById = (id: string) => {
  return useQuery({
    queryKey: ['page', 'id', id],
    queryFn: async (): Promise<Page | null> => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Page | null;
    },
    enabled: !!id,
  });
};

export const usePageVersions = (pageId: string) => {
  return useQuery({
    queryKey: ['page_versions', pageId],
    queryFn: async (): Promise<PageVersion[]> => {
      const { data, error } = await supabase
        .from('page_versions')
        .select('*')
        .eq('page_id', pageId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return (data || []) as PageVersion[];
    },
    enabled: !!pageId,
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: { title: string; slug: string; content?: string; status?: string; seo_title?: string; seo_description?: string }) => {
      const { data, error } = await supabase
        .from('pages')
        .insert([page])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...page }: Partial<Page> & { id: string }) => {
      const { data, error } = await supabase
        .from('pages')
        .update({ ...page, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', data.slug] });
      queryClient.invalidateQueries({ queryKey: ['page', 'id', data.id] });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

export const useSavePageVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pageId, content, seo_title, seo_description }: { pageId: string; content: string; seo_title?: string; seo_description?: string }) => {
      // Get current version count
      const { data: versions } = await supabase
        .from('page_versions')
        .select('version_number')
        .eq('page_id', pageId)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersion = (versions?.[0]?.version_number || 0) + 1;

      const { data, error } = await supabase
        .from('page_versions')
        .insert({
          page_id: pageId,
          content,
          seo_title,
          seo_description,
          version_number: nextVersion,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: ['page_versions', pageId] });
    },
  });
};

export const useDuplicatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: Page) => {
      const newSlug = `${page.slug}-copia-${Date.now()}`;
      const { data, error } = await supabase
        .from('pages')
        .insert({
          title: `${page.title} (Cópia)`,
          slug: newSlug,
          content: page.content,
          seo_title: page.seo_title,
          seo_description: page.seo_description,
          seo_canonical: page.seo_canonical,
          seo_noindex: page.seo_noindex,
          seo_nofollow: page.seo_nofollow,
          status: 'draft',
          internal_notes: page.internal_notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};
