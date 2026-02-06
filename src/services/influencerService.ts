import { supabase } from "@/utils/supabaseClient";

// Influencer Service - Types for influencer management
export interface Influencer {
  id: string;
  name: string;
  username: string;
  platform: string;
  followers_count: number;
  engagement_rate: number | null;
  niche: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  location: string | null;
  bio: string | null;
  profile_url: string | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Get all influencers
 */
export const getAllInfluencers = async (): Promise<Influencer[]> => {
  const { data, error } = await supabase.from("influencers").select("*");

  if (error) {
    console.error("Error fetching influencers:", error);
    return [];
  }

  return data || [];
};

/**
 * Get an influencer by ID
 */
export const getInfluencerById = async (
  id: string,
): Promise<Influencer | null> => {
  const { data, error } = await supabase
    .from("influencers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching influencer with ID ${id}:`, error);
    return null;
  }

  return data;
};

/**
 * Get influencers by platform
 */
export const getInfluencersByPlatform = async (
  platform: string,
): Promise<Influencer[]> => {
  const { data, error } = await supabase
    .from("influencers")
    .select("*")
    .eq("platform", platform);

  if (error) {
    console.error(
      `Error fetching influencers for platform ${platform}:`,
      error,
    );
    return [];
  }

  return data || [];
};

/**
 * Create a new influencer
 */
export const createInfluencer = async (
  influencer: Omit<Influencer, "id" | "created_at" | "updated_at">,
): Promise<Influencer | null> => {
  const { data, error } = await supabase
    .from("influencers")
    .insert([influencer])
    .select()
    .single();

  if (error) {
    console.error("Error creating influencer:", error);
    return null;
  }

  return data;
};

/**
 * Update an influencer
 */
export const updateInfluencer = async (
  id: string,
  updates: Partial<Influencer>,
): Promise<Influencer | null> => {
  const { data, error } = await supabase
    .from("influencers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating influencer with ID ${id}:`, error);
    return null;
  }

  return data;
};

/**
 * Delete an influencer
 */
export const deleteInfluencer = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("influencers").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting influencer with ID ${id}:`, error);
    return false;
  }

  return true;
};

/**
 * Add multiple influencers at once
 */
export const addInfluencers = async (
  influencers: Omit<Influencer, "id" | "created_at" | "updated_at">[],
): Promise<number> => {
  const { data, error } = await supabase
    .from("influencers")
    .insert(influencers)
    .select();

  if (error) {
    console.error("Error adding influencers:", error);
    return 0;
  }

  return data?.length || 0;
};

/**
 * Add sample influencers to the database
 */
export const addSampleInfluencers = async (): Promise<number> => {
  return await addInfluencers(sampleInfluencers);
};

/**
 * Get influencer statistics
 */
export const getInfluencerStats = async () => {
  const allInfluencers = await getAllInfluencers();

  const platformCounts: Record<string, number> = {};
  let totalFollowers = 0;
  let verifiedCount = 0;

  allInfluencers.forEach((influencer) => {
    // Count by platform
    const platform = influencer.platform;
    platformCounts[platform] = (platformCounts[platform] || 0) + 1;

    // Count total followers
    totalFollowers += influencer.followers_count;

    // Count verified influencers
    if (influencer.is_verified) {
      verifiedCount++;
    }
  });

  return {
    total: allInfluencers.length,
    byPlatform: platformCounts,
    totalFollowers,
    verifiedCount,
    averageFollowers:
      allInfluencers.length > 0 ? totalFollowers / allInfluencers.length : 0,
  };
};
