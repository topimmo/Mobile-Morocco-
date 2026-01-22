import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default placeholder values that satisfy Supabase validation
const PLACEHOLDER_URL = 'https://xyzcompany.supabase.co';
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder';

// Get env variables and validate them properly
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if values are actually valid (not undefined, null, empty, or literal "undefined")
const isValidUrl = rawUrl && rawUrl !== 'undefined' && rawUrl.startsWith('http');
const isValidKey = rawKey && rawKey !== 'undefined' && rawKey.length > 10;

const supabaseUrl = isValidUrl ? rawUrl : PLACEHOLDER_URL;
const supabaseAnonKey = isValidKey ? rawKey : PLACEHOLDER_KEY;

// Check if environment variables are available
if (!isValidUrl || !isValidKey) {
  console.warn('Missing Supabase environment variables, using demo mode');
}

// Create the Supabase client with error handling
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Helper function to check if Supabase is connected
export const checkSupabaseConnection = async () => {
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