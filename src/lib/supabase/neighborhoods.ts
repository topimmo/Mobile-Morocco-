import { supabase } from './client';

export interface Neighborhood {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  is_verified: boolean;
  created_by: string | null;
  created_at: string;
}

export async function getNeighborhoodsByCity(cityId: string): Promise<Neighborhood[]> {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select('*')
    .eq('city_id', cityId)
    .order('name');

  if (error) {
    console.error('Error fetching neighborhoods:', error);
    return [];
  }

  return data || [];
}

export async function searchNeighborhoods(cityId: string, searchTerm: string): Promise<Neighborhood[]> {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select('*')
    .eq('city_id', cityId)
    .ilike('name', `%${searchTerm}%`)
    .order('name')
    .limit(20);

  if (error) {
    console.error('Error searching neighborhoods:', error);
    return [];
  }

  return data || [];
}

export async function getNeighborhoodById(id: string): Promise<Neighborhood | null> {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching neighborhood:', error);
    return null;
  }

  return data;
}

export async function getNeighborhoodBySlug(cityId: string, slug: string): Promise<Neighborhood | null> {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select('*')
    .eq('city_id', cityId)
    .eq('slug', slug)
    .single();

  if (error) {
    return null;
  }

  return data;
}

function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\-]/g, '');
}

export async function addNeighborhood(
  cityId: string,
  name: string,
  userId?: string
): Promise<Neighborhood | null> {
  const sanitizedName = sanitizeName(name);
  const slug = generateSlug(name);

  // Check if already exists
  const existing = await getNeighborhoodBySlug(cityId, slug);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from('neighborhoods')
    .insert({
      city_id: cityId,
      name: sanitizedName,
      slug,
      is_verified: false,
      created_by: userId || null,
    })
    .select()
    .single();

  if (error) {
    // Handle unique constraint violation - fetch existing
    if (error.code === '23505') {
      return getNeighborhoodBySlug(cityId, slug);
    }
    console.error('Error adding neighborhood:', error);
    return null;
  }

  return data;
}

export async function addOrGetNeighborhood(
  cityId: string,
  name: string,
  userId?: string
): Promise<Neighborhood | null> {
  const slug = generateSlug(name);
  
  // Try to find existing
  const existing = await getNeighborhoodBySlug(cityId, slug);
  if (existing) {
    return existing;
  }
  
  // Add new
  return addNeighborhood(cityId, name, userId);
}

// Admin functions
export async function getPendingNeighborhoods(): Promise<Neighborhood[]> {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select('*, city:cities(*)')
    .eq('is_verified', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending neighborhoods:', error);
    return [];
  }

  return data || [];
}

export async function getAllNeighborhoods(): Promise<Neighborhood[]> {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select('*, city:cities(*)')
    .order('is_verified', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all neighborhoods:', error);
    return [];
  }

  return data || [];
}

export async function approveNeighborhood(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('neighborhoods')
    .update({ is_verified: true })
    .eq('id', id);

  if (error) {
    console.error('Error approving neighborhood:', error);
    return false;
  }

  return true;
}

export async function rejectNeighborhood(id: string): Promise<boolean> {
  // For now, we'll just delete rejected neighborhoods
  // In production, you might want to keep them with a 'rejected' status
  const { error } = await supabase
    .from('neighborhoods')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error rejecting neighborhood:', error);
    return false;
  }

  return true;
}

export async function deleteNeighborhood(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('neighborhoods')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting neighborhood:', error);
    return false;
  }

  return true;
}
