/**
 * Performance optimization utilities
 */

/**
 * Debounce function for performance optimization
 * Use for search inputs, scroll handlers, etc.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * Use for scroll handlers, resize handlers, etc.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, Math.max(limit - (Date.now() - lastRan), 0));
    }
  };
}

/**
 * Request idle callback wrapper for non-critical operations
 */
export function runWhenIdle(callback: () => void, timeout = 2000) {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, { timeout });
  }
  return setTimeout(callback, 1);
}

/**
 * Batch multiple state updates to reduce re-renders
 */
export function batchUpdates<_T>(updates: (() => void)[]): void {
  if ('unstable_batchedUpdates' in window) {
    // @ts-expect-error - React experimental feature
    window.unstable_batchedUpdates(() => {
      updates.forEach(update => update());
    });
  } else {
    updates.forEach(update => update());
  }
}

/**
 * Lazy image loading helper
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  src: string,
  placeholder?: string
) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imgElement.src = src;
          observer.disconnect();
        }
      });
    });

    if (placeholder) {
      imgElement.src = placeholder;
    }
    observer.observe(imgElement);
  } else {
    imgElement.src = src;
  }
}

/**
 * Memoize expensive calculations
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  maxCacheSize = 100
): T {
  const cache = new Map<string, ReturnType<T>>();
  const keys: string[] = [];

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);

    // Implement LRU cache
    if (cache.size >= maxCacheSize) {
      const oldestKey = keys.shift();
      if (oldestKey) cache.delete(oldestKey);
    }

    keys.push(key);
    cache.set(key, result as ReturnType<T>);

    return result as ReturnType<T>;
  }) as T;
}

/**
 * Virtual scrolling helper for large lists
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleItems + overscan * 2);

  return { start, end };
}

/**
 * Optimize component re-renders by checking if props changed
 */
export function shallowEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
  if (obj1 === obj2) return true;
  
  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

/**
 * Track component render performance
 */
export function measureRenderTime(componentName: string) {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 16) { // More than one frame (60fps)
      console.warn(
        `[Performance] ${componentName} render took ${duration.toFixed(2)}ms`
      );
    }
  };
}

/**
 * Prefetch data in the background
 */
export async function prefetchData<T>(
  fetcher: () => Promise<T>,
  cacheKey: string,
  cache: Map<string, unknown>
): Promise<void> {
  runWhenIdle(async () => {
    try {
      const data = await fetcher();
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(`Failed to prefetch ${cacheKey}:`, error);
    }
  });
}

/**
 * Create a stable callback that doesn't change on every render
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = { current: callback };
  callbackRef.current = callback;

  const stableCallback = ((...args: unknown[]) => {
    return callbackRef.current(...args);
  }) as T;

  return stableCallback;
}
