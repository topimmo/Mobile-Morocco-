export type UserType = 'customer' | 'importer' | 'technician';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  user_type: UserType;
  created_at: string;
  updated_at?: string;
}

export interface Profile extends User {
  phone?: string;
  phoneNumber?: string; // Alias for phone
  address?: string;
  city?: string;
  avatar_url?: string;
  subscription_type?: 'free' | 'standard' | 'professional';
  is_verified?: boolean;
}

// Role-specific profile types
export interface CustomerProfile extends Profile {
  user_type: 'customer';
  support_tickets?: number;
  orders_count?: number;
  purchaseHistory?: any[];
  favoriteProducts?: any[];
  recentSearches?: string[];
  country?: string;
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
    inApp?: boolean;
    whatsapp?: boolean;
  };
}

export interface ImporterProfile extends Profile {
  user_type: 'importer';
  store_name?: string;
  store_id?: string;
  storeIds?: string[];
  products_count?: number;
  rating?: number;
  is_store_verified?: boolean;
  subscriptionTier?: 'free' | 'standard' | 'professional';
}

export interface TechnicianProfile extends Profile {
  user_type: 'technician';
  specializations?: string[];
  specialties?: string[];
  experience_years?: number;
  certifications?: string[];
  servicesOffered?: string[];
  reviewCount?: number;
  availability?: {
    [key: string]: boolean;
  };
  hourly_rate?: number;
  availability_status?: 'available' | 'busy' | 'offline';
  completed_jobs?: number;
  rating?: number;
}