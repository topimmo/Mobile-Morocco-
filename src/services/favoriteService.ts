import { supabase } from '@/utils/supabaseClient';

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export const getUserFavorites = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get favorites error:', error);
      return { favorites: [], error: error.message };
    }

    return { favorites: data || [], error: null };
  } catch (error) {
    console.error('Get favorites error:', error);
    return { favorites: [], error: 'Failed to get favorites' };
  }
};

export const addToFavorites = async (productId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, product_id: productId })
      .select()
      .single();

    if (error) {
      console.error('Add to favorites error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, favorite: data, error: null };
  } catch (error) {
    console.error('Add to favorites error:', error);
    return { success: false, error: 'Failed to add to favorites' };
  }
};

export const removeFromFavorites = async (productId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Remove from favorites error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Remove from favorites error:', error);
    return { success: false, error: 'Failed to remove from favorites' };
  }
};

export const isFavorite = async (productId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { isFavorite: false, error: null };
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Check favorite error:', error);
      return { isFavorite: false, error: error.message };
    }

    return { isFavorite: !!data, error: null };
  } catch (error) {
    console.error('Check favorite error:', error);
    return { isFavorite: false, error: 'Failed to check favorite status' };
  }
};
