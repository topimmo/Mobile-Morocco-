-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  target_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'pending', 'expired', 'rejected')),
  placement TEXT CHECK (placement IN ('home', 'category', 'search', 'product')),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  budget DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_to_type TEXT,
  related_to_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'standard', 'professional')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  payment_id TEXT,
  payment_method TEXT,
  amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create job_listings table for technicians
CREATE TABLE IF NOT EXISTS job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  city TEXT,
  payment_type TEXT CHECK (payment_type IN ('fixed', 'hourly', 'negotiable')),
  payment_amount DECIMAL(10, 2),
  required_skills TEXT[],
  status TEXT CHECK (status IN ('open', 'assigned', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_listings(id) NOT NULL,
  technician_id UUID REFERENCES profiles(id) NOT NULL,
  cover_note TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable realtime for all new tables
alter publication supabase_realtime add table ads;
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table subscriptions;
alter publication supabase_realtime add table job_listings;
alter publication supabase_realtime add table job_applications;