/**
 * Production-safe logger utility
 * 
 * Automatically strips console.log calls in production builds
 * while maintaining console.error and console.warn for critical issues
 */

import env from '@/config/env';

type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'info';

const isDevelopment = env.IS_DEVELOPMENT;

/**
 * Production-safe logger
 * - In development: logs everything to console
 * - In production: only logs errors and warnings
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  
  warn: (...args: any[]) => {
    // Always log warnings, even in production
    console.warn(...args);
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
};

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
      } catch (e) {
        // Ignore measurement errors
      }
    }
  },
};

export default logger;
