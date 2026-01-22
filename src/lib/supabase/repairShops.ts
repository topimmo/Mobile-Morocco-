import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import { apiCache, CACHE_KEYS, SimpleCache, invalidateHomepageCache } from '@/lib/cache';

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export type RepairShop = Tables<'repair_shops'>;

// Cache TTL for repair shops list (3 minutes)
const REPAIR_SHOPS_CACHE_TTL = 3 * 60 * 1000;
export type ShopImage = Tables<'shop_images'>;
export type RepairShopInsert = TablesInsert<'repair_shops'>;
export type RepairShopUpdate = TablesUpdate<'repair_shops'>;

export interface RepairShopWithRelations extends RepairShop {
  images: ShopImage[];
  city?: Tables<'cities'> | null;
  neighborhood?: Tables<'neighborhoods'> | null;
  rating_avg?: number | null;
  rating_count?: number | null;
}

export interface ShopFilters {
  cityId?: string;
  neighborhoodId?: string;
  specialties?: string[];
  search?: string;
  status?: ListingStatus;
  userId?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export const getRepairShops = async (
  filters: ShopFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 20 }
) => {
  const { page, limit } = pagination;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Generate cache key based on filters and pagination
  const cacheKey = SimpleCache.generateKey(CACHE_KEYS.REPAIR_SHOPS, { ...filters, page, limit });
  
  // Check cache for homepage queries (no filters, first page)
  const isHomepageQuery = Object.keys(filters).length === 0 && page === 1;
  if (isHomepageQuery) {
    const cached = apiCache.get<{
      data: RepairShopWithRelations[] | null;
      count: number | null;
      totalPages: number;
    }>(cacheKey);
    if (cached) {
      return { ...cached, error: null };
    }
  }

  let query = supabase
    .from('repair_shops')
    .select(`
      *,
      images:shop_images(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `, { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters.cityId) {
    query = query.eq('city_id', filters.cityId);
  }

  if (filters.neighborhoodId) {
    query = query.eq('neighborhood_id', filters.neighborhoodId);
  }

  if (filters.specialties && filters.specialties.length > 0) {
    query = query.overlaps('specialties', filters.specialties);
  }

  if (filters.search) {
    query = query.or(`name_ar.ilike.%${filters.search}%,name_fr.ilike.%${filters.search}%,description_ar.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query;

  const result = {
    data: data as unknown as RepairShopWithRelations[] | null,
    error,
    count,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };

  // Cache homepage query results
  if (isHomepageQuery && !error) {
    apiCache.set(cacheKey, { data: result.data, count: result.count, totalPages: result.totalPages }, REPAIR_SHOPS_CACHE_TTL);
  }

  return result;
};

export const getRepairShopById = async (id: string) => {
  const { data, error } = await supabase
    .from('repair_shops')
    .select(`
      *,
      images:shop_images(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('id', id)
    .single();

  return { data: data as unknown as RepairShopWithRelations | null, error };
};

export const getRepairShopBySlug = async (slug: string): Promise<RepairShopWithRelations | null> => {
  const { data, error } = await supabase
    .from('repair_shops')
    .select(`
      *,
      images:shop_images(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching repair shop by slug:', error);
    return null;
  }
  
  return data as unknown as RepairShopWithRelations;
};

export const getUserRepairShops = async (userId: string) => {
  const { data, error } = await supabase
    .from('repair_shops')
    .select(`
      *,
      images:shop_images(*),
      city:cities(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: data as RepairShopWithRelations[] | null, error };
};

export const createRepairShop = async (shop: RepairShopInsert) => {
  const { data, error } = await supabase
    .from('repair_shops')
    .insert(shop)
    .select()
    .single();

  // Invalidate cache when new shop is created
  if (!error && data) {
    invalidateHomepageCache();
    apiCache.invalidatePrefix(CACHE_KEYS.REPAIR_SHOPS);
  }

  return { data, error };
};

export const updateRepairShop = async (id: string, updates: RepairShopUpdate) => {
  const { data, error } = await supabase
    .from('repair_shops')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  // Invalidate cache on status changes
  if (!error && updates.status) {
    invalidateHomepageCache();
    apiCache.invalidatePrefix(CACHE_KEYS.REPAIR_SHOPS);
  }

  return { data, error };
};

export const deleteRepairShop = async (id: string) => {
  const { error } = await supabase
    .from('repair_shops')
    .delete()
    .eq('id', id);

  // Invalidate cache when shop is deleted
  if (!error) {
    invalidateHomepageCache();
    apiCache.invalidatePrefix(CACHE_KEYS.REPAIR_SHOPS);
  }

  return { error };
};

export const addShopImage = async (
  shopId: string,
  imageUrl: string,
  altTextAr?: string,
  altTextFr?: string,
  isCover?: boolean,
  sortOrder?: number
) => {
  const { data, error } = await supabase
    .from('shop_images')
    .insert({
      shop_id: shopId,
      image_url: imageUrl,
      alt_text_ar: altTextAr,
      alt_text_fr: altTextFr,
      is_cover: isCover || false,
      sort_order: sortOrder || 0,
    })
    .select()
    .single();

  return { data, error };
};

export const deleteShopImage = async (imageId: string) => {
  const { error } = await supabase
    .from('shop_images')
    .delete()
    .eq('id', imageId);

  return { error };
};

export const incrementShopViewCount = async (id: string) => {
  // Use atomic RPC function to prevent race conditions
  await supabase.rpc('increment_shop_counter', { p_shop_id: id, p_counter_type: 'view' });
};

export const trackShopContactClick = async (
  id: string,
  contactType: 'whatsapp' | 'phone'
) => {
  // Use atomic RPC function to prevent race conditions
  await supabase.rpc('increment_shop_counter', { p_shop_id: id, p_counter_type: contactType });
};

// Admin functions
export const getRepairShopsForAdmin = async (status?: ListingStatus) => {
  let query = supabase
    .from('repair_shops')
    .select(`
      *,
      images:shop_images(*),
      city:cities(*)
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  return { data: data as RepairShopWithRelations[] | null, error };
};

export const approveRepairShop = async (id: string) => {
  return updateRepairShop(id, { status: 'approved' });
};

export const rejectRepairShop = async (id: string) => {
  return updateRepairShop(id, { status: 'rejected' });
};

export const hideRepairShop = async (id: string) => {
  return updateRepairShop(id, { status: 'hidden' });
};
