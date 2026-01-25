import { supabase } from './client';

const BUCKET_NAME = 'item-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Compress an image before upload using canvas
 * Returns a Blob ready for upload
 */
async function compressImageForUpload(
  file: File, 
  maxWidth: number = 1200, 
  maxHeight: number = 1200,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      let { width, height } = img;
      
      // Scale down if needed
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Upload an image to Supabase Storage
 * NO base64 fallback - storage only for scalability
 */
export async function uploadImage(
  file: File,
  folder: string = 'items'
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      url: null,
      error: 'Invalid file type. Allowed: JPEG, PNG, WebP'
    };
  }

  try {
    let uploadFile: File | Blob = file;
    
    // Compress if file is larger than 1MB or exceeds max size
    if (file.size > 1024 * 1024) {
      try {
        uploadFile = await compressImageForUpload(file);
      } catch {
        // If compression fails and file is too large, reject
        if (file.size > MAX_FILE_SIZE) {
          return {
            url: null,
            error: 'File size exceeds 5MB limit and compression failed'
          };
        }
        // Otherwise continue with original file
      }
    }

    // Final size check
    if (uploadFile.size > MAX_FILE_SIZE) {
      return {
        url: null,
        error: 'File size exceeds 5MB limit'
      };
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, uploadFile, {
        cacheControl: '31536000', // 1 year cache for immutable images
        upsert: false,
        contentType: 'image/jpeg'
      });

    if (error) {
      console.error('Storage upload error:', error);
      
      // Provide specific error messages based on error type
      let errorMessage = 'Upload failed';
      
      // Check error code or message for specific issues
      // Supabase storage errors have statusCode property
      const statusCode = (error as any).statusCode;
      const message = error.message.toLowerCase();
      
      if (statusCode === 403 || message.includes('policies') || message.includes('policy') || message.includes('permission') || message.includes('denied')) {
        errorMessage = 'Upload permission denied. Please log in to upload images.';
      } else if (statusCode === 413 || message.includes('size') || message.includes('too large') || message.includes('payload')) {
        errorMessage = 'File size exceeds the limit';
      } else if (statusCode === 415 || message.includes('type') || message.includes('mime') || message.includes('format')) {
        errorMessage = 'Invalid file type';
      } else if (message.includes('bucket') || message.includes('not found')) {
        errorMessage = 'Storage configuration error. Please contact support.';
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }
      
      return {
        url: null,
        error: errorMessage
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      error: null
    };
  } catch (err) {
    console.error('Upload error:', err);
    return {
      url: null,
      error: err instanceof Error ? err.message : 'Upload failed'
    };
  }
}

/**
 * Upload multiple images to Supabase Storage
 * Returns only successfully uploaded URLs
 */
export async function uploadImages(
  files: File[],
  folder: string = 'items',
  maxImages: number = 6
): Promise<{ urls: string[]; errors: string[] }> {
  const limitedFiles = files.slice(0, maxImages);
  
  // Upload sequentially to avoid overwhelming the storage service
  const urls: string[] = [];
  const errors: string[] = [];
  
  for (const file of limitedFiles) {
    const result = await uploadImage(file, folder);
    if (result.url) {
      urls.push(result.url);
    }
    if (result.error) {
      errors.push(result.error);
    }
  }

  return { urls, errors };
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Skip if not a valid Supabase storage URL
    if (!url || !url.includes('supabase')) {
      return false;
    }

    // Extract path from URL
    const urlObj = new URL(url);
    const path = urlObj.pathname.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];

    if (!path) {
      console.warn('Could not extract path from URL:', url);
      return false;
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete error:', err);
    return false;
  }
}

/**
 * Delete multiple images from storage
 */
export async function deleteImages(urls: string[]): Promise<number> {
  let deleted = 0;
  for (const url of urls) {
    if (await deleteImage(url)) {
      deleted++;
    }
  }
  return deleted;
}

/**
 * Get optimized image URL with size parameters
 * Uses Supabase image transformation when available
 */
export function getOptimizedImageUrl(url: string, width: number = 400): string {
  if (!url) return '';
  
  // Add Supabase image transformation parameters
  if (url.includes('supabase.co/storage')) {
    // Use Supabase image transformation API
    const transformUrl = url.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    const separator = transformUrl.includes('?') ? '&' : '?';
    return `${transformUrl}${separator}width=${width}&quality=80`;
  }
  
  // For Unsplash images
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=80`;
  }
  
  return url;
}

/**
 * Get thumbnail URL for listing cards
 */
export function getThumbnailUrl(url: string): string {
  return getOptimizedImageUrl(url, 300);
}

/**
 * Get full-size URL for detail pages
 */
export function getFullSizeUrl(url: string): string {
  return getOptimizedImageUrl(url, 1200);
}

/**
 * Validate if URL is a proper storage URL (not base64)
 */
export function isValidStorageUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}
