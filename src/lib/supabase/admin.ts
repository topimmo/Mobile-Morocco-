import { supabase } from './client';

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'hidden';
export type CampaignStatus = 'draft' | 'submitted' | 'pending_review' | 'approved' | 'active' | 'expired' | 'rejected' | 'paused' | 'completed';

// Statistics Types
export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalRepairShops: number;
  totalAdCampaigns: number;
  pendingListings: number;
  pendingRepairShops: number;
  pendingCampaigns: number;
  pendingNeighborhoods: number;
  approvedListings: number;
  approvedRepairShops: number;
  activeCampaigns: number;
}

export interface PendingListing {
  id: string;
  title: string;
  slug: string;
  price: number;
  condition: string;
  status: ListingStatus;
  created_at: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  category_name?: string;
  city_name?: string;
  image_url?: string;
}

export interface PendingRepairShop {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ListingStatus;
  created_at: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  city_name?: string;
  phone?: string;
  cover_image?: string;
}

export interface PendingCampaign {
  id: string;
  title: string;
  description: string;
  target_url: string;
  slot: string;
  duration_days: number;
  start_date: string;
  end_date: string;
  status: CampaignStatus;
  created_at: string;
  advertiser_id: string;
  advertiser_email?: string;
  advertiser_name?: string;
  banner_desktop_url?: string;
  banner_mobile_url?: string;
}

// Fetch admin statistics
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    // Fetch all counts in parallel for performance
    const [
      usersResult,
      listingsResult,
      pendingListingsResult,
      approvedListingsResult,
      repairShopsResult,
      pendingShopsResult,
      approvedShopsResult,
      campaignsResult,
      pendingCampaignsResult,
      activeCampaignsResult,
      pendingNeighborhoodsResult,
    ] = await Promise.all([
      // Total users (profiles)
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      // Total listings
      supabase.from('listings').select('id', { count: 'exact', head: true }),
      // Pending listings
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      // Approved listings
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      // Total repair shops
      supabase.from('repair_shops').select('id', { count: 'exact', head: true }),
      // Pending repair shops
      supabase.from('repair_shops').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      // Approved repair shops
      supabase.from('repair_shops').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      // Total campaigns
      supabase.from('ad_campaigns').select('id', { count: 'exact', head: true }),
      // Pending campaigns
      supabase.from('ad_campaigns').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      // Active campaigns
      supabase.from('ad_campaigns').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      // Pending neighborhoods
      supabase.from('neighborhoods').select('id', { count: 'exact', head: true }).eq('is_verified', false),
    ]);

    return {
      totalUsers: usersResult.count ?? 0,
      totalListings: listingsResult.count ?? 0,
      totalRepairShops: repairShopsResult.count ?? 0,
      totalAdCampaigns: campaignsResult.count ?? 0,
      pendingListings: pendingListingsResult.count ?? 0,
      pendingRepairShops: pendingShopsResult.count ?? 0,
      pendingCampaigns: pendingCampaignsResult.count ?? 0,
      pendingNeighborhoods: pendingNeighborhoodsResult.count ?? 0,
      approvedListings: approvedListingsResult.count ?? 0,
      approvedRepairShops: approvedShopsResult.count ?? 0,
      activeCampaigns: activeCampaignsResult.count ?? 0,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      totalUsers: 0,
      totalListings: 0,
      totalRepairShops: 0,
      totalAdCampaigns: 0,
      pendingListings: 0,
      pendingRepairShops: 0,
      pendingCampaigns: 0,
      pendingNeighborhoods: 0,
      approvedListings: 0,
      approvedRepairShops: 0,
      activeCampaigns: 0,
    };
  }
};

// Pagination interface for admin queries
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// Fetch pending listings for moderation with pagination
export const getPendingListings = async (
  pagination: PaginationParams = {}
): Promise<PaginatedResult<PendingListing>> => {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  try {
    const { data, error, count } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        slug,
        price,
        condition,
        status,
        created_at,
        user_id,
        image_url,
        categories (name_fr),
        cities (name_fr)
      `, { count: 'exact' })
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const total = count || 0;
    const mappedData = (data || []).map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      slug: listing.slug,
      price: listing.price,
      condition: listing.condition,
      status: listing.status,
      created_at: listing.created_at,
      user_id: listing.user_id,
      image_url: listing.image_url,
      category_name: listing.categories?.name_fr || 'Non catégorisé',
      city_name: listing.cities?.name_fr || 'Non spécifié',
    }));

    return {
      data: mappedData,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    return { data: [], total: 0, page: 1, totalPages: 0, hasMore: false };
  }
};

// Fetch pending repair shops for moderation
export const getPendingRepairShops = async (limit = 50): Promise<PendingRepairShop[]> => {
  try {
    const { data, error } = await supabase
      .from('repair_shops')
      .select(`
        id,
        name,
        slug,
        description,
        status,
        created_at,
        user_id,
        phone,
        cover_image,
        cities (name_fr)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((shop: any) => ({
      id: shop.id,
      name: shop.name,
      slug: shop.slug,
      description: shop.description,
      status: shop.status,
      created_at: shop.created_at,
      user_id: shop.user_id,
      phone: shop.phone,
      cover_image: shop.cover_image,
      city_name: shop.cities?.name_fr || 'Non spécifié',
    }));
  } catch (error) {
    console.error('Error fetching pending repair shops:', error);
    return [];
  }
};

// Fetch pending campaigns for moderation
export const getPendingCampaigns = async (limit = 50): Promise<PendingCampaign[]> => {
  try {
    const { data, error } = await supabase
      .from('ad_campaigns')
      .select(`
        id,
        title,
        description,
        target_url,
        slot,
        duration_days,
        start_date,
        end_date,
        status,
        created_at,
        advertiser_id,
        banner_desktop_url,
        banner_mobile_url
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((campaign: any) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      target_url: campaign.target_url,
      slot: campaign.slot,
      duration_days: campaign.duration_days,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      status: campaign.status,
      created_at: campaign.created_at,
      advertiser_id: campaign.advertiser_id,
      banner_desktop_url: campaign.banner_desktop_url,
      banner_mobile_url: campaign.banner_mobile_url,
    }));
  } catch (error) {
    console.error('Error fetching pending campaigns:', error);
    return [];
  }
};

// Approve a listing
export const approveListing = async (listingId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('listings')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', listingId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error approving listing:', error);
    return { success: false, error: error.message };
  }
};

// Reject a listing
export const rejectListing = async (listingId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('listings')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', listingId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting listing:', error);
    return { success: false, error: error.message };
  }
};

// Approve a repair shop
export const approveRepairShop = async (shopId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('repair_shops')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', shopId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error approving repair shop:', error);
    return { success: false, error: error.message };
  }
};

// Reject a repair shop
export const rejectRepairShop = async (shopId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('repair_shops')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', shopId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting repair shop:', error);
    return { success: false, error: error.message };
  }
};

// Approve a campaign
export const approveCampaign = async (campaignId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('ad_campaigns')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', campaignId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error approving campaign:', error);
    return { success: false, error: error.message };
  }
};

// Reject a campaign
export const rejectCampaign = async (campaignId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('ad_campaigns')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', campaignId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting campaign:', error);
    return { success: false, error: error.message };
  }
};

// Get all listings with filters for admin
export const getAllListings = async (options?: {
  status?: ListingStatus;
  limit?: number;
  offset?: number;
}) => {
  try {
    let query = supabase
      .from('listings')
      .select(`
        id,
        title,
        slug,
        price,
        condition,
        status,
        created_at,
        updated_at,
        user_id,
        image_url,
        categories (name_fr, name_ar),
        cities (name_fr, name_ar)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  } catch (error) {
    console.error('Error fetching all listings:', error);
    return { data: [], count: 0 };
  }
};

// Get all repair shops with filters for admin
export const getAllRepairShops = async (options?: {
  status?: ListingStatus;
  limit?: number;
  offset?: number;
}) => {
  try {
    let query = supabase
      .from('repair_shops')
      .select(`
        id,
        name,
        slug,
        description,
        status,
        created_at,
        updated_at,
        user_id,
        phone,
        cover_image,
        cities (name_fr, name_ar)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  } catch (error) {
    console.error('Error fetching all repair shops:', error);
    return { data: [], count: 0 };
  }
};

// Get recent activity for dashboard
export const getRecentActivity = async (limit = 10) => {
  try {
    const [recentListings, recentShops] = await Promise.all([
      supabase
        .from('listings')
        .select('id, title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('repair_shops')
        .select('id, name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),
    ]);

    const activities = [
      ...(recentListings.data || []).map((l: any) => ({
        type: 'listing' as const,
        id: l.id,
        title: l.title,
        status: l.status,
        created_at: l.created_at,
      })),
      ...(recentShops.data || []).map((s: any) => ({
        type: 'repair_shop' as const,
        id: s.id,
        title: s.name,
        status: s.status,
        created_at: s.created_at,
      })),
    ];

    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

// Neighborhood Management Functions

export interface PendingNeighborhood {
  id: string;
  name: string;
  slug: string;
  city_id: string;
  city_name_fr?: string;
  city_name_ar?: string;
  is_verified: boolean;
  created_by: string | null;
  created_at: string;
  creator_email?: string;
}

// Get pending neighborhoods (not yet verified)
export const getPendingNeighborhoods = async (): Promise<PendingNeighborhood[]> => {
  try {
    const { data, error } = await supabase
      .from('neighborhoods')
      .select(`
        *,
        city:cities(name_fr, name_ar)
      `)
      .eq('is_verified', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((n: any) => ({
      id: n.id,
      name: n.name,
      slug: n.slug,
      city_id: n.city_id,
      city_name_fr: n.city?.name_fr,
      city_name_ar: n.city?.name_ar,
      is_verified: n.is_verified,
      created_by: n.created_by,
      created_at: n.created_at,
    }));
  } catch (error) {
    console.error('Error fetching pending neighborhoods:', error);
    return [];
  }
};

// Approve a neighborhood
export const approveNeighborhood = async (neighborhoodId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('neighborhoods')
      .update({ is_verified: true })
      .eq('id', neighborhoodId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error approving neighborhood:', error);
    return { success: false, error: error.message };
  }
};

// Reject a neighborhood (delete it)
export const rejectNeighborhood = async (neighborhoodId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('neighborhoods')
      .delete()
      .eq('id', neighborhoodId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting neighborhood:', error);
    return { success: false, error: error.message };
  }
};

// ===============================================
// ITEMS MANAGEMENT (Phones, Computers, Parts, Equipment)
// ===============================================

export interface PendingItem {
  id: string;
  title_fr: string;
  title_ar: string;
  slug: string;
  item_type: string;
  condition: string;
  brand?: string;
  model?: string;
  price?: number;
  status: string;
  created_at: string;
  store_id?: string;
  store_name?: string;
  city_name?: string;
  image_url?: string;
}

// Fetch pending items (all types) for moderation with pagination
export const getPendingItems = async (
  pagination: PaginationParams = {},
  itemType?: string
): Promise<PaginatedResult<PendingItem>> => {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('items')
      .select(`
        id,
        title_fr,
        title_ar,
        slug,
        item_type,
        condition,
        brand,
        model,
        price,
        status,
        created_at,
        store_id,
        stores (name_fr),
        cities (name_fr),
        item_images (image_url)
      `, { count: 'exact' })
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by item type if specified
    if (itemType) {
      query = query.eq('item_type', itemType);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    const mappedData = (data || []).map((item: any) => ({
      id: item.id,
      title_fr: item.title_fr,
      title_ar: item.title_ar,
      slug: item.slug,
      item_type: item.item_type,
      condition: item.condition,
      brand: item.brand,
      model: item.model,
      price: item.price,
      status: item.status,
      created_at: item.created_at,
      store_id: item.store_id,
      store_name: item.stores?.name_fr || 'Non spécifié',
      city_name: item.cities?.name_fr || 'Non spécifié',
      image_url: item.item_images?.[0]?.image_url,
    }));

    return {
      data: mappedData,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error('Error fetching pending items:', error);
    return { data: [], total: 0, page: 1, totalPages: 0, hasMore: false };
  }
};

// Approve an item
export const approveItem = async (itemId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('items')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error approving item:', error);
    return { success: false, error: error.message };
  }
};

// Reject an item
export const rejectItem = async (itemId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('items')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting item:', error);
    return { success: false, error: error.message };
  }
};

// Get all items with filters and pagination
export const getAllItems = async (
  options?: {
    status?: string;
    itemType?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ data: any[]; count: number }> => {
  try {
    let query = supabase
      .from('items')
      .select(`
        id,
        title_fr,
        title_ar,
        slug,
        item_type,
        condition,
        brand,
        model,
        price,
        status,
        created_at,
        updated_at,
        store_id,
        stores (name_fr, name_ar),
        cities (name_fr, name_ar),
        item_images (image_url)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.itemType) {
      query = query.eq('item_type', options.itemType);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  } catch (error) {
    console.error('Error fetching all items:', error);
    return { data: [], count: 0 };
  }
};

// Update admin stats to include items
export const getAdminStatsWithItems = async (): Promise<AdminStats & {
  totalItems: number;
  pendingItems: number;
  approvedItems: number;
  pendingComputers: number;
  pendingComputerParts: number;
}> => {
  try {
    const baseStats = await getAdminStats();
    
    const [
      itemsResult,
      pendingItemsResult,
      approvedItemsResult,
      pendingComputersResult,
      pendingComputerPartsResult,
    ] = await Promise.all([
      supabase.from('items').select('id', { count: 'exact', head: true }),
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('status', 'pending').eq('item_type', 'computer'),
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('status', 'pending').eq('item_type', 'computer_part'),
    ]);

    return {
      ...baseStats,
      totalItems: itemsResult.count || 0,
      pendingItems: pendingItemsResult.count || 0,
      approvedItems: approvedItemsResult.count || 0,
      pendingComputers: pendingComputersResult.count || 0,
      pendingComputerParts: pendingComputerPartsResult.count || 0,
    };
  } catch (error) {
    console.error('Error fetching admin stats with items:', error);
    const baseStats = await getAdminStats();
    return {
      ...baseStats,
      totalItems: 0,
      pendingItems: 0,
      approvedItems: 0,
      pendingComputers: 0,
      pendingComputerParts: 0,
    };
  }
};
