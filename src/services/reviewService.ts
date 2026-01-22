import { supabase } from '@/utils/supabaseClient';

export interface Review {
  id: string;
  reviewerId: string;
  subjectType: 'product' | 'technician' | 'store';
  subjectId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export const getReviewsBySubject = async (subjectType: string, subjectId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('subject_type', subjectType)
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get reviews error:', error);
      return { reviews: [], error: error.message };
    }

    const reviews = data.map(mapDatabaseReviewToModel);
    return { reviews, error: null };
  } catch (error) {
    console.error('Get reviews error:', error);
    return { reviews: [], error: 'Failed to get reviews' };
  }
};

export const createReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { review: null, error: userError?.message || 'User not authenticated' };
    }

    const dbReviewData = {
      reviewer_id: user.id,
      subject_type: reviewData.subjectType,
      subject_id: reviewData.subjectId,
      rating: reviewData.rating,
      comment: reviewData.comment
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert(dbReviewData)
      .select()
      .single();

    if (error) {
      console.error('Create review error:', error);
      return { review: null, error: error.message };
    }

    const review = mapDatabaseReviewToModel(data);
    return { review, error: null };
  } catch (error) {
    console.error('Create review error:', error);
    return { review: null, error: 'Failed to create review' };
  }
};

export const updateReview = async (id: string, reviewData: Partial<Review>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data: reviewCheck, error: checkError } = await supabase
      .from('reviews')
      .select('reviewer_id')
      .eq('id', id)
      .single();

    if (checkError || !reviewCheck) {
      return { success: false, error: 'Review not found' };
    }

    if (reviewCheck.reviewer_id !== user.id) {
      return { success: false, error: 'You do not have permission to update this review' };
    }

    const dbReviewData: any = {};
    if (reviewData.rating !== undefined) dbReviewData.rating = reviewData.rating;
    if (reviewData.comment !== undefined) dbReviewData.comment = reviewData.comment;
    dbReviewData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('reviews')
      .update(dbReviewData)
      .eq('id', id);

    if (error) {
      console.error('Update review error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Update review error:', error);
    return { success: false, error: 'Failed to update review' };
  }
};

export const deleteReview = async (id: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data: reviewCheck, error: checkError } = await supabase
      .from('reviews')
      .select('reviewer_id')
      .eq('id', id)
      .single();

    if (checkError || !reviewCheck) {
      return { success: false, error: 'Review not found' };
    }

    if (reviewCheck.reviewer_id !== user.id) {
      return { success: false, error: 'You do not have permission to delete this review' };
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete review error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete review error:', error);
    return { success: false, error: 'Failed to delete review' };
  }
};

const mapDatabaseReviewToModel = (dbReview: any): Review => {
  return {
    id: dbReview.id,
    reviewerId: dbReview.reviewer_id,
    subjectType: dbReview.subject_type,
    subjectId: dbReview.subject_id,
    rating: dbReview.rating,
    comment: dbReview.comment,
    createdAt: dbReview.created_at,
    updatedAt: dbReview.updated_at
  };
};
