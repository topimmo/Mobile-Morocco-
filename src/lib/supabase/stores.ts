import { supabase } from './client';
import type { Database } from '@/types/supabase';
import { invalidateHomepageCache } from '@/lib/cache';

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'hidden';
export type StoreType = 'shop' | 'individual';
export type ItemType = 'phone' | 'spare_part' | 'equipment';
export type ItemCondition = 'new' | 'used';

type Store = Database['public']['Tables']['stores']['Row'];
type StoreInsert = Database['public']['Tables']['stores']['Insert'];
type StoreUpdate = Database['public']['Tables']['stores']['Update'];
type StoreImage = Database['public']['Tables']['store_images']['Row'];
type Item = Database['public']['Tables']['items']['Row'];
type ItemImage = Database['public']['Tables']['item_images']['Row'];
type RepairService = Database['public']['Tables']['repair_services']['Row'];
type City = Database['public']['Tables']['cities']['Row'];
type Neighborhood = Database['public']['Tables']['neighborhoods']['Row'];

export interface StoreWithRelations extends Store {
  images?: StoreImage[];
  city?: City | null;
  neighborhood?: Neighborhood | null;
  items_count?: number;
  services_count?: number;
}

export interface ItemWithRelations extends Item {
  images?: ItemImage[];
  store?: Store | null;
  city?: City | null;
  neighborhood?: Neighborhood | null;
  phone_details?: {
    color?: string;
    storage?: string;
    ram?: string;
    battery_health?: number;
    warranty?: boolean;
    accessories?: string[];
    sim_type?: string;
    network?: string;
  };
}

export interface ServiceWithRelations extends RepairService {
  store?: Store | null;
  city?: City | null;
  neighborhood?: Neighborhood | null;
}

export interface StoreFilters {
  cityId?: string;
  neighborhoodId?: string;
  storeType?: StoreType;
  status?: ListingStatus;
  keyword?: string;
}

export interface ItemFilters {
  storeId?: string;
  itemType?: ItemType;
  condition?: ItemCondition;
  cityId?: string;
  neighborhoodId?: string;
  status?: ListingStatus;
  keyword?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ServiceFilters {
  storeId?: string;
  cityId?: string;
  neighborhoodId?: string;
  status?: ListingStatus;
  keyword?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============ STORE FUNCTIONS ============

export async function getStores(
  filters: StoreFilters = {},
  pagination: PaginationOptions = {}
): Promise<{ data: StoreWithRelations[]; count: number }> {
  try {
    const { page = 1, limit = 12, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('stores')
      .select(`
        *,
        images:store_images(*),
        city:cities(*),
        neighborhood:neighborhoods(*)
      `, { count: 'exact' })
      .eq('status', filters.status || 'approved');

    if (filters.cityId) {
      query = query.eq('city_id', filters.cityId);
    }

    if (filters.neighborhoodId) {
      query = query.eq('neighborhood_id', filters.neighborhoodId);
    }

    if (filters.storeType) {
      query = query.eq('store_type', filters.storeType);
    }

    if (filters.keyword) {
      query = query.or(`name_fr.ilike.%${filters.keyword}%,name_ar.ilike.%${filters.keyword}%,description_fr.ilike.%${filters.keyword}%,description_ar.ilike.%${filters.keyword}%`);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching stores:', error);
      return { data: getMockStores(), count: getMockStores().length };
    }

    return { data: (data as StoreWithRelations[]) || [], count: count || 0 };
  } catch (err) {
    console.error('Error fetching stores:', err);
    return { data: getMockStores(), count: getMockStores().length };
  }
}

// Mock stores for fallback
function getMockStores(): StoreWithRelations[] {
  return [
    {
      id: '1', user_id: '1', owner_id: '1', name_fr: 'TechMobile Casablanca', name_ar: 'تك موبايل الدار البيضاء', slug: 'techmobile-casa', 
      description_fr: 'Boutique spécialisée en téléphones et réparation', description_ar: 'متجر متخصص في الهواتف والإصلاح',
      store_type: 'shop' as const, address_fr: 'Bd Mohammed V, Casablanca', address_ar: 'شارع محمد الخامس، الدار البيضاء',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Maarif', lat: null, lng: null,
      phone: '+212 661 234 567', whatsapp: '212661234567', email: 'contact@techmobile.ma', website: null,
      working_hours: {}, working_days: ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam'], emergency_service: false,
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, rating_avg: 4.5, rating_count: 23,
      meta_title: null, meta_description: null, is_demo: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: '2', user_id: '2', owner_id: '2', name_fr: 'Mobile Expert Rabat', name_ar: 'خبير الموبايل الرباط', slug: 'mobile-expert-rabat',
      description_fr: 'Vente et réparation de smartphones', description_ar: 'بيع وإصلاح الهواتف الذكية',
      store_type: 'shop' as const, address_fr: 'Av Hassan II, Rabat', address_ar: 'شارع الحسن الثاني، الرباط',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Agdal', lat: null, lng: null,
      phone: '+212 662 345 678', whatsapp: '212662345678', email: 'info@mobileexpert.ma', website: null,
      working_hours: {}, working_days: ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam'], emergency_service: true,
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, rating_avg: 4.8, rating_count: 45,
      meta_title: null, meta_description: null, is_demo: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: '3', user_id: '3', owner_id: '3', name_fr: 'Vendeur Particulier', name_ar: 'بائع فردي', slug: 'vendeur-particulier',
      description_fr: 'Vente de téléphones d\'occasion', description_ar: 'بيع الهواتف المستعملة',
      store_type: 'individual' as const, address_fr: 'Marrakech', address_ar: 'مراكش',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Guéliz', lat: null, lng: null,
      phone: '+212 663 456 789', whatsapp: '212663456789', email: null, website: null,
      working_hours: {}, working_days: [], emergency_service: false,
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, rating_avg: 4.2, rating_count: 8,
      meta_title: null, meta_description: null, is_demo: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  ];
}

export async function getStoreBySlug(slug: string): Promise<StoreWithRelations | null> {
  const { data, error } = await supabase
    .from('stores')
    .select(`
      *,
      images:store_images(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching store:', error);
    return null;
  }

  return data as StoreWithRelations;
}

/**
 * Fetch store with all its items in a single operation
 * Optimized to avoid N+1 query pattern
 */
export async function getStoreWithItems(slug: string): Promise<{
  store: StoreWithRelations | null;
  items: ItemWithRelations[];
}> {
  try {
    // Fetch store first
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select(`
        *,
        images:store_images(*),
        city:cities(*),
        neighborhood:neighborhoods(*)
      `)
      .eq('slug', slug)
      .single();

    if (storeError || !store) {
      console.error('Error fetching store:', storeError);
      return { store: null, items: [] };
    }

    // Fetch items for this store
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select(`
        *,
        images:item_images(*)
      `)
      .eq('store_id', store.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (itemsError) {
      console.error('Error fetching store items:', itemsError);
      return { store: store as StoreWithRelations, items: [] };
    }

    return { store: store as StoreWithRelations, items: (items || []) as ItemWithRelations[] };
  } catch (err) {
    console.error('Error fetching store with items:', err);
    return { store: null, items: [] };
  }
}

export async function getStoreById(id: string): Promise<StoreWithRelations | null> {
  const { data, error } = await supabase
    .from('stores')
    .select(`
      *,
      images:store_images(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching store:', error);
    return null;
  }

  return data as StoreWithRelations;
}

export async function getStoreByUserId(userId: string): Promise<StoreWithRelations | null> {
  const { data, error } = await supabase
    .from('stores')
    .select(`
      *,
      images:store_images(*),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching store:', error);
    return null;
  }

  return data as StoreWithRelations;
}

export async function createStore(store: StoreInsert): Promise<Store | null> {
  const { data, error } = await supabase
    .from('stores')
    .insert(store)
    .select()
    .single();

  if (error) {
    console.error('Error creating store:', error);
    return null;
  }

  return data;
}

export async function updateStore(id: string, update: StoreUpdate): Promise<Store | null> {
  const { data, error } = await supabase
    .from('stores')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating store:', error);
    return null;
  }

  return data;
}

export async function incrementStoreClicks(id: string, type: 'whatsapp' | 'phone' | 'view'): Promise<void> {
  await supabase.rpc('increment_store_counter', { 
    p_store_id: id,
    p_counter_type: type
  });
}

// ============ ITEM FUNCTIONS ============

export async function getItems(
  filters: ItemFilters = {},
  pagination: PaginationOptions = {}
): Promise<{ data: ItemWithRelations[]; count: number }> {
  try {
    const { page = 1, limit = 12, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('items')
      .select(`
        *,
        images:item_images(*),
        store:stores(*),
        city:cities(*),
        neighborhood:neighborhoods(*)
      `, { count: 'exact' })
      .eq('status', filters.status || 'approved');

    if (filters.storeId) {
      query = query.eq('store_id', filters.storeId);
    }

    if (filters.itemType) {
      query = query.eq('item_type', filters.itemType);
    }

    if (filters.condition) {
      query = query.eq('condition', filters.condition);
    }

    if (filters.cityId) {
      query = query.eq('city_id', filters.cityId);
    }

    if (filters.neighborhoodId) {
      query = query.eq('neighborhood_id', filters.neighborhoodId);
    }

    if (filters.brand) {
      query = query.eq('brand', filters.brand);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.keyword) {
      query = query.or(`title_fr.ilike.%${filters.keyword}%,title_ar.ilike.%${filters.keyword}%,description_fr.ilike.%${filters.keyword}%,description_ar.ilike.%${filters.keyword}%,brand.ilike.%${filters.keyword}%,model.ilike.%${filters.keyword}%`);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching items:', error);
      const mockItems = getMockItems(filters.itemType);
      return { data: mockItems, count: mockItems.length };
    }

    return { data: (data as ItemWithRelations[]) || [], count: count || 0 };
  } catch (err) {
    console.error('Error fetching items:', err);
    const mockItems = getMockItems(filters.itemType);
    return { data: mockItems, count: mockItems.length };
  }
}

// Mock items for fallback
function getMockItems(itemType?: ItemType): ItemWithRelations[] {
  const mockPhones: ItemWithRelations[] = [
    {
      id: '1', store_id: '1', item_type: 'phone' as const, condition: 'new' as const,
      title_fr: 'iPhone 15 Pro Max 256GB', title_ar: 'آيفون 15 برو ماكس 256 جيجا', slug: 'iphone-15-pro-max-256',
      description_fr: 'iPhone 15 Pro Max neuf, garantie 1 an', description_ar: 'آيفون 15 برو ماكس جديد، ضمان سنة',
      price: 14999, price_text: null, currency: 'MAD', brand: 'Apple', model: 'iPhone 15 Pro Max',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Maarif, Casablanca',
      phone: '+212 661 234 567', whatsapp: '212661234567',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: '2', store_id: '2', item_type: 'phone' as const, condition: 'used' as const,
      title_fr: 'Samsung Galaxy S24 Ultra', title_ar: 'سامسونج جالاكسي S24 الترا', slug: 'samsung-s24-ultra',
      description_fr: 'Samsung S24 Ultra en excellent état', description_ar: 'سامسونج S24 الترا في حالة ممتازة',
      price: 11500, price_text: null, currency: 'MAD', brand: 'Samsung', model: 'Galaxy S24 Ultra',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Agdal, Rabat',
      phone: '+212 662 345 678', whatsapp: '212662345678',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: '3', store_id: '3', item_type: 'phone' as const, condition: 'used' as const,
      title_fr: 'Xiaomi 14 Pro', title_ar: 'شاومي 14 برو', slug: 'xiaomi-14-pro',
      description_fr: 'Xiaomi 14 Pro occasion, très bon état', description_ar: 'شاومي 14 برو مستعمل، حالة جيدة جداً',
      price: 6500, price_text: null, currency: 'MAD', brand: 'Xiaomi', model: '14 Pro',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Guéliz, Marrakech',
      phone: '+212 663 456 789', whatsapp: '212663456789',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  ];

  const mockSpareParts: ItemWithRelations[] = [
    {
      id: '4', store_id: '1', item_type: 'spare_part' as const, condition: 'new' as const,
      title_fr: 'Écran iPhone 14 Pro Original', title_ar: 'شاشة آيفون 14 برو أصلية', slug: 'ecran-iphone-14-pro',
      description_fr: 'Écran OLED original Apple pour iPhone 14 Pro', description_ar: 'شاشة OLED أصلية أبل لآيفون 14 برو',
      price: 2800, price_text: null, currency: 'MAD', brand: 'Apple', model: 'iPhone 14 Pro',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Derb Omar, Casablanca',
      phone: '+212 661 234 567', whatsapp: '212661234567',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: '5', store_id: '1', item_type: 'spare_part' as const, condition: 'new' as const,
      title_fr: 'Batterie Samsung S23', title_ar: 'بطارية سامسونج S23', slug: 'batterie-samsung-s23',
      description_fr: 'Batterie de remplacement Samsung Galaxy S23', description_ar: 'بطارية بديلة لسامسونج جالاكسي S23',
      price: 350, price_text: null, currency: 'MAD', brand: 'Samsung', model: 'Galaxy S23',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Derb Omar, Casablanca',
      phone: '+212 661 234 567', whatsapp: '212661234567',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  ];

  const mockEquipment: ItemWithRelations[] = [
    {
      id: '6', store_id: '1', item_type: 'equipment' as const, condition: 'new' as const,
      title_fr: 'Station de Soudure JBC', title_ar: 'محطة لحام JBC', slug: 'station-soudure-jbc',
      description_fr: 'Station de soudure professionnelle JBC', description_ar: 'محطة لحام احترافية JBC',
      price: 4500, price_text: null, currency: 'MAD', brand: 'JBC', model: 'CD-2BE',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Hay Mohammadi, Casablanca',
      phone: '+212 661 234 567', whatsapp: '212661234567',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: '7', store_id: '2', item_type: 'equipment' as const, condition: 'used' as const,
      title_fr: 'Microscope Trinoculaire', title_ar: 'مجهر ثلاثي العينيات', slug: 'microscope-trinoculaire',
      description_fr: 'Microscope trinoculaire pour réparation mobile', description_ar: 'مجهر ثلاثي لإصلاح الهواتف',
      price: 2800, price_text: null, currency: 'MAD', brand: 'AmScope', model: 'SM-4TZ-144A',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Agdal, Rabat',
      phone: '+212 662 345 678', whatsapp: '212662345678',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  ];

  if (itemType === 'phone') return mockPhones;
  if (itemType === 'spare_part') return mockSpareParts;
  if (itemType === 'equipment') return mockEquipment;
  
  return [...mockPhones, ...mockSpareParts, ...mockEquipment];
}

export async function getItemBySlug(slug: string): Promise<ItemWithRelations | null> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        images:item_images(*),
        store:stores(*, images:store_images(*), city:cities(*)),
        city:cities(*),
        neighborhood:neighborhoods(*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Error fetching item:', error);
      // Try to find in mock data as fallback
      const mockItems = getMockItems();
      return mockItems.find(item => item.slug === slug) || null;
    }

    return data as ItemWithRelations;
  } catch (err) {
    console.error('Error fetching item:', err);
    // Fallback to mock data
    const mockItems = getMockItems();
    return mockItems.find(item => item.slug === slug) || null;
  }
}

/**
 * Fetch item with related similar items in a single operation
 * Avoids N+1 by fetching similar items in parallel
 */
export async function getItemWithSimilar(slug: string, similarLimit: number = 4): Promise<{
  item: ItemWithRelations | null;
  similarItems: ItemWithRelations[];
}> {
  try {
    // Fetch main item first
    const { data: item, error } = await supabase
      .from('items')
      .select(`
        *,
        images:item_images(*),
        store:stores(*, images:store_images(*), city:cities(*)),
        city:cities(*),
        neighborhood:neighborhoods(*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !item) {
      console.error('Error fetching item:', error);
      const mockItems = getMockItems();
      const mockItem = mockItems.find(i => i.slug === slug) || null;
      return { 
        item: mockItem, 
        similarItems: mockItem ? mockItems.filter(i => i.id !== mockItem.id && i.item_type === mockItem.item_type).slice(0, similarLimit) : []
      };
    }

    // Fetch similar items in parallel (same type and condition, excluding current)
    const { data: similarData } = await supabase
      .from('items')
      .select(`
        *,
        images:item_images(*)
      `)
      .eq('status', 'approved')
      .eq('item_type', item.item_type)
      .neq('id', item.id)
      .order('created_at', { ascending: false })
      .limit(similarLimit + 1); // Fetch one extra in case we need to filter

    const similarItems = (similarData || [])
      .slice(0, similarLimit) as ItemWithRelations[];

    return { item: item as ItemWithRelations, similarItems };
  } catch (err) {
    console.error('Error fetching item with similar:', err);
    const mockItems = getMockItems();
    const mockItem = mockItems.find(i => i.slug === slug) || null;
    return { 
      item: mockItem, 
      similarItems: mockItem ? mockItems.filter(i => i.id !== mockItem.id && i.item_type === mockItem.item_type).slice(0, similarLimit) : []
    };
  }
}

export async function getItemById(id: string): Promise<ItemWithRelations | null> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        images:item_images(*),
        store:stores(*),
        city:cities(*),
        neighborhood:neighborhoods(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching item:', error);
      // Try to find in mock data as fallback
      const mockItems = getMockItems();
      return mockItems.find(item => item.id === id) || null;
    }

    return data as ItemWithRelations;
  } catch (err) {
    console.error('Error fetching item:', err);
    // Fallback to mock data
    const mockItems = getMockItems();
    return mockItems.find(item => item.id === id) || null;
  }
}

export async function getItemsByStoreId(
  storeId: string,
  filters: ItemFilters = {},
  pagination: PaginationOptions = {}
): Promise<{ data: ItemWithRelations[]; count: number }> {
  return getItems({ ...filters, storeId }, pagination);
}

export async function createItem(item: Database['public']['Tables']['items']['Insert']): Promise<Item | null> {
  const { data, error } = await supabase
    .from('items')
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error('Error creating item:', error);
    return null;
  }

  // Invalidate homepage cache when new item is created
  invalidateHomepageCache();

  return data;
}

export async function updateItem(id: string, update: Database['public']['Tables']['items']['Update']): Promise<Item | null> {
  const { data, error } = await supabase
    .from('items')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating item:', error);
    return null;
  }

  // Invalidate cache on status changes (e.g., approval)
  if (update.status) {
    invalidateHomepageCache();
  }

  return data;
}

export async function deleteItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting item:', error);
    return false;
  }

  // Invalidate cache when item is deleted
  invalidateHomepageCache();

  return true;
}

export async function incrementItemClicks(id: string, type: 'whatsapp' | 'phone' | 'view'): Promise<void> {
  await supabase.rpc('increment_item_counter', { 
    p_item_id: id,
    p_counter_type: type
  });
}

// ============ REPAIR SERVICE FUNCTIONS ============

export async function getRepairServices(
  filters: ServiceFilters = {},
  pagination: PaginationOptions = {}
): Promise<{ data: ServiceWithRelations[]; count: number }> {
  try {
    const { page = 1, limit = 12, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('repair_services')
      .select(`
        *,
        store:stores(*, images:store_images(*)),
        city:cities(*),
        neighborhood:neighborhoods(*)
      `, { count: 'exact' })
      .eq('status', filters.status || 'approved');

    if (filters.storeId) {
      query = query.eq('store_id', filters.storeId);
    }

    if (filters.cityId) {
      query = query.eq('city_id', filters.cityId);
    }

    if (filters.neighborhoodId) {
      query = query.eq('neighborhood_id', filters.neighborhoodId);
    }

    if (filters.keyword) {
      query = query.or(`service_name_fr.ilike.%${filters.keyword}%,service_name_ar.ilike.%${filters.keyword}%,description_fr.ilike.%${filters.keyword}%,description_ar.ilike.%${filters.keyword}%`);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching services:', error);
      const mockServices = getMockServices();
      return { data: mockServices, count: mockServices.length };
    }

    return { data: (data as ServiceWithRelations[]) || [], count: count || 0 };
  } catch (err) {
    console.error('Error fetching services:', err);
    const mockServices = getMockServices();
    return { data: mockServices, count: mockServices.length };
  }
}

// Mock services for fallback
function getMockServices(): ServiceWithRelations[] {
  return [
    {
      id: '1', store_id: '1', service_name_fr: 'Réparation Écran iPhone', service_name_ar: 'إصلاح شاشة آيفون',
      slug: 'reparation-ecran-iphone', description_fr: 'Remplacement écran iPhone toutes générations',
      description_ar: 'استبدال شاشة آيفون لجميع الأجيال', device_types: ['iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12'],
      price: 800, price_on_request: false, estimated_duration: '30-60 min',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Maarif, Casablanca',
      phone: '+212 661 234 567', whatsapp: '212661234567',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      store: {
        id: '1', user_id: '1', owner_id: '1', name_fr: 'TechMobile Casablanca', name_ar: 'تك موبايل الدار البيضاء', slug: 'techmobile-casa',
        description_fr: null, description_ar: null, store_type: 'shop' as const, address_fr: null, address_ar: null,
        city_id: null, neighborhood_id: null, neighborhood_custom: null, lat: null, lng: null,
        phone: '+212 661 234 567', whatsapp: '212661234567', email: null, website: null,
        working_hours: {}, working_days: [], emergency_service: true,
        status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, rating_avg: 4.5, rating_count: 23,
        meta_title: null, meta_description: null, is_demo: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
      }
    },
    {
      id: '2', store_id: '2', service_name_fr: 'Réparation Samsung Galaxy', service_name_ar: 'إصلاح سامسونج جالاكسي',
      slug: 'reparation-samsung-galaxy', description_fr: 'Réparation complète smartphones Samsung',
      description_ar: 'إصلاح كامل لهواتف سامسونج الذكية', device_types: ['Galaxy S24', 'Galaxy S23', 'Galaxy A54'],
      price: null, price_on_request: true, estimated_duration: '1-2 heures',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Agdal, Rabat',
      phone: '+212 662 345 678', whatsapp: '212662345678',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      store: {
        id: '2', user_id: '2', name_fr: 'Mobile Expert Rabat', name_ar: 'خبير الموبايل الرباط', slug: 'mobile-expert-rabat',
        description_fr: null, description_ar: null, store_type: 'shop' as const, address_fr: null, address_ar: null,
        city_id: null, neighborhood_id: null, neighborhood_custom: null, lat: null, lng: null,
        phone: '+212 662 345 678', whatsapp: '212662345678', email: null, website: null,
        working_hours: {}, working_days: [], emergency_service: false,
        status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, rating_avg: 4.8, rating_count: 45,
        meta_title: null, meta_description: null, is_demo: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
      }
    },
    {
      id: '3', store_id: '1', service_name_fr: 'Déblocage téléphone', service_name_ar: 'فك قفل الهاتف',
      slug: 'deblocage-telephone', description_fr: 'Déblocage opérateur et iCloud',
      description_ar: 'فك قفل المشغل وآي كلاود', device_types: ['iPhone', 'Samsung', 'Xiaomi', 'Huawei'],
      price: 200, price_on_request: false, estimated_duration: '15-30 min',
      city_id: null, neighborhood_id: null, neighborhood_custom: 'Maarif, Casablanca',
      phone: '+212 661 234 567', whatsapp: '212661234567',
      status: 'approved' as const, whatsapp_clicks: 0, phone_clicks: 0, view_count: 0, is_demo: false,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  ];
}

export async function getServiceBySlug(slug: string): Promise<ServiceWithRelations | null> {
  const { data, error } = await supabase
    .from('repair_services')
    .select(`
      *,
      store:stores(*, images:store_images(*), city:cities(*)),
      city:cities(*),
      neighborhood:neighborhoods(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    return null;
  }

  return data as ServiceWithRelations;
}

export async function getServicesByStoreId(
  storeId: string,
  filters: ServiceFilters = {},
  pagination: PaginationOptions = {}
): Promise<{ data: ServiceWithRelations[]; count: number }> {
  return getRepairServices({ ...filters, storeId }, pagination);
}

export async function createService(service: Database['public']['Tables']['repair_services']['Insert']): Promise<RepairService | null> {
  const { data, error } = await supabase
    .from('repair_services')
    .insert(service)
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    return null;
  }

  return data;
}

export async function updateService(id: string, update: Database['public']['Tables']['repair_services']['Update']): Promise<RepairService | null> {
  const { data, error } = await supabase
    .from('repair_services')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    return null;
  }

  return data;
}

export async function deleteService(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('repair_services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    return false;
  }

  return true;
}

export async function incrementServiceClicks(id: string, type: 'whatsapp' | 'phone' | 'view'): Promise<void> {
  await supabase.rpc('increment_service_counter', { 
    p_service_id: id,
    p_counter_type: type
  });
}

// ============ IMAGE UPLOAD HELPERS ============

export async function uploadStoreImage(storeId: string, file: File, isCover = false): Promise<StoreImage | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${storeId}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('store-images')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('store-images')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('store_images')
    .insert({
      store_id: storeId,
      image_url: publicUrl,
      is_cover: isCover,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving image record:', error);
    return null;
  }

  return data;
}

export async function uploadItemImage(itemId: string, file: File): Promise<ItemImage | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${itemId}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('item-images')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('item-images')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('item_images')
    .insert({
      item_id: itemId,
      image_url: publicUrl,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving image record:', error);
    return null;
  }

  return data;
}

// ============ UTILITY FUNCTIONS ============

export function getStoreName(store: Store, language: string): string {
  return language === 'ar' ? store.name_ar : store.name_fr;
}

export function getItemTitle(item: Item, language: string): string {
  return language === 'ar' ? item.title_ar : item.title_fr;
}

export function getServiceName(service: RepairService, language: string): string {
  return language === 'ar' ? service.service_name_ar : service.service_name_fr;
}
