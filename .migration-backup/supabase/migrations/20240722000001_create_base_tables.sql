-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'importer', 'technician')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Morocco',
  avatar_url TEXT,
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'standard', 'professional')),
  is_verified BOOLEAN DEFAULT false,
  purchase_history JSONB DEFAULT '[]'::jsonb,
  favorite_products JSONB DEFAULT '[]'::jsonb,
  recent_searches JSONB DEFAULT '[]'::jsonb,
  store_ids JSONB DEFAULT '[]'::jsonb,
  services_offered JSONB DEFAULT '[]'::jsonb,
  specialties JSONB DEFAULT '[]'::jsonb,
  availability JSONB DEFAULT '{"monday":false,"tuesday":false,"wednesday":false,"thursday":false,"friday":false,"saturday":false,"sunday":false}'::jsonb,
  rating FLOAT DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  notification_preferences JSONB DEFAULT '{"email":true,"inApp":true,"whatsapp":false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'MAD',
  condition TEXT CHECK (condition IN ('new', 'used', 'refurbished')),
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT,
  model TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  location TEXT,
  city TEXT,
  is_available BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  social_media JSONB DEFAULT '{}'::jsonb,
  business_hours JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('product', 'technician', 'store')),
  subject_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create technician_services table
CREATE TABLE IF NOT EXISTS technician_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id UUID REFERENCES profiles(id) NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  price_type TEXT CHECK (price_type IN ('fixed', 'hourly', 'quote')),
  estimated_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) NOT NULL,
  technician_id UUID REFERENCES profiles(id) NOT NULL,
  service_id UUID REFERENCES technician_services(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  description TEXT,
  device_details JSONB DEFAULT '{}'::jsonb,
  location TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table stores;
alter publication supabase_realtime add table reviews;
alter publication supabase_realtime add table technician_services;
alter publication supabase_realtime add table service_requests;