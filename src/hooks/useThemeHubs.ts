/**
 * Fase 10.3 — Hooks de Hubs Temáticos.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ThemeHub } from "@/lib/themeGovernance";

const TABLE = "theme_hubs" as const;

export function useThemeHubs() {
  return useQuery({
    queryKey: ["theme_hubs"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from(TABLE) as any)
        .select("*")
        .order("authority_score", { ascending: false });
      if (error) throw error;
      return (data as ThemeHub[]) ?? [];
    },
  });
}

export function useThemeHubBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["theme_hub", slug],
    enabled: !!slug,
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from(TABLE) as any)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as ThemeHub | null) ?? null;
    },
  });
}

export function useUpdateThemeHub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<ThemeHub> }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(TABLE) as any).update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["theme_hubs"] });
      qc.invalidateQueries({ queryKey: ["theme_hub"] });
    },
  });
}

export function useCreateThemeHub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (hub: Partial<ThemeHub> & { slug: string; title: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from(TABLE) as any).insert(hub).select().single();
      if (error) throw error;
      return data as ThemeHub;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["theme_hubs"] }),
  });
}

export function useDeleteThemeHub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(TABLE) as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["theme_hubs"] }),
  });
}
