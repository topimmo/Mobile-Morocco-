-- Create profiles table
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
  
  -- Importer specific fields
  companyName TEXT,
  taxId TEXT,
  businessLicense TEXT,
  storeIds TEXT[],
  
  -- Technician specific fields
  specialties TEXT[],
  certifications TEXT[],
  experience INTEGER,
  availability JSONB,
  servicesOffered TEXT[],
  rating DECIMAL(3,2),
  reviewCount INTEGER,
  
  -- Customer specific fields
  favoriteProducts TEXT[],
  recentSearches TEXT[],
  purchaseHistory JSONB
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS profiles_user_type_idx ON profiles(userType);
CREATE INDEX IF NOT EXISTS profiles_subscription_tier_idx ON profiles(subscriptionTier);

-- Enable row level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own profile
DROP POLICY IF EXISTS "Users can view their own profile";
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update only their own profile
DROP POLICY IF EXISTS "Users can update their own profile";
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policy to allow system to insert profiles
DROP POLICY IF EXISTS "System can insert profiles";
CREATE POLICY "System can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Enable realtime subscriptions
alter publication supabase_realtime add table profiles;