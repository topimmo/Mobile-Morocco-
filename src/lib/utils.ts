import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-friendly slug from text
 * @param text - The text to convert to a slug
 * @param options - Optional configuration
 * @returns A URL-safe slug
 */
export function generateSlug(
  text: string,
  options: { 
    includeTimestamp?: boolean;
    maxLength?: number;
    preserveArabic?: boolean;
  } = {}
): string {
  const { includeTimestamp = false, maxLength = 50, preserveArabic = false } = options;
  
  let slug = text.toLowerCase().trim();
  
  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');
  
  // Remove unwanted characters
  if (preserveArabic) {
    // Keep Arabic characters, alphanumeric, and hyphens
    slug = slug.replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, '');
  } else {
    // Keep only alphanumeric and hyphens
    slug = slug.replace(/[^\w\s-]/g, '').replace(/-+/g, '-');
  }
  
  // Trim to max length
  slug = slug.substring(0, maxLength);
  
  // Remove trailing hyphens
  slug = slug.replace(/-+$/, '');
  
  // Add timestamp for uniqueness if requested
  if (includeTimestamp) {
    const timestamp = Date.now().toString(36);
    slug = `${slug || 'item'}-${timestamp}`;
  }
  
  return slug || 'item';
}

/**
 * Sanitize a name by trimming and normalizing spaces
 */
export function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}
