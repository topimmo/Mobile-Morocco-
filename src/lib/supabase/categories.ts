import { supabase } from './client';
import { apiCache, CACHE_KEYS } from '@/lib/cache';

export interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  icon: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}

// Categories rarely change, cache for 10 minutes
const CATEGORIES_CACHE_TTL = 10 * 60 * 1000;

export async function getCategories(): Promise<Category[]> {
  // Check cache first
  const cacheKey = `${CACHE_KEYS.CATEGORIES}:all`;
  const cached = apiCache.get<Category[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching categories:', error);
      return getDefaultCategories();
    }

    const result = data && data.length > 0 ? data : getDefaultCategories();
    
    // Cache the result
    apiCache.set(cacheKey, result, CATEGORIES_CACHE_TTL);
    
    return result;
  } catch (err) {
    console.error('Error fetching categories:', err);
    return getDefaultCategories();
  }
}

// Fallback categories when database is unavailable
function getDefaultCategories(): Category[] {
  return [
    { id: '1', name_fr: 'Téléphones', name_ar: 'الهواتف', slug: 'telephones', icon: 'smartphone', parent_id: null, sort_order: 1, is_active: true },
    { id: '2', name_fr: 'Pièces Détachées', name_ar: 'قطع الغيار', slug: 'pieces-detachees', icon: 'settings', parent_id: null, sort_order: 2, is_active: true },
    { id: '3', name_fr: 'Équipements', name_ar: 'معدات الإصلاح', slug: 'equipement-reparation', icon: 'wrench', parent_id: null, sort_order: 3, is_active: true },
    { id: '4', name_fr: 'Accessoires', name_ar: 'الإكسسوارات', slug: 'accessoires', icon: 'headphones', parent_id: null, sort_order: 4, is_active: true },
  ];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

export async function getParentCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching parent categories:', error);
    return [];
  }

  return data || [];
}

export async function getChildCategories(parentId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching child categories:', error);
    return [];
  }

  return data || [];
}

export function getCategoryName(category: Category, language: 'ar' | 'fr' = 'ar'): string {
  return language === 'ar' ? category.name_ar : category.name_fr;
}
