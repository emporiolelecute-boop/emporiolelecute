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
      access_request_notifications: {
        Row: {
          admin_count: number
          created_at: string
          details: Json
          error_message: string | null
          id: string
          requested_at: string | null
          requester_email: string | null
          requester_id: string | null
          sent_count: number
          status: string
        }
        Insert: {
          admin_count?: number
          created_at?: string
          details?: Json
          error_message?: string | null
          id?: string
          requested_at?: string | null
          requester_email?: string | null
          requester_id?: string | null
          sent_count?: number
          status?: string
        }
        Update: {
          admin_count?: number
          created_at?: string
          details?: Json
          error_message?: string | null
          id?: string
          requested_at?: string | null
          requester_email?: string | null
          requester_id?: string | null
          sent_count?: number
          status?: string
        }
        Relationships: []
      }
      admin_access_requests: {
        Row: {
          created_at: string
          id: string
          rejection_reason: string | null
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewed_by_email: string | null
          status: string
          updated_at: string
          user_email_snapshot: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rejection_reason?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewed_by_email?: string | null
          status?: string
          updated_at?: string
          user_email_snapshot?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rejection_reason?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewed_by_email?: string | null
          status?: string
          updated_at?: string
          user_email_snapshot?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
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
          display_mode: string
          id: string
          image_alt: string | null
          image_desktop_url: string | null
          image_mobile_url: string | null
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
          display_mode?: string
          id?: string
          image_alt?: string | null
          image_desktop_url?: string | null
          image_mobile_url?: string | null
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
          display_mode?: string
          id?: string
          image_alt?: string | null
          image_desktop_url?: string | null
          image_mobile_url?: string | null
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
      instagram_embed_failures: {
        Row: {
          id: string
          ms_to_fallback: number | null
          occurred_at: string
          post_url: string | null
          route: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          ms_to_fallback?: number | null
          occurred_at?: string
          post_url?: string | null
          route?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          ms_to_fallback?: number | null
          occurred_at?: string
          post_url?: string | null
          route?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      instagram_feed_embeds: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_active: boolean
          position: number
          post_url: string
          preview_image_url: string | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          post_url: string
          preview_image_url?: string | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          post_url?: string
          preview_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      instagram_post_attempts: {
        Row: {
          attempted_at: string
          error_message: string | null
          id: string
          image_url: string | null
          meta_used: string | null
          post_id: string
          source: string
          status: string
          title: string | null
        }
        Insert: {
          attempted_at?: string
          error_message?: string | null
          id?: string
          image_url?: string | null
          meta_used?: string | null
          post_id: string
          source?: string
          status: string
          title?: string | null
        }
        Update: {
          attempted_at?: string
          error_message?: string | null
          id?: string
          image_url?: string | null
          meta_used?: string | null
          post_id?: string
          source?: string
          status?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instagram_post_attempts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "instagram_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_posts: {
        Row: {
          alt_text: string
          created_at: string
          extraction_error: string | null
          extraction_status: string
          id: string
          image_url: string
          is_visible: boolean
          last_extracted_at: string | null
          position: number
          post_url: string | null
          shortcode: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string
          created_at?: string
          extraction_error?: string | null
          extraction_status?: string
          id?: string
          image_url: string
          is_visible?: boolean
          last_extracted_at?: string | null
          position?: number
          post_url?: string | null
          shortcode?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          extraction_error?: string | null
          extraction_status?: string
          id?: string
          image_url?: string
          is_visible?: boolean
          last_extracted_at?: string | null
          position?: number
          post_url?: string | null
          shortcode?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      instagram_sync_history: {
        Row: {
          action: string
          details: Json
          error_message: string | null
          id: string
          ran_at: string
          selected_count: number | null
          source: string
          status: string
          synced_count: number
          triggered_by: string | null
        }
        Insert: {
          action?: string
          details?: Json
          error_message?: string | null
          id?: string
          ran_at?: string
          selected_count?: number | null
          source?: string
          status?: string
          synced_count?: number
          triggered_by?: string | null
        }
        Update: {
          action?: string
          details?: Json
          error_message?: string | null
          id?: string
          ran_at?: string
          selected_count?: number | null
          source?: string
          status?: string
          synced_count?: number
          triggered_by?: string | null
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
          position: number
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
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
          paid_at: string | null
          payment_id: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          shipped_at: string | null
          shipping_company: string | null
          shipping_days: string | null
          shipping_method: string
          shipping_price: number
          status: string
          subtotal: number
          total: number
          tracking_carrier: string | null
          tracking_code: string | null
          tracking_url: string | null
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
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipped_at?: string | null
          shipping_company?: string | null
          shipping_days?: string | null
          shipping_method: string
          shipping_price?: number
          status?: string
          subtotal: number
          total: number
          tracking_carrier?: string | null
          tracking_code?: string | null
          tracking_url?: string | null
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
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipped_at?: string | null
          shipping_company?: string | null
          shipping_days?: string | null
          shipping_method?: string
          shipping_price?: number
          status?: string
          subtotal?: number
          total?: number
          tracking_carrier?: string | null
          tracking_code?: string | null
          tracking_url?: string | null
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
      product_segments: {
        Row: {
          product_id: string
          segment_id: string
        }
        Insert: {
          product_id: string
          segment_id: string
        }
        Update: {
          product_id?: string
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_segments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_segments_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
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
      role_promotion_audit: {
        Row: {
          created_at: string
          id: string
          message: string | null
          promoted_by: string | null
          promoted_by_email: string | null
          role: string
          status: string
          target_email: string
          target_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          promoted_by?: string | null
          promoted_by_email?: string | null
          role: string
          status: string
          target_email: string
          target_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          promoted_by?: string | null
          promoted_by_email?: string | null
          role?: string
          status?: string
          target_email?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      segments: {
        Row: {
          created_at: string
          description: string | null
          description_seo: string | null
          h1_override: string | null
          id: string
          image_url: string | null
          is_indexed: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_seo?: string | null
          h1_override?: string | null
          id?: string
          image_url?: string | null
          is_indexed?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_seo?: string | null
          h1_override?: string | null
          id?: string
          image_url?: string | null
          is_indexed?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          position?: number
          slug?: string
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
      seo_url_status: {
        Row: {
          alerted: boolean
          checked_at: string
          coverage_state: string | null
          google_canonical: string | null
          has_issue: boolean
          id: string
          indexing_state: string | null
          last_crawl_time: string | null
          page_fetch_state: string | null
          raw: Json | null
          referring_urls: Json | null
          robots_txt_state: string | null
          url: string
          user_canonical: string | null
          verdict: string | null
        }
        Insert: {
          alerted?: boolean
          checked_at?: string
          coverage_state?: string | null
          google_canonical?: string | null
          has_issue?: boolean
          id?: string
          indexing_state?: string | null
          last_crawl_time?: string | null
          page_fetch_state?: string | null
          raw?: Json | null
          referring_urls?: Json | null
          robots_txt_state?: string | null
          url: string
          user_canonical?: string | null
          verdict?: string | null
        }
        Update: {
          alerted?: boolean
          checked_at?: string
          coverage_state?: string | null
          google_canonical?: string | null
          has_issue?: boolean
          id?: string
          indexing_state?: string | null
          last_crawl_time?: string | null
          page_fetch_state?: string | null
          raw?: Json | null
          referring_urls?: Json | null
          robots_txt_state?: string | null
          url?: string
          user_canonical?: string | null
          verdict?: string | null
        }
        Relationships: []
      }
      stale_bundle_logs: {
        Row: {
          id: string
          message: string | null
          occurred_at: string
          reloaded: boolean
          route: string | null
          stack: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          message?: string | null
          occurred_at?: string
          reloaded?: boolean
          route?: string | null
          stack?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          message?: string | null
          occurred_at?: string
          reloaded?: boolean
          route?: string | null
          stack?: string | null
          user_agent?: string | null
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
          position: number
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          position?: number
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          position?: number
          slug?: string
        }
        Relationships: []
      }
      telemetry_alert_state: {
        Row: {
          id: string
          last_alert_at: string | null
          last_count: number | null
          updated_at: string
        }
        Insert: {
          id: string
          last_alert_at?: string | null
          last_count?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          last_alert_at?: string | null
          last_count?: number | null
          updated_at?: string
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
      tracking_email_log: {
        Row: {
          created_at: string
          email_type: string
          error_message: string | null
          id: string
          new_status: string | null
          order_code: string
          order_id: string
          recipient_email: string | null
          status: string
          tracking_carrier: string | null
          tracking_code: string | null
          tracking_url: string | null
          triggered_by: string | null
          triggered_by_email: string | null
        }
        Insert: {
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          new_status?: string | null
          order_code: string
          order_id: string
          recipient_email?: string | null
          status?: string
          tracking_carrier?: string | null
          tracking_code?: string | null
          tracking_url?: string | null
          triggered_by?: string | null
          triggered_by_email?: string | null
        }
        Update: {
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          new_status?: string | null
          order_code?: string
          order_id?: string
          recipient_email?: string | null
          status?: string
          tracking_carrier?: string | null
          tracking_code?: string | null
          tracking_url?: string | null
          triggered_by?: string | null
          triggered_by_email?: string | null
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
      admin_audit_timeline: {
        Row: {
          actor_email: string | null
          created_at: string | null
          details: string | null
          event_id: string | null
          role: string | null
          source: string | null
          status: string | null
          target_email: string | null
          target_user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_audit_anomalies: {
        Args: { _threshold?: number; _window_hours?: number }
        Returns: Json
      }
      apply_default_weight: { Args: { _default_kg?: number }; Returns: Json }
      check_resend_email_cooldown: {
        Args: { _order_id: string }
        Returns: Json
      }
      cleanup_seo_url_status: { Args: never; Returns: undefined }
      cleanup_stale_bundle_logs: { Args: never; Returns: Json }
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
      list_admin_audit_timeline: {
        Args: {
          _from?: string
          _limit?: number
          _offset?: number
          _search?: string
          _sort_dir?: string
          _sort_key?: string
          _source?: string
          _status?: string
          _to?: string
        }
        Returns: Json
      }
      list_cron_jobs: {
        Args: never
        Returns: {
          active: boolean
          command: string
          jobid: number
          jobname: string
          schedule: string
        }[]
      }
      list_cron_runs: {
        Args: { p_limit?: number }
        Returns: {
          command: string
          database: string
          end_time: string
          job_pid: number
          jobid: number
          return_message: string
          runid: number
          start_time: string
          status: string
          username: string
        }[]
      }
      promote_user_to_admin: { Args: { _email: string }; Returns: Json }
      refresh_admin_audit_timeline: { Args: never; Returns: Json }
      reject_admin_request: {
        Args: { _reason: string; _user_id: string }
        Returns: Json
      }
      request_admin_access: { Args: never; Returns: Json }
      validate_coupon: {
        Args: { _code: string; _subtotal: number }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
      payment_status: "pending" | "approved" | "refunded" | "cancelled"
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
      payment_status: ["pending", "approved", "refunded", "cancelled"],
    },
  },
} as const
