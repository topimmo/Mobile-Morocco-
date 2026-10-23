CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  firstName TEXT,
  lastName TEXT,
  phoneNumber TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  avatar TEXT,
  bio TEXT,
  userType TEXT NOT NULL,
  subscriptionTier TEXT NOT NULL DEFAULT 'free',
  subscriptionExpiryDate TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  isVerified BOOLEAN DEFAULT FALSE,
  isActive BOOLEAN DEFAULT TRUE,
  preferredLanguage TEXT DEFAULT 'ar',
  notificationPreferences JSONB DEFAULT '{"email": true, "inApp": true, "whatsapp": false}'::jsonb,
  
  companyName TEXT,
  taxId TEXT,
  businessLicense TEXT,
  storeIds TEXT[],
  
  specialties TEXT[],
  certifications TEXT[],
  experience INTEGER,
  availability JSONB,
  servicesOffered TEXT[],
  rating DECIMAL(3,2),
  reviewCount INTEGER,
  
  favoriteProducts TEXT[],
  recentSearches TEXT[],
  purchaseHistory JSONB
);

CREATE INDEX IF NOT EXISTS profiles_user_type_idx ON profiles(userType);
CREATE INDEX IF NOT EXISTS profiles_subscription_tier_idx ON profiles(subscriptionTier);

alter publication supabase_realtime add table profiles;