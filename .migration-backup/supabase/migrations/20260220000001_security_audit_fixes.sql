-- =============================================================================
-- SECURITY AUDIT FIXES
-- Date: 2026-02-20
-- Scope: Row Level Security, storage ownership, PII, privilege escalation
--
-- Findings addressed (by severity):
--
-- CRITICAL
--   C1. 10 tables have NO RLS enabled: messages, favorites, products,
--       subscriptions, reports, job_listings, job_applications,
--       service_requests, technician_services, ads
--   C2. Storage DELETE policy allows ANY authenticated user to delete ANY file
--       (no ownership check)
--   C3. users_update_own_profile allows setting role = NULL, breaking the
--       role check and potentially causing privilege issues downstream
--
-- HIGH
--   H1. store_reviews INSERT allows unauthenticated (anon) submissions
--       (WITH CHECK (true) on a public table)
--   H2. ad_events INSERT allows unauthenticated writes (WITH CHECK (true)),
--       enabling metric manipulation
--   H3. neighborhoods INSERT allows ANY authenticated user to add records;
--       should be admin-only
--   H4. store_reviews.reviewer_phone (PII) is exposed to the public via the
--       "Approved reviews are viewable by everyone" SELECT policy
--
-- MEDIUM
--   M1. otp_requests INSERT allows unauthenticated inserts (WITH CHECK (true))
--       A rate-limit trigger exists but there is no auth-level barrier
--
-- LOW
--   L1. service_role key not present in client code (confirmed: no issue)
--   L2. Admin checks rely on profile-table role column (correct pattern;
--       no issues found with current implementation)
-- =============================================================================


-- =============================================================================
-- C1 — ENABLE RLS ON TABLES THAT WERE MISSING IT
-- =============================================================================

-- messages ────────────────────────────────────────────────────────────────────
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Only participants in a conversation can read their own messages
DROP POLICY IF EXISTS "Participants can read own messages" ON messages;
CREATE POLICY "Participants can read own messages" ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Authenticated users may send messages; sender_id must be their own uid
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;
CREATE POLICY "Authenticated users can send messages" ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Only the receiver can mark a message as read
DROP POLICY IF EXISTS "Receiver can mark messages as read" ON messages;
CREATE POLICY "Receiver can mark messages as read" ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Only the sender can delete (retract) a message
DROP POLICY IF EXISTS "Sender can delete own messages" ON messages;
CREATE POLICY "Sender can delete own messages" ON messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Admin can manage all messages (moderation)
DROP POLICY IF EXISTS "Admin can manage all messages" ON messages;
CREATE POLICY "Admin can manage all messages" ON messages
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- favorites ───────────────────────────────────────────────────────────────────
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can only see their own favourites
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can add to their own favourites list
DROP POLICY IF EXISTS "Users can add own favorites" ON favorites;
CREATE POLICY "Users can add own favorites" ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can remove from their own favourites list
DROP POLICY IF EXISTS "Users can remove own favorites" ON favorites;
CREATE POLICY "Users can remove own favorites" ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- subscriptions ───────────────────────────────────────────────────────────────
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription; admins can read all
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Subscription records are created by the system / admin only
DROP POLICY IF EXISTS "Admin can manage subscriptions" ON subscriptions;
CREATE POLICY "Admin can manage subscriptions" ON subscriptions
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- products ────────────────────────────────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Available products are publicly visible
DROP POLICY IF EXISTS "Available products are public" ON products;
CREATE POLICY "Available products are public" ON products
  FOR SELECT
  USING (is_available = true);

-- Sellers can also view their own unavailable products
DROP POLICY IF EXISTS "Sellers can view own products" ON products;
CREATE POLICY "Sellers can view own products" ON products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

-- Sellers can create their own products
DROP POLICY IF EXISTS "Sellers can create own products" ON products;
CREATE POLICY "Sellers can create own products" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own products
DROP POLICY IF EXISTS "Sellers can update own products" ON products;
CREATE POLICY "Sellers can update own products" ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Sellers can delete their own products
DROP POLICY IF EXISTS "Sellers can delete own products" ON products;
CREATE POLICY "Sellers can delete own products" ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Admin can manage all products
DROP POLICY IF EXISTS "Admin can manage all products" ON products;
CREATE POLICY "Admin can manage all products" ON products
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- reports ─────────────────────────────────────────────────────────────────────
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Reporters can view their own submitted reports; admins see all
DROP POLICY IF EXISTS "Reporters can view own reports" ON reports;
CREATE POLICY "Reporters can view own reports" ON reports
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = reporter_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Any authenticated user can file a report; their uid must be the reporter_id
DROP POLICY IF EXISTS "Authenticated users can file reports" ON reports;
CREATE POLICY "Authenticated users can file reports" ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Only admins can update (review/resolve) or delete reports
DROP POLICY IF EXISTS "Admin can manage reports" ON reports;
CREATE POLICY "Admin can manage reports" ON reports
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- job_listings ────────────────────────────────────────────────────────────────
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

-- Open job listings are publicly visible; creators can see their own regardless of status
DROP POLICY IF EXISTS "Open job listings are public" ON job_listings;
CREATE POLICY "Open job listings are public" ON job_listings
  FOR SELECT
  USING (status = 'open');

DROP POLICY IF EXISTS "Creators can view own job listings" ON job_listings;
CREATE POLICY "Creators can view own job listings" ON job_listings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

-- Authenticated users can create job listings
DROP POLICY IF EXISTS "Authenticated users can create job listings" ON job_listings;
CREATE POLICY "Authenticated users can create job listings" ON job_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own job listings
DROP POLICY IF EXISTS "Creators can update own job listings" ON job_listings;
CREATE POLICY "Creators can update own job listings" ON job_listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Creators can delete their own job listings; admin can delete any
DROP POLICY IF EXISTS "Creators can delete own job listings" ON job_listings;
CREATE POLICY "Creators can delete own job listings" ON job_listings
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = creator_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- job_applications ────────────────────────────────────────────────────────────
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Applicants can see their own applications; job creators can see applications
-- for their listings; admins can see all
DROP POLICY IF EXISTS "Participants can view job applications" ON job_applications;
CREATE POLICY "Participants can view job applications" ON job_applications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = technician_id
    OR EXISTS (
      SELECT 1 FROM job_listings
      WHERE job_listings.id = job_applications.job_id
        AND job_listings.creator_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Authenticated users can apply for a job; technician_id must be their own uid
DROP POLICY IF EXISTS "Authenticated users can apply for jobs" ON job_applications;
CREATE POLICY "Authenticated users can apply for jobs" ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = technician_id);

-- Job creator can accept/reject; applicant can withdraw (status = 'withdrawn')
DROP POLICY IF EXISTS "Participants can update job applications" ON job_applications;
CREATE POLICY "Participants can update job applications" ON job_applications
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = technician_id
    OR EXISTS (
      SELECT 1 FROM job_listings
      WHERE job_listings.id = job_applications.job_id
        AND job_listings.creator_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Applicant can delete (withdraw) their own application
DROP POLICY IF EXISTS "Applicants can withdraw applications" ON job_applications;
CREATE POLICY "Applicants can withdraw applications" ON job_applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = technician_id);


-- service_requests ────────────────────────────────────────────────────────────
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Customer and assigned technician can view the request
DROP POLICY IF EXISTS "Participants can view service requests" ON service_requests;
CREATE POLICY "Participants can view service requests" ON service_requests
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = customer_id
    OR auth.uid() = technician_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Customers create their own service requests
DROP POLICY IF EXISTS "Customers can create service requests" ON service_requests;
CREATE POLICY "Customers can create service requests" ON service_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- Technician can update status; customer can cancel; admin manages all
DROP POLICY IF EXISTS "Participants can update service requests" ON service_requests;
CREATE POLICY "Participants can update service requests" ON service_requests
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = customer_id
    OR auth.uid() = technician_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Customer can cancel (delete) their own request before it is accepted
DROP POLICY IF EXISTS "Customers can cancel service requests" ON service_requests;
CREATE POLICY "Customers can cancel service requests" ON service_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = customer_id);


-- technician_services ─────────────────────────────────────────────────────────
ALTER TABLE technician_services ENABLE ROW LEVEL SECURITY;

-- All services are publicly discoverable
DROP POLICY IF EXISTS "Technician services are public" ON technician_services;
CREATE POLICY "Technician services are public" ON technician_services
  FOR SELECT
  USING (true);

-- Technicians manage their own services
DROP POLICY IF EXISTS "Technicians can manage own services" ON technician_services;
CREATE POLICY "Technicians can manage own services" ON technician_services
  FOR ALL
  TO authenticated
  USING (auth.uid() = technician_id)
  WITH CHECK (auth.uid() = technician_id);

-- Admin can manage all services
DROP POLICY IF EXISTS "Admin can manage technician services" ON technician_services;
CREATE POLICY "Admin can manage technician services" ON technician_services
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ads ─────────────────────────────────────────────────────────────────────────
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Active ads are publicly visible
DROP POLICY IF EXISTS "Active ads are public" ON ads;
CREATE POLICY "Active ads are public" ON ads
  FOR SELECT
  USING (is_active = true AND start_date <= NOW() AND end_date >= NOW());

-- Only admin can create/update/delete ad records
DROP POLICY IF EXISTS "Admin can manage ads" ON ads;
CREATE POLICY "Admin can manage ads" ON ads
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- =============================================================================
-- C2 — STORAGE: RESTRICT DELETE TO FILE OWNER
-- The upload code now writes files to paths prefixed with the uploader's uid
-- (e.g. "<uid>/items/<timestamp>-<random>.jpg").  This policy enforces that
-- only the owner of a file (whose uid is the first folder segment) can delete
-- it.  Admins retain full delete access.
-- NOTE: Run this alongside the storage.ts change that adds uid to the path.
-- =============================================================================

DROP POLICY IF EXISTS "Authenticated users can delete item images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

CREATE POLICY "Owners can delete own item images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'item-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admin can delete any item image"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'item-images'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Tighten INSERT to also enforce the uid-prefixed path (defence-in-depth)
DROP POLICY IF EXISTS "Authenticated users can upload item images" ON storage.objects;

CREATE POLICY "Authenticated users can upload item images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'item-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );


-- =============================================================================
-- C3 — PREVENT ROLE ESCALATION VIA users_update_own_profile
-- The original WITH CHECK contained "role IS NULL OR role = <current_role>".
-- The "role IS NULL" branch allowed a user to clear their own role to NULL,
-- which could break downstream role checks.  Remove that branch so users can
-- never change or clear their own role via a self-update.
-- =============================================================================

DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Role must remain exactly as it is stored; only admins may change roles
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );


-- =============================================================================
-- H1 — store_reviews INSERT: REQUIRE AUTHENTICATION
-- Previously WITH CHECK (true) allowed anonymous users to flood the review
-- queue.  Now requires a logged-in user.  Reviews still start as 'pending'
-- so admin approval remains the gate for public visibility.
-- =============================================================================

DROP POLICY IF EXISTS "Anyone can submit a review" ON store_reviews;

CREATE POLICY "Authenticated users can submit reviews" ON store_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);


-- =============================================================================
-- H2 — ad_events INSERT: REQUIRE AUTHENTICATION
-- Prevents unauthenticated metric inflation (click/impression farming).
-- =============================================================================

DROP POLICY IF EXISTS "Anyone can create ad events" ON ad_events;

CREATE POLICY "Authenticated users can create ad events" ON ad_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');


-- =============================================================================
-- H3 — neighborhoods INSERT: RESTRICT TO ADMIN ONLY
-- Previously any logged-in user could insert neighbourhood records, allowing
-- data pollution.
-- =============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert neighborhoods" ON neighborhoods;

CREATE POLICY "Admin can insert neighborhoods" ON neighborhoods
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Also add admin UPDATE/DELETE policies (were missing entirely)
DROP POLICY IF EXISTS "Admin can manage neighborhoods" ON neighborhoods;
CREATE POLICY "Admin can manage neighborhoods" ON neighborhoods
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- =============================================================================
-- H4 — PROTECT reviewer_phone PII FROM PUBLIC ACCESS
-- The "Approved reviews are viewable by everyone" SELECT policy returns all
-- columns, including reviewer_phone which is personally identifiable.
-- Revoke read access to that column from the anon and authenticated roles so
-- that only the service_role (used by admin Edge Functions) can access it.
-- Existing SELECT * queries from non-admin clients will receive NULL for this
-- column; to read it they must use an explicit column list via service_role.
-- =============================================================================

REVOKE SELECT (reviewer_phone) ON public.store_reviews FROM anon, authenticated;


-- =============================================================================
-- M1 — otp_requests INSERT: REQUIRE AUTHENTICATION
-- The DB-level rate-limit trigger already limits abuse, but adding an auth
-- requirement removes the entire unauthenticated surface for this endpoint.
-- =============================================================================

DROP POLICY IF EXISTS "Anyone can create OTP requests" ON otp_requests;

CREATE POLICY "Authenticated users can create OTP requests" ON otp_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);


-- =============================================================================
-- VERIFICATION
-- Confirm RLS is now enabled on every user-data table.
-- =============================================================================

DO $$
DECLARE
  rec RECORD;
  missing TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOR rec IN
    SELECT unnest(ARRAY[
      'profiles','listings','listing_images','repair_shops','shop_images',
      'reviews','ad_campaigns','ad_bookings','ad_events','adsense_units',
      'categories','cities','otp_requests','neighborhoods',
      'stores','items','repair_services','store_images','item_images','store_reviews',
      'messages','favorites','subscriptions','products','reports',
      'job_listings','job_applications','service_requests','technician_services','ads'
    ]) AS tablename
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = rec.tablename
        AND c.relrowsecurity = true
    ) THEN
      missing := array_append(missing, rec.tablename);
    END IF;
  END LOOP;

  IF array_length(missing, 1) > 0 THEN
    RAISE WARNING 'Tables still missing RLS: %', array_to_string(missing, ', ');
  ELSE
    RAISE NOTICE 'SUCCESS: All 30 user-data tables have RLS enabled.';
  END IF;
END $$;
