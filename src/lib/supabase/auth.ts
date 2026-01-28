import { supabase } from './client';
import type { Tables } from '@/types/supabase';
import { getSiteUrl } from '@/config/env';

export type UserRole = 'user' | 'agent' | 'merchant' | 'admin';
export type Profile = Tables<'profiles'>;

export interface AuthUser {
  id: string;
  email: string | null;
  profile: Profile | null;
}

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  fullName?: string,
  role: UserRole = 'user'
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });
  return { data, error };
};

export const signInWithEmailOtp = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  return { data, error };
};

export const verifyEmailOtp = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Fetch profile with duplicate detection
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .order('updated_at', { ascending: false })
    .limit(2);

  // Handle errors
  if (error) {
    const errorCode = (error as any).code;
    if (errorCode === 'PGRST116') {
      console.warn('⚠️ getCurrentUser: Profile not found for user:', user.id);
    } else {
      console.error('🔴 getCurrentUser: Error fetching profile:', error);
    }
    return {
      id: user.id,
      email: user.email || null,
      profile: null,
    };
  }

  if (!profiles || profiles.length === 0) {
    console.warn('⚠️ getCurrentUser: No profile found for user:', user.id);
    return {
      id: user.id,
      email: user.email || null,
      profile: null,
    };
  }

  // Handle duplicate profiles
  if (profiles.length > 1) {
    console.error('🔴 getCurrentUser: DUPLICATE PROFILES for user:', user.id);
    console.warn('⚠️ getCurrentUser: Using most recent profile');
  }

  return {
    id: user.id,
    email: user.email || null,
    profile: profiles[0], // Most recent profile
  };
};

export const getProfile = async (userId: string) => {
  // Fetch profile with duplicate detection
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .order('updated_at', { ascending: false })
    .limit(2);
  
  // Handle errors
  if (error) {
    return { data: null, error };
  }

  if (!profiles || profiles.length === 0) {
    return { 
      data: null, 
      error: { 
        code: 'PGRST116', 
        message: 'Profile not found' 
      } as any 
    };
  }

  // Handle duplicate profiles
  if (profiles.length > 1) {
    console.error('🔴 getProfile: DUPLICATE PROFILES for user:', userId);
    console.warn('⚠️ getProfile: Returning most recent profile');
  }

  return { data: profiles[0], error: null };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const authUser = await getCurrentUser();
      callback(authUser);
    } else {
      callback(null);
    }
  });
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/reset-password`,
  });
  return { data, error };
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};
