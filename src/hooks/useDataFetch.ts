import { useState, useEffect, useCallback, useRef } from 'react';

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FetchState<T> {
  data: T | null;
  error: Error | null;
  status: FetchStatus;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

interface UseFetchOptions<T> {
  /** Initial data to use before fetch completes */
  initialData?: T;
  /** Fallback data to use when fetch fails */
  fallbackData?: T;
  /** Whether to retry on error */
  retryOnError?: boolean;
  /** Number of retry attempts */
  retryCount?: number;
  /** Delay between retries in ms */
  retryDelay?: number;
  /** Whether to fetch immediately on mount */
  immediate?: boolean;
  /** Called when fetch succeeds */
  onSuccess?: (data: T) => void;
  /** Called when fetch fails */
  onError?: (error: Error) => void;
}

/**
 * Hook for fetching data with robust error handling and fallback support
 */
export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseFetchOptions<T> = {}
): FetchState<T> & { 
  refetch: () => Promise<void>;
  reset: () => void;
} {
  const {
    initialData = null,
    fallbackData,
    retryOnError = true,
    retryCount = 2,
    retryDelay = 1000,
    immediate = true,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: initialData as T | null,
    error: null,
    status: 'idle',
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const retryAttempts = useRef(0);
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;

    setState(prev => ({
      ...prev,
      status: 'loading',
      isLoading: true,
      isError: false,
    }));

    try {
      const result = await fetchFn();
      
      if (!isMounted.current) return;

      setState({
        data: result,
        error: null,
        status: 'success',
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      retryAttempts.current = 0;
      onSuccess?.(result);
    } catch (err) {
      if (!isMounted.current) return;

      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Data fetch error:', error);

      // Handle retry logic
      if (retryOnError && retryAttempts.current < retryCount) {
        retryAttempts.current += 1;
        console.log(`Retrying fetch (attempt ${retryAttempts.current}/${retryCount})...`);
        setTimeout(() => {
          if (isMounted.current) {
            fetchData();
          }
        }, retryDelay);
        return;
      }

      // Final failure state
      setState({
        data: fallbackData ?? null,
        error,
        status: 'error',
        isLoading: false,
        isError: true,
        isSuccess: false,
      });

      onError?.(error);
    }
  }, [fetchFn, fallbackData, retryOnError, retryCount, retryDelay, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: initialData as T | null,
      error: null,
      status: 'idle',
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
    retryAttempts.current = 0;
  }, [initialData]);

  useEffect(() => {
    isMounted.current = true;
    if (immediate) {
      fetchData();
    }
    return () => {
      isMounted.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    ...state,
    refetch: fetchData,
    reset,
  };
}

/**
 * Hook for handling mutations with error states
 */
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
  } = {}
) {
  const [state, setState] = useState<{
    data: TData | null;
    error: Error | null;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
  }>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

const mutate = useCallback(async (variables: TVariables) => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, isSuccess: false }));

    try {
      const result = await mutationFn(variables);
      setState({
        data: result,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      options.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState({
        data: null,
        error,
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      options.onError?.(error, variables);
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutationFn, options.onSuccess, options.onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

/**
 * Wrapper for making safe async calls with proper error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<{ data: T; error: Error | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Safe async error:', error);
    return { data: fallback, error };
  }
}
