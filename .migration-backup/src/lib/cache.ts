/**
 * Simple in-memory cache for API responses
 * Prevents unnecessary refetches when navigating back/forward
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttlMs - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttlMs: number = this.defaultTTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttlMs,
    });
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns Cached data or null if not found/expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Remove a specific key from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Invalidate all keys matching a prefix
   */
  invalidatePrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Generate a cache key from filters and pagination
   */
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    return `${prefix}:${sortedParams}`;
  }
}

// Export singleton instance
export const apiCache = new SimpleCache();

// Export class for custom instances
export { SimpleCache };

// Cache keys for invalidation
export const CACHE_KEYS = {
  HOMEPAGE_DATA: 'homepage',
  CATEGORIES: 'categories',
  LISTINGS: 'listings',
  REPAIR_SHOPS: 'repair_shops',
  FEATURED_LISTINGS: 'featured_listings',
};

// Helper to invalidate homepage cache (call when new listing is published)
export function invalidateHomepageCache(): void {
  apiCache.invalidatePrefix(CACHE_KEYS.HOMEPAGE_DATA);
  apiCache.invalidatePrefix(CACHE_KEYS.FEATURED_LISTINGS);
  apiCache.invalidatePrefix(CACHE_KEYS.LISTINGS);
}

// Helper to invalidate specific caches
export function invalidateListingsCache(): void {
  apiCache.invalidatePrefix(CACHE_KEYS.LISTINGS);
  apiCache.invalidatePrefix(CACHE_KEYS.FEATURED_LISTINGS);
  apiCache.invalidatePrefix(CACHE_KEYS.HOMEPAGE_DATA);
}

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 5 * 60 * 1000);
}
