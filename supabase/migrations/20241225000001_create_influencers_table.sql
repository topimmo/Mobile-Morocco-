CREATE TABLE IF NOT EXISTS influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL,
  followers_count INTEGER NOT NULL,
  engagement_rate DECIMAL(5,2),
  niche TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  location TEXT,
  bio TEXT,
  profile_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter publication supabase_realtime add table influencers;