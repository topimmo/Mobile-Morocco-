import { supabase } from './client';

export interface City {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  region_fr: string | null;
  region_ar: string | null;
  is_active: boolean;
  sort_order: number;
}

// Simple in-memory cache for cities (rarely changes)
const citiesCache: { data: City[] | null; timestamp: number } = { data: null, timestamp: 0 };
const CITIES_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function getCities(language: 'ar' | 'fr' = 'ar'): Promise<City[]> {
  // Check cache first - cities rarely change
  const now = Date.now();
  if (citiesCache.data && (now - citiesCache.timestamp) < CITIES_CACHE_TTL) {
    return citiesCache.data;
  }
  
  try {
    const orderColumn = language === 'ar' ? 'name_ar' : 'name_fr';
    
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .order(orderColumn);

    if (error) {
      console.error('Error fetching cities:', error);
      return getDefaultCities();
    }

    const result = data && data.length > 0 ? data : getDefaultCities();
    
    // Cache the result
    citiesCache.data = result;
    citiesCache.timestamp = now;
    
    return result;
  } catch (err) {
    console.error('Error fetching cities:', err);
    return getDefaultCities();
  }
}

// Default cities when database is unavailable
function getDefaultCities(): City[] {
  return [
    { id: '1', name_fr: 'Casablanca', name_ar: 'الدار البيضاء', slug: 'casablanca', region_fr: 'Casablanca-Settat', region_ar: 'الدار البيضاء-سطات', is_active: true, sort_order: 1 },
    { id: '2', name_fr: 'Rabat', name_ar: 'الرباط', slug: 'rabat', region_fr: 'Rabat-Salé-Kénitra', region_ar: 'الرباط-سلا-القنيطرة', is_active: true, sort_order: 2 },
    { id: '3', name_fr: 'Marrakech', name_ar: 'مراكش', slug: 'marrakech', region_fr: 'Marrakech-Safi', region_ar: 'مراكش-آسفي', is_active: true, sort_order: 3 },
    { id: '4', name_fr: 'Fès', name_ar: 'فاس', slug: 'fes', region_fr: 'Fès-Meknès', region_ar: 'فاس-مكناس', is_active: true, sort_order: 4 },
    { id: '5', name_fr: 'Tanger', name_ar: 'طنجة', slug: 'tanger', region_fr: 'Tanger-Tétouan-Al Hoceïma', region_ar: 'طنجة-تطوان-الحسيمة', is_active: true, sort_order: 5 },
    { id: '6', name_fr: 'Agadir', name_ar: 'أكادير', slug: 'agadir', region_fr: 'Souss-Massa', region_ar: 'سوس-ماسة', is_active: true, sort_order: 6 },
    { id: '7', name_fr: 'Oujda', name_ar: 'وجدة', slug: 'oujda', region_fr: 'Oriental', region_ar: 'الشرق', is_active: true, sort_order: 7 },
    { id: '8', name_fr: 'Meknès', name_ar: 'مكناس', slug: 'meknes', region_fr: 'Fès-Meknès', region_ar: 'فاس-مكناس', is_active: true, sort_order: 8 },
  ];
}

export async function getCitiesByRegion(language: 'ar' | 'fr' = 'ar'): Promise<Record<string, City[]>> {
  const cities = await getCities(language);
  const regionKey = language === 'ar' ? 'region_ar' : 'region_fr';
  
  return cities.reduce((acc, city) => {
    const region = city[regionKey] || 'Other';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(city);
    return acc;
  }, {} as Record<string, City[]>);
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching city:', error);
    return null;
  }

  return data;
}

export async function getCityById(id: string): Promise<City | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching city:', error);
    return null;
  }

  return data;
}

export function getCityName(city: City, language: 'ar' | 'fr' = 'ar'): string {
  return language === 'ar' ? city.name_ar : city.name_fr;
}

export function getRegionName(city: City, language: 'ar' | 'fr' = 'ar'): string {
  return language === 'ar' ? city.region_ar || '' : city.region_fr || '';
}
