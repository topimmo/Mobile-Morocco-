// Analytics hooks
export { usePageTracking } from './useAnalytics';

// Utility hooks
export { useDebounce } from './useDebounce';
export { usePagination } from './usePagination';

// Data fetching hooks with error handling
export { 
  useDataFetch, 
  useMutation, 
  safeAsync,
  type FetchStatus,
  type FetchState 
} from './useDataFetch';

// Network status hooks
export { 
  useNetworkStatus,
  useSlowConnection
} from './useNetworkStatus';
