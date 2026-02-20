import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { AuthUser } from '@/lib/supabase/auth';
import { getSiteUrl } from '@/config/env';

interface SignUpMetadata {
  user_type?: string;
  phone?: string;
  city?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string, metadata?: SignUpMetadata) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          // Fetch profile with duplicate detection
          const { data: profiles, error, count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('id', authUser.id)
            .order('updated_at', { ascending: false })
            .limit(2);

          // Handle errors
          if (error) {
            console.error('🔴 AuthContext: Error fetching profile:', error);
            // Set user without profile
            setUser({
              id: authUser.id,
              email: authUser.email || null,
              profile: null,
            });
          } else if (!profiles || profiles.length === 0) {
            // No profile found (empty array, not an error)
            console.warn('⚠️ AuthContext: No profile found for user:', authUser.id);
            setUser({
              id: authUser.id,
              email: authUser.email || null,
              profile: null,
            });
          } else if (count && count > 1) {
            // Multiple profiles found - data integrity issue
            console.error('🔴 AuthContext: DUPLICATE PROFILES for user:', authUser.id, {
              totalCount: count,
              returnedRows: profiles.length,
            });
            console.warn('⚠️ AuthContext: Using most recent profile');
            setUser({
              id: authUser.id,
              email: authUser.email || null,
              profile: profiles[0], // Most recent (ordered by updated_at desc)
            });
          } else {
            // Single profile found - normal case
            setUser({
              id: authUser.id,
              email: authUser.email || null,
              profile: profiles[0],
            });
          }
        }
      } catch (error) {
        console.error('🔴 AuthContext: Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Log auth state changes for debugging
        console.log('🔐 Auth state changed:', event, {
          hasSession: !!session,
          userId: session?.user?.id,
        });

        if (session?.user) {
          // Fetch profile with duplicate detection
          const { data: profiles, error, count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('id', session.user.id)
            .order('updated_at', { ascending: false })
            .limit(2);

          // Handle errors
          if (error) {
            console.error('🔴 AuthContext: Error fetching profile:', error);
            setUser({
              id: session.user.id,
              email: session.user.email || null,
              profile: null,
            });
          } else if (!profiles || profiles.length === 0) {
            // No profile found (empty array, not an error)
            console.warn('⚠️ AuthContext: No profile found for user:', session.user.id);
            setUser({
              id: session.user.id,
              email: session.user.email || null,
              profile: null,
            });
          } else if (count && count > 1) {
            // Multiple profiles found - data integrity issue
            console.error('🔴 AuthContext: DUPLICATE PROFILES for user:', session.user.id, {
              totalCount: count,
            });
            console.warn('⚠️ AuthContext: Using most recent profile');
            setUser({
              id: session.user.id,
              email: session.user.email || null,
              profile: profiles[0],
            });
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || null,
              profile: profiles[0],
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    // Monitor session expiration and refresh tokens proactively
    const sessionCheckInterval = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const expiresAt = session.expires_at;
          const now = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = expiresAt ? expiresAt - now : 0;
          
          // Refresh token if it expires in less than 5 minutes
          if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
            console.log('🔄 Token expiring soon, refreshing session...');
            const { error } = await supabase.auth.refreshSession();
            
            if (error) {
              console.error('❌ Failed to refresh session:', error);
            } else {
              console.log('✅ Session refreshed successfully');
            }
          }
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
      }
    }, 60000); // Check every minute

    return () => {
      subscription?.unsubscribe();
      clearInterval(sessionCheckInterval);
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string, metadata?: SignUpMetadata) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { 
          full_name: fullName,
          user_type: metadata?.user_type || 'customer',
          phone: metadata?.phone,
          city: metadata?.city
        } 
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/reset-password`,
    });
    if (error) throw error;
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, resetPassword }),
    [user, loading, signIn, signUp, signOut, resetPassword]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
