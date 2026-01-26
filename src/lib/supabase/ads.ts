import { supabase } from './client';

export type PageKey = 'home' | 'categories' | 'listings' | 'listing_details' | 'repair_shops' | 'repair_shop_details' | 'advertise' | 'services' | 'stores' | 'store_details' | 'phones' | 'spare_parts' | 'equipment' | 'item_details' | 'category' | 'city' | 'computers' | 'computer-parts' | 'computer-repair';
export type SlotType = 'top' | 'middle' | 'bottom' | 'sidebar';

export interface AdCampaign {
  id: string;
  advertiser_id: string;
  title: string;
  banner_desktop_url: string;
  banner_mobile_url: string;
  target_url: string;
  status: 'pending' | 'active' | 'paused' | 'completed' | 'rejected';
}

export interface AdBooking {
  id: string;
  campaign_id: string;
  page: PageKey;
  slot: SlotType;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
}

export async function getActiveBanner(page: PageKey, slot: SlotType) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: booking, error } = await supabase
    .from('ad_bookings')
    .select(`
      *,
      campaign:ad_campaigns(*)
    `)
    .eq('page', page)
    .eq('slot', slot)
    .eq('status', 'active')
    .lte('start_date', today)
    .gte('end_date', today)
    .single();

  if (error || !booking) {
    return null;
  }

  // Extract campaign from the response using type assertion for join query
  const bookingWithCampaign = booking as typeof booking & { campaign?: AdCampaign };
  return {
    booking,
    campaign: bookingWithCampaign.campaign,
  };
}

export async function getAdsenseUnit(page: PageKey, slot: SlotType) {
  const { data, error } = await supabase
    .from('adsense_units')
    .select('*')
    .eq('page', page)
    .eq('slot', slot)
    .eq('is_active', true)
    .single();

  return { data, error };
}

export async function logAdImpression(
  campaignId: string,
  bookingId: string,
  page: PageKey,
  slot: SlotType
) {
  const { error } = await supabase.from('ad_events').insert({
    campaign_id: campaignId,
    booking_id: bookingId,
    event_type: 'impression',
    page,
    slot,
  });

  return { error };
}

export async function logAdClick(
  campaignId: string,
  bookingId: string,
  page: PageKey,
  slot: SlotType
) {
  const { error } = await supabase.from('ad_events').insert({
    campaign_id: campaignId,
    booking_id: bookingId,
    event_type: 'click',
    page,
    slot,
  });

  return { error };
}
