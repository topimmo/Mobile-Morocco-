import { supabase } from "@/utils/supabaseClient";

// Influencer Service - Types for influencer management
export interface Influencer {
  id?: string;
  name: string;
  username: string;
  platform: string;
  followers_count: number;
  engagement_rate?: number;
  niche?: string;
  contact_email?: string;
  contact_phone?: string;
  location?: string;
  bio?: string;
  profile_url?: string;
  is_verified?: boolean;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Sample influencer data
const sampleInfluencers: Influencer[] = [
  {
    name: "Yasmine El Baggari",
    username: "yasmineelbaggari",
    platform: "Instagram",
    followers_count: 25000,
    engagement_rate: 3.5,
    niche: "Travel & Culture",
    location: "Casablanca",
    bio: "Moroccan travel enthusiast and cultural ambassador",
    profile_url: "https://instagram.com/yasmineelbaggari",
    is_verified: true,
  },
  {
    name: "Hamza Filali",
    username: "hamzafilali",
    platform: "YouTube",
    followers_count: 150000,
    engagement_rate: 4.2,
    niche: "Tech Reviews",
    location: "Rabat",
    bio: "Tech reviewer specializing in mobile phones and gadgets",
    profile_url: "https://youtube.com/hamzafilali",
    is_verified: true,
  },
  {
    name: "Salma Rachid",
    username: "salmarachidofficiel",
    platform: "Instagram",
    followers_count: 2100000,
    engagement_rate: 5.1,
    niche: "Music & Lifestyle",
    location: "Casablanca",
    bio: "Moroccan singer and lifestyle influencer",
    profile_url: "https://instagram.com/salmarachidofficiel",
    is_verified: true,
  },
  {
    name: "Soufiane Ababri",
    username: "soufiane_tech",
    platform: "TikTok",
    followers_count: 500000,
    engagement_rate: 7.8,
    niche: "Tech Tips & Mobile Repairs",
    location: "Marrakech",
    bio: "Mobile repair technician sharing tips and tricks",
    profile_url: "https://tiktok.com/@soufiane_tech",
    is_verified: false,
  },
  {
    name: "Leila Hadioui",
    username: "leilahadioui",
    platform: "Instagram",
    followers_count: 1800000,
    engagement_rate: 3.9,
    niche: "Fashion & Modeling",
    location: "Casablanca",
    bio: "Moroccan model, actress and TV presenter",
    profile_url: "https://instagram.com/leilahadioui",
    is_verified: true,
  },
  {
    name: "Youssef El Azouzi",
    username: "youssef_elazouzi",
    platform: "YouTube",
    followers_count: 320000,
    engagement_rate: 6.2,
    niche: "Mobile Phone Reviews",
    location: "Tangier",
    bio: "Detailed mobile phone reviews and comparisons",
    profile_url: "https://youtube.com/youssef_elazouzi",
    is_verified: true,
  },
  {
    name: "Fatima Zahra",
    username: "fati_accessories",
    platform: "TikTok",
    followers_count: 180000,
    engagement_rate: 8.5,
    niche: "Phone Accessories & DIY",
    location: "Fez",
    bio: "Creative phone accessory ideas and DIY customizations",
    profile_url: "https://tiktok.com/@fati_accessories",
    is_verified: false,
  },
  {
    name: "Mehdi Bousaidan",
    username: "mehdibousaidan",
    platform: "Instagram",
    followers_count: 950000,
    engagement_rate: 4.7,
    niche: "Comedy & Lifestyle",
    location: "Casablanca",
    bio: "Comedian and content creator",
    profile_url: "https://instagram.com/mehdibousaidan",
    is_verified: true,
  },
  {
    name: "Asmaa Khamlichi",
    username: "asmaa_tech",
    platform: "YouTube",
    followers_count: 85000,
    engagement_rate: 5.3,
    niche: "Tech Education",
    location: "Agadir",
    bio: "Technology educator focusing on mobile technology",
    profile_url: "https://youtube.com/asmaa_tech",
    is_verified: false,
  },
  {
    name: "Karim Essakalli",
    username: "karim_phones",
    platform: "TikTok",
    followers_count: 420000,
    engagement_rate: 9.1,
    niche: "Phone Unboxing & Reviews",
    location: "Rabat",
    bio: "Quick and entertaining phone unboxing videos",
    profile_url: "https://tiktok.com/@karim_phones",
    is_verified: true,
  },
];

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
