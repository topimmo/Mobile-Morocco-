import { supabase } from '@/lib/supabase/client';

export interface JobListing {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  location?: string;
  city?: string;
  paymentType: 'fixed' | 'hourly' | 'negotiable';
  paymentAmount?: number;
  requiredSkills?: string[];
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  technicianId: string;
  coverNote?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
}

export const getAllJobListings = async (filters?: { city?: string; status?: string }) => {
  try {
    let query = supabase
      .from('job_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.city) {
      query = query.eq('city', filters.city);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get job listings error:', error);
      return { jobs: [], error: error.message };
    }

    const jobs = data.map(mapDatabaseJobToModel);
    return { jobs, error: null };
  } catch (error) {
    console.error('Get job listings error:', error);
    return { jobs: [], error: 'Failed to get job listings' };
  }
};

export const getJobById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get job error:', error);
      return { job: null, error: error.message };
    }

    const job = mapDatabaseJobToModel(data);
    return { job, error: null };
  } catch (error) {
    console.error('Get job error:', error);
    return { job: null, error: 'Failed to get job' };
  }
};

export const createJobListing = async (jobData: Omit<JobListing, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { job: null, error: userError?.message || 'User not authenticated' };
    }

    const dbJobData = {
      creator_id: user.id,
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      city: jobData.city,
      payment_type: jobData.paymentType,
      payment_amount: jobData.paymentAmount,
      required_skills: jobData.requiredSkills || [],
      status: jobData.status || 'open'
    };

    const { data, error } = await supabase
      .from('job_listings')
      .insert(dbJobData)
      .select()
      .single();

    if (error) {
      console.error('Create job error:', error);
      return { job: null, error: error.message };
    }

    const job = mapDatabaseJobToModel(data);
    return { job, error: null };
  } catch (error) {
    console.error('Create job error:', error);
    return { job: null, error: 'Failed to create job' };
  }
};

export const updateJobListing = async (id: string, jobData: Partial<JobListing>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data: jobCheck, error: checkError } = await supabase
      .from('job_listings')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (checkError || !jobCheck) {
      return { success: false, error: 'Job not found' };
    }

    if (jobCheck.creator_id !== user.id) {
      return { success: false, error: 'You do not have permission to update this job' };
    }

    const dbJobData: Record<string, unknown> = {};
    if (jobData.title !== undefined) dbJobData.title = jobData.title;
    if (jobData.description !== undefined) dbJobData.description = jobData.description;
    if (jobData.location !== undefined) dbJobData.location = jobData.location;
    if (jobData.city !== undefined) dbJobData.city = jobData.city;
    if (jobData.paymentType !== undefined) dbJobData.payment_type = jobData.paymentType;
    if (jobData.paymentAmount !== undefined) dbJobData.payment_amount = jobData.paymentAmount;
    if (jobData.requiredSkills !== undefined) dbJobData.required_skills = jobData.requiredSkills;
    if (jobData.status !== undefined) dbJobData.status = jobData.status;
    dbJobData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('job_listings')
      .update(dbJobData)
      .eq('id', id);

    if (error) {
      console.error('Update job error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Update job error:', error);
    return { success: false, error: 'Failed to update job' };
  }
};

export const deleteJobListing = async (id: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data: jobCheck, error: checkError } = await supabase
      .from('job_listings')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (checkError || !jobCheck) {
      return { success: false, error: 'Job not found' };
    }

    if (jobCheck.creator_id !== user.id) {
      return { success: false, error: 'You do not have permission to delete this job' };
    }

    const { error } = await supabase
      .from('job_listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete job error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete job error:', error);
    return { success: false, error: 'Failed to delete job' };
  }
};

export const getJobApplications = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get job applications error:', error);
      return { applications: [], error: error.message };
    }

    const applications = data.map(mapDatabaseApplicationToModel);
    return { applications, error: null };
  } catch (error) {
    console.error('Get job applications error:', error);
    return { applications: [], error: 'Failed to get job applications' };
  }
};

export const getTechnicianApplications = async (technicianId: string) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('technician_id', technicianId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get technician applications error:', error);
      return { applications: [], error: error.message };
    }

    const applications = data.map(mapDatabaseApplicationToModel);
    return { applications, error: null };
  } catch (error) {
    console.error('Get technician applications error:', error);
    return { applications: [], error: 'Failed to get technician applications' };
  }
};

export const applyToJob = async (applicationData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { application: null, error: userError?.message || 'User not authenticated' };
    }

    const dbApplicationData = {
      job_id: applicationData.jobId,
      technician_id: user.id,
      cover_note: applicationData.coverNote,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('job_applications')
      .insert(dbApplicationData)
      .select()
      .single();

    if (error) {
      console.error('Apply to job error:', error);
      return { application: null, error: error.message };
    }

    const application = mapDatabaseApplicationToModel(data);
    return { application, error: null };
  } catch (error) {
    console.error('Apply to job error:', error);
    return { application: null, error: 'Failed to apply to job' };
  }
};

export const updateJobApplication = async (id: string, status: JobApplication['status']) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const dbApplicationData = {
      status,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('job_applications')
      .update(dbApplicationData)
      .eq('id', id);

    if (error) {
      console.error('Update application error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Update application error:', error);
    return { success: false, error: 'Failed to update application' };
  }
};

const mapDatabaseJobToModel = (dbJob: Record<string, unknown>): JobListing => {
  return {
    id: dbJob.id,
    creatorId: dbJob.creator_id,
    title: dbJob.title,
    description: dbJob.description,
    location: dbJob.location,
    city: dbJob.city,
    paymentType: dbJob.payment_type,
    paymentAmount: dbJob.payment_amount,
    requiredSkills: dbJob.required_skills || [],
    status: dbJob.status,
    createdAt: dbJob.created_at,
    updatedAt: dbJob.updated_at
  };
};

const mapDatabaseApplicationToModel = (dbApplication: Record<string, unknown>): JobApplication => {
  return {
    id: dbApplication.id,
    jobId: dbApplication.job_id,
    technicianId: dbApplication.technician_id,
    coverNote: dbApplication.cover_note,
    status: dbApplication.status,
    createdAt: dbApplication.created_at,
    updatedAt: dbApplication.updated_at
  };
};
