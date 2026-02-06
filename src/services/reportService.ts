import { supabase } from '@/lib/supabase/client';

export interface Report {
  id: string;
  reporterId: string;
  reportedType: 'product' | 'user' | 'review' | 'store';
  reportedId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const createReport = async (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'adminNotes'>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { report: null, error: userError?.message || 'User not authenticated' };
    }

    const dbReportData = {
      reporter_id: user.id,
      reported_type: reportData.reportedType,
      reported_id: reportData.reportedId,
      reason: reportData.reason,
      description: reportData.description,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('reports')
      .insert(dbReportData)
      .select()
      .single();

    if (error) {
      console.error('Create report error:', error);
      return { report: null, error: error.message };
    }

    const report = mapDatabaseReportToModel(data);
    return { report, error: null };
  } catch (error) {
    console.error('Create report error:', error);
    return { report: null, error: 'Failed to create report' };
  }
};

export const getAllReports = async (filters?: { status?: string; reportedType?: string }) => {
  try {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.reportedType) {
      query = query.eq('reported_type', filters.reportedType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get reports error:', error);
      return { reports: [], error: error.message };
    }

    const reports = data.map(mapDatabaseReportToModel);
    return { reports, error: null };
  } catch (error) {
    console.error('Get reports error:', error);
    return { reports: [], error: 'Failed to get reports' };
  }
};

export const getReportById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get report error:', error);
      return { report: null, error: error.message };
    }

    const report = mapDatabaseReportToModel(data);
    return { report, error: null };
  } catch (error) {
    console.error('Get report error:', error);
    return { report: null, error: 'Failed to get report' };
  }
};

export const updateReportStatus = async (id: string, status: Report['status'], adminNotes?: string) => {
  try {
    const dbUpdateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (adminNotes !== undefined) {
      dbUpdateData.admin_notes = adminNotes;
    }

    const { error } = await supabase
      .from('reports')
      .update(dbUpdateData)
      .eq('id', id);

    if (error) {
      console.error('Update report error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Update report error:', error);
    return { success: false, error: 'Failed to update report' };
  }
};

export const deleteReport = async (id: string) => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete report error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete report error:', error);
    return { success: false, error: 'Failed to delete report' };
  }
};

const mapDatabaseReportToModel = (dbReport: any): Report => {
  return {
    id: dbReport.id,
    reporterId: dbReport.reporter_id,
    reportedType: dbReport.reported_type,
    reportedId: dbReport.reported_id,
    reason: dbReport.reason,
    description: dbReport.description,
    status: dbReport.status,
    adminNotes: dbReport.admin_notes,
    createdAt: dbReport.created_at,
    updatedAt: dbReport.updated_at
  };
};
