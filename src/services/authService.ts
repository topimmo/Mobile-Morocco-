import { supabase } from '@/utils/supabaseClient';
import { CustomerProfile, ImporterProfile, TechnicianProfile } from '@/models/User';
import type { User } from '@supabase/supabase-js';
import { getSiteUrl } from '@/config/env';

// Role types matching the database constraint
export type UserRole = 'user' | 'agent' | 'merchant' | 'admin';

// Redirect paths constants
export const REDIRECT_PATHS = {
  ADMIN: '/admin',
  AGENT: '/agent',
  MERCHANT: '/merchant',
  USER: '/dashboard',
  ACCOUNT_SETUP: '/auth/select-account-type',
  LOGIN: '/auth/login',
} as const;

// Sign in result interface
export interface SignInResult {
  user: User | null;
  redirectPath: string;
  role: UserRole | null;
  error: string | null;
}

// User registration with profile creation
export const registerUser = async (
  email: string,
  password: string,
  userType: 'customer' | 'importer' | 'technician',
  userData: Partial<CustomerProfile | ImporterProfile | TechnicianProfile>
) => {
  try {
    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'User registration failed' };
    }

    // Create the user profile with the appropriate user type
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        user_type: userType,
        first_name: userData.firstName || null,
        last_name: userData.lastName || null,
        phone: userData.phone || userData.phoneNumber || null,
        subscription_type: 'free',
        ...getTypeSpecificFields(userType, userData),
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return { user: authData.user, error: 'User registered but profile creation failed' };
    }

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('Registration error:', error);
    return { user: null, error: 'Registration failed' };
  }
};

// Helper function to extract type-specific fields
const getTypeSpecificFields = (
  userType: string,
  userData: any
) => {
  switch (userType) {
    case 'technician':
      return {
        services_offered: userData.servicesOffered || [],
        specialties: userData.specialties || [],
        availability: userData.availability || {},
      };
    case 'importer':
      return {
        store_ids: userData.storeIds || [],
        company_name: userData.companyName || null,
      };
    default:
      return {};
  }
};

// User login
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null, error: 'Login failed' };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: userData, error } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (error) {
      console.error('Get user error:', error);
      return { user: null, error: error.message };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Get user error:', error);
    return { user: null, error: 'Failed to get user' };
  }
};

// Get user profile with type information
export const getUserProfile = async () => {
  try {
    const { user, error: userError } = await getCurrentUser();
    
    if (userError || !user) {
      return { profile: null, error: userError || 'User not found' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Get profile error:', error);
      return { profile: null, error: error.message };
    }

    if (!data) {
      return { profile: null, error: 'Profile not found' };
    }

    // Map database fields to our model
    const profile = mapDatabaseProfileToModel(data);
    
    return { profile, error: null };
  } catch (error) {
    console.error('Get profile error:', error);
    return { profile: null, error: 'Failed to get profile' };
  }
};

// Map database fields to our model
const mapDatabaseProfileToModel = (dbProfile: any) => {
  const baseProfile = {
    id: dbProfile.id,
    email: dbProfile.email,
    userType: dbProfile.user_type,
    firstName: dbProfile.first_name,
    lastName: dbProfile.last_name,
    phoneNumber: dbProfile.phone,
    address: dbProfile.address,
    city: dbProfile.city,
    country: dbProfile.country,
    avatarUrl: dbProfile.avatar_url,
    subscriptionTier: dbProfile.subscription_type,
    isVerified: dbProfile.is_verified,
    favoriteProducts: dbProfile.favorite_products || [],
    recentSearches: dbProfile.recent_searches || [],
    purchaseHistory: dbProfile.purchase_history || [],
    notificationPreferences: dbProfile.notification_preferences || {
      email: true,
      inApp: true,
      whatsapp: false
    },
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at
  };

  // Add type-specific fields
  switch (dbProfile.user_type) {
    case 'technician':
      return {
        ...baseProfile,
        servicesOffered: dbProfile.services_offered || [],
        specialties: dbProfile.specialties || [],
        availability: dbProfile.availability || {},
        rating: dbProfile.rating || 0,
        reviewCount: dbProfile.review_count || 0,
      };
    case 'importer':
      return {
        ...baseProfile,
        storeIds: dbProfile.store_ids || [],
        companyName: dbProfile.company_name,
      };
    default:
      return baseProfile;
  }
};

// Update user profile
export const updateUserProfile = async (profileData: Partial<CustomerProfile | ImporterProfile | TechnicianProfile>) => {
  try {
    const { user, error: userError } = await getCurrentUser();
    
    if (userError || !user) {
      return { success: false, error: userError || 'User not found' };
    }

    // Map our model fields to database fields
    const dbProfileData = mapModelToDatabase(profileData);

    const { error } = await supabase
      .from('profiles')
      .update(dbProfileData)
      .eq('id', user.id);

    if (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
};

// Map our model fields to database fields
const mapModelToDatabase = (profileData: any) => {
  const baseData: any = {};
  
  // Map common fields
  if (profileData.firstName !== undefined) baseData.first_name = profileData.firstName;
  if (profileData.lastName !== undefined) baseData.last_name = profileData.lastName;
  if (profileData.phoneNumber !== undefined) baseData.phone = profileData.phoneNumber;
  if (profileData.address !== undefined) baseData.address = profileData.address;
  if (profileData.city !== undefined) baseData.city = profileData.city;
  if (profileData.country !== undefined) baseData.country = profileData.country;
  if (profileData.avatarUrl !== undefined) baseData.avatar_url = profileData.avatarUrl;
  if (profileData.favoriteProducts !== undefined) baseData.favorite_products = profileData.favoriteProducts;
  if (profileData.recentSearches !== undefined) baseData.recent_searches = profileData.recentSearches;
  if (profileData.notificationPreferences !== undefined) baseData.notification_preferences = profileData.notificationPreferences;
  
  // Map type-specific fields
  if (profileData.userType === 'technician') {
    if (profileData.servicesOffered !== undefined) baseData.services_offered = profileData.servicesOffered;
    if (profileData.specialties !== undefined) baseData.specialties = profileData.specialties;
    if (profileData.availability !== undefined) baseData.availability = profileData.availability;
  } else if (profileData.userType === 'importer') {
    if (profileData.storeIds !== undefined) baseData.store_ids = profileData.storeIds;
    if (profileData.companyName !== undefined) baseData.company_name = profileData.companyName;
  }
  
  return baseData;
};

// Sign out user
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: 'Failed to sign out' };
  }
};

// Password reset request
export const requestPasswordReset = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { success: false, error: 'Failed to request password reset' };
  }
};

// Update password
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Update password error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: 'Failed to update password' };
  }
};

// Verify email
export const verifyEmail = async (token: string) => {
  try {
    // This is handled automatically by Supabase when the user clicks the verification link
    // This function is just a placeholder for any additional logic you might want to add
    return { success: true, error: null };
  } catch (error) {
    console.error('Email verification error:', error);
    return { success: false, error: 'Failed to verify email' };
  }
};

// ============================================
// NEW ROLE-BASED AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Sign up a new user with a specific role
 * The role is saved to user metadata and automatically copied to profiles table via database trigger
 */
export const signUpWithRole = async (
  email: string,
  password: string,
  role: UserRole,
  fullName?: string,
  phone?: string,
  city?: string
) => {
  // Get dev mode flag from environment
  const isDev = import.meta.env.DEV;
  
  try {
    // Log registration attempt in dev mode only
    if (isDev) {
      console.log('🔵 [DEV] Registration attempt:', {
        role,
        email,
        fullName,
        phone: phone ? '****' + phone.slice(-4) : undefined,
        city,
        timestamp: new Date().toISOString(),
      });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role, // This will be picked up by the database trigger
          full_name: fullName,
          phone,
          city,
        },
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      },
    });

    if (authError) {
      // COMPREHENSIVE error logging with ALL available details
      const errorDetails = {
        message: authError.message,
        status: authError.status,
        code: (authError as any).code,
        details: (authError as any).details,
        hint: (authError as any).hint,
        name: authError.name,
        __isAuthError: (authError as any).__isAuthError,
      };

      // Always log errors to console for debugging
      console.error('🔴 Sign up error details:', errorDetails);
      
      // In dev mode, also log additional context (but not the full error object)
      if (isDev) {
        console.error('🔴 [DEV] Full error context:', {
          ...errorDetails,
          attemptedRole: role,
          attemptedEmail: email,
          metadata: {
            full_name: fullName,
            phone: phone ? '****' + phone.slice(-4) : undefined,
            city,
          },
        });
      }
      
      // Provide user-friendly error messages based on error code or message
      let userMessage = authError.message;
      const errorCode = (authError as any).code;
      const errorMsg = authError.message?.toLowerCase() || '';
      
      // Check error code first (more reliable than message matching)
      if (errorCode === 'email_exists' || errorCode === 'user_already_exists') {
        userMessage = 'This email is already registered. Please try logging in instead.';
      } else if (errorCode === 'weak_password') {
        userMessage = 'Password must be at least 6 characters long.';
      } else if (errorCode === 'invalid_email') {
        userMessage = 'Please provide a valid email address.';
      } else if (errorCode === 'validation_failed') {
        userMessage = 'Please check all required fields and try again.';
      } else if (errorCode?.includes('database') || errorCode?.includes('constraint')) {
        // Database-level errors - could be trigger failure, constraint violation, etc.
        const baseMessage = 'Unable to complete registration. Please try again or contact support if the issue persists.';
        
        // In dev mode ONLY, append error code for debugging
        userMessage = isDev ? `${baseMessage} (DB Error: ${errorCode})` : baseMessage;
      }
      // Fallback to message matching if no code match
      else if (errorMsg.includes('already registered') || errorMsg.includes('already exists')) {
        userMessage = 'This email is already registered. Please try logging in instead.';
      } else if (errorMsg.includes('invalid email') || errorMsg.includes('invalid format')) {
        userMessage = 'Please provide a valid email address.';
      } else if (errorMsg.includes('password') && (errorMsg.includes('weak') || errorMsg.includes('short'))) {
        userMessage = 'Password must be at least 6 characters long.';
      } else if (errorMsg.includes('phone') || errorMsg.includes('telephone')) {
        userMessage = 'Please provide a valid phone number.';
      } else if (errorMsg.includes('constraint') || errorMsg.includes('violates')) {
        userMessage = 'Unable to complete registration. Please verify all fields and try again.';
      } else if (errorMsg.includes('trigger') || errorMsg.includes('function')) {
        // Database trigger error
        const baseMessage = 'Unable to complete registration. Please contact support with error code: TRIGGER_ERROR';
        
        // In dev mode ONLY, show detailed error
        userMessage = isDev ? `Database trigger error: ${authError.message}` : baseMessage;
      }
      
      return { user: null, error: userMessage };
    }

    if (!authData.user) {
      console.error('🔴 Sign up failed: No user returned from Supabase');
      return { user: null, error: 'User registration failed' };
    }

    // Log successful registration
    console.log('✅ User registered successfully:', {
      id: authData.user.id,
      email: authData.user.email,
      role,
    });
    
    if (isDev) {
      console.log('✅ [DEV] Registration successful with metadata:', {
        userId: authData.user.id,
        email: authData.user.email,
        role,
        metadata: authData.user.user_metadata,
      });
    }

    return { user: authData.user, error: null };
  } catch (error: any) {
    // Catch-all for unexpected errors
    const errorDetails = {
      message: error?.message,
      name: error?.name,
      // In dev mode, include stack trace (but not the full error object)
      ...(isDev ? { stack: error?.stack } : {}),
    };
    
    console.error('🔴 Sign up error (catch):', errorDetails);
    
    if (isDev) {
      console.error('🔴 [DEV] Unexpected registration error:', {
        ...errorDetails,
        attemptedRole: role,
        attemptedEmail: email,
      });
    }
    
    return { user: null, error: 'Registration failed. Please check your connection and try again.' };
  }
};

/**
 * Get the role of the current user from the profiles table
 * This is the single source of truth for user roles
 */
export const getUserRole = async (userId?: string): Promise<{ role: UserRole | null; error: string | null }> => {
  try {
    let targetUserId = userId;
    
    // If no userId provided, get current user
    if (!targetUserId) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        return { role: null, error: userError?.message || 'No user found' };
      }
      targetUserId = userData.user.id;
    }

    // Fetch role from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', targetUserId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return { role: null, error: error.message };
    }

    if (!data || !data.role) {
      return { role: null, error: 'Profile not found' };
    }

    return { role: data.role as UserRole, error: null };
  } catch (error) {
    console.error('Error getting user role:', error);
    return { role: null, error: 'Failed to get user role' };
  }
};

/**
 * Sign in and determine redirect path based on user role
 * Returns the user and the appropriate redirect path
 */
export const signInAndRedirect = async (
  email: string,
  password: string
): Promise<SignInResult> => {
  try {
    // Step 1: Sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Enhanced error logging
      console.error('Sign in error details:', {
        message: signInError.message,
        status: signInError.status,
        code: (signInError as any).code,
        details: (signInError as any).details,
      });
      
      // Provide user-friendly error messages based on error code or message
      let userMessage = signInError.message;
      const errorCode = (signInError as any).code;
      
      // Check error code first (more reliable)
      if (errorCode === 'invalid_credentials') {
        userMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (errorCode === 'email_not_confirmed') {
        userMessage = 'Please verify your email address before logging in. Check your inbox for the confirmation email.';
      } 
      // Fallback to message matching
      else if (signInError.message?.toLowerCase().includes('invalid login credentials')) {
        userMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (signInError.message?.toLowerCase().includes('email not confirmed')) {
        userMessage = 'Please verify your email address before logging in. Check your inbox for the confirmation email.';
      }
      
      return { 
        user: null, 
        redirectPath: REDIRECT_PATHS.LOGIN, 
        role: null,
        error: userMessage 
      };
    }

    if (!data.user) {
      return { 
        user: null, 
        redirectPath: REDIRECT_PATHS.LOGIN,
        role: null, 
        error: 'Login failed' 
      };
    }

    // Step 2: Wait for login to succeed and get user.id
    const userId = data.user.id;

    // Step 3: Fetch role from profiles table
    const { role, error: roleError } = await getUserRole(userId);

    if (roleError || !role) {
      console.error('Error fetching role:', roleError);
      // If profile doesn't exist, redirect to account setup
      return {
        user: data.user,
        redirectPath: REDIRECT_PATHS.ACCOUNT_SETUP,
        role: null,
        error: 'Profile not found. Please complete your account setup.',
      };
    }

    // Step 4: Determine redirect path based on role
    let redirectPath: string;
    switch (role) {
      case 'admin':
        redirectPath = REDIRECT_PATHS.ADMIN;
        break;
      case 'agent':
        redirectPath = REDIRECT_PATHS.AGENT;
        break;
      case 'merchant':
        redirectPath = REDIRECT_PATHS.MERCHANT;
        break;
      case 'user':
      default:
        redirectPath = REDIRECT_PATHS.USER;
        break;
    }

    console.log('Sign in successful:', {
      userId: data.user.id,
      email: data.user.email,
      role,
      redirectPath,
    });

    return {
      user: data.user,
      redirectPath,
      role,
      error: null,
    };
  } catch (error: any) {
    console.error('Sign in and redirect error (catch):', {
      message: error?.message,
      stack: error?.stack,
      error,
    });
    return {
      user: null,
      redirectPath: REDIRECT_PATHS.LOGIN,
      role: null,
      error: 'Login failed. Please check your connection and try again.',
    };
  }
};

/**
 * Resend confirmation email for a user
 * This can be used when users didn't receive the initial confirmation email
 */
export const resendConfirmationEmail = async (email: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { 
        success: false, 
        error: 'Please provide a valid email address' 
      };
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      },
    });

    if (error) {
      console.error('Resend confirmation email error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to resend confirmation email' 
      };
    }

    console.log('Confirmation email resent successfully to:', email);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Resend confirmation email error (catch):', error);
    return { 
      success: false, 
      error: 'Failed to resend confirmation email. Please try again.' 
    };
  }
};

/**
 * Ensure a profile exists for the authenticated user
 * If the profile doesn't exist, create a minimal profile row
 * This prevents "Profile not found" errors after authentication
 */
export const ensureProfileExists = async (user: User): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: selectError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // Profile exists, nothing to do
    if (existingProfile && !selectError) {
      console.log('Profile already exists for user:', user.id);
      return { success: true, error: null };
    }

    // If error is not "no rows", something went wrong
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking profile existence:', selectError);
      return { success: false, error: selectError.message };
    }

    // Profile doesn't exist, create minimal profile
    console.log('Creating profile for user:', user.id);
    
    // Parse full_name into first_name and last_name if available
    const fullName = user.user_metadata?.full_name;
    let firstName = null;
    let lastName = null;
    if (fullName) {
      const nameParts = fullName.trim().split(' ');
      firstName = nameParts[0] || null;
      lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
    }
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        phone: user.user_metadata?.phone ?? null,
        city: user.user_metadata?.city ?? null,
        role: user.user_metadata?.role ?? 'user', // Default to 'user' role if not set
        subscription_type: 'free', // Default subscription
        // announcer_type is nullable - can be filled later in account setup
      });

    if (insertError) {
      console.error('Error creating profile:', insertError);
      return { success: false, error: insertError.message };
    }

    console.log('Profile created successfully for user:', user.id);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error in ensureProfileExists:', error);
    return { success: false, error: error.message || 'Failed to ensure profile exists' };
  }
};