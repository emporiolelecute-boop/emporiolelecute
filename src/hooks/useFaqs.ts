import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export const useFaqs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data as FAQ[];
    },
  });
};

export const useAdminFaqs = () => {
  return useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data as FAQ[];
    },
  });
};

export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (faq: { question: string; answer: string; position?: number }) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert([faq])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      toast({
        title: 'FAQ criada',
        description: 'A pergunta foi adicionada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar FAQ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FAQ> & { id: string }) => {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      toast({
        title: 'FAQ atualizada',
        description: 'A pergunta foi atualizada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar FAQ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      toast({
        title: 'FAQ excluída',
        description: 'A pergunta foi removida com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir FAQ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useReorderFaqs = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (faqs: { id: string; position: number }[]) => {
      const promises = faqs.map(({ id, position }) =>
        supabase
          .from('faqs')
          .update({ position })
          .eq('id', id)
      );
      
      const results = await Promise.all(promises);
      const error = results.find(r => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao reordenar FAQs',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
