import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface InstagramFeedEmbed {
  id: string;
  post_url: string;
  caption: string | null;
  preview_image_url: string | null;
  position: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const TABLE = "instagram_feed_embeds" as const;

export const INSTAGRAM_URL_REGEX =
  /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?/i;

export const useInstagramFeedEmbedsPublic = () =>
  useQuery({
    queryKey: ["instagram_feed_embeds", "public"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(TABLE)
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true })
        .limit(6);
      if (error) throw error;
      return (data || []) as InstagramFeedEmbed[];
    },
  });

export const useInstagramFeedEmbedsAdmin = () =>
  useQuery({
    queryKey: ["instagram_feed_embeds", "admin"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(TABLE)
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return (data || []) as InstagramFeedEmbed[];
    },
  });

export const useSaveInstagramFeedEmbed = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<InstagramFeedEmbed> & { id?: string }) => {
      if (item.id) {
        const { error } = await (supabase as any).from(TABLE).update({
          post_url: item.post_url,
          caption: item.caption ?? null,
          preview_image_url: item.preview_image_url ?? null,
          position: item.position ?? 0,
          is_active: item.is_active ?? true,
        }).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from(TABLE).insert({
          post_url: item.post_url!,
          caption: item.caption ?? null,
          preview_image_url: item.preview_image_url ?? null,
          position: item.position ?? 0,
          is_active: item.is_active ?? true,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["instagram_feed_embeds"] }),
  });
};

export const useDeleteInstagramFeedEmbed = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(TABLE).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["instagram_feed_embeds"] }),
  });
};
