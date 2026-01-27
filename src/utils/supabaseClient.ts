/**
 * @deprecated This file is deprecated. Use '@/lib/supabase/client' instead.
 * This file now re-exports from the canonical client to ensure singleton pattern.
 */

// Re-export the canonical Supabase client to maintain backward compatibility
export { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

// Helper function to check if Supabase is connected
export const checkSupabaseConnection = async () => {
  const { supabase } = await import('@/lib/supabase/client');
  try {
    // Simple query to check connection with a short timeout
    const { data, error } = await Promise.race([
      supabase.from('profiles').select('count').limit(1),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 2000)
      )
    ]) as any;
    
    return { connected: !error, error };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { connected: false, error: err };
  }
};

// Function to determine if we should use mock data
export const shouldUseMockData = async () => {
  try {
    const { connected } = await checkSupabaseConnection();
    return !connected;
  } catch (error) {
    console.error('Error checking connection:', error);
    return true; // Default to mock data on any error
  }
};