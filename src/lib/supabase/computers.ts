import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import { invalidateListingsCache } from '@/lib/cache';

// Computer-specific types
export interface ComputerDetails {
  processor?: string;
  ram_gb?: number;
  storage_type?: 'SSD' | 'HDD' | 'SSD+HDD';
  storage_gb?: number;
  gpu?: string;
  screen_size?: string;
  os?: string;
  warranty?: boolean;
  warranty_months?: number;
}

export interface ComputerPartDetails {
  part_category?: string; // RAM, SSD, Battery, Screen, etc.
  part_type?: string; // DDR4, M.2, etc.
  capacity?: string;
  speed?: string;
  compatible_models?: string[];
  stock_quantity?: number;
}

export type ComputerItem = Tables<'items'> & {
  computer_details?: ComputerDetails;
};

export type ComputerPartItem = Tables<'items'> & {
  computer_details?: ComputerPartDetails;
};

export interface ComputerWithRelations extends ComputerItem {
  images?: Tables<'item_images'>[];
  store?: Tables<'stores'>;
  city?: Tables<'cities'> | null;
  neighborhood?: Tables<'neighborhoods'> | null;
}

export interface ComputerPartWithRelations extends ComputerPartItem {
  images?: Tables<'item_images'>[];
  store?: Tables<'stores'>;
  city?: Tables<'cities'> | null;
  neighborhood?: Tables<'neighborhoods'> | null;
}

export type ComputerRepairService = Tables<'repair_services'>;

export interface ComputerRepairWithRelations extends ComputerRepairService {
  store?: Tables<'stores'>;
  city?: Tables<'cities'> | null;
  neighborhood?: Tables<'neighborhoods'> | null;
}

// Filters for computers
export interface ComputerFilters {
  storeId?: string;
  cityId?: string;
  neighborhoodId?: string;
  condition?: 'new' | 'used';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  minRam?: number;
  processorBrand?: string;
  storageType?: 'SSD' | 'HDD' | 'SSD+HDD';
  search?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'hidden';
}

// Filters for computer parts
export interface ComputerPartFilters {
  storeId?: string;
  cityId?: string;
  partCategory?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'hidden';
}

// Filters for computer repair services
export interface ComputerRepairFilters {
  storeId?: string;
  cityId?: string;
  search?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'hidden';
}

// Pagination options
export interface PaginationOptions {
  page?: number;
  perPage?: number;
}

/**
 * Get computers with filters and pagination
 */
export const getComputers = async (
  filters: ComputerFilters = {},
  pagination: PaginationOptions = {}
): Promise<{ data: ComputerWithRelations[] | null; error: Error | null; count: number | null }> => {
  const { page = 1, perPage = 20 } = pagination;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('items')
    .select(`
      *,
      images:item_images(*),
      store:stores(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `, { count: 'exact' })
    .eq('item_type', 'computer');

  // Apply filters
  if (filters.storeId) {
    query = query.eq('store_id', filters.storeId);
  }
  if (filters.cityId) {
    query = query.eq('city_id', filters.cityId);
  }
  if (filters.neighborhoodId) {
    query = query.eq('neighborhood_id', filters.neighborhoodId);
  }
  if (filters.condition) {
    query = query.eq('condition', filters.condition);
  }
  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.brand) {
    query = query.ilike('brand', `%${filters.brand}%`);
  }
  if (filters.search) {
    query = query.or(`title_fr.ilike.%${filters.search}%,title_ar.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  } else {
    // Default to showing only approved items for non-admin users
    query = query.eq('status', 'approved');
  }

  // Apply pagination
  query = query.range(from, to).order('created_at', { ascending: false });

  const { data, error, count } = await query;

  return { data, error, count };
};

/**
 * Get a single computer by ID or slug
 */
export const getComputerById = async (
  idOrSlug: string
): Promise<{ data: ComputerWithRelations | null; error: Error | null }> => {
  // Check if it's a UUID or slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  let query = supabase
    .from('items')
    .select(`
      *,
      images:item_images(*),
      store:stores(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('item_type', 'computer');

  if (isUuid) {
    query = query.eq('id', idOrSlug);
  } else {
    query = query.eq('slug', idOrSlug);
  }

  const { data, error } = await query.single();

  return { data, error };
};

/**
 * Get computer parts with filters and pagination
 */
export const getComputerParts = async (
  filters: ComputerPartFilters = {},
  pagination: PaginationOptions = {}
): Promise<{ data: ComputerPartWithRelations[] | null; error: Error | null; count: number | null }> => {
  const { page = 1, perPage = 20 } = pagination;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('items')
    .select(`
      *,
      images:item_images(*),
      store:stores(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `, { count: 'exact' })
    .eq('item_type', 'computer_part');

  // Apply filters
  if (filters.storeId) {
    query = query.eq('store_id', filters.storeId);
  }
  if (filters.cityId) {
    query = query.eq('city_id', filters.cityId);
  }
  if (filters.search) {
    query = query.or(`title_fr.ilike.%${filters.search}%,title_ar.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
  }
  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  } else {
    query = query.eq('status', 'approved');
  }

  // Apply pagination
  query = query.range(from, to).order('created_at', { ascending: false });

  const { data, error, count } = await query;

  return { data, error, count };
};

/**
 * Get a single computer part by ID or slug
 */
export const getComputerPartById = async (
  idOrSlug: string
): Promise<{ data: ComputerPartWithRelations | null; error: Error | null }> => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  let query = supabase
    .from('items')
    .select(`
      *,
      images:item_images(*),
      store:stores(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('item_type', 'computer_part');

  if (isUuid) {
    query = query.eq('id', idOrSlug);
  } else {
    query = query.eq('slug', idOrSlug);
  }

  const { data, error } = await query.single();

  return { data, error };
};

/**
 * Get computer repair services with filters and pagination
 */
export const getComputerRepairServices = async (
  filters: ComputerRepairFilters = {},
  pagination: PaginationOptions = {}
): Promise<{ data: ComputerRepairWithRelations[] | null; error: Error | null; count: number | null }> => {
  const { page = 1, perPage = 20 } = pagination;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('repair_services')
    .select(`
      *,
      store:stores(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `, { count: 'exact' })
    .or('device_types.cs.{computer},device_types.cs.{laptop},device_types.cs.{pc}');

  // Apply filters
  if (filters.storeId) {
    query = query.eq('store_id', filters.storeId);
  }
  if (filters.cityId) {
    query = query.eq('city_id', filters.cityId);
  }
  if (filters.search) {
    query = query.or(`service_name_fr.ilike.%${filters.search}%,service_name_ar.ilike.%${filters.search}%,description_fr.ilike.%${filters.search}%`);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  } else {
    query = query.eq('status', 'approved');
  }

  // Apply pagination
  query = query.range(from, to).order('created_at', { ascending: false });

  const { data, error, count } = await query;

  return { data, error, count };
};

/**
 * Create a new computer listing
 */
export const createComputer = async (
  computer: Omit<TablesInsert<'items'>, 'id' | 'created_at' | 'updated_at'> & { computer_details?: ComputerDetails }
): Promise<{ data: ComputerItem | null; error: Error | null }> => {
  // Ensure item_type is set to computer
  const computerData = {
    ...computer,
    item_type: 'computer' as const,
  };

  const { data, error } = await supabase
    .from('items')
    .insert(computerData)
    .select()
    .single();

  // Invalidate cache
  invalidateListingsCache();

  return { data, error };
};

/**
 * Create a new computer part listing
 */
export const createComputerPart = async (
  part: Omit<TablesInsert<'items'>, 'id' | 'created_at' | 'updated_at'> & { computer_details?: ComputerPartDetails }
): Promise<{ data: ComputerPartItem | null; error: Error | null }> => {
  const partData = {
    ...part,
    item_type: 'computer_part' as const,
  };

  const { data, error } = await supabase
    .from('items')
    .insert(partData)
    .select()
    .single();

  invalidateListingsCache();

  return { data, error };
};

/**
 * Create a new computer repair service
 */
export const createComputerRepairService = async (
  service: Omit<TablesInsert<'repair_services'>, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: ComputerRepairService | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('repair_services')
    .insert(service)
    .select()
    .single();

  return { data, error };
};

/**
 * Update a computer listing
 */
export const updateComputer = async (
  id: string,
  updates: TablesUpdate<'items'>
): Promise<{ data: ComputerItem | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .eq('item_type', 'computer')
    .select()
    .single();

  invalidateListingsCache();

  return { data, error };
};

/**
 * Update a computer part listing
 */
export const updateComputerPart = async (
  id: string,
  updates: TablesUpdate<'items'>
): Promise<{ data: ComputerPartItem | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .eq('item_type', 'computer_part')
    .select()
    .single();

  invalidateListingsCache();

  return { data, error };
};

/**
 * Update a computer repair service
 */
export const updateComputerRepairService = async (
  id: string,
  updates: TablesUpdate<'repair_services'>
): Promise<{ data: ComputerRepairService | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('repair_services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

/**
 * Delete a computer listing
 */
export const deleteComputer = async (
  id: string
): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .eq('item_type', 'computer');

  invalidateListingsCache();

  return { error };
};

/**
 * Delete a computer part listing
 */
export const deleteComputerPart = async (
  id: string
): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .eq('item_type', 'computer_part');

  invalidateListingsCache();

  return { error };
};

/**
 * Delete a computer repair service
 */
export const deleteComputerRepairService = async (
  id: string
): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('repair_services')
    .delete()
    .eq('id', id);

  return { error };
};

/**
 * Common computer part categories
 */
export const COMPUTER_PART_CATEGORIES = [
  'RAM',
  'SSD',
  'HDD',
  'Battery',
  'Screen',
  'Keyboard',
  'GPU',
  'Motherboard',
  'CPU',
  'Power Supply',
  'Cooling Fan',
  'Webcam',
  'WiFi Card',
  'Other',
] as const;

export type ComputerPartCategory = typeof COMPUTER_PART_CATEGORIES[number];
