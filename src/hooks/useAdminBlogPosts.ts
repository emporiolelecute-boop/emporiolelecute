import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbBlogPost } from "./useDbBlogPosts";

export function useAdminBlogPosts() {
  return useQuery({
    queryKey: ["admin", "blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []) as unknown as DbBlogPost[];
    },
  });
}

export function useUpsertBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: Partial<DbBlogPost> & { id?: string }) => {
      const payload: any = { ...post };
      if (!payload.id) delete payload.id;
      if (payload.is_published && !payload.published_at) {
        payload.published_at = new Date().toISOString();
      }
      const { data, error } = await supabase
        .from("blog_posts")
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      qc.invalidateQueries({ queryKey: ["blog_posts"] });
      toast.success("Post salvo com sucesso");
    },
    onError: (e: any) => toast.error(e.message || "Erro ao salvar post"),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      qc.invalidateQueries({ queryKey: ["blog_posts"] });
      toast.success("Post removido");
    },
    onError: (e: any) => toast.error(e.message || "Erro ao remover"),
  });
}
