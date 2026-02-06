/**
 * @deprecated This service layer is being consolidated with @/lib/supabase/repairShops
 * For shop management, use @/lib/supabase/repairShops
 * This file remains for service request workflows during migration.
 */

import { supabase } from '@/lib/supabase/client';

export interface TechnicianService {
  id: string;
  technicianId: string;
  serviceName: string;
  description?: string;
  price?: number;
  priceType: 'fixed' | 'hourly' | 'quote';
  estimatedTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  description?: string;
  deviceDetails?: Record<string, any>;
  location?: string;
  scheduledDate?: string;
  completedDate?: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

export const getTechnicianServices = async (technicianId: string) => {
  try {
    const { data, error } = await supabase
      .from('technician_services')
      .select('*')
      .eq('technician_id', technicianId);

    if (error) {
      console.error('Get technician services error:', error);
      return { services: [], error: error.message };
    }

    const services = data.map(mapDatabaseServiceToModel);
    return { services, error: null };
  } catch (error) {
    console.error('Get technician services error:', error);
    return { services: [], error: 'Failed to get technician services' };
  }
};

export const createTechnicianService = async (serviceData: Omit<TechnicianService, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { service: null, error: userError?.message || 'User not authenticated' };
    }

    const dbServiceData = {
      technician_id: user.id,
      service_name: serviceData.serviceName,
      description: serviceData.description,
      price: serviceData.price,
      price_type: serviceData.priceType,
      estimated_time: serviceData.estimatedTime
    };

    const { data, error } = await supabase
      .from('technician_services')
      .insert(dbServiceData)
      .select()
      .single();

    if (error) {
      console.error('Create service error:', error);
      return { service: null, error: error.message };
    }

    const service = mapDatabaseServiceToModel(data);
    return { service, error: null };
  } catch (error) {
    console.error('Create service error:', error);
    return { service: null, error: 'Failed to create service' };
  }
};

export const updateTechnicianService = async (id: string, serviceData: Partial<TechnicianService>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data: serviceCheck, error: checkError } = await supabase
      .from('technician_services')
      .select('technician_id')
      .eq('id', id)
      .single();

    if (checkError || !serviceCheck) {
      return { success: false, error: 'Service not found' };
    }

    if (serviceCheck.technician_id !== user.id) {
      return { success: false, error: 'You do not have permission to update this service' };
    }

    const dbServiceData: any = {};
    if (serviceData.serviceName !== undefined) dbServiceData.service_name = serviceData.serviceName;
    if (serviceData.description !== undefined) dbServiceData.description = serviceData.description;
    if (serviceData.price !== undefined) dbServiceData.price = serviceData.price;
    if (serviceData.priceType !== undefined) dbServiceData.price_type = serviceData.priceType;
    if (serviceData.estimatedTime !== undefined) dbServiceData.estimated_time = serviceData.estimatedTime;
    dbServiceData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('technician_services')
      .update(dbServiceData)
      .eq('id', id);

    if (error) {
      console.error('Update service error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Update service error:', error);
    return { success: false, error: 'Failed to update service' };
  }
};

export const deleteTechnicianService = async (id: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data: serviceCheck, error: checkError } = await supabase
      .from('technician_services')
      .select('technician_id')
      .eq('id', id)
      .single();

    if (checkError || !serviceCheck) {
      return { success: false, error: 'Service not found' };
    }

    if (serviceCheck.technician_id !== user.id) {
      return { success: false, error: 'You do not have permission to delete this service' };
    }

    const { error } = await supabase
      .from('technician_services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete service error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete service error:', error);
    return { success: false, error: 'Failed to delete service' };
  }
};

export const getServiceRequests = async (userId: string, userType: 'customer' | 'technician') => {
  try {
    const field = userType === 'customer' ? 'customer_id' : 'technician_id';
    
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq(field, userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get service requests error:', error);
      return { requests: [], error: error.message };
    }

    const requests = data.map(mapDatabaseRequestToModel);
    return { requests, error: null };
  } catch (error) {
    console.error('Get service requests error:', error);
    return { requests: [], error: 'Failed to get service requests' };
  }
};

export const createServiceRequest = async (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { request: null, error: userError?.message || 'User not authenticated' };
    }

    const dbRequestData = {
      customer_id: user.id,
      technician_id: requestData.technicianId,
      service_id: requestData.serviceId,
      status: requestData.status || 'pending',
      description: requestData.description,
      device_details: requestData.deviceDetails || {},
      location: requestData.location,
      scheduled_date: requestData.scheduledDate,
      price: requestData.price
    };

    const { data, error } = await supabase
      .from('service_requests')
      .insert(dbRequestData)
      .select()
      .single();

    if (error) {
      console.error('Create service request error:', error);
      return { request: null, error: error.message };
    }

    const request = mapDatabaseRequestToModel(data);
    return { request, error: null };
  } catch (error) {
    console.error('Create service request error:', error);
    return { request: null, error: 'Failed to create service request' };
  }
};

export const updateServiceRequest = async (id: string, requestData: Partial<ServiceRequest>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }

    const { data: requestCheck, error: checkError } = await supabase
      .from('service_requests')
      .select('customer_id, technician_id')
      .eq('id', id)
      .single();

    if (checkError || !requestCheck) {
      return { success: false, error: 'Service request not found' };
    }

    if (requestCheck.customer_id !== user.id && requestCheck.technician_id !== user.id) {
      return { success: false, error: 'You do not have permission to update this service request' };
    }

    const dbRequestData: any = {};
    if (requestData.status !== undefined) dbRequestData.status = requestData.status;
    if (requestData.description !== undefined) dbRequestData.description = requestData.description;
    if (requestData.deviceDetails !== undefined) dbRequestData.device_details = requestData.deviceDetails;
    if (requestData.location !== undefined) dbRequestData.location = requestData.location;
    if (requestData.scheduledDate !== undefined) dbRequestData.scheduled_date = requestData.scheduledDate;
    if (requestData.completedDate !== undefined) dbRequestData.completed_date = requestData.completedDate;
    if (requestData.price !== undefined) dbRequestData.price = requestData.price;
    dbRequestData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('service_requests')
      .update(dbRequestData)
      .eq('id', id);

    if (error) {
      console.error('Update service request error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Update service request error:', error);
    return { success: false, error: 'Failed to update service request' };
  }
};

const mapDatabaseServiceToModel = (dbService: any): TechnicianService => {
  return {
    id: dbService.id,
    technicianId: dbService.technician_id,
    serviceName: dbService.service_name,
    description: dbService.description,
    price: dbService.price,
    priceType: dbService.price_type,
    estimatedTime: dbService.estimated_time,
    createdAt: dbService.created_at,
    updatedAt: dbService.updated_at
  };
};

const mapDatabaseRequestToModel = (dbRequest: any): ServiceRequest => {
  return {
    id: dbRequest.id,
    customerId: dbRequest.customer_id,
    technicianId: dbRequest.technician_id,
    serviceId: dbRequest.service_id,
    status: dbRequest.status,
    description: dbRequest.description,
    deviceDetails: dbRequest.device_details || {},
    location: dbRequest.location,
    scheduledDate: dbRequest.scheduled_date,
    completedDate: dbRequest.completed_date,
    price: dbRequest.price,
    createdAt: dbRequest.created_at,
    updatedAt: dbRequest.updated_at
  };
};
