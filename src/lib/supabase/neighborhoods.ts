import { supabase } from './client';
import { generateSlug, sanitizeName } from '@/lib/utils';

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

export async function addNeighborhood(
  cityId: string,
  name: string,
  userId?: string
): Promise<Neighborhood | null> {
  const sanitizedName = sanitizeName(name);
  const slug = generateSlug(name, { preserveArabic: true });

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
  const slug = generateSlug(name, { preserveArabic: true });
  
  // Try to find existing
  const existing = await getNeighborhoodBySlug(cityId, slug);
  if (existing) {
    return existing;
  }
  
  // Add new
  return addNeighborhood(cityId, name, userId);
}
