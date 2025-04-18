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
  // In a real app, this would fetch from an API or database
  return advertisements;
};

/**
 * Get active advertisements for a specific position
 */
export const getActiveAdsByPosition = async (
  position: AdPosition,
): Promise<Advertisement[]> => {
  const now = new Date();
  return advertisements.filter(
    (ad) =>
      ad.position === position &&
      ad.isActive &&
      ad.startDate <= now &&
      ad.endDate >= now,
  );
};

/**
 * Get an advertisement by ID
 */
export const getAdById = async (
  id: string,
): Promise<Advertisement | undefined> => {
  return advertisements.find((ad) => ad.id === id);
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

/**
 * Update an advertisement
 */
export const updateAd = async (
  id: string,
  updates: Partial<Advertisement>,
): Promise<Advertisement | undefined> => {
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

/**
 * Delete an advertisement
 */
export const deleteAd = async (id: string): Promise<boolean> => {
  const initialLength = advertisements.length;
  advertisements = advertisements.filter((ad) => ad.id !== id);
  return advertisements.length < initialLength;
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
 * Record an impression for an advertisement
 */
export const recordImpression = async (
  id: string,
): Promise<Advertisement | undefined> => {
  const ad = await getAdById(id);
  if (!ad) return undefined;

  return updateAd(id, { impressions: ad.impressions + 1 });
};

/**
 * Record a click for an advertisement
 */
export const recordClick = async (
  id: string,
): Promise<Advertisement | undefined> => {
  const ad = await getAdById(id);
  if (!ad) return undefined;

  return updateAd(id, { clicks: ad.clicks + 1 });
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
  // This would be implemented with a real scheduling system
  // For now, we'll just check if the ad is expiring soon
  const ad = await getAdById(adId);

  if (!ad || !ad.isActive || !ad.notificationPreferences?.expiryReminder) {
    return;
  }

  // In a real implementation, this would create scheduled tasks
  console.log(`Scheduled expiry notifications for ad ${adId}`);
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

  // In a real implementation, this would create scheduled tasks
  console.log(`Scheduled payment reminder notifications for ad ${adId}`);
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

  // In a real implementation, this would create scheduled tasks
  console.log(`Scheduled performance report notifications for ad ${adId}`);
};
