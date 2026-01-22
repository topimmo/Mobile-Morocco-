/**
 * Provider Assertion Helpers
 * 
 * These utilities help catch the common error where a hook is used
 * outside of its required provider, which causes "logic not working" bugs
 * that are hard to debug in production.
 */

/**
 * Creates a context assertion that throws a clear error when
 * a hook is used outside its provider.
 * 
 * @param contextValue - The value returned by useContext
 * @param hookName - The name of the hook (for error message)
 * @param providerName - The name of the provider component
 */
export function assertContextProvider<T>(
  contextValue: T | undefined | null,
  hookName: string,
  providerName: string
): asserts contextValue is T {
  if (contextValue === undefined || contextValue === null) {
    const error = new Error(
      `${hookName} must be used within a <${providerName}>.\n` +
      `Make sure you have wrapped your component tree with <${providerName}> in src/App.tsx.\n` +
      `This is a common cause of "app logic not working" in production.`
    );
    error.name = 'ProviderMissingError';
    
    // Log to console with stack trace for debugging
    console.error(`🚨 Provider Error:`, error);
    
    throw error;
  }
}

/**
 * Creates a safe version of a hook that returns undefined instead of throwing
 * when used outside its provider. Useful for optional contexts.
 */
export function createSafeContextHook<T>(
  useHook: () => T,
  fallback: T
): () => T {
  return () => {
    try {
      return useHook();
    } catch {
      return fallback;
    }
  };
}

/**
 * Logs a warning in development when a provider is potentially missing
 * but doesn't throw (for graceful degradation)
 */
export function warnIfNoProvider(
  condition: boolean,
  hookName: string,
  providerName: string
): void {
  if (condition && import.meta.env.DEV) {
    console.warn(
      `⚠️ ${hookName} is being used without a <${providerName}>.\n` +
      `Some features may not work correctly.`
    );
  }
}
