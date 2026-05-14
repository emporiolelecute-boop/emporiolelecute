import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_text: string;
  product_name: string | null;
  occasion: string | null;
  rating: number;
  testimonial_date: string | null;
  position: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useTestimonials = () =>
  useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_visible', true)
        .order('position', { ascending: true });
      if (error) throw error;
      return (data || []) as Testimonial[];
    },
  });

export const useAdminTestimonials = () =>
  useQuery({
    queryKey: ['admin_testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('position', { ascending: true });
      if (error) throw error;
      return (data || []) as Testimonial[];
    },
  });

export const useUpsertTestimonial = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (t: Partial<Testimonial>) => {
      if (t.id) {
        const { id, created_at, updated_at, ...rest } = t;
        const { error } = await supabase.from('testimonials').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert([t as any]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      qc.invalidateQueries({ queryKey: ['admin_testimonials'] });
      toast({ title: 'Depoimento salvo' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
};

export const useDeleteTestimonial = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      qc.invalidateQueries({ queryKey: ['admin_testimonials'] });
      toast({ title: 'Depoimento removido' });
    },
  });
};
