import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface OccasionLandingFAQ {
  question: string;
  answer: string;
}

export interface OccasionLandingTestimonial {
  name: string;
  location?: string;
  text: string;
  rating?: number;
}

export interface OccasionLandingStat {
  value: string;
  label: string;
}

export interface OccasionLanding {
  id: string;
  route_slug: string;
  occasion_slug: string;
  h1: string;
  hero_badge: string;
  hero_subtitle: string;
  theme_accent: string;
  seo_title: string;
  seo_description: string;
  seo_copy: string;
  whatsapp_message: string;
  faqs: OccasionLandingFAQ[];
  gallery: string[];
  testimonials: OccasionLandingTestimonial[];
  social_proof_stats: OccasionLandingStat[];
  related_route_slugs: string[];
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const TABLE = "occasion_landings" as const;

const normalize = (row: any): OccasionLanding => ({
  ...row,
  faqs: Array.isArray(row.faqs) ? row.faqs : [],
  gallery: Array.isArray(row.gallery) ? row.gallery : [],
  testimonials: Array.isArray(row.testimonials) ? row.testimonials : [],
  social_proof_stats: Array.isArray(row.social_proof_stats) ? row.social_proof_stats : [],
  related_route_slugs: Array.isArray(row.related_route_slugs) ? row.related_route_slugs : [],
});

/** Public — only published landings */
export const useOccasionLanding = (routeSlug: string) => {
  return useQuery({
    queryKey: ["occasion-landing", routeSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("route_slug", routeSlug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data ? normalize(data) : null;
    },
  });
};

/** Public — list all published landings (for related/silo links) */
export const usePublishedOccasionLandings = () => {
  return useQuery({
    queryKey: ["occasion-landings", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("is_published", true)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data || []).map(normalize);
    },
  });
};

/** Admin — all landings (published + drafts) */
export const useAdminOccasionLandings = () => {
  return useQuery({
    queryKey: ["occasion-landings", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return (data || []).map(normalize);
    },
  });
};

export const useUpsertOccasionLanding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<OccasionLanding> & { route_slug: string }) => {
      const { data, error } = await supabase
        .from(TABLE)
        .upsert(input as any, { onConflict: "route_slug" })
        .select()
        .single();
      if (error) throw error;
      return normalize(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["occasion-landings"] });
      qc.invalidateQueries({ queryKey: ["occasion-landing"] });
      toast({ title: "Landing salva", description: "Conteúdo atualizado com sucesso." });
    },
    onError: (e: any) => {
      toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" });
    },
  });
};

export const useDeleteOccasionLanding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(TABLE).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["occasion-landings"] });
      toast({ title: "Landing excluída" });
    },
    onError: (e: any) => {
      toast({ title: "Erro ao excluir", description: e.message, variant: "destructive" });
    },
  });
};
