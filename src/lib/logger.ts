/**
 * Production-safe logger utility
 * 
 * Automatically strips console.log calls in production builds
 * while maintaining console.error and console.warn for critical issues
 */

import env from '@/config/env';

type LogValue = string | number | boolean | null | undefined | Error | Record<string, unknown> | unknown[];

/**
 * Production-safe logger
 * - In development: logs everything to console
 * - In production: only logs errors and warnings
 */
export const logger = {
  log: (...args: LogValue[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  info: (...args: LogValue[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: LogValue[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  
  warn: (...args: LogValue[]) => {
    // Always log warnings, even in production
    console.warn(...args);
  },
  
  error: (...args: LogValue[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
};

const isDevelopment = env.IS_DEVELOPMENT;

/**
 * Performance measurement utility (dev-only)
 */
export const measure = {
  start: (label: string) => {
    if (isDevelopment && typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  },
  
  end: (label: string) => {
    if (isDevelopment && typeof performance !== 'undefined') {
      performance.mark(`${label}-end`);
      try {
        performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = performance.getEntriesByName(label)[0];
        logger.log(`⏱️  ${label}: ${measure.duration.toFixed(2)}ms`);
      } catch (_e) {
        // Ignore measurement errors
      }
    }
  },
};

export default logger;
