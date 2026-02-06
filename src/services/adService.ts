import { supabase } from '@/utils/supabaseClient';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL;
  const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isValidUrl = rawUrl && rawUrl !== 'undefined' && rawUrl.startsWith('http') && !rawUrl.includes('xyzcompany');
  const isValidKey = rawKey && rawKey !== 'undefined' && rawKey.length > 10 && !rawKey.includes('placeholder');
  return isValidUrl && isValidKey;
};

// Types for advertisement management
export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: AdPosition;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  userId: string;
  paymentStatus: "pending" | "confirmed" | "failed";
  paymentReference?: string;
  impressions: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
  notificationPreferences?: {
    expiryReminder: boolean;
    paymentReminder: boolean;
    performanceReports: boolean;
    channels: {
      inApp: boolean;
      email: boolean;
      whatsApp: boolean;
    };
  };
}

export type AdPosition =
  | "header" // 728x90
  | "home_middle" // 970x250
  | "footer" // 728x90
  | "sidebar" // 300x250
  | "between_listings"; // 468x60

export interface AdPlacement {
  position: AdPosition;
  width: number;
  height: number;
  pricePerDay: number;
  description: string;
}

// Ad placement configurations
export const adPlacements: Record<AdPosition, AdPlacement> = {
  header: {
    position: "header",
    width: 728,
    height: 90,
    pricePerDay: 100,
    description: "Top of page banner",
  },
  home_middle: {
    position: "home_middle",
    width: 970,
    height: 250,
    pricePerDay: 150,
    description: "Middle of home page banner",
  },
  footer: {
    position: "footer",
    width: 728,
    height: 90,
    pricePerDay: 80,
    description: "Bottom of page banner",
  },
  sidebar: {
    position: "sidebar",
    width: 300,
    height: 250,
    pricePerDay: 70,
    description: "Sidebar rectangle",
  },
  between_listings: {
    position: "between_listings",
    width: 468,
    height: 60,
    pricePerDay: 60,
    description: "Between product listings",
  },
};

// Discount rates for longer durations
export const discountRates = {
  week: 0.1, // 10% discount for weekly ads
  month: 0.2, // 20% discount for monthly ads
  quarter: 0.3, // 30% discount for quarterly ads
};

// Mock data for development
let advertisements: Advertisement[] = [
  {
    id: "ad1",
    title: "Summer Sale on Smartphones",
    imageUrl:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
    linkUrl: "/promotions/summer-sale",
    position: "header",
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-06-30"),
    isActive: true,
    userId: "user1",
    paymentStatus: "confirmed",
    paymentReference: "REF123456",
    impressions: 1250,
    clicks: 78,
    createdAt: new Date("2023-05-25"),
    updatedAt: new Date("2023-05-25"),
    notificationPreferences: {
      expiryReminder: true,
      paymentReminder: true,
      performanceReports: true,
      channels: {
        inApp: true,
        email: true,
        whatsApp: false,
      },
    },
  },
  {
    id: "ad2",
    title: "New Accessories Collection",
    imageUrl:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80",
    linkUrl: "/categories/accessories",
    position: "sidebar",
    startDate: new Date("2023-06-15"),
    endDate: new Date("2023-07-15"),
    isActive: true,
    userId: "user2",
    paymentStatus: "confirmed",
    impressions: 980,
    clicks: 45,
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-10"),
    notificationPreferences: {
      expiryReminder: true,
      paymentReminder: true,
      performanceReports: false,
      channels: {
        inApp: true,
        email: false,
        whatsApp: false,
      },
    },
  },
];

/**
 * Get all advertisements
 */
export const getAllAds = async (): Promise<Advertisement[]> => {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return advertisements;
  }

  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get ads error:', error);
      return advertisements;
    }

    return data.map(mapDatabaseAdToModel);
  } catch (error) {
    console.error('Get ads error:', error);
    return advertisements;
  }
};

/**
 * Get active advertisements for a specific position
 */
export const getActiveAdsByPosition = async (
  position: AdPosition,
): Promise<Advertisement[]> => {
  // Helper function to filter mock ads
  const filterMockAds = () => {
    const now = new Date();
    return advertisements.filter(
      (ad) =>
        ad.position === position &&
        ad.isActive &&
        ad.startDate <= now &&
        ad.endDate >= now,
    );
  };

  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return filterMockAds();
  }

  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('placement', position)
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now);

    if (error) {
      console.error('Get active ads error:', error);
      return filterMockAds();
    }

    return data.map(mapDatabaseAdToModel);
  } catch (error) {
    console.error('Get active ads error:', error);
    return filterMockAds();
  }
};

/**
 * Get an advertisement by ID
 */
export const getAdById = async (
  id: string,
): Promise<Advertisement | undefined> => {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return advertisements.find((ad) => ad.id === id);
  }

  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get ad error:', error);
      return advertisements.find((ad) => ad.id === id);
    }

    return mapDatabaseAdToModel(data);
  } catch (error) {
    console.error('Get ad error:', error);
    return advertisements.find((ad) => ad.id === id);
  }
};

/**
 * Create a new advertisement
 */
export const createAd = async (
  ad: Omit<
    Advertisement,
    "id" | "impressions" | "clicks" | "createdAt" | "updatedAt"
  >,
): Promise<Advertisement> => {
  // Helper to create mock ad
  const createMockAd = () => {
    const newAd = {
      ...ad,
      id: `ad_${Date.now()}`,
      impressions: 0,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    advertisements.push(newAd);
    return newAd;
  };

  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return createMockAd();
  }

  try {
    const dbAdData = {
      advertiser_id: ad.userId,
      title: ad.title,
      image_url: ad.imageUrl,
      link_url: ad.linkUrl,
      placement: ad.position,
      start_date: ad.startDate instanceof Date ? ad.startDate.toISOString() : ad.startDate,
      end_date: ad.endDate instanceof Date ? ad.endDate.toISOString() : ad.endDate,
      is_active: ad.isActive,
    };

    const { data, error } = await supabase
      .from('ads')
      .insert(dbAdData)
      .select()
      .single();

    if (error) {
      console.error('Create ad error:', error);
      return createMockAd();
    }

    return mapDatabaseAdToModel(data);
  } catch (error) {
    console.error('Create ad error:', error);
    return createMockAd();
  }
};

/**
 * Update an advertisement
 */
export const updateAd = async (
  id: string,
  updates: Partial<Advertisement>,
): Promise<Advertisement | undefined> => {
  // Helper to update mock ad
  const updateMockAd = () => {
    const index = advertisements.findIndex((ad) => ad.id === id);
    if (index === -1) return undefined;
    const updatedAd = {
      ...advertisements[index],
      ...updates,
      updatedAt: new Date(),
    };
    advertisements[index] = updatedAd;
    return updatedAd;
  };

  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return updateMockAd();
  }

  try {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    if (updates.linkUrl !== undefined) dbUpdates.link_url = updates.linkUrl;
    if (updates.position !== undefined) dbUpdates.placement = updates.position;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.impressions !== undefined) dbUpdates.impressions = updates.impressions;
    if (updates.clicks !== undefined) dbUpdates.clicks = updates.clicks;

    const { data, error } = await supabase
      .from('ads')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update ad error:', error);
      return updateMockAd();
    }

    return mapDatabaseAdToModel(data);
  } catch (error) {
    console.error('Update ad error:', error);
    return updateMockAd();
  }
};

/**
 * Delete an advertisement
 */
export const deleteAd = async (id: string): Promise<boolean> => {
  // Helper to delete mock ad
  const deleteMockAd = () => {
    const initialLength = advertisements.length;
    advertisements = advertisements.filter((ad) => ad.id !== id);
    return advertisements.length < initialLength;
  };

  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return deleteMockAd();
  }

  try {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete ad error:', error);
      return deleteMockAd();
    }

    return true;
  } catch (error) {
    console.error('Delete ad error:', error);
    return deleteMockAd();
  }
};

/**
 * Record an impression for an advertisement
 */
export const recordImpression = async (
  id: string,
): Promise<Advertisement | undefined> => {
  // Helper to record mock impression
  const recordMockImpression = async () => {
    const ad = await getAdById(id);
    if (!ad) return undefined;
    return updateAd(id, { impressions: ad.impressions + 1 });
  };

  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return recordMockImpression();
  }

  try {
    const { data: ad, error: getError } = await supabase
      .from('ads')
      .select('impressions')
      .eq('id', id)
      .single();

    if (getError || !ad) {
      return recordMockImpression();
    }

    // Increment impression atomically using RPC
    const { error } = await supabase.rpc('increment_ad_impression', { p_ad_id: id });

    if (error) {
      console.error('Record impression error:', error);
      return undefined;
    }

    // Return updated ad data
    const { data } = await supabase
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();

    return data ? mapDatabaseAdToModel(data) : undefined;
  } catch (error) {
    console.error('Record impression error:', error);
    return recordMockImpression();
  }
};

/**
 * Record a click for an advertisement
 */
export const recordClick = async (
  id: string,
): Promise<Advertisement | undefined> => {
  // Helper to record mock click
  const recordMockClick = async () => {
    const ad = await getAdById(id);
    if (!ad) return undefined;
    return updateAd(id, { clicks: ad.clicks + 1 });
  };

  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return recordMockClick();
  }

  try {
    const { data: ad, error: getError } = await supabase
      .from('ads')
      .select('id')
      .eq('id', id)
      .single();

    if (getError || !ad) {
      return recordMockClick();
    }

    // Increment click atomically using RPC
    const { error } = await supabase.rpc('increment_ad_click', { p_ad_id: id });

    if (error) {
      console.error('Record click error:', error);
      return undefined;
    }

    // Return updated ad data
    const { data } = await supabase
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();

    return data ? mapDatabaseAdToModel(data) : undefined;
  } catch (error) {
    console.error('Record click error:', error);
    return recordMockClick();
  }
};

const mapDatabaseAdToModel = (dbAd: any): Advertisement => {
  return {
    id: dbAd.id,
    title: dbAd.title,
    imageUrl: dbAd.image_url,
    linkUrl: dbAd.link_url,
    position: dbAd.placement,
    startDate: new Date(dbAd.start_date),
    endDate: new Date(dbAd.end_date),
    isActive: dbAd.is_active,
    userId: dbAd.advertiser_id,
    paymentStatus: 'confirmed',
    impressions: dbAd.impressions || 0,
    clicks: dbAd.clicks || 0,
    createdAt: new Date(dbAd.created_at),
    updatedAt: new Date(dbAd.updated_at),
  };
};

/**
 * Activate an advertisement
 */
export const activateAd = async (
  id: string,
): Promise<Advertisement | undefined> => {
  return updateAd(id, { isActive: true });
};

/**
 * Deactivate an advertisement
 */
export const deactivateAd = async (
  id: string,
): Promise<Advertisement | undefined> => {
  return updateAd(id, { isActive: false });
};

/**
 * Calculate the price for an advertisement based on position and duration
 */
export const calculateAdPrice = (
  position: AdPosition,
  startDate: Date,
  endDate: Date,
): { basePrice: number; discount: number; finalPrice: number } => {
  const placement = adPlacements[position];
  const durationInDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const basePrice = placement.pricePerDay * durationInDays;
  let discountRate = 0;

  // Apply discounts based on duration
  if (durationInDays >= 90) {
    discountRate = discountRates.quarter;
  } else if (durationInDays >= 30) {
    discountRate = discountRates.month;
  } else if (durationInDays >= 7) {
    discountRate = discountRates.week;
  }

  const discount = basePrice * discountRate;
  const finalPrice = basePrice - discount;

  return { basePrice, discount, finalPrice };
};

/**
 * Get advertisement statistics
 */
export const getAdStats = async () => {
  const allAds = await getAllAds();
  const now = new Date();

  const activeAds = allAds.filter(
    (ad) => ad.isActive && ad.startDate <= now && ad.endDate >= now,
  );
  const pendingAds = allAds.filter((ad) => ad.paymentStatus === "pending");
  const totalImpressions = allAds.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = allAds.reduce((sum, ad) => sum + ad.clicks, 0);

  return {
    total: allAds.length,
    active: activeAds.length,
    pending: pendingAds.length,
    impressions: totalImpressions,
    clicks: totalClicks,
    ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
  };
};

/**
 * Check if an advertisement is expiring soon
 */
export const isAdExpiringSoon = async (
  adId: string,
  daysThreshold: number = 5,
): Promise<boolean> => {
  const ad = await getAdById(adId);

  if (!ad || !ad.isActive) return false;

  const now = new Date();
  const expiryDate = new Date(ad.endDate);
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  return daysUntilExpiry > 0 && daysUntilExpiry <= daysThreshold;
};

/**
 * Schedule expiry notifications for an advertisement
 */
export const scheduleAdExpiryNotifications = async (
  adId: string,
): Promise<void> => {
  const ad = await getAdById(adId);

  if (!ad || !ad.isActive || !ad.notificationPreferences?.expiryReminder) {
    return;
  }

  const now = new Date();
  const expiryDate = new Date(ad.endDate);
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Schedule notifications at 7, 3, and 1 day before expiry
  const notificationDays = [7, 3, 1];
  
  for (const days of notificationDays) {
    if (daysUntilExpiry <= days && daysUntilExpiry > 0) {
      // Send notification based on user preferences
      if (ad.notificationPreferences.channels.inApp) {
        // In-app notification would be sent here
        console.log(`In-app notification: Your ad "${ad.title}" expires in ${daysUntilExpiry} days`);
      }
      
      if (ad.notificationPreferences.channels.email) {
        // Email notification would be sent here
        console.log(`Email notification: Your ad "${ad.title}" expires in ${daysUntilExpiry} days`);
      }
      
      if (ad.notificationPreferences.channels.whatsApp) {
        // WhatsApp notification would be sent here
        console.log(`WhatsApp notification: Your ad "${ad.title}" expires in ${daysUntilExpiry} days`);
      }
    }
  }
};

/**
 * Schedule payment reminder notifications for pending ads
 */
export const scheduleAdPaymentReminders = async (
  adId: string,
): Promise<void> => {
  const ad = await getAdById(adId);

  if (
    !ad ||
    ad.paymentStatus !== "pending" ||
    !ad.notificationPreferences?.paymentReminder
  ) {
    return;
  }

  const now = new Date();
  const createdDate = new Date(ad.createdAt);
  const daysSinceCreation = Math.ceil(
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Send reminders at 1, 3, and 7 days after creation if still pending
  const reminderDays = [1, 3, 7];
  
  if (reminderDays.includes(daysSinceCreation)) {
    if (ad.notificationPreferences.channels.inApp) {
      console.log(`In-app reminder: Payment pending for ad "${ad.title}"`);
    }
    
    if (ad.notificationPreferences.channels.email) {
      console.log(`Email reminder: Payment pending for ad "${ad.title}"`);
    }
    
    if (ad.notificationPreferences.channels.whatsApp) {
      console.log(`WhatsApp reminder: Payment pending for ad "${ad.title}"`);
    }
  }
};

/**
 * Schedule weekly performance report notifications
 */
export const scheduleAdPerformanceReports = async (
  adId: string,
): Promise<void> => {
  const ad = await getAdById(adId);

  if (!ad || !ad.isActive || !ad.notificationPreferences?.performanceReports) {
    return;
  }

  // Generate performance report
  const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
  const report = {
    adTitle: ad.title,
    impressions: ad.impressions,
    clicks: ad.clicks,
    ctr: ctr.toFixed(2),
    period: "Last 7 days",
  };

  // Send report based on user preferences
  if (ad.notificationPreferences.channels.inApp) {
    console.log(`In-app report for ad "${ad.title}":`, report);
  }
  
  if (ad.notificationPreferences.channels.email) {
    console.log(`Email report for ad "${ad.title}":`, report);
  }
  
  if (ad.notificationPreferences.channels.whatsApp) {
    console.log(`WhatsApp report for ad "${ad.title}":`, report);
  }
};
