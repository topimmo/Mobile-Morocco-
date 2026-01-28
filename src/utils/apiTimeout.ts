/**
 * API Request Timeout Utilities
 * 
 * Provides timeout handling for API requests to prevent hanging on slow networks.
 * Especially important for mobile/4G connections that may have intermittent connectivity.
 */

import { logger } from '@/lib/logger';

/**
 * Default timeout values based on network conditions
 */
export const TIMEOUT_MS = {
  /** Fast networks (WiFi, 4G+) */
  DEFAULT: 15000, // 15 seconds
  
  /** Slow networks (3G, slow 4G) */
  SLOW: 30000, // 30 seconds
  
  /** Image upload operations */
  UPLOAD: 60000, // 60 seconds
  
  /** Auth operations (critical, need quick feedback) */
  AUTH: 10000, // 10 seconds
} as const;

/**
 * Wraps a promise with a timeout
 * @param promise - The promise to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param operation - Description of the operation for logging
 * @returns Promise that rejects if timeout is exceeded
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation = 'Operation'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      logger.warn(`⏱️ ${operation} timed out after ${timeoutMs}ms`);
      reject(new Error(`${operation} timed out after ${timeoutMs / 1000} seconds`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

/**
 * Wraps a promise with retry logic for transient failures
 * @param fn - Function that returns a promise
 * @param options - Retry configuration
 * @returns Promise that retries on failure
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    backoff?: boolean;
    operation?: string;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = true,
    operation = 'Operation',
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      logger.debug(`🔄 ${operation}: Attempt ${attempt}/${maxAttempts}`);
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        logger.error(`❌ ${operation}: All ${maxAttempts} attempts failed`, lastError);
        throw lastError;
      }

      // Calculate delay with exponential backoff if enabled
      const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs;
      
      logger.warn(`⚠️ ${operation}: Attempt ${attempt} failed, retrying in ${delay}ms...`, {
        error: lastError.message,
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error(`${operation} failed after ${maxAttempts} attempts`);
}

/**
 * Combines timeout and retry logic for robust API calls
 * @param fn - Function that returns a promise
 * @param options - Configuration for timeout and retry
 * @returns Promise with timeout and retry handling
 */
export async function withTimeoutAndRetry<T>(
  fn: () => Promise<T>,
  options: {
    timeoutMs?: number;
    maxAttempts?: number;
    delayMs?: number;
    operation?: string;
  } = {}
): Promise<T> {
  const {
    timeoutMs = TIMEOUT_MS.DEFAULT,
    maxAttempts = 3,
    delayMs = 1000,
    operation = 'Operation',
  } = options;

  return withRetry(
    () => withTimeout(fn(), timeoutMs, operation),
    { maxAttempts, delayMs, operation }
  );
}

/**
 * Checks if an error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('timed out');
  }
  return false;
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection') ||
      message.includes('offline')
    );
  }
  return false;
}

/**
 * Creates an AbortController with automatic timeout
 * @param timeoutMs - Timeout in milliseconds
 * @returns Object with abort controller and cleanup function
 */
export function createAbortController(timeoutMs: number): {
  controller: AbortController;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return {
    controller,
    cleanup: () => clearTimeout(timeoutId),
  };
}
