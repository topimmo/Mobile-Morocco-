-- Fix "Database error saving new user" - Improve signup trigger
-- This migration ensures the trigger handles all edge cases and never inserts NULL roles

-- Replace the trigger function with a more robust version
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from user metadata with guaranteed fallback to 'user'
  -- This ensures role is NEVER NULL
  user_role := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'role'), ''),
    'user'
  );
  
  -- Validate and sanitize role - only allow valid roles
  IF user_role NOT IN ('user', 'agent', 'merchant', 'admin') THEN
    user_role := 'user';
  END IF;

  -- Insert profile with ON CONFLICT to handle race conditions
  -- This prevents duplicate key errors if profile already exists
  INSERT INTO public.profiles (
    id, 
    email, 
    role, 
    full_name, 
    phone,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_role,  -- Guaranteed to be non-NULL and valid
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''), NULL),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), ''), NULL),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;  -- Gracefully handle duplicates

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a comment to document the fix
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile when a new user signs up. Uses COALESCE to guarantee role is never NULL. Handles conflicts gracefully with ON CONFLICT DO NOTHING.';
