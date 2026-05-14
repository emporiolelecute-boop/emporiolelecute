import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RobotsConfig {
  allow_indexing: boolean;
  disallow_paths: string[];
  blocked_category_slugs: string[];
  custom_directives: string;
  sitemap_url: string;
}

export const DEFAULT_ROBOTS: RobotsConfig = {
  allow_indexing: true,
  disallow_paths: ["/admin", "/admin/*", "/carrinho", "/rastrear"],
  blocked_category_slugs: [],
  custom_directives: "",
  sitemap_url: "https://emporiolelecute.com.br/sitemap.xml",
};

export const useRobotsConfig = () =>
  useQuery({
    queryKey: ["store_settings", "robots_config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("value")
        .eq("key", "robots_config")
        .maybeSingle();
      if (error) throw error;
      return { ...DEFAULT_ROBOTS, ...((data?.value as Partial<RobotsConfig>) ?? {}) };
    },
  });

export const useUpdateRobotsConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cfg: RobotsConfig) => {
      const { data: existing } = await supabase
        .from("store_settings")
        .select("id")
        .eq("key", "robots_config")
        .maybeSingle();
      if (existing) {
        const { error } = await supabase
          .from("store_settings")
          .update({ value: cfg as any })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("store_settings")
          .insert({ key: "robots_config", value: cfg as any });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store_settings", "robots_config"] }),
  });
};

export function buildRobotsTxt(cfg: RobotsConfig): string {
  const lines: string[] = ["User-agent: *"];
  if (!cfg.allow_indexing) {
    lines.push("Disallow: /");
  } else {
    lines.push("Allow: /");
    for (const p of cfg.disallow_paths) lines.push(`Disallow: ${p}`);
    for (const slug of cfg.blocked_category_slugs) lines.push(`Disallow: /produtos?categoria=${slug}`);
  }
  if (cfg.custom_directives.trim()) {
    lines.push("");
    lines.push(cfg.custom_directives.trim());
  }
  if (cfg.sitemap_url) {
    lines.push("");
    lines.push(`Sitemap: ${cfg.sitemap_url}`);
  }
  return lines.join("\n") + "\n";
}
