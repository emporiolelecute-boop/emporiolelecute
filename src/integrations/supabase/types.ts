export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      coupon_uses: {
        Row: {
          coupon_id: string
          created_at: string
          discount_applied: number | null
          id: string
          order_id: string | null
          subtotal: number | null
        }
        Insert: {
          coupon_id: string
          created_at?: string
          discount_applied?: number | null
          id?: string
          order_id?: string | null
          subtotal?: number | null
        }
        Update: {
          coupon_id?: string
          created_at?: string
          discount_applied?: number | null
          id?: string
          order_id?: string | null
          subtotal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_uses_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_uses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_uses: number | null
          min_subtotal: number
          updated_at: string
          used_count: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_subtotal?: number
          updated_at?: string
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_subtotal?: number
          updated_at?: string
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_visible: boolean | null
          position: number | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_visible?: boolean | null
          position?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_visible?: boolean | null
          position?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          created_at: string
          cta_label: string | null
          cta_url: string | null
          id: string
          image_url: string | null
          is_visible: boolean
          position: number
          subtitle: string | null
          tagline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          position?: number
          subtitle?: string | null
          tagline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean
          position?: number
          subtitle?: string | null
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_blocks: {
        Row: {
          block_key: string
          block_type: string
          content: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_visible: boolean | null
          link_text: string | null
          link_url: string | null
          position: number | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          block_key: string
          block_type?: string
          content?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          link_text?: string | null
          link_url?: string | null
          position?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          block_key?: string
          block_type?: string
          content?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          link_text?: string | null
          link_url?: string | null
          position?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      instagram_posts: {
        Row: {
          alt_text: string
          created_at: string
          id: string
          image_url: string
          is_visible: boolean
          position: number
          post_url: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string
          created_at?: string
          id?: string
          image_url: string
          is_visible?: boolean
          position?: number
          post_url?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          id?: string
          image_url?: string
          is_visible?: boolean
          position?: number
          post_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          created_at: string | null
          id: string
          is_external: boolean | null
          is_visible: boolean | null
          label: string
          menu_location: string
          page_id: string | null
          parent_id: string | null
          position: number | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_external?: boolean | null
          is_visible?: boolean | null
          label: string
          menu_location: string
          page_id?: string | null
          parent_id?: string | null
          position?: number | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_external?: boolean | null
          is_visible?: boolean | null
          label?: string
          menu_location?: string
          page_id?: string | null
          parent_id?: string | null
          position?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      occasion_landings: {
        Row: {
          created_at: string
          faqs: Json
          gallery: Json
          h1: string
          hero_badge: string
          hero_subtitle: string
          id: string
          is_published: boolean
          occasion_slug: string
          og_image_alt: string | null
          og_image_url: string | null
          position: number
          related_route_slugs: string[]
          route_slug: string
          seo_copy: string
          seo_description: string
          seo_title: string
          social_proof_stats: Json
          testimonials: Json
          theme_accent: string
          updated_at: string
          whatsapp_message: string
        }
        Insert: {
          created_at?: string
          faqs?: Json
          gallery?: Json
          h1: string
          hero_badge: string
          hero_subtitle: string
          id?: string
          is_published?: boolean
          occasion_slug: string
          og_image_alt?: string | null
          og_image_url?: string | null
          position?: number
          related_route_slugs?: string[]
          route_slug: string
          seo_copy: string
          seo_description: string
          seo_title: string
          social_proof_stats?: Json
          testimonials?: Json
          theme_accent?: string
          updated_at?: string
          whatsapp_message: string
        }
        Update: {
          created_at?: string
          faqs?: Json
          gallery?: Json
          h1?: string
          hero_badge?: string
          hero_subtitle?: string
          id?: string
          is_published?: boolean
          occasion_slug?: string
          og_image_alt?: string | null
          og_image_url?: string | null
          position?: number
          related_route_slugs?: string[]
          route_slug?: string
          seo_copy?: string
          seo_description?: string
          seo_title?: string
          social_proof_stats?: Json
          testimonials?: Json
          theme_accent?: string
          updated_at?: string
          whatsapp_message?: string
        }
        Relationships: []
      }
      occasions: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          personalization: string | null
          product_image: string | null
          product_name: string
          product_slug: string | null
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          personalization?: string | null
          product_image?: string | null
          product_name: string
          product_slug?: string | null
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          personalization?: string | null
          product_image?: string | null
          product_name?: string
          product_slug?: string | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_cep: string
          address_city: string
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string
          address_street: string | null
          coupon_code: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_amount: number
          id: string
          notes: string | null
          order_code: string
          shipping_company: string | null
          shipping_days: string | null
          shipping_method: string
          shipping_price: number
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          address_cep: string
          address_city: string
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state: string
          address_street?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_amount?: number
          id?: string
          notes?: string | null
          order_code: string
          shipping_company?: string | null
          shipping_days?: string | null
          shipping_method: string
          shipping_price?: number
          status?: string
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          address_cep?: string
          address_city?: string
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string
          address_street?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount_amount?: number
          id?: string
          notes?: string | null
          order_code?: string
          shipping_company?: string | null
          shipping_days?: string | null
          shipping_method?: string
          shipping_price?: number
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      page_versions: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          page_id: string | null
          seo_description: string | null
          seo_title: string | null
          version_number: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          page_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          version_number?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          page_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          internal_notes: string | null
          published_at: string | null
          seo_canonical: string | null
          seo_description: string | null
          seo_nofollow: boolean | null
          seo_noindex: boolean | null
          seo_title: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          internal_notes?: string | null
          published_at?: string | null
          seo_canonical?: string | null
          seo_description?: string | null
          seo_nofollow?: boolean | null
          seo_noindex?: boolean | null
          seo_title?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          internal_notes?: string | null
          published_at?: string | null
          seo_canonical?: string | null
          seo_description?: string | null
          seo_nofollow?: boolean | null
          seo_noindex?: boolean | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      product_occasions: {
        Row: {
          occasion_id: string
          product_id: string
        }
        Insert: {
          occasion_id: string
          product_id: string
        }
        Update: {
          occasion_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_occasions_occasion_id_fkey"
            columns: ["occasion_id"]
            isOneToOne: false
            referencedRelation: "occasions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_occasions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          product_id: string
          tag_id: string
        }
        Insert: {
          product_id: string
          tag_id: string
        }
        Update: {
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          category_id: string | null
          created_at: string
          description: string | null
          elo7_link: string | null
          features: string[] | null
          google_product_category: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          keywords: string[] | null
          long_description: string | null
          min_quantity: number | null
          name: string
          original_price: number | null
          personalization_enabled: boolean | null
          personalization_label: string | null
          personalization_placeholder: string | null
          pix_discount: number | null
          price: number
          production_days: number | null
          rating: number | null
          seo_noindex: boolean
          slug: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          badge?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          elo7_link?: string | null
          features?: string[] | null
          google_product_category?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          keywords?: string[] | null
          long_description?: string | null
          min_quantity?: number | null
          name: string
          original_price?: number | null
          personalization_enabled?: boolean | null
          personalization_label?: string | null
          personalization_placeholder?: string | null
          pix_discount?: number | null
          price: number
          production_days?: number | null
          rating?: number | null
          seo_noindex?: boolean
          slug: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          badge?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          elo7_link?: string | null
          features?: string[] | null
          google_product_category?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          keywords?: string[] | null
          long_description?: string | null
          min_quantity?: number | null
          name?: string
          original_price?: number | null
          personalization_enabled?: boolean | null
          personalization_label?: string | null
          personalization_placeholder?: string | null
          pix_discount?: number | null
          price?: number
          production_days?: number | null
          rating?: number | null
          seo_noindex?: boolean
          slug?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string
          from_path: string
          hits: number
          id: string
          is_active: boolean
          notes: string | null
          status_code: number
          to_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_path: string
          hits?: number
          id?: string
          is_active?: boolean
          notes?: string | null
          status_code?: number
          to_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_path?: string
          hits?: number
          id?: string
          is_active?: boolean
          notes?: string | null
          status_code?: number
          to_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_check_runs: {
        Row: {
          alert_error: string | null
          alert_sent: boolean
          checks: Json
          errors: number
          id: string
          passed: number
          ran_at: string
          source: string
          total: number
          warnings: number
        }
        Insert: {
          alert_error?: string | null
          alert_sent?: boolean
          checks?: Json
          errors?: number
          id?: string
          passed?: number
          ran_at?: string
          source?: string
          total?: number
          warnings?: number
        }
        Update: {
          alert_error?: string | null
          alert_sent?: boolean
          checks?: Json
          errors?: number
          id?: string
          passed?: number
          ran_at?: string
          source?: string
          total?: number
          warnings?: number
        }
        Relationships: []
      }
      seo_snapshots: {
        Row: {
          authority_score: number | null
          avg_position: number | null
          backlinks_total: number | null
          captured_at: string
          domain: string
          id: string
          notes: string | null
          organic_cost: number | null
          organic_keywords: number | null
          organic_traffic: number | null
          raw: Json | null
          referring_domains: number | null
          source: string
          top_keywords: Json | null
          total_clicks: number | null
          total_impressions: number | null
        }
        Insert: {
          authority_score?: number | null
          avg_position?: number | null
          backlinks_total?: number | null
          captured_at?: string
          domain?: string
          id?: string
          notes?: string | null
          organic_cost?: number | null
          organic_keywords?: number | null
          organic_traffic?: number | null
          raw?: Json | null
          referring_domains?: number | null
          source: string
          top_keywords?: Json | null
          total_clicks?: number | null
          total_impressions?: number | null
        }
        Update: {
          authority_score?: number | null
          avg_position?: number | null
          backlinks_total?: number | null
          captured_at?: string
          domain?: string
          id?: string
          notes?: string | null
          organic_cost?: number | null
          organic_keywords?: number | null
          organic_traffic?: number | null
          raw?: Json | null
          referring_domains?: number | null
          source?: string
          top_keywords?: Json | null
          total_clicks?: number | null
          total_impressions?: number | null
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          customer_name: string
          customer_text: string
          id: string
          is_visible: boolean
          occasion: string | null
          position: number
          product_name: string | null
          rating: number
          testimonial_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          customer_text: string
          id?: string
          is_visible?: boolean
          occasion?: string | null
          position?: number
          product_name?: string | null
          rating?: number
          testimonial_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_text?: string
          id?: string
          is_visible?: boolean
          occasion?: string | null
          position?: number
          product_name?: string | null
          rating?: number
          testimonial_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_order_with_items: {
        Args: { _items: Json; _order: Json }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_coupon: {
        Args: { _code: string; _subtotal: number }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
