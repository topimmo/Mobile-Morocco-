import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import { apiCache, CACHE_KEYS, SimpleCache, invalidateListingsCache } from '@/lib/cache';
import { generateSlug } from '@/lib/utils';

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

// Cache TTL for listings (3 minutes)
const LISTINGS_CACHE_TTL = 3 * 60 * 1000;

export type Listing = Tables<'listings'>;
export type ListingImage = Tables<'listing_images'>;
export type ListingInsert = TablesInsert<'listings'>;
export type ListingUpdate = TablesUpdate<'listings'>;

// Phone details structure
export interface PhoneDetails {
  color?: string;
  storage?: string;
  ram?: string;
  battery_health?: string;
  warranty?: 'yes' | 'no';
  accessories?: string[];
  sim_type?: string;
  network?: '4G' | '5G' | '4G/5G';
}

// Extended listing insert with phone_details
export interface ListingInsertWithPhoneDetails extends ListingInsert {
  phone_details?: PhoneDetails | null;
}

export interface ListingWithRelations extends Listing {
  images?: ListingImage[];
  category?: Tables<'categories'> | null;
  city?: Tables<'cities'> | null;
  neighborhood?: Tables<'neighborhoods'> | null;
  // Computed properties for display
  title?: string;
  description?: string;
}

export interface ListingsFilters {
  categoryId?: string;
  cityId?: string;
  neighborhoodId?: string;
  condition?: 'new' | 'used' | 'refurbished';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: ListingStatus;
  userId?: string;
  isFeatured?: boolean;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export const getListings = async (
  filters: ListingsFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 20 }
) => {
  const { page, limit } = pagination;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Generate cache key based on filters and pagination
  const cacheKey = SimpleCache.generateKey(CACHE_KEYS.LISTINGS, { ...filters, page, limit });
  
  // Check cache for homepage queries (no filters, first page with small limit)
  const isHomepageQuery = Object.keys(filters).length === 0 && page === 1 && limit <= 10;
  if (isHomepageQuery) {
    const cached = apiCache.get<{
      data: ListingWithRelations[] | null;
      count: number | null;
      totalPages: number;
    }>(cacheKey);
    if (cached) {
      return { ...cached, error: null };
    }
  }

  let query = supabase
    .from('listings')
    .select(`
      *,
      images:listing_images(*),
      category:categories(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `, { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters.cityId) {
    query = query.eq('city_id', filters.cityId);
  }

  // Filter by neighborhood if specified
  if (filters.neighborhoodId) {
    query = query.eq('neighborhood_id', filters.neighborhoodId);
  }

  if (filters.condition) {
    query = query.eq('condition', filters.condition);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.search) {
    query = query.or(`title_ar.ilike.%${filters.search}%,title_fr.ilike.%${filters.search}%,description_ar.ilike.%${filters.search}%`);
  }

  if (filters.isFeatured) {
    query = query.eq('is_featured', true);
  }

  try {
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      return { data: [], error, count: 0, totalPages: 0 };
    }

    const result = {
      data: data as unknown as ListingWithRelations[] | null,
      error,
      count,
      totalPages: count ? Math.ceil(count / limit) : 0,
    };

    // Cache homepage query results
    if (isHomepageQuery && !error) {
      apiCache.set(cacheKey, { data: result.data, count: result.count, totalPages: result.totalPages }, LISTINGS_CACHE_TTL);
    }

    return result;
  } catch (err) {
    console.error('Error fetching listings:', err);
    return { data: [], error: err, count: 0, totalPages: 0 };
  }
};

export const getListingById = async (id: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      images:listing_images(*),
      category:categories(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('id', id)
    .single();

  return { data: data as unknown as ListingWithRelations | null, error };
};

export const getListingBySlug = async (slug: string): Promise<ListingWithRelations | null> => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      images:listing_images(*),
      category:categories(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching listing by slug:', error);
    return null;
  }
  
  return data as unknown as ListingWithRelations;
};

export const getUserListings = async (userId: string, status?: ListingStatus) => {
  let query = supabase
    .from('listings')
    .select(`
      *,
      images:listing_images(*),
      category:categories(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  return { data: data as unknown as ListingWithRelations[] | null, error };
};

export const createListing = async (listing: Omit<ListingInsertWithPhoneDetails, 'slug'> & { slug?: string }) => {
  const slug = listing.slug || generateSlug(listing.title_ar || listing.title_fr || 'listing', { includeTimestamp: true });
  
  const { data, error } = await supabase
    .from('listings')
    .insert({ ...listing, slug } as any)
    .select()
    .single();

  // Invalidate homepage cache when new listing is created
  if (!error && data) {
    invalidateListingsCache();
  }

  return { data, error };
};

export const updateListing = async (id: string, updates: ListingUpdate) => {
  const { data, error } = await supabase
    .from('listings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  // Invalidate cache when listing is updated (e.g., status change to approved)
  if (!error && data) {
    invalidateListingsCache();
  }

  return { data, error };
};

export const deleteListing = async (id: string) => {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  // Invalidate cache when listing is deleted
  if (!error) {
    invalidateListingsCache();
  }

  return { error };
};

export const addListingImage = async (
  listingId: string,
  imageUrl: string,
  altTextAr?: string,
  altTextFr?: string,
  sortOrder?: number
) => {
  const { data, error } = await supabase
    .from('listing_images')
    .insert({
      listing_id: listingId,
      image_url: imageUrl,
      alt_text_ar: altTextAr,
      alt_text_fr: altTextFr,
      sort_order: sortOrder || 0,
    })
    .select()
    .single();

  return { data, error };
};

export const deleteListingImage = async (imageId: string) => {
  const { error } = await supabase
    .from('listing_images')
    .delete()
    .eq('id', imageId);

  return { error };
};

export const incrementViewCount = async (id: string) => {
  // Use atomic RPC function to prevent race conditions
  await supabase.rpc('increment_listing_view', { p_listing_id: id });
};

export const trackContactClick = async (
  id: string,
  contactType: 'whatsapp' | 'phone'
) => {
  // Use atomic RPC function to prevent race conditions
  await supabase.rpc('increment_counter', {
    p_table_name: 'listings',
    p_column_name: `${contactType}_clicks`,
    p_row_id: id
  });
};

// Admin functions
export const getListingsForAdmin = async (status?: ListingStatus) => {
  let query = supabase
    .from('listings')
    .select(`
      *,
      images:listing_images(*),
      category:categories(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  return { data: data as unknown as ListingWithRelations[] | null, error };
};

export const approveListing = async (id: string) => {
  return updateListing(id, { status: 'approved' });
};

export const rejectListing = async (id: string) => {
  return updateListing(id, { status: 'rejected' });
};

export const hideListing = async (id: string) => {
  return updateListing(id, { status: 'hidden' });
};
