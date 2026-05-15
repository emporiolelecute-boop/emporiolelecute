import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const KEY = "instagram_feed_embed_config";

export interface InstagramFeedConfig {
  visible_count: number;
  heading: string;
  subheading: string;
  description: string;
}

const DEFAULTS: InstagramFeedConfig = {
  visible_count: 6,
  heading: "Últimas postagens do Instagram",
  subheading: "@emporiolelecute",
  description: "",
};

export const useInstagramFeedConfig = () =>
  useQuery({
    queryKey: ["store_settings", KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("value")
        .eq("key", KEY)
        .maybeSingle();
      if (error) throw error;
      return { ...DEFAULTS, ...(((data?.value as Partial<InstagramFeedConfig>) || {}) as object) } as InstagramFeedConfig;
    },
  });

export const useSaveInstagramFeedConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cfg: InstagramFeedConfig) => {
      const safe: InstagramFeedConfig = {
        visible_count: Math.max(1, Math.min(12, Math.floor(Number(cfg.visible_count) || 6))),
        heading: (cfg.heading || "").slice(0, 120),
        subheading: (cfg.subheading || "").slice(0, 80),
        description: (cfg.description || "").slice(0, 280),
      };
      const { data: existing } = await supabase
        .from("store_settings")
        .select("id")
        .eq("key", KEY)
        .maybeSingle();
      if (existing) {
        const { error } = await supabase
          .from("store_settings")
          .update({ value: safe as any })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("store_settings")
          .insert({ key: KEY, value: safe as any });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store_settings", KEY] }),
  });
};
