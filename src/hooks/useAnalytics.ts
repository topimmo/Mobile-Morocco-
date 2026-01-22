import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/services/analyticsService';

/**
 * Hook to automatically track page views on route changes
 */
export const usePageTracking = (): void => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const path = location.pathname + location.search;
    trackPageView(path, document.title);
  }, [location]);
};

export default usePageTracking;
