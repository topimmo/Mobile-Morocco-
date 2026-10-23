/**
 * Analytics Service for Mobile Morocco
 * Privacy-focused event tracking without personal data collection
 * Supports Google Analytics 4 integration
 */

// Analytics configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 measurement ID
const DEBUG_MODE = import.meta.env.DEV;

// Types for analytics events
export type AnalyticsEvent = 
  | 'search_performed'
  | 'listing_viewed'
  | 'phone_click'
  | 'whatsapp_click'
  | 'user_registration'
  | 'user_login'
  | 'listing_created'
  | 'repair_shop_viewed'
  | 'category_viewed'
  | 'city_filtered'
  | 'comparison_added'
  | 'favorite_added'
  | 'page_view';

export interface AnalyticsEventData {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

// Internal analytics state
let isInitialized = false;
const eventQueue: Array<{ event: AnalyticsEvent; data?: AnalyticsEventData }> = [];

// Initialize Google Analytics
export const initAnalytics = (): void => {
  if (isInitialized) return;

  // Create gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true, // Privacy: anonymize IP addresses
    cookie_flags: 'SameSite=None;Secure',
    send_page_view: false, // We'll send page views manually
  });

  isInitialized = true;

  // Process queued events
  while (eventQueue.length > 0) {
    const { event, data } = eventQueue.shift()!;
    trackEvent(event, data);
  }

  if (DEBUG_MODE) {
    console.log('[Analytics] Initialized with GA4');
  }
};

// Track custom events
export const trackEvent = (
  event: AnalyticsEvent,
  data?: AnalyticsEventData
): void => {
  // Queue events if not initialized
  if (!isInitialized) {
    eventQueue.push({ event, data });
    return;
  }

  // Sanitize data to remove any potential PII
  const sanitizedData = sanitizeEventData(data);

  if (window.gtag) {
    window.gtag('event', event, sanitizedData);
  }

  if (DEBUG_MODE) {
    console.log('[Analytics] Event tracked:', event, sanitizedData);
  }

  // Also track in local storage for admin dashboard
  trackLocalEvent(event, sanitizedData);
};

// Track page views
export const trackPageView = (
  path: string,
  title?: string
): void => {
  if (!isInitialized) {
    eventQueue.push({ 
      event: 'page_view', 
      data: { page_path: path, page_title: title } 
    });
    return;
  }

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }

  if (DEBUG_MODE) {
    console.log('[Analytics] Page view:', path);
  }
};

// Sanitize event data to remove PII
const sanitizeEventData = (
  data?: AnalyticsEventData
): AnalyticsEventData | undefined => {
  if (!data) return undefined;

  const sanitized: AnalyticsEventData = {};
  const piiPatterns = [
    /email/i,
    /phone/i,
    /name/i,
    /address/i,
    /password/i,
    /token/i,
    /user_id/i,
  ];

  for (const [key, value] of Object.entries(data)) {
    // Skip keys that might contain PII
    if (piiPatterns.some(pattern => pattern.test(key))) {
      continue;
    }

    // Skip string values that look like emails or phone numbers
    if (typeof value === 'string') {
      if (value.includes('@') || /^\+?\d{10,}$/.test(value)) {
        continue;
      }
    }

    sanitized[key] = value;
  }

  return sanitized;
};

// Local event tracking for admin dashboard
const LOCAL_STORAGE_KEY = 'mobile_morocco_analytics';
const MAX_LOCAL_EVENTS = 1000;

interface LocalEventRecord {
  event: AnalyticsEvent;
  timestamp: number;
  data?: AnalyticsEventData;
}

const trackLocalEvent = (
  event: AnalyticsEvent,
  data?: AnalyticsEventData
): void => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const events: LocalEventRecord[] = stored ? JSON.parse(stored) : [];

    events.push({
      event,
      timestamp: Date.now(),
      data,
    });

    // Keep only the most recent events
    const trimmedEvents = events.slice(-MAX_LOCAL_EVENTS);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmedEvents));
  } catch {
    // Ignore storage errors
  }
};

// Get local analytics data for admin dashboard
export const getLocalAnalytics = (): LocalEventRecord[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Get analytics summary for admin dashboard
export interface AnalyticsSummary {
  totalEvents: number;
  eventCounts: Record<AnalyticsEvent, number>;
  todayEvents: number;
  weekEvents: number;
  topSearchTerms: string[];
  topViewedListings: string[];
}

export const getAnalyticsSummary = (): AnalyticsSummary => {
  const events = getLocalAnalytics();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;

  const eventCounts: Record<string, number> = {};
  const searchTerms: Record<string, number> = {};
  const viewedListings: Record<string, number> = {};
  let todayEvents = 0;
  let weekEvents = 0;

  for (const record of events) {
    // Count by event type
    eventCounts[record.event] = (eventCounts[record.event] || 0) + 1;

    // Count by time period
    const age = now - record.timestamp;
    if (age < dayMs) todayEvents++;
    if (age < weekMs) weekEvents++;

    // Track search terms
    if (record.event === 'search_performed' && record.data?.search_term) {
      const term = String(record.data.search_term).toLowerCase();
      searchTerms[term] = (searchTerms[term] || 0) + 1;
    }

    // Track viewed listings
    if (record.event === 'listing_viewed' && record.data?.listing_id) {
      const id = String(record.data.listing_id);
      viewedListings[id] = (viewedListings[id] || 0) + 1;
    }
  }

  // Get top items
  const topSearchTerms = Object.entries(searchTerms)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([term]) => term);

  const topViewedListings = Object.entries(viewedListings)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id]) => id);

  return {
    totalEvents: events.length,
    eventCounts: eventCounts as Record<AnalyticsEvent, number>,
    todayEvents,
    weekEvents,
    topSearchTerms,
    topViewedListings,
  };
};

// Clear local analytics (for privacy/GDPR)
export const clearLocalAnalytics = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

// Convenience tracking functions
export const trackSearch = (searchTerm: string, resultsCount: number): void => {
  trackEvent('search_performed', {
    event_category: 'engagement',
    event_label: 'search',
    search_term: searchTerm.slice(0, 100), // Limit length
    results_count: resultsCount,
  });
};

export const trackListingView = (
  listingId: string,
  category?: string,
  price?: number
): void => {
  trackEvent('listing_viewed', {
    event_category: 'engagement',
    event_label: 'listing',
    listing_id: listingId,
    category,
    price_range: price ? getPriceRange(price) : undefined,
  });
};

export const trackPhoneClick = (listingId: string): void => {
  trackEvent('phone_click', {
    event_category: 'conversion',
    event_label: 'contact',
    listing_id: listingId,
  });
};

export const trackWhatsAppClick = (listingId: string): void => {
  trackEvent('whatsapp_click', {
    event_category: 'conversion',
    event_label: 'contact',
    listing_id: listingId,
  });
};

export const trackRegistration = (userType: string): void => {
  trackEvent('user_registration', {
    event_category: 'conversion',
    event_label: 'registration',
    user_type: userType,
  });
};

export const trackLogin = (): void => {
  trackEvent('user_login', {
    event_category: 'engagement',
    event_label: 'login',
  });
};

export const trackListingCreated = (category?: string): void => {
  trackEvent('listing_created', {
    event_category: 'conversion',
    event_label: 'listing',
    category,
  });
};

export const trackRepairShopView = (shopId: string, city?: string): void => {
  trackEvent('repair_shop_viewed', {
    event_category: 'engagement',
    event_label: 'repair_shop',
    shop_id: shopId,
    city,
  });
};

export const trackCategoryView = (categorySlug: string): void => {
  trackEvent('category_viewed', {
    event_category: 'engagement',
    event_label: 'category',
    category: categorySlug,
  });
};

export const trackCityFilter = (citySlug: string): void => {
  trackEvent('city_filtered', {
    event_category: 'engagement',
    event_label: 'filter',
    city: citySlug,
  });
};

export const trackComparisonAdded = (listingId: string): void => {
  trackEvent('comparison_added', {
    event_category: 'engagement',
    event_label: 'comparison',
    listing_id: listingId,
  });
};

export const trackFavoriteAdded = (listingId: string): void => {
  trackEvent('favorite_added', {
    event_category: 'engagement',
    event_label: 'favorite',
    listing_id: listingId,
  });
};

// Helper function to categorize prices
const getPriceRange = (price: number): string => {
  if (price < 500) return '0-500';
  if (price < 1000) return '500-1000';
  if (price < 2000) return '1000-2000';
  if (price < 5000) return '2000-5000';
  if (price < 10000) return '5000-10000';
  return '10000+';
};

// Type declarations for global gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export default {
  initAnalytics,
  trackEvent,
  trackPageView,
  trackSearch,
  trackListingView,
  trackPhoneClick,
  trackWhatsAppClick,
  trackRegistration,
  trackLogin,
  trackListingCreated,
  trackRepairShopView,
  trackCategoryView,
  trackCityFilter,
  trackComparisonAdded,
  trackFavoriteAdded,
  getLocalAnalytics,
  getAnalyticsSummary,
  clearLocalAnalytics,
};
