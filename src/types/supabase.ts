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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ad_bookings: {
        Row: {
          campaign_id: string
          created_at: string | null
          end_date: string
          id: string
          page: string
          slot: string
          start_date: string
          status: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          end_date: string
          id?: string
          page: string
          slot: string
          start_date: string
          status?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          page?: string
          slot?: string
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_bookings_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "ad_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_campaigns: {
        Row: {
          advertiser_id: string
          banner_desktop_url: string | null
          banner_mobile_url: string | null
          created_at: string | null
          description: string | null
          duration_days: number
          end_date: string
          id: string
          payment_method: string | null
          payment_proof_url: string | null
          payment_status: string | null
          slot: string
          start_date: string
          status: string | null
          target_url: string
          title: string
          total_clicks: number | null
          total_impressions: number | null
          updated_at: string | null
        }
        Insert: {
          advertiser_id: string
          banner_desktop_url?: string | null
          banner_mobile_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_days: number
          end_date: string
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: string | null
          slot: string
          start_date: string
          status?: string | null
          target_url: string
          title: string
          total_clicks?: number | null
          total_impressions?: number | null
          updated_at?: string | null
        }
        Update: {
          advertiser_id?: string
          banner_desktop_url?: string | null
          banner_mobile_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_days?: number
          end_date?: string
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: string | null
          slot?: string
          start_date?: string
          status?: string | null
          target_url?: string
          title?: string
          total_clicks?: number | null
          total_impressions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_campaigns_advertiser_id_fkey"
            columns: ["advertiser_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_events: {
        Row: {
          booking_id: string | null
          campaign_id: string
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          page: string
          slot: string
          user_agent: string | null
        }
        Insert: {
          booking_id?: string | null
          campaign_id: string
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          page: string
          slot: string
          user_agent?: string | null
        }
        Update: {
          booking_id?: string | null
          campaign_id?: string
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          page?: string
          slot?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "ad_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "ad_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      ads: {
        Row: {
          advertiser_id: string | null
          clicks: number | null
          created_at: string | null
          end_date: string
          id: string
          image_url: string
          impressions: number | null
          is_active: boolean | null
          link_url: string
          placement: string
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          advertiser_id?: string | null
          clicks?: number | null
          created_at?: string | null
          end_date: string
          id?: string
          image_url: string
          impressions?: number | null
          is_active?: boolean | null
          link_url: string
          placement?: string
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          advertiser_id?: string | null
          clicks?: number | null
          created_at?: string | null
          end_date?: string
          id?: string
          image_url?: string
          impressions?: number | null
          is_active?: boolean | null
          link_url?: string
          placement?: string
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      adsense_units: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          page: string
          slot: string
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page: string
          slot: string
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page?: string
          slot?: string
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      banner_slots: {
        Row: {
          created_at: string | null
          desktop_sizes: string[]
          id: string
          is_active: boolean | null
          mobile_sizes: string[]
          page: string
          slot: string
        }
        Insert: {
          created_at?: string | null
          desktop_sizes: string[]
          id?: string
          is_active?: boolean | null
          mobile_sizes: string[]
          page: string
          slot: string
        }
        Update: {
          created_at?: string | null
          desktop_sizes?: string[]
          id?: string
          is_active?: boolean | null
          mobile_sizes?: string[]
          page?: string
          slot?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_ar: string
          name_fr: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_fr: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_fr?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          lat: number | null
          lng: number | null
          name_ar: string
          name_fr: string
          region_ar: string | null
          region_fr: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name_ar: string
          name_fr: string
          region_ar?: string | null
          region_fr?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name_ar?: string
          name_fr?: string
          region_ar?: string | null
          region_fr?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      item_images: {
        Row: {
          alt_text_ar: string | null
          alt_text_fr: string | null
          created_at: string | null
          id: string
          image_url: string
          item_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text_ar?: string | null
          alt_text_fr?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          item_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text_ar?: string | null
          alt_text_fr?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          item_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "item_images_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          brand: string | null
          city_id: string | null
          condition: string
          created_at: string | null
          currency: string | null
          description_ar: string | null
          description_fr: string | null
          id: string
          is_demo: boolean | null
          item_type: string
          meta_description: string | null
          meta_title: string | null
          model: string | null
          neighborhood_custom: string | null
          neighborhood_id: string | null
          phone: string | null
          phone_clicks: number | null
          price: number | null
          price_text: string | null
          slug: string
          status: string | null
          store_id: string
          title_ar: string
          title_fr: string
          updated_at: string | null
          view_count: number | null
          whatsapp: string | null
          whatsapp_clicks: number | null
        }
        Insert: {
          brand?: string | null
          city_id?: string | null
          condition: string
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          is_demo?: boolean | null
          item_type: string
          meta_description?: string | null
          meta_title?: string | null
          model?: string | null
          neighborhood_custom?: string | null
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          price?: number | null
          price_text?: string | null
          slug: string
          status?: string | null
          store_id: string
          title_ar: string
          title_fr: string
          updated_at?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
        }
        Update: {
          brand?: string | null
          city_id?: string | null
          condition?: string
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          is_demo?: boolean | null
          item_type?: string
          meta_description?: string | null
          meta_title?: string | null
          model?: string | null
          neighborhood_custom?: string | null
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          price?: number | null
          price_text?: string | null
          slug?: string
          status?: string | null
          store_id?: string
          title_ar?: string
          title_fr?: string
          updated_at?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_images: {
        Row: {
          alt_text_ar: string | null
          alt_text_fr: string | null
          created_at: string | null
          id: string
          image_url: string
          listing_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text_ar?: string | null
          alt_text_fr?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          listing_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text_ar?: string | null
          alt_text_fr?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          listing_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          brand: string | null
          category_id: string | null
          city_id: string | null
          condition: string | null
          created_at: string | null
          currency: string | null
          description_ar: string | null
          description_fr: string | null
          id: string
          is_demo: boolean | null
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          model: string | null
          neighborhood_id: string | null
          phone: string | null
          phone_clicks: number | null
          price: number | null
          slug: string
          status: string | null
          title_ar: string
          title_fr: string
          updated_at: string | null
          user_id: string | null
          view_count: number | null
          whatsapp: string | null
          whatsapp_clicks: number | null
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          city_id?: string | null
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          is_demo?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          model?: string | null
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          price?: number | null
          slug: string
          status?: string | null
          title_ar: string
          title_fr: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          city_id?: string | null
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          is_demo?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          model?: string | null
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          price?: number | null
          slug?: string
          status?: string | null
          title_ar?: string
          title_fr?: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods: {
        Row: {
          city_id: string
          created_at: string | null
          created_by: string | null
          id: string
          is_verified: boolean | null
          name: string
          slug: string
        }
        Insert: {
          city_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          slug: string
        }
        Update: {
          city_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "neighborhoods_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_requests: {
        Row: {
          attempts: number | null
          code_hash: string
          created_at: string | null
          expires_at: string
          id: string
          phone: string
          verified: boolean | null
        }
        Insert: {
          attempts?: number | null
          code_hash: string
          created_at?: string | null
          expires_at: string
          id?: string
          phone: string
          verified?: boolean | null
        }
        Update: {
          attempts?: number | null
          code_hash?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          phone?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          phone: string | null
          role: string
          store_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          city_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          is_verified?: boolean | null
          phone?: string | null
          role?: string
          store_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          city_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          phone?: string | null
          role?: string
          store_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_services: {
        Row: {
          city_id: string | null
          created_at: string | null
          description_ar: string | null
          description_fr: string | null
          device_types: string[] | null
          estimated_duration: string | null
          id: string
          is_demo: boolean | null
          neighborhood_custom: string | null
          neighborhood_id: string | null
          phone: string | null
          phone_clicks: number | null
          price: number | null
          price_on_request: boolean | null
          service_name_ar: string
          service_name_fr: string
          slug: string
          status: string | null
          store_id: string
          updated_at: string | null
          view_count: number | null
          whatsapp: string | null
          whatsapp_clicks: number | null
        }
        Insert: {
          city_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_fr?: string | null
          device_types?: string[] | null
          estimated_duration?: string | null
          id?: string
          is_demo?: boolean | null
          neighborhood_custom?: string | null
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          price?: number | null
          price_on_request?: boolean | null
          service_name_ar: string
          service_name_fr: string
          slug: string
          status?: string | null
          store_id: string
          updated_at?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
        }
        Update: {
          city_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_fr?: string | null
          device_types?: string[] | null
          estimated_duration?: string | null
          id?: string
          is_demo?: boolean | null
          neighborhood_custom?: string | null
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          price?: number | null
          price_on_request?: boolean | null
          service_name_ar?: string
          service_name_fr?: string
          slug?: string
          status?: string | null
          store_id?: string
          updated_at?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_services_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_services_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_services_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_shops: {
        Row: {
          address_ar: string | null
          address_fr: string | null
          city_id: string | null
          created_at: string | null
          description_ar: string | null
          description_fr: string | null
          id: string
          is_demo: boolean | null
          lat: number | null
          lng: number | null
          meta_description: string | null
          meta_title: string | null
          name_ar: string
          name_fr: string
          neighborhood_id: string | null
          phone: string | null
          phone_clicks: number | null
          slug: string
          specialties: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
          whatsapp: string | null
          whatsapp_clicks: number | null
          working_hours: Json | null
        }
        Insert: {
          address_ar?: string | null
          address_fr?: string | null
          city_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          is_demo?: boolean | null
          lat?: number | null
          lng?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name_ar: string
          name_fr: string
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          slug: string
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
          working_hours?: Json | null
        }
        Update: {
          address_ar?: string | null
          address_fr?: string | null
          city_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          is_demo?: boolean | null
          lat?: number | null
          lng?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name_ar?: string
          name_fr?: string
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          slug?: string
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_shops_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_shops_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          is_visible: boolean | null
          rating: number
          target_id: string
          target_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          rating: number
          target_id: string
          target_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          rating?: number
          target_id?: string
          target_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shop_images: {
        Row: {
          alt_text_ar: string | null
          alt_text_fr: string | null
          created_at: string | null
          id: string
          image_url: string
          is_cover: boolean | null
          shop_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text_ar?: string | null
          alt_text_fr?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_cover?: boolean | null
          shop_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text_ar?: string | null
          alt_text_fr?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_cover?: boolean | null
          shop_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_images_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "repair_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      store_images: {
        Row: {
          alt_text_ar: string | null
          alt_text_fr: string | null
          created_at: string | null
          id: string
          image_url: string
          is_cover: boolean | null
          sort_order: number | null
          store_id: string
        }
        Insert: {
          alt_text_ar?: string | null
          alt_text_fr?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_cover?: boolean | null
          sort_order?: number | null
          store_id: string
        }
        Update: {
          alt_text_ar?: string | null
          alt_text_fr?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_cover?: boolean | null
          sort_order?: number | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_images_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          reviewer_name: string
          reviewer_phone: string | null
          status: string | null
          store_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          reviewer_name: string
          reviewer_phone?: string | null
          status?: string | null
          store_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          reviewer_name?: string
          reviewer_phone?: string | null
          status?: string | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_reviews_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address_ar: string | null
          address_fr: string | null
          city_id: string | null
          created_at: string | null
          description_ar: string | null
          description_fr: string | null
          email: string | null
          emergency_service: boolean | null
          id: string
          is_demo: boolean | null
          lat: number | null
          lng: number | null
          meta_description: string | null
          meta_title: string | null
          name_ar: string
          name_fr: string
          neighborhood_custom: string | null
          neighborhood_id: string | null
          phone: string | null
          phone_clicks: number | null
          rating_avg: number | null
          rating_count: number | null
          slug: string
          status: string | null
          store_type: string
          updated_at: string | null
          user_id: string | null
          view_count: number | null
          website: string | null
          whatsapp: string | null
          whatsapp_clicks: number | null
          working_days: string[] | null
          working_hours: Json | null
        }
        Insert: {
          address_ar?: string | null
          address_fr?: string | null
          city_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_fr?: string | null
          email?: string | null
          emergency_service?: boolean | null
          id?: string
          is_demo?: boolean | null
          lat?: number | null
          lng?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name_ar: string
          name_fr: string
          neighborhood_custom?: string | null
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          slug: string
          status?: string | null
          store_type?: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
          website?: string | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
          working_days?: string[] | null
          working_hours?: Json | null
        }
        Update: {
          address_ar?: string | null
          address_fr?: string | null
          city_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_fr?: string | null
          email?: string | null
          emergency_service?: boolean | null
          id?: string
          is_demo?: boolean | null
          lat?: number | null
          lng?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name_ar?: string
          name_fr?: string
          neighborhood_custom?: string | null
          neighborhood_id?: string | null
          phone?: string | null
          phone_clicks?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          slug?: string
          status?: string | null
          store_type?: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
          website?: string | null
          whatsapp?: string | null
          whatsapp_clicks?: number | null
          working_days?: string[] | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_or_get_neighborhood: {
        Args: { p_city_id: string; p_name: string; p_user_id?: string }
        Returns: string
      }
      check_booking_availability: {
        Args: {
          p_end_date: string
          p_exclude_campaign_id?: string
          p_page: string
          p_slot: string
          p_start_date: string
        }
        Returns: boolean
      }
      generate_item_slug: { Args: { title: string }; Returns: string }
      generate_neighborhood_slug: {
        Args: { name_input: string }
        Returns: string
      }
      generate_service_slug: { Args: { name: string }; Returns: string }
      generate_slug: {
        Args: { table_name: string; title: string }
        Returns: string
      }
      generate_store_slug: { Args: { name: string }; Returns: string }
      get_booking_calendar: {
        Args: {
          p_from_date?: string
          p_page: string
          p_slot: string
          p_to_date?: string
        }
        Returns: {
          booking_date: string
          campaign_id: string
          is_booked: boolean
        }[]
      }
      get_next_available_date: {
        Args: {
          p_duration_days: number
          p_page: string
          p_slot: string
          p_start_from?: string
        }
        Returns: string
      }
      increment_ad_click: { Args: { p_ad_id: string }; Returns: undefined }
      increment_ad_impression: { Args: { p_ad_id: string }; Returns: undefined }
      increment_counter: {
        Args: { p_column_name: string; p_row_id: string; p_table_name: string }
        Returns: undefined
      }
      increment_item_counter: {
        Args: { p_counter_type: string; p_item_id: string }
        Returns: undefined
      }
      increment_listing_view: {
        Args: { p_listing_id: string }
        Returns: undefined
      }
      increment_product_view: {
        Args: { p_product_id: string }
        Returns: undefined
      }
      increment_service_counter: {
        Args: { p_counter_type: string; p_service_id: string }
        Returns: undefined
      }
      increment_shop_counter: {
        Args: { p_counter_type: string; p_shop_id: string }
        Returns: undefined
      }
      increment_store_counter: {
        Args: { p_counter_type: string; p_store_id: string }
        Returns: undefined
      }
      sanitize_neighborhood_name: {
        Args: { name_input: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
