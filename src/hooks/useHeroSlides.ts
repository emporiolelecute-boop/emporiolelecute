import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Modos de exibição de um slide do hero:
 *  - text_image    : layout padrão — texto à esquerda + imagem quadrada à direita (todos os tamanhos)
 *  - banner_mobile : banner full-width SEM texto — visível apenas em mobile/tablet (< md), some no desktop
 *  - banner_desktop: banner full-width SEM texto — visível apenas em desktop (≥ md), some no mobile
 */
export type HeroSlideMode = 'text_image' | 'banner_mobile' | 'banner_desktop';

export interface HeroSlide {
  id: string;
  /** Modo de exibição do slide */
  display_mode: HeroSlideMode;
  tagline: string | null;
  title: string;
  subtitle: string | null;
  /** Imagem principal (usada apenas em text_image) */
  image_url: string | null;
  /** Imagem para banner mobile (usada apenas em banner_mobile) */
  image_mobile_url: string | null;
  /** Imagem para banner desktop (usada apenas em banner_desktop) */
  image_desktop_url: string | null;
  /** Texto alternativo da imagem para acessibilidade */
  image_alt: string | null;
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, updated_at, ...rest } = slide;
        const { error } = await supabase.from('hero_slides').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('hero_slides').insert([slide as HeroSlide]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hero_slides'] });
      qc.invalidateQueries({ queryKey: ['admin_hero_slides'] });
      toast({ title: 'Slide salvo' });
    },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
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
