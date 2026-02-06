import { supabase } from '@/lib/supabase/client';

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: Record<string, string>;
  businessHours?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const getStoresByOwner = async (ownerId: string) => {
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) {
      console.error('Get stores error:', error);
      return { stores: [], error: error.message };
    }

    const stores = data.map(mapDatabaseStoreToModel);
    return { stores, error: null };
  } catch (error) {
    console.error('Get stores error:', error);
    return { stores: [], error: 'Failed to get stores' };
  }
};

export const getStoreById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get store error:', error);
      return { store: null, error: error.message };
    }

    const store = mapDatabaseStoreToModel(data);
    return { store, error: null };
  } catch (error) {
    console.error('Get store error:', error);
    return { store: null, error: 'Failed to get store' };
  }
};

export const createStore = async (storeData: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { store: null, error: userError?.message || 'User not authenticated' };
    }

    const dbStoreData = {
      owner_id: user.id,
      name: storeData.name,
      description: storeData.description,
      logo_url: storeData.logoUrl,
      address: storeData.address,
      city: storeData.city,
      phone: storeData.phone,
      email: storeData.email,
      website: storeData.website,
      social_media: storeData.socialMedia || {},
      business_hours: storeData.businessHours || {}
    };

    const { data, error } = await supabase
      .from('stores')
      .insert(dbStoreData)
      .select()
      .single();

    if (error) {
      console.error('Create store error:', error);
      return { store: null, error: error.message };
    }

    const store = mapDatabaseStoreToModel(data);
    return { store, error: null };
  } catch (error) {
    console.error('Create store error:', error);
    return { store: null, error: 'Failed to create store' };
  }
};

export const updateStore = async (id: string, storeData: Partial<Store>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data: storeCheck, error: checkError } = await supabase
      .from('stores')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (checkError || !storeCheck) {
      return { success: false, error: 'Store not found' };
    }

    if (storeCheck.owner_id !== user.id) {
      return { success: false, error: 'You do not have permission to update this store' };
    }

    const dbStoreData: any = {};
    if (storeData.name !== undefined) dbStoreData.name = storeData.name;
    if (storeData.description !== undefined) dbStoreData.description = storeData.description;
    if (storeData.logoUrl !== undefined) dbStoreData.logo_url = storeData.logoUrl;
    if (storeData.address !== undefined) dbStoreData.address = storeData.address;
    if (storeData.city !== undefined) dbStoreData.city = storeData.city;
    if (storeData.phone !== undefined) dbStoreData.phone = storeData.phone;
    if (storeData.email !== undefined) dbStoreData.email = storeData.email;
    if (storeData.website !== undefined) dbStoreData.website = storeData.website;
    if (storeData.socialMedia !== undefined) dbStoreData.social_media = storeData.socialMedia;
    if (storeData.businessHours !== undefined) dbStoreData.business_hours = storeData.businessHours;
    dbStoreData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('stores')
      .update(dbStoreData)
      .eq('id', id);

    if (error) {
      console.error('Update store error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Update store error:', error);
    return { success: false, error: 'Failed to update store' };
  }
};

export const deleteStore = async (id: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data: storeCheck, error: checkError } = await supabase
      .from('stores')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (checkError || !storeCheck) {
      return { success: false, error: 'Store not found' };
    }

    if (storeCheck.owner_id !== user.id) {
      return { success: false, error: 'You do not have permission to delete this store' };
    }

    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete store error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete store error:', error);
    return { success: false, error: 'Failed to delete store' };
  }
};

const mapDatabaseStoreToModel = (dbStore: any): Store => {
  return {
    id: dbStore.id,
    ownerId: dbStore.owner_id,
    name: dbStore.name,
    description: dbStore.description,
    logoUrl: dbStore.logo_url,
    address: dbStore.address,
    city: dbStore.city,
    phone: dbStore.phone,
    email: dbStore.email,
    website: dbStore.website,
    socialMedia: dbStore.social_media || {},
    businessHours: dbStore.business_hours || {},
    createdAt: dbStore.created_at,
    updatedAt: dbStore.updated_at
  };
};
