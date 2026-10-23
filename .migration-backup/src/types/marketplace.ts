export type ProductCondition = 'new' | 'used' | 'like_new' | 'good' | 'fair';
export type ProductStatus = 'pending' | 'approved' | 'rejected' | 'sold' | 'hidden';
export type AdPlacement = 'homepage' | 'category' | 'city';
export type AdStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'expired' | 'paused';

export interface Category {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface City {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
}

export interface Neighborhood {
  id: string;
  city_id: string;
  name: string;
  name_ar?: string;
  slug: string;
}

export interface Product {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  price: number;
  condition: ProductCondition;
  brand?: string;
  model?: string;
  storage?: string;
  ram?: string;
  specifications?: Record<string, string>;
  compatible_models?: string[];
  images: string[];
  city_id?: string;
  neighborhood_id?: string;
  views: number;
  status: ProductStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  city?: City;
  neighborhood?: Neighborhood;
  seller?: {
    id: string;
    name?: string;
    email?: string;
    avatar_url?: string;
  };
}

export interface WorkingHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface RepairShop {
  id: string;
  user_id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  services?: string[];
  city_id?: string;
  neighborhood_id?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  google_maps_url?: string;
  latitude?: number;
  longitude?: number;
  working_hours?: WorkingHours;
  images?: string[];
  views: number;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  created_at: string;
  updated_at: string;
  // Joined fields
  city?: City;
  neighborhood?: Neighborhood;
  is_open?: boolean;
}

export interface Advertisement {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  placement: AdPlacement;
  category_id?: string;
  city_id?: string;
  duration_days: 7 | 15 | 30;
  price: number;
  payment_receipt_url?: string;
  status: AdStatus;
  starts_at?: string;
  expires_at?: string;
  clicks: number;
  impressions: number;
  created_at: string;
  updated_at: string;
}

export interface ProductComparison {
  id: string;
  user_id: string;
  product_ids: string[];
  products?: Product[];
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

export interface FilterOptions {
  category?: string;
  condition?: ProductCondition;
  city?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular';
}
