CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  placement TEXT NOT NULL DEFAULT 'header',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ads_placement ON public.ads(placement);
CREATE INDEX IF NOT EXISTS idx_ads_active ON public.ads(is_active);
CREATE INDEX IF NOT EXISTS idx_ads_dates ON public.ads(start_date, end_date);

INSERT INTO public.ads (id, advertiser_id, title, image_url, link_url, placement, start_date, end_date, is_active, impressions, clicks)
VALUES 
  (
    gen_random_uuid(),
    NULL,
    'iPhone 15 Pro - Meilleurs Prix',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    'https://example.com/iphone15',
    'header',
    NOW() - INTERVAL '7 days',
    NOW() + INTERVAL '30 days',
    true,
    15420,
    487
  ),
  (
    gen_random_uuid(),
    NULL,
    'Service de Réparation Mobile',
    'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=800&q=80',
    'https://example.com/repair',
    'sidebar',
    NOW() - INTERVAL '14 days',
    NOW() + INTERVAL '15 days',
    true,
    8930,
    312
  ),
  (
    gen_random_uuid(),
    NULL,
    'Accessoires Samsung Galaxy',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
    'https://example.com/samsung',
    'footer',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '25 days',
    true,
    5200,
    156
  );
