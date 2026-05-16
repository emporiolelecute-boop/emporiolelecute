import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_indexed: boolean;
  is_published: boolean;
  published_at: string | null;
  author: string | null;
  reading_time: number | null;
  featured: boolean;
  faqs: Array<{ question: string; answer: string }>;
  related_products: string[];
  related_categories: string[];
  related_occasions: string[];
  related_segments: string[];
  related_tags: string[];
  position: number;
  created_at: string;
  updated_at: string;
}

/** Posts publicados (público) */
export function useDbBlogPosts() {
  return useQuery({
    queryKey: ["blog_posts", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(100);
      if (error) throw error;
      return (data || []) as unknown as DbBlogPost[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDbBlogPostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["blog_posts", "slug", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug as string)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as DbBlogPost | null;
    },
    staleTime: 5 * 60 * 1000,
  });
}
