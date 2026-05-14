import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Redirect {
  id: string;
  from_path: string;
  to_path: string;
  status_code: number;
  is_active: boolean;
  hits: number;
  notes: string | null;
}

export const useRedirects = () =>
  useQuery({
    queryKey: ["redirects", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("redirects")
        .select("*")
        .order("from_path");
      if (error) throw error;
      return data as Redirect[];
    },
  });

export const useActiveRedirects = () =>
  useQuery({
    queryKey: ["redirects", "active"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("redirects")
        .select("from_path,to_path,status_code")
        .eq("is_active", true);
      if (error) throw error;
      return (data ?? []) as Pick<Redirect, "from_path" | "to_path" | "status_code">[];
    },
  });

export const useUpsertRedirect = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (r: Partial<Redirect> & { from_path: string; to_path: string }) => {
      if (r.id) {
        const { error } = await supabase.from("redirects").update(r).eq("id", r.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("redirects").insert(r);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });
};

export const useDeleteRedirect = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("redirects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });
};
