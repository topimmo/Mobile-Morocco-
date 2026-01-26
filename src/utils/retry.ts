/**
 * Retry utility functions for handling asynchronous operations with exponential backoff
 */

/**
 * Calculate exponential backoff delay in milliseconds
 * @param retryCount - The current retry attempt number (starts from 1)
 * @param baseDelay - Base delay in milliseconds (default: 500ms)
 * @returns Delay in milliseconds
 * 
 * @example
 * getExponentialBackoffDelay(1, 500) // Returns 500ms (2^0 * 500)
 * getExponentialBackoffDelay(2, 500) // Returns 1000ms (2^1 * 500)
 * getExponentialBackoffDelay(3, 500) // Returns 2000ms (2^2 * 500)
 */
export function getExponentialBackoffDelay(retryCount: number, baseDelay: number = 500): number {
  if (retryCount <= 0) {
    return 0;
  }
  return Math.pow(2, retryCount - 1) * baseDelay;
}

/**
 * Sleep for a specified duration
 * @param ms - Duration in milliseconds
 * @returns Promise that resolves after the specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute a function with retry logic and exponential backoff
 * @param fn - The async function to execute
 * @param maxAttempts - Maximum number of attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 500ms)
 * @param shouldRetry - Optional function to determine if retry should happen based on error
 * @returns Promise resolving to the function result
 * 
 * @example
 * const result = await retryWithBackoff(
 *   () => fetchData(),
 *   3, // max 3 attempts
 *   500, // base delay 500ms
 *   (error) => error.message.includes('timeout') // only retry on timeout errors
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 500,
  shouldRetry?: (error: Error) => boolean
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if we should retry
      if (shouldRetry && !shouldRetry(lastError)) {
        throw lastError;
      }
      
      // Don't delay after the last attempt
      if (attempt < maxAttempts - 1) {
        const delay = getExponentialBackoffDelay(attempt + 1, baseDelay);
        await sleep(delay);
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}
