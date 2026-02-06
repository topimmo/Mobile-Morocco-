import { supabase } from '@/lib/supabase/client';
import { shouldUseMockData } from '@/lib/supabase/client';
import { mockProducts } from './mockDataService';

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: 'new' | 'used' | 'refurbished';
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  images: string[];
  specifications: Record<string, any>;
  location?: string;
  city?: string;
  isAvailable: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  category?: string;
  subcategory?: string;
  brand?: string;
  condition?: 'new' | 'used' | 'refurbished';
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  searchQuery?: string;
}

// Get all products with optional filtering
export const getProducts = async (filters?: ProductFilter) => {
  try {
    const useMockData = await shouldUseMockData();
    
    if (useMockData) {
      // Return mock data with filtering
      let filteredProducts = [...mockProducts];
      
      if (filters) {
        if (filters.category) {
          filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        }
        if (filters.subcategory) {
          filteredProducts = filteredProducts.filter(p => p.subcategory === filters.subcategory);
        }
        if (filters.brand) {
          filteredProducts = filteredProducts.filter(p => p.brand === filters.brand);
        }
        if (filters.condition) {
          filteredProducts = filteredProducts.filter(p => p.condition === filters.condition);
        }
        if (filters.minPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
        }
        if (filters.city) {
          filteredProducts = filteredProducts.filter(p => p.city === filters.city);
        }
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query) ||
            p.brand?.toLowerCase().includes(query) ||
            p.model?.toLowerCase().includes(query)
          );
        }
      }
      
      return { products: filteredProducts, error: null };
    }
    
    // Real data from Supabase
    let query = supabase.from('products').select('*');
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.subcategory) {
        query = query.eq('subcategory', filters.subcategory);
      }
      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%,model.ilike.%${filters.searchQuery}%`);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Get products error:', error);
      return { products: [], error: error.message };
    }
    
    // Map database fields to our model
    const products = data.map(mapDatabaseProductToModel);
    
    return { products, error: null };
  } catch (error) {
    console.error('Get products error:', error);
    return { products: [], error: 'Failed to get products' };
  }
};

// Get product by ID
export const getProductById = async (id: string) => {
  try {
    const useMockData = await shouldUseMockData();
    
    if (useMockData) {
      const product = mockProducts.find(p => p.id === id);
      return { product: product || null, error: product ? null : 'Product not found' };
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Get product error:', error);
      return { product: null, error: error.message };
    }
    
    if (!data) {
      return { product: null, error: 'Product not found' };
    }
    
    // Increment view count atomically using RPC
    await supabase.rpc('increment_product_view', { p_product_id: id });
    
    // Map database fields to our model
    const product = mapDatabaseProductToModel(data);
    
    return { product, error: null };
  } catch (error) {
    console.error('Get product error:', error);
    return { product: null, error: 'Failed to get product' };
  }
};

// Create new product
export const createProduct = async (productData: Omit<Product, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { product: null, error: userError?.message || 'User not authenticated' };
    }
    
    // Map our model fields to database fields
    const dbProductData = {
      seller_id: user.id,
      title: productData.title,
      description: productData.description,
      price: productData.price,
      currency: productData.currency || 'MAD',
      condition: productData.condition,
      category: productData.category,
      subcategory: productData.subcategory,
      brand: productData.brand,
      model: productData.model,
      images: productData.images,
      specifications: productData.specifications,
      location: productData.location,
      city: productData.city,
      is_available: productData.isAvailable
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(dbProductData)
      .select()
      .single();
    
    if (error) {
      console.error('Create product error:', error);
      return { product: null, error: error.message };
    }
    
    // Map database fields to our model
    const product = mapDatabaseProductToModel(data);
    
    return { product, error: null };
  } catch (error) {
    console.error('Create product error:', error);
    return { product: null, error: 'Failed to create product' };
  }
};

// Update product
export const updateProduct = async (id: string, productData: Partial<Product>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }
    
    // Check if user owns the product
    const { data: productCheck, error: checkError } = await supabase
      .from('products' as any)
      .select('seller_id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error('Product check error:', checkError);
      return { success: false, error: checkError.message };
    }
    
    if (!productCheck) {
      return { success: false, error: 'Product not found' };
    }
    
    if ((productCheck as any).seller_id !== user.id) {
      return { success: false, error: 'You do not have permission to update this product' };
    }
    
    // Map our model fields to database fields
    const dbProductData: any = {};
    
    if (productData.title !== undefined) dbProductData.title = productData.title;
    if (productData.description !== undefined) dbProductData.description = productData.description;
    if (productData.price !== undefined) dbProductData.price = productData.price;
    if (productData.currency !== undefined) dbProductData.currency = productData.currency;
    if (productData.condition !== undefined) dbProductData.condition = productData.condition;
    if (productData.category !== undefined) dbProductData.category = productData.category;
    if (productData.subcategory !== undefined) dbProductData.subcategory = productData.subcategory;
    if (productData.brand !== undefined) dbProductData.brand = productData.brand;
    if (productData.model !== undefined) dbProductData.model = productData.model;
    if (productData.images !== undefined) dbProductData.images = productData.images;
    if (productData.specifications !== undefined) dbProductData.specifications = productData.specifications;
    if (productData.location !== undefined) dbProductData.location = productData.location;
    if (productData.city !== undefined) dbProductData.city = productData.city;
    if (productData.isAvailable !== undefined) dbProductData.is_available = productData.isAvailable;
    
    // Add updated_at timestamp
    dbProductData.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('products')
      .update(dbProductData)
      .eq('id', id);
    
    if (error) {
      console.error('Update product error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: 'Failed to update product' };
  }
};

// Delete product
export const deleteProduct = async (id: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { success: false, error: userError?.message || 'User not authenticated' };
    }
    
    // Check if user owns the product
    const { data: productCheck, error: checkError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error('Product check error:', checkError);
      return { success: false, error: checkError.message };
    }
    
    if (!productCheck) {
      return { success: false, error: 'Product not found' };
    }
    
    if (productCheck.seller_id !== user.id) {
      return { success: false, error: 'You do not have permission to delete this product' };
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Delete product error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: 'Failed to delete product' };
  }
};

// Get products by seller ID
export const getProductsBySeller = async (sellerId: string) => {
  try {
    const useMockData = await shouldUseMockData();
    
    if (useMockData) {
      const sellerProducts = mockProducts.filter(p => p.sellerId === sellerId);
      return { products: sellerProducts, error: null };
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId);
    
    if (error) {
      console.error('Get seller products error:', error);
      return { products: [], error: error.message };
    }
    
    // Map database fields to our model
    const products = data.map(mapDatabaseProductToModel);
    
    return { products, error: null };
  } catch (error) {
    console.error('Get seller products error:', error);
    return { products: [], error: 'Failed to get seller products' };
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 6) => {
  try {
    const useMockData = await shouldUseMockData();
    
    if (useMockData) {
      // Sort by view count and take the top ones
      const featured = [...mockProducts]
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, limit);
      return { products: featured, error: null };
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('view_count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Get featured products error:', error);
      return { products: [], error: error.message };
    }
    
    // Map database fields to our model
    const products = data.map(mapDatabaseProductToModel);
    
    return { products, error: null };
  } catch (error) {
    console.error('Get featured products error:', error);
    return { products: [], error: 'Failed to get featured products' };
  }
};

// Helper function to map database fields to our model
const mapDatabaseProductToModel = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    sellerId: dbProduct.seller_id,
    title: dbProduct.title,
    description: dbProduct.description,
    price: dbProduct.price,
    currency: dbProduct.currency,
    condition: dbProduct.condition,
    category: dbProduct.category,
    subcategory: dbProduct.subcategory,
    brand: dbProduct.brand,
    model: dbProduct.model,
    images: dbProduct.images || [],
    specifications: dbProduct.specifications || {},
    location: dbProduct.location,
    city: dbProduct.city,
    isAvailable: dbProduct.is_available,
    viewCount: dbProduct.view_count,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at
  };
};