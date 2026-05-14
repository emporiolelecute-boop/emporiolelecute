import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HeroSlide {
  id: string;
  tagline: string | null;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  position: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useHeroSlides = () =>
  useQuery({
    queryKey: ['hero_slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_visible', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return (data || []) as HeroSlide[];
    },
  });

export const useAdminHeroSlides = () =>
  useQuery({
    queryKey: ['admin_hero_slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('position', { ascending: true });
      if (error) throw error;
      return (data || []) as HeroSlide[];
    },
  });

export const useUpsertHeroSlide = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (slide: Partial<HeroSlide>) => {
      if (slide.id) {
        const { id, created_at, updated_at, ...rest } = slide;
        const { error } = await supabase.from('hero_slides').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('hero_slides').insert([slide as any]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hero_slides'] });
      qc.invalidateQueries({ queryKey: ['admin_hero_slides'] });
      toast({ title: 'Slide salvo' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
};

export const useDeleteHeroSlide = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hero_slides'] });
      qc.invalidateQueries({ queryKey: ['admin_hero_slides'] });
      toast({ title: 'Slide removido' });
    },
  });
};
